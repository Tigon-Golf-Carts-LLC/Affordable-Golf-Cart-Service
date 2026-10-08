/**
 * Lead capture for TIGON IOT "Webhook Flows".
 *
 * Every lead form on the site posts here. The endpoint is injected at build
 * time from the `TIGON_LEAD_ENDPOINT` environment variable (a GitHub Actions
 * secret in CI) and is deliberately never committed: this repository is
 * public and the webhook key in the URL works like a password.
 *
 * The endpoint is either the TIGON webhook itself (browser posts directly,
 * unsigned) or the signing relay in `worker/tigon-lead-relay.js`, which holds
 * the webhook's signing secret server-side and adds X-Tigon-Signature.
 */

export const LEAD_ENDPOINT: string = import.meta.env.VITE_TIGON_LEAD_ENDPOINT || "";

/** Fixed value TIGON expects in `form_name` for this webhook. */
export const FORM_NAME = "Contact form";

/** Spam trap input name. Real visitors never see it; it must be sent empty. */
export const HONEYPOT = "website";

export const MAX_FILE_MB = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/heic", "image/heif"];
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|heic|heif)$/i;

const TRACK_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;
const STORE_KEY = "tigon_first_touch";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * First-touch attribution: the first utm_* / gclid / fbclid values seen are
 * kept in localStorage for 30 days and sent with every lead in that window.
 * Called on page load (to capture landing-page params) and again on submit.
 */
export function firstTouch(): Record<string, string> {
  const current: Record<string, string> = {};
  let found = false;
  try {
    const q = new URLSearchParams(window.location.search);
    for (const k of TRACK_KEYS) {
      const v = q.get(k);
      if (v) {
        current[k] = v;
        found = true;
      }
    }
  } catch {
    /* no URLSearchParams */
  }

  let saved: { ts: number; v: Record<string, string> } | null = null;
  try {
    saved = JSON.parse(window.localStorage.getItem(STORE_KEY) || "null");
  } catch {
    saved = null;
  }
  if (saved && (!saved.ts || Date.now() - saved.ts > MAX_AGE_MS)) saved = null;
  if (!saved && found) {
    saved = { ts: Date.now(), v: current };
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(saved));
    } catch {
      /* private mode */
    }
  }

  const out: Record<string, string> = {};
  for (const k of TRACK_KEYS) out[k] = saved?.v?.[k] || current[k] || "";
  return out;
}

/** GA client id from the _ga cookie: "GA1.1.123456.789012" -> "123456.789012". */
export function gaClientId(): string {
  const m = document.cookie.match(/(?:^|;\s*)_ga=([^;]+)/);
  if (!m) return "";
  const parts = decodeURIComponent(m[1]).split(".");
  return parts.length >= 4 ? parts.slice(-2).join(".") : "";
}

/** Hidden tracking fields, filled right before sending. */
export function trackingFields(): Record<string, string> {
  return {
    ...firstTouch(),
    url: window.location.href,
    referrer: document.referrer || "",
    ga_client_id: gaClientId(),
  };
}

export type FieldErrors = Partial<Record<string, string>>;

/** Client-side validation. Returns a message per invalid field name. */
export function validateLead(form: HTMLFormElement): FieldErrors {
  const errors: FieldErrors = {};
  const value = (name: string) => ((form.elements.namedItem(name) as HTMLInputElement | null)?.value || "").trim();

  if (!value("first_name")) errors.first_name = "Please enter your first name.";
  if (!value("last_name")) errors.last_name = "Please enter your last name.";

  const email = value("email");
  if (!email) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Please enter a valid email address.";

  const phone1 = value("phone1");
  if (!phone1) errors.phone1 = "Please enter your phone number.";
  else if (phone1.replace(/\D/g, "").length < 10) errors.phone1 = "Phone number needs at least 10 digits.";

  const phone2 = value("phone2");
  if (phone2 && phone2.replace(/\D/g, "").length < 10) errors.phone2 = "Alternate phone needs at least 10 digits.";

  for (const name of ["image_1", "image_2", "image_3"]) {
    const file = (form.elements.namedItem(name) as HTMLInputElement | null)?.files?.[0];
    if (!file) continue;
    if (file.size > MAX_FILE_BYTES) errors[name] = `Each photo must be ${MAX_FILE_MB} MB or smaller.`;
    else if (!IMAGE_TYPES.includes(file.type.toLowerCase()) && !IMAGE_EXT.test(file.name)) {
      errors[name] = "Photos must be JPG, PNG, GIF, WebP or HEIC.";
    }
  }
  return errors;
}

/** Build the multipart body: form fields + tracking, minus empty file inputs. */
export function buildLeadData(form: HTMLFormElement): FormData {
  const fd = new FormData(form);
  form.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach((input) => {
    if (input.name && !input.files?.length) fd.delete(input.name);
  });
  const t = trackingFields();
  for (const [k, v] of Object.entries(t)) fd.set(k, v);
  fd.set("form_name", FORM_NAME);
  if (!fd.has(HONEYPOT)) fd.set(HONEYPOT, "");
  // The server records these itself.
  fd.delete("user_ip");
  fd.delete("user_agent");
  return fd;
}

export const LEAD_ERROR_TEXT = "Sorry, something went wrong. Please try again or call us.";

/** POST the lead. Resolves on {"ok": true}; rejects with a visitor-friendly message. */
export async function submitLead(fd: FormData): Promise<void> {
  if (!LEAD_ENDPOINT) throw new Error("Our online form is temporarily unavailable. Please call us instead.");

  let res: Response;
  try {
    res = await fetch(LEAD_ENDPOINT, { method: "POST", body: fd, mode: "cors" });
  } catch {
    throw new Error(LEAD_ERROR_TEXT);
  }
  if (res.status === 429) throw new Error("Too many tries — please wait a minute and try again.");

  let data: { ok?: boolean; error?: string; message?: string } | null = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok || !data || data.ok !== true) throw new Error(data?.error || data?.message || LEAD_ERROR_TEXT);
}
