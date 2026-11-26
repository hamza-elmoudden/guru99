// JSON-LD builders following the shapes in schema_query/schema.js.txt.
import { localePath, t, type Locale } from "./i18n";
import { siteUrl } from "./sanity/env";
import { hasImage, urlFor } from "./sanity/image";
import type { ContactInfo, FaqPage, Plan } from "./sanity/types";
import { SITE_NAME, currencyCode, whatsappLink } from "./site";

export const ORG_ID = `${siteUrl}/#organization`;
export const WEBSITE_ID = `${siteUrl}/#website`;

export function organizationNode(contact: ContactInfo, locale: Locale, description?: string) {
  const sameAs = [contact?.facebook, whatsappLink(contact)].filter(Boolean);
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: siteUrl,
    description: description || undefined,
    email: contact?.email || undefined,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${siteUrl}${localePath(locale, "/contact")}`,
      telephone: contact?.whatsapp || undefined,
      email: contact?.email || undefined,
    },
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function websiteNode(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteUrl,
    name: SITE_NAME,
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

export function productNode(plan: Plan, locale: Locale) {
  const url = `${siteUrl}${localePath(locale, `/plans/${plan.slug}`)}`;
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: t(plan.title, locale),
    description: t(plan.shortDescription, locale) || t(plan.description, locale),
    image: hasImage(plan.image) ? [urlFor(plan.image).width(1200).url()] : undefined,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "IPTV Subscription",
    sku: plan.slug,
    aggregateRating: ratingNode(plan),
    offers: {
      "@type": "Offer",
      url,
      price: plan.price != null ? plan.price.toFixed(2) : undefined,
      priceCurrency: currencyCode(plan.currency),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORG_ID },
      shippingDetails: shippingDetailsNode(plan),
      hasMerchantReturnPolicy: returnPolicyNode(locale),
    },
  };
}

/** Star rating shown in Product rich results. */
const RATING_VALUE = 4.5;

/** Uses the plan's sales count as the rating count; omitted when there are no sales. */
function ratingNode(plan: Plan) {
  const count = plan.salesCount ?? 0;
  if (count < 1) return undefined;
  return {
    "@type": "AggregateRating",
    ratingValue: RATING_VALUE,
    bestRating: 5,
    worstRating: 1,
    ratingCount: count,
  };
}

/** Countries the offer is sold to (shipping destination and return policy). */
const MARKET_COUNTRY = "CA";
/** Refund window in days; keep in sync with the policy page text in lib/i18n.ts. */
export const REFUND_DAYS = 6;

/** Digital delivery: the activation code is sent for free after payment (within a day). */
function shippingDetailsNode(plan: Plan) {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: 0, currency: currencyCode(plan.currency) },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: MARKET_COUNTRY },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
    },
  };
}

function returnPolicyNode(locale: Locale) {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: MARKET_COUNTRY,
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: REFUND_DAYS,
    returnFees: "https://schema.org/FreeReturn",
    refundType: "https://schema.org/FullRefund",
    merchantReturnLink: `${siteUrl}${localePath(locale, "/policy")}`,
  };
}

export function faqNode(faq: FaqPage, path: string, name: string, locale: Locale) {
  const url = `${siteUrl}${localePath(locale, path)}`;
  return {
    "@type": "FAQPage",
    "@id": `${url}#webpage`,
    url,
    name,
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    mainEntity: (faq?.questions ?? []).map((item) => ({
      "@type": "Question",
      name: t(item.question, locale),
      acceptedAnswer: { "@type": "Answer", text: t(item.answer, locale) },
    })),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
