/**
 * TIGON lead relay — signs website leads with this webhook's secret.
 *
 * GitHub Pages only serves static files, so it cannot hold a secret. This
 * Cloudflare Worker is the "server side": the site's forms POST here, the
 * Worker computes X-Tigon-Signature over the exact raw body with the secret
 * and forwards the request to TIGON IOT unchanged (photos included).
 *
 * Worker settings → Variables and Secrets (type "Secret" for both):
 *   TIGON_WEBHOOK_URL     https://tigoniot.com/hooks/<this site's webhook key>
 *   TIGON_WEBHOOK_SECRET  the secret from TIGON IOT → Webhook Flows → Webhooks →
 *                         this webhook → Setup packet → Developers → "Create secret"
 * Optional plain variable:
 *   ALLOWED_ORIGINS       comma-separated; defaults to the live site below.
 *
 * Then set the site's TIGON_LEAD_ENDPOINT GitHub secret to this Worker's URL
 * and turn on "Require signature" for the webhook in TIGON IOT.
 * Full steps: README.md → "Lead forms (TIGON IOT)".
 */

const DEFAULT_ORIGINS = "https://affordablegolfcartservice.com,https://www.affordablegolfcartservice.com";
const MAX_BODY_BYTES = 35 * 1024 * 1024; // 3 photos × 10 MB + fields

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(status, data, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

async function sign(secret, body) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, body));
  return "sha256=" + Array.from(mac, (b) => b.toString(16).padStart(2, "0")).join("");
}

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS).split(",").map((s) => s.trim());
    const origin = request.headers.get("Origin") || "";
    if (!allowed.includes(origin)) return json(403, { ok: false, error: "Origin not allowed." }, {});
    const headers = cors(origin);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return json(405, { ok: false, error: "Method not allowed." }, headers);
    if (!env.TIGON_WEBHOOK_URL || !env.TIGON_WEBHOOK_SECRET) {
      return json(500, { ok: false, error: "Form relay is not configured. Please call us." }, headers);
    }

    const body = await request.arrayBuffer();
    if (body.byteLength > MAX_BODY_BYTES) return json(413, { ok: false, error: "Photos are too large — 10 MB each at most." }, headers);

    const upstream = await fetch(env.TIGON_WEBHOOK_URL, {
      method: "POST",
      body,
      headers: {
        // Keep the multipart boundary exactly as the browser sent it.
        "Content-Type": request.headers.get("Content-Type") || "application/octet-stream",
        "X-Tigon-Signature": await sign(env.TIGON_WEBHOOK_SECRET, body),
        // The visitor's details, since TIGON otherwise sees the Worker's.
        "X-Forwarded-For": request.headers.get("CF-Connecting-IP") || "",
        "User-Agent": request.headers.get("User-Agent") || "",
      },
    });

    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json", ...headers },
    });
  },
};
