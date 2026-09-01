import { useEffect } from "react";
import type { PageSeo } from "@shared/seo";

/**
 * Applies a page's title and meta description on client-side navigation.
 *
 * On first load these already match the prerendered <head> (both come from
 * `shared/seo.ts`), so this is a no-op; it matters when wouter swaps routes
 * without a document load.
 */
export function usePageSeo(seo: PageSeo | undefined) {
  useEffect(() => {
    if (!seo) return;
    document.title = seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", seo.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", window.location.href.split("#")[0]);
  }, [seo?.title, seo?.description]);
}
