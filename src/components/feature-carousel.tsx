import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(items.length);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeSlideRef = useRef(items.length);
  const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeUpdateFrameRef = useRef<number | null>(null);
  const scrollAnimationFrameRef = useRef<number | null>(null);

  const cancelScrollAnimation = () => {
    if (scrollAnimationFrameRef.current !== null) {
      cancelAnimationFrame(scrollAnimationFrameRef.current);
      scrollAnimationFrameRef.current = null;
    }
  };

  const centerSlide = (index: number) => {
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
    const duration = Math.min(850, Math.max(450, Math.abs(distance) * 0.75));
    let startTime: number | null = null;

    cancelScrollAnimation();
    const animate = (time: number) => {
      if (startTime === null) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      carousel.scrollLeft = startLeft + distance * easedProgress;

      if (progress < 1) {
        scrollAnimationFrameRef.current = requestAnimationFrame(animate);
      } else {
        scrollAnimationFrameRef.current = null;
      }
    };

    scrollAnimationFrameRef.current = requestAnimationFrame(animate);
  };

  const updateActiveItem = (carousel: HTMLDivElement) => {
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
        setActiveIndex(closestIndex % items.length);
      });
    }

    if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    settleTimeoutRef.current = setTimeout(() => {
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
      setActiveIndex(closestIndex % items.length);
    }, 320);
  };

  useEffect(() => {
    const initialCenterTimeout = setTimeout(() => {
      const carousel = carouselRef.current;
      const initialSlide = slideRefs.current[items.length];
      if (!carousel || !initialSlide) return;

      activeSlideRef.current = items.length;
      setActiveSlideIndex(items.length);
      setActiveIndex(0);

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
  }, [items.length]);

  return (
    <>
      <div
        ref={carouselRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        className="mt-8 -my-10 overflow-x-auto overflow-y-hidden overscroll-x-contain py-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [scroll-behavior:auto] [touch-action:pan-x_pan-y]"
        onScroll={(event) => updateActiveItem(event.currentTarget)}
        onWheel={cancelScrollAnimation}
        onTouchStart={cancelScrollAnimation}
        onPointerDown={cancelScrollAnimation}
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
                        "group relative h-full overflow-hidden border transition-[transform,box-shadow,border-color,background-color] duration-500 ease-in-out",
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
                            "grid h-14 w-14 place-items-center rounded-2xl transition-all duration-500 ease-in-out group-hover:scale-110",
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

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" aria-label={`Choose a ${itemLabel}`}>
          {items.map(({ title }, index) => (
            <button
              key={title}
              type="button"
              aria-label={`Show ${title} ${itemLabel}`}
              aria-pressed={activeIndex === index}
              onClick={() => centerSlide(items.length + index)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-500 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                activeIndex === index ? "w-8 bg-primary" : "w-2.5 bg-zinc-300 hover:bg-zinc-400",
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <p className="hidden text-sm font-semibold text-zinc-500 sm:block" aria-live="polite">
            <span className="text-zinc-950">{items[activeIndex].title}</span>
            <span className="mx-2 text-zinc-300">/</span>
            {`0${activeIndex + 1} / 0${items.length}`}
          </p>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Previous ${itemLabel}`}
            onClick={() => centerSlide(activeSlideRef.current - 1)}
            className="h-11 w-11 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Next ${itemLabel}`}
            onClick={() => centerSlide(activeSlideRef.current + 1)}
            className="h-11 w-11 rounded-full"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
