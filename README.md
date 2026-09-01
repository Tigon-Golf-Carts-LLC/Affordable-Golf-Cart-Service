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

## No backend, by design

- **Contact**: `tel:` and `mailto:` links. There is no form to submit.
- **Location search**: matches the bundled snapshot first; only falls back to
  the third-party Nominatim geocoder when a query matches nothing locally.
- **Secrets**: `DATA_API_URL` / `DATA_API_KEY` are read by `fetch-data` in CI
  only. Nothing secret ever reaches the client bundle, and `verify-dist` checks.
