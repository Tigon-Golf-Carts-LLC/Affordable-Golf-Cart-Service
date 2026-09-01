/**
 * Build-time data snapshot.
 *
 * Everything the app used to request from `/api/*` is resolved here, once, at
 * build time and written to `client/src/data/` as minified JSON. The frontend
 * imports those files directly, so the shipped bundle makes zero same-origin
 * requests.
 *
 * Sources, in priority order:
 *   1. `DATA_API_URL` (+ optional `DATA_API_KEY`) — a live upstream, if these
 *      records ever move to a CMS. Keys are read from `process.env` HERE ONLY
 *      and never reach the client bundle.
 *   2. `data/*.ts` — the committed source of truth today.
 *
 * Run: `npm run fetch-data`
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { serviceCategories, services } from "../data/services.ts";
import { serviceLocations } from "../data/locations.ts";
import { usStates } from "../data/states.ts";
import type { DataSnapshot, Service, ServiceLocation, USState } from "../shared/types.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "client", "src", "data");

const DATA_API_URL = process.env.DATA_API_URL;
const DATA_API_KEY = process.env.DATA_API_KEY;

/** 5 decimal places is ~1 m of precision — plenty, and it shrinks the JSON. */
function round(n: number): number {
  return Math.round(n * 1e5) / 1e5;
}

/** Only the fields the frontend actually reads survive into the snapshot. */
function pickService(s: Service): Service {
  return {
    id: s.id,
    name: s.name,
    priceRange: s.priceRange,
    category: s.category,
    description: s.description,
  };
}

function pickLocation(l: ServiceLocation & { googleMapsUrl?: string; name?: string }): ServiceLocation {
  return {
    id: l.id,
    slug: l.slug,
    address: l.address,
    city: l.city,
    state: l.state,
    stateAbbr: l.stateAbbr,
    zip: l.zip,
    phone: l.phone,
    lat: round(l.lat),
    lng: round(l.lng),
  };
}

function pickState(s: USState): USState {
  return { name: s.name, slug: s.slug, abbreviation: s.abbreviation, lat: round(s.lat), lng: round(s.lng) };
}

async function fetchUpstream(): Promise<Partial<DataSnapshot> | null> {
  if (!DATA_API_URL) return null;
  console.log(`  fetching upstream: ${DATA_API_URL}`);
  const res = await fetch(DATA_API_URL, {
    headers: DATA_API_KEY ? { Authorization: `Bearer ${DATA_API_KEY}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Upstream data fetch failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as Partial<DataSnapshot>;
}

async function main() {
  console.log("→ fetch-data: building static data snapshot");

  const upstream = await fetchUpstream();

  const snapshot: DataSnapshot = {
    generatedAt: new Date().toISOString(),
    source: upstream ? "upstream" : "repository",
    serviceCategories: upstream?.serviceCategories ?? [...serviceCategories],
    services: (upstream?.services ?? services).map(pickService),
    locations: (upstream?.locations ?? serviceLocations).map(pickLocation),
    states: (upstream?.states ?? usStates).map(pickState),
  };

  await mkdir(OUT_DIR, { recursive: true });

  const files: Array<[string, unknown]> = [
    ["services.json", snapshot.services],
    ["service-categories.json", snapshot.serviceCategories],
    ["locations.json", snapshot.locations],
    ["states.json", snapshot.states],
    ["snapshot.json", snapshot],
  ];

  for (const [name, value] of files) {
    // JSON.stringify with no spacer => minified, never pretty-printed.
    const json = JSON.stringify(value);
    await writeFile(path.join(OUT_DIR, name), json + "\n", "utf8");
    console.log(`  wrote ${name.padEnd(24)} ${(json.length / 1024).toFixed(1)} KB`);
  }

  console.log(
    `✓ snapshot: ${snapshot.services.length} services, ${snapshot.serviceCategories.length} categories, ` +
      `${snapshot.locations.length} locations, ${snapshot.states.length} states (source: ${snapshot.source})`,
  );
}

main().catch((err) => {
  console.error("✗ fetch-data failed:", err);
  process.exit(1);
});
