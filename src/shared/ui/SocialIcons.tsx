import type { SocialLink } from "@/content/types";

const ICONS: Record<string, React.ReactNode> = {
  linkedin: (
    <path d="M6.5 8.5h3v10h-3v-10zm1.5-4.5a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zm4 4.5h2.9v1.4h.1c.4-.8 1.5-1.6 3.1-1.6 3.3 0 3.9 2.2 3.9 5v5.2h-3v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.7h-3V8.5z" />
  ),
  facebook: (
    <path d="M14 8.5h-2.5c-.3 0-.5.2-.5.5v2h3l-.4 3h-2.6v9h-3.5v-9H7V11h2.5V8c0-1.7 1-3 2.8-3H14v3.5z" />
  ),
  twitter: (
    <path d="M18.2 9.5c-.01.2-.01.4-.01.6 0 6.1-4.6 13.1-13.1 13.1-2.6 0-5-.8-7-2.1.4 0 .8.1 1.2.1 2.1 0 4.1-.7 5.7-2a4.6 4.6 0 0 1-3.8-4v-.1c.6.3 1.3.5 2 .5a4.6 4.6 0 0 1-2.9-4 4.7 4.7 0 0 0 2.1-.6 4.6 4.6 0 0 1-3.7-4.5c0-.2 0-.4.1-.6a13 13 0 0 0 9.5 4.8 4.6 4.6 0 0 1-.1-1 4.6 4.6 0 0 1 7.9-3.2 9.1 9.1 0 0 0 2.9-1.1 4.6 4.6 0 0 1-2 2.5 9.2 9.2 0 0 0 2.6-.7 9.8 9.8 0 0 1-2.3 2.4z" />
  ),
  instagram: (
    <path d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm5.4-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 4.8c-1.3 0-1.5 0-2-.1-.5 0-.8-.1-1.1-.2a2.8 2.8 0 0 1-1.6-1.6c-.1-.3-.2-.6-.2-1.1-.1-.5-.1-.7-.1-2s0-1.5.1-2c0-.5.1-.8.2-1.1a2.8 2.8 0 0 1 1.6-1.6c.3-.1.6-.2 1.1-.2.5-.1.7-.1 2-.1s1.5 0 2 .1c.5 0 .8.1 1.1.2a2.8 2.8 0 0 1 1.6 1.6c.1.3.2.6.2 1.1.1.5.1.7.1 2s0 1.5-.1 2c0 .5-.1.8-.2 1.1a2.8 2.8 0 0 1-1.6 1.6c-.3.1-.6.2-1.1.2-.5.1-.7.1-2 .1z" />
  ),
  youtube: (
    <path d="M21.6 8.2a2.7 2.7 0 0 0-1.9-1.9C17.8 6 12 6 12 6s-5.8 0-7.7.3a2.7 2.7 0 0 0-1.9 1.9C2 10.1 2 12 2 12s0 1.9.4 3.8a2.7 2.7 0 0 0 1.9 1.9c1.9.3 7.7.3 7.7.3s5.8 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9c.4-1.9.4-3.8.4-3.8s0-1.9-.4-3.8zM10 15.5V8.5l6 3.5-6 3.5z" />
  ),
};

interface SocialIconsProps {
  links: SocialLink[];
  className?: string;
}

export function SocialIcons({ links, className = "" }: SocialIconsProps) {
  if (!links.length) return null;

  return (
    <ul className={`flex items-center gap-3 ${className}`.trim()}>
      {links.map((link) => (
        <li key={`${link.network}-${link.href}`}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label ?? link.network}
            className="text-zinc-400 transition hover:text-[var(--dl-accent)]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
              {ICONS[link.network] ?? ICONS.linkedin}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
