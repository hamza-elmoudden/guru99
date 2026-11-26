"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Locale } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/* Content — edit texts and images here.                               */
/* ------------------------------------------------------------------ */

const IMAGES = {
  movies: "https://images.unsplash.com/photo-1451187580459-43490279c0fa", // Earth at night from orbit
  sports: "https://images.unsplash.com/photo-1574629810360-7efbbe195018", // football on the pitch
  liveTv: "https://images.unsplash.com/photo-1495020689067-958852a7765e", // reading the news
  cinemaSeats: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
  stadium: "https://images.unsplash.com/photo-1522778119026-d647f0596c20",
};

type Screen = {
  image: string;
  alt: string;
  badge: string;
  badgeAlt: string;
  eyebrow: string;
  title: string;
  meta: string;
  status: string;
};

type MockupContent = {
  stream: string;
  tabsLabel: string;
  tabs: { id: string; label: string; screen: Screen }[];
  vod: { image: string; alt: string; label: string; title: string; sub: string };
  sports: { image: string; alt: string; live: string; label: string; fps: string; title: string; sub: string };
  categories: { label: string; color: string }[];
  playLabel: (title: string) => string;
  scrollLabel: string;
};

export const DEVICE_MOCKUP_CONTENT: Record<Locale, MockupContent> = {
  en: {
    stream: "4K HEVC Stream • 28.4 Mbps",
    tabsLabel: "Content type",
    tabs: [
      {
        id: "movies",
        label: "Movies 4K",
        screen: {
          image: IMAGES.movies,
          alt: "City lights on Earth seen from orbit at night",
          badge: "4K PREMIERE",
          badgeAlt: "DOLBY ATMOS",
          eyebrow: "On Demand • Ultra HD Blockbuster",
          title: "Cyber Horizon: Beyond the Orbit",
          meta: "2026 • Sci-Fi / Thriller • 2160p HDR10+ • Multi-Audio & Subtitles",
          status: "LIVE / 60FPS",
        },
      },
      {
        id: "sports",
        label: "Live Sports",
        screen: {
          image: IMAGES.sports,
          alt: "Football player about to kick the ball on a green pitch",
          badge: "LIVE",
          badgeAlt: "MULTI-CAM",
          eyebrow: "Live Sports • 4K 60FPS",
          title: "Champions League: Final Night",
          meta: "Live now • Football • 2160p HDR • Multi-language commentary",
          status: "LIVE / 60FPS",
        },
      },
      {
        id: "live-tv",
        label: "Live TV",
        screen: {
          image: IMAGES.liveTv,
          alt: "Person reading a newspaper outdoors",
          badge: "LIVE",
          badgeAlt: "7-DAY EPG",
          eyebrow: "Live TV • Channels 24/7",
          title: "World News Tonight",
          meta: "News • Breaking coverage • 1080p / 4K • Catch-up & replay",
          status: "LIVE / 50FPS",
        },
      },
    ],
    vod: {
      image: IMAGES.cinemaSeats,
      alt: "Rows of red cinema seats",
      label: "VOD Library",
      title: "60,000+ Movies",
      sub: "Updated Daily in 4K HDR",
    },
    sports: {
      image: IMAGES.stadium,
      alt: "Packed football stadium under floodlights",
      live: "LIVE",
      label: "Sports 4K",
      fps: "60 FPS",
      title: "Champions League",
      sub: "Stadium Feed • Zero Delay",
    },
    categories: [
      { label: "Cinema", color: "var(--mk-pink)" },
      { label: "Sports PPV", color: "var(--mk-indigo)" },
      { label: "News & Kids", color: "var(--mk-cyan)" },
    ],
    playLabel: (title) => `Play ${title}`,
    scrollLabel: "Scroll to the next section",
  },
  fi: {
    stream: "4K HEVC -striimi • 28,4 Mbps",
    tabsLabel: "Sisältötyyppi",
    tabs: [
      {
        id: "movies",
        label: "Elokuvat 4K",
        screen: {
          image: IMAGES.movies,
          alt: "Kaupunkien valot maapallolla avaruudesta yöllä kuvattuna",
          badge: "4K-ENSI-ILTA",
          badgeAlt: "DOLBY ATMOS",
          eyebrow: "Tilausvideo • Ultra HD -suurelokuva",
          title: "Cyber Horizon: Beyond the Orbit",
          meta: "2026 • Sci-fi / Trilleri • 2160p HDR10+ • Useita ääniraitoja ja tekstityksiä",
          status: "LIVE / 60FPS",
        },
      },
      {
        id: "sports",
        label: "Live-urheilu",
        screen: {
          image: IMAGES.sports,
          alt: "Jalkapalloilija potkaisemassa palloa vihreällä kentällä",
          badge: "SUORA",
          badgeAlt: "MONIKAMERA",
          eyebrow: "Live-urheilu • 4K 60FPS",
          title: "Mestarien liiga: Finaali-ilta",
          meta: "Nyt suorana • Jalkapallo • 2160p HDR • Selostus usealla kielellä",
          status: "LIVE / 60FPS",
        },
      },
      {
        id: "live-tv",
        label: "Live-TV",
        screen: {
          image: IMAGES.liveTv,
          alt: "Henkilö lukemassa sanomalehteä ulkona",
          badge: "SUORA",
          badgeAlt: "7 PV EPG",
          eyebrow: "Live-TV • Kanavat 24/7",
          title: "Illan maailmanuutiset",
          meta: "Uutiset • Ajankohtaislähetykset • 1080p / 4K • Catch-up ja uusinnat",
          status: "LIVE / 50FPS",
        },
      },
    ],
    vod: {
      image: IMAGES.cinemaSeats,
      alt: "Rivit punaisia elokuvateatterin istuimia",
      label: "VOD-kirjasto",
      title: "Yli 60 000 elokuvaa",
      sub: "Päivittyy joka päivä 4K HDR -laadussa",
    },
    sports: {
      image: IMAGES.stadium,
      alt: "Täysi jalkapallostadion valonheittimien alla",
      live: "SUORA",
      label: "Urheilu 4K",
      fps: "60 FPS",
      title: "Mestarien liiga",
      sub: "Stadionlähetys • Ei viivettä",
    },
    categories: [
      { label: "Elokuvat", color: "var(--mk-pink)" },
      { label: "Urheilu PPV", color: "var(--mk-indigo)" },
      { label: "Uutiset ja lapset", color: "var(--mk-cyan)" },
    ],
    playLabel: (title) => `Toista: ${title}`,
    scrollLabel: "Vieritä seuraavaan osioon",
  },
};

