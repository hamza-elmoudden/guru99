import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { WaveDivider } from "@/components/WaveDivider";
import { PageHero } from "@/components/PageHero";
import { PostCard } from "@/components/PostCard";
import { getBlogPage, getPostsPage } from "@/lib/data";
import type { Dict } from "@/lib/i18n";
import { btnOutline, emptyNote, section } from "@/lib/ui";
import { getI18n } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [{ locale, ui, tr }, blog] = await Promise.all([getI18n(), getBlogPage()]);
  return buildMetadata(blog?.seo, {
    title: tr(blog?.title) || ui.blog.title,
    description: tr(blog?.description),
    path: "/blog",
  }, locale);
}

export default async function BlogPage({ searchParams }: PageProps<"/[lang]/blog">) {
  const [{ ui, tr, href }, blog] = await Promise.all([getI18n(), getBlogPage()]);
  const perPage = blog?.postsPerPage || 9;

  return (
    <>
      <PageHero label={ui.blog.label} title={tr(blog?.title) || ui.blog.title} sub={tr(blog?.description)} />
      <WaveDivider variant="f" />
      <section className={section}>
        {/* ?page= is request data, so the list streams in behind a fallback. */}
        <Suspense fallback={<p className={emptyNote}>…</p>}>
          <PostList searchParams={searchParams} perPage={perPage} ui={ui.blog} base={href("/blog")} />
        </Suspense>
      </section>
    </>
  );
}

async function PostList({
  searchParams,
  perPage,
  ui,
  base,
}: {
  searchParams: PageProps<"/[lang]/blog">["searchParams"];
  perPage: number;
  ui: Dict["blog"];
  base: string;
}) {
  const raw = (await searchParams).page;
  const page = Math.max(1, Number.parseInt(Array.isArray(raw) ? raw[0] : (raw ?? "1"), 10) || 1);
  const { posts, total } = await getPostsPage(page, perPage);
  const pages = Math.max(1, Math.ceil(total / perPage));

  if (!posts.length) return <p className={emptyNote}>{ui.empty}</p>;

  return (
    <>
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 max-[480px]:grid-cols-1">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      {pages > 1 && (
        <nav className="mt-12 flex flex-wrap justify-center gap-4" aria-label="Pagination">
          {page > 1 && (
            <Link className={btnOutline} href={page === 2 ? base : `${base}?page=${page - 1}`}>
              {ui.prev}
            </Link>
          )}
          {page < pages && (
            <Link className={btnOutline} href={`${base}?page=${page + 1}`}>
              {ui.next}
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
