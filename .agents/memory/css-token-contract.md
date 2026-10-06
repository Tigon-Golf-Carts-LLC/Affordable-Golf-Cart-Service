---
name: index.css token contract
description: index.css must define a specific set of CSS vars in exact triplet-vs-full-color forms that tailwind.config.ts and shadcn Button/Badge consume; full rewrites silently break them.
---

# index.css ↔ tailwind.config.ts ↔ shadcn token contract

When rewriting `client/src/index.css` (e.g. a palette/theme change), you MUST preserve the
full token set both `tailwind.config.ts` and the shadcn components consume. A DESIGN subagent
rewrote index.css for a new palette and dropped most of these, producing invalid borders and
dead button/badge interactions. typecheck + build still PASS, so this is invisible without
reading the contract.

**Why:** `tailwind.config.ts` references vars in two different forms, and Button/Badge use
elevate utility classes that only exist if index.css defines them. Missing vars resolve to
invalid CSS → border-color falls back to currentColor; missing utilities → dead interactions.

**How to apply — required vars, by consumption form (check tailwind.config.ts to confirm):**
- HSL triplets, consumed as `hsl(var(--x) / <alpha-value>)`: base colors, `--card-border`,
  `--popover-border`, `--sidebar`, `--sidebar-foreground`, `--sidebar-border`, `--sidebar-ring`,
  `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`,
  `--sidebar-accent-foreground`, `--chart-1..5`.
- Full color values, consumed as bare `var(--x-border)`: `--primary-border`, `--secondary-border`,
  `--muted-border`, `--accent-border`, `--destructive-border`, `--sidebar-primary-border`,
  `--sidebar-accent-border`. Derive these with relative color:
  `hsl(from hsl(var(--base)) h s calc(l + var(--opaque-button-border-intensity)) / 1)`.
- Misc: `--font-sans/serif/mono` (fontFamily), `--button-outline`, `--badge-outline`,
  `--opaque-button-border-intensity` (light ~-8, dark ~+9), `--elevate-1`, `--elevate-2`.
- Utility classes Button/Badge need: `.hover-elevate` AND `.active-elevate` / `.active-elevate-2`
  / `.toggle-elevate` (overlay `::after`/`::before` press+toggle tint). A lift-based
  `.hover-elevate` (translate + shadow) coexists fine with the overlay active/toggle rules.

Verify after any theme rewrite: grep `var(--` in tailwind.config.ts and `hover-elevate|active-elevate|--button-outline|--badge-outline` in components/ui, and confirm every referenced var exists in BOTH `:root` and `.dark`.
