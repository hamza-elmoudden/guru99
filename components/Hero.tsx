import Image from "next/image";
import Link from "next/link";
import { getI18n } from "@/lib/locale";
import type { HomePage } from "@/lib/sanity/types";
import { btnLarge, btnOutline, btnPrimary } from "@/lib/ui";
import { HeroReveal, HeroTitle } from "@/components/HeroText";
import { IconArrowRight, IconPlay } from "@/components/Icons";
import heroImage from "@/public/candaherosection.jpeg";

export async function Hero({ home }: { home: HomePage }) {
  const { ui, tr, href } = await getI18n();
  const title = tr(home?.title) || ui.hero.title;
  const desc = tr(home?.shortDescription) || ui.hero.desc;

  return (
    <section
      id="hero"
      className="relative isolate -mt-[calc(var(--nav-h)+env(safe-area-inset-top,0px))] flex min-h-svh items-center overflow-hidden pt-[calc(var(--nav-h)+env(safe-area-inset-top,0px))]"
    >
      {/* Background: photo kept as texture, the generic gradient as an aurora, a faint grid, fade to page. */}
      <Image
        src={heroImage}
        alt={ui.alt.hero}
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover opacity-30 saturate-[0.85]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/85 to-bg/50" />
        <div className="absolute -top-[30%] -right-[15%] h-[90%] w-[75%] animate-aurora rounded-[50%] bg-gradient-primary opacity-35 blur-[120px] motion-reduce:animate-none max-md:-right-[40%] max-md:w-[120%]" />
        <div className="absolute -bottom-[35%] -left-[10%] h-[60%] w-[50%] rounded-[50%] bg-gradient-secondary opacity-20 blur-[120px]" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-bg" />
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6 py-24 md:px-8 max-[480px]:px-4 max-[480px]:py-16">
        <div className="max-w-[760px]">
          <Link
            href={href("/#plans")}
            className="group mb-8 inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-panel/70 py-1 pr-3 pl-1 text-[0.8rem] font-medium text-muted backdrop-blur transition-colors hover:border-white/25 hover:text-fg"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-highlight/30 bg-highlight/12 px-2 py-0.5 text-highlight">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-highlight" />
              {ui.hero.live}
            </span>
            {ui.hero.badge}
            <IconArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>

          <HeroTitle
            text={title}
            className="mb-6 text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-white"
          />
          <HeroReveal>
            <p className="mb-10 max-w-[580px] text-[1.125rem] leading-[1.7] text-muted max-[480px]:text-base">{desc}</p>

            <div className="flex flex-wrap gap-3 max-[480px]:flex-col">
              <Link href={href("/#plans")} className={`${btnPrimary} ${btnLarge}`}>
                <IconPlay size={16} />
                {ui.explorePlans}
              </Link>
              <Link href={href("/contact")} className={`${btnOutline} ${btnLarge}`}>
                {ui.contactUs}
                <IconArrowRight size={16} />
              </Link>
            </div>

            <dl className="mt-16 grid max-w-[720px] grid-cols-4 gap-px overflow-hidden rounded-2xl border border-line bg-line backdrop-blur-md max-sm:grid-cols-2">
              {ui.hero.stats.map(([num, label]) => (
                <div
                  className="flex flex-col-reverse gap-1.5 bg-bg/85 px-5 py-5"
                  key={label}
                >
                  <dt className="text-[0.8rem] text-muted">{label}</dt>
                  <dd className="text-[1.75rem] leading-none font-semibold tracking-[-0.03em] text-gradient-heading">{num}</dd>
                </div>
              ))}
            </dl>
          </HeroReveal>
        </div>
      </div>
    </section>
  );
}
