import { socialLinks } from "@/content";
import { isMigratedAvailable, loadMigrated } from "@/shared/lib/migrated/content";
import {
  getTemplateBySlug,
  parseFooterContent,
} from "@/shared/lib/migrated/templates";

import { ContactFormBlock } from "./ContactFormBlock";
import { FooterBottomBar } from "./FooterBottomBar";

export function Footer() {
  const migrated = isMigratedAvailable();
  const { site, navigation } = migrated
    ? loadMigrated()
    : {
        site: {
          name: "Dame Luthas",
          contact: {
            email: "hello@dameluthas.com",
            linkedin: "https://www.linkedin.com/in/dameluthas/",
          },
        },
        navigation: [
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/portfolio" },
          { label: "Contact", href: "/contact" },
        ],
      };
  const footerTemplate = migrated ? getTemplateBySlug("footer") : null;
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
        socialIcons: socialLinks.map((link) => ({
          network: link.network,
          href: link.href,
        })),
      };

  return (
    <footer className="mt-auto bg-[var(--dl-bg)] pt-16">
      <ContactFormBlock />
      <FooterBottomBar footer={footer} />
    </footer>
  );
}
