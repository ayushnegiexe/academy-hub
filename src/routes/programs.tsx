import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flag, Medal, Trophy } from "lucide-react";
import HTMLFlipBook from "react-pageflip";
import { forwardRef, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import mountainCoverImg from "@/assets/coach-mountain-background.svg";
import academyLogoImg from "@/assets/devsheel-logo-light.png";
import matchWideImg from "@/assets/match-wide.jpg";
import under10Img from "@/assets/under_10.jpg";
import under12Img from "@/assets/under_12.jpg";
import under18Img from "@/assets/under_18.jpg";
import groupU15Img from "@/assets/group-u15.jpg";
import teamAchievementImg1 from "@/assets/team-achievement-1.jpg";
import teamAchievementImg2 from "@/assets/team-achievement-2.jpg";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Devsheel Football Academy" },
      {
        name: "description",
        content:
          "Explore Devsheel Football Academy's U10, U12, U15 and U18 training, plus ideas for camps, tournaments and player development.",
      },
    ],
  }),
  component: ProgramsPage,
});

const GROUPS = [
  {
    tag: "U10",
    title: "Under 10",
    image: under10Img,
    imageAlt: "Young players learning football fundamentals",
    copy: "First steps in structured football. Coordination, ball familiarity and small-sided games — the age where the love of the ball is set.",
    focus: [
      "First touch & dribbling",
      "Small-sided games",
      "Basic positioning",
      "Fun-led sessions",
    ],
  },
  {
    tag: "U12",
    title: "Under 12",
    image: under12Img,
    imageAlt: "Under-12 players developing their football skills",
    copy: "Building on the fundamentals. Introducing simple team shape, passing patterns and the responsibility that comes with a shirt.",
    focus: ["Passing & receiving", "Introductory tactics", "Two-footed play", "Teamwork & respect"],
  },
  {
    tag: "U15",
    title: "Under 15",
    image: groupU15Img,
    imageAlt: "Under-15 players training together",
    copy: "Bridging youth football and competitive age-group play. Deeper tactical work, positional roles and physical development within safe limits.",
    focus: [
      "Positional roles",
      "Game intelligence",
      "Fitness fundamentals",
      "Occasional tournaments",
    ],
  },
  {
    tag: "U18",
    title: "Under 18",
    image: under18Img,
    imageAlt: "Older academy players training for the next level",
    copy: "Preparing players for adult football. Higher intensity, tactical detail and personal accountability on and off the pitch.",
    focus: [
      "Tactical detail",
      "Strength & conditioning",
      "Match analysis",
      "Leadership on the pitch",
    ],
  },
];

const TOURNAMENT_PATHWAYS = [
  {
    eyebrow: "Away fixtures",
    title: "We travel to compete.",
    collageImage: groupU15Img,
    collageImageAlt: "Devsheel youth team gathered together",
    copy: "Local tournaments and invited fixtures give players a chance to take training into a new environment, represent the academy and learn together.",
    points: [
      "Tournament photo gallery",
      "Event name, location and date",
      "Age group and match format",
    ],
    status: "Away tournament experiences",
  },
  {
    eyebrow: "At our academy",
    title: "We bring teams together.",
    copy: "A blueprint for future academy-hosted tournaments: welcome visiting teams, create a well-run matchday and celebrate every player taking part.",
    points: [
      "Host ground and event details",
      "Participating teams and age groups",
      "Fixtures, results and fair-play moments",
    ],
    status: "Hosting concept — details to be added",
  },
];

