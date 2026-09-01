/**
 * Shared type definitions.
 *
 * These are the only things `shared/` still holds. The site is 100% static, so
 * the records themselves live in `data/` (build-time source, never shipped) and
 * are emitted as minified JSON snapshots into `client/src/data/` by
 * `script/fetch-data.ts`.
 */

export interface Service {
  id: string;
  name: string;
  priceRange: string;
  category: string;
  description: string;
}

/**
 * `googleMapsUrl` from the source record is intentionally absent: nothing in
 * the frontend reads it, so `fetch-data` strips it from the snapshot.
 */
export interface ServiceLocation {
  id: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  stateAbbr: string;
  zip: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface USState {
  name: string;
  slug: string;
  abbreviation: string;
  lat: number;
  lng: number;
}

/** Shape of the snapshot written by `script/fetch-data.ts`. */
export interface DataSnapshot {
  generatedAt: string;
  source: string;
  serviceCategories: string[];
  services: Service[];
  locations: ServiceLocation[];
  states: USState[];
}
