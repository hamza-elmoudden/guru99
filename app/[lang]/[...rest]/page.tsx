import { notFound } from "next/navigation";

// Unmatched URLs under /fi or /en land here so they get the localized not-found page.
// Cache Components needs at least one static param.
export async function generateStaticParams() {
  return [{ rest: ["__placeholder__"] }];
}

export default function CatchAll() {
  notFound();
}
