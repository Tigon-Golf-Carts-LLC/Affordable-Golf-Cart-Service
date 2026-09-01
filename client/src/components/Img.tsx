/**
 * Responsive image element.
 *
 * Reads the manifest that `script/optimize-assets.ts` writes and emits a
 * <picture> with AVIF + WebP sources, a srcset across the generated widths, a
 * sizes hint, and intrinsic width/height so the layout never shifts. Anything
 * below the fold gets loading="lazy" decoding="async".
 */
import manifest from "@/data/image-manifest.json";
import { withBase } from "@/lib/site";

type ImageManifest = Record<
  string,
  {
    width: number;
    height: number;
    widths: number[];
    formats: { avif?: string; webp?: string; fallback: string };
  }
>;

const images = manifest as ImageManifest;

interface ImgProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  /** Manifest key, e.g. "logo". */
  name: string;
  alt: string;
  /** `sizes` hint; defaults to the intrinsic width. */
  sizes?: string;
  /** Above-the-fold images opt out of lazy loading. */
  priority?: boolean;
}

/** "logo-{w}.webp" -> "logo-400.webp 400w, logo-800.webp 800w" */
function buildSrcSet(template: string, widths: number[]): string {
  return widths.map((w) => `${withBase(template.replace("{w}", String(w)))} ${w}w`).join(", ");
}

export function Img({ name, alt, sizes, priority = false, className, ...rest }: ImgProps) {
  const entry = images[name];

  if (!entry) {
    // Fail visibly in dev rather than shipping a broken <img> with no dimensions.
    if (import.meta.env.DEV) console.warn(`[Img] no manifest entry for "${name}"`);
    return null;
  }

  const { width, height, widths, formats } = entry;
  const resolvedSizes = sizes ?? `${width}px`;
  const loading = priority ? "eager" : "lazy";

  return (
    <picture>
      {formats.avif && (
        <source type="image/avif" srcSet={buildSrcSet(formats.avif, widths)} sizes={resolvedSizes} />
      )}
      {formats.webp && (
        <source type="image/webp" srcSet={buildSrcSet(formats.webp, widths)} sizes={resolvedSizes} />
      )}
      <img
        src={withBase(formats.fallback.replace("{w}", String(widths[widths.length - 1])))}
        srcSet={buildSrcSet(formats.fallback, widths)}
        sizes={resolvedSizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className={className}
        // React 18 does not know the camelCase prop; the lowercase DOM
        // attribute is what browsers actually read.
        {...(priority ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
        {...rest}
      />
    </picture>
  );
}
