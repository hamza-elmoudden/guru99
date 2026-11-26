"use client";

import { useEffect, useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "./Icons";

export function PlanSlider({ children, prev, next }: { children: React.ReactNode; prev: string; next: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Start with the middle card centered in view.
  useEffect(() => {
    const el = ref.current;
    const mid = el?.children[Math.floor(el.children.length / 2)] as HTMLElement | undefined;
    if (el && mid) el.scrollLeft = mid.offsetLeft - (el.clientWidth - mid.offsetWidth) / 2;
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    // Move exactly one card (card width + the 24px gap).
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? el.clientWidth) + 24), behavior: "smooth" });
  };

  const [paused, setPaused] = useState(false);

  // Auto-advance one card every few seconds, only when some cards are out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (el.scrollWidth <= el.clientWidth + 4) return; // everything is visible
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else scroll(1);
    }, 4000);
    return () => clearInterval(id);
  }, [paused]);


  const arrow =
    "z-10 flex size-10 cursor-pointer md:absolute md:top-1/2 md:-translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-panel/90 text-fg shadow-card backdrop-blur transition hover:border-primary hover:bg-elevated";

  return (
    <div
      className="relative mx-auto max-w-[1200px] max-md:flex max-md:flex-wrap max-md:justify-center max-md:gap-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setTimeout(() => setPaused(false), 6000)}
    >
      <button type="button" aria-label={prev} onClick={() => scroll(-1)} className={`${arrow} md:-left-5`}>
        <IconChevronLeft size={18} />
      </button>
      <div
        ref={ref}
        className="flex snap-x justify-center-safe snap-mandatory items-stretch gap-6 overflow-x-auto scroll-smooth px-2 pt-6 pb-10 max-md:order-first max-md:w-full max-md:px-0 max-md:pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button type="button" aria-label={next} onClick={() => scroll(1)} className={`${arrow} md:-right-5`}>
        <IconChevronRight size={18} />
      </button>
    </div>
  );
}
