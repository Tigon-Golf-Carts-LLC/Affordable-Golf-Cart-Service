import { Link } from "wouter";
import { Phone, Shield, Clock, Award, Wrench, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/ServiceCard";
import { LocationSearch } from "@/components/LocationSearch";
import { services, serviceCategories, getServicesByCategory } from "@shared/services";
import { serviceLocations } from "@shared/locations";
import { usStates } from "@shared/states";
import { useEffect, useState } from "react";

const PHONE_NUMBER = "1-844-844-4070";
const PHONE_HREF = "tel:+18448444070";

const SITE_URL = "https://affordablegolfcartservice.com";
const HOME_TITLE = "Affordable Golf Cart Service | #1 Professional Golf Cart Repair & Maintenance Near You";
const HOME_DESCRIPTION = "Looking for affordable golf cart service? Expert repair, maintenance & tune-ups at prices you can afford. Call 1-844-844-4070 to book your service today!";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    document.title = HOME_TITLE;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", HOME_DESCRIPTION);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": `${SITE_URL}/#business`,
          name: "Affordable Golf Cart Service",
          description:
            "Professional golf cart repair and maintenance with over 100 affordable services including tune-ups, battery replacement, brake service, and custom upgrades.",
          url: SITE_URL,
          telephone: "+1-844-844-4070",
          image: `${SITE_URL}/logo.png`,
          logo: `${SITE_URL}/logo.png`,
          priceRange: "$$",
          serviceType: "Golf Cart Repair and Maintenance",
          areaServed: usStates.map((state) => ({
            "@type": "State",
            name: state.name,
          })),
        },
        {
          "@type": "Service",
          "@id": `${SITE_URL}/#service`,
          name: "Affordable Golf Cart Service",
          serviceType: "Golf Cart Repair and Maintenance",
          description:
            "Expert golf cart repair, maintenance, tune-ups, battery replacement, brake service, and custom upgrades at affordable prices.",
          url: SITE_URL,
          priceRange: "$$",
          provider: { "@id": `${SITE_URL}/#business` },
          areaServed: usStates.map((state) => ({
            "@type": "State",
            name: state.name,
          })),
        },
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "home-structured-data";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("home-structured-data");
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  const displayedServices = selectedCategory
    ? getServicesByCategory(selectedCategory)
    : services;

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4" data-testid="badge-hero">
              <MapPin className="h-3 w-3 mr-1" />
              {serviceLocations.length} Locations Nationwide
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Affordable Golf Cart Service
              <span className="text-primary block">Expert Repair & Maintenance Near You</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Affordable Golf Cart Service delivers professional golf cart repair and maintenance with over 100 services — tune-ups, battery replacement, brake service, and custom upgrades. With fast turnaround and {serviceLocations.length} service centers serving all 50 states, expert help is always near you.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mb-8">
            <LocationSearch variant="hero" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-hero-call">
              <a href={PHONE_HREF} className="gap-2">
                <Phone className="h-5 w-5" />
                Call Now: {PHONE_NUMBER}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-hero-services">
              <Link href="/services">
                View All Services
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,hsl(var(--primary)/0.1)_0%,transparent_50%)] pointer-events-none" />
      </section>

      <section className="py-12 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Licensed & Insured</h3>
              <p className="text-sm text-muted-foreground">Fully certified technicians</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Fast Turnaround</h3>
              <p className="text-sm text-muted-foreground">Quick service times</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Quality Guaranteed</h3>
              <p className="text-sm text-muted-foreground">Satisfaction promised</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Wrench className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">100+ Services</h3>
              <p className="text-sm text-muted-foreground">Complete cart care</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              We offer comprehensive golf cart services to meet all your needs. Browse by category or view all 100 services below.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                data-testid="filter-all"
              >
                All Services ({services.length})
              </Button>
              {serviceCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category} ({getServicesByCategory(category).length})
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {displayedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="inline-block max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-4">
                  Call us now to schedule your service appointment!
                </p>
                <Button size="lg" asChild data-testid="button-services-call">
                  <a href={PHONE_HREF} className="gap-2">
                    <Phone className="h-5 w-5" />
                    {PHONE_NUMBER}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Affordable Golf Cart Repair You Can Trust
            </h2>
            <div className="text-lg text-muted-foreground space-y-4 text-left mb-8">
              <p>
                When your cart breaks down, you shouldn't have to overpay to get it running again. Our affordable golf cart repair service combines certified, experienced technicians with honest, transparent pricing — so you always know what you're paying for before any work begins. From dead batteries and failing speed controllers to worn brakes, motor trouble, and charging problems, we diagnose the real issue and fix it right the first time.
              </p>
              <p>
                We repair both electric and gas golf carts from every major brand, and we back every job with a service warranty and satisfaction guarantee. From{" "}
                <Link href="/services/electrical-diagnostics" className="text-primary hover:text-primary/80 font-medium" data-testid="link-home-controller">
                  golf cart controller repair
                </Link>{" "}
                to batteries, brakes, and motors, getting quality golf cart repair at a price you can afford has never been easier. Explore our full list of services and typical pricing to see how much you can save.
              </p>
            </div>
            <Button size="lg" asChild data-testid="button-home-repair-services">
              <Link href="/services" className="gap-2">
                View Repair Services & Pricing
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Full-Range Golf Cart Services
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're your one-stop shop for complete{" "}
              <Link href="/services" className="text-primary hover:text-primary/80 font-medium" data-testid="link-home-golf-cart-services">
                golf cart services
              </Link>{" "}
              — from{" "}
              <Link href="/services/golf-cart-tune-up" className="text-primary hover:text-primary/80 font-medium" data-testid="link-home-maintenance">
                golf cart maintenance
              </Link>{" "}
              and tune-ups to battery, brake, motor, electrical, and charger work. Whatever your cart needs, our certified technicians handle it with transparent pricing and a satisfaction guarantee, in-shop or with mobile service that comes to you.
            </p>
            <Button size="lg" asChild data-testid="button-home-all-services">
              <Link href="/services" className="gap-2">
                Explore All Golf Cart Services
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Golf Cart Service?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Our expert technicians are ready to help. Call now to schedule your appointment and get your golf cart running like new!
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-cta-call">
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
