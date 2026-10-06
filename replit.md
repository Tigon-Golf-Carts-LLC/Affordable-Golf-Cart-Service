# Villages Golf Cart Services

## Overview

This is a service-based business website for a golf cart repair and maintenance company. The application showcases over 100 professional services including tune-ups, battery replacement, brake service, and custom upgrades. The primary goal is to drive phone calls to the business (1-888-502-7074) by presenting services with pricing information in an accessible, SEO-friendly format. The business serves customers nationwide across all 50 US states and operates as a phone-based service with no physical storefronts.

The application follows a full-stack TypeScript architecture with a React frontend and Express backend, designed to be a fast, static-content-focused marketing site with potential for future dynamic features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **Build Tool**: Vite for development and production builds

The frontend is a multi-page application with routes for Home, About, Services (with individual service detail pages), States (50 individual state pages for local SEO), and Contact. Service data and state data are defined as static TypeScript constants in the shared directory, enabling both server-side API responses and client-side imports.

### State Pages
- **50 State Pages**: Individual pages for each US state at `/states/:slug` (e.g., `/states/florida`)
- **States Data**: Defined in `shared/states.ts` with name, slug, abbreviation, and coordinates
- **SEO Optimization**: Each state page dynamically updates page title and meta description via useEffect
- **Google Maps Integration**: Each state page includes an embedded Google Map centered on the state
- **Navigation**: States dropdown menu in header and featured state links in footer

### Backend Architecture
- **Framework**: Express 5 running on Node.js
- **API Pattern**: RESTful endpoints for services data (currently read-only, serving static data)
- **Static File Serving**: Production builds served via Express static middleware with SPA fallback

The backend is minimal by design since the service catalog is static content. API routes exist primarily for SEO purposes and future extensibility (e.g., adding booking functionality).

### Data Storage
- **Current State**: In-memory storage with static service data defined in `shared/services.ts`
- **Database Ready**: Drizzle ORM configured with PostgreSQL dialect, schema defined in `shared/schema.ts`
- **Schema**: Users table exists for potential future authentication features

The services catalog (100+ services with categories, pricing, and descriptions) is hardcoded as a TypeScript module rather than stored in a database, which is appropriate for content that rarely changes.

### Build System
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Two-stage build - Vite builds client to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Database Migrations**: Drizzle Kit with `db:push` command for schema synchronization

## External Dependencies

### Replit lead conversion analytics

Custom lead events use Replit-hosted project analytics, not the existing Google
tags. Replit injects the Umami tracker through its publishing proxy; no Umami
script, website ID, or analytics credentials should be added to the app.
This is why `window.umami` is normally absent in local preview and GitHub Pages.

To activate collection, go to Publishing settings → Engagement tools, enable
analytics, and publish or republish. The changes take effect on the next publish.
Official setup instructions: https://docs.replit.com/features/publishing/project-analytics

Events:
- `service_inquiry_opened`: one event when the global service inquiry dialog opens.
- `lead_form_submitted`: only after the server confirms a successful Contact or
  inquiry submission; rejected submissions and local honeypot responses are excluded.
- `service_phone_clicked`: clicks on service phone links, not completed calls.
  Covers header (top, desktop, mobile), footer, page CTAs, and service cards.
  Sends only fixed `link_location` and `route_category` labels, never phone
  numbers, raw routes, queries, or visitor data. Native `tel:` navigation is unchanged.

Each form event has only `form_variant` (`contact` or `inquiry`) and a fixed
`route_category` (for example, `service_detail` or `contact`). Never copy form data,
TIGON tracking data, raw URLs, or webhook credentials into custom event dimensions.
Tracker absence, synchronous errors, and rejected promises must not affect forms.
Automated tests cover this behavior with a tracker stub; they do not verify live
collection. After activation, verify phone clicks in published-app analytics.
Verify form events using an approved test submission, not a production webhook
call from automated tests.

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **Drizzle ORM**: Query builder and schema management
- **connect-pg-simple**: Session storage (prepared for future authentication)

### UI Framework
- **Radix UI**: Comprehensive set of unstyled, accessible component primitives
- **shadcn/ui**: Pre-built component configurations in `client/src/components/ui/`
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment
- **TypeScript**: Strict mode enabled across client, server, and shared code

### Static contact-form delivery

The GitHub Pages build uses the public relay address in `shared/lead-relay.ts`, never the private TIGON endpoint. The regular Express build submits to its own `/api/tigon-leads`.

`TIGON_WEBHOOK_URL` must remain a server-side secret. `TIGON_ALLOWED_ORIGINS` contains comma-separated, exact HTTPS origins for additional verified static hosts; the primary site and generated relay origin are allowed by the server. No wildcard or browser credential fallback is supported.

Set `GITHUB_PAGES_ORIGIN` to the verified HTTPS origin of the static copy before running `npx tsx scripts/build-static.ts`. The build preserves that host in `docs/CNAME` instead of assigning the Express site's domain to GitHub Pages.

After relay changes, republish Express before releasing the rebuilt `docs/` to GitHub Pages. Keep the Express custom domain and Pages CNAME/DNS consistent with the intended hosting choice; do not move the primary domain to Pages unintentionally. Verify with local mocked tests (`env -u TIGON_WEBHOOK_URL npx tsx --test tests/tigon-leads.test.ts`) and harmless live preflight/invalid-form requests, not unsolicited leads.

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `wouter`: Client-side routing
- `zod` + `drizzle-zod`: Schema validation
- `lucide-react`: Icon library
- `class-variance-authority` + `clsx`: Utility for conditional CSS classes