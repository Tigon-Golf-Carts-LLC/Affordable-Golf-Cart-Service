---
name: SPA SEO head management
description: How client-side meta/canonical/JSON-LD tags must be managed in this pure-SPA, given static tags baked into client/index.html
---

# SPA SEO head management

This is a pure client-side SPA (createRoot, no SSR/prerender/helmet). `client/index.html`
ships STATIC head tags that apply to every route: `<link rel="canonical">` + `og:url` +
`og:image` + `og:title` + `description` + `twitter:*`, all hardcoded to the HOMEPAGE.

The `useSeo` hook (`client/src/lib/seo.ts`) is the single owner of per-page head tags.

**Rule:** singletons (canonical, description, og:*, twitter:*) must be UPSERTED in place
(find existing tag — static or managed — and update it), never appended. Appending creates
duplicate canonicals, which is an SEO defect.

**Why:** the static homepage canonical/og tags in index.html exist on every route; a naive
"create a new tag" approach yields two canonicals on every non-home page.

**How to apply:** extras that never exist statically (article:*, rel prev/next, JSON-LD) are
tagged `data-seo-managed="true"` and fully reconciled — `clearManaged()` wipes them at the
start of every effect run so stale article/pagination tags don't leak across SPA navigation.
Empty-valued singletons only remove the tag if WE created it (managed); static defaults are
left intact. Note: after SPA-navigating away to a page that does NOT use useSeo, upserted
singletons retain their last value — acceptable because crawlers load each URL fresh.
