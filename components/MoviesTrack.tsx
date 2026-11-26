"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** `alt` is built on the server (MoviesSlider) because this client component has no access to the dictionary. */
type Movie = { file: string; title: string; alt: string };

// Scrolling poster track: the poster closest to the horizontal centre grows and rises above its neighbours.
export function MoviesTrack({ movies }: { movies: Movie[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const loop = [...movies, ...movies];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const tick = () => {
      const box = el.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const reach = Math.min(260, box.width / 2);
      let best = -1;
      let bestIdx = 0;
      items.current.forEach((f, i) => {
        if (!f) return;
        const r = f.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - cx);
        const t = Math.max(0, 1 - d / reach);
        const e = t * t * (3 - 2 * t);
        f.style.transform = `scale(${1 + 0.4 * e})`;
        f.style.zIndex = String(Math.round(e * 10));
        f.style.filter = `brightness(${0.7 + 0.3 * e})`;
        if (e > best) {
          best = e;
          bestIdx = i;
        }
      });
      if (best > 0) setActive(bestIdx % movies.length);
      if (!reduce) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [movies.length]);

  return (
    <>
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {movies.map((m, i) => (
        <Image
          key={m.file}
          src={`/movies/${encodeURIComponent(m.file)}`}
          alt=""
          fill
          unoptimized
          className={`scale-125 object-cover blur-2xl transition-opacity duration-700 ${i === active ? "opacity-25" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-b from-bg via-bg/50 to-bg" />
    </div>
    <div ref={wrap} className="relative overflow-x-clip mask-[linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="flex w-max animate-scroll-rtl [animation-duration:40s] gap-5 py-12 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {loop.map((m, i) => (
          <figure
            ref={(n) => {
              items.current[i] = n;
            }}
            className="group relative m-0 w-[180px] shrink-0 will-change-transform max-[480px]:w-[140px]"
            key={i}
            aria-hidden={i >= movies.length}
          >
            <div className="relative aspect-[2/3] rounded-xl bg-panel shadow-[0_0_0_1px_rgb(236_238_255/0.1),0_16px_32px_-12px_rgb(0_0_0/0.7)] transition-shadow duration-300 group-hover:shadow-[0_0_0_1px_rgb(178_103_196/0.6),0_24px_48px_-12px_rgb(128_86_177/0.45)]">
              <Image
                src={`/movies/${encodeURIComponent(m.file)}`}
                alt={i < movies.length ? m.alt : ""}
                fill
                unoptimized
                // The marquee slides posters in from off-screen, so lazy loading shows empty boxes.
                loading="eager"
                fetchPriority={i < 6 ? "high" : "low"}
                className="rounded-xl object-cover"
              />
            </div>
            <figcaption className="mt-[0.7rem] truncate text-center text-[0.82rem] font-medium text-muted transition-colors duration-300 group-hover:text-fg">
              {m.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
    </>
  );
}
