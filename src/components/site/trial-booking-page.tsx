import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/subpabase";
import { toast } from "sonner";

export function TrialBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
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

      toast.success("Trial request sent", {
        description: "Our staff will review it and contact you to confirm a session.",
      });
      form.reset();
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
            Tell us about your player and our staff will get in touch to arrange a trial.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <Card className="border-border shadow-lift">
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
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="age_group">Age group</Label>
                  <select
                    id="age_group"
                    name="age_group"
                    required
                    defaultValue=""
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="" disabled>
                      Select a group
                    </option>
                    <option value="U10">Under 10</option>
                    <option value="U12">Under 12</option>
                    <option value="U15">Under 15</option>
                    <option value="U18">Under 18</option>
                  </select>
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
                    required
                    minLength={7}
                    maxLength={30}
                    pattern="[+0-9() -]{7,30}"
                    disabled={isSubmitting}
                  />
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
      </section>
    </>
  );
}
