import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { IconChat, IconFacebook, IconMail, IconPin } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { getContactInfo } from "@/lib/data";
import { getI18n } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";
import { featureIcon, infoCard, infoCardHover, section } from "@/lib/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, ui } = await getI18n();
  return buildMetadata(undefined, { title: ui.contact.title, description: ui.contact.sub, path: "/contact" }, locale);
}

export default async function ContactPage() {
  const [{ locale, ui, tr }, contact] = await Promise.all([getI18n(), getContactInfo()]);
  const wa = whatsappLink(contact);
  const address = tr(contact?.address);
  const hasDetails = Boolean(wa || contact?.email || contact?.facebook || address);

  return (
    <>
      <PageHero label={ui.contact.label} title={ui.contact.title} sub={ui.contact.sub} />
      <section className={section}>
        <div
          className={`mx-auto grid max-w-[1100px] items-start gap-12 max-lg:grid-cols-1 ${
            hasDetails ? "grid-cols-[1.1fr_1fr]" : "grid-cols-[minmax(0,560px)] justify-center"
          }`}
        >
          <div className="flex flex-col gap-3" hidden={!hasDetails}>
            <h2 className="sr-only">{ui.contact.label}</h2>
            {wa && (
              <a href={wa} className={`${infoCard} ${infoCardHover} text-fg`} target="_blank" rel="noopener noreferrer">
                <span className={featureIcon} aria-hidden><IconChat /></span>
                <div className="min-w-0 break-words whitespace-pre-line text-[0.95rem]">
                  <h3 className="mb-0.5 block text-[0.72rem] font-medium tracking-[0.04em] text-subtle uppercase">{ui.contact.whatsapp}</h3>
                  {contact?.whatsapp}
                </div>
              </a>
            )}
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className={`${infoCard} ${infoCardHover} text-fg`}>
                <span className={featureIcon} aria-hidden><IconMail /></span>
                <div className="min-w-0 break-words whitespace-pre-line text-[0.95rem]">
                  <h3 className="mb-0.5 block text-[0.72rem] font-medium tracking-[0.04em] text-subtle uppercase">{ui.contact.emailLabel}</h3>
                  {contact.email}
                </div>
              </a>
            )}
            {contact?.facebook && (
              <a href={contact.facebook} className={`${infoCard} ${infoCardHover} text-fg`} target="_blank" rel="noopener noreferrer">
                <span className={featureIcon} aria-hidden><IconFacebook /></span>
                <div className="min-w-0 break-words whitespace-pre-line text-[0.95rem]">
                  <h3 className="mb-0.5 block text-[0.72rem] font-medium tracking-[0.04em] text-subtle uppercase">{ui.contact.facebook}</h3>
                  {contact.facebook.replace(/^https?:\/\/(www\.)?/, "")}
                </div>
              </a>
            )}
            {address && (
              <div className={`${infoCard} text-fg`}>
                <span className={featureIcon} aria-hidden><IconPin /></span>
                <div className="min-w-0 break-words whitespace-pre-line text-[0.95rem]">
                  <h3 className="mb-0.5 block text-[0.72rem] font-medium tracking-[0.04em] text-subtle uppercase">{ui.contact.address}</h3>
                  {address}
                </div>
              </div>
            )}
          </div>
          <ContactForm locale={locale} labels={ui.contact} />
        </div>
      </section>
    </>
  );
}
