import { Link } from "wouter";
import { AlertCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NOT_FOUND_SEO } from "@shared/seo";
import { usePageSeo } from "@/lib/usePageSeo";
import { PHONE_HREF, PHONE_NUMBER } from "@/lib/site";

export default function NotFound() {
  usePageSeo(NOT_FOUND_SEO);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6">
          <div className="flex items-center mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">404 Page Not Found</h1>
          </div>

          <p className="text-muted-foreground mb-6">
            We couldn't find that page. It may have moved, or the link may be out of date.
            Try one of these instead — or call us and we'll point you the right way.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button size="lg" asChild className="flex-1" data-testid="button-404-call">
              <a href={PHONE_HREF}>
                <Phone className="h-5 w-5 mr-2" />
                Call {PHONE_NUMBER}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="flex-1">
              <Link href="/">Back to home</Link>
            </Button>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link href="/services" className="text-primary hover:underline">All services</Link>
            <Link href="/locations" className="text-primary hover:underline">Service locations</Link>
            <Link href="/states" className="text-primary hover:underline">Coverage by state</Link>
            <Link href="/contact" className="text-primary hover:underline">Contact us</Link>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}
