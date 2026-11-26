import { altText, getDict, localePath, t, type Locale } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { hasImage, urlFor } from "@/lib/sanity/image";
import type { Plan, PlanSection } from "@/lib/sanity/types";
import { formatPrice } from "@/lib/site";
import { emptyNote, section as sectionPadding, sectionHeadCenter, sectionLabel, sectionSubCenter, sectionTitle } from "@/lib/ui";
import { SnowflakeBackground } from "./SnowflakeBackground";
import { PlanSlider } from "./PlanSlider";
import { PlanCard, type PlanCardData } from "./PlanCard";

type Props = {
  plans: Plan[];
  section: PlanSection;
  /** Inner pages render their own <h1>, so the section header can be hidden. */
  showHeader?: boolean;
  /** Show the animated snowflake background (home and about pages). */
  leaves?: boolean;
};

export function toPlanCard(plan: Plan, locale: Locale, featuredId?: string): PlanCardData {
  const save =
    plan.oldPrice && plan.price && plan.oldPrice > plan.price
      ? Math.round((1 - plan.price / plan.oldPrice) * 100)
      : undefined;
  const title = t(plan.title, locale);
  return {
    id: plan._id,
    href: localePath(locale, `/plans/${plan.slug}`),
    title,
    shortDescription: t(plan.shortDescription, locale),
    description: t(plan.description, locale),
    price: formatPrice(plan.price, plan.currency),
    oldPrice: save ? formatPrice(plan.oldPrice, plan.currency) : undefined,
    savePercent: save,
    imageAlt: altText(getDict(locale).alt.plan, title),
    imageUrl: hasImage(plan.image) ? urlFor(plan.image).width(640).height(400).fit("crop").url() : undefined,
    salesCount: plan.salesCount,
    featured: plan._id === featuredId,
  };
}

/** The best-selling plan gets the "featured" treatment from the design. */
export function bestSellerId(plans: Plan[]) {
  const top = plans.reduce<Plan | undefined>(
    (best, p) => ((p.salesCount ?? 0) > (best?.salesCount ?? 0) ? p : best),
    undefined,
  );
  return top?._id;
}

export async function PricingSection({ plans, section, showHeader = true, leaves = false }: Props) {
  const { locale, ui, tr } = await getI18n();
  const featuredId = bestSellerId(plans);
  const labels = {
    bestSeller: ui.plans.bestSeller,
    sold: ui.plans.sold,
    save: ui.plans.save,
    showDetails: ui.plans.showDetails,
    hideDetails: ui.plans.hideDetails,
    oneTime: ui.plans.oneTime,
    cta: ui.subscribeNow,
  };

  return (
    <section id="plans" className={`${sectionPadding} relative isolate scroll-mt-20 overflow-hidden bg-bg`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[35%] left-1/2 h-[45%] w-[min(900px,90%)] -translate-x-1/2 rounded-[50%] bg-primary/15 blur-[140px]" />
        {leaves && <SnowflakeBackground />}
      </div>
      {showHeader ? (
        <div className={sectionHeadCenter}>
          <span className={sectionLabel}>{ui.plans.label}</span>
          <h2 className={sectionTitle}>{tr(section?.title) || ui.plans.title}</h2>
          <p className={sectionSubCenter}>{tr(section?.shorttext) || ui.plans.sub}</p>
        </div>
      ) : (
        <h2 className="sr-only">{tr(section?.title) || ui.plans.title}</h2>
      )}

      {plans.length ? (
        <PlanSlider prev={ui.plans.prev} next={ui.plans.next}>
          {plans.map((plan) => (
            <div key={plan._id} className="w-[360px] shrink-0 snap-center max-md:w-full max-md:max-w-none">
              <PlanCard plan={toPlanCard(plan, locale, featuredId)} labels={labels} />
            </div>
          ))}
        </PlanSlider>
      ) : (
        <p className={emptyNote}>{ui.plans.empty}</p>
      )}
    </section>
  );
}
