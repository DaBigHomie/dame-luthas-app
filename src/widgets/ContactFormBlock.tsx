import Image from "next/image";

import { loadMigrated } from "@/shared/lib/migrated/content";
import {
  getTemplateBySlug,
  parseFooterContent,
} from "@/shared/lib/migrated/templates";

import { ContactFormFields } from "./ContactFormFields";

export function ContactFormBlock() {
  const { site } = loadMigrated();
  const footerTemplate = getTemplateBySlug("footer");
  const footer = footerTemplate
    ? parseFooterContent(footerTemplate.bodyHtml)
    : null;

  const eyebrow = footer?.eyebrow ?? "Thanks for your Time";
  const headline = footer?.headline ?? "I'd Love to Hear From You.";

  return (
    <div className="relative mx-auto max-w-6xl px-6 pb-16">
      <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-black/40">
        <div className="grid md:grid-cols-[2fr_3fr]">
          <div className="flex flex-col justify-center bg-[var(--dl-footer-yellow)] px-8 py-12 md:px-12 md:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black">
              {eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-black md:text-4xl lg:text-[2.75rem]">
              {headline}
            </h2>
          </div>
          <div className="bg-[var(--dl-footer-lavender)] px-8 py-12 md:px-12 md:py-16">
            <ContactFormFields email={site.contact.email} />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <Image
          src="/api/wp-media/2025/02/circle-dark.svg"
          alt=""
          width={88}
          height={88}
          className="rounded-full"
          unoptimized
        />
      </div>
    </div>
  );
}
