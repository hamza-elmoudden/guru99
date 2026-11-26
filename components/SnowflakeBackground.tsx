import { Snowflake } from "./Snowflake";

/** Position, size and timing of each snowflake. Negative delays desync them from the first frame. */
const FLAKES = [
  { top: "6%", left: "4%", size: 200, drift: "26s", driftDelay: "0s", opacity: 0.2, tilt: -12 },
  { top: "12%", left: "72%", size: 150, drift: "20s", driftDelay: "-6s", opacity: 0.17, tilt: 14 },
  { top: "48%", left: "40%", size: 260, drift: "32s", driftDelay: "-12s", opacity: 0.11, tilt: -6 },
  { top: "62%", left: "8%", size: 120, drift: "18s", driftDelay: "-3s", opacity: 0.19, tilt: 20 },
  { top: "70%", left: "80%", size: 180, drift: "24s", driftDelay: "-9s", opacity: 0.15, tilt: -18 },
  { top: "34%", left: "88%", size: 100, drift: "16s", driftDelay: "-14s", opacity: 0.19, tilt: 8 },
];

/** Decorative layer of faint drifting snowflakes (Finnish winter motif). Place inside a `relative` container. */
export function SnowflakeBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {FLAKES.map((l, i) => (
        <div
          key={i}
          className="absolute animate-leaf-drift motion-reduce:animate-none"
          style={{
            top: l.top,
            left: l.left,
            width: l.size,
            height: l.size,
            opacity: l.opacity * 0.45,
            animationDuration: l.drift,
            animationDelay: l.driftDelay,
          }}
        >
          <Snowflake
            className={`size-full ${i % 3 === 1 ? "text-accent-pink" : "text-primary-soft"}`}
            style={{ rotate: `${l.tilt}deg` }}
          />
        </div>
      ))}
    </div>
  );
}
