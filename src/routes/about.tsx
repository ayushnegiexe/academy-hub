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
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Badge className="mb-4 bg-primary/10 text-primary uppercase tracking-widest">
              Coaching
            </Badge>
            <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-5xl">
              A coach at every session.
            </h2>
            <p className="mt-4 max-w-xl font-medium text-muted-foreground">
              A coach is present at every training session, guiding players through structured
              practice and the fundamentals of the game.
            </p>
          </div>
          <div>
            <h3 className="font-display text-2xl uppercase">What we work on</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["First touch", "Movement", "Decision-making", "Behaviour"].map((focus) => (
                <Card key={focus}>
                  <CardContent className="p-5">
                    <p className="font-bold">{focus}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Training days and times can vary. Call us to check the current schedule.
            </p>
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

      {/* TRIAL CALL TO ACTION */}
      <section className="relative overflow-hidden bg-hero-gradient py-16 text-white">
        <div className="absolute inset-0 pitch-lines opacity-25" aria-hidden />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center md:px-6">
          <div>
            <Badge className="mb-4 border-gold/40 bg-white/10 text-gold uppercase tracking-widest">
              Take the first step
            </Badge>
            <h2 className="font-display text-4xl uppercase md:text-5xl">Come for a trial.</h2>
            <p className="mt-3 max-w-xl text-white/80">
              Tell us about your player and the team will get in touch to arrange a session.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full">
            <Link to="/contact">
              Request a trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
