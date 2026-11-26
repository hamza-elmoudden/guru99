"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { btnOutline, btnPrimary, cardOldPrice, cardPrice, cardSave } from "@/lib/ui";

export type PlanCardData = {
  id: string;
  href: string;
  title: string;
  shortDescription: string;
  description: string;
  price: string;
  oldPrice?: string;
  savePercent?: number;
  imageUrl?: string;
  imageAlt: string;
  salesCount?: number;
  featured: boolean;
};

type Labels = {
  bestSeller: string;
  sold: string;
  save: string;
  showDetails: string;
  hideDetails: string;
  oneTime: string;
  cta: string;
};

export function PlanCard({ plan, labels }: { plan: PlanCardData; labels: Labels }) {
  const router = useRouter();

  // Clicking the card body opens the plan page; its own links/buttons keep their behavior.
  const onCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    router.push(plan.href);
  };

  return (
    <article
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl p-7 text-left transition duration-300 max-[480px]:p-5 ${
        plan.featured
          ? "border-gradient-secondary shadow-[0_0_0_1px_rgb(128_86_177/0.2),0_24px_64px_-24px_rgb(178_103_196/0.55)] hover:-translate-y-1"
          : "border border-line bg-panel/70 shadow-card hover:-translate-y-1 hover:border-line-strong hover:bg-panel hover:shadow-card-hover"
      }`}
      onClick={onCardClick}
    >
      {plan.featured && (
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-[50%] bg-gradient-secondary opacity-20 blur-3xl" />
      )}

      {plan.imageUrl ? (
        <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-elevated">
          <Image
            src={plan.imageUrl}
            alt={plan.imageAlt}
            fill
            sizes="(max-width: 768px) 90vw, 360px"
            className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div
          className={`mb-6 flex size-11 items-center justify-center rounded-lg border text-xl ${
            plan.featured ? "border-accent-orchid/40 bg-accent-violet/20" : "border-primary/30 bg-primary/12"
          }`}
          aria-hidden
        >📺</div>
      )}

      <div className="relative mb-1.5 flex items-start justify-between gap-3">
        <h3 className="text-[1.2rem] leading-tight font-semibold tracking-[-0.015em] text-white">{plan.title}</h3>
        {plan.featured && (
          <span className="shrink-0 rounded-md bg-highlight px-2 py-0.5 text-[0.7rem] font-semibold whitespace-nowrap text-[#1b1400]">
            {labels.bestSeller}
          </span>
        )}
      </div>
      <div className="mb-6 flex items-center gap-1.5 text-[0.8rem] text-muted">
        {plan.salesCount ? (
          <>
            <span className="size-1.5 rounded-full bg-primary-soft" aria-hidden />
            {plan.salesCount}+ {labels.sold}
          </>
        ) : (
          <>&nbsp;</>
        )}
      </div>

      <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={cardPrice}>{plan.price}</span>
        {plan.oldPrice && (
          <span className={cardOldPrice}>
            <s>{plan.oldPrice}</s>
            {plan.savePercent ? (
              <span className={cardSave}>
                {labels.save} {plan.savePercent}%
              </span>
            ) : null}
          </span>
        )}
      </div>
      <div className="mb-6 text-[0.78rem] text-subtle">{labels.oneTime}</div>

      {/* Cards show only the short description; the full one lives on the plan page. */}
      <p className="mb-7 min-h-[72px] border-t border-line pt-5 text-[0.92rem] leading-[1.7] whitespace-pre-line text-muted">
        {plan.shortDescription}
      </p>

      <Link href={plan.href} className={`${plan.featured ? btnPrimary : btnOutline} mt-auto w-full`}>
        {labels.cta}
      </Link>
    </article>
  );
}
