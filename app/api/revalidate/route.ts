import { revalidateTag } from "next/cache";
import { SANITY_TAG } from "@/lib/sanity/client";

/**
 * Sanity webhook target. Configure a webhook in sanity.io/manage pointing to
 *   POST {SITE_URL}/api/revalidate?secret={SANITY_REVALIDATE_SECRET}
 * so published content shows up without waiting for the hourly cache expiry.
 */
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const provided =
    new URL(request.url).searchParams.get("secret") ?? request.headers.get("x-revalidate-secret");

  if (!secret || provided !== secret) {
    return Response.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  revalidateTag(SANITY_TAG, "max");
  return Response.json({ revalidated: true, now: Date.now() });
}
