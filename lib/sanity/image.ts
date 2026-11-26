import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImage) {
  return builder.image(source).auto("format").fit("max");
}

export function hasImage(img?: SanityImage | null): img is SanityImage {
  return Boolean(img?.asset?._ref);
}
