import Link from "next/link";
import { FinnishFlag } from "./FinnishFlag";

const styles = {
  nav: { link: "", icon: "size-8 rounded-lg", text: "text-[1.1rem]" },
  footer: { link: "mb-5", icon: "size-8 rounded-lg", text: "text-[1.1rem]" },
};

export function Logo({ variant = "nav", href }: { variant?: "nav" | "footer"; href: string }) {
  const s = styles[variant];
  return (
    <Link href={href} className={`flex shrink-0 items-center gap-2.5 ${s.link}`} aria-label="IPTV Pro">
      <span className={`flex overflow-hidden shadow-[0_0_0_1px_rgb(236_238_255/0.14),0_4px_12px_-4px_rgb(0_0_0/0.6)] ${s.icon}`} aria-hidden>
        <FinnishFlag className="size-full" />
      </span>
      <span className={`font-semibold tracking-[-0.02em] text-white ${s.text}`}>
        IPTV<span className="text-gradient-secondary">Pro</span>
      </span>
    </Link>
  );
}
