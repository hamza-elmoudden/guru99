// GROQ queries, based on schema_query/sanity-queries.txt.
// Change from the source file: slugs are projected to plain strings ("slug": slug.current).

const SEO = `seo {
  metaTitle, metaDescription, keywords, canonicalUrl, noIndex,
  ogTitle, ogDescription, ogImage, ogType
}`;

// ── Singletons ────────────────────────────────────────────
export const HOME_PAGE_QUERY = `*[_type == "homePage"][0] {
  title, shortDescription, ${SEO}
}`;

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0] {
  title, description, list[] { icone, text }, ${SEO}
}`;

export const FAQ_PAGE_QUERY = `*[_type == "faqPage"][0] {
  title, questions[] { question, answer }, ${SEO}
}`;

export const BLOG_PAGE_QUERY = `*[_type == "blogPage"][0] {
  title, description, postsPerPage, ${SEO}
}`;

export const CONTACT_INFO_QUERY = `*[_type == "contactInfo"][0] {
  whatsapp, email, facebook, address
}`;

export const FOOTER_QUERY = `*[_type == "footer"][0] { title, text }`;

export const NAVBAR_QUERY = `*[_type == "navbar"][0] { names[] }`;

export const PLAN_SECTION_QUERY = `*[_type == "plansection"][0] { title, shorttext }`;

// ── Collections ───────────────────────────────────────────
export const INFO_SECTIONS_QUERY = `*[_type == "infoSection"] | order(_createdAt asc) {
  _id, name, title, text, image, imagePosition
}`;

const PLAN_FIELDS = `
  _id, title, shortDescription, description, currency, price, oldPrice,
  image, salesCount, "slug": slug.current, ${SEO}
`;

export const PLANS_QUERY = `*[_type == "plan" && defined(slug.current)] | order(price asc) {
  ${PLAN_FIELDS}
}`;

export const PLAN_BY_SLUG_QUERY = `*[_type == "plan" && slug.current == $slug][0] {
  ${PLAN_FIELDS}
}`;


const POST_CARD_FIELDS = `
  _id, title, "slug": slug.current, coverImage,
  categories[]-> { _id, title, color },
  tags, author-> { name, avatar }, status, publishedAt, featured, excerpt
`;

// Only published posts are public. Featured posts are pinned to the top.
const PUBLISHED_POSTS = `*[_type == "post" && status == "published" && defined(slug.current)]`;

export const POSTS_PAGE_QUERY = `{
  "total": count(${PUBLISHED_POSTS}),
  "posts": ${PUBLISHED_POSTS} | order(featured desc, publishedAt desc) [$start...$end] {
    ${POST_CARD_FIELDS}
  }
}`;

export const POST_BY_SLUG_QUERY = `${PUBLISHED_POSTS}[slug.current == $slug][0] {
  ${POST_CARD_FIELDS}, body, ${SEO}
}`;

// ── Route index (sitemaps + generateStaticParams) ─────────
// Translations are per field, so a document "exists" in a language when its
// title and main text are filled in that language (see lib/routes.ts).
const HAS = (field: string, l: string) => `(length(title.${l}) > 0 && length(${field}.${l}) > 0) == true`;
const INDEXING = `"noIndex": seo.noIndex == true, "canonicalUrl": seo.canonicalUrl`;

export const ROUTE_INDEX_QUERY = `{
  "singletons": *[_type in ["homePage", "aboutPage", "faqPage", "blogPage", "contactInfo"]] {
    _type, _updatedAt, ${INDEXING}
  },
  "plans": *[_type == "plan" && defined(slug.current)] | order(price asc) {
    "slug": slug.current, _updatedAt, title, price, currency,
    "fi": ${HAS("description", "fi")}, "en": ${HAS("description", "en")}, ${INDEXING}
  },
  "posts": ${PUBLISHED_POSTS} | order(publishedAt desc) {
    "slug": slug.current, _updatedAt, publishedAt, title,
    "fi": ${HAS("body", "fi")}, "en": ${HAS("body", "en")}, ${INDEXING}
  }
}`;
