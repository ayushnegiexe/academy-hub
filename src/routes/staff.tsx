import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/subpabase";
import { toast } from "sonner";

type TrialRequest = {
  id: string;
  player_name: string;
  date_of_birth: string;
  age_group: string;
  guardian_name: string;
  guardian_email: string;
  guardian_phone: string;
  preferred_trial_date: string | null;
  notes: string;
  status: "pending" | "approved" | "rejected" | "enrolled";
  staff_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
};

type StudentEnrollment = {
  id: string;
  player_name: string;
  date_of_birth: string;
  age_group: "U10" | "U12" | "U15" | "U18";
  guardian_name: string;
  guardian_email: string;
  guardian_phone: string;
  start_date: string;
  status: "active" | "inactive";
};

type StudentEnrollmentEdit = Omit<StudentEnrollment, "id">;

type PendingConfirmation =
  | {
      kind: "student";
      enrollment: StudentEnrollment;
      changes: Partial<StudentEnrollmentEdit>;
    }
  | {
      kind: "trial-approval";
      request: TrialRequest;
    }
  | {
      kind: "fee";
      enrollment: StudentEnrollment;
      status: "paid" | "unpaid";
      billingMonth: string;
    }
  | {
      kind: "trial-review";
      request: TrialRequest;
      status: "rejected";
    }
  | {
      kind: "enrollment";
      request: TrialRequest;
      startDate: string;
    };

type MonthlyFeeStatus = {
  status: "paid" | "unpaid";
  paid_at: string | null;
};

type AcademyChange = {
  id: string;
  enrollment_id: string;
  player_name: string;
  entity_type: "student" | "monthly_fee";
  action: "updated" | "created";
  old_values: Record<string, string | null>;
  new_values: Record<string, string | null>;
  changed_by_email: string | null;
  changed_at: string;
};

type TrialStatusFilter = "all" | TrialRequest["status"];

type AdminUser = {
  id: string;
  email: string;
};

const studentFieldLabels: Record<keyof StudentEnrollmentEdit, string> = {
  player_name: "Player name",
  date_of_birth: "Date of birth",
  age_group: "Age group",
  guardian_name: "Guardian name",
  guardian_email: "Guardian email",
  guardian_phone: "Guardian phone",
  start_date: "Enrollment date",
  status: "Enrollment status",
};

const auditFieldLabels: Record<string, string> = {
  ...studentFieldLabels,
  billing_month: "Billing month",
  paid_at: "Paid at",
};

const trialStatusOptions: { value: TrialStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Declined" },
  { value: "enrolled", label: "Enrolled" },
];

const academyAddress = "Badowala, Premnagar Rd, Arcadia Grant, Dehradun, Uttarakhand 248007";

function getApprovalSmsMessage(request: TrialRequest) {
  return (
    `Hello ${request.guardian_name}, ${request.player_name}'s ${request.age_group} trial request ` +
    `has been approved. Please visit Devsheel Football Academy at ${academyAddress}. ` +
    "For any further queries, contact us at +91 821 824 5579. Thank you."
  );
}

function getApprovalSmsLink(request: TrialRequest) {
  const phone = request.guardian_phone
    .trim()
    .replace(/[^\d+]/g, "")
    .replace(/^00/, "+");
  if (!/^\+?\d{7,15}$/.test(phone)) return null;

  return `sms:${phone}&body=${encodeURIComponent(getApprovalSmsMessage(request))}`;
}

