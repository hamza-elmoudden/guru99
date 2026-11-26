import { getDict, localePath, t, type Locale } from "./i18n";
import type { ContactInfo, LocaleValue, Navbar } from "./sanity/types";

export const SITE_NAME = "IPTV Pro";

export type NavItem = { label: string; href: string };

const ROUTES = [
  { href: "/", keys: ["home", "etusivu", "koti", "start"], fallback: "home" },
  { href: "/about", keys: ["about", "tietoa", "meistä"], fallback: "about" },
  { href: "/#plans", keys: ["plan", "paln", "pricing", "price", "paketti", "paketit", "hinta", "hinnat", "tilaus"], fallback: "plans" },
  { href: "/faq", keys: ["faq", "question", "ukk", "kysymy"], fallback: "faq" },
  { href: "/blog", keys: ["blog", "news", "uutis", "article", "artikkel"], fallback: "blog" },
  { href: "/contact", keys: ["contact", "yhtey"], fallback: "contact" },
] as const;

/**
 * The navbar document only stores labels (`names[]`), so each label is
 * matched to a route by keyword in its Finnish or English text. A label that
 * matches no keyword takes the route at the same position.
 */
export function buildNav(navbar: Navbar, locale: Locale): NavItem[] {
  const ui = getDict(locale);
  const names = (navbar?.names ?? []).filter(Boolean) as LocaleValue[];
  if (names.length === 0) {
    return ROUTES.map((r) => ({ label: ui.nav[r.fallback], href: localePath(locale, r.href) }));
  }
  return names.map((name, i) => {
    const haystack = `${name?.fi ?? ""} ${name?.en ?? ""}`.toLowerCase();
    const route =
      ROUTES.find((r) => r.keys.some((k) => haystack.includes(k))) ??
      ROUTES[i % ROUTES.length];
    return { label: t(name, locale) || ui.nav[route.fallback], href: localePath(locale, route.href) };
  });
}

export function whatsappLink(contact: ContactInfo, text?: string) {
  const digits = contact?.whatsapp?.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

const CURRENCY_CODES: Record<string, string> = {
  "€": "EUR",
  $: "USD",
  "£": "GBP",
  "ca$": "CAD",
  "c$": "CAD",
};

/** ISO 4217 code for JSON-LD; Sanity's `currency` may hold a symbol or a code. */
export function currencyCode(currency?: string) {
  const c = (currency ?? "").trim();
  return CURRENCY_CODES[c.toLowerCase()] ?? CURRENCY_CODES[c] ?? (c.toUpperCase() || "EUR");
}

const CURRENCY_SYMBOLS: Record<string, string> = { CAD: "$", EUR: "€", USD: "US$", GBP: "£" };

/** Price with its currency symbol; plans without a currency are priced in euros. */
export function formatPrice(price?: number, currency?: string) {
  if (price == null) return "—";
  const amount = Number.isInteger(price) ? String(price) : price.toFixed(2);
  const code = currencyCode(currency);
  return `${amount} ${CURRENCY_SYMBOLS[code] ?? code}`;
}
