import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Target,
  Heart,
  Zap,
  Shield,
  ChevronRight,
  Users,
  Mail,
  Phone,
  Play,
  Pause,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeatureCarousel } from "@/components/feature-carousel";

// Assets
import heroImg from "@/assets/hero-training.jpg";
import pitchImg from "@/assets/pitch-aerial.jpg";
import logo from "@/assets/devsheel-logo-mark.png";
import logoLight from "@/assets/devsheel-logo-light.png";
import soldiersImg from "@/assets/tribute-soldiers-real.jpg";
import u10Img from "@/assets/under_10.jpg";
import u12Img from "@/assets/under_12.jpg";
import u15Img from "@/assets/group-u15.jpg";
import u18Img from "@/assets/under_18.jpg";
import coachPortrait from "@/assets/coach-portrait.png";
import headCoachBackground from "@/assets/head-coach-background.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Devsheel Football Academy — Grassroots football, done properly" },
      {
        name: "description",
        content:
          "A new football academy training across four age groups: U10, U12, U15 and U18. Sessions built on fundamentals and discipline.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      <Hero />
      <Pillars />
      <TrainingGroups />
      <TheCoach />
      <SoldierTribute />
      <FinalCTA />
    </main>
  );
}

/* ---------------- HERO (VIDEO BACKGROUND VERSION) ---------------- */
function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const scrollToTraining = () => {
    const el = document.getElementById("training");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const toggleVideoPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().catch((error: unknown) => {
        console.error("Could not resume the homepage hero video.", error);
      });
    } else {
      video.pause();
    }
  };

  return (
    <section className="relative -mt-[76px] h-[100svh] min-h-[600px] w-full overflow-hidden bg-black text-white">
      {/* BACKGROUND VIDEO LAYER */}
      <div className="absolute inset-0 z-0">
        {/* Poster fallback */}
        <img
          src={heroImg}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Full-bleed video keeps the hero covered across screen sizes and aspect ratios. */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={heroImg}
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover brightness-110"
        >
          <source src="/academy-hero.mp4" type="video/mp4" />
        </video>

        {/* Overlays preserve text contrast while keeping the footage brighter. */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 pitch-lines opacity-20" />
      </div>

      <div className="relative z-20 mx-auto flex h-full max-w-5xl flex-col justify-center px-4 md:px-6">
        <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-white/85 md:text-sm">
          <span className="h-px w-8 bg-gold" aria-hidden="true" />
          Dehradun · U10–U18
        </p>
        {/* HEADING */}
        <h1 className="font-display text-5xl uppercase leading-[0.95] text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] md:text-7xl lg:text-8xl">
          Where the <span className="shine-text">game</span>
          <br />
          begins.
        </h1>

        {/* PARAGRAPH */}
        <p className="mt-6 max-w-2xl text-lg font-medium text-white drop-shadow-[0_2px_12px_rgba(0,0,0,1)] md:text-xl">
          A young grassroots academy built on the basics — first touch, movement and teamwork. We
          train four age groups, one session at a time.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-gold-gradient px-10 text-base font-black uppercase tracking-widest text-ink shadow-gold hover:scale-105 transition-all"
          >
            <Link to={"/contact" as any}>
              Book a trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            size="lg"
            onClick={scrollToTraining}
            className="group relative rounded-full border-2 border-gold bg-white/95 px-10 text-base font-black uppercase tracking-widest text-ink shadow-gold transition-all hover:scale-105 hover:bg-white hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
          >
            <span className="flex items-center gap-2">
              Programs
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleVideoPlayback}
        aria-label={isVideoPlaying ? "Pause background video" : "Play background video"}
        aria-pressed={!isVideoPlaying}
        className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:bottom-8 md:right-8"
      >
        {isVideoPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        {isVideoPlaying ? "Pause video" : "Play video"}
      </button>
    </section>
  );
}

