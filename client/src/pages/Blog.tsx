import { Link, useRoute, useLocation } from "wouter";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/BlogCard";
import { useSeo } from "@/lib/seo";
import {
  getPostsForPage,
  getTotalPages,
  SITE_DOMAIN,
  SITE_NAME,
} from "@shared/blog";

const PHONE_NUMBER = "1-888-502-7074";
import { trackServicePhoneClick } from "@/lib/lead-analytics";
const PHONE_HREF = "tel:+18885027074";

export default function Blog() {
  const [, params] = useRoute("/blog/page/:page");
  const [, navigate] = useLocation();
  const totalPages = getTotalPages();

  const rawPage = params?.page ? parseInt(params.page, 10) : 1;
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Redirect out-of-range or /blog/page/1 to canonical homes
  useEffect(() => {
    if (params?.page && page === 1) {
      navigate("/blog", { replace: true });
    } else if (page > totalPages) {
      navigate("/blog", { replace: true });
    }
  }, [params?.page, page, totalPages, navigate]);

  const posts = getPostsForPage(page);
  const canonical =
    page === 1 ? `${SITE_DOMAIN}/blog` : `${SITE_DOMAIN}/blog/page/${page}`;
  const prev =
    page > 1
      ? page === 2
        ? `${SITE_DOMAIN}/blog`
        : `${SITE_DOMAIN}/blog/page/${page - 1}`
      : undefined;
  const next = page < totalPages ? `${SITE_DOMAIN}/blog/page/${page + 1}` : undefined;

  useSeo({
    title:
      page === 1
        ? `Golf Cart Service Blog | Tips & Guides | ${SITE_NAME}`
        : `Golf Cart Service Blog — Page ${page} | ${SITE_NAME}`,
    description:
      "Expert golf cart service tips, maintenance guides, and local advice for The Villages, Florida and beyond from Villages Golf Cart Services.",
    canonical,
    type: "website",
    prev,
    next,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `${SITE_NAME} Blog`,
      url: `${SITE_DOMAIN}/blog`,
      description:
        "Golf cart service tips, maintenance guides, and local advice for The Villages, Florida.",
      publisher: { "@type": "Organization", name: SITE_NAME },
    },
  });

  const pageHref = (n: number) => (n === 1 ? "/blog" : `/blog/page/${n}`);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-secondary text-secondary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold">Golf Cart Service Blog</h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
            Expert tips, maintenance guides, and local advice for golf cart owners in
            The Villages, Florida and across the country.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="grid-posts">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-14 flex items-center justify-center gap-2"
              aria-label="Blog pagination"
              data-testid="nav-pagination"
            >
              {page > 1 ? (
                <Button asChild variant="outline" size="sm" data-testid="link-prev-page">
                  <Link href={pageHref(page - 1)} aria-label="Previous page">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  asChild
                  variant={n === page ? "default" : "outline"}
                  size="sm"
                >
                  <Link
                    href={pageHref(n)}
                    aria-label={`Page ${n}`}
                    aria-current={n === page ? "page" : undefined}
                    data-testid={`link-page-${n}`}
                  >
                    {n}
                  </Link>
                </Button>
              ))}

              {next ? (
                <Button asChild variant="outline" size="sm" data-testid="link-next-page">
                  <Link href={pageHref(page + 1)} aria-label="Next page">
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </nav>
          )}
        </div>
      </section>

      <section className="bg-muted/40 border-t py-14">
        <div className="container mx-auto px-4 text-center space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Need golf cart service today?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our certified technicians serve The Villages and all 50 states. Call now for
            fast, friendly, transparent service.
          </p>
          <Button asChild size="lg" className="font-bold">
            <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")} data-testid="button-call-blog">
              <Phone className="h-5 w-5 mr-2 fill-current" /> {PHONE_NUMBER}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
