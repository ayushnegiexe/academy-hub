import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Devsheel Football Academy" },
      { name: "description", content: "Four age groups at Devsheel Football Academy: U10, U12, U15 and U18. Small sessions, fundamentals-first, age-appropriate football." },
    ],
  }),
  component: ProgramsPage,
});

const GROUPS = [
  {
    tag: "U10",
    title: "Under 10",
    copy: "First steps in structured football. Coordination, ball familiarity and small-sided games — the age where the love of the ball is set.",
    focus: ["First touch & dribbling", "Small-sided games", "Basic positioning", "Fun-led sessions"],
  },
  {
    tag: "U12",
    title: "Under 12",
    copy: "Building on the fundamentals. Introducing simple team shape, passing patterns and the responsibility that comes with a shirt.",
    focus: ["Passing & receiving", "Introductory tactics", "Two-footed play", "Teamwork & respect"],
  },
  {
    tag: "U15",
    title: "Under 15",
    copy: "Bridging youth football and competitive age-group play. Deeper tactical work, positional roles and physical development within safe limits.",
    focus: ["Positional roles", "Game intelligence", "Fitness fundamentals", "Occasional tournaments"],
  },
  {
    tag: "U18",
    title: "Under 18",
    copy: "Preparing players for adult football. Higher intensity, tactical detail and personal accountability on and off the pitch.",
    focus: ["Tactical detail", "Strength & conditioning", "Match analysis", "Leadership on the pitch"],
  },
];

function ProgramsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-hero-gradient py-24 text-white">
        <div className="absolute inset-0 pitch-lines opacity-30" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <Badge className="mb-4 border-gold/40 bg-white/10 text-gold">Programs</Badge>
          <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.95] md:text-7xl">
            Four age groups.<br /><span className="shine-text">One standard.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90">
            We currently run four age groups. Sessions are kept small and age-appropriate — the fundamentals done properly, week in, week out.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {GROUPS.map((g) => (
            <Card key={g.tag} className="group border-border transition hover:-translate-y-1 hover:shadow-lift">
              <CardContent className="p-8">
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-6xl text-primary">{g.tag}</p>
                  <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">Age group</p>
                </div>
                <h3 className="mt-3 font-display text-2xl uppercase">{g.title}</h3>
                <p className="mt-3 text-muted-foreground">{g.copy}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {g.focus.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-hero-gradient p-8 text-white shadow-lift md:p-12">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-3xl uppercase md:text-5xl">Interested in a group?</h2>
              <p className="mt-3 max-w-lg text-white/85">Get in touch and we'll share session times, location and how to get your player involved.</p>
            </div>
            <Button asChild size="lg" className="rounded-full bg-gold-gradient text-ink hover:brightness-110">
              <Link to="/contact">Contact us <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          We enter local tournaments from time to time when it suits the group — competitive football has its place, but development comes first.
        </p>
      </section>
    </>
  );
}
