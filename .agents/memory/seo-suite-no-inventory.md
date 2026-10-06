---
name: SEO suite & no-inventory adaptation
description: How the SEO/AI file suite is generated and why inventory/product/vehicle specs must be adapted, not fabricated
---

# SEO/AI file suite — service business, no inventory

This is a NATIONWIDE phone-based golf cart SERVICE business. There are NO
vehicles, products, or inventory anywhere in the data model. The only real
entities are services and US states.

**Rule:** when a spec asks for vehicle/product/inventory feeds (product_feed.xml,
google-shopping-feed.xml, local-inventory-feed.xml, vehicle schema, etc.), DO NOT
fabricate inventory. Adapt those concepts to real services (`shared/services.ts`,
~100 items: id/name/priceRange/category/description) and locations
(`shared/states.ts`, 50 states with lat/lng).

**Why:** fabricated inventory creates broken/misleading URLs and hurts SEO. The
prior sitemap.xml shipped 5 hardcoded service URLs that did not match real IDs and
404'd.

## How the public SEO files are produced
- `scripts/generate-seo-files.ts` (run `npx tsx scripts/generate-seo-files.ts`) is
  the single source of truth for the data-driven XML/feeds. It imports the real
  services + states and emits sitemap.xml (165 URLs = 5 core + 10 categories + 100
  services + 50 states), page/category/service/geo/image sitemaps, sitemap-index.xml,
  rss.xml, atom.xml, urllist.txt into `client/public`.
- Hand-maintained static files in `client/public`: robots.txt, llms.txt, ai.txt,
  gpt.txt, nlp.txt, seo.txt, geo.txt, claude.txt, training.txt, accessibility.txt,
  bots.txt, crawlers.txt, humans.txt, security.txt, compliance.txt, performance.txt,
  images.txt, manifest.json, browserconfig.xml, opensearch.xml, schema.json.

**How to apply:** after changing services/states OR any file in `client/public`,
re-run the generator (if data changed) then `npx tsx scripts/build-static.ts` to
resync `docs/` (GitHub Pages output). Both dev (Express/Vite) and docs/ serve these.

## Per-page JSON-LD structured data
- `client/src/lib/jsonld.ts` builds all schema.org nodes (Organization, WebSite,
  BreadcrumbList, Service, state-scoped Service). Pages inject them via the `useSeo`
  hook's `jsonLd` prop (array reconciled per navigation).
- **Rule:** the business is modeled as `Organization` + `ContactPoint` + nationwide
  `areaServed` — NEVER `LocalBusiness` with a street address. There is no storefront;
  inventing an address is inaccurate structured data and a Rich Results risk.
  **Why:** phone-based nationwide service, no physical location exists to cite.
- Service/state detail pages emit their own `Organization` node alongside the
  `Service` so the `provider: {"@id": "...#organization"}` reference self-resolves
  within the page graph for strict validators.
- Detail-page `useSeo` MUST be called unconditionally before any `if (!service)` /
  `if (!state)` early return (Rules of Hooks).
