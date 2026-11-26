import { FeatureGrid } from "@/components/FeatureGrid";
import { getI18n } from "@/lib/locale";
import { section, sectionHeadCenter, sectionSubCenter, sectionTitle } from "@/lib/ui";

/** "Why choose us" grid of six feature cards (home page, after About). */
export async function FeaturesSection({ id = "features" }: { id?: string }) {
  const { ui } = await getI18n();
  const { label, title, sub, items } = ui.features;
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className={`${section} relative isolate overflow-hidden`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Faint dot grid, fading out towards the edges. */}
        <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.03)_1px,transparent_1px)] bg-size-[22px_22px] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        {/* Pink / blue glow in the bottom-right corner. */}
        <div className="absolute -right-[10%] -bottom-[15%] h-[55%] w-[45%] rounded-[50%] bg-[radial-gradient(circle_at_30%_40%,rgb(236_72_153/0.14),transparent_60%),radial-gradient(circle_at_70%_60%,rgb(59_130_246/0.12),transparent_60%)] blur-[80px]" />
      </div>

      <div className={sectionHeadCenter}>
        <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-[#38bdf8] uppercase">{label}</p>
        <h2 id={headingId} className={sectionTitle}>
          {title}
        </h2>
        <p className={sectionSubCenter}>{sub}</p>
      </div>

      <FeatureGrid items={items} />
    </section>
  );
}
