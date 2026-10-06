---
name: Zero-trace rebrand checklist
description: Non-obvious places brand fingerprints hide when fully rebranding this site
---

When asked to rebrand this site with "zero traces" of the old brand, a plain text sweep of client/src is NOT enough. Brand traces also hide in:
- **Baked-in image text**: logo.png / favicon.png / og-image.png had the old brand name rendered INTO the graphic. Must regenerate the image (media-generation), not just swap text.
- **SEO/AI files in client/public**: geo.txt, claude.txt, gpt.txt, llms.txt, nlp.txt, seo.txt, training.txt, ai.txt, feed.xml, sitemap.xml, well-known/ai-plugin.json, schema.json, humans.txt.
- **humans.txt** has its own /* LOCATIONS */, headquarters, phone sections — easy to miss.
- **manifest.json shortcuts**: PWA shortcuts can point to removed routes (e.g. /locations) → dead link after a feature removal.

**Why:** A grep for the brand string misses (a) text rasterized into PNGs and (b) URL/route references that survive a feature deletion.

**How to apply:** After editing client/public, ALWAYS regenerate the GitHub Pages mirror with `npx tsx scripts/build-static.ts` so docs/ stays in sync, then sweep for "/removedroute" and old brand terms across the whole repo (exclude attached_assets/, which holds the user's raw source data and is intentionally left untouched).
