# Affordable Golf Cart Service

## Overview

This is a service-based business website for a golf cart repair and maintenance company. The application showcases over 100 professional services including tune-ups, battery replacement, brake service, and custom upgrades. The primary goal is to drive phone calls to the business (1-844-844-6638) by presenting services with pricing information in an accessible, SEO-friendly format.

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

The frontend is a multi-page application with routes for Home, About, Services (with individual service detail pages), and Contact. Service data is defined as static TypeScript constants in the shared directory, enabling both server-side API responses and client-side imports.

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

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `wouter`: Client-side routing
- `zod` + `drizzle-zod`: Schema validation
- `lucide-react`: Icon library
- `class-variance-authority` + `clsx`: Utility for conditional CSS classes