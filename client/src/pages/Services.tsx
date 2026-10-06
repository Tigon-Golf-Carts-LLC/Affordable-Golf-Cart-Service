import { useLocation, useRoute, Link } from "wouter";
import { Phone, ArrowLeft, Search, Wrench, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/ServiceCard";
import { services, serviceCategories, getServicesByCategory, getServiceById } from "@shared/services";
import { useState, useMemo, useEffect } from "react";
import { SITE_DOMAIN } from "@shared/blog";
import { useSeo } from "@/lib/seo";
import { serviceJsonLd, breadcrumbJsonLd, organizationJsonLd } from "@/lib/jsonld";

const PHONE_NUMBER = "1-888-502-7074";
import { trackServicePhoneClick } from "@/lib/lead-analytics";
const PHONE_HREF = "tel:+18885027074";

function ServiceDetail({ serviceId }: { serviceId: string }) {
  const service = getServiceById(serviceId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [service]);

  useSeo({
    title: service
      ? `${service.name} - Golf Cart Services | Villages`
      : "Service Not Found | Villages Golf Cart Services",
    description: service
      ? `${service.name} for golf carts — ${service.priceRange}. ${service.description} Nationwide service. Call 1-888-502-7074.`
      : "The golf cart service you are looking for could not be found. Browse 100+ services or call 1-888-502-7074.",
    canonical: service
      ? `${SITE_DOMAIN}/services/${service.id}`
      : `${SITE_DOMAIN}/services`,
    jsonLd: service
      ? [
          organizationJsonLd(),
          serviceJsonLd(service),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.name, path: `/services/${service.id}` },
          ]),
        ]
      : undefined,
  });

  if (!service) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <Wrench className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-3xl font-bold text-foreground">Service Not Found</h2>
          <Button asChild variant="outline">
            <Link href="/services"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  const relatedServices = getServicesByCategory(service.category)
    .filter((s) => s.id !== service.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href={`/services?category=${encodeURIComponent(service.category)}`} className="hover:text-primary transition-colors">{service.category}</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground truncate">{service.name}</span>
        </div>
      </div>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-10">
              <div className="space-y-6">
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 font-bold text-sm px-3 py-1 uppercase tracking-wider">
                  {service.category}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                  {service.name}
                </h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                <div className="space-y-4">
                  <h3 className="font-bold text-xl">Pricing Estimate</h3>
                  <div className="bg-secondary text-white p-6 rounded-xl space-y-2">
                    <div className="text-3xl font-extrabold text-primary">{service.priceRange}</div>
                    <p className="text-secondary-foreground/70 text-sm font-medium leading-relaxed">
                      Pricing is an estimate based on average carts. Exact cost depends on your specific model, required parts, and location.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-xl">Why Choose Us?</h3>
                  <ul className="space-y-3">
                    {[
                      "Upfront, transparent pricing",
                      "Certified, experienced technicians",
                      "We use high-quality parts",
                      "Backed by our satisfaction guarantee"
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="font-medium text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-muted/50 p-6 rounded-xl border border-border/50">
                <h3 className="font-bold text-lg mb-2">Service Note</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  Labor rates typically run $75–$350 per hour depending on service complexity. Mobile service calls (where a tech comes to you) may include dispatch fees. Shipping, delivery, and parts costs are additional. Prices vary by state. Call for a precise quote.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4">
              <Card className="sticky top-28 border-primary/20 shadow-xl overflow-hidden">
                <div className="bg-primary p-6 text-center text-primary-foreground">
                  <h3 className="text-2xl font-extrabold mb-2">Ready to Book?</h3>
                  <p className="font-medium opacity-90">Call now for a precise quote and scheduling.</p>
                </div>
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    <Phone className="w-10 h-10 fill-current" />
                  </div>
                  <Button size="lg" className="w-full h-14 text-lg font-bold shadow-lg" asChild>
                    <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")}>Call {PHONE_NUMBER}</a>
                  </Button>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    Available Mon-Sat, 8AM-5PM
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="py-16 bg-muted/30 border-t border-border/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-foreground mb-8">
              More in <span className="text-primary">{service.category}</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedServices.map((relatedService) => (
                <ServiceCard key={relatedService.id} service={relatedService} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ServicesList() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(()=> { window.scrollTo(0,0) }, [selectedCategory]);

  useSeo({
    title: "Golf Cart Services | 100+ Repairs & Pricing | Villages",
    description:
      "Browse 100+ golf cart services with upfront pricing: tune-ups, battery replacement, brake service, motor repair, and custom upgrades. Nationwide. Call 1-888-502-7074.",
    canonical: `${SITE_DOMAIN}/services`,
    jsonLd: [
      organizationJsonLd(),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ]),
    ],
  });

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
    <div className="min-h-screen bg-background">
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Golf Cart <span className="text-primary">Services</span>
          </h1>
          <p className="text-xl text-secondary-foreground/80 font-medium leading-relaxed mb-8">
            From routine maintenance to complete motor rebuilds, browse our comprehensive list of over 100 golf cart services with upfront price estimates.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="search"
              placeholder="Search for a service, part, or issue..."
              className="pl-12 h-14 text-lg rounded-full border-0 shadow-lg text-foreground bg-white focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="py-8 sticky top-[68px] sm:top-[76px] z-30 bg-background/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              className="rounded-full font-bold shadow-none"
              onClick={() => setSelectedCategory(null)}
            >
              All Services
            </Button>
            {serviceCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="rounded-full font-bold shadow-none bg-muted/50 border-transparent hover:border-border"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8 border-b pb-4">
            <h2 className="text-2xl font-bold">
              {selectedCategory ? selectedCategory : "All Services"}
            </h2>
            <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {filteredServices.length} Results
            </span>
          </div>

          {filteredServices.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
              <Wrench className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground font-medium mb-6">
                We couldn't find any services matching "{searchQuery}".
              </p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory(null); }} className="font-bold">
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Don't see what you need?</h2>
          <p className="text-xl font-medium opacity-90 mb-10">
            We handle highly customized and specific repairs every day. Call our experts to discuss your cart's exact issue.
          </p>
          <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold shadow-xl" asChild>
            <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")} className="gap-2">
              <Phone className="h-5 w-5 fill-current" />
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