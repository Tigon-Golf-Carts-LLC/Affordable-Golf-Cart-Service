# Affordable Golf Cart Service

A 100% static marketing site for Affordable Golf Cart Service, built with Vite +
React and deployed to GitHub Pages. There is no server, no API and no database:
every route is prerendered to a real HTML file at build time, and all data is
baked in from a build-time snapshot.

The site's goal is phone calls to **1-844-844-4070**, so the phone number is the
primary CTA on every page.

## Quick start

```bash
npm ci
npm run build      # full build: snapshot -> SEO -> images -> bundle -> prerender -> verify
npm run preview    # serve dist/ exactly the way GitHub Pages does, on :4173
```

For day-to-day work:

```bash
npm run dev        # Vite dev server (no prerender; the shell renders client-side)
```

## How the build works

| Step | Script | What it does |
| --- | --- | --- |
| 1 | `script/clean.ts` | Removes `dist/` and `.ssr/`. |
| 2 | `script/fetch-data.ts` | Resolves all data once and writes minified JSON to `client/src/data/`. |
| 3 | `script/generate-seo.ts` | Emits `sitemap.xml`, `robots.txt`, `manifest.json`, `browserconfig.xml`, `opensearch.xml` — all base-path aware. |
| 4 | `script/optimize-assets.ts` | Turns `assets/source/` originals into responsive AVIF/WebP/fallback derivatives plus an image manifest. |
| 5 | `vite build` ×2 | Browser bundle into `dist/`, SSR bundle into `.ssr/`. |
| 6 | `script/prerender.ts` | Renders every route to its own `index.html` with per-page SEO tags; writes `404.html`, `.nojekyll`, `CNAME`. |
| 7 | `script/verify-dist.ts` | Fails the build on missing files, oversized files, `/api/` or `localhost` references, or leaked secret names. |

`npm run build:site` is the same pipeline without step 2, for when the snapshot
in `client/src/data/` is already current.

## Where things live

```
assets/source/      Image originals. Never shipped — only derivatives reach dist/.
client/             The app. `public/` is copied verbatim into dist/.
client/src/data/    Generated JSON snapshot (git-ignored).
data/               Build-time source of truth for services, locations, states.
script/             Build pipeline.
shared/types.ts     Shared type definitions.
shared/seo.ts       Per-page titles and descriptions — read by both the
                    prerenderer and the page components, so they cannot drift.
```

## Deploy configuration

Both values live in the `env:` block of `.github/workflows/deploy.yml`.

| Deploy target | `BASE_PATH` | `SITE_DOMAIN` |
| --- | --- | --- |
| Custom domain (current) | `/` | `https://affordablegolfcartservice.com` |
| `<user>.github.io` | `/` | `https://<user>.github.io` |
| Project site | `/<repo-name>/` | `https://<user>.github.io` |

`CNAME` is written on every build (Pages wipes it otherwise) whenever
`BASE_PATH` is `/`; under a project sub-path it is skipped, since a custom
domain and a sub-path are mutually exclusive.

Repository setting to flip once: **Settings → Pages → Source: GitHub Actions**.

## Lead forms (TIGON IOT)

Every lead form posts to TIGON IOT → Webhook Flows, using the field names TIGON
expects (`first_name`, `last_name`, `email`, `phone1`, `phone2`, `address`,
`zip_code`, `brand`, `model`, `vin_number`, `sku_number`, `comments`,
`image_1`–`image_3`), plus `form_name` (always `Contact form`), the tracking
fields (`url`, `referrer`, `utm_*`, `gclid`, `fbclid`, `ga_client_id`) and the
empty `website` spam trap. Two extra fields say where the lead came from:
`form_location` (`Contact page` / `Request Service popup`) and
`service_requested` (the service or location page it was opened from).

| Where | What |
| --- | --- |
| `client/src/lib/leads.ts` | Tracking (30-day first-touch UTMs), validation, sending. |
| `client/src/components/LeadForm.tsx` | The form itself. |
| `client/src/components/LeadFormDialog.tsx` | The site-wide "Request Service" popup and its button. |
| `client/src/pages/Contact.tsx` | The inline form on `/contact`. |
| `worker/tigon-lead-relay.js` | Optional Cloudflare Worker that signs leads with the webhook secret. |

**Where the forms send.** The URL comes from the `TIGON_LEAD_ENDPOINT`
repository secret (Settings → Secrets and variables → Actions) and is baked in
at build time. It is never committed: this repository is public and the
webhook key in the URL works like a password. For local work put it in
`.env.local` (git-ignored). If it is unset, the forms tell visitors to call,
and `verify-dist` prints a warning.

**Signing (recommended).** GitHub Pages cannot keep a secret, so signing
happens in `worker/tigon-lead-relay.js`:

1. TIGON IOT → Webhook Flows → Webhooks → this webhook → Setup packet →
   Developers → **Create secret**. Copy it (it is shown once).
2. Cloudflare → Workers & Pages → Create → Worker; paste the relay's code;
   Deploy. Under Settings → Variables and Secrets add two *Secrets*:
   `TIGON_WEBHOOK_URL` (the webhook URL) and `TIGON_WEBHOOK_SECRET`.
3. Set the `TIGON_LEAD_ENDPOINT` GitHub secret to the Worker's URL and re-run
   the deploy workflow.
4. Submit a test lead; once it arrives, turn on **Require signature** for the
   webhook in TIGON IOT.

Without the Worker, set `TIGON_LEAD_ENDPOINT` to the webhook URL itself and the
browser posts unsigned (only allowed while signatures are optional).

**Testing.** TIGON only accepts browser posts from
`https://affordablegolfcartservice.com`, so test on the live site, not on
`localhost`.

## No backend, by design

- **Contact**: the lead forms above post to TIGON IOT; `tel:` and `mailto:` links remain.
- **Location search**: matches the bundled snapshot first; only falls back to
  the third-party Nominatim geocoder when a query matches nothing locally.
- **Secrets**: `DATA_API_URL` / `DATA_API_KEY` are read by `fetch-data` in CI
  only. Nothing secret ever reaches the client bundle, and `verify-dist` checks.
