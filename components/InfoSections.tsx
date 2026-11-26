import Image from "next/image";
import { Fragment } from "react";
import { DeviceMockup } from "@/components/DeviceMockup";
import { SnowflakeBackground } from "@/components/SnowflakeBackground";
import { WaveDivider } from "@/components/WaveDivider";
import { altText } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { hasImage, urlFor } from "@/lib/sanity/image";
import type { InfoSection } from "@/lib/sanity/types";
import { IconCheck } from "@/components/Icons";
import { featureIcon, infoCard, infoCardHover, section, sectionLabel, sectionSub, sectionTitle } from "@/lib/ui";
import sectionImage from "@/public/canda_infosection.jpeg";

type Feature = { icon?: string; text: string };

type Props = {
  sections: InfoSection[];
  /** Optional feature rows rendered under the first section (aboutPage.list). */
  features?: Feature[];
  id?: string;
  /** Show the animated snowflake background (home and about pages). */
  leaves?: boolean;
  /** Replace the first section's image with the animated device mockup (home page). */
  mockup?: boolean;
};

/** "About" block(s) driven by Sanity `infoSection` documents. */
export async function InfoSections({ sections, features, id = "about", leaves = false, mockup = false }: Props) {
  const { locale, ui, tr } = await getI18n();
  const items: (InfoSection | null)[] = sections.length ? sections : [null];

  return (
    <section id={id} className={`${section} relative isolate overflow-hidden`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[10%] -left-[20%] h-[50%] w-[60%] rounded-[50%] bg-primary/20 blur-[140px]" />
        <div className="absolute -right-[15%] bottom-[5%] h-[40%] w-[45%] rounded-[50%] bg-gradient-secondary opacity-15 blur-[140px]" />
        {leaves && <SnowflakeBackground />}
      </div>
      {items.map((s, i) => {
        const title = s ? tr(s.title) : ui.about.title;
        const text = s ? tr(s.text) : "";
        const imageLeft = s?.imagePosition === "left";
        const alt = s && title ? altText(ui.alt.section, title) : ui.about.imageAlt;
        const showMockup = mockup && i === 0;

        return (
          <Fragment key={s?._id ?? i}>
          {i > 0 && <WaveDivider variant={i % 2 ? "b" : "a"} inline />}
          <div className={`relative mx-auto grid max-w-[1200px] grid-cols-2 items-center gap-20 not-first:mt-28 max-lg:gap-12 max-md:grid-cols-1 max-md:not-first:mt-20 ${showMockup ? "max-lg:grid-cols-1 max-lg:gap-20" : ""}`}>
            <div className={`max-md:order-2 ${imageLeft ? "order-2" : "order-1"}`}>
              {i === 0 && <span className={sectionLabel}>{ui.about.label}</span>}
              <h2 className={sectionTitle}>{title}</h2>
              {text && <p className={sectionSub}>{text}</p>}

              {i === 0 && features && features.length > 0 && (
                <div className="mt-10 grid gap-3">
                  {features.map((f, j) => (
                    <div className={`${infoCard} ${infoCardHover}`} key={j}>
                      <div className={featureIcon} aria-hidden>{f.icon || <IconCheck size={18} />}</div>
                      <h3 className="text-[0.95rem] font-medium text-fg">{f.text}</h3>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showMockup ? (
              <div className={`relative py-8 max-md:order-1 ${imageLeft ? "order-1" : "order-2"}`}>
                <DeviceMockup locale={locale} />
              </div>
            ) : (
            <div className={`relative max-md:order-1 ${imageLeft ? "order-1" : "order-2"}`}>
              <div aria-hidden className="pointer-events-none absolute -inset-6 -z-1 rounded-[40px] bg-gradient-secondary opacity-20 blur-3xl" />
              <div aria-hidden className="pointer-events-none absolute inset-0 z-1 rounded-2xl shadow-[inset_0_0_0_1px_rgb(236_238_255/0.1)]" />
              {s && hasImage(s.image) ? (
                <Image
                  src={urlFor(s.image).width(1200).url()}
                  alt={alt}
                  width={1200}
                  height={800}
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="block h-auto w-full rounded-2xl shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]"
                />
              ) : (
                <Image
                  src={sectionImage}
                  alt={alt}
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="block h-auto w-full rounded-2xl shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]"
                />
              )}
            </div>
            )}
          </div>
          </Fragment>
        );
      })}
    </section>
  );
}
