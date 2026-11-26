import "server-only";

import { getRouteIndexData } from "./data";
import { LOCALES, localePath, preferredLocale, type Locale } from "./i18n";
import { siteUrl } from "./sanity/env";
import { resolveCanonical } from "./seo";
import type { LocaleValue } from "./sanity/types";

/**
 * Single source of truth for public URLs. generateStaticParams, the XML
 * sitemap (app/sitemap.xml) and the HTML sitemap (app/[lang]/sitemap) all read
 * from here, so they can't drift apart.
 */

export type Section = "pages" | "plans" | "blog";
export type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
export type PageKey = "home" | "about" | "faq" | "blog" | "contact" | "policy" | "sitemap";

export type RouteEntry = {
  section: Section;
  /** Locale-less app path, e.g. "/blog/my-post". */
  path: string;
  /** Static pages: key into the `nav` / `sitemap` dictionary for the link label. */
  pageKey?: PageKey;
  /** Content documents: the localized title. */
  title?: LocaleValue;
  /** Languages that have their own content (the other language would only show fallback text). */
  locales: Locale[];
  /** Languages listed in the XML sitemap: available, not noIndex, and self-canonical. */
  indexed: Locale[];
  lastModified?: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  price?: number;
  currency?: string;
  publishedAt?: string;
};

export function absoluteUrl(locale: Locale, path: string) {
  return `${siteUrl}${localePath(locale, path)}`;
}

/** Latest of several ISO dates (ignores missing ones). */
function latest(...dates: (string | undefined | null)[]) {
  const valid = dates.filter((d): d is string => Boolean(d) && !Number.isNaN(Date.parse(d!)));
  return valid.length ? valid.reduce((a, b) => (Date.parse(a) >= Date.parse(b) ? a : b)) : undefined;
}

type Indexing = { noIndex?: boolean; canonicalUrl?: string | null };

/** A URL goes in the sitemap only if it's indexable and is its own canonical. */
function indexedLocales(path: string, locales: Locale[], doc: Indexing | undefined) {
  if (doc?.noIndex) return [];
  return locales.filter((l) => {
    const canonical = resolveCanonical(doc?.canonicalUrl, l);
    return !canonical || canonical === absoluteUrl(l, path);
  });
}

function availability(doc: Record<Locale, boolean>): Locale[] {
  return LOCALES.filter((l) => doc[l]);
}

/** Every public, prerendered URL of the site (cached with the other Sanity reads). */
export async function getRouteIndex(): Promise<RouteEntry[]> {
  const { singletons, plans, posts } = await getRouteIndexData();
  const single = (type: string) => singletons.find((s) => s._type === type);
  const all = [...LOCALES];

  const latestPlan = latest(...plans.map((p) => p._updatedAt));
  const latestPost = latest(...posts.map((p) => latest(p._updatedAt, p.publishedAt)));

  const page = (
    pageKey: PageKey,
    path: string,
    doc: Indexing | undefined,
    lastModified: string | undefined,
    changeFrequency: ChangeFrequency,
    priority: number,
  ): RouteEntry => ({
    section: "pages",
    path,
    pageKey,
    locales: all,
    indexed: indexedLocales(path, all, doc),
    lastModified,
    changeFrequency,
    priority,
  });

  const home = single("homePage");
  const about = single("aboutPage");
  const faq = single("faqPage");
  const blog = single("blogPage");
  const contact = single("contactInfo");

  const pages: RouteEntry[] = [
    // The home page also lists the plans, so a plan edit updates it too.
    page("home", "/", home, latest(home?._updatedAt, latestPlan), "weekly", 1),
    page("about", "/about", about, about?._updatedAt, "monthly", 0.6),
    page("faq", "/faq", faq, faq?._updatedAt, "monthly", 0.6),
    page("blog", "/blog", blog, latest(blog?._updatedAt, latestPost), "daily", 0.7),
    page("contact", "/contact", undefined, contact?._updatedAt, "yearly", 0.5),
    page("policy", "/policy", undefined, undefined, "yearly", 0.3),
  ];

  const planEntries: RouteEntry[] = plans.map((p) => {
    const path = `/plans/${p.slug}`;
    const locales = availability(p);
    return {
      section: "plans",
      path,
      title: p.title,
      locales,
      indexed: indexedLocales(path, locales, p),
      lastModified: p._updatedAt,
      changeFrequency: "weekly",
      priority: 0.9,
      price: p.price,
      currency: p.currency,
    };
  });

  const postEntries: RouteEntry[] = posts.map((p) => {
    const path = `/blog/${p.slug}`;
    const locales = availability(p);
    return {
      section: "blog",
      path,
      title: p.title,
      locales,
      indexed: indexedLocales(path, locales, p),
      lastModified: latest(p._updatedAt, p.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
      publishedAt: p.publishedAt,
    };
  });

  const content = [...pages, ...planEntries, ...postEntries];
  const sitemapPage = page("sitemap", "/sitemap", undefined, latest(...content.map((e) => e.lastModified)), "monthly", 0.2);

  return [...content, sitemapPage];
}

/** The entry for one locale-less path, e.g. "/plans/basic". */
export async function getRoute(path: string) {
  return (await getRouteIndex()).find((e) => e.path === path);
}

// Cache Components needs at least one param at build time; the placeholder
// covers an empty dataset and resolves to notFound().
const PLACEHOLDER = "__placeholder__";

/** `generateStaticParams` for `/[lang]/plans/[slug]` and `/[lang]/blog/[slug]`. */
export async function slugParams(section: "plans" | "blog") {
  const prefix = `/${section}/`;
  const slugs = (await getRouteIndex()).filter((e) => e.section === section).map((e) => e.path.slice(prefix.length));
  return (slugs.length ? slugs : [PLACEHOLDER]).map((slug) => ({ slug }));
}

/** One sitemap `<url>` per indexed language, each listing all its indexed siblings as alternates. */
export type SitemapUrl = {
  loc: string;
  locale: Locale;
  lastModified?: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  alternates: { hreflang: string; href: string }[];
};

export async function getSitemapUrls(): Promise<SitemapUrl[]> {
  return (await getRouteIndex()).flatMap((entry) => {
    const alternates: SitemapUrl["alternates"] = entry.indexed.map((l) => ({ hreflang: l, href: absoluteUrl(l, entry.path) }));
    if (alternates.length) {
      alternates.push({ hreflang: "x-default", href: absoluteUrl(preferredLocale(entry.indexed), entry.path) });
    }
    return entry.indexed.map((locale) => ({
      loc: absoluteUrl(locale, entry.path),
      locale,
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates,
    }));
  });
}
