import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { RouteInfo, RouteManifest } from "./types";
import { CRITICAL_PATHS } from "./test-data";

const MANIFEST_PATH = join(process.cwd(), "reports/route-manifest.json");
const FALLBACK_PATH = join(process.cwd(), "e2e/fixtures/route-manifest.fallback.json");

function fallbackRoutes(): RouteInfo[] {
  return CRITICAL_PATHS.map((path) => ({
    path,
    name: path === "/" ? "Home" : path.replace(/^\//, "").replace(/\//g, " / "),
    category: path.startsWith("/portfolio")
      ? "portfolio"
      : path === "/"
        ? "homepage"
        : "content",
    expectH1: path !== "/",
    tags: ["@critical"],
  }));
}

export function loadRouteManifest(): RouteInfo[] {
  const path = existsSync(MANIFEST_PATH) ? MANIFEST_PATH : FALLBACK_PATH;
  if (!existsSync(path)) {
    console.warn("Route manifest missing — run: npm run discover:routes");
    return fallbackRoutes();
  }

  const manifest = JSON.parse(readFileSync(path, "utf8")) as RouteManifest;
  return manifest.routes;
}

export function getPublicRoutes(routes: RouteInfo[]): RouteInfo[] {
  return routes.filter((r) => !r.path.includes(":") && !r.path.includes("*"));
}

export function getCriticalRoutes(routes: RouteInfo[]): RouteInfo[] {
  return routes.filter((r) => r.tags.includes("@critical"));
}
