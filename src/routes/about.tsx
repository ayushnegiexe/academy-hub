import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Heart,
  Compass,
  Users,
  Trophy,
  ArrowRight,
  MapPin,
  Clock,
  Ruler,
  Goal,
  Camera,
  Info,
  Construction,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import matchWide from "@/assets/match-wide.jpg";
import duelBall from "@/assets/duel-ball.jpg";
import runningPair from "@/assets/running-pair.jpg";
import sessionGround from "@/assets/session-ground.jpg";
import playerKit from "@/assets/player-kit.jpg";


export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Academy — Devsheel Football Academy" },
      {
        name: "description",
        content:
          "A young grassroots football academy training U10 to U18 — our approach, our values and photos from real sessions and matches.",
      },
      { property: "og:title", content: "The Academy — Devsheel Football Academy" },
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

const tournamentPhotos = [
  {
    src: matchWide,
    alt: "Devsheel players lining up during a tournament match",
    caption: "Tournament match day",
    note: "An away tournament we travelled to — not our home ground.",
  },
  {
    src: duelBall,
    alt: "Two players contesting the ball mid-air at a tournament",
    caption: "Contesting every ball",
    note: "Aerial duels against an older, stronger side.",
  },
  {
    src: runningPair,
    alt: "Two Devsheel players running side by side at a tournament",
    caption: "Pressing in pairs",
    note: "Recovery runs after losing the ball high up the pitch.",
  },
  {
    src: sessionGround,
    alt: "Warm-up before a tournament fixture",
    caption: "Pre-match warm-up",
    note: "Rondo and activation work before kick-off.",
  },
  {
    src: playerKit,
    alt: "Player in Devsheel kit at the tournament",
    caption: "In Devsheel colours",
    note: "First outing in the academy kit.",
  },
];


