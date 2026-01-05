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
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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
  const scrollToTraining = () => {
    const el = document.getElementById("training");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative -mt-[76px] h-[90vh] min-h-[700px] w-full overflow-hidden bg-black text-white">
      {/* BACKGROUND VIDEO LAYER */}
      <div className="absolute inset-0 z-0">
        {/* Poster fallback */}
        <img src={heroImg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />

        {/* 1. Blurred Video Background (Fills screen on desktop) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={heroImg}
          className="absolute inset-0 h-full w-full object-cover opacity-40 blur-3xl scale-110"
        >
          <source src="/academy-hero.mp4" type="video/mp4" />
        </video>

        {/* 2. Main Centered Video (Keeps the vertical huddle visible) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 mx-auto h-full w-auto object-contain shadow-[0_0_80px_rgba(0,0,0,0.6)]"
        >
          <source src="/academy-hero.mp4" type="video/mp4" />
        </video>

        {/* 3. PRO OVERLAYS: Ensures text readability */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 pitch-lines opacity-20" />
      </div>


      <div className="relative z-20 mx-auto flex h-full max-w-5xl flex-col justify-center px-4 md:px-6">
        {/* HEADING */}
        <h1 className="font-display text-5xl uppercase leading-[0.95] text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] md:text-7xl lg:text-8xl">
          Where the <span className="shine-text">game</span>
          <br />
          begins.
        </h1>

        {/* PARAGRAPH */}
        <p className="mt-6 max-w-2xl text-lg font-medium text-white drop-shadow-[0_2px_12px_rgba(0,0,0,1)] md:text-xl">
          A young grassroots academy built on the basics — first touch, movement and teamwork.
          We train four age groups, one session at a time.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-gold-gradient px-10 text-base font-black uppercase tracking-widest text-ink shadow-gold hover:scale-105 transition-all"
          >
            <Link to={"/contact" as any}>
              Contact <ArrowRight className="ml-2 h-4 w-4" />
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
    </section>
  );
}

/* ---------------- PILLARS ---------------- */
function Pillars() {
  const pillars = [
    {
      icon: Target,
      title: "Technical",
      desc: "Ball mastery, first touch and 1v1s built through consistent, focused repetition.",
    },
    {
      icon: Zap,
      title: "Tactical",
      desc: "Simple, age-appropriate principles of play — positioning, decisions, and reading the game.",
    },
    {
      icon: Heart,
      title: "Physical",
      desc: "Age-appropriate movement, coordination and conditioning — never overloaded.",
    },
    {
      icon: Shield,
      title: "Mental",
      desc: "Confidence, focus and respect for teammates, opponents and the game itself.",
    },
  ];
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

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map(({ icon: Icon, title, desc }) => (
          <HoverCard key={title} openDelay={80}>
            <HoverCardTrigger asChild>
              <Card className="group cursor-pointer overflow-hidden border-zinc-100 transition hover:-translate-y-2 hover:shadow-xl">
                <CardContent className="relative p-8">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-zinc-950 text-white transition group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl uppercase text-zinc-950">{title}</h3>
                  <p className="mt-2 text-sm text-zinc-500 font-medium">{desc}</p>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-72 bg-zinc-950 text-white border-zinc-800">
              <p className="font-display text-lg uppercase text-gold">{title}</p>
              <p className="mt-1 text-xs text-white/60">
                Woven into every session across all four age groups.
              </p>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
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
        <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl">
          Four age groups.
          <br />
          <span className="shine-text">One standard.</span>
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {groups.map((g) => (
            <Card
              key={g.tag}
              className="group overflow-hidden border-white/10 bg-white/5 text-white backdrop-blur-xl transition hover:-translate-y-2 hover:border-gold/60 hover:shadow-gold"
            >
              <div className="relative h-80 overflow-hidden bg-crimson-deep md:h-96">
                <img
                  src={g.img}
                  alt={`${g.title} training`}
                  className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
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
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] bg-hero-gradient shadow-lift border border-white/10">
          <div className="absolute inset-0 pitch-lines opacity-[0.12]" aria-hidden />
          <div className="absolute inset-0 bg-black/25" aria-hidden />
          <img
            src={logo}
            alt="Devsheel Football Academy"
            className="relative z-10 w-4/5 max-w-md drop-shadow-[0_8px_28px_rgba(0,0,0,0.55)]"
          />

          <div className="absolute bottom-6 right-6 z-10 rounded-2xl bg-gold-gradient px-6 py-4 text-ink shadow-xl">
            <p className="font-display text-[10px] uppercase tracking-[0.3em] font-black">
              Founder
            </p>
            <p className="font-display text-2xl uppercase">Head Coach</p>
          </div>
        </div>
        <div>
          <Badge className="mb-4 bg-zinc-950 text-white">Elite Coaching</Badge>
          <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl text-zinc-950">
            One coach.
            <br />
            <span className="text-primary">Every session.</span>
          </h2>
          <p className="mt-6 text-lg font-medium text-zinc-500 leading-relaxed">
            Run personally by the founder. Every player is seen and every session is led with intent.
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
    </section>
  );
}

/* ---------------- INDIAN FLAG COMPONENT ---------------- */
function IndianFlag({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div className={`relative ${className}`} style={{ perspective: "800px" }}>
      <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-700 shadow-lg" />
      <div className="absolute -left-1 top-0 h-3 w-3 rounded-full bg-gold shadow-md" />
      <div
        className="absolute left-[3px] top-2 h-[70%] w-[calc(100%-3px)] origin-left shadow-2xl"
        style={{
          animation: `flagWave 3.5s ease-in-out ${delay}s infinite`,
          filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.5))",
        }}
      >
        <div className="flex h-full w-full flex-col overflow-hidden">
          <div className="flex-1 bg-[#FF9933] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/15 mix-blend-overlay" />
          </div>
          <div className="flex-1 bg-white flex items-center justify-center relative overflow-hidden">
            <div className="relative aspect-square h-[85%] rounded-full border-[3px] border-[#0a3a8c]">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 h-[46%] w-[1.5px] bg-[#0a3a8c] origin-top"
                  style={{ transform: `translate(-50%, 0) rotate(${i * 15}deg)` }}
                />
              ))}
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a3a8c]" />
            </div>
          </div>
          <div className="flex-1 bg-[#138808] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/15 mix-blend-overlay" />
          </div>
        </div>
      </div>
    </div>
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
      {/* Wavy flags */}
      <div className="pointer-events-none absolute inset-y-0 left-2 hidden w-40 lg:w-56 md:block">
        <div className="sticky top-1/2 -translate-y-1/2">
          <IndianFlag className="h-64 w-40 lg:h-80 lg:w-56" delay={0} />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-2 hidden w-40 lg:w-56 md:block">
        <div className="sticky top-1/2 -translate-y-1/2">
          <IndianFlag className="h-64 w-40 lg:h-80 lg:w-56" delay={0.6} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32 text-center text-white">
      <img src={pitchImg} alt="" className="absolute inset-0 h-full w-full object-cover -z-10" />
      <div className="absolute inset-0 bg-hero-gradient opacity-95 -z-10" />
      <div className="absolute inset-0 bg-black/50 -z-10" />
      <div className="relative mx-auto max-w-4xl px-4 md:px-6">
        <div className="relative mx-auto mb-10 w-fit">
          {/* warm glow behind the mark */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse at center, color-mix(in oklab, var(--gold) 45%, transparent) 0%, color-mix(in oklab, var(--gold) 12%, transparent) 45%, transparent 72%)",
            }}
          />
          <img
            src={logoLight}
            alt="Devsheel Football Academy"
            className="relative mx-auto h-40 w-auto brightness-110 contrast-110 saturate-125 drop-shadow-[0_10px_36px_rgba(0,0,0,0.85)] md:h-52"
          />
        </div>
        <h2 className="font-display text-5xl uppercase leading-[0.95] text-white [text-shadow:0_4px_18px_rgba(0,0,0,0.85)] md:text-7xl">
          Come and{" "}
          <span className="text-gold [text-shadow:0_4px_18px_rgba(0,0,0,0.9)]">train.</span>
        </h2>
        <div className="mt-10 flex justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-gold-gradient px-12 h-16 text-lg font-black uppercase tracking-widest text-ink shadow-gold hover:scale-105 transition-transform"
          >
            <Link to={"/contact" as any}>Contact us now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
