import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { formatDate } from "@/components/PostCard";
import { WaveDivider } from "@/components/WaveDivider";
import { localePath, preferredLocale, type Locale } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { getRouteIndex, type RouteEntry, type Section } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { formatPrice } from "@/lib/site";
import { card, chip, featureIcon, section } from "@/lib/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, ui } = await getI18n();
  return buildMetadata(undefined, { title: ui.sitemap.title, description: ui.sitemap.sub, path: "/sitemap" }, locale);
}

const SECTIONS: { key: Section; icon: string }[] = [
  { key: "pages", icon: "🧭" },
  { key: "plans", icon: "📺" },
  { key: "blog", icon: "📰" },
];

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

  return (
    <>
      <PageHero label={ui.sitemap.label} title={ui.sitemap.title} sub={ui.sitemap.sub} />
      <WaveDivider variant="f" />
      <section className={section}>
        <div className="mx-auto grid max-w-[1200px] grid-cols-3 items-start gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          {SECTIONS.map(({ key, icon }) => {
            const entries = routes.filter((e) => e.section === key && e.locales.length);
            if (!entries.length) return null;
            return (
              <nav
                key={key}
                aria-labelledby={`sitemap-${key}`}
                className={`${card} p-6 max-[480px]:p-5`}
              >
                <h2 id={`sitemap-${key}`} className="mb-4 flex items-center gap-3 text-[1rem] font-semibold text-white">
                  <span className={`${featureIcon} size-9 min-w-9`} aria-hidden>
                    {icon}
                  </span>
                  {ui.sitemap[key]}
                  <span className="ml-auto rounded-md border border-line px-1.5 py-0.5 text-[0.72rem] font-medium text-subtle">{entries.length}</span>
                </h2>
                <ul className="grid gap-1">
                  {entries.map((entry) => {
                    // A document without content in this language links to the language that has it.
                    const target: Locale = entry.locales.includes(locale) ? locale : preferredLocale(entry.locales);
                    const info = detail(entry);
                    return (
                      <li key={entry.path}>
                        <Link
                          href={localePath(target, entry.path)}
                          hrefLang={target}
                          className="group flex items-baseline gap-3 rounded-lg px-3 py-2 text-[0.9rem] text-muted transition-colors duration-200 hover:bg-white/[0.04] hover:text-fg"
                        >
                          <span className="text-subtle transition duration-200 group-hover:translate-x-0.5 group-hover:text-primary-soft" aria-hidden>
                            ›
                          </span>
                          <span className="min-w-0 flex-1 break-words">{label(entry)}</span>
                          {target !== locale && (
                            <span className={chip} title={ui.sitemap.otherLanguage}>
                              {target.toUpperCase()}
                            </span>
                          )}
                          {info && <span className="shrink-0 text-[0.78rem] whitespace-nowrap text-subtle">{info}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            );
          })}
        </div>
      </section>
    </>
  );
}
