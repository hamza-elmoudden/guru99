import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { btnPrimary, section } from "@/lib/ui";
import { getI18n } from "@/lib/locale";

export default async function NotFound() {
  const { ui, href } = await getI18n();
  return (
    <>
      <PageHero label="404" title={ui.notFound.title} sub={ui.notFound.text} />
      <section className={`${section} text-center`}>
        <Link href={href("/")} className={btnPrimary}>
          {ui.notFound.back}
        </Link>
      </section>
    </>
  );
}
