import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const LOCAL_SITES_JSON = join(
  process.env.HOME ?? "",
  "Library/Application Support/Local/sites.json",
);
const LOCAL_SITE_STATUSES = join(
  process.env.HOME ?? "",
  "Library/Application Support/Local/site-statuses.json",
);

export interface LocalSiteInfo {
  id: string;
  name: string;
  domain: string;
  path: string;
  status: string;
  httpPort: number | null;
  graphqlUrl: string;
}

function readJson<T>(filePath: string): T | null {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

export function getLocalSiteInfo(siteId: string): LocalSiteInfo | null {
  const sites = readJson<Record<string, {
    id: string;
    name: string;
    domain: string;
    path: string;
    services?: { nginx?: { ports?: { HTTP?: number[] } } };
  }>>(LOCAL_SITES_JSON);

  if (!sites?.[siteId]) return null;

  const site = sites[siteId];
  const statuses = readJson<Record<string, string>>(LOCAL_SITE_STATUSES);
  const httpPort = site.services?.nginx?.ports?.HTTP?.[0] ?? null;

  return {
    id: site.id,
    name: site.name,
    domain: site.domain,
    path: site.path,
    status: statuses?.[siteId] ?? "unknown",
    httpPort,
    graphqlUrl: `http://${site.domain}/graphql`,
  };
}

export function patchLocalSitesJsonPath(
  siteId: string,
  siteRootPath: string,
): boolean {
  if (!existsSync(LOCAL_SITES_JSON)) return false;

  const sites = readJson<Record<string, { path?: string }>>(LOCAL_SITES_JSON);
  if (!sites?.[siteId]) return false;

  sites[siteId].path = siteRootPath;
  writeFileSync(LOCAL_SITES_JSON, `${JSON.stringify(sites)}\n`, "utf8");
  return true;
}

export function siteRootFromPublic(publicPath: string): string {
  return resolve(publicPath, "../..");
}

export function formatLocalSiteDiagnostics(site: LocalSiteInfo): string {
  const lines = [
    `Local site: ${site.name} (${site.id})`,
    `Status:     ${site.status}`,
    `Domain:     ${site.domain}`,
    `Path:       ${site.path}`,
    `HTTP port:  ${site.httpPort ?? "n/a (site stopped)"}`,
    `GraphQL:    ${site.graphqlUrl}`,
  ];

  if (site.status === "halted") {
    lines.push(
      "",
      "The site is stopped in Local — nothing is listening on port 80.",
      "Start it: Local app → dameluthas-com-restore → Start site",
    );
  }

  return lines.join("\n");
}
