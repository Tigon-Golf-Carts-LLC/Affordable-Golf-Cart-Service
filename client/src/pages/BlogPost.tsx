import { Link, useRoute } from "wouter";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, ChevronRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/BlogCard";
import { useSeo } from "@/lib/seo";
import {
  getPostBySlug,
  getRelatedPosts,
  formatPostDate,
  buildBlogPostingJsonLd,
  SITE_DOMAIN,
  SITE_NAME,
} from "@shared/blog";

const PHONE_NUMBER = "1-888-502-7074";
import { trackServicePhoneClick } from "@/lib/lead-analytics";
const PHONE_HREF = "tel:+18885027074";

function MarkdownLink({ href, children }: { href?: string; children?: React.ReactNode }) {
  if (href && href.startsWith("/")) {
    return (
      <Link href={href} className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80">
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80"
    >
      {children}
    </a>
  );
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const post = getPostBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useSeo(
    post
      ? {
          title: post.seoTitle,
          description: post.metaDescription,
          canonical: `${SITE_DOMAIN}/blog/${post.slug}`,
          image: `${SITE_DOMAIN}${post.heroImage.src}`,
          imageAlt: post.heroImage.alt,
          type: "article",
          publishedTime: `${post.publishDate}T09:00:00-04:00`,
          modifiedTime: `${post.dateModified}T09:00:00-04:00`,
          author: SITE_NAME,
          tags: post.tags,
          jsonLd: buildBlogPostingJsonLd(post),
        }
      : {
          title: `Post Not Found | ${SITE_NAME}`,
          description: "The blog post you are looking for could not be found.",
          canonical: `${SITE_DOMAIN}/blog`,
        },
  );

  if (!post) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Post Not Found</h1>
          <Button asChild variant="outline">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const related = getRelatedPosts(post.slug, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground truncate">{post.category}</span>
        </div>
      </div>

      <article className="container mx-auto px-4 py-10 md:py-14 max-w-3xl">
        <header className="space-y-5 mb-8">
          <Badge
            variant="outline"
            className="text-primary border-primary/30 bg-primary/5 font-bold text-sm px-3 py-1 uppercase tracking-wider"
            data-testid="badge-post-category"
          >
            {post.category}
          </Badge>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.publishDate}>{formatPostDate(post.publishDate)}</time>
            <span aria-hidden="true">•</span>
            <span>{post.author}</span>
          </div>
        </header>

        <div className="aspect-[16/9] overflow-hidden rounded-xl bg-muted mb-10">
          <img
            src={post.heroImage.src}
            alt={post.heroImage.alt}
            width={1280}
            height={720}
            className="h-full w-full object-cover"
            data-testid="img-post-hero"
          />
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>
            {post.body}
          </ReactMarkdown>
        </div>

        <div className="mt-12 rounded-xl bg-secondary text-secondary-foreground p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to schedule golf cart service?</h2>
          <p className="text-secondary-foreground/80">
            Transparent pricing, certified technicians, nationwide coverage.
          </p>
          <Button asChild size="lg" className="font-bold">
            <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")} data-testid="button-call-post">
              <Phone className="h-5 w-5 mr-2 fill-current" /> {PHONE_NUMBER}
            </a>
          </Button>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t bg-muted/30 py-14">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
