// Mirrors the Studio schema in ../sanit-iptv/schemaTypes.
// Every translatable field is a `localeString` / `localeText` object: { fi, en } (fi is the Studio default).

export type LocaleValue = { fi?: string; en?: string } | null | undefined;

export type SanityImage = {
  _type?: "image";
  asset?: { _ref: string; _type?: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type Seo = {
  metaTitle?: LocaleValue;
  metaDescription?: LocaleValue;
  keywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
  ogTitle?: LocaleValue;
  ogDescription?: LocaleValue;
  ogImage?: SanityImage;
  ogType?: "website" | "article" | "product";
} | null;

export type HomePage = {
  title?: LocaleValue;
  shortDescription?: LocaleValue;
  seo?: Seo;
} | null;

export type AboutPage = {
  title?: LocaleValue;
  description?: LocaleValue;
  list?: { icone?: string; text?: LocaleValue }[] | null;
  seo?: Seo;
} | null;

export type FaqPage = {
  title?: LocaleValue;
  questions?: { question?: LocaleValue; answer?: LocaleValue }[] | null;
  seo?: Seo;
} | null;

export type BlogPage = {
  title?: LocaleValue;
  description?: LocaleValue;
  postsPerPage?: number;
  seo?: Seo;
} | null;

export type ContactInfo = {
  whatsapp?: string;
  email?: string;
  facebook?: string;
  address?: LocaleValue;
} | null;

export type Footer = { title?: LocaleValue; text?: LocaleValue } | null;

export type Navbar = { names?: LocaleValue[] | null } | null;

export type PlanSection = {
  title?: LocaleValue;
  shorttext?: LocaleValue;
} | null;

export type InfoSection = {
  _id: string;
  name?: string;
  title?: LocaleValue;
  text?: LocaleValue;
  image?: SanityImage;
  imagePosition?: "left" | "right";
};

export type Plan = {
  _id: string;
  title?: LocaleValue;
  shortDescription?: LocaleValue;
  description?: LocaleValue;
  currency?: string;
  price?: number;
  oldPrice?: number;
  image?: SanityImage;
  salesCount?: number;
  slug?: string;
  seo?: Seo;
};

export type Category = { _id: string; title?: LocaleValue; color?: string };

export type Post = {
  _id: string;
  title?: LocaleValue;
  slug?: string;
  coverImage?: SanityImage;
  categories?: Category[] | null;
  tags?: string[] | null;
  author?: { name?: string; avatar?: SanityImage } | null;
  status?: "draft" | "published" | "archived";
  publishedAt?: string;
  featured?: boolean;
  excerpt?: LocaleValue;
  body?: LocaleValue;
  seo?: Seo;
};

/** Shape of ROUTE_INDEX_QUERY (only what sitemaps and static params need). */
type Indexing = { _updatedAt: string; noIndex: boolean; canonicalUrl?: string | null };
type Availability = { fi: boolean; en: boolean };

export type RouteIndexData = {
  singletons: (Indexing & { _type: "homePage" | "aboutPage" | "faqPage" | "blogPage" | "contactInfo" })[];
  plans: (Indexing & Availability & { slug: string; title?: LocaleValue; price?: number; currency?: string })[];
  posts: (Indexing & Availability & { slug: string; title?: LocaleValue; publishedAt?: string })[];
};
