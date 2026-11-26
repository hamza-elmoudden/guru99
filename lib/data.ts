import "server-only";

import { sanityFetch } from "./sanity/client";
import * as q from "./sanity/queries";
import type {
  AboutPage,
  BlogPage,
  ContactInfo,
  FaqPage,
  Footer,
  HomePage,
  InfoSection,
  Navbar,
  Plan,
  PlanSection,
  Post,
  RouteIndexData,
} from "./sanity/types";

export const getHomePage = () => sanityFetch<HomePage>(q.HOME_PAGE_QUERY);
export const getAboutPage = () => sanityFetch<AboutPage>(q.ABOUT_PAGE_QUERY);
export const getFaqPage = () => sanityFetch<FaqPage>(q.FAQ_PAGE_QUERY);
export const getBlogPage = () => sanityFetch<BlogPage>(q.BLOG_PAGE_QUERY);
export const getContactInfo = () =>
  sanityFetch<ContactInfo>(q.CONTACT_INFO_QUERY);
export const getFooter = () => sanityFetch<Footer>(q.FOOTER_QUERY);
export const getNavbar = () => sanityFetch<Navbar>(q.NAVBAR_QUERY);
export const getPlanSection = () =>
  sanityFetch<PlanSection>(q.PLAN_SECTION_QUERY);

export const getInfoSections = async () =>
  (await sanityFetch<InfoSection[] | null>(q.INFO_SECTIONS_QUERY)) ?? [];

export const getPlans = async () =>
  (await sanityFetch<Plan[] | null>(q.PLANS_QUERY)) ?? [];

export const getPlan = (slug: string) =>
  sanityFetch<Plan | null>(q.PLAN_BY_SLUG_QUERY, { slug });

export async function getPostsPage(page: number, perPage: number) {
  const start = (page - 1) * perPage;
  const res = await sanityFetch<{ total: number; posts: Post[] } | null>(
    q.POSTS_PAGE_QUERY,
    { start, end: start + perPage },
  );
  return { total: res?.total ?? 0, posts: res?.posts ?? [] };
}

export const getPost = (slug: string) =>
  sanityFetch<Post | null>(q.POST_BY_SLUG_QUERY, { slug });

/** Raw data behind lib/routes.ts; use getRouteIndex() there instead of calling this directly. */
export const getRouteIndexData = async () =>
  (await sanityFetch<RouteIndexData | null>(q.ROUTE_INDEX_QUERY)) ?? { singletons: [], plans: [], posts: [] };
