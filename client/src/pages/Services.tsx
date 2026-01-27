import { useLocation, useRoute, Link } from "wouter";
import { Phone, ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/ServiceCard";
import { services, serviceCategories, getServicesByCategory, getServiceById } from "@shared/services";
import { useState, useMemo } from "react";

const PHONE_NUMBER = "1-844-844-6638";
const PHONE_HREF = "tel:+18448446638";

function ServiceDetail({ serviceId }: { serviceId: string }) {
  const service = getServiceById(serviceId);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Service Not Found</h2>
            <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/services">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const relatedServices = getServicesByCategory(service.category)
    .filter((s) => s.id !== service.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to All Services
          </Link>
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-3">
              {service.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {service.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="outline" className="text-lg px-4 py-1">
                {service.priceRange}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-foreground">Service Details</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    {service.description}
                  </p>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-foreground mb-2">Price Range</h3>
                    <p className="text-muted-foreground">
                      {service.priceRange} - Pricing varies based on your specific needs, cart model, parts required, and location. Contact us for an accurate quote.
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-foreground mb-2">What's Included</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>• Professional diagnostic assessment</li>
                      <li>• Quality parts and materials</li>
                      <li>• Expert technician service</li>
                      <li>• Service warranty</li>
                      <li>• Post-service inspection</li>
                    </ul>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-foreground mb-2">Service Notes</h3>
                    <p className="text-muted-foreground text-sm">
                      Labor rates typically run $75–$350 per hour depending on service complexity. Mobile service calls where we come to you are billed at a higher rate than in-house service. Shipping, delivery, and parts costs are additional. Pricing may vary by state and area.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader className="text-center">
                  <h3 className="text-xl font-bold text-foreground">Schedule This Service</h3>
                  <p className="text-muted-foreground">Call now to get started</p>
                </CardHeader>
                <CardContent className="text-center">
                  <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-2xl font-bold text-primary mb-4">{PHONE_NUMBER}</p>
                  <Button size="lg" className="w-full" asChild data-testid={`button-service-detail-call-${service.id}`}>
                    <a href={PHONE_HREF}>
                      <Phone className="h-5 w-5 mr-2" />
                      Call Now to Schedule Today!
                    </a>
                  </Button>
                </CardContent>
                <CardFooter className="text-center text-sm text-muted-foreground">
                  Available Mon-Sat, 8AM-6PM
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="py-12 bg-card border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Related Services in {service.category}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedServices.map((relatedService) => (
                <ServiceCard key={relatedService.id} service={relatedService} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need This Service?
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Call now to schedule your {service.name} appointment!
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href={PHONE_HREF} className="gap-2">
              <Phone className="h-5 w-5" />
              {PHONE_NUMBER}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

function ServicesList() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = useMemo(() => {
    let result = selectedCategory
      ? getServicesByCategory(selectedCategory)
      : services;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Browse all 100 golf cart services we offer. From routine maintenance to custom upgrades, we've got you covered.
            </p>
            <Button size="lg" asChild data-testid="button-services-header-call">
              <a href={PHONE_HREF} className="gap-2">
                <Phone className="h-5 w-5" />
                Call Now: {PHONE_NUMBER}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-services"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                data-testid="filter-all-services"
              >
                All ({services.length})
              </Button>
              {serviceCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`filter-services-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredServices.length === 0 ? (
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="p-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Services Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6 text-sm text-muted-foreground">
                Showing {filteredServices.length} service{filteredServices.length !== 1 ? "s" : ""}
                {selectedCategory && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Don't See What You Need?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            We offer many more services not listed here. Call us to discuss your specific golf cart needs!
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-services-footer-call">
            <a href={PHONE_HREF} className="gap-2">
              <Phone className="h-5 w-5" />
              Call Now: {PHONE_NUMBER}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function Services() {
  const [, params] = useRoute("/services/:id");

  if (params?.id) {
    return <ServiceDetail serviceId={params.id} />;
  }

  return <ServicesList />;
}
