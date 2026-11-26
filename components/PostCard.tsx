import Image from "next/image";
import Link from "next/link";
import { altText, localePath, t, type Locale } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { hasImage, urlFor } from "@/lib/sanity/image";
import type { Post } from "@/lib/sanity/types";
import { chip } from "@/lib/ui";
import { IconArrowRight } from "./Icons";

export function formatDate(iso: string | undefined, locale: Locale) {
  if (!iso) return "";
  return new Intl.DateTimeFormat(locale === "fi" ? "fi-FI" : "en-GB", { dateStyle: "long" }).format(new Date(iso));
}

export function CategoryChips({ post, locale }: { post: Post; locale: Locale }) {
  return (
    <>
      {(post.categories ?? []).map((c) => (
        <span key={c._id} className={chip} style={c.color ? { color: c.color } : undefined}>
          {t(c.title, locale)}
        </span>
      ))}
    </>
  );
}

export async function PostCard({ post }: { post: Post }) {
  const { locale, ui, tr } = await getI18n();
  const title = tr(post.title);
  return (
    <Link href={localePath(locale, `/blog/${post.slug}`)} className={`group flex flex-col overflow-hidden rounded-2xl text-inherit transition duration-300 hover:-translate-y-1 ${
        post.featured
          ? "border-gradient-secondary shadow-[0_24px_56px_-24px_rgb(178_103_196/0.5)]"
          : "border border-line bg-panel/70 shadow-card hover:border-line-strong hover:shadow-card-hover"
      }`}>
      <div className="relative aspect-video overflow-hidden border-b border-line bg-elevated">
        {hasImage(post.coverImage) && (
          <Image
            src={urlFor(post.coverImage).width(800).height(450).fit("crop").url()}
            alt={altText(ui.alt.post, title)}
            fill
            sizes="(max-width: 480px) 100vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 px-6 pt-5 pb-6">
        <div className="flex flex-wrap items-center gap-2 text-[0.78rem] text-subtle">
          <CategoryChips post={post} locale={locale} />
          {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>}
        </div>
        <h2 className="text-[1.1rem] leading-[1.4] font-semibold tracking-[-0.015em] text-white">{title}</h2>
        {tr(post.excerpt) && <p className="text-[0.9rem] leading-[1.7] text-muted">{tr(post.excerpt)}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.88rem] font-medium text-primary-soft transition-colors group-hover:text-fg">
          {ui.blog.readMore}
          <IconArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