const ACADEMY_PILLARS = [
  {
    title: "Player development",
    headline: "We develop more than players.",
    copy: "A structured approach to developing technical ability, tactical awareness, physical strength, and confidence on the pitch.",
    points: [
      "Individual skill development and ball mastery",
      "Tactical awareness and decision-making",
      "Speed, agility, and coordination training",
      "Position-specific coaching",
      "Progress tracking and performance evaluation",
      "Building discipline, confidence, and teamwork",
    ],
  },
  {
    title: "Our training philosophy",
    headline: "Every session has a purpose.",
    copy: "Our training focuses on meaningful repetition, game-realistic situations, and continuous improvement.",
    points: [
      "Structured training sessions",
      "Match-inspired drills and exercises",
      "Small-sided games for better decision-making",
      "Technical training under pressure",
      "Individual feedback and coaching",
      "Progressive training methodology",
    ],
  },
  {
    title: "Matchday experience",
    headline: "Train. Compete. Improve.",
    copy: "Creating opportunities for players to apply their training in competitive situations.",
    points: [
      "Regular practice matches and friendly fixtures",
      "Match preparation and tactical planning",
      "Team selection and player rotation",
      "Post-match analysis and feedback",
      "Performance assessment",
      "Building competitive confidence",
    ],
  },
  {
    title: "Academy culture",
    headline: "More than a team. A community.",
    copy: "We aim to create an environment where every player feels motivated, supported, and encouraged to grow.",
    points: [
      "Respect for teammates, coaches, and opponents",
      "Discipline and sportsmanship",
      "Teamwork and collective responsibility",
      "Positive learning environment",
      "Encouraging confidence and leadership",
      "Celebrating effort, progress, and achievement",
    ],
  },
  {
    title: "Player welfare & safety",
    headline: "A safe space to grow.",
    copy: "Player well-being remains an important part of the academy experience.",
    points: [
      "Safe and supervised training sessions",
      "Age-appropriate coaching and activities",
      "Emphasis on proper warm-ups and recovery",
      "Hydration and fitness awareness",
      "Respectful and inclusive environment",
      "Communication with parents and guardians",
    ],
  },
  {
    title: "Future academy initiatives",
    headline: "Building the next generation.",
    copy: "Our vision is to create more opportunities for young footballers to experience the game and develop their potential.",
    points: [
      "Inter-academy tournaments and competitions",
      "Football camps and special training programs",
      "Guest coaching and football workshops",
      "Scouting and talent identification opportunities",
      "Academy events and community initiatives",
      "Long-term player development pathways",
    ],
  },
];

const ACHIEVEMENT_SPOTLIGHTS = [
  {
    title: "Team achievement",
    detail: "A proud team moment captured with the tournament trophy.",
  },
  {
    title: "Player milestone",
    detail: "Celebrate a player's effort, progress or contribution—not only goals.",
  },
  {
    title: "Matchday moment",
    detail: "Add a memorable performance, first appearance or moment of teamwork.",
  },
];

type MagazinePageData =
  | {
      kind: "cover";
      pageNumber: number;
    }
  | {
      kind: "editorial";
      heading: string;
      image: string;
      alt: string;
      pageNumber: number;
    };

const MAGAZINE_SPREADS = [
  {
    title: "Our academy",
    pages: [
      { kind: "cover", pageNumber: 1 },
      {
        kind: "editorial",
        heading: "Our Academy",
        image: groupU15Img,
        alt: "Devsheel youth team gathered together",
        pageNumber: 2,
      },
    ],
  },
  {
    title: "Player development",
    pages: [
      {
        kind: "editorial",
        heading: "Made for every player",
        image: matchWideImg,
        alt: "Devsheel players competing together on the pitch",
        pageNumber: 3,
      },
      {
        kind: "editorial",
        heading: "Moments that matter",
        image: teamAchievementImg1,
        alt: "Two academy players holding a tournament trophy",
        pageNumber: 4,
      },
    ],
  },
  {
    title: "Team moments",
    pages: [
      {
        kind: "editorial",
        heading: "A team, a family",
        image: teamAchievementImg2,
        alt: "Academy players celebrating a tournament achievement",
        pageNumber: 5,
      },
      {
        kind: "editorial",
        heading: "Your story starts here",
        image: groupU15Img,
        alt: "Devsheel youth players standing together",
        pageNumber: 6,
      },
    ],
  },
] satisfies { title: string; pages: [MagazinePageData, MagazinePageData] }[];

type MagazinePageProps = {
  page: MagazinePageData;
};

