import Link from "next/link";

import type { MigratedAboutPage } from "@/shared/lib/migrated/content";
import { loadMigrated } from "@/shared/lib/migrated/content";
import { ContactFormBlock } from "@/widgets/ContactFormBlock";

import { IconList } from "./contact/IconList";
import { TeamMember } from "./contact/TeamMember";

interface ContactPageProps {
  title: string;
  about: MigratedAboutPage | null;
}

export function ContactPage({ title, about }: ContactPageProps) {
  const { site } = loadMigrated();

  const contactItems = [
    ...(about?.address
      ? [
          {
            icon: "pin" as const,
            label: "Address",
            text: `${about.address.line1}, ${about.address.line2}`,
          },
        ]
      : []),
    {
      icon: "phone" as const,
      label: "Phone",
      text: site.contact.phone,
      href: `tel:${site.contact.phone.replace(/\s/g, "")}`,
    },
    {
      icon: "mail" as const,
      label: "Email",
      text: site.contact.email,
      href: `mailto:${site.contact.email}`,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-semibold text-white md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-zinc-500">
          <Link href="/" className="hover:text-[var(--dl-accent)]">
            Home
          </Link>
          <span className="mx-2">→</span>
          <span className="text-[var(--dl-accent)]">{title}</span>
        </p>
      </div>

      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          Lets Build <span className="text-[var(--dl-accent)]">Something great</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          My experience uncovered new opportunities for tomorrow; and reinvigorated a
          clarity of vision and passion for empowering organizational, business, and
          technical harmonization.
        </p>
      </div>

      {about ? (
        <TeamMember
          name={about.headline}
          role={about.role}
          bio={about.bio}
          image={about.image}
          phone={site.contact.phone}
          email={site.contact.email}
          social={[{ label: "LinkedIn", href: site.contact.linkedin }]}
        />
      ) : null}

      <div className="mx-auto mt-10 max-w-md">
        <IconList items={contactItems} />
      </div>

      <div className="mt-16">
        <ContactFormBlock />
      </div>
    </main>
  );
}
