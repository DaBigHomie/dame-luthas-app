export const HEADLESS_CONFIG = {
  graphqlUrl:
    process.env.WP_HEADLESS_GRAPHQL_URL ??
    "http://dameluthas.local/graphql",
  snapshotDir: "data/snapshot",
  uploadsDir: "temp/uploads",
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "Dame Luthas",
  /** Legacy WP hostnames rewritten to local media proxy */
  legacyHosts: [
    "dameluthas.local",
    "dameluthas-com-restore.local",
    "dameluthas.com",
    "http://dameluthas.local",
    "http://dameluthas-com-restore.local",
    "https://dameluthas.com",
  ],
} as const;
