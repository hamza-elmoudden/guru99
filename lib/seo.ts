import type { Metadata } from "next";
import { LOCALE_PREFIX, LOCALES, localePath, preferredLocale, t, type Locale } from "./i18n";
import { siteUrl } from "./sanity/env";
import { hasImage, urlFor } from "./sanity/image";
import type { Seo } from "./sanity/types";
import { SITE_NAME } from "./site";

/**
 * `path` is the locale-less app path, e.g. "/plans".
 * `locales` lists the languages that have their own content (default: both). A page viewed in
 * a language it lacks only shows fallback text, so it canonicalizes to a language that has it.
 */
type Fallback = { title?: string; description?: string; path: string; locales?: readonly Locale[] };

/**
 * Resolves the editor-written `seo.canonicalUrl` for one language. Editors enter
 * locale-less paths ("/about"), which would point at a redirect, so same-site URLs
 * without a language prefix get the page's language added. External URLs are kept.
 */
export function resolveCanonical(raw: string | null | undefined, locale: Locale): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  let url: URL;
  try {
    url = new URL(value, siteUrl);
  } catch {
    return undefined;
  }
  if (url.origin !== new URL(siteUrl).origin) return url.href;
  const path = url.pathname.replace(/\/$/, "") || "/";
  const localized = LOCALE_PREFIX.test(path) ? path : localePath(locale, path);
  return `${siteUrl}${localized}${url.search}`;
}

const OG_LOCALES: Record<Locale, string> = { fi: "fi_FI", en: "en_US" };

/** Maps a Sanity `seo` object onto Next metadata, with page-level fallbacks. */
export function buildMetadata(seo: Seo | undefined, fallback: Fallback, locale: Locale): Metadata {
  const tr = (f: Parameters<typeof t>[0]) => t(f, locale);
  const title = tr(seo?.metaTitle) || fallback.title || SITE_NAME;
  const description = tr(seo?.metaDescription) || fallback.description || undefined;
  const available = fallback.locales?.length ? fallback.locales : LOCALES;
  const url = (l: Locale) => `${siteUrl}${localePath(l, fallback.path)}`;
  const canonicalLocale = available.includes(locale) ? locale : preferredLocale(available);
  const canonical = resolveCanonical(seo?.canonicalUrl, canonicalLocale) || url(canonicalLocale);
  const languages: Record<string, string> = Object.fromEntries(available.map((l) => [l, url(l)]));
  languages["x-default"] = url(preferredLocale(available));
  const ogImage = hasImage(seo?.ogImage)
    ? urlFor(seo.ogImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    // An editor-written metaTitle is used verbatim; fallbacks get the "| IPTV Pro" template.
    title: tr(seo?.metaTitle) ? { absolute: title } : title,
    description,
    keywords: seo?.keywords?.length ? seo.keywords : undefined,
    alternates: { canonical, languages },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: tr(seo?.ogTitle) || title,
      description: tr(seo?.ogDescription) || description,
      url: canonical,
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      // Next's openGraph types have no "product"; product pages fall back to "website".
      type: seo?.ogType === "article" ? "article" : "website",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}
