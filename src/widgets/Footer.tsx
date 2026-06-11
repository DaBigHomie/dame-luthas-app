import { loadMigrated } from "@/shared/lib/migrated/content";
import {
  getTemplateBySlug,
  parseFooterContent,
} from "@/shared/lib/migrated/templates";

import { ContactFormBlock } from "./ContactFormBlock";
import { FooterBottomBar } from "./FooterBottomBar";

export function Footer() {
  const { site, navigation } = loadMigrated();
  const footerTemplate = getTemplateBySlug("footer");
  const footer = footerTemplate
    ? parseFooterContent(footerTemplate.bodyHtml)
    : {
        eyebrow: "Thanks for your Time",
        headline: "I'd Love to Hear From You.",
        copyright: `Copyright ${new Date().getFullYear()} © ${site.name}`,
        links: navigation,
        ctaLinks: [
          { label: "Let's Chat", href: "/contact" },
          { label: "Email Me", href: `mailto:${site.contact.email}` },
          { label: "Book Meeting", href: "/contact" },
        ],
        socialIcons: [{ network: "linkedin", href: site.contact.linkedin }],
      };

  return (
    <footer className="mt-auto bg-[var(--dl-bg)] pt-16">
      <ContactFormBlock />
      <FooterBottomBar footer={footer} />
    </footer>
  );
}
