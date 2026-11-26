import { rootSitemapXml, xmlResponse } from "@/lib/sitemap-xml";

// Written by hand instead of app/sitemap.ts so the XML can reference the
// browser stylesheet (public/sitemap.xsl). URLs come from lib/routes.ts.
export async function GET() {
  return xmlResponse(await rootSitemapXml());
}
