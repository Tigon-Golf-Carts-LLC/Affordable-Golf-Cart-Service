const TRACKING_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

const STORAGE_KEY = "tigon_first_touch";
const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type Attribution = {
  ts: number;
  v: Partial<Record<(typeof TRACKING_FIELDS)[number], string>>;
};

function readQueryAttribution(search: string) {
  const params = new URLSearchParams(search);
  const values: Attribution["v"] = {};
  for (const field of TRACKING_FIELDS) {
    values[field] = params.get(field) || "";
  }
  return values;
}

function readSavedAttribution(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw) as Attribution;
    if (!saved || typeof saved.ts !== "number" || !saved.v) return null;
    if (Date.now() - saved.ts > ATTRIBUTION_TTL_MS) return null;
    return saved;
  } catch {
    return null;
  }
}

/** Preserve each first non-empty campaign value for 30 days. */
export function captureTigonAttribution(search = window.location.search) {
  const current = readQueryAttribution(search);
  const saved = readSavedAttribution();
  const values: Attribution["v"] = { ...(saved?.v || {}) };
  let changed = !saved;

  for (const field of TRACKING_FIELDS) {
    if (!values[field] && current[field]) {
      values[field] = current[field];
      changed = true;
    }
    if (!values[field]) values[field] = "";
  }

  if (TRACKING_FIELDS.some((field) => Boolean(values[field]))) {
    const attribution = { ts: saved?.ts || Date.now(), v: values };
    if (changed) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
      } catch {
        // Tracking is best-effort when browser storage is unavailable.
      }
    }
  }

  return values;
}

export function getTigonTrackingFields() {
  const attribution = captureTigonAttribution();
  const gaCookie = document.cookie.match(/(?:^|;\s*)_ga=([^;]+)/);
  let gaClientId = "";

  if (gaCookie) {
    try {
      const parts = decodeURIComponent(gaCookie[1]).split(".");
      if (parts.length >= 4) gaClientId = parts.slice(-2).join(".");
    } catch {
      gaClientId = "";
    }
  }

  return {
    ...Object.fromEntries(TRACKING_FIELDS.map((field) => [field, attribution[field] || ""])),
    url: window.location.href,
    referrer: document.referrer || "",
    ga_client_id: gaClientId,
  };
}

export const TIGON_TRACKING_FIELDS = TRACKING_FIELDS;
