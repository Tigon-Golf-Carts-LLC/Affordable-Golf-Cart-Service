import { useRoute, Link } from "wouter";
import { Phone, ArrowLeft, ArrowRight, MapPin, Shield, Clock, Award, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/ServiceCard";
import { services, serviceCategories } from "@shared/services";
import { usStates, getStateBySlug, getGoogleMapsEmbedUrl } from "@shared/states";
import { useEffect } from "react";

const PHONE_NUMBER = "1-844-844-6638";
const PHONE_HREF = "tel:+18448446638";

function StateDetail({ stateSlug }: { stateSlug: string }) {
  const state = getStateBySlug(stateSlug);

  useEffect(() => {
    if (state) {
      document.title = `Affordable Golf Cart Services in ${state.name} | Golf Cart Repair & Maintenance`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Professional golf cart service, repair, and maintenance in ${state.name}. Over 100 services including tune-ups, battery replacement, brake service, and custom upgrades. Call 1-844-844-6638 today for ${state.name} golf cart service!`);
      }
    }
  }, [state]);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">State Not Found</h2>
            <p className="text-muted-foreground mb-6">The state you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/states">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All States
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const featuredServices = services.slice(0, 8);

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Link href="/states" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to All States
            </Link>
            <Badge variant="secondary" className="mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              Serving {state.name}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Affordable Golf Cart Services
              <span className="text-primary block">in {state.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional golf cart maintenance, repair, and customization services in {state.name}. Our expert technicians are ready to keep your cart running at peak performance throughout the {state.name} area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild data-testid={`button-hero-call-${state.slug}`}>
                <a href={PHONE_HREF} className="gap-2">
                  <Phone className="h-5 w-5" />
                  Call Now: {PHONE_NUMBER}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">
                  View All Services
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,hsl(var(--primary)/0.1)_0%,transparent_50%)]" />
      </section>

      <section className="py-12 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Licensed & Insured</h3>
              <p className="text-sm text-muted-foreground">Certified {state.name} technicians</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Fast Turnaround</h3>
              <p className="text-sm text-muted-foreground">Quick service in {state.abbreviation}</p>
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
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{state.name} Coverage</h3>
              <p className="text-sm text-muted-foreground">Statewide service</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Golf Cart Services in {state.name}
              </h2>
              <p className="text-muted-foreground mb-6">
                Whether you're in a golf community, retirement village, or just enjoy cruising around your {state.name} neighborhood, we provide comprehensive golf cart services to keep you moving. Our experienced technicians serve customers throughout {state.name} with professional repair, maintenance, and customization services.
              </p>
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-foreground">Our {state.name} Services Include:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {serviceCategories.map((category) => (
                    <li key={category} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wrench className="h-4 w-4 text-primary shrink-0" />
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
              <Button asChild>
                <Link href="/services">
                  View All 100+ Services
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Our {state.name} Service Area
                  </h3>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    src={getGoogleMapsEmbedUrl(state)}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Golf Cart Service Area in ${state.name}`}
                    className="rounded-b-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Popular Services in {state.name}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check out some of our most requested golf cart services available throughout {state.name}.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} variant="compact" />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">
                View All Services
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
              Why Choose Affordable Golf Cart Service in {state.name}?
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                At Affordable Golf Cart Service, we're proud to serve golf cart owners throughout {state.name}. Whether you live in a golf course community, a retirement village, or simply enjoy the convenience of a golf cart for local transportation, we're here to help keep your cart in top condition.
              </p>
              <p>
                Our {state.name} service technicians are fully trained and equipped to handle everything from routine maintenance like tune-ups and battery service to major repairs including motor replacement and electrical diagnostics. We also offer a wide range of customization options to make your golf cart uniquely yours.
              </p>
              <p>
                We understand that {state.name} residents rely on their golf carts for various purposes, from golfing to neighborhood transportation. That's why we offer both mobile service (we come to you) and convenient pickup and delivery options throughout the {state.name} area.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Golf Cart Service in {state.name}?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Call now to schedule your appointment with our {state.name} golf cart service experts!
          </p>
          <Button size="lg" variant="secondary" asChild data-testid={`button-cta-call-${state.slug}`}>
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

function StatesLanding() {
  useEffect(() => {
    document.title = "Golf Cart Services by State | Affordable Golf Cart Service";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find affordable golf cart service, repair, and maintenance in your state. We serve all 50 US states with professional golf cart services. Call 1-844-844-6638 today!');
    }
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              Nationwide Service
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Golf Cart Services by State
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Find affordable golf cart service, repair, and maintenance in your state. We serve customers across all 50 US states with professional golf cart services.
            </p>
            <Button size="lg" asChild data-testid="button-states-header-call">
              <a href={PHONE_HREF} className="gap-2">
                <Phone className="h-5 w-5" />
                Call Now: {PHONE_NUMBER}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {usStates.map((state) => (
              <Link key={state.slug} href={`/states/${state.slug}`}>
                <Card className="hover-elevate h-full transition-all duration-200" data-testid={`card-state-${state.slug}`}>
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{state.name}</h3>
                    <p className="text-xs text-muted-foreground">{state.abbreviation}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need Golf Cart Service in Your State?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            No matter where you are in the United States, our network of golf cart service professionals is ready to help!
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-states-footer-call">
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

export default function States() {
  const [, params] = useRoute("/states/:slug");

  if (params?.slug) {
    return <StateDetail stateSlug={params.slug} />;
  }

  return <StatesLanding />;
}
