type LeadEvent = "service_inquiry_opened" | "lead_form_submitted";
type FormVariant = "contact" | "inquiry";
type PhoneLinkLocation = "header_top" | "header_desktop" | "header_mobile" | "footer" | "page_cta" | "service_card";
type RouteCategory =
  | "home" | "about" | "services" | "service_detail" | "states" | "state_detail"
  | "contact" | "blog" | "blog_page" | "blog_post" | "not_found";
type AnalyticsData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track(name: string, data?: AnalyticsData): void | Promise<unknown>;
    };
  }
}

// Return fixed categories only, never a visitor-supplied path or query value.
export function getRouteCategory(path: string): RouteCategory {
  const pathname = path.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
  const pages: Record<string, RouteCategory> = {
    "/": "home",
    "/about": "about",
    "/services": "services",
    "/states": "states",
    "/contact": "contact",
    "/blog": "blog",
  };
  if (Object.hasOwn(pages, pathname)) return pages[pathname];
  if (/^\/services\/[^/]+$/.test(pathname)) return "service_detail";
  if (/^\/states\/[^/]+$/.test(pathname)) return "state_detail";
  if (/^\/blog\/page\/[^/]+$/.test(pathname)) return "blog_page";
  if (/^\/blog\/[^/]+$/.test(pathname)) return "blog_post";
  return "not_found";
}

export function getCurrentRouteCategory(): RouteCategory {
  return typeof window === "undefined" ? "not_found" : getRouteCategory(window.location.pathname);
}

export function trackLeadEvent(
  name: LeadEvent,
  variant: FormVariant,
  routeCategory = getCurrentRouteCategory(),
): void {
  trackEvent(name, {
    form_variant: variant,
    route_category: routeCategory,
  });
}

// Measures intent to dial, not a connected or completed call.
export function trackServicePhoneClick(location: PhoneLinkLocation): void {
  trackEvent("service_phone_clicked", {
    link_location: location,
    route_category: getCurrentRouteCategory(),
  });
}

function trackEvent(name: LeadEvent | "service_phone_clicked", data: AnalyticsData): void {
  if (typeof window === "undefined") return;
  try {
    // Replit's publishing proxy injects Umami when analytics is enabled.
    // Do not add a script/website ID here or route these events to the
    // existing Google tags. Local preview and GitHub Pages have no tracker.
    const result = window.umami?.track(name, data);
    // Handle rejected tracker promises as well as synchronous failures.
    void Promise.resolve(result).catch(() => {});
  } catch {
    // Analytics must never interrupt forms or phone-link navigation.
  }
}
