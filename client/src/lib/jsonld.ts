import { SITE_NAME, SITE_DOMAIN, SITE_LOGO } from "@shared/blog";
import type { Service } from "@shared/services";
import type { USState } from "@shared/states";

export const BUSINESS_PHONE = "+1-888-502-7074";
export const BUSINESS_EMAIL = "info@villagesgolfcartservices.com";

type Json = Record<string, unknown>;

// Stable @id so other nodes can reference the same organization entity.
const ORG_ID = `${SITE_DOMAIN}/#organization`;
const WEBSITE_ID = `${SITE_DOMAIN}/#website`;

// Villages Golf Cart Services is a nationwide, phone-based service business with
// no physical storefront. We model it as an Organization with a ContactPoint and
// a nationwide service area — NOT a LocalBusiness with a (non-existent) street
// address, which would be inaccurate structured data.
export function organizationJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: `${SITE_DOMAIN}/`,
    logo: { "@type": "ImageObject", url: SITE_LOGO },
    description:
      "Nationwide golf cart repair and maintenance connecting customers with certified technicians for tune-ups, battery replacement, brakes, and custom upgrades.",
    email: BUSINESS_EMAIL,
    telephone: BUSINESS_PHONE,
    areaServed: { "@type": "Country", name: "United States" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS_PHONE,
      email: BUSINESS_EMAIL,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: ["English"],
    },
  };
}

export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_DOMAIN}/`,
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_DOMAIN}${item.path}`,
    })),
  };
}

// Parse a display price range like "$700–$1,300" or "$99–$289" into numbers.
function parsePriceRange(priceRange: string): { min?: number; max?: number } {
  const numbers = priceRange
    .replace(/,/g, "")
    .match(/\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length === 0) return {};
  const values = numbers.map(Number);
  return { min: values[0], max: values[values.length - 1] };
}

function serviceOffer(priceRange: string): Json {
  const { min, max } = parsePriceRange(priceRange);
  if (min === undefined) return {};
  return {
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        ...(min === max
          ? { price: min }
          : { minPrice: min, maxPrice: max }),
      },
    },
  };
}

export function serviceJsonLd(service: Service): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    serviceType: service.category,
    category: service.category,
    url: `${SITE_DOMAIN}/services/${service.id}`,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "United States" },
    ...serviceOffer(service.priceRange),
  };
}

export function stateServiceJsonLd(state: USState): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Golf Cart Service in ${state.name}`,
    description: `Professional golf cart repair and maintenance in ${state.name}, including tune-ups, battery replacement, brake service, and custom upgrades.`,
    serviceType: "Golf cart repair and maintenance",
    url: `${SITE_DOMAIN}/states/${state.slug}`,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "State", name: state.name },
  };
}
