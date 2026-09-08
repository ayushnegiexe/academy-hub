import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { submitContactForm } from "@/server/contact";

const countryCodes = [
  { value: "+91", label: "India (+91)" },
  { value: "+1", label: "US / Canada (+1)" },
  { value: "+44", label: "UK (+44)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+971", label: "UAE (+971)" },
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Devsheel Football Academy" },
      { name: "description", content: "Visit Devsheel Football Academy, book a trial, or send a message to our team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topic, setTopic] = useState<string>("");
  const [countryCode, setCountryCode] = useState("+91");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get("first") ?? "").trim();
    const lastName = String(formData.get("last") ?? "").trim();
    const full_name = `${firstName} ${lastName}`.trim();
    const phoneNumber = String(formData.get("phone") ?? "").trim();

    try {
      await submitContactForm({
        full_name,
        email: String(formData.get("email") ?? "").trim(),
        phone: phoneNumber ? `${countryCode}${phoneNumber}` : "",
        message: String(formData.get("msg") ?? "").trim(),
        interest_group: topic || "other",
      });

      toast.success("Message received!", {
        description: "A coach from Devsheel Academy will contact you shortly.",
      });
      
      (e.target as HTMLFormElement).reset();
      setTopic("");
      setCountryCode("+91");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again.",
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
          <Badge className="mb-4 border-gold/40 bg-white/10 text-gold uppercase tracking-widest">Get in touch</Badge>
          <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.95] md:text-7xl">
            Come and <span className="shine-text">see us play.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">Drop by the training ground, book a call, or send a message — a coach will respond within one working day.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border shadow-lift">
          <CardContent className="p-6 md:p-8">
            <h2 className="font-display text-3xl uppercase">Send a message</h2>
            <p className="mt-1 text-sm text-muted-foreground font-medium">Capture your spot for a trial session.</p>
            
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="first">First name</Label>
                  <Input name="first" id="first" required disabled={isSubmitting} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last">Last name</Label>
                  <Input name="last" id="last" required disabled={isSubmitting} />
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" id="email" type="email" required disabled={isSubmitting} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode} disabled={isSubmitting}>
                      <SelectTrigger className="w-[132px] shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      name="phone"
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      minLength={10}
                      maxLength={10}
                      title="Enter a 10-digit phone number."
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>What's this about?</Label>
                <Select value={topic} onValueChange={setTopic} disabled={isSubmitting}>
                  <SelectTrigger><SelectValue placeholder="Choose a topic" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="join">Joining the academy</SelectItem>
                    <SelectItem value="program">Program inquiry</SelectItem>
                    <SelectItem value="scholarship">Scholarships & fees</SelectItem>
                    <SelectItem value="partnership">Partnership / press</SelectItem>
                    <SelectItem value="other">Something else</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="msg">Message <span className="text-muted-foreground">(optional)</span></Label>
                <Textarea 
                  name="msg" 
                  id="msg" 
                  rows={5} 
                  disabled={isSubmitting}
                  placeholder="Tell us a little about the player, age group, and what you're looking for..."
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800 transition-all"
              >
                {isSubmitting ? (
                  <>Sending <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
                ) : (
                  <>Send message <Send className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-5">
        </div>
      </section>
    </>
  );
}