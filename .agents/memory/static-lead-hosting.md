---
name: Static lead hosting
description: Why the static form uses the deployment's generated server domain
---

Use the verified generated Replit deployment origin for the static form's private lead relay, rather than the public site's custom domain.

**Why:** The custom domain can serve either Express or GitHub Pages. Using it as the relay would break delivery if DNS moves to static hosting. The generated deployment origin keeps the backend independent of that choice.

**How to apply:** Verify the deployment origin again before changing it. Allow only confirmed browser origins server-side; do not use wildcard CORS or expose TIGON credentials. Mocked forwarding tests establish code behavior, not release status. Verify the deployed route separately before claiming live delivery.

Finish and apply isolated task changes to the main project before asking the user to publish them.

**Why:** Replit publishes the main project, not pending task workspaces. A successful republish can therefore continue to lack the pending relay changes; repeating the publish does not resolve that mismatch.

**How to apply:** Separate the code handoff from release verification. Confirm that task changes have been applied before republishing, then verify preflight and invalid-form responses on the live relay and inspect the live static bundle. Never treat a successful build alone as proof of relay availability.
