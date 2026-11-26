"use client";

import { useEffect, useState } from "react";
import { IconArrowUp } from "./Icons";

export function ScrollToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 left-6 z-90 grid size-12 cursor-pointer place-items-center rounded-full border border-line-strong bg-panel/90 text-fg shadow-card backdrop-blur hover:border-primary transition duration-300 hover:-translate-y-0.5 max-md:bottom-4 max-md:left-4 max-md:size-11 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <IconArrowUp size={20} />
    </button>
  );
}
