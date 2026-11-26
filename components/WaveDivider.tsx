/**
 * Section seam: a 1px gradient hairline with a soft bloom, Linear-style.
 * Variants alternate between the generic (`primary`) and matching (`secondary`)
 * gradients so consecutive seams don't look identical.
 */
const VARIANTS = {
  a: { gradient: "bg-gradient-secondary", glow: "bg-gradient-secondary" },
  b: { gradient: "bg-gradient-primary", glow: "bg-gradient-primary" },
  c: { gradient: "bg-gradient-secondary", glow: "bg-primary" },
  d: { gradient: "bg-gradient-primary", glow: "bg-gradient-secondary" },
  e: { gradient: "bg-gradient-secondary", glow: "bg-gradient-primary" },
  f: { gradient: "bg-gradient-primary", glow: "bg-primary" },
  g: { gradient: "bg-gradient-secondary", glow: "bg-gradient-secondary" },
} as const;

type Props = {
  variant?: keyof typeof VARIANTS;
  /** Render in normal flow (between blocks inside a section) instead of overlapping a section boundary. */
  inline?: boolean;
};

export function WaveDivider({ variant = "a", inline = false }: Props) {
  const v = VARIANTS[variant];
  return (
    <div
      aria-hidden
      className={`pointer-events-none relative z-10 w-full ${inline ? "mx-auto mt-28 h-px max-w-[1200px] max-md:mt-20" : "h-0"}`}
    >
      {/* bloom */}
      <div
        className={`absolute top-1/2 left-1/2 h-24 w-[min(720px,80%)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] opacity-25 blur-3xl ${v.glow}`}
      />
      {/* hairline, fading out toward both edges */}
      <div
        className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 opacity-70 mask-[linear-gradient(90deg,transparent,#000_30%,#000_70%,transparent)] ${v.gradient}`}
      />
    </div>
  );
}
