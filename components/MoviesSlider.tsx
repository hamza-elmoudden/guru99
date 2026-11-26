import { MoviesTrack } from "@/components/MoviesTrack";
import { altText } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { sectionHeadCenter, sectionLabel, sectionSubCenter, sectionTitle } from "@/lib/ui";

// Posters in public/movies/ (WebP, 360px wide). Filenames contain spaces and Polish characters, so they are URL-encoded.
const MOVIES: { file: string; title: string }[] = [
  { file: "the-unknown-soldier.jpeg", title: "The Unknown Soldier" },
  { file: "sisu.jpeg", title: "Sisu" },
  { file: "bordertown.jpeg", title: "Bordertown" },
  { file: "rare-exports.jpeg", title: "Rare Exports" },
  { file: "room.jpeg", title: "Room" },
  { file: "game of thrones.webp", title: "Game of Thrones" },
  { file: "Boże Ciało.webp", title: "Boże Ciało" },
  { file: "iptv peaky balnders netflex free.webp", title: "Peaky Blinders" },
  { file: "the hobbit.webp", title: "The Hobbit" },
  { file: "vikings.webp", title: "Vikings" },
  { file: "aquaman movies iptv.webp", title: "Aquaman" },
  { file: "titanic  movies free .webp", title: "Titanic" },
  { file: "movies lucifer free.webp", title: "Lucifer" },
  { file: "troy movies.webp", title: "Troy" },
  { file: "unchart movies iptv.webp", title: "Uncharted" },
  { file: "juman fro free.webp", title: "Jumanji" },
];

export async function MoviesSlider() {
  const { ui } = await getI18n();

  return (
    <section id="movies" className="relative isolate overflow-x-clip py-28 max-[480px]:py-20" aria-labelledby="movies-title">
      <div className={`${sectionHeadCenter} px-6 md:px-8`}>
        <span className={sectionLabel}>{ui.movies.label}</span>
        <h2 id="movies-title" className={sectionTitle}>
          {ui.movies.title}
        </h2>
        <p className={sectionSubCenter}>{ui.movies.sub}</p>
      </div>

      <MoviesTrack movies={MOVIES.map((m) => ({ ...m, alt: altText(ui.alt.movie, m.title) }))} />
    </section>
  );
}
