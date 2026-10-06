---
name: Safe browser regression testing
description: Safety constraints for lead-form browser tests and the Nix browser runtime
---

Run lead browser tests against a frontend-only server, not a real delivery server. Intercept lead requests, default-deny other writes and external requests, and block service workers.

**Why:** The site has a working private webhook; a missed mock must not send a test lead to staff. Browser request interception alone is not an adequate second line of defense.

**How to apply:** Keep tests independent of development/production credentials and use synthetic visitor data. Do not replace the isolated test server with the normal Express workflow to make a test easier.

On Replit's Nix container, downloaded Playwright Chromium can fail at launch because its shared libraries are unavailable. Use a Nix-wrapped system browser rather than Debian dependency installation. Do not assume `/etc/NIXOS` exists in the container.

**Why:** The downloaded browser failed with missing GLib, and the conventional NixOS marker was absent despite the Nix runtime. The wrapped browser provided its runtime dependencies.

**How to apply:** Keep browser-runtime selection portable; use the normal bundled Playwright browser on non-Nix CI. When expanding browser coverage, account for Nix support separately from test correctness.

Use matching Playwright-patched Firefox and WebKit runtimes on supported CI hosts; do not substitute older preinstalled Nix browsers just because they launch.

**Why:** An older patched Firefox launched but rejected the current runner's viewport protocol. Downloaded matching runtimes also require libraries unavailable by default in Nix; ad-hoc local relinking is not a supported CI substitute.

**How to apply:** Keep Chromium's local Nix executable override engine-scoped. Distinguish configuring cross-engine CI from observing passing cross-engine runs, and never describe WebKit device emulation as physical Safari/iPhone verification.
