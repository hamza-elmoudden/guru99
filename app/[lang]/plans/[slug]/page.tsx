import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/JsonLd";
import { OrderForm } from "@/components/OrderForm";
import { toPlanCard } from "@/components/PricingSection";
import { getContactInfo, getPlan } from "@/lib/data";
import { getI18n } from "@/lib/locale";
import { productNode } from "@/lib/jsonld";
import { getRoute, slugParams } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";
import { backLink, cardOldPrice, cardPrice, cardSave, proseText, sectionLabel, sectionTitle, sectionTop } from "@/lib/ui";

export async function generateStaticParams() {
  return slugParams("plans");
}

export async function generateMetadata({ params }: PageProps<"/[lang]/plans/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [{ locale, tr }, plan, route] = await Promise.all([getI18n(), getPlan(slug), getRoute(`/plans/${slug}`)]);
  if (!plan) return {};
  return buildMetadata(plan.seo, {
    title: tr(plan.title),
    description: tr(plan.shortDescription),
    path: `/plans/${slug}`,
    locales: route?.locales,
  }, locale);
}

// `params` is URL data: with partialPrefetching it must be read inside
// <Suspense> so the route's App Shell stays shared across every plan link.
export default function PlanPage({ params }: PageProps<"/[lang]/plans/[slug]">) {
  return (
    <section className={sectionTop}>
      <Suspense fallback={<PlanSkeleton />}>
        <PlanDetails params={params} />
      </Suspense>
    </section>
  );
}

function PlanSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1100px] grid-cols-[1.1fr_1fr] items-start gap-12 max-lg:grid-cols-1" aria-busy="true">
      <div className="aspect-[16/10] animate-pulse rounded-2xl border border-line bg-panel" />
      <div className="h-[420px] animate-pulse rounded-2xl border border-line bg-panel" />
    </div>
  );
}

async function PlanDetails({ params }: Pick<PageProps<"/[lang]/plans/[slug]">, "params">) {
  const { slug } = await params;
  const [{ locale, ui, href }, plan, contact] = await Promise.all([getI18n(), getPlan(slug), getContactInfo()]);
  if (!plan) notFound();

  const card = toPlanCard(plan, locale);
  const wa = whatsappLink(contact, `${ui.order.title}: ${card.title} (${card.price})`);

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...productNode(plan, locale) }} />
      <div className="mx-auto grid max-w-[1100px] grid-cols-[1.1fr_1fr] items-start gap-14 max-lg:grid-cols-1">
        <div>
          <Link href={href("/#plans")} className={backLink}>
            {ui.order.back}
          </Link>
          {card.imageUrl && (
            <div className="relative mb-10 aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-elevated shadow-[0_30px_60px_-24px_rgb(0_0_0/0.8)]">
              <Image src={card.imageUrl} alt={card.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 560px" />
            </div>
          )}
          <span className={sectionLabel}>{ui.plans.label}</span>
          <h1 className={sectionTitle}>{card.title}</h1>
          <div className="mb-8 flex flex-wrap items-baseline gap-3 border-b border-line pb-8">
            <span className={`${cardPrice} !text-[3rem]`}>{card.price}</span>
            {card.oldPrice && (
              <span className={cardOldPrice}>
                <s>{card.oldPrice}</s>
                {card.savePercent ? (
                  <span className={cardSave}>
                    {ui.plans.save} {card.savePercent}%
                  </span>
                ) : null}
              </span>
            )}
          </div>
          {/* Full description only; the short one is for the plan cards (falls back if no description is set). */}
          {(card.description || card.shortDescription) && (
            <p className={proseText}>{card.description || card.shortDescription}</p>
          )}
        </div>

        <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
          <OrderForm planId={plan._id} whatsappHref={wa} locale={locale} labels={ui.order} />
        </div>
      </div>
    </>
  );
}
