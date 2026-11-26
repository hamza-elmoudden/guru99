"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { IconClock, IconDevices, IconFilm, IconMonitor4k, IconTrophy, IconTv } from "@/components/Icons";

export type FeatureText = { stat: string; title: string; text: string };

/**
 * Visual data for each card, in the same order as `ui.features.items` in lib/i18n.ts
 * (the copy lives there so both locales stay in sync). Edit icon/accent here.
 */
const FEATURES = [
  { Icon: IconTv, accent: "#f43f5e" },
  { Icon: IconFilm, accent: "#a855f7" },
  { Icon: IconTrophy, accent: "#38bdf8" },
  { Icon: IconMonitor4k, accent: "#ec4899" },
  { Icon: IconDevices, accent: "#3b82f6" },
  { Icon: IconClock, accent: "#fb7185" },
] as const;

/** Feeds the cursor position to the card's spotlight gradient. */
function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - r.left}px`);
  el.style.setProperty("--y", `${e.clientY - r.top}px`);
}

export function FeatureGrid({ items }: { items: readonly FeatureText[] }) {
  const ref = useRef<HTMLUListElement>(null);

  // Reveal once the grid scrolls into view (CSS handles the stagger and reduced motion).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.inview = "";
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ul
      ref={ref}
      className="feature-grid mx-auto grid max-w-[1280px] grid-cols-3 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1 xl:gap-10"
    >
      {items.map((item, i) => {
        const { Icon, accent } = FEATURES[i % FEATURES.length];
        return (
          <li
            key={item.title}
            className="feature-card max-[480px]:p-6!"
            style={{ "--accent": accent, "--i": i } as CSSProperties}
            onPointerMove={trackPointer}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="feature-icon">
                <Icon size={28} aria-hidden />
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[13px] font-semibold whitespace-nowrap text-slate-300">
                {item.stat}
              </span>
            </div>
            <h3 className="mt-10 text-[22px] leading-tight font-bold text-white">{item.title}</h3>
            <p className="mt-3 text-base leading-[1.75] text-[#94a3b8]">{item.text}</p>
          </li>
        );
      })}
    </ul>
  );
}