/* ------------------------------------------------------------------ */
/* Building blocks                                                      */
/* ------------------------------------------------------------------ */

const glass =
  "rounded-2xl border border-(--mk-border) bg-(--mk-glass) shadow-(--mk-shadow) backdrop-blur-[16px]";
const label = "text-[0.625rem] font-bold uppercase tracking-[0.08em]";

/** Pulsing status dot (the ping ring is skipped with prefers-reduced-motion). */
function Dot({ color, className = "" }: { color: string; className?: string }) {
  return (
    <span aria-hidden className={`relative inline-flex size-2 shrink-0 ${className}`}>
      <span className="absolute inset-0 rounded-full opacity-70 motion-safe:animate-mk-ping" style={{ background: color }} />
      <span className="relative size-2 rounded-full" style={{ background: color }} />
    </span>
  );
}

/** Entrance (fade + slide, staggered) on the outer box, gentle bob on the inner one. */
function Float({
  className = "",
  delay,
  bob,
  children,
}: {
  className?: string;
  delay: number;
  bob?: { duration: number; delay: number };
  children: React.ReactNode;
}) {
  return (
    <div className={`motion-safe:animate-mk-in ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div
        className={bob ? "motion-safe:animate-mk-bob" : undefined}
        style={bob ? { animationDuration: `${bob.duration}s`, animationDelay: `${bob.delay}s` } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const MAX_TILT = 6;

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

type Props = {
  locale: Locale;
  content?: MockupContent;
  className?: string;
};

/** Layered "TV + floating glass cards" visual for the IPTV landing page. */
export function DeviceMockup({ locale, content, className = "" }: Props) {
  const c = content ?? DEVICE_MOCKUP_CONTENT[locale];
  const [active, setActive] = useState(0);
  const tab = c.tabs[active] ?? c.tabs[0];
  const screen = tab.screen;
  const panelId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const tiltEnabled = useRef(false);
  const frame = useRef(0);

  // Mouse tilt only for fine pointers and when motion is allowed.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      tiltEnabled.current = fine.matches && !reduced.matches;
      if (!tiltEnabled.current && tiltRef.current) tiltRef.current.style.transform = "";
    };
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const setTilt = (x: number, y: number) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (tiltRef.current) {
        tiltRef.current.style.transform = `rotateX(${(-y * MAX_TILT).toFixed(2)}deg) rotateY(${(x * MAX_TILT).toFixed(2)}deg)`;
      }
    });
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled.current || e.pointerType !== "mouse" || !rootRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    setTilt(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const onPointerLeave = () => {
    if (tiltEnabled.current) setTilt(0, 0);
  };

  const scrollToNext = () => {
    let el = rootRef.current?.closest("section")?.nextElementSibling ?? null;
    while (el && el.getBoundingClientRect().height < 80) el = el.nextElementSibling;
    el?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const onTabKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : c.tabs.length - 1)) % c.tabs.length;
    setActive(next);
    e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`device-mockup relative isolate mx-auto w-full max-w-[600px] font-sans text-white [perspective:1200px] ${className}`}
    >
      {/* Background: glows, vignette, grain */}
      <div aria-hidden className="pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10 sm:-inset-x-12 sm:-inset-y-16">
        <div className="absolute inset-0 rounded-[48px] bg-[radial-gradient(ellipse_at_center,var(--mk-base)_35%,transparent_72%)]" />
        <div className="absolute bottom-[4%] left-[2%] size-[55%] rounded-full bg-(--mk-pink) opacity-30 blur-[90px]" />
        <div className="absolute top-[2%] left-[25%] size-[50%] rounded-full bg-(--mk-purple) opacity-35 blur-[90px]" />
        <div className="absolute top-[30%] right-[0%] size-[45%] rounded-full bg-(--mk-blue) opacity-35 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_75%)]"
          style={{ backgroundImage: NOISE }}
        />
      </div>

      <div ref={tiltRef} className="transition-transform duration-300 ease-out will-change-transform">
        {/* Top row: stream pill + tabs, overlapping the screen's top edge on larger screens */}
        <div className="relative z-20 mb-3 flex flex-wrap items-center justify-between gap-2.5 sm:-mb-5 sm:px-3">
          <Float delay={100} bob={{ duration: 6, delay: 0 }} className="max-sm:self-start">
            <div className={`${glass} flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.7rem] font-semibold whitespace-nowrap text-white/90`}>
              <Dot color="var(--mk-green)" />
              {c.stream}
            </div>
          </Float>

          <Float delay={200} bob={{ duration: 7, delay: 0.8 }} className="max-sm:w-full">
            <div
              role="tablist"
              aria-label={c.tabsLabel}
              onKeyDown={onTabKey}
              className={`${glass} flex gap-1 overflow-x-auto rounded-full p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
            >
              {c.tabs.map((t, i) => {
                const selected = i === active;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={panelId}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[0.7rem] font-semibold whitespace-nowrap transition-colors duration-200 max-sm:flex-1 ${
                      selected
                        ? "bg-(image:--mk-gradient) text-white shadow-[0_4px_16px_-4px_rgb(225_29_116/0.6)]"
                        : "text-(--mk-text-muted) hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </Float>
        </div>

        {/* Screen + corner cards */}
        <div className="relative">
          <Float delay={0}>
            {/* TV frame */}
            <div className="relative rounded-[20px] border border-(--mk-border) bg-[#05070d] p-1.5 shadow-[0_40px_80px_-24px_rgb(0_0_0/0.9),0_0_0_1px_rgb(0_0_0/0.6)] sm:p-2">
              <div
                id={panelId}
                role="tabpanel"
                aria-label={tab.label}
                className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-(--mk-base) sm:aspect-[16/10]"
              >
                <div key={tab.id} className="absolute inset-0 motion-safe:animate-mk-fade">
                  <Image
                    src={screen.image}
                    alt={screen.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 600px"
                    className="object-cover"
                  />
                </div>
                <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />
                <div aria-hidden className="absolute inset-0 rounded-[14px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06),inset_0_0_60px_rgb(0_0_0/0.5)]" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2 sm:top-9 sm:left-5">
                  <span className={`${label} inline-flex items-center gap-1.5 rounded-full bg-(--mk-red) px-2.5 py-1 text-white shadow-[0_4px_14px_-2px_rgb(225_29_72/0.6)]`}>
                    <Dot color="#fff" className="size-1.5! [&>span]:size-1.5!" />
                    {screen.badge}
                  </span>
                  <span className={`${label} rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-white/90 backdrop-blur-md`}>
                    {screen.badgeAlt}
                  </span>
                </div>

                {/* Bottom content (bottom padding leaves room for the overlapping sports card) */}
                <div key={`${tab.id}-text`} className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-4 motion-safe:animate-mk-in sm:px-5 sm:pt-5 sm:pb-14">
                  <div className="min-w-0 flex-1">
                    <p className={`${label} mb-1.5 text-(--mk-cyan)`}>{screen.eyebrow}</p>
                    <h3 className="mb-1.5 text-[1.15rem] leading-[1.15] font-extrabold tracking-[-0.02em] text-balance sm:text-[1.5rem]">
                      {screen.title}
                    </h3>
                    <p className="mb-3 truncate text-[0.72rem] text-(--mk-text-muted)">{screen.meta}</p>
                    <div className="flex items-center gap-3">
                      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div className="relative h-full w-[60%] overflow-hidden rounded-full bg-(image:--mk-gradient) motion-safe:animate-mk-progress">
                          <span aria-hidden className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/50 to-transparent motion-safe:animate-mk-shimmer" />
                        </div>
                      </div>
                      <span className={`${label} shrink-0 text-white/70`}>{screen.status}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={c.playLabel(screen.title)}
                    className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-[linear-gradient(135deg,var(--mk-pink),#2563eb)] shadow-[0_0_32px_-4px_rgb(225_29_116/0.7)] transition-transform duration-200 hover:scale-105 sm:size-14"
                  >
                    <svg aria-hidden viewBox="0 0 24 24" className="ml-0.5 size-5 fill-white sm:size-6">
                      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.9-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Stand */}
            <div aria-hidden className="mx-auto h-5 w-20 bg-linear-to-b from-[#1a1d2b] to-[#0d0f18] [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" />
            <div aria-hidden className="mx-auto h-1.5 w-40 rounded-full bg-[#1a1d2b] shadow-[0_10px_24px_rgb(0_0_0/0.8)]" />
          </Float>

          {/* VOD card — overlaps the top-right corner */}
          <Float
            delay={350}
            bob={{ duration: 7.5, delay: 0.4 }}
            className="mt-4 sm:absolute sm:top-[16%] sm:-right-3 sm:z-10 sm:mt-0 sm:w-[190px] lg:-right-6 xl:w-[210px]"
          >
            <div className={`${glass} flex items-center gap-3 p-2.5`}>
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                <Image src={c.vod.image} alt={c.vod.alt} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className={`${label} text-(--mk-cyan)`}>{c.vod.label}</p>
                <p className="text-[0.95rem] leading-tight font-extrabold">{c.vod.title}</p>
                <p className="truncate text-[0.7rem] text-(--mk-text-muted)">{c.vod.sub}</p>
              </div>
            </div>
          </Float>

          {/* Sports card — overlaps the bottom-left corner */}
          <Float
            delay={450}
            bob={{ duration: 6.5, delay: 1.2 }}
            className="mt-3 sm:absolute sm:top-[calc(100%-4.5rem)] sm:-left-3 sm:z-10 sm:mt-0 sm:w-[240px] lg:-left-6 xl:w-[250px]"
          >
            <div className={`${glass} relative flex items-center gap-3 p-2.5`}>
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                <Image src={c.sports.image} alt={c.sports.alt} fill sizes="56px" className="object-cover" />
                <span className="absolute top-1 left-1 rounded bg-(--mk-red) px-1 py-px text-[0.5rem] font-bold tracking-[0.08em] text-white">
                  {c.sports.live}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`${label} text-(--mk-pink)`}>{c.sports.label}</p>
                  <span className={`${label} text-white/60`}>{c.sports.fps}</span>
                </div>
                <p className="truncate text-[0.95rem] leading-tight font-extrabold">{c.sports.title}</p>
                <p className="truncate text-[0.7rem] text-(--mk-text-muted)">{c.sports.sub}</p>
              </div>
            </div>
          </Float>
        </div>

        {/* Categories */}
        <Float delay={550} bob={{ duration: 8, delay: 0.6 }} className="mt-5 sm:mt-14">
          <ul className="flex flex-wrap justify-center gap-2">
            {c.categories.map((cat) => (
              <li
                key={cat.label}
                className={`${glass} flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold text-white/85`}
              >
                <span aria-hidden className="size-2 rounded-full" style={{ background: cat.color, boxShadow: `0 0 10px ${cat.color}` } as CSSProperties} />
                {cat.label}
              </li>
            ))}
          </ul>
        </Float>

        <Float delay={650} className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={scrollToNext}
            aria-label={c.scrollLabel}
            className={`${glass} grid size-10 cursor-pointer place-items-center rounded-full text-white/80 transition-colors hover:text-white`}
          >
            <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 motion-safe:animate-mk-bob">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>
        </Float>
      </div>
    </div>
  );
}
