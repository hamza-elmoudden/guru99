import { childSitemapXml, sitemapCount, xmlResponse } from "@/lib/sitemap-xml";

// Child sitemaps (/sitemaps/1.xml, …), only used once /sitemap.xml becomes an index.
// Cache Components needs at least one param, so "1.xml" is always generated (it 404s when unused).
export async function generateStaticParams() {
  const count = await sitemapCount();
  return Array.from({ length: Math.max(count, 1) }, (_, i) => ({ file: `${i + 1}.xml` }));
}

export async function GET(_request: Request, { params }: RouteContext<"/sitemaps/[file]">) {
  const { file } = await params;
  const match = /^(\d+)\.xml$/.exec(file);
  const xml = match ? await childSitemapXml(Number(match[1])) : null;
  if (!xml) return new Response("Not found", { status: 404 });
  return xmlResponse(xml);
}
