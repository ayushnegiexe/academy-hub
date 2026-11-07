import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FeatureCarouselItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

type FeatureCarouselProps = {
  items: FeatureCarouselItem[];
  ariaLabel: string;
  itemLabel: string;
};

export function FeatureCarousel({ items, ariaLabel, itemLabel }: FeatureCarouselProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(items.length);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeSlideRef = useRef(items.length);
  const isProgrammaticScrollRef = useRef(false);
  const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeUpdateFrameRef = useRef<number | null>(null);
  const scrollAnimationFrameRef = useRef<number | null>(null);

  const cancelScrollAnimation = useCallback(() => {
    if (scrollAnimationFrameRef.current !== null) {
      cancelAnimationFrame(scrollAnimationFrameRef.current);
      scrollAnimationFrameRef.current = null;
    }
    isProgrammaticScrollRef.current = false;
  }, []);

  const centerSlide = useCallback(
    (index: number) => {
      const carousel = carouselRef.current;
      const slide = slideRefs.current[index];
      if (!carousel || !slide) return;

      const carouselBounds = carousel.getBoundingClientRect();
      const slideBounds = slide.getBoundingClientRect();
      const startLeft = carousel.scrollLeft;
      const targetLeft =
        startLeft +
        slideBounds.left -
        carouselBounds.left +
        slideBounds.width / 2 -
        carousel.clientWidth / 2;
      const distance = targetLeft - startLeft;
      const duration = 700;
      let startTime: number | null = null;

      cancelScrollAnimation();
      isProgrammaticScrollRef.current = true;
      activeSlideRef.current = index;
      setActiveSlideIndex(index);

      const animate = (time: number) => {
        if (startTime === null) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;

        carousel.scrollLeft = startLeft + distance * easedProgress;

        if (progress < 1) {
          scrollAnimationFrameRef.current = requestAnimationFrame(animate);
        } else {
          scrollAnimationFrameRef.current = null;
          let settledIndex = index;
          const firstSlide = slideRefs.current[0];
          const repeatedSlide = slideRefs.current[items.length];
          const cycleWidth =
            firstSlide && repeatedSlide
              ? repeatedSlide.getBoundingClientRect().left - firstSlide.getBoundingClientRect().left
              : 0;

          if (cycleWidth > 0 && carousel.scrollLeft < cycleWidth) {
            settledIndex += items.length;
            carousel.scrollLeft += cycleWidth;
          } else if (cycleWidth > 0 && carousel.scrollLeft > cycleWidth * 2) {
            settledIndex -= items.length;
            carousel.scrollLeft -= cycleWidth;
          }

          activeSlideRef.current = settledIndex;
          setActiveSlideIndex(settledIndex);
          isProgrammaticScrollRef.current = false;
        }
      };

      scrollAnimationFrameRef.current = requestAnimationFrame(animate);
    },
    [cancelScrollAnimation, items.length],
  );

  const advanceSlide = useCallback(() => {
    if (items.length < 2) return;
    const nextIndex = activeSlideRef.current + 1;
    centerSlide(nextIndex < items.length * 3 ? nextIndex : items.length);
  }, [centerSlide, items.length]);

  const updateActiveItem = (carousel: HTMLDivElement) => {
    if (isProgrammaticScrollRef.current) return;

    if (activeUpdateFrameRef.current === null) {
      activeUpdateFrameRef.current = requestAnimationFrame(() => {
        activeUpdateFrameRef.current = null;
        const carouselCenter = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
        let closestIndex = activeSlideRef.current;
        let closestDistance = Number.POSITIVE_INFINITY;

        slideRefs.current.forEach((slide, index) => {
          if (!slide) return;
          const bounds = slide.getBoundingClientRect();
          const distance = Math.abs(bounds.left + bounds.width / 2 - carouselCenter);
          if (distance < closestDistance) {
            closestIndex = index;
            closestDistance = distance;
          }
        });

        activeSlideRef.current = closestIndex;
        setActiveSlideIndex(closestIndex);
      });
    }

    if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    settleTimeoutRef.current = setTimeout(() => {
      if (isProgrammaticScrollRef.current) return;

      let closestIndex = activeSlideRef.current;

      const firstSlide = slideRefs.current[0];
      const repeatedSlide = slideRefs.current[items.length];
      const cycleWidth =
        firstSlide && repeatedSlide
          ? repeatedSlide.getBoundingClientRect().left - firstSlide.getBoundingClientRect().left
          : 0;

      if (cycleWidth > 0 && carousel.scrollLeft < cycleWidth) {
        closestIndex += items.length;
        carousel.scrollLeft += cycleWidth;
      } else if (cycleWidth > 0 && carousel.scrollLeft > cycleWidth * 2) {
        closestIndex -= items.length;
        carousel.scrollLeft -= cycleWidth;
      }

      activeSlideRef.current = closestIndex;
      setActiveSlideIndex(closestIndex);
    }, 320);
  };

  useEffect(() => {
    const initialCenterTimeout = setTimeout(() => {
      const carousel = carouselRef.current;
      const initialSlide = slideRefs.current[items.length];
      if (!carousel || !initialSlide) return;

      activeSlideRef.current = items.length;
      setActiveSlideIndex(items.length);

      const carouselBounds = carousel.getBoundingClientRect();
      const slideBounds = initialSlide.getBoundingClientRect();
      carousel.scrollLeft =
        carousel.scrollLeft +
        slideBounds.left -
        carouselBounds.left +
        slideBounds.width / 2 -
        carousel.clientWidth / 2;
    }, 50);

    return () => {
      clearTimeout(initialCenterTimeout);
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
      if (activeUpdateFrameRef.current !== null) {
        cancelAnimationFrame(activeUpdateFrameRef.current);
      }
      cancelScrollAnimation();
    };
  }, [cancelScrollAnimation, items.length]);

  useEffect(() => {
    if (items.length < 2) return;

    const autoplayInterval = setInterval(() => {
      if (document.visibilityState === "visible") advanceSlide();
    }, 4000);

    return () => clearInterval(autoplayInterval);
  }, [advanceSlide, items.length]);

  const navigateSlide = (direction: -1 | 1) => {
    if (items.length < 2) return;

    const nextIndex = activeSlideRef.current + direction;
    centerSlide(nextIndex < 0 ? items.length * 2 - 1 : nextIndex);
  };

  return (
    <>
      <div
        ref={carouselRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        className="mt-8 -my-10 overflow-x-auto overflow-y-hidden overscroll-x-contain py-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [scroll-behavior:auto] [touch-action:pan-x_pan-y]"
        onScroll={(event) => {
          updateActiveItem(event.currentTarget);
        }}
        onTouchStart={() => {
          cancelScrollAnimation();
        }}
        onPointerDown={() => {
          cancelScrollAnimation();
        }}
      >
        <div className="flex w-max min-w-full gap-4 px-[max(0px,calc((100%_-_320px)/2))] md:gap-6">
          {Array.from({ length: 3 }, (_, copyIndex) =>
            items.map(({ icon: Icon, title, desc }, itemIndex) => {
              const index = copyIndex * items.length + itemIndex;
              const isFeatured = index === activeSlideIndex;

              return (
                <div
                  key={`${copyIndex}-${title}`}
                  ref={(element) => {
                    slideRefs.current[index] = element;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${itemIndex + 1} of ${items.length}: ${title}`}
                  aria-hidden={copyIndex !== 1}
                  className="w-[min(320px,75vw)] shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => centerSlide(index)}
                    aria-label={`Focus ${title} ${itemLabel}`}
                    tabIndex={copyIndex === 1 ? 0 : -1}
                    className="block w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                  >
                    <Card
                      className={cn(
                        "group relative h-full overflow-hidden border transition-[transform,box-shadow,border-color,background-color] duration-700 ease-in-out",
                        isFeatured
                          ? "z-10 -translate-y-1 scale-[1.02] border-gold/50 bg-zinc-950 text-white shadow-[0_22px_55px_-28px_rgba(17,17,17,0.55),0_0_24px_-14px_rgba(212,175,55,0.35)] sm:-translate-y-1 sm:scale-[1.03]"
                          : "scale-[0.99] border-zinc-200 bg-white/90 text-zinc-950 opacity-85 shadow-[0_12px_35px_-28px_rgba(17,17,17,0.2)]",
                      )}
                    >
                      {isFeatured && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gold/10 blur-3xl"
                        />
                      )}
                      <div
                        className={cn(
                          "absolute inset-x-6 top-0 h-1 rounded-b-full transition-colors",
                          isFeatured ? "bg-gold" : "bg-primary/20",
                        )}
                      />
                      <CardContent className="relative p-6 sm:p-7">
                        <div
                          className={cn(
                            "grid h-14 w-14 place-items-center rounded-2xl transition-all duration-700 ease-in-out group-hover:scale-110",
                            isFeatured ? "bg-gold text-zinc-950" : "bg-zinc-950 text-white",
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>

                        <h3
                          className={cn(
                            "mt-5 font-display text-2xl uppercase tracking-wide",
                            isFeatured ? "text-white" : "text-zinc-950",
                          )}
                        >
                          {title}
                        </h3>

                        <p
                          className={cn(
                            "mt-2 text-sm font-medium",
                            isFeatured ? "text-zinc-300" : "text-zinc-500",
                          )}
                        >
                          {desc}
                        </p>
                      </CardContent>
                    </Card>
                  </button>
                </div>
              );
            }),
          )}
        </div>
      </div>
      <div
        className="mt-5 flex items-center justify-center gap-3"
        aria-label={`${ariaLabel} controls`}
      >
        <button
          type="button"
          onClick={() => navigateSlide(-1)}
          aria-label={`Previous ${itemLabel}`}
          disabled={items.length < 2}
          className="grid h-10 w-10 place-items-center rounded-full border border-zinc-300 bg-white text-zinc-900 transition-colors hover:border-gold hover:bg-zinc-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2" role="group" aria-label={`Choose ${itemLabel}`}>
          {items.map((item, index) => {
            const isActive = activeSlideIndex % items.length === index;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => centerSlide(items.length + index)}
                aria-label={`Show ${item.title} ${itemLabel}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isActive ? "w-7 bg-gold" : "w-2.5 bg-zinc-300 hover:bg-zinc-500",
                )}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => navigateSlide(1)}
          aria-label={`Next ${itemLabel}`}
          disabled={items.length < 2}
          className="grid h-10 w-10 place-items-center rounded-full border border-zinc-300 bg-white text-zinc-900 transition-colors hover:border-gold hover:bg-zinc-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
