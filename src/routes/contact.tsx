import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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
  return (
    <>
      <section className="relative overflow-hidden bg-hero-gradient py-20 text-white">
        <div className="absolute inset-0 pitch-lines opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <Badge className="mb-4 border-gold/40 bg-white/10 text-gold">Get in touch</Badge>
          <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.95] md:text-7xl">Come and <span className="shine-text">see us play.</span></h1>
          <p className="mt-4 max-w-2xl text-white/85">Drop by the training ground, book a call, or send a message — a coach will respond within one working day.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border shadow-lift">
          <CardContent className="p-6 md:p-8">
            <h2 className="font-display text-3xl uppercase">Send a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">We reply within 24 hours.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Message sent — we'll be in touch shortly.");
                (e.target as HTMLFormElement).reset();
              }}
              className="mt-6 grid gap-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="first">First name</Label>
                  <Input id="first" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last">Last name</Label>
                  <Input id="last" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>What's this about?</Label>
                <Select>
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
                <Label htmlFor="msg">Message</Label>
                <Textarea id="msg" rows={5} required placeholder="Tell us a little about the player, age group, and what you're looking for..." />
              </div>
              <Button type="submit" size="lg" className="rounded-full bg-primary text-primary-foreground hover:brightness-110">
                Send message <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="border-border">
            <CardContent className="p-6">
              <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Visit us</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> 42 Kingsway Sports Complex,<br />Devsheel Park, London N16 5QP</div>
                <div className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> +44 20 7946 0123</div>
                <div className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> hello@devsheel.fc</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-6">
              <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Opening hours</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between"><span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Mon – Fri</span><span className="text-muted-foreground">15:00 – 21:00</span></li>
                <li className="flex justify-between"><span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Saturday</span><span className="text-muted-foreground">08:00 – 18:00</span></li>
                <li className="flex justify-between"><span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Sunday</span><span className="text-muted-foreground">09:00 – 15:00</span></li>
              </ul>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-border">
            <div className="aspect-[4/3] w-full">
              <iframe
                title="Academy map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-0.08%2C51.55%2C-0.06%2C51.57&layer=mapnik"
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
