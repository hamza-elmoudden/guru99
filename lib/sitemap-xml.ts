import "server-only";

import { getSitemapUrls, type SitemapUrl } from "./routes";
import { siteUrl } from "./sanity/env";

/** Google accepts up to 50,000 URLs per file; stay below it with some headroom. */
export const URLS_PER_SITEMAP = 45_000;

const XSL = `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>`;
const HEAD = `<?xml version="1.0" encoding="UTF-8"?>\n${XSL}\n`;

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const isoDate = (value?: string) => (value && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString() : undefined);

function urlNode(url: SitemapUrl) {
  const lastmod = isoDate(url.lastModified);
  return [
    "  <url>",
    `    <loc>${escape(url.loc)}</loc>`,
    ...url.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escape(a.href)}"/>`),
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
    `    <changefreq>${url.changeFrequency}</changefreq>`,
    `    <priority>${url.priority.toFixed(1)}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

function urlset(urls: SitemapUrl[]) {
  return `${HEAD}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map(urlNode).join("\n")}\n</urlset>\n`;
}

function chunks<T>(items: T[]) {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += URLS_PER_SITEMAP) out.push(items.slice(i, i + URLS_PER_SITEMAP));
  return out.length ? out : [[]];
}

/** Number of child sitemaps (1 means /sitemap.xml holds every URL itself). */
export async function sitemapCount() {
  return chunks(await getSitemapUrls()).length;
}

/** /sitemap.xml: the full urlset, or a sitemap index once the site outgrows one file. */
export async function rootSitemapXml() {
  const urls = await getSitemapUrls();
  const parts = chunks(urls);
  if (parts.length === 1) return urlset(urls);

  const items = parts.map((part, i) => {
    const lastmod = part.map((u) => isoDate(u.lastModified)).filter(Boolean).sort().at(-1);
    return `  <sitemap>\n    <loc>${siteUrl}/sitemaps/${i + 1}.xml</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </sitemap>`;
  });
  return `${HEAD}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join("\n")}\n</sitemapindex>\n`;
}

/** /sitemaps/{n}.xml (1-based); null when out of range. */
export async function childSitemapXml(n: number) {
  const parts = chunks(await getSitemapUrls());
  if (parts.length === 1 || !Number.isInteger(n) || n < 1 || n > parts.length) return null;
  return urlset(parts[n - 1]);
}

export const xmlResponse = (body: string) =>
  new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
