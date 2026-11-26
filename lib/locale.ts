import { lang } from "next/root-params";
import { DEFAULT_LOCALE, getDict, isLocale, localePath, t, type Locale } from "./i18n";
import type { LocaleValue } from "./sanity/types";

/** Current locale from the root `[lang]` segment (server components only). */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Everything a server component needs to render in the current language. */
export async function getI18n() {
  const locale = await getLocale();
  return {
    locale,
    ui: getDict(locale),
    tr: (field: LocaleValue) => t(field, locale),
    href: (path: string) => localePath(locale, path),
  };
}
