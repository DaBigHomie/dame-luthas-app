import type { IconListItem } from "@/shared/types/portfolio-widgets";

interface IconListProps {
  items: IconListItem[];
  className?: string;
}

function ListIcon({ type }: { type: NonNullable<IconListItem["icon"]> }) {
  const common = "h-4 w-4 shrink-0 text-[var(--dl-accent)]";
  switch (type) {
    case "pin":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
        </svg>
      );
    case "phone":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
        </svg>
      );
    case "mail":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
        </svg>
      );
    case "headphones":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 3a9 9 0 0 0-9 9v7a3 3 0 0 0 3 3h1v-8H5a7 7 0 0 1 14 0h-2v8h1a3 3 0 0 0 3-3v-7a9 9 0 0 0-9-9z" />
        </svg>
      );
  }
}

export function IconList({ items, className }: IconListProps) {
  if (!items.length) return null;

  return (
    <ul
      className={`space-y-3 text-sm text-zinc-300 ${className ?? ""}`}
      aria-label="Contact details"
    >
      {items.map((item) => {
        const content = (
          <>
            {item.icon ? (
              <span className="mt-0.5">
                <ListIcon type={item.icon} />
              </span>
            ) : null}
            <span>
              {item.label ? (
                <span className="block text-xs uppercase tracking-wide text-zinc-500">
                  {item.label}
                </span>
              ) : null}
              <span className="text-zinc-200">{item.text}</span>
            </span>
          </>
        );

        return (
          <li key={`${item.label ?? ""}-${item.text}`} className="flex gap-3">
            {item.href ? (
              <a href={item.href} className="flex gap-3 hover:text-[var(--dl-accent)]">
                {content}
              </a>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
}
