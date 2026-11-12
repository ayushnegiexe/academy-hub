import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Compass, Users, Trophy, ArrowRight, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FeatureCarousel } from "@/components/feature-carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import matchWide from "@/assets/match-wide.jpg";
import duelBall from "@/assets/duel-ball.jpg";
import coachPortrait from "@/assets/coach-portrait.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Devsheel Football Academy" },
      {
        name: "description",
        content:
          "A young grassroots football academy training U10 to U18 — our approach, our values and photos from real sessions and matches.",
      },
      { property: "og:title", content: "About Us — Devsheel Football Academy" },
      {
        property: "og:description",
        content: "Our approach, our values and photos from real Devsheel sessions and matches.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Heart, motion: "heart", title: "Passion", desc: "Love the ball. Love the process." },
  {
    icon: Compass,
    motion: "compass",
    title: "Discipline",
    desc: "On time, in kit, and in effort — every session.",
  },
  {
    icon: Users,
    motion: "users",
    title: "Team",
    desc: "Respect for teammates, opponents and the game.",
  },
  {
    icon: Trophy,
    motion: "trophy",
    title: "Excellence",
    desc: "Chase mastery, not just the scoreline.",
  },
];

function AboutPage() {
  return (
    <>
      {/* HERO WITH PHOTO */}
      <section className="relative overflow-hidden py-28 text-white">
        <img
          src={matchWide}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient opacity-80" aria-hidden />
        <div className="absolute inset-0 bg-black/45" aria-hidden />
        <div className="absolute inset-0 pitch-lines opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <Badge className="mb-4 border-gold/40 bg-white/10 text-gold uppercase tracking-widest">
            About Us
          </Badge>
          <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.95] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] md:text-7xl">
            Built on grit.
            <br />
            <span className="shine-text">Powered by belief.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            A young grassroots academy training four age groups — U10, U12, U15 and U18. No
            shortcuts, no gimmicks: just sessions, matches and steady work on the basics.
          </p>
        </div>
      </section>

      {/* STORY + PHOTO */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-6 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <img
            src={duelBall}
            alt="Devsheel players contesting the ball during a match"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
          />
          <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-gold-gradient p-5 text-ink shadow-gold md:block">
            <p className="font-display text-4xl">4</p>
            <p className="text-xs font-black uppercase tracking-widest">Age groups</p>
          </div>
        </div>
        <div>
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 uppercase tracking-widest">
            Our story
          </Badge>
          <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-5xl">
            A young academy, done properly.
          </h2>
          <p className="mt-4 text-muted-foreground font-medium">
            Devsheel is new. We don't claim trophies we haven't won or facilities we don't have.
            What we do have is a proper ground, structured training sessions and a coach present at
            every training session.
          </p>
          <p className="mt-3 text-muted-foreground font-medium">
            We play friendlies and local tournaments when opportunities come up. The rest of the
            time, we focus on the fundamentals: first touch, movement, decision-making and
            behaviour.
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild className="rounded-full">
              <Link to="/programs">
                See our programs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 uppercase tracking-widest">
              Our values
            </Badge>
            <h2 className="font-display text-4xl uppercase md:text-5xl">The Devsheel Code.</h2>
          </div>
          <FeatureCarousel items={VALUES} ariaLabel="The Devsheel Code values" itemLabel="value" />
        </div>
      </section>

      {/* COACHING AND TRAINING */}
      <section className="bg-secondary/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl space-y-20 px-4 md:space-y-28 md:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary uppercase tracking-widest">
                Coaching
              </Badge>
              <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl">
                A coach at every session.
              </h2>
            </div>
            <p className="max-w-2xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
              A coach is present at every training session, guiding players through structured
              practice and the fundamentals of the game.
            </p>
          </div>

          <div>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                  The foundations
                </p>
                <h3 className="mt-2 font-display text-3xl uppercase md:text-4xl">
                  What we work on
                </h3>
              </div>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                Steady progress comes from practising the details and learning to bring them into
                the game.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  number: "01",
                  title: "First Touch",
                  description:
                    "Controlling the ball, receiving passes and building confidence on the ball.",
                },
                {
                  number: "02",
                  title: "Movement",
                  description:
                    "Balance, coordination, positioning and movement with and without the ball.",
                },
                {
                  number: "03",
                  title: "Decision-making",
                  description: "Learning when to pass, dribble, move or create space.",
                },
                {
                  number: "04",
                  title: "Behaviour",
                  description:
                    "Discipline, teamwork, respect and sportsmanship on and off the pitch.",
                },
              ].map((item) => (
                <Card
                  key={item.number}
                  className="group border-border/70 bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"
                >
                  <CardContent className="p-6">
                    <span className="font-display text-sm tracking-widest text-primary/70">
                      {item.number}
                    </span>
                    <h4 className="mt-5 font-display text-xl uppercase">{item.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                A clear process
              </p>
              <h3 className="mt-2 font-display text-3xl uppercase md:text-4xl">
                Our approach to coaching
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  number: "01",
                  title: "Demonstrate",
                  description: "Show players how to perform a skill.",
                },
                {
                  number: "02",
                  title: "Practice",
                  description: "Give players time to repeat and improve.",
                },
                {
                  number: "03",
                  title: "Challenge",
                  description: "Introduce game-like situations.",
                },
                {
                  number: "04",
                  title: "Improve",
                  description: "Provide feedback and encourage learning.",
                },
              ].map((step) => (
                <Card key={step.number} className="border-border/70 bg-card shadow-sm">
                  <CardContent className="flex items-start gap-4 p-5 md:flex-col md:p-6">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground shadow-sm">
                      {step.number}
                    </span>
                    <div>
                      <h4 className="font-display text-lg uppercase">{step.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                From warm-up to wrap-up
              </p>
              <h3 className="mt-2 font-display text-3xl uppercase leading-tight md:text-4xl">
                Every session has a purpose.
              </h3>
              <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                Players work through a clear progression, building skills before putting them into
                practice through games.
              </p>
            </div>
            <ol className="relative space-y-3 before:absolute before:bottom-8 before:left-[1.35rem] before:top-8 before:w-px before:bg-primary/20">
              {[
                {
                  title: "Warm-up",
                  description: "Movement, coordination and ball familiarisation.",
                },
                {
                  title: "Technical Practice",
                  description: "Passing, receiving, dribbling and ball control.",
                },
                {
                  title: "Skill Development",
                  description: "Practising skills through structured activities.",
                },
                {
                  title: "Game Application",
                  description: "Applying learning through small-sided games.",
                },
                {
                  title: "Cool-down & Feedback",
                  description: "Reflection, encouragement and learning points.",
                },
              ].map((step, index) => (
                <li
                  key={step.title}
                  className="relative flex gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:gap-5 sm:p-5"
                >
                  <span className="z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary/15 bg-background font-display text-lg text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <h4 className="font-display text-lg uppercase">{step.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-lift">
            <div className="grid md:grid-cols-[0.8fr_1.2fr]">
              <div className="relative min-h-72 overflow-hidden bg-crimson-deep md:min-h-full">
                <img
                  src={coachPortrait}
                  alt="Devsheel Football Academy coach"
                  className="absolute inset-0 h-full w-full object-contain object-bottom"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-crimson-deep/90 to-transparent px-6 pb-5 pt-16">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-gold">
                    Head coach
                  </p>
                </div>
              </div>
              <div className="p-6 sm:p-8 md:p-10">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                  Meet the coach
                </p>
                <h3 className="mt-2 font-display text-3xl uppercase leading-tight md:text-4xl">
                  The coach behind every session.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The academy is led by its founder, who is present at every training session. Coach
                  profile details will be added once confirmed.
                </p>
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Coach name", "To be added"],
                    ["Coaching qualifications", "To be added"],
                    ["Playing and coaching experience", "To be added"],
                    ["Coaching philosophy", "To be added by the coach"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-border/70 bg-background p-4"
                    >
                      <dt className="text-[11px] font-black uppercase tracking-widest text-primary">
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm text-muted-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICAL DETAILS */}
      <section id="ground" className="bg-secondary/40 py-20 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-primary/10 text-primary uppercase tracking-widest">
              Plan a visit
            </Badge>
            <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-5xl">
              Find us and get started.
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-display text-xl uppercase">Our ground</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Badowala, Premnagar Rd, Arcadia Grant, Dehradun, Uttarakhand 248007
                </p>
                <a
                  className="mt-4 inline-flex items-center font-bold text-primary underline-offset-4 hover:underline"
                  href="https://www.google.com/maps/search/?api=1&query=Badowala%2C%20Premnagar%20Rd%2C%20Arcadia%20Grant%2C%20Dehradun%2C%20Uttarakhand%20248007"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get directions <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-display text-xl uppercase">Age groups</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Training is available for U10, U12, U15 and U18. The trial form checks age-group
                  eligibility.
                </p>
                <Button asChild variant="link" className="mt-2 h-auto p-0">
                  <Link to="/programs">
                    Explore programs <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Phone className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-display text-xl uppercase">Schedule and fees</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Call us for current training times and fee information.
                </p>
                <a
                  className="mt-4 inline-flex items-center font-bold text-primary underline-offset-4 hover:underline"
                  href="tel:+918218245579"
                >
                  +91 821 824 5579
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PARENT FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-20 md:px-6">
        <div className="text-center">
          <Badge className="mb-4 bg-primary/10 text-primary uppercase tracking-widest">
            For parents
          </Badge>
          <h2 className="font-display text-4xl uppercase md:text-5xl">Good to know.</h2>
        </div>
        <Accordion type="single" collapsible className="mt-8">
          <AccordionItem value="trial">
            <AccordionTrigger>How do I arrange a trial?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              A parent or guardian can submit the trial request form. The academy team will get in
              touch to arrange a session.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="training">
            <AccordionTrigger>What do players work on?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Structured sessions focus on first touch, movement, decision-making and behaviour. A
              coach is present at every training session.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="age-groups">
            <AccordionTrigger>Which age groups are available?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              The academy has U10, U12, U15 and U18 groups. The trial request form uses the
              player&apos;s date of birth to show eligible groups.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="schedule">
            <AccordionTrigger>Where can I check training times and fees?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Call the academy at{" "}
              <a className="font-semibold text-primary underline" href="tel:+918218245579">
                +91 821 824 5579
              </a>{" "}
              for current schedule and fee details.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* COACHING CALL TO ACTION */}
      <section className="relative overflow-hidden bg-crimson-deep py-16 text-white md:py-20">
        <div className="absolute inset-0 pitch-lines opacity-25" aria-hidden />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center md:px-6">
          <div>
            <Badge className="mb-4 border-gold/40 bg-white/10 text-gold uppercase tracking-widest">
              Devsheel Football Academy
            </Badge>
            <h2 className="max-w-3xl font-display text-3xl uppercase leading-tight md:text-5xl">
              Every session. Every touch. Every opportunity to improve.
            </h2>
            <p className="mt-3 max-w-xl text-white/80">
              Start your football journey with Devsheel Football Academy.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full uppercase tracking-widest">
            <Link to="/contact">
              Join our academy <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
