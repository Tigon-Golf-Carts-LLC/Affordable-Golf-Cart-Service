#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Use the committed lockfile; do not change dependency versions during setup.
npm ci --no-audit --no-fund
npm run check
npm run check:browser
# Replit uses the Nix-wrapped Chromium configured in .replit. GitHub Actions
# installs Playwright Chromium and Linux dependencies before the same suite.
npm test
npm run build

# No database migration is needed for these forms: leads are sent to TIGON.
# Leave docs/ exports to the static-hosting workflow, which needs its own relay.
