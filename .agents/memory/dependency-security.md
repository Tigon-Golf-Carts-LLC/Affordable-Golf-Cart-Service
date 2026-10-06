---
name: Dependency security checks
description: Replit package-firewall behavior during clean post-merge dependency installation
---

A successful parent-package upgrade does not guarantee that a firewall-blocked transitive dependency was replaced. Existing lockfile resolutions may remain when they still satisfy the parent's range.

**Why:** During post-merge setup, a clean install was blocked by a critical-CVE policy. Updating the parent alone still selected the blocked transitive version; selecting an approved compatible patch made clean installation succeed.

**How to apply:** Check the currently approved transitive release and parent dependency range. Prefer upgrading the parent, use a compatible override when needed, and verify the committed lockfile with a clean install. Never bypass the package firewall or switch registries to evade it.

For GitHub-hosted CI, lockfile tarball URLs must be publicly reachable rather than Replit-internal hostnames. Preserve the approved versions and integrity hashes when normalizing URLs, and verify the public tarballs against those hashes.

**Why:** External runners cannot resolve Replit-only package download hosts even when the dependencies install successfully inside Replit. This is a portability change, not permission to evade a vulnerability block.

**How to apply:** Check lockfile download hosts when introducing external CI. Keep Replit's local package firewall configuration in place, and only normalize the already approved, identical package artifacts.
