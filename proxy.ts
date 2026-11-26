import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";

/**
 * Locale-less URLs (`/`, `/plans`) always open in the default language (Finnish).
 * The browser language and previously viewed language are ignored on purpose;
 * visitors switch language with the FI/EN switch (`/en/...`).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, metadata files and anything with a file extension (public/ assets).
  matcher: ["/((?!_next|api|sitemap.xml|robots.txt|favicon.ico|.*\\..*).*)"],
};
