import Link from "next/link";
import { notFound } from "next/navigation";

import { getPageBySlug } from "@/shared/lib/headless/data-source";
import {
  getPageBySlug as getMigratedPage,
  isMigratedAvailable,
  loadMigrated,
} from "@/shared/lib/migrated/content";
import { ContactPage } from "@/widgets/ContactPage";
import { MigratedContent } from "@/shared/ui/MigratedContent";
import { RichContent } from "@/shared/ui/RichContent";

/** Slugs handled by dedicated app routes or removed from the public site. */
const BLOCKED_SLUGS = new Set([
  "about",
  "home",
  "case-studies",
  "portfolio",
]);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;

  if (BLOCKED_SLUGS.has(slug)) {
    notFound();
  }

  if (isMigratedAvailable()) {
    const migrated = loadMigrated();

    if (slug === "contact" && migrated.contactPage) {
      return (
        <ContactPage
          title={migrated.contactPage.title}
          about={migrated.aboutPage}
        />
      );
    }

    const page = getMigratedPage(slug);
    if (!page) notFound();

    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-semibold text-white">{page.title}</h1>
        <MigratedContent html={page.bodyHtml} />
      </main>
    );
  }

  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Home
      </Link>
      <h1 className="mt-4 mb-8 text-3xl font-semibold">{page.title}</h1>
      <RichContent html={page.content} />
    </main>
  );
}
