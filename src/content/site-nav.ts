/** Header navigation — aligned with WP thegem-template-menu. */
import type { NavItem } from "./types";

export const headerNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

/** Drop legacy WP links that are not part of the native site shell. */
export function sanitizeHeaderNavigation(items: NavItem[]): NavItem[] {
  return items.filter((item) => item.href !== "/about");
}
