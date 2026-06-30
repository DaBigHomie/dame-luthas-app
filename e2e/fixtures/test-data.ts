/** Console/network noise that should not fail migration E2E. */
const IGNORED_CONSOLE = [
  /favicon\.ico/i,
  /Failed to load resource.*404/i,
  /Download the React DevTools/i,
  /Hydration failed/i, // investigate separately if seen
];

export function isIgnoredError(message: string): boolean {
  return IGNORED_CONSOLE.some((re) => re.test(message));
}

export const CRITICAL_PATHS = [
  "/",
  "/contact",
  "/case-studies",
  "/portfolio/united-nations-cloud-migration-fobos",
  "/portfolio/amazon-labor-union-digital-transformation",
  "/portfolio/gatorade-embraces-generative-ai-powered-bottle-design",
] as const;
