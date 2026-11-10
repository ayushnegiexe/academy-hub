import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/match-wide.jpg";
import historyImage from "@/assets/duel-ball.jpg";
import philosophyImage from "@/assets/session-ground.jpg";
import achievementsImage from "@/assets/team-achievement-1.jpg";
import teamsImage from "@/assets/group-u15.jpg";
import coachesImage from "@/assets/coach-portrait.png";
import journeyImage from "@/assets/running-pair.jpg";
import journalImage from "@/assets/team-achievement-2.jpg";

export const Route = createFileRoute("/playbook")({
  head: () => ({
    meta: [
      { title: "The Academy Playbook — Devsheel Football Academy" },
      {
        name: "description",
        content:
          "Explore the Devsheel Football Academy through an interactive guide to its origins, philosophy, achievements and teams.",
      },
    ],
  }),
  component: AcademyPlaybookPage,
});

const CHAPTERS = [
  {
    id: "origins",
    number: "01",
    title: "Our Origins",
    position: "left-[17%] top-[36%] sm:left-[17%] sm:top-[36%]",
    image: historyImage,
    imageAlt: "Devsheel players contesting the ball during a match",
    eyebrow: "A young grassroots academy",
    description:
      "Devsheel is described as a young grassroots academy. The founding year and first-session details have not been published.",
    note: "Explore the horizontal origins timeline for verified details and clearly marked historical fields.",
    to: "/about",
    linkLabel: "Read about the academy",
  },
  {
    id: "philosophy",
    number: "02",
    title: "Our Philosophy",
    position: "left-[39%] top-[65%] sm:left-[39%] sm:top-[65%]",
    image: philosophyImage,
    imageAlt: "A football training session on the academy ground",
    eyebrow: "Every session has a purpose",
    description:
      "Training focuses on meaningful repetition, game-realistic situations and continuous improvement. Players work on first touch, movement, decisions and behaviour.",
    note: "The approach includes small-sided games, individual feedback and age-appropriate development.",
    to: "/programs",
    linkLabel: "Explore player development",
  },
  {
    id: "achievements",
    number: "03",
    title: "Achievements",
    position: "left-[61%] top-[36%] sm:left-[61%] sm:top-[36%]",
    image: achievementsImage,
    imageAlt: "Devsheel players celebrating a team achievement",
    eyebrow: "Proud moments, honestly told",
    description:
      "A team achievement is worth celebrating. We share real moments from the players and teams without adding unverified award names, dates or statistics.",
    note: "The academy does not claim trophies or records that have not been documented.",
    to: "/about",
    linkLabel: "See academy moments",
  },
  {
    id: "teams",
    number: "04",
    title: "Our Teams",
    position: "left-[83%] top-[65%] sm:left-[83%] sm:top-[65%]",
    image: teamsImage,
    imageAlt: "Devsheel youth players gathered together",
    eyebrow: "Four age groups, one academy",
    description:
      "The academy's current programs are for Under 10, Under 12, Under 15 and Under 18 players, with training shaped around their stage of development.",
    note: "Each program page outlines its age-group focus and training themes.",
    to: "/programs",
    linkLabel: "View the age-group programs",
  },
] as const;

