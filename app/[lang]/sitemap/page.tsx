import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { formatDate } from "@/components/PostCard";
import { WaveDivider } from "@/components/WaveDivider";
import { LOCALES, localePath, preferredLocale, type Locale } from "@/lib/i18n";
import { ORG_ID, WEBSITE_ID } from "@/lib/jsonld";
import { getI18n } from "@/lib/locale";
import { absoluteUrl, getRouteIndex, type RouteEntry, type Section } from "@/lib/routes";
import { siteUrl } from "@/lib/sanity/env";
import { buildMetadata } from "@/lib/seo";
import { formatPrice } from "@/lib/site";
import { card, featureIcon, section } from "@/lib/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, ui } = await getI18n();
  return buildMetadata(undefined, { title: ui.sitemap.title, description: ui.sitemap.sub, path: "/sitemap" }, locale);
}

const SECTIONS: { key: Section; icon: string }[] = [
  { key: "pages", icon: "🧭" },
  { key: "plans", icon: "📺" },
  { key: "blog", icon: "📰" },
];

const LANGUAGE_NAMES: Record<Locale, string> = { fi: "Suomi", en: "English" };

// Width + columns follow the number of non-empty sections, so the grid never shows empty columns.
const LAYOUT: Record<number, string> = {
  1: "max-w-[640px]",
  2: "max-w-[960px] md:grid-cols-2",
  3: "max-w-[1200px] md:grid-cols-2 lg:grid-cols-3",
};

export default async function SitemapPage() {
  const [{ locale, ui, tr }, routes] = await Promise.all([getI18n(), getRouteIndex()]);

  const label = (entry: RouteEntry) =>
    entry.pageKey === "sitemap"
      ? ui.sitemap.title
      : entry.pageKey === "policy"
        ? ui.footer.policy
        : entry.pageKey ? ui.nav[entry.pageKey] : tr(entry.title) || entry.path;

  const detail = (entry: RouteEntry) => {
    if (entry.section === "plans" && entry.price != null) return formatPrice(entry.price, entry.currency);
    if (entry.section === "blog" && entry.publishedAt) return formatDate(entry.publishedAt, locale);
    return null;
  };

  // A document without content in this language links to the language that has it.
  const targetOf = (entry: RouteEntry): Locale =>
    entry.locales.includes(locale) ? locale : preferredLocale(entry.locales);

  const groups = SECTIONS.map((s) => ({
    ...s,
    // The sitemap page itself isn't worth a link on the sitemap.
    entries: routes.filter((e) => e.section === s.key && e.locales.length && e.pageKey !== "sitemap"),
  })).filter((g) => g.entries.length);

  const updated = routes.find((e) => e.pageKey === "sitemap")?.lastModified;
  const url = absoluteUrl(locale, "/sitemap");
  const allEntries = groups.flatMap((g) => g.entries);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${url}#webpage`,
          url,
          name: ui.sitemap.title,
          description: ui.sitemap.sub,
          inLanguage: locale,
          dateModified: updated,
          isPartOf: { "@id": WEBSITE_ID },
          publisher: { "@id": ORG_ID },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: allEntries.length,
            itemListElement: allEntries.map((entry, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: label(entry),
              url: absoluteUrl(targetOf(entry), entry.path),
            })),
          },
        }}
      />
      <PageHero label={ui.sitemap.label} title={ui.sitemap.title} sub={ui.sitemap.sub} />
      <WaveDivider variant="f" />
      <section className={section}>
        <div className={`mx-auto grid w-full items-start gap-6 ${LAYOUT[groups.length] ?? LAYOUT[3]}`}>
          {groups.map(({ key, icon, entries }) => (
            <nav key={key} aria-labelledby={`sitemap-${key}`} className={`${card} overflow-hidden`}>
              <h2
                id={`sitemap-${key}`}
                className="flex items-center gap-3 border-b border-line bg-white/[0.02] px-6 py-5 text-[1.05rem] font-semibold tracking-[-0.01em] text-white max-[480px]:px-5"
              >
                <span className={`${featureIcon} size-9 min-w-9`} aria-hidden>
                  {icon}
                </span>
                {ui.sitemap[key]}
                <span className="ml-auto rounded-full border border-line-strong px-2 py-0.5 text-[0.72rem] font-medium tabular-nums text-muted">
                  {entries.length}
                </span>
              </h2>
              <ul className="divide-y divide-line p-2">
                {entries.map((entry) => {
                  const target = targetOf(entry);
                  const info = detail(entry);
                  return (
                    <li key={entry.path} className="flex items-center gap-2 pr-2">
                      <Link
                        href={localePath(target, entry.path)}
                        hrefLang={target}
                        className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg px-4 py-3 text-[0.93rem] text-fg/85 transition-colors duration-200 hover:bg-elevated hover:text-white focus-visible:bg-elevated max-[480px]:px-3"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block break-words">{label(entry)}</span>
                          {info && <span className="mt-0.5 block text-[0.78rem] tabular-nums text-subtle">{info}</span>}
                        </span>
                        <span
                          aria-hidden
                          className="shrink-0 text-subtle transition duration-200 group-hover:translate-x-0.5 group-hover:text-primary-soft"
                        >
                          →
                        </span>
                      </Link>
                      {/* Direct links to every language version of this page. */}
                      <span className="flex shrink-0 gap-1">
                        {LOCALES.map((l) =>
                          entry.locales.includes(l) ? (
                            <Link
                              key={l}
                              href={localePath(l, entry.path)}
                              hrefLang={l}
                              lang={l}
                              title={LANGUAGE_NAMES[l]}
                              aria-label={`${label(entry)} – ${LANGUAGE_NAMES[l]}`}
                              aria-current={l === locale ? "page" : undefined}
                              className={`rounded-md border px-1.5 py-0.5 text-[0.7rem] font-semibold tracking-[0.04em] transition-colors duration-200 ${
                                l === locale
                                  ? "border-primary/40 bg-primary/15 text-primary-soft"
                                  : "border-line-strong text-subtle hover:border-white/25 hover:text-fg"
                              }`}
                            >
                              {l.toUpperCase()}
                            </Link>
                          ) : (
                            <span
                              key={l}
                              title={ui.sitemap.otherLanguage}
                              className="rounded-md border border-dashed border-line px-1.5 py-0.5 text-[0.7rem] font-semibold tracking-[0.04em] text-subtle/50 line-through"
                            >
                              {l.toUpperCase()}
                            </span>
                          ),
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mx-auto mt-10 flex max-w-[960px] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-[0.82rem] text-subtle">
          {updated && (
            <span>
              {ui.sitemap.updated}: <time dateTime={updated}>{formatDate(updated, locale)}</time>
            </span>
          )}
          {updated && <span aria-hidden>·</span>}
          <a href={`${siteUrl}/sitemap.xml`} className="underline-offset-4 transition-colors hover:text-fg hover:underline">
            {ui.sitemap.xml}
          </a>
        </p>
      </section>
    </>
  );
}
