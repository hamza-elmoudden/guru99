import type { CSSProperties } from "react";

const ARM = "M0 0V-44M0-16l-10-10M0-16l10-10M0-30l-8-8M0-30l8-8";

/** Six-armed snowflake (Finnish winter motif), stroked with currentColor. */
export function Snowflake({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      aria-hidden
    >
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <path key={r} d={ARM} transform={`rotate(${r})`} />
      ))}
    </svg>
  );
}