const ORIGINS_TIMELINE = [
  {
    year: "Year to be confirmed",
    title: "The Beginning",
    image: historyImage,
    imageAlt: "Devsheel players contesting the ball during a match",
    summary:
      "Devsheel is described as a young grassroots academy. Its founding year and first-session details are not yet published.",
    detail:
      "The academy's published story describes Devsheel as young. A confirmed founding year, the people who started it and the account of the first sessions can be added here when verified by the academy.",
    supportingPhotos: [
      { image: teamsImage, alt: "Devsheel youth players gathered together" },
      { image: philosophyImage, alt: "A football training session on the academy ground" },
    ],
  },
  {
    year: "Year to be confirmed",
    title: "The Early Years",
    image: philosophyImage,
    imageAlt: "A football training session on the academy ground",
    summary:
      "No dated account of the academy's early years is currently published. Add verified milestones here.",
    detail:
      "This chapter is reserved for a confirmed account of the early years: when regular sessions began, how the programme developed and which photographs belong to that period. Dates and events should be added from academy records.",
    supportingPhotos: [
      { image: historyImage, alt: "Devsheel players contesting the ball during a match" },
      { image: teamsImage, alt: "Devsheel youth players gathered together" },
    ],
  },
  {
    year: "Year to be confirmed",
    title: "The First Steps Forward",
    image: journeyImage,
    imageAlt: "Devsheel players working together during a match",
    summary:
      "The academy plays friendlies and local tournaments when opportunities arise; early fixture dates are not published.",
    detail:
      "Friendlies and local tournaments are part of the academy's current football experience. This space can tell the verified story of early fixtures and first opportunities to compete once the dates, teams and photographs are confirmed.",
    supportingPhotos: [
      { image: achievementsImage, alt: "Devsheel players celebrating a team achievement" },
      { image: historyImage, alt: "Devsheel players contesting the ball during a match" },
    ],
  },
  {
    year: "Year to be confirmed",
    title: "A Growing Academy",
    image: teamsImage,
    imageAlt: "Devsheel youth players gathered together",
    summary:
      "Current programs cover U10, U12, U15 and U18. Verified dates for their development can be added here.",
    detail:
      "The academy currently lists Under 10, Under 12, Under 15 and Under 18 programmes. The dates each age group began, and other confirmed stages in the academy's growth, are not published yet.",
    supportingPhotos: [
      { image: philosophyImage, alt: "A football training session on the academy ground" },
      { image: coachesImage, alt: "Devsheel Football Academy coach" },
    ],
  },
  {
    year: "Year to be confirmed",
    title: "Defining Moments",
    image: achievementsImage,
    imageAlt: "Devsheel players celebrating a team achievement",
    summary:
      "A place for documented team milestones. No dated achievement record is currently published.",
    detail:
      "The academy shares real team and tournament photographs, but no dated record of named achievements is published here. Add only milestones that the academy can verify, with the original event details and photographs.",
    supportingPhotos: [
      { image: journeyImage, alt: "Devsheel players working together during a match" },
      { image: teamsImage, alt: "Devsheel youth players gathered together" },
    ],
  },
  {
    year: "Year to be confirmed",
    title: "The Journey Continues",
    image: journalImage,
    imageAlt: "Devsheel academy players together after a team achievement",
    summary:
      "Today the academy continues with regular sessions, a full session plan and a coach present at every training.",
    detail:
      "The academy describes its current work as regular training with a full session plan and a coach present at every training. Add dated recent chapters and future updates here as the academy's story continues.",
    supportingPhotos: [
      { image: coachesImage, alt: "Devsheel Football Academy coach" },
      { image: philosophyImage, alt: "A football training session on the academy ground" },
    ],
  },
] as const;

type OriginsTimelineProps = {
  sectionRef: RefObject<HTMLElement | null>;
  onReturnToPitch: () => void;
};