function showTrialReviewToast(
  status: "approved" | "rejected",
  playerName: string,
  smsStatus: "opened" | "link-available" | "unavailable",
) {
  const isApproved = status === "approved";
  toast.custom(
    (id) => (
      <div
        role="status"
        className="flex w-[min(26rem,calc(100vw-2rem))] items-start gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-xl"
      >
        <div
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isApproved ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
          }`}
        >
          {isApproved ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            {isApproved ? "Trial request approved" : "Trial request declined"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isApproved
              ? smsStatus === "opened"
                ? `${playerName}'s approval text is open in Messages. Review it and tap Send.`
                : smsStatus === "link-available"
                  ? `${playerName}'s request is approved. Use the approval-text link on the request to open Messages.`
                  : `${playerName}'s request is approved, but the guardian number could not be opened in Messages.`
              : `${playerName}'s request has been updated. The guardian has not been messaged.`}
          </p>
        </div>
        <button
          type="button"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Dismiss notification"
          onClick={() => toast.dismiss(id)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    { duration: 6000 },
  );
}

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — Devsheel Football Academy" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requests, setRequests] = useState<TrialRequest[]>([]);
  const [trialStatusFilter, setTrialStatusFilter] = useState<TrialStatusFilter>("pending");
  const [visibleTrialCount, setVisibleTrialCount] = useState(10);
  const [students, setStudents] = useState<StudentEnrollment[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [feeMonth, setFeeMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [monthlyFees, setMonthlyFees] = useState<Record<string, MonthlyFeeStatus>>({});
  const [areMonthlyFeesLoading, setAreMonthlyFeesLoading] = useState(false);
  const [monthlyFeeLoadFailed, setMonthlyFeeLoadFailed] = useState(false);
  const [changeHistory, setChangeHistory] = useState<AcademyChange[]>([]);
  const [isChangeHistoryLoading, setIsChangeHistoryLoading] = useState(false);
  const [changeHistoryLoadFailed, setChangeHistoryLoadFailed] = useState(false);
  const [studentEdits, setStudentEdits] = useState<Record<string, StudentEnrollmentEdit>>({});
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);
  const [startDates, setStartDates] = useState<Record<string, string>>({});
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!supabase) {
      setIsChecking(false);
      return;
    }

    let active = true;
    async function checkSession() {
      const { data, error } = await supabase!.auth.getSession();
      if (!active) return;
      if (error) {
        console.error("Could not check admin session:", error);
        toast.error("Could not check your sign-in. Please refresh and try again.");
      }
      const sessionUser = data.session?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email ?? "" } : null);
      setIsChecking(false);
    }

    void checkSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? "" } : null);
      setIsAdmin(false);
      setRequests([]);
      setStudents([]);
      setMonthlyFees({});
      setStudentEdits({});
      setChangeHistory([]);
      setPendingConfirmation(null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !user) return;
    let active = true;

    async function loadDashboard() {
      setIsLoading(true);
      const { data: membership, error: membershipError } = await supabase!
        .from("academy_staff")
        .select("user_id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (!active) return;
      if (membershipError) {
        console.error("Could not verify admin access:", membershipError);
        toast.error("Could not verify admin access. Please try again.");
        setIsLoading(false);
        return;
      }
      if (!membership) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      setIsAdmin(true);
      const [trialResult, studentResult] = await Promise.all([
        supabase!
          .from("trial_requests")
          .select(
            "id, player_name, date_of_birth, age_group, guardian_name, guardian_email, guardian_phone, preferred_trial_date, notes, status, staff_notes, submitted_at, reviewed_at",
          )
          .order("submitted_at", { ascending: false }),
        supabase!
          .from("player_enrollments")
          .select(
            "id, player_name, date_of_birth, age_group, guardian_name, guardian_email, guardian_phone, start_date, status",
          )
          .order("enrolled_at", { ascending: false }),
      ]);

      if (!active) return;
      if (trialResult.error) {
        console.error("Could not load trial requests:", trialResult.error);
        toast.error("Could not load trial requests. Please try again.");
      } else {
        setRequests((trialResult.data ?? []) as TrialRequest[]);
      }
      if (studentResult.error) {
        console.error("Could not load enrolled students:", studentResult.error);
        toast.error("Could not load existing students. Please check admin access policies.");
      } else {
        setStudents((studentResult.data ?? []) as StudentEnrollment[]);
      }
      setIsLoading(false);
    }

    void loadDashboard();
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!supabase || !user || !isAdmin) return;
    let active = true;

    async function loadMonthlyFees() {
      setAreMonthlyFeesLoading(true);
      setMonthlyFeeLoadFailed(false);
      const { data, error } = await supabase!
        .from("player_monthly_fees")
        .select("enrollment_id, status, paid_at")
        .eq("billing_month", `${feeMonth}-01`);

      if (!active) return;
      if (error) {
        console.error("Could not load monthly fee statuses:", error);
        toast.error(
          "Could not load fee statuses. Please check the fee migration and admin access.",
        );
        setMonthlyFees({});
        setMonthlyFeeLoadFailed(true);
      } else {
        setMonthlyFees(
          Object.fromEntries(
            (data ?? []).map((fee) => [
              fee.enrollment_id,
              { status: fee.status, paid_at: fee.paid_at },
            ]),
          ),
        );
        setMonthlyFeeLoadFailed(false);
      }
      setAreMonthlyFeesLoading(false);
    }

    void loadMonthlyFees();
    return () => {
      active = false;
    };
  }, [user, isAdmin, feeMonth]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Admin sign-in failed:", error);
      toast.error("Could not sign in", { description: error.message });
    }
    setIsSubmitting(false);
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Admin sign-out failed:", error);
      toast.error("Could not sign out. Please try again.");
    }
  }

  async function updateRequest(
    request: TrialRequest,
    status: "approved" | "rejected",
    smsWindow?: Window | null,
  ) {
    if (!supabase) return;
    setIsSubmitting(true);
    const { error } = await supabase.rpc("review_trial_request", {
      p_trial_request_id: request.id,
      p_status: status,
      p_staff_notes: adminNotes[request.id]?.trim() || null,
    });

    if (error) {
      smsWindow?.close();
      console.error("Could not update trial request:", error);
      toast.error("Could not update request. Please refresh and try again.");
    } else {
      setPendingConfirmation(null);
      if (status === "approved") {
        await refreshRequests();
        const smsLink = getApprovalSmsLink(request);
        if (smsWindow && smsLink) {
          smsWindow.location.href = smsLink;
          showTrialReviewToast("approved", request.player_name, "opened");
        } else if (smsLink) {
          showTrialReviewToast("approved", request.player_name, "link-available");
        } else {
          showTrialReviewToast("approved", request.player_name, "unavailable");
        }
      } else {
        showTrialReviewToast("rejected", request.player_name, "unavailable");
        await refreshRequests();
      }
    }
    setIsSubmitting(false);
  }

  async function enrollPlayer(request: TrialRequest, startDate: string) {
    if (!supabase) return;
    setIsSubmitting(true);
    const { error } = await supabase.rpc("enroll_approved_trial", {
      p_trial_request_id: request.id,
      p_start_date: startDate,
    });
    if (error) {
      console.error("Could not enroll player:", error);
      toast.error("Could not enroll player", { description: error.message });
    } else {
      toast.success(`${request.player_name} enrolled in ${request.age_group}`);
      setPendingConfirmation(null);
      await Promise.all([refreshRequests(), refreshStudents(), refreshChangeHistory()]);
    }
    setIsSubmitting(false);
  }

  const refreshRequests = useCallback(async () => {
    if (!supabase) return false;
    const { data, error } = await supabase
      .from("trial_requests")
      .select(
        "id, player_name, date_of_birth, age_group, guardian_name, guardian_email, guardian_phone, preferred_trial_date, notes, status, staff_notes, submitted_at, reviewed_at",
      )
      .order("submitted_at", { ascending: false });
    if (error) {
      console.error("Could not refresh trial requests:", error);
      toast.error("Could not refresh requests.");
      return false;
    } else {
      setRequests((data ?? []) as TrialRequest[]);
      return true;
    }
  }, []);

  const refreshStudents = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("player_enrollments")
      .select(
        "id, player_name, date_of_birth, age_group, guardian_name, guardian_email, guardian_phone, start_date, status",
      )
      .order("enrolled_at", { ascending: false });
    if (error) {
      console.error("Could not refresh enrolled students:", error);
      toast.error("Could not refresh existing students.");
    } else {
      setStudents((data ?? []) as StudentEnrollment[]);
    }
  }, []);

  const refreshChangeHistory = useCallback(async () => {
    if (!supabase) return;
    setIsChangeHistoryLoading(true);
    const { data, error } = await supabase
      .from("academy_change_log")
      .select(
        "id, enrollment_id, player_name, entity_type, action, old_values, new_values, changed_by_email, changed_at",
      )
      .order("changed_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Could not load academy change history:", error);
      toast.error("Could not load change history. Please check the audit history migration.");
      setChangeHistory([]);
      setChangeHistoryLoadFailed(true);
    } else {
      setChangeHistory((data ?? []) as AcademyChange[]);
      setChangeHistoryLoadFailed(false);
    }
    setIsChangeHistoryLoading(false);
  }, []);

  useEffect(() => {
    if (!user || !isAdmin) return;
    void refreshChangeHistory();
  }, [user, isAdmin, refreshChangeHistory]);

  function setStudentField<K extends keyof StudentEnrollmentEdit>(
    enrollment: StudentEnrollment,
    field: K,
    value: StudentEnrollmentEdit[K],
  ) {
    setStudentEdits((current) => ({
      ...current,
      [enrollment.id]: {
        ...(current[enrollment.id] ?? {
          player_name: enrollment.player_name,
          date_of_birth: enrollment.date_of_birth,
          age_group: enrollment.age_group,
          guardian_name: enrollment.guardian_name,
          guardian_email: enrollment.guardian_email,
          guardian_phone: enrollment.guardian_phone,
          start_date: enrollment.start_date,
          status: enrollment.status,
        }),
        [field]: value,
      },
    }));
  }

  function openStudentEditor(student: StudentEnrollment) {
    setStudentEdits((current) => ({
      ...current,
      [student.id]: {
        player_name: student.player_name,
        date_of_birth: student.date_of_birth,
        age_group: student.age_group,
        guardian_name: student.guardian_name,
        guardian_email: student.guardian_email,
        guardian_phone: student.guardian_phone,
        start_date: student.start_date,
        status: student.status,
      },
    }));
    setEditingStudentId(student.id);
  }

  function discardStudentEdit(studentId: string) {
    setStudentEdits((current) => {
      const next = { ...current };
      delete next[studentId];
      return next;
    });
    setEditingStudentId(null);
  }

  function reviewStudentChanges(enrollment: StudentEnrollment, form: HTMLFormElement) {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const edit = studentEdits[enrollment.id];
    if (!edit) return;
    const changes: Partial<StudentEnrollmentEdit> = {};
    for (const field of Object.keys(edit) as (keyof StudentEnrollmentEdit)[]) {
      if (edit[field] !== enrollment[field]) {
        Object.assign(changes, { [field]: edit[field] });
      }
    }
    if (Object.keys(changes).length === 0) {
      toast.info("No student details have changed.");
      return;
    }
    setPendingConfirmation({ kind: "student", enrollment, changes });
  }

  async function updateStudent(
    enrollment: StudentEnrollment,
    changes: Partial<StudentEnrollmentEdit>,
  ) {
    if (!supabase) return;
    setIsSubmitting(true);
    const { error } = await supabase
      .from("player_enrollments")
      .update(changes)
      .eq("id", enrollment.id);
    if (error) {
      console.error("Could not update enrolled student:", error);
      toast.error("Could not save student changes. Please try again.");
    } else {
      toast.success("Student details updated");
      setStudentEdits((current) => {
        const next = { ...current };
        delete next[enrollment.id];
        return next;
      });
      setEditingStudentId(null);
      setPendingConfirmation(null);
      await Promise.all([refreshStudents(), refreshChangeHistory()]);
    }
    setIsSubmitting(false);
  }

  async function updateMonthlyFee(
    enrollment: StudentEnrollment,
    status: "paid" | "unpaid",
    billingMonth: string,
  ) {
    if (!supabase) return;
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("player_monthly_fees")
      .upsert(
        {
          enrollment_id: enrollment.id,
          billing_month: `${billingMonth}-01`,
          status,
          paid_at: status === "paid" ? new Date().toISOString() : null,
        },
        { onConflict: "enrollment_id,billing_month" },
      )
      .select("status, paid_at")
      .single();

    if (error) {
      console.error("Could not update monthly fee status:", error);
      toast.error("Could not update fee status. Please try again.");
    } else {
      setMonthlyFees((current) => ({
        ...current,
        [enrollment.id]: { status: data.status, paid_at: data.paid_at },
      }));
      toast.success(
        status === "paid"
          ? `${enrollment.player_name}'s fee marked paid`
          : `${enrollment.player_name}'s fee marked unpaid`,
      );
      setPendingConfirmation(null);
      await refreshChangeHistory();
    }
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (!supabase || !user || !isAdmin) return;
    const client = supabase;

    const channel = client
      .channel("staff-trial-request-inserts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "trial_requests" },
        () => {
          void refreshRequests();
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("Live trial request subscription failed:", status);
          toast.error("Live trial updates are unavailable. Refresh to check for new requests.");
        }
      });

    return () => {
      void client.removeChannel(channel);
    };
  }, [user, isAdmin, refreshRequests]);

  const filteredStudents = students
    .filter((student) =>
      student.player_name.toLocaleLowerCase().includes(studentSearch.trim().toLocaleLowerCase()),
    )
    .sort((a, b) => a.player_name.localeCompare(b.player_name, undefined, { sensitivity: "base" }));
  const activeStudents = students.filter((student) => student.status === "active");
  const trialCounts = requests.reduce<Record<TrialStatusFilter, number>>(
    (counts, request) => {
      counts.all += 1;
      counts[request.status] += 1;
      return counts;
    },
    { all: 0, pending: 0, approved: 0, rejected: 0, enrolled: 0 },
  );
  const filteredTrialRequests = requests.filter(
    (request) => trialStatusFilter === "all" || request.status === trialStatusFilter,
  );
  const visibleTrialRequests = filteredTrialRequests.slice(0, visibleTrialCount);
  const paidFeeCount = Object.values(monthlyFees).filter((fee) => fee.status === "paid").length;
  const unpaidFeeCount = Math.max(0, students.length - paidFeeCount);

  if (!supabase) {
    return (
      <DashboardMessage message="Supabase is not configured. Set the project URL and publishable key to enable admin access." />
    );
  }

  if (isChecking) {
    return <DashboardMessage message="Checking admin sign-in..." />;
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 md:px-6">
        <Card>
          <CardContent className="p-6 md:p-8">
            <h1 className="font-display text-3xl uppercase">Admin sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with your academy admin account.
            </p>
            <form onSubmit={signIn} className="mt-6 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="username"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <h1 className="font-display text-4xl uppercase">Admin dashboard</h1>
        </div>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>

      {!isLoading && isAdmin && (
        <nav
          aria-label="Admin dashboard sections"
          className="sticky top-24 z-40 -mx-4 mb-6 flex gap-2 border-y bg-background/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6"
        >
          <a
            href="#trial-requests"
            className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent"
          >
            Trial requests
          </a>
          <a
            href="#existing-students"
            className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent"
          >
            Existing students & fees
          </a>
          <a
            href="#change-history"
            className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent"
          >
            Change history
          </a>
        </nav>
      )}

      {!isLoading && isAdmin && (
        <h2 id="trial-requests" className="mb-5 scroll-mt-36 font-display text-3xl uppercase">
          Trial requests
        </h2>
      )}
      {!isLoading && isAdmin && (
        <div className="mb-5 flex flex-wrap gap-2" aria-label="Filter trial requests by status">
          {trialStatusOptions.map(({ value, label }) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={trialStatusFilter === value ? "default" : "outline"}
              aria-pressed={trialStatusFilter === value}
              onClick={() => {
                setTrialStatusFilter(value);
                setVisibleTrialCount(10);
              }}
            >
              {label} ({trialCounts[value]})
            </Button>
          ))}
        </div>
      )}
      {isLoading ? (
        <p className="text-muted-foreground">Loading requests...</p>
      ) : !isAdmin ? (
        <Card>
          <CardContent className="p-6">
            This account is signed in but is not registered as an academy admin.
          </CardContent>
        </Card>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-6">No trial requests yet.</CardContent>
        </Card>
      ) : filteredTrialRequests.length === 0 ? (
        <Card>
          <CardContent className="p-6">No {trialStatusFilter} trial requests.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-5">
          {visibleTrialRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:p-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-2xl uppercase">{request.player_name}</h2>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
                      {request.age_group} · {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Born {request.date_of_birth} ·{" "}
                    {request.status === "approved" || request.status === "enrolled" ? (
                      <>
                        Approved{" "}
                        {request.reviewed_at
                          ? new Date(request.reviewed_at).toLocaleString()
                          : "time unavailable"}
                      </>
                    ) : (
                      <>Submitted {new Date(request.submitted_at).toLocaleDateString()}</>
                    )}
                  </p>
                  <p className="text-sm">
                    Guardian: {request.guardian_name} ·{" "}
                    <a className="underline" href={`mailto:${request.guardian_email}`}>
                      {request.guardian_email}
                    </a>{" "}
                    · {request.guardian_phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Preferred trial: {request.preferred_trial_date || "No date selected"}
                  </p>
                  {(request.status === "approved" || request.status === "enrolled") &&
                    getApprovalSmsLink(request) && (
                      <a
                        className="inline-flex w-fit items-center rounded-md border px-3 py-2 text-sm font-semibold text-primary underline"
                        href={getApprovalSmsLink(request) ?? undefined}
                      >
                        Open approval text in Messages
                      </a>
                    )}
                  {request.notes && <p className="whitespace-pre-wrap text-sm">{request.notes}</p>}
                  {request.staff_notes && (
                    <p className="text-sm text-muted-foreground">
                      Admin note: {request.staff_notes}
                    </p>
                  )}
                </div>

                {request.status === "pending" && (
                  <div className="grid content-start gap-3 md:w-72">
                    <Textarea
                      rows={2}
                      placeholder="Admin note (optional)"
                      value={adminNotes[request.id] ?? ""}
                      onChange={(event) =>
                        setAdminNotes((current) => ({
                          ...current,
                          [request.id]: event.target.value,
                        }))
                      }
                      disabled={isSubmitting}
                    />
                    <div className="flex gap-2">
                      <Button
                        disabled={isSubmitting}
                        onClick={() => setPendingConfirmation({ kind: "trial-approval", request })}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() =>
                          setPendingConfirmation({
                            kind: "trial-review",
                            request,
                            status: "rejected",
                          })
                        }
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                )}

                {request.status === "approved" && (
                  <div className="grid content-start gap-3 md:w-72">
                    <Label htmlFor={`start-${request.id}`}>Enrollment start date</Label>
                    <Input
                      id={`start-${request.id}`}
                      type="date"
                      value={startDates[request.id] ?? ""}
                      onChange={(event) =>
                        setStartDates((current) => ({
                          ...current,
                          [request.id]: event.target.value,
                        }))
                      }
                      disabled={isSubmitting}
                    />
                    <Button
                      disabled={isSubmitting}
                      onClick={() => {
                        const startDate = startDates[request.id];
                        if (!startDate) {
                          toast.error("Choose an enrollment start date first.");
                          return;
                        }
                        setPendingConfirmation({ kind: "enrollment", request, startDate });
                      }}
                    >
                      Enroll player
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {visibleTrialRequests.length < filteredTrialRequests.length && (
            <Button
              type="button"
              variant="outline"
              className="justify-self-center"
              onClick={() => setVisibleTrialCount((count) => count + 10)}
            >
              Show 10 more ({filteredTrialRequests.length - visibleTrialRequests.length} remaining)
            </Button>
          )}
        </div>
      )}

      {!isLoading && isAdmin && (
        <section id="existing-students" className="mt-12 scroll-mt-36">
          <h2 className="mb-5 font-display text-3xl uppercase">Existing students & monthly fees</h2>
          <div
            aria-label="Active student counts"
            className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-muted-foreground">Total active</p>
                <p className="mt-1 font-display text-3xl">{activeStudents.length}</p>
              </CardContent>
            </Card>
            {(["U10", "U12", "U15", "U18"] as const).map((ageGroup) => (
              <Card key={ageGroup}>
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-muted-foreground">{ageGroup}</p>
                  <p className="mt-1 font-display text-3xl">
                    {activeStudents.filter((student) => student.age_group === ageGroup).length}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="student-search">Search students by name</Label>
              <Input
                id="student-search"
                type="search"
                placeholder="Enter a player name"
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fee-month">Fee month</Label>
              <Input
                id="fee-month"
                type="month"
                value={feeMonth}
                onChange={(event) => {
                  if (event.target.value) setFeeMonth(event.target.value);
                }}
              />
            </div>
          </div>
          <div
            aria-label={`Monthly fee overview for ${feeMonth}`}
            className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {[
              {
                label: "Enrolled students",
                value: students.length,
              },
              {
                label: "Paid",
                value: monthlyFeeLoadFailed
                  ? "Unavailable"
                  : areMonthlyFeesLoading
                    ? "..."
                    : paidFeeCount,
              },
              {
                label: "Unpaid",
                value: monthlyFeeLoadFailed
                  ? "Unavailable"
                  : areMonthlyFeesLoading
                    ? "..."
                    : unpaidFeeCount,
              },
            ].map(({ label, value }) => (
              <Card key={label}>
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-muted-foreground">
                    {label} ·{" "}
                    {new Date(`${feeMonth}-01T00:00:00`).toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-1 font-display text-3xl">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {students.length === 0 ? (
            <Card>
              <CardContent className="p-6">No enrolled students yet.</CardContent>
            </Card>
          ) : filteredStudents.length === 0 ? (
            <Card>
              <CardContent className="p-6">No students match that name.</CardContent>
            </Card>
          ) : (
            <div className="grid gap-8">
              {(["active", "inactive"] as const).map((status) => {
                const sectionStudents = filteredStudents.filter(
                  (student) => student.status === status,
                );
                if (sectionStudents.length === 0) return null;

                return (
                  <section key={status} className="grid gap-4">
                    <h3 className="font-display text-2xl uppercase">
                      {status === "active" ? "Active students" : "Inactive students"}
                    </h3>
                    <div className="grid gap-5">
                      {sectionStudents.map((student) => {
                        const fee = monthlyFees[student.id];
                        const isFeePaid = fee?.status === "paid";
                        return (
                          <Card key={student.id}>
                            <CardContent className="p-5 md:p-6">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-display text-2xl uppercase">
                                    {student.player_name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {student.age_group} · Born{" "}
                                    {new Date(
                                      `${student.date_of_birth}T00:00:00`,
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Enrolled{" "}
                                    {new Date(
                                      `${student.start_date}T00:00:00`,
                                    ).toLocaleDateString()}{" "}
                                    · {student.status === "active" ? "Active" : "Inactive"}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={isSubmitting}
                                  onClick={() => openStudentEditor(student)}
                                >
                                  Make changes
                                </Button>
                              </div>
                              <Dialog
                                open={editingStudentId === student.id}
                                onOpenChange={(open) => {
                                  if (
                                    !open &&
                                    editingStudentId === student.id &&
                                    !pendingConfirmation
                                  ) {
                                    discardStudentEdit(student.id);
                                  }
                                }}
                              >
                                <DialogContent className="max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Make changes to {student.player_name}</DialogTitle>
                                    <DialogDescription>
                                      Update the student record. You’ll review and confirm before
                                      changes are applied.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <form
                                    className="grid gap-4 sm:grid-cols-2"
                                    onSubmit={(event) => {
                                      event.preventDefault();
                                      reviewStudentChanges(student, event.currentTarget);
                                    }}
                                  >
                                    <div className="grid gap-2">
                                      <Label htmlFor={`student-name-${student.id}`}>
                                        Player name
                                      </Label>
                                      <Input
                                        id={`student-name-${student.id}`}
                                        value={
                                          studentEdits[student.id]?.player_name ??
                                          student.player_name
                                        }
                                        onChange={(event) =>
                                          setStudentField(
                                            student,
                                            "player_name",
                                            event.target.value,
                                          )
                                        }
                                        required
                                        minLength={2}
                                        maxLength={100}
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor={`student-dob-${student.id}`}>
                                        Date of birth
                                      </Label>
                                      <Input
                                        id={`student-dob-${student.id}`}
                                        type="date"
                                        value={
                                          studentEdits[student.id]?.date_of_birth ??
                                          student.date_of_birth
                                        }
                                        onChange={(event) =>
                                          setStudentField(
                                            student,
                                            "date_of_birth",
                                            event.target.value,
                                          )
                                        }
                                        required
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor={`student-group-${student.id}`}>
                                        Age group
                                      </Label>
                                      <select
                                        id={`student-group-${student.id}`}
                                        value={
                                          studentEdits[student.id]?.age_group ?? student.age_group
                                        }
                                        onChange={(event) => {
                                          const value = event.target.value;
                                          if (["U10", "U12", "U15", "U18"].includes(value)) {
                                            setStudentField(
                                              student,
                                              "age_group",
                                              value as StudentEnrollment["age_group"],
                                            );
                                          }
                                        }}
                                        disabled={isSubmitting}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                      >
                                        <option value="U10">U10</option>
                                        <option value="U12">U12</option>
                                        <option value="U15">U15</option>
                                        <option value="U18">U18</option>
                                      </select>
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor={`student-start-${student.id}`}>
                                        Enrollment start date
                                      </Label>
                                      <Input
                                        id={`student-start-${student.id}`}
                                        type="date"
                                        value={
                                          studentEdits[student.id]?.start_date ?? student.start_date
                                        }
                                        onChange={(event) =>
                                          setStudentField(student, "start_date", event.target.value)
                                        }
                                        required
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor={`student-guardian-${student.id}`}>
                                        Guardian name
                                      </Label>
                                      <Input
                                        id={`student-guardian-${student.id}`}
                                        value={
                                          studentEdits[student.id]?.guardian_name ??
                                          student.guardian_name
                                        }
                                        onChange={(event) =>
                                          setStudentField(
                                            student,
                                            "guardian_name",
                                            event.target.value,
                                          )
                                        }
                                        required
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor={`student-email-${student.id}`}>
                                        Guardian email
                                      </Label>
                                      <Input
                                        id={`student-email-${student.id}`}
                                        type="email"
                                        value={
                                          studentEdits[student.id]?.guardian_email ??
                                          student.guardian_email
                                        }
                                        onChange={(event) =>
                                          setStudentField(
                                            student,
                                            "guardian_email",
                                            event.target.value,
                                          )
                                        }
                                        required
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor={`student-phone-${student.id}`}>
                                        Guardian phone
                                      </Label>
                                      <Input
                                        id={`student-phone-${student.id}`}
                                        type="tel"
                                        value={
                                          studentEdits[student.id]?.guardian_phone ??
                                          student.guardian_phone
                                        }
                                        onChange={(event) =>
                                          setStudentField(
                                            student,
                                            "guardian_phone",
                                            event.target.value,
                                          )
                                        }
                                        required
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor={`student-status-${student.id}`}>
                                        Enrollment status
                                      </Label>
                                      <select
                                        id={`student-status-${student.id}`}
                                        value={studentEdits[student.id]?.status ?? student.status}
                                        onChange={(event) => {
                                          if (
                                            event.target.value === "active" ||
                                            event.target.value === "inactive"
                                          ) {
                                            setStudentField(student, "status", event.target.value);
                                          }
                                        }}
                                        disabled={isSubmitting}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                      >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                      </select>
                                    </div>
                                    <DialogFooter className="sm:col-span-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isSubmitting}
                                        onClick={() => discardStudentEdit(student.id)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button type="submit" disabled={isSubmitting}>
                                        Review changes
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>
                              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                                <div>
                                  <p className="font-semibold">
                                    {new Date(`${feeMonth}-01T00:00:00`).toLocaleDateString(
                                      undefined,
                                      {
                                        month: "long",
                                        year: "numeric",
                                      },
                                    )}{" "}
                                    fee:{" "}
                                    <span
                                      className={isFeePaid ? "text-green-700" : "text-destructive"}
                                    >
                                      {areMonthlyFeesLoading
                                        ? "Loading..."
                                        : monthlyFeeLoadFailed
                                          ? "Unavailable"
                                          : isFeePaid
                                            ? "Paid"
                                            : "Unpaid"}
                                    </span>
                                  </p>
                                  {isFeePaid && fee?.paid_at && (
                                    <p className="text-sm text-muted-foreground">
                                      Recorded {new Date(fee.paid_at).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant={isFeePaid ? "outline" : "default"}
                                  disabled={
                                    isSubmitting || areMonthlyFeesLoading || monthlyFeeLoadFailed
                                  }
                                  onClick={() =>
                                    setPendingConfirmation({
                                      kind: "fee",
                                      enrollment: student,
                                      status: isFeePaid ? "unpaid" : "paid",
                                      billingMonth: feeMonth,
                                    })
                                  }
                                >
                                  {monthlyFeeLoadFailed
                                    ? "Unavailable"
                                    : `Mark ${isFeePaid ? "unpaid" : "paid"}`}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>
      )}
      {!isLoading && isAdmin && (
        <section id="change-history" className="mt-12 scroll-mt-36">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl uppercase">Change history</h2>
              <p className="text-sm text-muted-foreground">
                Latest 50 student and monthly fee changes, including who made them and when.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isChangeHistoryLoading}
              onClick={() => void refreshChangeHistory()}
            >
              Refresh history
            </Button>
          </div>
          {isChangeHistoryLoading ? (
            <p className="text-sm text-muted-foreground">Loading change history...</p>
          ) : changeHistoryLoadFailed ? (
            <Card>
              <CardContent className="p-5">
                Change history is unavailable. Verify that the audit-history migration has been
                applied.
              </CardContent>
            </Card>
          ) : changeHistory.length === 0 ? (
            <Card>
              <CardContent className="p-5">No student or fee changes recorded yet.</CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {changeHistory.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="grid gap-2 p-4 sm:grid-cols-[1fr_auto]">
                    <div>
                      <p className="font-semibold">
                        {entry.player_name} ·{" "}
                        {entry.entity_type === "student" ? "Student profile" : "Monthly fee"}{" "}
                        {entry.action}
                      </p>
                      <div className="mt-1 grid gap-1 text-sm text-muted-foreground">
                        {Object.entries(entry.new_values).map(([field, newValue]) => (
                          <p key={field}>
                            {auditFieldLabels[field] ?? field}:{" "}
                            {entry.action === "updated"
                              ? `${formatAuditValue(field, entry.old_values[field])} → `
                              : ""}
                            {formatAuditValue(field, newValue)}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground sm:text-right">
                      <p>{entry.changed_by_email ?? "Admin"}</p>
                      <p>{new Date(entry.changed_at).toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
      <AlertDialog
        open={pendingConfirmation !== null}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) setPendingConfirmation(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingConfirmation?.kind === "fee"
                ? `Mark fee ${pendingConfirmation.status}?`
                : pendingConfirmation?.kind === "trial-approval"
                  ? "Approve trial and prepare SMS?"
                  : pendingConfirmation?.kind === "trial-review"
                    ? "Confirm declining this trial?"
                    : pendingConfirmation?.kind === "enrollment"
                      ? "Confirm student enrollment?"
                      : "Confirm student profile changes"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingConfirmation?.kind === "fee"
                ? `Confirm marking ${pendingConfirmation.enrollment.player_name}'s ${new Date(`${pendingConfirmation.billingMonth}-01T00:00:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" })} fee as ${pendingConfirmation.status}.`
                : pendingConfirmation?.kind === "trial-approval"
                  ? `Approving ${pendingConfirmation.request.player_name}'s trial will open a prefilled text to ${pendingConfirmation.request.guardian_phone}. Review it and press Send in your Messages app.`
                  : pendingConfirmation?.kind === "trial-review"
                    ? `Decline the trial request for ${pendingConfirmation.request.player_name}? This cannot be undone here.`
                    : pendingConfirmation?.kind === "enrollment"
                      ? `Enroll ${pendingConfirmation.request.player_name} in ${pendingConfirmation.request.age_group} starting ${formatAuditValue("start_date", pendingConfirmation.startDate)}?`
                      : `Review the changes for ${pendingConfirmation?.enrollment.player_name} before updating the student record.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {pendingConfirmation?.kind === "student" && (
            <div className="grid max-h-60 gap-2 overflow-y-auto rounded-md border bg-muted/40 p-4 text-sm">
              {(
                Object.entries(pendingConfirmation.changes) as [
                  keyof StudentEnrollmentEdit,
                  string,
                ][]
              ).map(([field, value]) => (
                <p key={field}>
                  <span className="font-medium">{studentFieldLabels[field]}:</span>{" "}
                  {formatStudentFieldValue(field, pendingConfirmation.enrollment[field])}{" "}
                  <span aria-hidden="true">→</span> {formatStudentFieldValue(field, value)}
                </p>
              ))}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>No, go back</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              onClick={(event) => {
                event.preventDefault();
                if (pendingConfirmation?.kind === "student") {
                  void updateStudent(pendingConfirmation.enrollment, pendingConfirmation.changes);
                } else if (pendingConfirmation?.kind === "trial-approval") {
                  const smsWindow = getApprovalSmsLink(pendingConfirmation.request)
                    ? window.open("about:blank", "_blank")
                    : null;
                  if (smsWindow) smsWindow.opener = null;
                  void updateRequest(pendingConfirmation.request, "approved", smsWindow);
                } else if (pendingConfirmation?.kind === "fee") {
                  void updateMonthlyFee(
                    pendingConfirmation.enrollment,
                    pendingConfirmation.status,
                    pendingConfirmation.billingMonth,
                  );
                } else if (pendingConfirmation?.kind === "trial-review") {
                  void updateRequest(pendingConfirmation.request, pendingConfirmation.status);
                } else if (pendingConfirmation?.kind === "enrollment") {
                  void enrollPlayer(pendingConfirmation.request, pendingConfirmation.startDate);
                }
              }}
            >
              {isSubmitting
                ? "Updating..."
                : pendingConfirmation?.kind === "fee"
                  ? `Yes, mark ${pendingConfirmation.status}`
                  : pendingConfirmation?.kind === "trial-approval"
                    ? "Approve and open Messages"
                    : pendingConfirmation?.kind === "trial-review"
                      ? "Yes, decline trial"
                      : pendingConfirmation?.kind === "enrollment"
                        ? "Yes, enroll player"
                        : "Yes, apply changes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function DashboardMessage({ message }: { message: string }) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 md:px-6">
      <Card>
        <CardContent className="p-6">{message}</CardContent>
      </Card>
    </section>
  );
}

function formatStudentFieldValue(field: keyof StudentEnrollmentEdit, value: string) {
  if (field === "date_of_birth" || field === "start_date") {
    return new Date(`${value}T00:00:00`).toLocaleDateString();
  }
  if (field === "status") {
    return value === "active" ? "Active" : "Inactive";
  }
  return value;
}

function formatAuditValue(field: string, value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (field === "billing_month" || field === "date_of_birth" || field === "start_date") {
    return new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString();
  }
  if (field === "paid_at") return new Date(String(value)).toLocaleString();
  if (field === "status") {
    const formatted = String(value);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  return String(value);
}
