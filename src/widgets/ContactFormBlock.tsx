import { isMigratedAvailable, loadMigrated } from "@/shared/lib/migrated/content";
import {
  getTemplateBySlug,
  parseFooterContent,
} from "@/shared/lib/migrated/templates";

import { ContactFormFields } from "./ContactFormFields";

export function ContactFormBlock() {
  const migrated = isMigratedAvailable();
  const { site } = migrated
    ? loadMigrated()
    : {
        site: {
          contact: { email: "hello@dameluthas.com" },
        },
      };
  const footerTemplate = migrated ? getTemplateBySlug("footer") : null;
  const footer = footerTemplate
    ? parseFooterContent(footerTemplate.bodyHtml)
    : null;

  const eyebrow = footer?.eyebrow ?? "Thanks for your Time";
  const headline = footer?.headline ?? "I'd Love to Hear From You.";

  return (
    <div className="relative mx-auto max-w-6xl px-6 pb-16">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-surface">
        <div className="grid md:grid-cols-[2fr_3fr]">
          <div className="flex flex-col justify-center border-b border-border px-8 py-12 md:border-b-0 md:border-r md:px-12 md:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              {eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-[2.75rem]">
              {headline}
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Replies within 24 hours.
            </p>
          </div>
          <div className="bg-elevated px-8 py-12 md:px-12 md:py-16">
            <ContactFormFields email={site.contact.email} />
          </div>
        </div>
      </div>
    </div>
  );
}
