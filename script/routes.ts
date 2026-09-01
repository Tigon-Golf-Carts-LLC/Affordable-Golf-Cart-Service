/**
 * The single source of truth for "what URLs does this site have".
 *
 * Consumed by `generate-seo.ts` (sitemap) and `prerender.ts` (one real
 * index.html per route). Dynamic detail routes are expanded from the build-time
 * snapshot, so adding a location or a service automatically adds its page.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import type { Service, ServiceLocation, USState } from "../shared/types.ts";
import { STATIC_PAGE_SEO, locationSeo, serviceSeo, stateSeo } from "../shared/seo.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "client", "src", "data");

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(path.join(DATA_DIR, name), "utf8")) as T;
}

export const services = readJson<Service[]>("services.json");
export const locations = readJson<ServiceLocation[]>("locations.json");
export const states = readJson<USState[]>("states.json");

export interface RouteMeta {
  /** Site-relative path, always leading slash, no trailing slash except "/". */
  path: string;
  title: string;
  description: string;
  /** Sitemap priority, 0.0-1.0. */
  priority: number;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
}

/** Sitemap weighting per route, by prefix. Anything unlisted gets the default. */
function weightFor(routePath: string): Pick<RouteMeta, "priority" | "changefreq"> {
  if (routePath === "/") return { priority: 1.0, changefreq: "weekly" };
  if (routePath === "/services" || routePath === "/locations") return { priority: 0.9, changefreq: "weekly" };
  if (routePath === "/states") return { priority: 0.8, changefreq: "monthly" };
  if (routePath.startsWith("/locations/")) return { priority: 0.7, changefreq: "monthly" };
  if (routePath.startsWith("/states/")) return { priority: 0.6, changefreq: "monthly" };
  if (DEDICATED_SERVICE_PAGES.has(routePath)) return { priority: 0.8, changefreq: "monthly" };
  if (routePath.startsWith("/services/")) return { priority: 0.6, changefreq: "monthly" };
  return { priority: 0.7, changefreq: "monthly" };
}

const DEDICATED_SERVICE_PAGES = new Set(
  Object.keys(STATIC_PAGE_SEO).filter((p) => p.startsWith("/services/")),
);

/**
 * Every URL the site serves: the hand-written pages, plus one detail page per
 * location, state and service from the snapshot.
 */
export function allRoutes(): RouteMeta[] {
  const out: RouteMeta[] = [];

  for (const [routePath, seo] of Object.entries(STATIC_PAGE_SEO)) {
    out.push({ path: routePath, ...seo, ...weightFor(routePath) });
  }

  for (const location of locations) {
    const routePath = `/locations/${location.slug}`;
    out.push({ path: routePath, ...locationSeo(location), ...weightFor(routePath) });
  }

  for (const state of states) {
    const routePath = `/states/${state.slug}`;
    out.push({ path: routePath, ...stateSeo(state), ...weightFor(routePath) });
  }

  for (const service of services) {
    const routePath = `/services/${service.id}`;
    // Services with a dedicated hand-written page are already covered above.
    if (DEDICATED_SERVICE_PAGES.has(routePath)) continue;
    out.push({ path: routePath, ...serviceSeo(service), ...weightFor(routePath) });
  }

  return out;
}
