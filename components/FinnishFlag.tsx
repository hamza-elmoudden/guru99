/** Flag of Finland (blue Nordic cross on white), squared for icon use. */
export function FinnishFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <rect width="64" height="64" fill="#fff" />
      <rect y="23" width="64" height="18" fill="#002f6c" />
      <rect x="16" width="18" height="64" fill="#002f6c" />
    </svg>
  );
}
