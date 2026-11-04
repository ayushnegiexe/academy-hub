import { CheckCircle2, Loader2, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/subpabase";
import { toast } from "sonner";

const ageGroupMaximums: Record<string, number> = {
  U10: 9,
  U12: 11,
  U15: 14,
  U18: 17,
};

function getAgeOnDate(dateOfBirth: string, referenceDate = new Date()) {
  const [year, month, day] = dateOfBirth.split("-").map(Number);
  if (!year || !month || !day) return null;

  let age = referenceDate.getFullYear() - year;
  const birthdayHasPassed =
    referenceDate.getMonth() + 1 > month ||
    (referenceDate.getMonth() + 1 === month && referenceDate.getDate() >= day);
  if (!birthdayHasPassed) age -= 1;
  return age;
}

function isAgeGroupEligible(age: number | null, ageGroup: string) {
  const maximumAge = ageGroupMaximums[ageGroup];
  return age !== null && age >= 0 && maximumAge !== undefined && age <= maximumAge;
}

export function TrialBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [submittedPlayerName, setSubmittedPlayerName] = useState<string | null>(null);
  const playerAge = getAgeOnDate(dateOfBirth);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!isAgeGroupEligible(playerAge, ageGroup)) {
      toast.error("Choose an age group that matches the player's date of birth.");
      return;
    }

    if (!supabase) {
      toast.error("Trial booking is temporarily unavailable", {
        description: "Please contact the academy directly.",
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      player_name: String(formData.get("player_name") ?? "").trim(),
      date_of_birth: String(formData.get("date_of_birth") ?? ""),
      age_group: String(formData.get("age_group") ?? ""),
      guardian_name: String(formData.get("guardian_name") ?? "").trim(),
      guardian_email: String(formData.get("guardian_email") ?? "").trim(),
      guardian_phone: String(formData.get("guardian_phone") ?? "").trim(),
      preferred_trial_date: String(formData.get("preferred_trial_date") ?? "") || null,
      notes: String(formData.get("notes") ?? "").trim(),
      guardian_consent: formData.get("guardian_consent") === "on",
    };

    try {
      const { error } = await supabase.from("trial_requests").insert(payload);
      if (error) throw error;

      setSubmittedPlayerName(payload.player_name);
      form.reset();
      setDateOfBirth("");
      setAgeGroup("");
      setGuardianPhone("");
    } catch (error) {
      console.error("Trial request submission failed:", error);
      toast.error("Could not send your request", {
        description: "Please check your details and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-hero-gradient py-20 text-white">
        <div className="absolute inset-0 pitch-lines opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <Badge className="mb-4 border-gold/40 bg-white/10 uppercase tracking-widest text-gold">
            Trial session
          </Badge>
          <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.95] md:text-7xl">
            Take your <span className="shine-text">first touch.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Tell us about your player and our admin team will get in touch to arrange a trial.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <Card className={`border-border shadow-lift ${submittedPlayerName ? "hidden" : ""}`}>
          <CardContent className="p-6 md:p-8">
            <h2 className="font-display text-3xl uppercase">Request a trial</h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              A parent or guardian should complete this form.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="player_name">Player full name</Label>
                <Input
                  id="player_name"
                  name="player_name"
                  required
                  minLength={2}
                  maxLength={100}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="date_of_birth">Date of birth</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    required
                    max={new Date().toISOString().slice(0, 10)}
                    value={dateOfBirth}
                    onChange={(event) => {
                      const nextDateOfBirth = event.target.value;
                      const nextAge = getAgeOnDate(nextDateOfBirth);
                      setDateOfBirth(nextDateOfBirth);
                      if (ageGroup && !isAgeGroupEligible(nextAge, ageGroup)) {
                        setAgeGroup("");
                      }
                    }}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="age_group">Age group</Label>
                  <select
                    id="age_group"
                    name="age_group"
                    required
                    value={ageGroup}
                    onChange={(event) => setAgeGroup(event.target.value)}
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="" disabled>
                      {dateOfBirth ? "Select an eligible group" : "Select date of birth first"}
                    </option>
                    <option value="U10" disabled={!isAgeGroupEligible(playerAge, "U10")}>
                      Under 10
                    </option>
                    <option value="U12" disabled={!isAgeGroupEligible(playerAge, "U12")}>
                      Under 12
                    </option>
                    <option value="U15" disabled={!isAgeGroupEligible(playerAge, "U15")}>
                      Under 15
                    </option>
                    <option value="U18" disabled={!isAgeGroupEligible(playerAge, "U18")}>
                      Under 18
                    </option>
                  </select>
                  {dateOfBirth && (
                    <p className="text-xs text-muted-foreground" aria-live="polite">
                      {playerAge !== null && playerAge >= 18
                        ? "Players aged 18 or older should contact the academy for age-group guidance."
                        : "Only age groups that include the player's current age are available."}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="guardian_name">Parent / guardian full name</Label>
                <Input
                  id="guardian_name"
                  name="guardian_name"
                  required
                  minLength={2}
                  maxLength={100}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="guardian_email">Email</Label>
                  <Input
                    id="guardian_email"
                    name="guardian_email"
                    type="email"
                    required
                    maxLength={255}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guardian_phone">Phone</Label>
                  <Input
                    id="guardian_phone"
                    name="guardian_phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    minLength={10}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    autoComplete="tel-national"
                    placeholder="10-digit mobile number"
                    value={guardianPhone}
                    onChange={(event) =>
                      setGuardianPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">Enter exactly 10 digits.</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="preferred_trial_date">Preferred trial date (optional)</Label>
                <Input
                  id="preferred_trial_date"
                  name="preferred_trial_date"
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Anything else we should know? (optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  maxLength={1000}
                  disabled={isSubmitting}
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="guardian_consent"
                  required
                  disabled={isSubmitting}
                  className="mt-1 accent-primary"
                />
                <span>
                  I am the player&apos;s parent or guardian, or am authorized to submit this
                  request, and consent to the academy using these details to respond.
                </span>
              </label>

              <Button type="submit" size="lg" disabled={isSubmitting} className="rounded-full">
                {isSubmitting ? (
                  <>
                    Sending <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Request a trial <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {submittedPlayerName && (
          <Card className="border-border shadow-lift">
            <CardContent className="p-6 md:p-8" role="status" aria-live="polite">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                    Request received
                  </p>
                  <h2 className="mt-1 font-display text-3xl uppercase">
                    Thank you, {submittedPlayerName}.
                  </h2>
                  <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                    Your trial request has been submitted successfully. Please wait for our team to
                    contact you and confirm a session, or visit the academy ground.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a
                  className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/60"
                  href="https://www.google.com/maps/search/?api=1&query=Badowala%2C%20Premnagar%20Rd%2C%20Arcadia%20Grant%2C%20Dehradun%2C%20Uttarakhand%20248007"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>
                    <span className="block font-semibold">Visit the academy</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      Badowala, Premnagar Rd, Arcadia Grant, Dehradun, Uttarakhand 248007
                    </span>
                  </span>
                </a>
                <a
                  className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/60"
                  href="tel:+918218245579"
                >
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>
                    <span className="block font-semibold">Have a question?</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      Call us at +91 821 824 5579
                    </span>
                  </span>
                </a>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                We look forward to welcoming you and your player to Devsheel Football Academy.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-6"
                onClick={() => setSubmittedPlayerName(null)}
              >
                Submit another request
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </>
  );
}
