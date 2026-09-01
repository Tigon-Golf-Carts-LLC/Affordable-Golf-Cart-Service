/**
 * Site-wide constants and base-path helpers.
 *
 * `import.meta.env.BASE_URL` is injected by Vite from the `base` option, which
 * itself is read from `process.env.BASE_PATH` in `vite.config.ts`. Nothing in
 * the app may hardcode an absolute `/assets/...` path: every asset URL and
 * every non-router link goes through `withBase()`.
 */

/** Always starts and ends with "/", e.g. "/" or "/my-repo/". */
export const BASE_PATH: string = import.meta.env.BASE_URL || "/";

/** Base for wouter's <Router base>: "" for a root site, "/my-repo" otherwise. */
export const ROUTER_BASE: string = BASE_PATH === "/" ? "" : BASE_PATH.replace(/\/$/, "");

/** Absolute origin of the deployed site, used for canonical + JSON-LD URLs. */
export const SITE_ORIGIN: string =
  import.meta.env.VITE_SITE_ORIGIN || "https://affordablegolfcartservice.com";

/** Origin + base path, without a trailing slash. The canonical root of the site. */
export const SITE_URL: string = (SITE_ORIGIN + BASE_PATH).replace(/\/$/, "");

/**
 * Resolve a site-relative path against the deploy base path.
 * `withBase("/logo.png")` -> "/logo.png" or "/my-repo/logo.png".
 */
export function withBase(pathname: string): string {
  if (/^([a-z]+:)?\/\//i.test(pathname) || pathname.startsWith("data:") || pathname.startsWith("mailto:") || pathname.startsWith("tel:")) {
    return pathname;
  }
  return BASE_PATH + pathname.replace(/^\/+/, "");
}

/** Absolute URL for a site-relative path — for canonical tags and JSON-LD. */
export function absoluteUrl(pathname: string): string {
  return SITE_ORIGIN + withBase(pathname);
}

/* ------------------------------------------------------------------- brand */

export const PHONE_NUMBER = "1-844-844-4070";
export const PHONE_HREF = "tel:+18448444070";
export const EMAIL_ADDRESS = "info@affordablegolfcartservice.com";
export const EMAIL_HREF = `mailto:${EMAIL_ADDRESS}`;
export const BUSINESS_NAME = "Affordable Golf Cart Service";
