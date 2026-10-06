---
name: TIGON lead security
description: Signing and hosting constraints for this site's TIGON lead integration
---

Keep the unique TIGON endpoint URL private on the server. Do not enable HMAC request signing unless the user explicitly changes their instruction.

**Why:** The user asked for no HMAC signing and a private webhook credential. The setup packet distinguishes the key in the URL from a separate optional signing secret; a newly generated local secret would not authenticate requests to TIGON.

**How to apply:** Obtain credentials through the secure Secrets flow, never commit endpoint keys or uploaded setup packets containing them, and do not expose the endpoint in frontend bundles. Static GitHub Pages cannot execute a private server proxy: it needs a hosted relay or the full Express-hosted app. Confirm that hosting path before claiming the static copy can submit leads.

Use the provided webhook for all forms and modal forms on this website, and include all supplied TIGON fields.

**Why:** The user explicitly instructed: “USE THE WEBHOOK I HAVE PROVIDED FOR ALL FORMS, AND MODAL FORMS. REMAKE ALL FORMS TO HAVE ALL FIELDS.” This overrides the packet's separate-webhook instruction for this website.

**How to apply:** Route all website forms through the same private server-side webhook configuration. Preserve form and page attribution so submissions remain distinguishable. Do not ask for another webhook merely because a form appears in a modal. Keep server-captured fields automatic as directed by the field list; do not ask visitors to enter tracking or browser metadata.

