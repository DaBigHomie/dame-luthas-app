/**
 * Route manifest types — shared by discover script and Playwright specs.
 */
export interface RouteInfo {
  path: string;
  name: string;
  category: "homepage" | "content" | "portfolio" | "migration";
  expectH1: boolean;
  tags: string[];
}

export interface RouteManifest {
  version: string;
  generatedAt: string;
  routeCount: number;
  routes: RouteInfo[];
}
