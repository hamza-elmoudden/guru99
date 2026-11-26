"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const CARET = "#d0a616"; // spot highlight

/**
 * Hero headline: types itself in once, then the caret blinks out.
 * The last word carries the accent gradient; the rest uses the heading gradient.
 * Without JS (or with reduced motion) the full headline renders immediately.
 */
export function HeroTitle({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = Array.from(el.querySelectorAll<HTMLElement>(".hc"));
    const len = chars.length;
    const render = (n: number, caret = true) => {
      chars.forEach((c, k) => {
        c.style.opacity = k < n ? "1" : "0";
        c.style.boxShadow = caret && k === n - 1 ? `3px 0 0 ${CARET}` : "none";
      });
      if (caret && n === 0 && chars[0]) chars[0].style.boxShadow = `-3px 0 0 ${CARET}`;
    };
    render(0);

    const ctx = gsap.context(() => {
      const state = { n: 0 };
      const update = () => render(Math.round(state.n));
      gsap
        .timeline({ delay: 0.25 })
        .to(state, { n: len, duration: Math.min(2.4, Math.max(1, len * 0.045)), ease: "none", onUpdate: update })
        .to({}, { duration: 1.6 })
        .call(() => render(len, false));
    }, el);

    return () => {
      ctx.revert();
      chars.forEach((c) => {
        c.style.opacity = "";
        c.style.boxShadow = "";
      });
    };
  }, [text]);

  const words = text.split(" ");
  return (
    <h1 ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className={`inline-block whitespace-nowrap ${
            i === words.length - 1 && words.length > 1 ? "text-gradient-accent" : "text-gradient-heading"
          }`}
        >
          {Array.from(w).map((c, j) => (
            <span key={j} className="hc">
              {c}
            </span>
          ))}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h1>
  );
}

/** Fades/slides a block of children in sequence (used for the hero paragraph, buttons, stats). */
export function HeroReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.5,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
