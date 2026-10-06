import { Link } from "wouter";
import { ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPostDate, type BlogPost } from "@shared/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article data-testid={`card-post-${post.slug}`}>
      <Card className="group h-full overflow-hidden hover-elevate transition-shadow">
        <Link
          href={`/blog/${post.slug}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          data-testid={`link-post-image-${post.slug}`}
        >
          <div className="aspect-[16/9] overflow-hidden bg-muted">
            <img
              src={post.heroImage.src}
              alt={post.heroImage.alt}
              loading="lazy"
              width={1280}
              height={720}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Badge
              variant="outline"
              className="text-primary border-primary/30 bg-primary/5 font-bold text-xs uppercase tracking-wider"
              data-testid={`badge-category-${post.slug}`}
            >
              {post.category}
            </Badge>
            <time
              dateTime={post.publishDate}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <Calendar className="h-3.5 w-3.5" />
              {formatPostDate(post.publishDate)}
            </time>
          </div>
          <h2 className="text-xl font-bold text-foreground leading-snug">
            <Link
              href={`/blog/${post.slug}`}
              className="hover:text-primary transition-colors"
              data-testid={`link-post-title-${post.slug}`}
            >
              {post.seoTitle}
            </Link>
          </h2>
          <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 font-bold text-primary hover:gap-2.5 transition-all"
            data-testid={`link-readmore-${post.slug}`}
          >
            Read more <ArrowRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </article>
  );
}
