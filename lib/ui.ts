/**
 * Tailwind class strings shared by several components. Kept in one place so the
 * design stays consistent; Tailwind picks the classes up because it scans this file.
 *
 * Gradient rules: `bg-gradient-primary` only for big moments (hero / page headers),
 * `btn-gradient` / `border-gradient-secondary` for buttons and the featured card,
 * spot colours (primary / highlight) for icons, borders and small details.
 */

// Layout
export const container = "mx-auto w-full max-w-[1200px]";
export const section = "px-6 py-28 md:px-8 max-[480px]:px-4 max-[480px]:py-20";
export const sectionTop = "px-6 pt-16 pb-28 md:px-8 max-[480px]:px-4 max-[480px]:pt-10 max-[480px]:pb-20";
export const sectionHeadCenter = "mx-auto mb-16 max-w-[680px] text-center max-[480px]:mb-12";
export const emptyNote = "py-8 text-center text-muted";

// Section typography
export const sectionLabel =
  "mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-panel/80 px-3 py-1 text-[0.75rem] font-medium tracking-[0.02em] text-primary-soft before:size-1.5 before:rounded-full before:bg-primary-soft before:content-['']";
export const sectionTitle =
  "mb-5 text-[clamp(1.85rem,3.8vw,3rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-gradient-heading";
export const sectionSub = "max-w-[560px] text-[1.05rem] leading-[1.7] whitespace-pre-line text-muted";
export const sectionSubCenter = `${sectionSub} mx-auto`;
export const proseText = "text-base leading-[1.8] whitespace-pre-line text-fg/90";
export const backLink =
  "mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg";

// Buttons
const btnBase =
  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 text-[0.95rem] font-medium whitespace-nowrap transition duration-200 disabled:cursor-wait disabled:opacity-60";
export const btnPrimary = `${btnBase} btn-gradient text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_8px_24px_-8px_rgb(128_86_177/0.6)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_12px_32px_-8px_rgb(178_103_196/0.7)]`;
export const btnOutline = `${btnBase} border border-line-strong bg-white/[0.03] text-fg hover:border-white/25 hover:bg-white/[0.07]`;
export const btnLarge = "h-12 px-6 text-base";

// Cards
export const card = "rounded-2xl border border-line bg-panel/70 shadow-card";
export const cardPad = "p-8 max-[480px]:p-5";
export const infoCard =
  "flex items-center gap-4 rounded-xl border border-line bg-panel/70 px-5 py-4 shadow-card transition duration-200";
export const infoCardHover = "hover:border-primary/45 hover:bg-elevated";
export const featureIcon =
  "flex size-10 min-w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/12 text-[1.05rem] text-primary-soft";
export const cardPrice = "text-[2.5rem] leading-none font-semibold tracking-[-0.03em] text-white";
export const cardOldPrice = "text-[0.9rem] text-subtle";
export const cardSave =
  "ml-2 inline-block rounded-md border border-highlight/30 bg-highlight/12 px-1.5 py-0.5 text-[0.72rem] font-semibold text-highlight";
export const chip =
  "inline-block rounded-md border border-current/30 bg-current/5 px-2 py-0.5 text-[0.72rem] font-medium text-primary-soft";

// Forms
export const formCard = `${card} ${cardPad}`;
export const formGrid = "grid gap-5";
export const fieldLabel = "mb-2 block text-[0.82rem] font-medium text-muted";
const fieldBase =
  "h-11 rounded-lg border border-line-strong bg-bg/70 text-[0.95rem] text-fg transition duration-200 placeholder:text-subtle hover:border-white/22 focus:border-primary focus:ring-3 focus:ring-primary/25 focus:outline-none";
export const fieldInput = `${fieldBase} w-full px-3.5`;
export const fieldTextarea = `${fieldInput} h-auto min-h-35 resize-y py-3`;
/** Fixed-width country-code select that sits left of the phone input. */
export const fieldSelect = `${fieldBase} w-[6.5rem] shrink-0 cursor-pointer px-2`;
export const honeypot = "absolute -left-[10000px] size-px overflow-hidden";
const formMsg = "rounded-lg border px-4 py-3 text-[0.9rem] leading-[1.6]";
export const formMsgOk = `${formMsg} border-primary/40 bg-primary/12 text-surface`;
export const formMsgErr = `${formMsg} border-danger/40 bg-danger/10 text-danger`;
