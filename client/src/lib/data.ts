/**
 * Static data access layer.
 *
 * Replaces the old `/api/services*` endpoints. Every record is imported from
 * the build-time snapshot in `src/data/` (written by `script/fetch-data.ts`),
 * so these lookups are synchronous, run at module scope, and cost zero network
 * requests at runtime.
 */
import servicesJson from "@/data/services.json";
import categoriesJson from "@/data/service-categories.json";
import locationsJson from "@/data/locations.json";
import statesJson from "@/data/states.json";
import type { Service, ServiceLocation, USState } from "@shared/types";

export type { Service, ServiceLocation, USState };

export const services: Service[] = servicesJson as Service[];
export const serviceCategories: string[] = categoriesJson as string[];
export const serviceLocations: ServiceLocation[] = locationsJson as ServiceLocation[];
export const usStates: USState[] = statesJson as USState[];

/* ---------------------------------------------------------------- services */

const servicesById = new Map(services.map((s) => [s.id, s]));

export function getServicesByCategory(category: string): Service[] {
  return services.filter((s) => s.category === category);
}

export function getServiceById(id: string): Service | undefined {
  return servicesById.get(id);
}

const SERVICE_ICONS: Record<string, string> = {
  "Maintenance & Tune-Ups": "wrench",
  "Battery Services": "battery",
  "Tires & Wheels": "circle",
  "Brakes & Suspension": "gauge",
  "Electrical & Motor": "zap",
  "Body & Exterior": "paintbrush",
  "Accessories & Upgrades": "sparkles",
  "Inspections & Diagnostics": "search",
  "Cleaning & Detailing": "sparkle",
  "Seasonal Services": "snowflake",
};

export function getServiceIcon(category: string): string {
  return SERVICE_ICONS[category] ?? "wrench";
}

/* --------------------------------------------------------------- locations */

const locationsBySlug = new Map(serviceLocations.map((l) => [l.slug, l]));

export function getLocationBySlug(slug: string): ServiceLocation | undefined {
  return locationsBySlug.get(slug);
}

export function getFullAddress(location: ServiceLocation): string {
  return `${location.address}, ${location.city}, ${location.stateAbbr} ${location.zip}`;
}

export function getDirectionsUrl(location: ServiceLocation): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(getFullAddress(location))}`;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/** Great-circle distance in statute miles. */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestLocations(
  lat: number,
  lng: number,
  count = 3,
): Array<ServiceLocation & { distance: number }> {
  return serviceLocations
    .map((location) => ({ ...location, distance: haversineDistance(lat, lng, location.lat, location.lng) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}

export function searchLocationsByText(query: string): ServiceLocation[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return serviceLocations.filter(
    (location) =>
      location.city.toLowerCase().includes(q) ||
      location.state.toLowerCase().includes(q) ||
      location.stateAbbr.toLowerCase() === q ||
      location.zip.includes(q) ||
      location.address.toLowerCase().includes(q),
  );
}

/* ------------------------------------------------------------------ states */

const statesBySlug = new Map(usStates.map((s) => [s.slug, s]));

export function getStateBySlug(slug: string): USState | undefined {
  return statesBySlug.get(slug);
}

export function getGoogleMapsEmbedUrl(state: USState): string {
  return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000000!2d${state.lng}!3d${state.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus`;
}
