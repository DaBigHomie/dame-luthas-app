import Image from "next/image";

interface TeamMemberSocial {
  label: string;
  href: string;
}

export interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  image?: string | null;
  phone?: string;
  email?: string;
  social?: TeamMemberSocial[];
}

export function TeamMember({
  name,
  role,
  bio,
  image,
  phone,
  email,
  social = [],
}: TeamMemberProps) {
  return (
    <div className="mx-auto grid max-w-4xl gap-10 rounded-2xl border border-white/10 bg-[var(--dl-surface)] p-8 md:grid-cols-[220px_1fr] md:items-start md:p-10">
      {image ? (
        <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-full border-2 border-[var(--dl-accent)]/40 md:mx-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="192px"
            unoptimized
          />
        </div>
      ) : null}
      <div className="space-y-4 text-center md:text-left">
        <div>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-sm text-zinc-400">{role}</p>
        </div>
        <p className="leading-relaxed text-zinc-300">{bio}</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm md:justify-start">
          {phone ? (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="text-[var(--dl-accent)] hover:underline"
            >
              {phone}
            </a>
          ) : null}
          {email ? (
            <a href={`mailto:${email}`} className="text-[var(--dl-accent)] hover:underline">
              {email}
            </a>
          ) : null}
          {social.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[var(--dl-accent)] hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
