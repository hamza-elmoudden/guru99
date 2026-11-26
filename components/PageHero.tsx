import { sectionLabel, sectionSubCenter } from "@/lib/ui";

type Props = { label?: string; title: string; sub?: string };

/** Inner-page header: dark canvas with a soft aurora of the generic gradient and a faint grid. */
export function PageHero({ label, title, sub }: Props) {
  return (
    <header className="relative isolate overflow-hidden border-b border-line px-6 pt-24 pb-20 text-center md:px-8 max-[480px]:px-4 max-[480px]:pt-16 max-[480px]:pb-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-[60%] left-1/2 h-[120%] w-[min(1100px,140%)] -translate-x-1/2 rounded-[50%] bg-gradient-primary opacity-30 blur-[110px]" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-b from-transparent to-bg" />
      </div>
      {label && <span className={sectionLabel}>{label}</span>}
      <h1 className="mx-auto mb-5 max-w-[820px] text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-gradient-heading">
        {title}
      </h1>
      {sub && <p className={sectionSubCenter}>{sub}</p>}
    </header>
  );
}