function OriginsTimeline({ sectionRef, onReturnToPitch }: OriginsTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; scrollLeft: number } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const updateProgress = () => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const maxScroll = timeline.scrollWidth - timeline.clientWidth;
    setProgress(maxScroll > 0 ? timeline.scrollLeft / maxScroll : 0);
  };

  const scrollToChapter = (index: number) => {
    const timeline = timelineRef.current;
    const chapter = timeline?.querySelector<HTMLElement>(`[data-origin-index="${index}"]`);
    if (!timeline || !chapter) return;
    timeline.scrollTo({
      left: chapter.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  const selectChapter = (index: number) => {
    setSelectedIndex(index);
    scrollToChapter(index);
  };

  const moveTimeline = (direction: -1 | 1) => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const currentIndex = ORIGINS_TIMELINE.reduce((closestIndex, _, index) => {
      const closestChapter = timeline.querySelector<HTMLElement>(
        `[data-origin-index="${closestIndex}"]`,
      );
      const chapter = timeline.querySelector<HTMLElement>(`[data-origin-index="${index}"]`);
      if (!closestChapter || !chapter) return closestIndex;
      return Math.abs(chapter.offsetLeft - timeline.scrollLeft) <
        Math.abs(closestChapter.offsetLeft - timeline.scrollLeft)
        ? index
        : closestIndex;
    }, 0);
    const nextIndex = Math.min(ORIGINS_TIMELINE.length - 1, Math.max(0, currentIndex + direction));
    scrollToChapter(nextIndex);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      (event.target instanceof Element && event.target.closest("button"))
    )
      return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    event.currentTarget.scrollLeft =
      dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
  };

  const selectedChapter = selectedIndex === null ? null : ORIGINS_TIMELINE[selectedIndex];

  useEffect(() => {
    if (selectedIndex === null) return;
    const frame = requestAnimationFrame(() => scrollToElement(detailRef.current));
    return () => cancelAnimationFrame(frame);
  }, [selectedIndex]);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const maxScroll = timeline.scrollWidth - timeline.clientWidth;
      const canScroll =
        event.deltaY < 0 ? timeline.scrollLeft > 0 : timeline.scrollLeft < maxScroll;
      if (!canScroll) return;

      event.preventDefault();
      timeline.scrollBy({ left: event.deltaY, behavior: "auto" });
    };

    timeline.addEventListener("wheel", handleWheel, { passive: false });
    return () => timeline.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="origins-heading"
      className="relative left-1/2 w-screen -translate-x-1/2 scroll-mt-20 overflow-hidden bg-[#242423] text-[#f6f1e7]"
    >
      <img
        src={teamsImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center grayscale"
      />
      <div className="absolute inset-0 bg-[#171817]/70" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,19,18,0.96)_0%,rgba(24,25,24,0.89)_34%,rgba(25,26,25,0.62)_68%,rgba(22,23,22,0.56)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_calc(12.5%-1px),rgba(255,255,255,0.08)_12.5%,transparent_calc(12.5%+1px))]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-[1600px] grid-cols-1 lg:grid-cols-[minmax(290px,0.76fr)_minmax(0,1.8fr)]">
        <div className="relative z-10 flex flex-col justify-center px-5 pb-6 pt-12 sm:px-10 lg:px-12 lg:py-16">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#d9b85e]">
            Devsheel · academy archive
          </p>
          <h2
            id="origins-heading"
            className="max-w-xl font-display text-5xl uppercase leading-[0.92] text-[#f5f1e9] sm:text-6xl xl:text-7xl"
          >
            Our <span className="text-[#d9b85e]">Origins</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/80 sm:text-base">
            A young grassroots academy. The full story is still being written, one session and one
            team at a time.
          </p>
          <p className="mt-4 max-w-md text-xs leading-6 text-white/60">
            Explore the chapters from left to right. Historical dates and event details will be
            added when confirmed by the academy.
          </p>
          <button
            type="button"
            onClick={onReturnToPitch}
            className="mt-7 inline-flex w-fit items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e2c76f] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2c76f]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the tactical pitch
          </button>
          <div className="mt-8 hidden h-[2px] w-10 bg-[#e2c76f] lg:block" aria-hidden="true" />
          <p className="mt-3 hidden text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45 lg:block">
            Existing academy photographs · dates unverified
          </p>
        </div>

        <div className="relative flex min-w-0 flex-col justify-end pb-5 lg:py-12">
          <div className="mb-3 flex items-center justify-between px-5 sm:px-8 lg:absolute lg:right-8 lg:top-8 lg:z-20 lg:mb-0 lg:px-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/55 sm:text-[10px]">
              A story in six chapters · dates to be confirmed
            </p>
            <div className="ml-3 flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => moveTimeline(-1)}
                aria-label="Previous origins chapter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:border-[#e2c76f] hover:bg-[#76272d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2c76f]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => moveTimeline(1)}
                aria-label="Next origins chapter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:border-[#e2c76f] hover:bg-[#76272d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2c76f]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={timelineRef}
            onScroll={updateProgress}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`relative min-w-0 touch-pan-x overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isDragging ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
            aria-label="Horizontal timeline of academy origins"
          >
            <div className="relative flex h-[480px] min-w-max items-stretch gap-4 px-5 sm:h-[500px] sm:gap-5 sm:px-8 lg:pt-10">
              <div
                className="pointer-events-none absolute left-0 right-0 top-[230px] h-px bg-white/45 sm:top-[240px]"
                aria-hidden="true"
              />
              {ORIGINS_TIMELINE.map((chapter, index) => {
                const isSelected = selectedIndex === index;
                const accentCard = index % 2 === 1;
                return (
                  <article
                    key={chapter.title}
                    data-origin-index={index}
                    className="relative z-10 h-full w-[205px] shrink-0 snap-start sm:w-[225px]"
                  >
                    <span
                      className={`pointer-events-none absolute left-[17px] z-0 w-px bg-white/55 ${
                        index % 2 === 0
                          ? "top-[188px] h-[42px] sm:top-[198px]"
                          : "top-[240px] h-[54px] sm:h-[64px]"
                      }`}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      onClick={() => selectChapter(index)}
                      aria-label={`Open ${chapter.title}, year to be confirmed`}
                      aria-pressed={isSelected}
                      className={`absolute left-0 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1d275] sm:h-10 sm:w-10 ${
                        index % 2 === 0
                          ? "top-[213px] sm:top-[219px]"
                          : "top-[226px] sm:top-[232px]"
                      } ${
                        isSelected
                          ? "border-[#f2d46a] bg-[#76272d] text-white"
                          : "border-white/75 bg-[#252525] text-white hover:border-[#f2d46a] hover:bg-[#76272d]"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </button>

                    <button
                      type="button"
                      onClick={() => selectChapter(index)}
                      aria-label={`Open expanded view: ${chapter.title}`}
                      className={`absolute left-0 w-full overflow-hidden border text-left shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1d275] ${
                        index % 2 === 0
                          ? "top-2 border-white/45 bg-[#2b2b2b]/80 text-white backdrop-blur-[2px] sm:top-3"
                          : "top-[290px] border-[#f1d275] bg-[#e4c64d] text-[#292723] sm:top-[302px]"
                      } ${isSelected ? "ring-2 ring-[#f1d275]" : ""}`}
                    >
                      {index % 3 !== 0 && (
                        <img
                          src={chapter.image}
                          alt={chapter.imageAlt}
                          draggable={false}
                          className={`h-[78px] w-full object-cover ${
                            accentCard ? "grayscale-[0.35]" : "grayscale-[0.15]"
                          }`}
                          loading="lazy"
                        />
                      )}
                      <div className="p-3.5">
                        <p
                          className={`font-display text-3xl leading-none ${
                            accentCard ? "text-[#fff9e9]" : "text-[#e7ca61]"
                          }`}
                        >
                          TBC
                        </p>
                        <h3 className="mt-2 font-serif text-lg font-semibold leading-tight">
                          {chapter.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-[10px] leading-[1.45] opacity-80">
                          {chapter.summary}
                        </p>
                      </div>
                      {index % 3 === 0 && (
                        <img
                          src={chapter.image}
                          alt={chapter.imageAlt}
                          draggable={false}
                          className="h-[68px] w-full object-cover grayscale-[0.15]"
                          loading="lazy"
                        />
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-1 px-5 sm:px-8 lg:mt-0">
            <div
              className="h-px w-full bg-white/30"
              role="progressbar"
              aria-label="Origins timeline progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
              <div
                className="h-full origin-left bg-[#e2c76f] transition-transform duration-200"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
            <nav
              className="mt-3 flex justify-between gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Origins chapters"
            >
              {ORIGINS_TIMELINE.map((chapter, index) => (
                <button
                  key={chapter.title}
                  type="button"
                  onClick={() => selectChapter(index)}
                  aria-label={`Go to chapter ${index + 1}: ${chapter.title}, year to be confirmed`}
                  aria-current={selectedIndex === index ? "step" : undefined}
                  className={`shrink-0 text-[9px] font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2c76f] sm:text-[10px] ${
                    selectedIndex === index ? "text-[#f1d275]" : "text-white/70 hover:text-white"
                  }`}
                >
                  <span className="mr-1">{String(index + 1).padStart(2, "0")}</span>
                  <span className="hidden sm:inline">TBC</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {selectedChapter && (
        <section
          ref={detailRef}
          key={selectedChapter.title}
          aria-labelledby="origin-detail-heading"
          className="relative z-10 scroll-mt-20 bg-[#f4f0e7] px-5 py-10 text-[#292522] sm:px-10 sm:py-14 lg:px-16"
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div className="relative">
              <img
                src={selectedChapter.image}
                alt={selectedChapter.imageAlt}
                className="aspect-[4/3] max-h-[560px] w-full bg-[#ded5c7] object-cover"
              />
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8b7b6c]">
                Existing academy photograph · date not recorded
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#76272d]">
                Chapter {String(selectedIndex! + 1).padStart(2, "0")} · {selectedChapter.year}
              </p>
              <h3
                id="origin-detail-heading"
                className="mt-3 font-serif text-4xl font-medium leading-[1.05] text-[#302925] sm:text-5xl"
              >
                {selectedChapter.title}
              </h3>
              <p className="mt-5 text-sm leading-7 text-[#514840] sm:text-base sm:leading-8">
                {selectedChapter.detail}
              </p>
              <p className="mt-5 border-l-2 border-[#76272d] pl-4 text-xs leading-6 text-[#776b60]">
                Historical years and event details are intentionally left unfilled until confirmed
                by the academy.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-7xl gap-4 sm:grid-cols-2">
            {selectedChapter.supportingPhotos.map((photo) => (
              <figure key={photo.alt} className="min-w-0">
                <img
                  src={photo.image}
                  alt={photo.alt}
                  className="aspect-[16/9] w-full bg-[#ded5c7] object-cover"
                  loading="lazy"
                />
                <figcaption className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8b7b6c]">
                  Academy photograph · date not recorded
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

const PHILOSOPHY_PILLARS = [
  {
    number: "01",
    title: "Technical Excellence",
    description:
      "First touch is one of the fundamentals the academy works on. This chapter can grow with verified examples from training.",
    image: historyImage,
    imageAlt: "Devsheel players contesting the ball during a match",
    layout: "md:col-span-7",
  },
  {
    number: "02",
    title: "Tactical Intelligence",
    description:
      "Movement and decisions are part of the academy's stated focus, practised alongside the basics of the game.",
    image: journeyImage,
    imageAlt: "Devsheel players working together during a match",
    layout: "md:col-span-5 md:mt-28",
  },
  {
    number: "03",
    title: "Physical Development",
    description:
      "Players train across the U10, U12, U15 and U18 age groups. Add specific physical-training details here when confirmed by the academy.",
    image: philosophyImage,
    imageAlt: "A football training session on the academy ground",
    layout: "md:col-span-5",
  },
  {
    number: "04",
    title: "Character & Discipline",
    description:
      "Behaviour is one of the fundamentals the academy works on, alongside football skills and decision-making.",
    image: teamsImage,
    imageAlt: "Devsheel youth players gathered together",
    layout: "md:col-span-7 md:mt-24",
  },
  {
    number: "05",
    title: "Love for the Game",
    description:
      "Friendlies and local tournaments give players opportunities to take part in football beyond regular training.",
    image: achievementsImage,
    imageAlt: "Devsheel players celebrating a team achievement",
    layout: "md:col-span-8 md:col-start-3",
  },
] as const;

const PLAYER_DEVELOPMENT_STAGES = [
  {
    number: "01",
    title: "Technical",
    detail: "First touch and the fundamentals",
  },
  {
    number: "02",
    title: "Tactical",
    detail: "Movement and decisions",
  },
  {
    number: "03",
    title: "Physical",
    detail: "Development across four age groups",
  },
  {
    number: "04",
    title: "Mental",
    detail: "Behaviour and character",
  },
] as const;

function PhilosophyChapter({
  sectionRef,
  onReturnToPitch,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  onReturnToPitch: () => void;
}) {
  const actionPhotos = [
    { image: philosophyImage, alt: "A football training session on the academy ground" },
    { image: coachesImage, alt: "Devsheel Football Academy coach" },
    { image: journeyImage, alt: "Devsheel players working together during a match" },
    { image: teamsImage, alt: "Devsheel youth players gathered together" },
  ];

  return (
    <div
      ref={sectionRef}
      className="animate-in fade-in slide-in-from-bottom-2 duration-700 scroll-mt-20"
    >
      <section
        aria-labelledby="philosophy-hero-heading"
        className="relative isolate flex min-h-[76svh] items-end overflow-hidden bg-[#241a19] text-white"
      >
        <img
          src={heroImage}
          alt="Devsheel players training together on the football pitch"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#211315]/90 via-[#211315]/55 to-[#211315]/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#211315]/70 via-transparent to-transparent" />
        <div className="mx-auto w-full max-w-7xl px-5 pb-12 pt-24 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e2c76f]">
            02 · Our Philosophy
          </p>
          <h2
            id="philosophy-hero-heading"
            className="mt-5 max-w-4xl font-display text-5xl uppercase leading-[0.9] sm:text-7xl lg:text-8xl"
          >
            More than
            <br />
            just football.
          </h2>
          <p className="mt-5 max-w-xl font-serif text-xl text-white/85 sm:text-2xl">
            We build character, discipline and belief.
          </p>
          <div className="mt-8 flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
            <span className="h-px w-12 bg-[#e2c76f]" />A young grassroots academy · Devsheel
          </div>
        </div>
      </section>

      <section
        aria-labelledby="philosophy-pillars-heading"
        className="bg-[#f4f0e7] px-5 py-16 text-[#292522] sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-5 md:mb-16 md:grid-cols-[1fr_0.7fr] md:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#76272d]">
                The Devsheel code · five pillars
              </p>
              <h2
                id="philosophy-pillars-heading"
                className="mt-4 max-w-3xl font-serif text-4xl leading-[1.02] sm:text-5xl lg:text-6xl"
              >
                What we work on, and how we grow.
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-[#62584f] md:justify-self-end">
              The academy describes its focus as first touch, movement, decisions and behaviour.
              These pillars organise that work without claiming methods or milestones that have not
              been published.
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-14 md:grid-cols-12 md:gap-y-20">
            {PHILOSOPHY_PILLARS.map((pillar) => (
              <article key={pillar.number} className={`min-w-0 ${pillar.layout}`}>
                <div className="relative">
                  <img
                    src={pillar.image}
                    alt={pillar.imageAlt}
                    className="aspect-[16/10] w-full object-cover"
                    loading="lazy"
                  />
                  <span
                    className="absolute -bottom-8 left-4 font-display text-7xl leading-none text-[#76272d] sm:-bottom-10 sm:left-7 sm:text-8xl"
                    aria-hidden="true"
                  >
                    {pillar.number}
                  </span>
                  <span
                    className="absolute bottom-0 left-0 h-1 w-16 bg-[#d2ad63]"
                    aria-hidden="true"
                  />
                </div>
                <div className="pl-4 pt-12 sm:pl-7">
                  <h3 className="font-serif text-2xl leading-tight sm:text-3xl">{pillar.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-[#62584f]">
                    {pillar.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="player-development-heading"
        className="overflow-hidden bg-[#e9e1d4] px-5 py-16 text-[#292522] sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#76272d]">
              The player, in progress
            </p>
            <h2
              id="player-development-heading"
              className="mt-4 max-w-xl font-serif text-4xl leading-[1.02] sm:text-5xl"
            >
              Development is more than one dimension.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#62584f]">
              The academy works on first touch, movement, decisions and behaviour. This visual
              framework groups development into four connected areas; it does not imply a fixed
              sequence or published assessment system.
            </p>
          </div>

          <div className="relative">
            <div
              className="absolute bottom-8 left-5 top-8 w-px bg-[#bda98f] sm:left-7"
              aria-hidden="true"
            />
            <ol className="space-y-4">
              {PLAYER_DEVELOPMENT_STAGES.map((stage) => (
                <li
                  key={stage.number}
                  className="relative grid grid-cols-[2.75rem_1fr] items-center gap-4 border-b border-[#cfc3b0] py-5 sm:grid-cols-[3.5rem_1fr] sm:gap-6"
                >
                  <span className="z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#76272d] bg-[#e9e1d4] font-display text-sm text-[#76272d] sm:h-14 sm:w-14">
                    {stage.number}
                  </span>
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline sm:gap-5">
                    <h3 className="font-serif text-2xl sm:text-3xl">{stage.title}</h3>
                    <p className="text-xs leading-5 text-[#756b60] sm:text-right sm:text-sm">
                      {stage.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="coaching-philosophy-heading"
        className="relative isolate overflow-hidden bg-[#211d1c] px-5 py-16 text-[#f4f0e7] sm:px-8 sm:py-24 lg:px-12"
      >
        <img
          src={coachesImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center grayscale"
          loading="lazy"
        />
        <div className="absolute inset-0 -z-10 bg-[#211d1c]/85" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#211d1c]/95 via-[#211d1c]/70 to-[#211d1c]/50" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e2c76f]">
              How we coach
            </p>
            <h2
              id="coaching-philosophy-heading"
              className="mt-5 max-w-4xl font-display text-4xl uppercase leading-[0.98] sm:text-5xl lg:text-6xl"
            >
              We don’t just tell players what to do. We teach them why.
            </h2>
          </div>
          <div className="border-l border-[#d1b673]/60 pl-5 sm:pl-7">
            <p className="font-serif text-xl leading-relaxed text-white/90">
              A coach is present at every training, with a full session plan for players to work
              through.
            </p>
            <p className="mt-5 text-sm leading-7 text-white/70">
              Sessions focus on first touch, movement, decisions and behaviour. Small-sided games
              and individual feedback are part of the academy’s stated approach. More detailed
              coaching practices can be added here when confirmed.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="philosophy-action-heading"
        className="bg-[#f4f0e7] px-5 py-16 text-[#292522] sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-14 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#76272d]">
                From the academy
              </p>
              <h2
                id="philosophy-action-heading"
                className="mt-3 font-serif text-4xl leading-tight sm:text-5xl"
              >
                Philosophy in action.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#756b60]">
              Real academy training, coaching and team photographs. No dates or events are inferred.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {actionPhotos.map((photo, index) => (
              <figure
                key={photo.alt}
                className={`group overflow-hidden ${index % 2 === 1 ? "lg:mt-12" : ""}`}
              >
                <img
                  src={photo.image}
                  alt={photo.alt}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <figcaption className="mt-3 border-t border-[#cfc3b0] pt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#756b60]">
                  Academy photograph · date not recorded
                </figcaption>
              </figure>
            ))}
          </div>
          <button
            type="button"
            onClick={onReturnToPitch}
            className="mt-12 inline-flex items-center gap-2 border-b border-[#76272d]/50 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#76272d] transition-colors hover:border-[#76272d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76272d]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the tactical pitch
          </button>
        </div>
      </section>
    </div>
  );
}

function scrollToElement(element: HTMLElement | null) {
  if (!element) return;
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  element.scrollIntoView({ behavior, block: "start" });
}

function AcademyPlaybookPage() {
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const pitchRef = useRef<HTMLElement>(null);
  const chapterRef = useRef<HTMLElement>(null);
  const activeChapter = CHAPTERS.find((chapter) => chapter.id === activeChapterId);

  const openChapter = (chapterId: string) => {
    setActiveChapterId(chapterId);
    requestAnimationFrame(() => scrollToElement(chapterRef.current));
  };

  const returnToPitch = () => {
    setActiveChapterId(null);
    requestAnimationFrame(() => scrollToElement(pitchRef.current));
  };

  return (
    <div className="bg-[#f4f0e7] text-[#292522]">
      <section className="relative isolate min-h-[430px] overflow-hidden bg-[#241a19] text-[#fff9ed] sm:min-h-[500px]">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(32,12,16,0.94)_0%,rgba(48,17,22,0.78)_52%,rgba(32,12,16,0.32)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(25,20,19,0.55),transparent_60%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:px-6">
          <div className="max-w-4xl">
            <Badge className="mb-4 border-gold/40 bg-white/10 text-gold uppercase tracking-widest">
              Interactive guide
            </Badge>
            <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.95] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] md:text-7xl">
              The Academy
              <br />
              <span className="shine-text">Playbook</span>
            </h1>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className="text-lg font-medium text-[#fff9ed]/85 sm:text-xl">
                Every position tells a story.
              </p>
              <span className="hidden h-px w-16 bg-[#dfba77]/70 sm:block" aria-hidden="true" />
              <a
                href="#tactical-pitch"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fff9ed]/75 transition-colors hover:text-white"
              >
                Explore the pitch <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <span className="absolute bottom-0 left-0 h-1 w-full bg-[#a6383c]" aria-hidden="true" />
      </section>

      <section
        id="tactical-pitch"
        ref={pitchRef}
        className="scroll-mt-24 px-4 py-14 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-5 md:mb-10 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#862a30]">
                The field guide · 04 chapters
              </p>
              <h2 className="font-display text-4xl uppercase leading-none text-[#292522] sm:text-5xl">
                Choose your position.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#625a52] sm:text-base">
                Select one of four players on the pitch to explore the academy.
              </p>
            </div>
            <p className="max-w-xs border-l border-[#bca987] pl-4 text-xs leading-6 text-[#756b60]">
              Four chapters. One academy. Start anywhere on the field.
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl rounded-[1.4rem] border border-[#d6cbb9] bg-[#2d4d39] p-2 shadow-[0_26px_70px_-42px_rgba(36,26,22,0.55)] sm:rounded-[2rem] sm:p-4">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.3rem] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.025)_0%,rgba(255,255,255,0.025)_10%,transparent_10%,transparent_20%)] sm:rounded-[1.85rem]" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] border border-[#d8d1b3]/60 sm:aspect-[16/9] sm:rounded-[1.5rem]">
              <svg
                className="absolute inset-0 h-full w-full text-[#e8e4cf]/55 sm:hidden"
                viewBox="0 0 900 1125"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="28"
                  y="28"
                  width="844"
                  height="1069"
                  rx="8"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <line x1="28" y1="562" x2="872" y2="562" stroke="currentColor" strokeWidth="3" />
                <circle cx="450" cy="562" r="115" stroke="currentColor" strokeWidth="3" />
                <circle cx="450" cy="562" r="4" fill="currentColor" />
                <rect
                  x="211"
                  y="28"
                  width="478"
                  height="135"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <rect
                  x="331"
                  y="28"
                  width="238"
                  height="62"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path d="M338 163a112 112 0 0 0 224 0" stroke="currentColor" strokeWidth="3" />
                <rect
                  x="211"
                  y="962"
                  width="478"
                  height="135"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <rect
                  x="331"
                  y="1035"
                  width="238"
                  height="62"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path d="M338 962a112 112 0 0 1 224 0" stroke="currentColor" strokeWidth="3" />
                <path
                  d="M28 52h45v-24M827 28v24h45M28 1073h45v24M827 1097v-24h45"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <svg
                className="absolute inset-0 hidden h-full w-full text-[#e8e4cf]/55 sm:block"
                viewBox="0 0 900 560"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="22"
                  y="22"
                  width="856"
                  height="516"
                  rx="8"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <line x1="450" y1="22" x2="450" y2="538" stroke="currentColor" strokeWidth="3" />
                <circle cx="450" cy="280" r="82" stroke="currentColor" strokeWidth="3" />
                <circle cx="450" cy="280" r="4" fill="currentColor" />
                <rect
                  x="22"
                  y="142"
                  width="130"
                  height="276"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <rect
                  x="22"
                  y="202"
                  width="54"
                  height="156"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path d="M152 198a82 82 0 0 1 0 164" stroke="currentColor" strokeWidth="3" />
                <rect
                  x="748"
                  y="142"
                  width="130"
                  height="276"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <rect
                  x="824"
                  y="202"
                  width="54"
                  height="156"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path d="M748 198a82 82 0 0 0 0 164" stroke="currentColor" strokeWidth="3" />
                <path
                  d="M48 22v-12h70v12M782 22v-12h70v12M48 538v12h70v-12M782 538v12h70v-12"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>

              {CHAPTERS.map((chapter) => {
                const isActive = chapter.id === activeChapterId;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => openChapter(chapter.id)}
                    aria-label={`Open chapter ${chapter.number}: ${chapter.title}`}
                    aria-pressed={isActive}
                    className={`group absolute z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-sm font-bold shadow-[0_5px_18px_rgba(12,24,17,0.38)] transition duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f7e6bd]/70 ${
                      chapter.position
                    } ${
                      isActive
                        ? "border-[#fff0c9] bg-[#f0d195] text-[#321d20]"
                        : "border-[#fff1d2]/80 bg-[#501d24] text-[#fff8e9] hover:border-white hover:bg-[#712b32]"
                    }`}
                  >
                    {chapter.number}
                    <span
                      className={`pointer-events-none absolute left-1/2 top-[calc(100%+0.45rem)] hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-[#241a19]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:block ${
                        isActive ? "sm:opacity-100" : ""
                      }`}
                    >
                      {chapter.title}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 px-1 pb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#efe5d2]/70 sm:px-2">
              <span>Devsheel · Academy field guide</span>
              <span>Tap a marker to explore</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {CHAPTERS.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => openChapter(chapter.id)}
                aria-pressed={chapter.id === activeChapterId}
                className={`flex min-h-14 items-center gap-3 border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#862a30] sm:min-h-16 sm:px-4 ${
                  chapter.id === activeChapterId
                    ? "border-[#862a30] bg-[#862a30] text-[#fff8ed]"
                    : "border-[#d9d0c2] bg-[#f9f6ef] text-[#292522] hover:border-[#9b6b5c]"
                }`}
              >
                <span className="font-display text-lg leading-none text-[#ae8150]">
                  {chapter.number}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.07em] sm:text-xs">
                  {chapter.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeChapter?.id === "origins" && (
        <OriginsTimeline sectionRef={chapterRef} onReturnToPitch={returnToPitch} />
      )}

      {activeChapter?.id === "philosophy" && (
        <PhilosophyChapter sectionRef={chapterRef} onReturnToPitch={returnToPitch} />
      )}

      {activeChapter && activeChapter.id !== "origins" && activeChapter.id !== "philosophy" && (
        <section
          key={activeChapter.id}
          ref={chapterRef}
          aria-live="polite"
          aria-labelledby="chapter-title"
          className="animate-in fade-in slide-in-from-bottom-2 duration-500 scroll-mt-24 border-y border-[#e1d8ca] bg-[#fbf8f1] px-4 py-14 sm:px-8 sm:py-20"
        >
          <div className="mx-auto grid max-w-6xl overflow-hidden border border-[#e0d6c6] bg-[#fffdf8] shadow-[0_28px_70px_-52px_rgba(36,26,22,0.5)] md:grid-cols-[1.04fr_0.96fr]">
            <div className="relative min-h-64 bg-[#342720] sm:min-h-80">
              <img
                src={activeChapter.image}
                alt={activeChapter.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1412]/55 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 font-display text-6xl text-white/90 sm:bottom-7 sm:left-7 sm:text-8xl">
                {activeChapter.number}
              </span>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10 md:p-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#862a30]">
                Chapter {activeChapter.number} · {activeChapter.eyebrow}
              </p>
              <h2
                id="chapter-title"
                className="mt-4 font-display text-4xl uppercase leading-[0.95] text-[#292522] sm:text-5xl"
              >
                {activeChapter.title}
              </h2>
              <p className="mt-6 text-sm leading-7 text-[#514a43] sm:text-base sm:leading-8">
                {activeChapter.description}
              </p>
              <p className="mt-4 border-l-2 border-[#b98a53] pl-4 text-xs leading-6 text-[#756b60] sm:text-sm">
                {activeChapter.note}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={activeChapter.to}
                  className="inline-flex items-center gap-2 bg-[#76272d] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-[#fff8ed] transition-colors hover:bg-[#5d1d23]"
                >
                  {activeChapter.linkLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={returnToPitch}
                  className="inline-flex items-center gap-2 border border-[#d9d0c2] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-[#4c433b] transition-colors hover:border-[#862a30] hover:text-[#76272d]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Back to the pitch
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#292522] px-5 py-12 text-[#f4f0e7] sm:px-8 sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d3ad6d]">
              Keep exploring
            </p>
            <p className="mt-3 font-display text-3xl uppercase sm:text-4xl">
              The next chapter starts on the pitch.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex w-fit items-center gap-3 border border-[#d3ad6d]/60 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors hover:bg-[#d3ad6d] hover:text-[#292522]"
          >
            Visit the academy <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
