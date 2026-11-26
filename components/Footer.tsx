import Link from "next/link";
import { getI18n } from "@/lib/locale";
import type { ContactInfo, Footer as FooterDoc } from "@/lib/sanity/types";
import { SITE_NAME, whatsappLink, type NavItem } from "@/lib/site";
import { btnLarge, btnOutline, btnPrimary } from "@/lib/ui";
import { IconArrowRight, IconChat, IconFacebook, IconMail, IconPin } from "./Icons";
import { Logo } from "./Logo";

const heading = "mb-5 text-[0.8rem] font-medium text-fg";
const link = "text-[0.88rem] text-muted transition-colors duration-200 hover:text-fg";
const contactItem = "mb-3.5 flex items-center gap-3 text-[0.88rem] break-words text-muted transition-colors duration-200";
const contactIcon = "flex size-8 min-w-8 items-center justify-center rounded-lg border border-line bg-panel text-primary-soft";
const social =
  "flex size-9 items-center justify-center rounded-lg border border-line bg-panel text-muted transition duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:text-fg";

type Props = { footer: FooterDoc; contact: ContactInfo; nav: NavItem[]; year: number };

export async function Footer({ footer, contact, nav, year }: Props) {
  const { ui, tr, href } = await getI18n();
  const wa = whatsappLink(contact);
  const email = contact?.email;
  const facebook = contact?.facebook;
  const address = tr(contact?.address);

  return (
    <footer className="relative border-t border-line bg-[#060714] px-6 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] md:px-8 max-[480px]:px-4">
      {/* Closing call to action */}
      <div className="mx-auto max-w-[1200px] pt-20 pb-20 max-md:pt-14 max-md:pb-14">
        <div className="relative isolate overflow-hidden rounded-3xl border border-line-strong bg-panel px-10 py-12 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] max-md:px-6 max-md:py-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-1/2 -right-[10%] h-[160%] w-[70%] rounded-[50%] bg-gradient-primary opacity-30 blur-[90px]" />
            <div className="absolute inset-0 bg-grid opacity-60" />
          </div>
          <div className="flex items-center justify-between gap-8 max-md:flex-col max-md:items-start">
            <div className="max-w-[560px]">
              <p className="mb-3 text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-gradient-heading">
                {ui.footer.ctaTitle}
              </p>
              <p className="text-[0.98rem] leading-[1.65] text-muted">{ui.footer.ctaText}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3 max-[480px]:w-full max-[480px]:flex-col">
              <Link href={href("/#plans")} className={`${btnPrimary} ${btnLarge}`}>
                {ui.explorePlans}
                <IconArrowRight size={16} />
              </Link>
              <Link href={href("/contact")} className={`${btnOutline} ${btnLarge}`}>
                {ui.contactUs}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mb-14 grid max-w-[1200px] grid-cols-[2fr_1fr_1.2fr] gap-16 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-10">
        <div>
          <Logo variant="footer" href={href("/")} />
          {tr(footer?.title) && <p className="mb-2 text-[0.95rem] font-medium text-fg">{tr(footer?.title)}</p>}
          <p className="mb-6 max-w-[380px] text-[0.88rem] leading-[1.75] whitespace-pre-line text-muted">{tr(footer?.text) || ui.footer.desc}</p>
          <div className="flex gap-2">
            {wa && (
              <a href={wa} className={social} title="WhatsApp" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                <IconChat size={17} />
              </a>
            )}
            {facebook && (
              <a href={facebook} className={social} title="Facebook" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <IconFacebook size={17} />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className={social} title="Email" aria-label="Email">
                <IconMail size={17} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h2 className={heading}>{ui.footer.quickLinks}</h2>
          <ul className="grid gap-3">
            {nav.map((item) => (
              <li key={item.href + item.label}>
                <Link href={item.href} className={link}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={heading}>{ui.footer.contact}</h2>
          {email && (
            <a href={`mailto:${email}`} className={`${contactItem} hover:text-fg`}>
              <span className={contactIcon} aria-hidden><IconMail size={15} /></span>
              {email}
            </a>
          )}
          {wa && (
            <a href={wa} className={`${contactItem} hover:text-fg`} target="_blank" rel="noopener noreferrer">
              <span className={contactIcon} aria-hidden><IconChat size={15} /></span>
              {contact?.whatsapp}
            </a>
          )}
          {facebook && (
            <a href={facebook} className={`${contactItem} hover:text-fg`} target="_blank" rel="noopener noreferrer">
              <span className={contactIcon} aria-hidden><IconFacebook size={15} /></span>
              Facebook
            </a>
          )}
          {address && (
            <p className={contactItem}>
              <span className={contactIcon} aria-hidden><IconPin size={15} /></span>
              {address}
            </p>
          )}
          {!email && !wa && !facebook && (
            <Link href={href("/contact")} className={`${contactItem} hover:text-fg`}>
              <span className={contactIcon} aria-hidden><IconMail size={15} /></span>
              {ui.nav.contact}
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 border-t border-line pt-8 max-md:justify-center max-md:text-center">
        <span className="text-[0.8rem] text-subtle">
          © {year} {SITE_NAME} — {ui.footer.rights}
        </span>
        <span className="flex flex-wrap items-center gap-5 max-md:justify-center">
          <Link href={href("/sitemap")} className="text-[0.8rem] text-subtle transition-colors duration-200 hover:text-fg">
            {ui.footer.sitemap}
          </Link>
          <Link href={href("/policy")} className="text-[0.8rem] text-subtle transition-colors duration-200 hover:text-fg">
            {ui.footer.policy}
          </Link>
          <span className="rounded-md border border-highlight/25 bg-highlight/10 px-2 py-0.5 text-[0.75rem] font-medium text-highlight">
            {ui.footer.tagline}
          </span>
        </span>
      </div>
    </footer>
  );
}
