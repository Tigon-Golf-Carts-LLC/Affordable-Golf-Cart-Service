import { useEffect } from "react";

type MetaKind = "name" | "property";

interface SeoLink {
  rel: string;
  href: string;
  key: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  prev?: string;
  next?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const MANAGED_ATTR = "data-seo-managed";

// Remove every tag this hook previously created so each navigation starts from a
// clean slate. This prevents stale article:*/og:image/twitter:* tags from leaking
// onto pages that don't set them during client-side SPA navigation.
function clearManaged() {
  document.head
    .querySelectorAll(`[${MANAGED_ATTR}="true"]`)
    .forEach((el) => el.remove());
}

// Upsert a singleton meta tag. If one already exists (including the static tags
// baked into index.html, like the hardcoded canonical/og:*), update it in place
// so we never create duplicates. When content is empty, only managed tags we
// created are removed; static defaults are left untouched.
function setMeta(kind: MetaKind, key: string, content?: string) {
  const el = document.head.querySelector<HTMLMetaElement>(`meta[${kind}="${key}"]`);
  if (content) {
    if (el) {
      el.setAttribute("content", content);
    } else {
      const created = document.createElement("meta");
      created.setAttribute(kind, key);
      created.setAttribute("content", content);
      created.setAttribute(MANAGED_ATTR, "true");
      document.head.appendChild(created);
    }
  } else if (el && el.getAttribute(MANAGED_ATTR) === "true") {
    el.remove();
  }
}

// Upsert the canonical link in place so there is exactly one canonical per page,
// overriding any static canonical from index.html.
function setCanonical(href: string) {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    el.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// prev/next links never exist statically, so they are always managed.
function addManagedLink({ rel, href, key }: SeoLink) {
  if (!href) return;
  const el = document.createElement("link");
  el.setAttribute("rel", rel);
  el.setAttribute("href", href);
  el.setAttribute("data-seo-key", key);
  el.setAttribute(MANAGED_ATTR, "true");
  document.head.appendChild(el);
}

function addJsonLd(data: SeoConfig["jsonLd"]) {
  if (!data) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-seo-jsonld", "true");
  script.setAttribute(MANAGED_ATTR, "true");
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function useSeo(config: SeoConfig) {
  const {
    title,
    description,
    canonical,
    image,
    imageAlt,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    tags,
    prev,
    next,
    jsonLd,
  } = config;

  useEffect(() => {
    // Reconcile from a clean slate so no tag from the previous page persists.
    clearManaged();

    document.title = title;

    setMeta("name", "description", description);

    // Canonical (overrides any static homepage canonical from index.html)
    setCanonical(canonical);

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:type", type);
    setMeta("property", "og:image", image);
    setMeta("property", "og:image:alt", imageAlt);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
    setMeta("name", "twitter:image:alt", imageAlt);

    // Article-specific
    if (type === "article") {
      setMeta("property", "article:published_time", publishedTime);
      setMeta("property", "article:modified_time", modifiedTime);
      setMeta("property", "article:author", author);
    }

    // rel prev/next for pagination
    addManagedLink({ rel: "prev", href: prev ?? "", key: "prev" });
    addManagedLink({ rel: "next", href: next ?? "", key: "next" });

    addJsonLd(jsonLd);

    return () => {
      clearManaged();
    };
  }, [
    title,
    description,
    canonical,
    image,
    imageAlt,
    type,
    publishedTime,
    modifiedTime,
    author,
    JSON.stringify(tags),
    prev,
    next,
    JSON.stringify(jsonLd),
  ]);
}
