import { useRoute, Link } from "wouter";
import { useEffect } from "react";
import { Phone, MapPin, Navigation, Clock, ArrowLeft, ArrowRight, Wrench, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LocationSearch } from "@/components/LocationSearch";
import { serviceLocations, getLocationBySlug, getFullAddress, getDirectionsUrl, type ServiceLocation } from "@shared/locations";
import { serviceCategories } from "@shared/services";

const PHONE_NUMBER = "1-844-844-4070";
const PHONE_HREF = "tel:+18448444070";

function LocationDetail({ locationSlug }: { locationSlug: string }) {
  const location = getLocationBySlug(locationSlug);

  useEffect(() => {
    if (location) {
      document.title = `Golf Cart Service in ${location.city}, ${location.stateAbbr} | Affordable Golf Cart Service`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Professional golf cart service, repair, and maintenance at ${getFullAddress(location)}. Over 100 services available. Call ${location.phone} today!`);
      }
    }
  }, [location]);

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Location Not Found</h2>
            <p className="text-muted-foreground mb-6">The location you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/locations">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Locations
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d50000!2d${location.lng}!3d${location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus`;

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Link href="/locations" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to All Locations
            </Link>
            <Badge variant="secondary" className="mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              Service Location
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              Golf Cart Service
              <span className="text-primary block">{location.city}, {location.stateAbbr}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-2">
              {getFullAddress(location)}
            </p>
            <p className="text-base text-muted-foreground mb-6">
              Your local source for{" "}
              <Link href="/" className="text-primary hover:text-primary/80 font-medium" data-testid="link-home-anchor">
                affordable golf cart service
              </Link>{" "}
              in {location.city}, {location.stateAbbr}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild data-testid={`button-call-${location.slug}`}>
                <a href={`tel:${location.phone.replace(/-/g, '')}`} className="gap-2">
                  <Phone className="h-5 w-5" />
                  Call Now: {location.phone}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid={`button-directions-${location.slug}`}>
                <a href={getDirectionsUrl(location)} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <Navigation className="h-5 w-5" />
                  Get Directions
                </a>
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
              <p className="text-sm text-muted-foreground">Certified technicians</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Mon-Sat: 8AM-6PM</h3>
              <p className="text-sm text-muted-foreground">Business hours</p>
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
              <p className="text-sm text-muted-foreground">Full service shop</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Visit Our {location.city} Location
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Address</h3>
                    <p className="text-muted-foreground">{getFullAddress(location)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <a href={`tel:${location.phone.replace(/-/g, '')}`} className="text-primary hover:underline">
                      {location.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Hours</h3>
                    <p className="text-muted-foreground">Monday - Saturday: 8:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Services Available:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {serviceCategories.map((category) => (
                    <li key={category} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wrench className="h-4 w-4 text-primary shrink-0" />
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex gap-3">
                <Button asChild>
                  <a href={`tel:${location.phone.replace(/-/g, '')}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/services">
                    View All Services
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location & Directions
                  </h3>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${location.city}, ${location.stateAbbr} service location`}
                    className="rounded-b-lg"
                  />
                </CardContent>
              </Card>
              <div className="mt-4">
                <Button size="lg" className="w-full" variant="outline" asChild>
                  <a href={getDirectionsUrl(location)} target="_blank" rel="noopener noreferrer">
                    <Navigation className="h-5 w-5 mr-2" />
                    Get Directions to {location.city}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
              About Our {location.city} Service Center
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Our {location.city}, {location.stateAbbr} service center offers comprehensive{" "}
                <Link href="/services" className="text-primary hover:text-primary/80 font-medium" data-testid="link-services-anchor">
                  affordable golf cart services
                </Link>{" "}
                including maintenance, repair, and customization. Whether you need a routine tune-up, battery replacement, brake service, or custom upgrades, our experienced technicians are here to help.
              </p>
              <p>
                Located at {getFullAddress(location)}, we serve golf cart owners throughout the {location.city} area and surrounding communities. We work on all major golf cart brands and offer competitive pricing on parts and labor.
              </p>
              <p>
                Stop by during our business hours or give us a call at {location.phone} to schedule your service appointment. We look forward to helping you keep your golf cart running at peak performance!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Schedule Service in {location.city}?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Call now to schedule your golf cart service appointment at our {location.city} location!
          </p>
          <Button size="lg" variant="secondary" asChild data-testid={`button-cta-${location.slug}`}>
            <a href={`tel:${location.phone.replace(/-/g, '')}`} className="gap-2">
              <Phone className="h-5 w-5" />
              Call Now: {location.phone}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

function LocationsLanding() {
  useEffect(() => {
    document.title = "Service Locations | Affordable Golf Cart Service";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find an Affordable Golf Cart Service location near you. We have 14 service centers across the United States. Call 1-844-844-4070 today!');
    }
  }, []);

  const locationsByState: Record<string, ServiceLocation[]> = {};
  serviceLocations.forEach(location => {
    if (!locationsByState[location.state]) {
      locationsByState[location.state] = [];
    }
    locationsByState[location.state].push(location);
  });

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              {serviceLocations.length} Locations Nationwide
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Find a Service Location Near You
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter your address or zip code to find the closest golf cart service center.
            </p>
          </div>
          <LocationSearch variant="hero" />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            All Service Locations
          </h2>
          <div className="space-y-8">
            {Object.entries(locationsByState).sort().map(([state, locations]) => (
              <div key={state}>
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {state}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {locations.map((location) => (
                    <Card key={location.id} className="hover-elevate" data-testid={`card-location-${location.slug}`}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-foreground mb-2">{location.city}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{getFullAddress(location)}</p>
                        <a 
                          href={`tel:${location.phone.replace(/-/g, '')}`}
                          className="flex items-center gap-2 text-sm text-primary hover:underline mb-3"
                        >
                          <Phone className="h-4 w-4" />
                          {location.phone}
                        </a>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild className="flex-1">
                            <a href={getDirectionsUrl(location)} target="_blank" rel="noopener noreferrer">
                              <Navigation className="h-4 w-4 mr-1" />
                              Directions
                            </a>
                          </Button>
                          <Button size="sm" asChild className="flex-1">
                            <Link href={`/locations/${location.slug}`}>
                              Details
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Can't Find a Location Near You?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Call our main line and we'll help you find service in your area!
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-locations-footer-call">
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

export default function Locations() {
  const [, params] = useRoute("/locations/:slug");

  if (params?.slug) {
    return <LocationDetail locationSlug={params.slug} />;
  }

  return <LocationsLanding />;
}