/* ---------------- PILLARS ---------------- */
const PILLARS = [
  {
    icon: Target,
    motion: "target",
    title: "Technical",
    desc: "Ball mastery, first touch and 1v1s built through consistent, focused repetition.",
  },
  {
    icon: Zap,
    motion: "zap",
    title: "Tactical",
    desc: "Simple, age-appropriate principles of play — positioning, decisions, and reading the game.",
  },
  {
    icon: Heart,
    motion: "heart",
    title: "Physical",
    desc: "Age-appropriate movement, coordination and conditioning — never overloaded.",
  },
  {
    icon: Shield,
    motion: "shield",
    title: "Mental",
    desc: "Confidence, focus and respect for teammates, opponents and the game itself.",
  },
];

function Pillars() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end">
        <div>
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 uppercase tracking-widest">
            Our approach
          </Badge>
          <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl text-zinc-950">
            Four pillars.
            <br />
            <span className="text-primary">One footballer.</span>
          </h2>
        </div>
        <p className="max-w-xl text-muted-foreground font-medium">
          Every session works on the player and the person.
        </p>
      </div>
      <FeatureCarousel
        items={PILLARS}
        ariaLabel="Four pillars of player development"
        itemLabel="pillar"
      />
    </section>
  );
}

/* ---------------- TRAINING GROUPS ---------------- */
function TrainingGroups() {
  const groups = [
    {
      tag: "U10",
      title: "Under 10",
      copy: "First steps in structured football. Coordination and ball familiarity.",
      focus: ["First touch", "Coordination", "Fun-led"],
      img: u10Img,
    },
    {
      tag: "U12",
      title: "Under 12",
      copy: "Building on the fundamentals. Introducing team shape and passing patterns.",
      focus: ["Passing", "Tactics", "Teamwork"],
      img: u12Img,
    },
    {
      tag: "U15",
      title: "Under 15",
      copy: "Bridging youth football and competitive play. Deeper tactical work.",
      focus: ["Positional roles", "Intelligence", "Fitness"],
      img: u15Img,
    },
    {
      tag: "U18",
      title: "Under 18",
      copy: "Preparing players for adult football. Higher intensity and tactical detail.",
      focus: ["Detail", "Leadership", "Analysis"],
      img: u18Img,
    },
  ];

  return (
    <section
      id="training"
      className="relative overflow-hidden bg-hero-gradient py-24 text-white scroll-mt-24"
    >
      <div className="absolute inset-0 pitch-lines opacity-30" aria-hidden />
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Badge className="mb-4 border-gold/40 bg-white/10 text-gold">Our programs</Badge>
            <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl">
              Four age groups.
              <br />
              <span className="shine-text">One standard.</span>
            </h2>
          </div>
          <p className="max-w-md pb-1 text-sm font-medium leading-relaxed text-white/80 md:text-base">
            Small, age-appropriate sessions — from first touch to the step up to adult football.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {groups.map((g) => (
            <Card
              key={g.tag}
              className="group overflow-hidden border-white/10 bg-white/5 text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lift"
            >
              <div className="relative h-80 overflow-hidden bg-crimson-deep md:h-96">
                <img
                  src={g.img}
                  alt={`${g.title} training`}
                  className="h-full w-full object-contain"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-crimson-deep to-transparent" />
                <div className="absolute left-6 top-6 rounded-full bg-gold-gradient px-4 py-1.5 text-xs font-black uppercase tracking-widest text-ink shadow-gold">
                  Academy
                </div>
                <p className="absolute bottom-4 left-6 font-display text-6xl text-gold drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                  {g.tag}
                </p>
              </div>
              <CardContent className="p-8">
                <h3 className="font-display text-2xl uppercase">{g.title}</h3>
                <p className="mt-3 text-sm text-white/80 leading-relaxed">{g.copy}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {g.focus.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-gold/30 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- THE COACH ---------------- */
function TheCoach() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-3xl gap-8 px-4 md:px-6">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#4b070c] shadow-lift">
          <img
            src={headCoachBackground}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <img
            src={logo}
            alt="Devsheel Football Academy"
            className="absolute right-3 top-4 z-10 w-[38%] max-w-xs drop-shadow-[0_8px_28px_rgba(0,0,0,0.55)] sm:right-6 sm:top-8 md:right-8 md:top-10"
          />
          <img
            src={coachPortrait}
            alt="Devsheel Football Academy head coach"
            className="absolute bottom-0 left-0 z-20 h-[76%] w-[56%] object-contain object-bottom drop-shadow-[0_8px_28px_rgba(0,0,0,0.45)] sm:h-[82%] sm:w-[58%] md:h-[88%]"
          />

          <div className="absolute bottom-4 right-4 z-30 rounded-2xl bg-gold-gradient px-4 py-3 text-ink shadow-xl sm:bottom-6 sm:right-6 sm:px-6 sm:py-4">
            <p className="font-display text-[9px] font-black uppercase tracking-[0.25em] sm:text-[10px] sm:tracking-[0.3em]">
              Founder
            </p>
            <p className="font-display text-lg uppercase sm:text-2xl">Head Coach</p>
          </div>
        </div>
        <div>
          <Badge className="mb-4 bg-primary/10 text-primary">Elite Coaching</Badge>
          <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl text-zinc-950">
            One coach.
            <br />
            <span className="text-primary">Every session.</span>
          </h2>
          <p className="mt-6 text-lg font-medium text-zinc-500 leading-relaxed">
            Run personally by the founder. Every player is seen and every session is led with
            intent.
          </p>
          <Button
            asChild
            className="mt-8 rounded-full h-14 px-10 bg-zinc-950 text-white hover:bg-zinc-800"
          >
            <Link to={"/contact" as any}>
              Get in touch <Mail className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div
        role="region"
        aria-label="Our coaching approach"
        className="relative mt-16 overflow-hidden border-y border-gold/25 bg-crimson-deep py-5"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-crimson-deep to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-crimson-deep to-transparent md:w-32" />
        <div className="flex w-max animate-marquee">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex min-w-[100vw] shrink-0 items-center justify-around gap-8 md:gap-12"
            >
              {[
                "Coaching with purpose",
                "Every player seen",
                "Fundamentals before results",
                "Better players. Better teammates.",
              ].map((tagline) => (
                <span
                  key={tagline}
                  className="flex items-center gap-8 whitespace-nowrap font-display text-sm uppercase tracking-[0.2em] text-white/90 md:gap-12 md:text-base"
                >
                  <span className="h-2 w-2 rotate-45 bg-gold" aria-hidden="true" />
                  {tagline}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SOLDIER TRIBUTE ---------------- */
function SoldierTribute() {
  const verses = [
    ["It is the soldier, not the holy man,", "who has given us freedom of religion."],
    ["It is the soldier, not the reporter,", "who has given us freedom of the press."],
    ["It is the soldier, not the poet,", "who has given us freedom of speech."],
    ["It is the soldier, not the coach,", "who lets a child chase a ball in peace."],
    [
      "It is the soldier who salutes the flag,",
      "who serves beneath the flag,",
      "and whose coffin is draped by the flag.",
    ],
  ];
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        backgroundImage: `url(${soldiersImg})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/45" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/70"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 py-32 md:px-6 md:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.4em] text-gold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            A Tribute
          </p>
          <h2 className="font-display text-4xl uppercase leading-[0.95] text-gold drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)] md:text-6xl lg:text-7xl">
            Because they stand,
            <br />
            <span className="text-white">we play.</span>
          </h2>
          <div className="mx-auto mt-16 space-y-8">
            {verses.map((lines, i) => (
              <div
                key={i}
                className="space-y-1.5 rounded-2xl border border-gold/25 bg-black/65 px-7 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md"
              >
                {lines.map((line, j) => (
                  <p
                    key={j}
                    className="text-base font-bold uppercase leading-snug tracking-wide text-gold-soft drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] md:text-xl"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-20 text-white md:py-28">
      <img src={pitchImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-zinc-950/75" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-r from-crimson-deep/80 via-transparent to-black/35"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-zinc-950/60 p-7 shadow-2xl backdrop-blur-md md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-gold">
                Take the first step
              </p>
              <h2 className="font-display text-4xl uppercase leading-[0.98] md:text-5xl">
                Start with a trial session.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
                Tell us a little about your player and we’ll be in touch to arrange a trial session.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/contact">
                  Book a trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/25 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white"
              >
                <a href="tel:+918218245579">
                  <Phone className="mr-2 h-4 w-4" />
                  Call the academy
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
