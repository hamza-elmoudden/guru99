import type { Metadata } from "next";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { WaveDivider } from "@/components/WaveDivider";
import { MoviesSlider } from "@/components/MoviesSlider";
import { PageHero } from "@/components/PageHero";
import { getFaqPage } from "@/lib/data";
import { getI18n } from "@/lib/locale";
import { faqNode, graph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [{ locale, ui, tr }, faq] = await Promise.all([getI18n(), getFaqPage()]);
  return buildMetadata(faq?.seo, { title: tr(faq?.title) || ui.faq.title, path: "/faq" }, locale);
}

export default async function FaqPage() {
  const [{ locale, ui, tr }, faq] = await Promise.all([getI18n(), getFaqPage()]);
  const title = tr(faq?.title) || ui.faq.title;

  return (
    <>
      {faq?.questions?.length ? <JsonLd data={graph(faqNode(faq, "/faq", title, locale))} /> : null}
      <PageHero label={ui.faq.label} title={title} />
      <WaveDivider variant="f" />
      <FaqSection faq={faq} showHeader={false} />
      <MoviesSlider />
    </>
  );
}
