"use client";

import { useId, useState } from "react";
import { IconPlus } from "./Icons";

type Item = { question: string; answer: string };

/** One item open at a time, like the design's accordion. */
export function FaqAccordion({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel/60 shadow-card">
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i} className="border-line not-first:border-t">
            <h3>
              <button
                type="button"
                className={`flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left text-[0.98rem] font-medium transition-colors duration-200 hover:bg-white/[0.025] max-[480px]:px-4 ${open ? "text-white" : "text-fg/90"}`}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span>{item.question}</span>
                <span
                  className={`flex size-7 min-w-7 items-center justify-center rounded-md border transition duration-300 ${
                    open ? "rotate-45 border-primary/50 bg-primary/15 text-primary-soft" : "border-line-strong text-muted"
                  }`}
                  aria-hidden
                >
                  <IconPlus size={14} />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`} aria-hidden={!open}>
              <div className="overflow-hidden">
                <p className="max-w-[640px] px-6 pb-6 text-[0.93rem] leading-[1.75] whitespace-pre-line text-muted max-[480px]:px-4">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