function AboutPage() {
  return (
    <>
      {/* HERO WITH PHOTO */}
      <section className="relative overflow-hidden py-28 text-white">
        <img src={matchWide} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-gradient opacity-80" aria-hidden />
        <div className="absolute inset-0 bg-black/45" aria-hidden />
        <div className="absolute inset-0 pitch-lines opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <Badge className="mb-4 border-gold/40 bg-white/10 text-gold uppercase tracking-widest">
            The Academy
          </Badge>
          <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.95] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] md:text-7xl">
            Built on grit.
            <br />
            <span className="shine-text">Powered by belief.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            A young grassroots academy training four age groups — U10, U12, U15 and U18. No shortcuts,
            no gimmicks: just sessions, matches and steady work on the basics.
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
            Devsheel is new. We don't claim trophies we haven't won or facilities we don't have. What we
            do have is a proper ground, a full session plan and a coach who is at every training.
          </p>
          <p className="mt-3 text-muted-foreground font-medium">
            We play friendlies and local tournaments when they come up, and the rest of the time we work
            on first touch, movement, decisions and behaviour.
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
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Heart, t: "Passion", d: "Love the ball. Love the process." },
              { icon: Compass, t: "Discipline", d: "On time, in kit, and in effort — every session." },
              { icon: Users, t: "Team", d: "Respect for teammates, opponents and the game." },
              { icon: Trophy, t: "Excellence", d: "Chase mastery, not just the scoreline." },
            ].map(({ icon: Icon, t, d }) => (
              <HoverCard key={t}>
                <HoverCardTrigger asChild>
                  <Card className="group cursor-pointer border-border transition hover:-translate-y-1 hover:shadow-lift">
                    <CardContent className="p-6">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="mt-4 font-display text-2xl uppercase">{t}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p className="text-sm">
                    Built into every session — small daily habits that compound into{" "}
                    <span className="font-semibold text-primary">{t.toLowerCase()}</span>.
                  </p>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      </section>

      {/* TOURNAMENT SECTION */}
      <section id="tournament" className="relative overflow-hidden bg-hero-gradient py-20 text-white scroll-mt-24">
        <div className="absolute inset-0 pitch-lines opacity-25" aria-hidden />
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Badge className="mb-4 border-gold/40 bg-white/10 text-gold uppercase tracking-widest">
                Tournament
              </Badge>
              <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-5xl">
                Away days.
                <br />
                <span className="shine-text">Real competition.</span>
              </h2>
              <p className="mt-4 font-medium text-white/85">
                These photos are from a tournament we travelled to play — an away ground, not ours.
                Tournaments are where the training gets tested.
              </p>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full border-gold/50 bg-white/10 text-white hover:bg-white/20"
                >
                  <Info className="mr-2 h-4 w-4" /> About these photos
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 border-zinc-800 bg-zinc-950 text-white">
                <p className="font-display text-lg uppercase text-gold">Away tournament</p>
                <p className="mt-1 text-xs text-white/70">
                  Taken at a tournament venue we were invited to. Our own academy ground gets its own
                  section below once the photos are ready.
                </p>
              </PopoverContent>
            </Popover>
          </div>

          {/* Carousel of tournament photos */}
          <Carousel opts={{ align: "start", loop: true }} className="mt-12">
            <CarouselContent className="-ml-4">
              {tournamentPhotos.map((g, i) => (
                <CarouselItem key={g.caption} className="pl-4 sm:basis-1/2 lg:basis-1/3">
                  <Dialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 shadow-lift transition hover:-translate-y-1 hover:border-gold/60 hover:shadow-gold"
                          >
                            <img
                              src={g.src}
                              alt={g.alt}
                              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <span className="absolute left-4 top-4 rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-black uppercase tracking-widest text-ink shadow-gold">
                              Match {i + 1}
                            </span>
                            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12 text-left">
                              <Camera className="h-4 w-4 text-gold" />
                              <span className="text-xs font-black uppercase tracking-widest text-gold">
                                {g.caption}
                              </span>
                            </span>
                          </button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>{g.note}</TooltipContent>
                    </Tooltip>
                    <DialogContent className="max-w-4xl border-white/10 bg-zinc-950 p-2 text-white">
                      <DialogTitle className="sr-only">{g.caption}</DialogTitle>
                      <DialogDescription className="sr-only">{g.alt}</DialogDescription>
                      <img src={g.src} alt={g.alt} className="w-full rounded-lg object-contain" />
                      <p className="px-3 pb-1 pt-1 text-xs font-black uppercase tracking-widest text-gold">
                        {g.caption}
                      </p>
                      <p className="px-3 pb-2 text-xs text-white/60">{g.note}</p>
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-gold/50 bg-white/10 text-white hover:bg-white/20" />
            <CarouselNext className="border-gold/50 bg-white/10 text-white hover:bg-white/20" />
          </Carousel>

          {/* Dynamic widget: tabbed tournament notes */}
          <Tabs defaultValue="format" className="mt-14">
            <TabsList className="bg-white/10 text-white">
              <TabsTrigger value="format">Format</TabsTrigger>
              <TabsTrigger value="squad">Squad</TabsTrigger>
              <TabsTrigger value="takeaways">Takeaways</TabsTrigger>
            </TabsList>
            <TabsContent
              value="format"
              className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <p className="text-sm text-white/85">
                Invitational group-stage tournament played over a weekend, short halves and rolling
                substitutions.
              </p>
            </TabsContent>
            <TabsContent
              value="squad"
              className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <p className="text-sm text-white/85">
                A mixed travelling squad drawn from our age groups, with everyone getting minutes.
              </p>
            </TabsContent>
            <TabsContent
              value="takeaways"
              className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <p className="text-sm text-white/85">
                Sharper first touch under pressure and calmer decisions in tight areas — the next block
                of sessions is built around it.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* ACADEMY GROUND (placeholder — content coming) */}
      <section id="ground" className="mx-auto max-w-7xl px-4 py-20 md:px-6 scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 uppercase tracking-widest">
              Academy ground
            </Badge>
            <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-5xl">
              Our own ground.
            </h2>
            <p className="mt-4 font-medium text-muted-foreground">
              This section is reserved for the Devsheel academy ground — photos, pitch details and
              session timings. Content coming soon.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { icon: MapPin, label: "Location — TBA" },
                { icon: Ruler, label: "Pitch size — TBA" },
                { icon: Goal, label: "Goals — TBA" },
                { icon: Clock, label: "Timings — TBA" },
              ].map(({ icon: Icon, label }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <span className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-dashed border-border bg-secondary/40 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>To be filled in once details are confirmed.</TooltipContent>
                </Tooltip>
              ))}
            </div>

            <Button asChild variant="outline" className="mt-6 rounded-full">
              <Link to="/contact">
                Ask about the ground <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-dashed">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Construction className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl uppercase">Photos coming soon</p>
                    <p className="text-xs text-muted-foreground">
                      Placeholders below — replace with real ground photos.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Skeleton className="col-span-2 aspect-[16/9] w-full rounded-2xl" />
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                </div>

                <Accordion type="single" collapsible className="mt-6">
                  <AccordionItem value="a">
                    <AccordionTrigger className="text-sm uppercase tracking-widest">
                      Facilities
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Details to be added.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="b">
                    <AccordionTrigger className="text-sm uppercase tracking-widest">
                      Getting there
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Directions and map to be added.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="c">
                    <AccordionTrigger className="text-sm uppercase tracking-widest">
                      Session timings
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Weekly schedule to be added.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </>
  );
}
