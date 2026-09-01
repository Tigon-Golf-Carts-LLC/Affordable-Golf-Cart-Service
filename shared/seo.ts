/**
 * Per-page titles and descriptions — the single source of truth.
 *
 * Both sides read this file:
 *   - `script/routes.ts` (build time) writes these into the prerendered <head>,
 *     the canonical/OG tags and sitemap.xml.
 *   - the page components (runtime) set document.title from the same values on
 *     client-side navigation.
 *
 * Keeping one copy is the point: when the two drift, crawlers index one title
 * and visitors see another.
 *
 * Plain TypeScript with no path aliases so `tsx` can import it from build
 * scripts and Vite can bundle it for the browser.
 */
import type { Service, ServiceLocation, USState } from "./types.ts";

export interface PageSeo {
  title: string;
  description: string;
}

export const PHONE_NUMBER = "1-844-844-4070";

/** Routes with a hand-written page component, keyed by path. */
export const STATIC_PAGE_SEO: Record<string, PageSeo> = {
  "/": {
    title: "Affordable Golf Cart Service | #1 Professional Golf Cart Repair & Maintenance Near You",
    description:
      "Affordable Golf Cart Service offers affordable golf carts and repair services across the US — tune-ups, battery replacement, motor repair & more. Get your free quote today! Call 1-844-844-4070.",
  },
  "/about": {
    title: "About Us | Affordable Golf Cart Service",
    description:
      "Meet the certified golf car mechanics at Affordable Golf Cart Service — factory-trained on EZGO, Club Car & Yamaha with years of repair experience. Call 1-844-844-4070 to book your service.",
  },
  "/services": {
    title: "Golf Cart Service – Expert Repair, Maintenance & Tune-Up | Affordable Golf Cart Service",
    description:
      "Need cheap golf cart service without cutting corners? Affordable Golf Cart Service offers low-cost cart repair & maintenance from certified technicians. Get a free estimate — call 1-844-844-4070.",
  },
  "/services/golf-cart-repair": {
    title: "Golf Cart Repair Services | Expert & Affordable",
    description:
      "Fast, reliable golf cart repair for electric & gas carts — motor, controller, battery, brake & charger repair. Call 1-844-844-4070 for affordable golf cart repair near you!",
  },
  "/services/electrical-diagnostics": {
    title: "Golf Cart Charger Repair Near Me | Electrical Diagnostics & Fix",
    description:
      "Golf cart charger not working? Our certified technicians provide golf cart charger repair near you — fast diagnostics, fair pricing, same-week service. Call 1-844-844-4070.",
  },
  "/services/mobile-golf-cart-service": {
    title: "Mobile Golf Cart Service | On-Site Repair & Maintenance",
    description:
      "Mobile golf cart service that comes to you. On-site tune-ups, battery replacement, brake service & diagnostics at your home or community. Call 1-844-844-4070 to book!",
  },
  "/services/golf-cart-tune-up": {
    title: "Golf Cart Maintenance & Tune-Up Services | Keep Your Cart Running",
    description:
      "Complete golf cart maintenance & tune-up services: battery care, tires, brakes, electrical checks & storage prep. Free maintenance checklist. Call 1-844-844-4070!",
  },
  "/services/club-car-repair": {
    title: "Club Car Repairs Near Me | Certified Club Car Service",
    description:
      "Need Club Car repairs near you? Our certified technicians service Club Car DS, Precedent & Onward carts — diagnostics, repairs & parts at fair prices. Call 1-844-844-4070.",
  },
  "/services/motor-repair": {
    title: "Gas Golf Cart Repair | Engine Service & Motor Repair",
    description:
      "Expert gas golf cart repair from certified mechanics. From carburetor cleaning to engine overhaul, plus electric motor service — we fix it fast and at a fair price. Call 1-844-844-4070.",
  },
  "/services/golf-cart-alignment": {
    title: "Golf Cart Alignment Cost | Wheel Alignment Service & Pricing",
    description:
      "Golf cart alignment typically costs $50–$150. Learn the signs of misalignment, the alignment process, how often to align, and book service. Call 1-844-844-4070 for a free quote.",
  },
  "/blog/golf-cart-repair-cost": {
    title: "How Much Does Golf Cart Repair Cost? A Complete Pricing Guide",
    description:
      "How much does golf cart repair cost? Our complete pricing guide breaks down motor, battery, brake & electrical repair costs, plus DIY vs. pro and how to save.",
  },
  "/states": {
    title: "Golf Cart Services by State | Affordable Golf Cart Service",
    description:
      "Find affordable golf cart service, repair, and maintenance in your state. We serve all 50 US states with professional golf cart services. Call 1-844-844-4070 today!",
  },
  "/locations": {
    title: "Service Locations | Affordable Golf Cart Service",
    description:
      "Find an Affordable Golf Cart Service location near you. We have 14 service centers across the United States. Call 1-844-844-4070 today!",
  },
  "/contact": {
    title: "Contact Us | Affordable Golf Cart Service",
    description:
      "Call 1-844-844-4070 to schedule golf cart service, get a free estimate, or ask about mobile coverage in your area. Phone lines staffed 7 days a week.",
  },
};

export const NOT_FOUND_SEO: PageSeo = {
  title: "Page Not Found | Affordable Golf Cart Service",
  description:
    "That page does not exist. Call 1-844-844-4070 or browse our golf cart services and locations to find what you need.",
};

/* ------------------------------------------------- dynamic detail pages */

export function fullAddress(location: ServiceLocation): string {
  return `${location.address}, ${location.city}, ${location.stateAbbr} ${location.zip}`;
}

export function locationSeo(location: ServiceLocation): PageSeo {
  return {
    title: `Golf Cart Service in ${location.city}, ${location.stateAbbr} | Affordable Golf Cart Service`,
    description:
      `Professional golf cart service, repair, and maintenance at ${fullAddress(location)}. ` +
      `Over 100 services available. Call ${location.phone} today!`,
  };
}

export function stateSeo(state: USState): PageSeo {
  return {
    title: `Affordable Golf Cart Services in ${state.name} | Golf Cart Repair & Maintenance`,
    description:
      `Professional golf cart service, repair, and maintenance in ${state.name}. Over 100 services ` +
      `including tune-ups, battery replacement, brake service, and custom upgrades. ` +
      `Call ${PHONE_NUMBER} today for ${state.name} golf cart service!`,
  };
}

export function serviceSeo(service: Service): PageSeo {
  return {
    title: `${service.name} | Affordable Golf Cart Services`,
    description:
      `${service.name} (${service.priceRange}) — ${service.description} ` +
      `Affordable golf cart service nationwide. Call ${PHONE_NUMBER} for a free quote!`,
  };
}
