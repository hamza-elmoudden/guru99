"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCALES, switchLocalePath, type Locale } from "@/lib/i18n";
import type { NavItem } from "@/lib/site";
import { Logo } from "./Logo";

const navCta =
  "btn-gradient inline-flex items-center justify-center rounded-lg font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] transition duration-200";

type Props = {
  items: NavItem[];
  locale: Locale;
  homeHref: string;
  ctaHref: string;
  ctaLabel: string;
  menuLabel: string;
  languageLabel: string;
};

function LanguageSwitch({
  locale,
  pathname,
  label,
  mobile = false,
}: {
  locale: Locale;
  pathname: string;
  label: string;
  mobile?: boolean;
}) {
  return (
    <div
      className="inline-flex rounded-lg border border-line bg-panel/80 p-[3px]"
      role="group"
      aria-label={label}
    >
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={switchLocalePath(pathname, l)}
          className={`rounded-md font-semibold tracking-[0.04em] text-subtle transition duration-200 hover:text-fg aria-[current=true]:bg-elevated aria-[current=true]:text-fg aria-[current=true]:shadow-[inset_0_0_0_1px_rgb(236_238_255/0.1)] ${
            mobile ? "px-3 py-1 text-[0.8rem]" : "px-2.5 py-1 text-[0.72rem]"
          }`}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

export function Navbar({ items, locale, homeHref, ctaHref, ctaLabel, menuLabel, languageLabel }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) =>
    href === homeHref ? pathname === homeHref : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-100">
      <nav
        className={`relative z-100 flex h-[calc(var(--nav-h)+env(safe-area-inset-top,0px))] items-center justify-between border-b px-8 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 max-md:px-4 ${
          scrolled || open ? "border-line bg-bg/80" : "border-transparent bg-bg/40"
        }`}
      >
        <Logo href={homeHref} />

        <div className="max-md:hidden">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-[0.88rem] font-medium text-muted transition-colors duration-200 hover:bg-white/[0.05] hover:text-fg aria-[current=page]:text-fg"
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3 max-md:hidden">
          <LanguageSwitch locale={locale} pathname={pathname} label={languageLabel} />
          <Link href={ctaHref} className={`${navCta} h-9 px-4 text-[0.88rem]`}>
            {ctaLabel}
          </Link>
        </div>

        <div className="hidden items-center gap-3 max-md:flex">
        <LanguageSwitch locale={locale} pathname={pathname} label={languageLabel} mobile />
        <button
          type="button"
          className="group flex size-10 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-lg border border-line bg-panel/80"
          aria-label={menuLabel}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-[1.5px] w-[18px] rounded-xs bg-fg transition duration-300 group-aria-expanded:translate-y-[6.5px] group-aria-expanded:rotate-45" />
          <span className="block h-[1.5px] w-[18px] rounded-xs bg-fg transition duration-300 group-aria-expanded:opacity-0" />
          <span className="block h-[1.5px] w-[18px] rounded-xs bg-fg transition duration-300 group-aria-expanded:-translate-y-[6.5px] group-aria-expanded:-rotate-45" />
        </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full z-99 flex-col gap-1 border-b border-line bg-bg/95 px-4 pt-3 pb-6 shadow-[0_24px_48px_-12px_rgb(0_0_0/0.7)] backdrop-blur-xl md:hidden ${
          open ? "flex" : "hidden"
        }`}
      >
        {items.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className="rounded-lg px-3 py-3 text-base font-medium text-muted transition-colors hover:bg-white/[0.05] hover:text-fg aria-[current=page]:bg-white/[0.04] aria-[current=page]:text-fg"
            aria-current={isActive(item.href) ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href={ctaHref}
          className={`${navCta} mt-3 h-11 w-full px-5 text-base`}
          onClick={() => setOpen(false)}>
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}
