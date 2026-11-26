import "server-only";

import { createClient, type QueryParams } from "@sanity/client";
import { cacheLife, cacheTag } from "next/cache";
import { apiVersion, dataset, projectId } from "./env";

/** Cache tag shared by every Sanity read; `/api/revalidate` busts it. */
export const SANITY_TAG = "sanity";

// The token is server-only. It authenticates reads (so a private dataset works)
// and writes (orders + contact submissions).
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: "published",
});

/** Cached GROQ fetch. Content refreshes hourly, or immediately via the webhook. */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
): Promise<T> {
  "use cache";
  cacheLife("hours");
  cacheTag(SANITY_TAG);
  return client.fetch<T>(query, params);
}
