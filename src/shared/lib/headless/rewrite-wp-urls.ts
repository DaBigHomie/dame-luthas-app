/** Rewrite legacy WP asset URLs to the local wp-content proxy. */
export function rewriteWpAssetUrls(html: string): string {
  let output = html;
  const hosts = [
    "dameluthas.local",
    "dameluthas-com-restore.local",
    "dameluthas.com",
    "www.dameluthas.com",
  ];

  for (const host of hosts) {
    output = output.replace(
      new RegExp(`https?://${host.replace(/\./g, "\\.")}/wp-content/`, "gi"),
      "/wp-content/",
    );
  }

  output = output.replace(/\/\/dameluthas\.com\/wp-content\//gi, "/wp-content/");

  return output;
}
