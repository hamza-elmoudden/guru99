import Image from "next/image";
import { altText } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";

// Logos in public/channel/. Filenames contain spaces and "+", so they are URL-encoded.
const CHANNELS: { file: string; name: string }[] = [
  { file: "yle.jpeg", name: "Yle" },
  { file: "TVN.jpeg", name: "TVN" },
  { file: "Sky Sports.jpeg", name: "Sky Sports" },
  { file: "DAZN.jpeg", name: "DAZN" },
  { file: "bein.jpeg", name: "beIN Sports" },
  { file: "espn premiun.jpeg", name: "ESPN" },
  { file: "nextflex.jpeg", name: "Netflix" },
  { file: "hbo_max.jpeg", name: "HBO Max" },
  { file: "Disney+.jpeg", name: "Disney+" },
  { file: "primevideo.jpeg", name: "Prime Video" },
  { file: "paramount.jpeg", name: "Paramount+" },
  { file: "tv.jpeg", name: "Live TV" },
];

export async function ChannelsSlider() {
  const { ui } = await getI18n();
  // The list is rendered twice so the -50% translate loops seamlessly.
  const loop = [...CHANNELS, ...CHANNELS];
  return (
    <div id="brands" aria-label={ui.channelsLabel} className="relative z-10 border-y border-line bg-panel/40 py-10">
      <p className="mb-7 text-center text-[0.8rem] font-medium tracking-[0.02em] text-subtle">{ui.channelsLabel}</p>
      <div className="relative overflow-hidden mask-[linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-scroll-ltr gap-10 hover:[animation-play-state:paused] motion-reduce:animate-none">
          {loop.map((c, i) => (
            <div className="group flex shrink-0 flex-col items-center gap-2.5 px-2" key={i} aria-hidden={i >= CHANNELS.length}>
              <div className="relative size-14 overflow-hidden rounded-xl border border-line bg-panel opacity-70 grayscale-[70%] transition duration-300 group-hover:scale-105 group-hover:border-primary/50 group-hover:opacity-100 group-hover:grayscale-0">
                <Image
                  src={`/channel/${encodeURIComponent(c.file)}`}
                  alt={i < CHANNELS.length ? altText(ui.alt.channel, c.name) : ""}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <span className="text-[0.72rem] font-medium text-subtle transition-colors duration-300 group-hover:text-fg">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
