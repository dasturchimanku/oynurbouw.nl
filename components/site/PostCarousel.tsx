"use client";

import { Media } from "@/components/Media";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { MediaType } from "@/lib/types";

export type Slide = { src: string; width: number; height: number; alt: string; badge?: string; media?: MediaType; poster?: string; webm?: string };

/** Instagram-style swipeable photo carousel with dots, counter and fullscreen view. */
export function PostCarousel({ slides, labels }: { slides: Slide[]; labels: { prev: string; next: string; close: string; open: string } }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  }, [slides.length]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIndex(Math.round(el.scrollLeft / el.clientWidth)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Fullscreen: keyboard + scroll lock
  useEffect(() => {
    if (full === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(null);
      if (e.key === "ArrowRight") setFull((f) => (f === null ? f : (f + 1) % slides.length));
      if (e.key === "ArrowLeft") setFull((f) => (f === null ? f : (f - 1 + slides.length) % slides.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [full, slides.length]);

  const many = slides.length > 1;

  return (
    <div className="group/carousel relative bg-sand">
      <div
        ref={track}
        className="flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        aria-roledescription="carousel"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") goTo(index + 1);
          if (e.key === "ArrowLeft") goTo(index - 1);
        }}
      >
        {slides.map((s, i) => (
          <button
            key={s.src + i}
            type="button"
            onClick={() => setFull(i)}
            className="relative h-full w-full shrink-0 snap-center snap-always cursor-zoom-in"
            aria-label={`${labels.open} ${i + 1}/${slides.length}`}
          >
            <Media
              item={s}
              alt={s.alt}
              fill
              priority={i === 0}
              loading={i < 2 ? "eager" : "lazy"}
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover"
            />
            {s.badge && (
              <span className="absolute bottom-3 left-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-white uppercase backdrop-blur">
                {s.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {many && (
        <>
          <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-white tabular-nums backdrop-blur">
            {index + 1}/{slides.length}
          </span>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label={labels.prev}
            className={`absolute top-1/2 left-3 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white md:grid ${index === 0 ? "!hidden" : ""}`}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label={labels.next}
            className={`absolute top-1/2 right-3 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white md:grid ${index === slides.length - 1 ? "!hidden" : ""}`}
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {slides.map((s, i) => (
              <span key={s.src + i} className={`size-1.5 rounded-full transition ${i === index ? "bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
      <span className="pointer-events-none absolute top-3 left-3 hidden size-8 place-items-center rounded-full bg-ink/60 text-white opacity-0 transition group-hover/carousel:opacity-100 md:grid">
        <Expand className="size-4" />
      </span>

      {full !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={() => setFull(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) setFull((f) => (f === null ? f : (f + (dx < 0 ? 1 : -1) + slides.length) % slides.length));
          }}
        >
          <div className="relative h-[88dvh] w-[96vw]" onClick={(e) => e.stopPropagation()}>
            <Media item={slides[full]} alt={slides[full].alt} fill sizes="96vw" quality={85} className="object-contain" />
          </div>
          <p className="absolute top-5 left-5 text-sm text-white/70 tabular-nums">
            {full + 1}/{slides.length}
          </p>
          <button type="button" onClick={() => setFull(null)} aria-label={labels.close} className="absolute top-3 right-3 grid size-12 place-items-center rounded-full text-white hover:bg-white/10">
            <X className="size-6" />
          </button>
          {many && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFull((full - 1 + slides.length) % slides.length);
                }}
                aria-label={labels.prev}
                className="absolute left-2 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFull((full + 1) % slides.length);
                }}
                aria-label={labels.next}
                className="absolute right-2 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
