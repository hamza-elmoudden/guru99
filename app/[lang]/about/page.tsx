import type { Metadata } from "next";
import { ChannelsSlider } from "@/components/ChannelsSlider";
import { InfoSections } from "@/components/InfoSections";
import { JsonLd } from "@/components/JsonLd";
import { WaveDivider } from "@/components/WaveDivider";
import { PageHero } from "@/components/PageHero";
import { PricingSection } from "@/components/PricingSection";
import { getAboutPage, getInfoSections, getPlanSection, getPlans } from "@/lib/data";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { ORG_ID, WEBSITE_ID } from "@/lib/jsonld";
import { siteUrl } from "@/lib/sanity/env";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [{ locale, ui, tr }, about] = await Promise.all([getI18n(), getAboutPage()]);
  return buildMetadata(about?.seo, {
    title: tr(about?.title) || ui.nav.about,
    description: tr(about?.description),
    path: "/about",
  }, locale);
}

export default async function AboutPage() {
  const [{ locale, ui, tr }, about, sections, plans, planSection] = await Promise.all([
    getI18n(),
    getAboutPage(),
    getInfoSections(),
    getPlans(),
    getPlanSection(),
  ]);
  const title = tr(about?.title) || ui.about.title;
  const description = tr(about?.description);
  const url = `${siteUrl}${localePath(locale, "/about")}`;
  const features = (about?.list ?? [])
    .map((item) => ({ icon: item.icone, text: tr(item.text) }))
    .filter((f) => f.text);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": `${url}#webpage`,
          url,
          name: title,
          inLanguage: locale,
          description: description || undefined,
          isPartOf: { "@id": WEBSITE_ID },
          about: { "@id": ORG_ID },
          mainEntity: { "@id": ORG_ID },
        }}
      />
      <PageHero label={ui.about.label} title={title} sub={description} />
      <ChannelsSlider />
      <WaveDivider variant="f" />
      <InfoSections sections={sections} features={features} leaves />
      <WaveDivider variant="g" />
      <PricingSection plans={plans} section={planSection} leaves />
    </>
  );
}
