import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type MonthlyFeeStatus = {
  status: "paid" | "unpaid";
  paid_at: string | null;
};

type StaffUser = {
  id: string;
  email: string;
};

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [{ title: "Staff Dashboard — Devsheel Football Academy" }],
  }),
  component: StaffPage,
});

function StaffPage() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requests, setRequests] = useState<TrialRequest[]>([]);
  const [students, setStudents] = useState<StudentEnrollment[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [feeMonth, setFeeMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [monthlyFees, setMonthlyFees] = useState<Record<string, MonthlyFeeStatus>>({});
  const [areMonthlyFeesLoading, setAreMonthlyFeesLoading] = useState(false);
  const [monthlyFeeLoadFailed, setMonthlyFeeLoadFailed] = useState(false);
  const [studentEdits, setStudentEdits] = useState<Record<string, StudentEnrollmentEdit>>({});
  const [startDates, setStartDates] = useState<Record<string, string>>({});
  const [staffNotes, setStaffNotes] = useState<Record<string, string>>({});

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
        console.error("Could not check staff session:", error);
        toast.error("Could not check your sign-in. Please refresh and try again.");
      }
      const sessionUser = data.session?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email ?? "" } : null);
      setIsChecking(false);
    }

    void checkSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? "" } : null);
      setIsStaff(false);
      setRequests([]);
      setStudents([]);
      setMonthlyFees({});
      setStudentEdits({});
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
        console.error("Could not verify staff access:", membershipError);
        toast.error("Could not verify staff access. Please try again.");
        setIsLoading(false);
        return;
      }
      if (!membership) {
        setIsStaff(false);
        setIsLoading(false);
        return;
      }

      setIsStaff(true);
      const [trialResult, studentResult] = await Promise.all([
        supabase!
          .from("trial_requests")
          .select(
            "id, player_name, date_of_birth, age_group, guardian_name, guardian_email, guardian_phone, preferred_trial_date, notes, status, staff_notes, submitted_at",
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
        toast.error("Could not load existing students. Please check staff access policies.");
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
    if (!supabase || !user || !isStaff) return;
    let active = true;

    async function loadMonthlyFees() {
      setAreMonthlyFeesLoading(true);
      const { data, error } = await supabase!
        .from("player_monthly_fees")
        .select("enrollment_id, status, paid_at")
        .eq("billing_month", `${feeMonth}-01`);

      if (!active) return;
      if (error) {
        console.error("Could not load monthly fee statuses:", error);
        toast.error(
          "Could not load fee statuses. Please check the fee migration and staff access.",
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
  }, [user, isStaff, feeMonth]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Staff sign-in failed:", error);
      toast.error("Could not sign in", { description: error.message });
    }
    setIsSubmitting(false);
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Staff sign-out failed:", error);
      toast.error("Could not sign out. Please try again.");
    }
  }

  async function updateRequest(request: TrialRequest, status: "approved" | "rejected") {
    if (!supabase) return;
    setIsSubmitting(true);
    const { error } = await supabase.rpc("review_trial_request", {
      p_trial_request_id: request.id,
      p_status: status,
      p_staff_notes: staffNotes[request.id]?.trim() || null,
    });

    if (error) {
      console.error("Could not update trial request:", error);
      toast.error("Could not update request. Please refresh and try again.");
    } else {
      toast.success(status === "approved" ? "Trial approved" : "Trial declined");
      await refreshRequests();
    }
    setIsSubmitting(false);
  }

  async function enrollPlayer(request: TrialRequest) {
    if (!supabase) return;
    const startDate = startDates[request.id];
    if (!startDate) {
      toast.error("Choose an enrollment start date first.");
      return;
    }
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
      await Promise.all([refreshRequests(), refreshStudents()]);
    }
    setIsSubmitting(false);
  }

  const refreshRequests = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("trial_requests")
      .select(
        "id, player_name, date_of_birth, age_group, guardian_name, guardian_email, guardian_phone, preferred_trial_date, notes, status, staff_notes, submitted_at",
      )
      .order("submitted_at", { ascending: false });
    if (error) {
      console.error("Could not refresh trial requests:", error);
      toast.error("Could not refresh requests.");
    } else {
      setRequests((data ?? []) as TrialRequest[]);
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

  async function updateStudent(enrollment: StudentEnrollment) {
    if (!supabase) return;
    const changes = studentEdits[enrollment.id];
    if (!changes) return;
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
      await refreshStudents();
    }
    setIsSubmitting(false);
  }

  async function updateMonthlyFee(enrollment: StudentEnrollment, status: "paid" | "unpaid") {
    if (!supabase) return;
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("player_monthly_fees")
      .upsert(
        {
          enrollment_id: enrollment.id,
          billing_month: `${feeMonth}-01`,
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
    }
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (!supabase || !user || !isStaff) return;
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
  }, [user, isStaff, refreshRequests]);

  if (!supabase) {
    return (
      <DashboardMessage message="Supabase is not configured. Set the project URL and publishable key to enable staff access." />
    );
  }

  if (isChecking) {
    return <DashboardMessage message="Checking staff sign-in..." />;
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 md:px-6">
        <Card>
          <CardContent className="p-6 md:p-8">
            <h1 className="font-display text-3xl uppercase">Staff sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with your academy staff account.
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
          <h1 className="font-display text-4xl uppercase">Staff dashboard</h1>
        </div>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>

      {!isLoading && isStaff && (
        <h2 className="mb-5 font-display text-3xl uppercase">Trial requests</h2>
      )}
      {isLoading ? (
        <p className="text-muted-foreground">Loading requests...</p>
      ) : !isStaff ? (
        <Card>
          <CardContent className="p-6">
            This account is signed in but is not registered as academy staff.
          </CardContent>
        </Card>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-6">No trial requests yet.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-5">
          {requests.map((request) => (
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
                    Born {request.date_of_birth} · Submitted{" "}
                    {new Date(request.submitted_at).toLocaleDateString()}
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
                  {request.notes && <p className="whitespace-pre-wrap text-sm">{request.notes}</p>}
                  {request.staff_notes && (
                    <p className="text-sm text-muted-foreground">
                      Staff note: {request.staff_notes}
                    </p>
                  )}
                </div>

                {request.status === "pending" && (
                  <div className="grid content-start gap-3 md:w-72">
                    <Textarea
                      rows={2}
                      placeholder="Staff note (optional)"
                      value={staffNotes[request.id] ?? ""}
                      onChange={(event) =>
                        setStaffNotes((current) => ({
                          ...current,
                          [request.id]: event.target.value,
                        }))
                      }
                      disabled={isSubmitting}
                    />
                    <div className="flex gap-2">
                      <Button
                        disabled={isSubmitting}
                        onClick={() => void updateRequest(request, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => void updateRequest(request, "rejected")}
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
                    <Button disabled={isSubmitting} onClick={() => void enrollPlayer(request)}>
                      Enroll player
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && isStaff && (
        <section id="existing-students" className="mt-12">
          <h2 className="mb-5 font-display text-3xl uppercase">Existing students & monthly fees</h2>
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
          {students.length === 0 ? (
            <Card>
              <CardContent className="p-6">No enrolled students yet.</CardContent>
            </Card>
          ) : students.filter((student) =>
              student.player_name
                .toLocaleLowerCase()
                .includes(studentSearch.trim().toLocaleLowerCase()),
            ).length === 0 ? (
            <Card>
              <CardContent className="p-6">No students match that name.</CardContent>
            </Card>
          ) : (
            <div className="grid gap-5">
              {students
                .filter((student) =>
                  student.player_name
                    .toLocaleLowerCase()
                    .includes(studentSearch.trim().toLocaleLowerCase()),
                )
                .map((student) => {
                  const edit = studentEdits[student.id] ?? student;
                  const fee = monthlyFees[student.id];
                  const isFeePaid = fee?.status === "paid";
                  return (
                    <Card key={student.id}>
                      <CardContent className="p-5 md:p-6">
                        <form
                          className="grid gap-4 md:grid-cols-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            void updateStudent(student);
                          }}
                        >
                          <div className="grid gap-2">
                            <Label htmlFor={`student-name-${student.id}`}>Player name</Label>
                            <Input
                              id={`student-name-${student.id}`}
                              value={edit.player_name}
                              onChange={(event) =>
                                setStudentField(student, "player_name", event.target.value)
                              }
                              required
                              minLength={2}
                              maxLength={100}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor={`student-dob-${student.id}`}>Date of birth</Label>
                            <Input
                              id={`student-dob-${student.id}`}
                              type="date"
                              value={edit.date_of_birth}
                              onChange={(event) =>
                                setStudentField(student, "date_of_birth", event.target.value)
                              }
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor={`student-group-${student.id}`}>Age group</Label>
                            <select
                              id={`student-group-${student.id}`}
                              value={edit.age_group}
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
                              value={edit.start_date}
                              onChange={(event) =>
                                setStudentField(student, "start_date", event.target.value)
                              }
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor={`student-guardian-${student.id}`}>Guardian name</Label>
                            <Input
                              id={`student-guardian-${student.id}`}
                              value={edit.guardian_name}
                              onChange={(event) =>
                                setStudentField(student, "guardian_name", event.target.value)
                              }
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor={`student-email-${student.id}`}>Guardian email</Label>
                            <Input
                              id={`student-email-${student.id}`}
                              type="email"
                              value={edit.guardian_email}
                              onChange={(event) =>
                                setStudentField(student, "guardian_email", event.target.value)
                              }
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor={`student-phone-${student.id}`}>Guardian phone</Label>
                            <Input
                              id={`student-phone-${student.id}`}
                              type="tel"
                              value={edit.guardian_phone}
                              onChange={(event) =>
                                setStudentField(student, "guardian_phone", event.target.value)
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
                              value={edit.status}
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
                          <div className="md:col-span-2">
                            <Button
                              type="submit"
                              disabled={isSubmitting || !studentEdits[student.id]}
                            >
                              Save student
                            </Button>
                          </div>
                        </form>
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                          <div>
                            <p className="font-semibold">
                              {new Date(`${feeMonth}-01T00:00:00`).toLocaleDateString(undefined, {
                                month: "long",
                                year: "numeric",
                              })}{" "}
                              fee:{" "}
                              <span className={isFeePaid ? "text-green-700" : "text-destructive"}>
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
                            disabled={isSubmitting || areMonthlyFeesLoading || monthlyFeeLoadFailed}
                            onClick={() =>
                              void updateMonthlyFee(student, isFeePaid ? "unpaid" : "paid")
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
          )}
        </section>
      )}
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