const MagazinePage = forwardRef<HTMLDivElement, MagazinePageProps>(({ page }, ref) => {
  if (page.kind === "cover") {
    return (
      <article
        ref={ref}
        className="relative isolate flex h-full flex-col overflow-hidden bg-[#520b12] px-4 py-5 text-[#fff8e9] shadow-[inset_-12px_0_18px_-14px_rgba(0,0,0,0.58)] sm:px-7 sm:py-8"
        data-density="soft"
      >
        <img
          src={mountainCoverImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-[72%] w-full object-cover object-center opacity-90"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[#520b12] via-[#520b12]/70 to-transparent"
          aria-hidden="true"
        />
        <div className="flex flex-1 flex-col items-center text-center">
          <img
            src={academyLogoImg}
            alt="Devsheel Football Academy"
            className="w-[92%] max-w-[340px] object-contain"
          />
          <p className="mt-5 font-display text-[clamp(0.9rem,3vw,1.8rem)] font-bold uppercase leading-[1.05] tracking-[0.08em] sm:mt-8">
            Learn. Play.
            <br />
            Grow together.
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-white/35 pt-2 text-[7px] font-semibold uppercase tracking-[0.16em] sm:pt-3 sm:text-[9px]">
          <span>Academy journal</span>
          <span>Vol. 01 · 2025</span>
        </div>
      </article>
    );
  }

  return (
    <article
      ref={ref}
      className={`relative h-full overflow-hidden bg-[#fbf7ed] px-3 py-3 text-[#321d17] sm:px-5 sm:py-5 md:px-7 md:py-6 ${
        page.pageNumber % 2 === 0
          ? "shadow-[inset_8px_0_18px_-16px_rgba(35,12,10,0.34)]"
          : "shadow-[inset_-8px_0_18px_-16px_rgba(35,12,10,0.34)]"
      }`}
      data-density="soft"
    >
      <div
        className={`pointer-events-none absolute inset-0 z-10 ${
          page.pageNumber % 2 === 0
            ? "bg-[linear-gradient(90deg,rgba(62,42,27,0.08),transparent_18%,transparent_86%,rgba(255,255,255,0.18))]"
            : "bg-[linear-gradient(90deg,rgba(255,255,255,0.18),transparent_14%,transparent_82%,rgba(62,42,27,0.08))]"
        }`}
        aria-hidden="true"
      />
      <div className="flex items-center justify-between border-b border-[#d8cbb7] pb-2 sm:pb-3">
        <p className="truncate text-[6px] font-black uppercase tracking-[0.11em] text-[#7b252b] sm:text-[8px] sm:tracking-[0.2em]">
          Devsheel · Academy journal
        </p>
        <span className="ml-1 shrink-0 font-display text-[9px] text-zinc-500 sm:text-xs">
          {String(page.pageNumber).padStart(2, "0")}
        </span>
      </div>
      <h2 className="mt-4 border-b border-[#b99458] pb-2 font-display text-[clamp(0.9rem,3.8vw,1.75rem)] font-bold leading-[1.05] text-[#501117] sm:mt-6">
        {page.heading}
      </h2>
      <div className="absolute bottom-[7%] left-[7%] right-[7%] top-[40%] overflow-hidden border-[4px] border-white bg-[#e6ddcd] shadow-[0_5px_15px_rgba(58,42,24,0.22)] sm:border-[6px]">
        <img
          src={page.image}
          alt={page.alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="absolute bottom-[0.5%] left-[7%] right-[7%] flex items-center justify-between border-t border-[#d8cbb7] pt-1.5 text-[6px] font-semibold uppercase tracking-[0.12em] text-[#856d56] sm:pt-2 sm:text-[8px]">
        <span>Devsheel Football Academy</span>
        <span>{String(page.pageNumber).padStart(2, "0")}</span>
      </div>
    </article>
  );
});
MagazinePage.displayName = "MagazinePage";

function AwayTournamentCollage() {
  return (
    <div
      className="relative isolate mb-8 h-64 overflow-hidden bg-black sm:h-80 md:mb-12 md:h-[26rem]"
      aria-label="Away tournament photo collage"
    >
      <div className="absolute left-[5%] top-[12%] z-0 h-[76%] w-[64%] -rotate-6 overflow-hidden rounded-xl border-[5px] border-white/90 shadow-[0_24px_70px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:-rotate-[8deg] sm:rounded-2xl sm:border-[8px]">
        <img
          src={matchWideImg}
          alt="Devsheel players competing in an away match"
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>
      <div className="absolute right-[5%] top-[7%] z-10 h-[84%] w-[64%] rotate-[3deg] overflow-hidden rounded-xl border-[5px] border-white shadow-[0_28px_75px_rgba(0,0,0,0.55)] transition-transform duration-500 hover:rotate-[1deg] sm:rounded-2xl sm:border-[9px]">
        <img
          src={groupU15Img}
          alt="Devsheel youth team gathered together"
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-black/25 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

function PhotoMagazine() {
  const bookRef = useRef<{
    pageFlip: () => {
      flip: (pageNumber: number) => void;
      flipNext: () => void;
      flipPrev: () => void;
    };
  }>(null);

  return (
    <div className="col-span-2 my-10 px-1 sm:my-14 sm:px-4">
      <div className="magazine-book-stage relative mx-auto max-w-5xl bg-[#efeee9] px-2 py-5 sm:px-8 sm:py-10 [perspective:1800px]">
        <div
          className="pointer-events-none absolute bottom-[4%] left-[8%] right-[6%] z-0 h-[7%] rounded-[50%] bg-[#40372b]/14 blur-[14px]"
          aria-hidden="true"
        />

        <div className="relative z-10 [transform:rotateX(2deg)_rotateY(-0.25deg)] [transform-style:preserve-3d]">
          <div className="relative">
            <div
              className="pointer-events-none absolute inset-x-[-1%] top-[8%] bottom-[4%] z-0 rounded-[2px] bg-[#58171c] shadow-[0_5px_8px_-5px_rgba(36,20,17,0.36)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-[-0.4%] bottom-[4%] z-[1] h-[4%] border-b border-[#b7a995]/70 bg-[repeating-linear-gradient(to_bottom,#fffdf7_0px,#e6ded2_1px,#f8f4ec_2px)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute right-[-0.6%] top-[9%] bottom-[8%] z-[1] w-[1.2%] border-r border-[#b7a995]/70 bg-[repeating-linear-gradient(to_right,#e2d9cc_0px,#fffdf7_1px,#f2ece2_2px)]"
              aria-hidden="true"
            />
            <HTMLFlipBook
              ref={bookRef}
              width={420}
              height={500}
              size="stretch"
              minWidth={150}
              maxWidth={520}
              minHeight={220}
              maxHeight={650}
              startPage={0}
              drawShadow
              flippingTime={1100}
              usePortrait={false}
              startZIndex={10}
              autoSize
              maxShadowOpacity={0.3}
              showCover={false}
              mobileScrollSupport={false}
              clickEventForward={false}
              useMouseEvents
              swipeDistance={30}
              showPageCorners={false}
              disableFlipByClick={false}
              className="relative z-10 mx-auto"
              style={{}}
            >
              {MAGAZINE_SPREADS.flatMap((magazineSpread) =>
                magazineSpread.pages.map((page) => (
                  <MagazinePage key={`${magazineSpread.title}-${page.pageNumber}`} page={page} />
                )),
              )}
            </HTMLFlipBook>
            <div
              className="pointer-events-none absolute inset-y-[10%] left-1/2 z-30 w-8 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(49,27,19,0.04)_24%,rgba(36,20,17,0.12)_48%,rgba(255,249,235,0.18)_54%,rgba(90,57,38,0.04)_78%,transparent)] sm:w-10"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent, black 7%, black 93%, transparent)",
              }}
              aria-hidden="true"
            >
              <span className="absolute inset-y-[5%] left-[54%] w-px bg-gradient-to-b from-transparent via-[#fff7e6]/25 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgramsPage() {
  const renderPillar = (
    { title, headline, copy, points }: (typeof ACADEMY_PILLARS)[number],
    index: number,
  ) => (
    <article
      key={title}
      className={`min-w-0 ${
        [
          "col-start-1 row-start-1",
          "col-start-2 row-start-2",
          "col-start-1 row-start-3",
          "col-start-2 row-start-4",
          "col-start-1 row-start-5",
          "col-start-2 row-start-6",
        ][index]
      } md:col-start-auto md:row-start-auto ${
        index % 2 === 1 ? "border-l border-zinc-300 pl-3 sm:pl-6" : "pr-3 sm:pr-6"
      } ${index > 0 ? "-mt-16 sm:mt-0" : ""} ${index > 1 ? "border-t border-zinc-300 pt-6" : ""}`}
    >
      <p className="text-[9px] font-black uppercase tracking-wide text-gold sm:text-[10px] sm:tracking-[0.2em]">
        {title}
      </p>
      <h4 className="mt-2 font-display text-sm uppercase leading-tight sm:text-xl">{headline}</h4>
      <p className="mt-2 text-[10px] leading-relaxed text-zinc-700 sm:text-sm">{copy}</p>
      <ul className="mt-3 space-y-2">
        {points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-2 text-[9px] leading-relaxed text-zinc-600 sm:text-xs"
          >
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
    </article>
  );

  return (
    <>
      <section className="relative overflow-hidden bg-hero-gradient py-24 text-white">
        <div className="absolute inset-0 pitch-lines opacity-30" aria-hidden="true" />
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <Badge className="mb-4 border-gold/40 bg-white/10 text-gold uppercase tracking-widest">
            Player pathways
          </Badge>
          <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.95] md:text-7xl">
            Train with purpose.
            <br />
            <span className="shine-text">Grow through the game.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            A clear age-group pathway built around good coaching, consistent fundamentals and
            opportunities to put learning into practice.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {GROUPS.map((group) => (
              <a
                key={group.tag}
                href={`#group-${group.tag.toLowerCase()}`}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:border-gold hover:text-gold"
              >
                {group.tag}
              </a>
            ))}
            <a
              href="#tournaments"
              className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:border-gold hover:text-gold"
            >
              Tournaments
            </a>
          </div>
        </div>
      </section>

      <section id="age-groups" className="scroll-mt-24 bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <Badge className="mb-4 bg-primary/10 uppercase tracking-widest text-primary">
                Weekly training
              </Badge>
              <h2 className="font-display text-4xl uppercase leading-[0.95] text-zinc-950 md:text-6xl">
                The right challenge.
                <br />
                <span className="text-primary">At every age.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
              Training is shaped around each stage of a player&apos;s development—not a
              one-size-fits-all approach.
            </p>
          </div>

          <div className="grid gap-6">
            {GROUPS.map((group, index) => (
              <Card
                key={group.tag}
                id={`group-${group.tag.toLowerCase()}`}
                className="group grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] overflow-hidden border-zinc-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-lift md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
              >
                <div
                  className={`relative h-full min-h-48 overflow-hidden bg-zinc-200 sm:min-h-60 md:min-h-72 ${
                    index % 2 === 1 ? "order-2" : "order-1"
                  }`}
                >
                  <img
                    src={group.image}
                    alt={group.imageAlt}
                    className="absolute inset-0 h-full w-full object-contain object-center"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent md:bg-gradient-to-r md:from-black/35 md:via-transparent md:to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-2 bottom-2 md:hidden">
                    <span className="font-display text-2xl text-white drop-shadow-lg sm:text-5xl">
                      {group.tag}
                    </span>
                  </div>
                </div>
                <CardContent
                  className={`flex flex-col justify-center p-2.5 sm:p-6 md:p-8 ${
                    index % 2 === 1 ? "order-1" : "order-2"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-1 border-b border-zinc-100 pb-2 sm:mb-4 sm:pb-4 md:mb-5 md:pb-5">
                    <p className="font-display text-xl leading-none text-primary sm:text-4xl md:text-5xl">
                      {group.tag}
                    </p>
                    <span className="rounded-full bg-zinc-100 px-1.5 py-1 text-[7px] font-black uppercase tracking-wide text-zinc-500 sm:px-3 sm:text-[10px] sm:tracking-[0.2em]">
                      Age group
                    </span>
                  </div>
                  <h3 className="font-display text-sm uppercase leading-tight text-zinc-950 sm:text-xl md:text-2xl">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:mt-3 sm:text-sm md:text-base">
                    {group.copy}
                  </p>
                  <ul className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                    {group.focus.map((focus) => (
                      <li
                        key={focus}
                        className="flex items-start gap-1.5 text-[10px] font-medium leading-tight text-zinc-700 sm:gap-2 sm:text-xs md:text-sm"
                      >
                        <span
                          className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold sm:mt-1.5 sm:h-2 sm:w-2"
                          aria-hidden="true"
                        />
                        {focus}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="tournaments" className="scroll-mt-24 bg-zinc-950 py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 max-w-3xl">
            <Badge className="mb-4 border-gold/40 bg-white/10 uppercase tracking-widest text-gold">
              <Trophy className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
              Tournament football
            </Badge>
            <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl">
              Represent the academy.
              <br />
              <span className="shine-text">Celebrate every player.</span>
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-white/70">
              A space to show tournament journeys—both the events our teams travel to and the
              tournaments we may host at our own academy.
            </p>
          </div>

          <AwayTournamentCollage />

          <div className="grid grid-cols-2 gap-0 divide-x divide-white/20">
            {TOURNAMENT_PATHWAYS.map(({ eyebrow, title, copy, points, status }, index) => (
              <article
                key={title}
                className={`group min-w-0 overflow-hidden text-white ${
                  index === 1
                    ? "pl-3 pt-56 sm:pl-5 sm:pt-9 lg:pl-10 lg:pt-0"
                    : "pr-3 sm:pr-5 lg:pr-10"
                }`}
              >
                <div className="py-7 sm:py-9">
                  <div className="flex items-start gap-2 sm:gap-5">
                    <span
                      className="mt-1 h-5 w-5 shrink-0 rounded-full bg-gold sm:mt-1.5 sm:h-10 sm:w-10"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wide text-gold sm:text-[10px] sm:tracking-[0.2em]">
                        {eyebrow}
                      </p>
                      <h3 className="mt-1 font-display text-base uppercase leading-tight sm:text-2xl">
                        {title}
                      </h3>
                      <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/75 sm:mt-4 sm:text-base">
                        {copy}
                      </p>
                    </div>
                  </div>
                  <ul className="ml-6 mt-4 space-y-2 sm:ml-[3.75rem] sm:mt-5">
                    {points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-[10px] font-medium leading-relaxed text-white/70 sm:gap-3 sm:text-sm"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="ml-6 mt-4 text-[9px] font-black uppercase tracking-wide text-gold sm:ml-[3.75rem] sm:mt-5 sm:text-[10px] sm:tracking-[0.18em]">
                    {status}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-10 text-zinc-950">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gold">
            The academy experience
          </p>
          <h3 className="mt-2 max-w-2xl font-display text-3xl uppercase sm:text-4xl">
            Developing every part of the player.
          </h3>
          <div className="mt-7 grid grid-cols-2 gap-y-8">
            {ACADEMY_PILLARS.slice(0, 3).map((pillar, index) => renderPillar(pillar, index))}
          </div>
          <PhotoMagazine />
          <div className="grid grid-cols-2 gap-y-8">
            {ACADEMY_PILLARS.slice(3).map((pillar, index) => renderPillar(pillar, index + 3))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mt-16 border-t border-white/10 pt-10">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
                <Medal className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gold">
                  The people behind the progress
                </p>
                <h3 className="mt-2 font-display text-3xl uppercase sm:text-4xl">
                  Academy achievements.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
                  A future-ready space for verified team results and individual milestones. Add
                  player names and photos only with family permission.
                </p>
              </div>
            </div>

            <div className="mt-7 divide-y divide-white/15 md:hidden">
              {ACHIEVEMENT_SPOTLIGHTS.map(({ title, detail }, index) => (
                <article key={title} className="grid grid-cols-[3.5rem_1fr] gap-3 py-5 first:pt-0">
                  <p className="border-r border-gold/50 pr-3 font-display text-3xl leading-none text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
                      Academy spotlight
                    </p>
                    <h4 className="mt-1 font-display text-lg uppercase leading-tight text-gold">
                      {title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-white/70">{detail}</p>
                    {index === 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <img
                          src={teamAchievementImg1}
                          alt="Two academy players holding a tournament trophy"
                          className="aspect-[3/4] w-full rounded-lg border border-white/15 object-cover"
                          loading="lazy"
                        />
                        <img
                          src={teamAchievementImg2}
                          alt="Three academy players posing with a tournament trophy"
                          className="aspect-[3/4] w-full rounded-lg border border-white/15 object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
                      {index === 0 ? "Tournament team photos" : "Add photo · date · age group"}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-7 hidden gap-4 md:grid md:grid-cols-3">
              {ACHIEVEMENT_SPOTLIGHTS.map(({ title, detail }, index) => (
                <div
                  key={title}
                  className="rounded-2xl border border-dashed border-white/20 bg-white/[0.04] p-5 sm:p-6"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                    Spotlight {String(index + 1).padStart(2, "0")}
                  </p>
                  <h4 className="mt-4 font-display text-xl uppercase text-gold">{title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{detail}</p>
                  <p className="mt-5 border-t border-white/10 pt-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Add photo · date · age group
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-7xl rounded-3xl bg-hero-gradient p-8 text-white shadow-lift md:p-12">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-gold">
                Start with a session
              </p>
              <h2 className="mt-3 font-display text-3xl uppercase md:text-5xl">
                Find the right group.
              </h2>
              <p className="mt-3 max-w-lg leading-relaxed text-white/75">
                Ask about current age groups, session times and how to arrange a trial.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gold-gradient text-ink hover:brightness-110"
            >
              <Link to="/contact">
                Book a trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
