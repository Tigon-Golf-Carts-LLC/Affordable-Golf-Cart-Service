import { useRoute, Link } from "wouter";
import { Phone, ArrowLeft, ArrowRight, MapPin, Shield, Clock, Award, Wrench, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ServiceCard } from "@/components/ServiceCard";
import { services, serviceCategories } from "@shared/services";
import { usStates, getStateBySlug, getGoogleMapsEmbedUrl } from "@shared/states";
import { useEffect, useState } from "react";
import { SITE_DOMAIN } from "@shared/blog";
import { useSeo } from "@/lib/seo";
import { stateServiceJsonLd, breadcrumbJsonLd, organizationJsonLd } from "@/lib/jsonld";

const PHONE_NUMBER = "1-888-502-7074";
import { trackServicePhoneClick } from "@/lib/lead-analytics";
const PHONE_HREF = "tel:+18885027074";

function StateDetail({ stateSlug }: { stateSlug: string }) {
  const state = getStateBySlug(stateSlug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state]);

  useSeo({
    title: state
      ? `Golf Cart Service in ${state.name} | Villages`
      : "State Not Found | Villages Golf Cart Services",
    description: state
      ? `Professional golf cart repair and maintenance in ${state.name}. Over 100 services. Transparent pricing. Call 1-888-502-7074.`
      : "The state page you are looking for could not be found. Browse all 50 states or call 1-888-502-7074.",
    canonical: state
      ? `${SITE_DOMAIN}/states/${state.slug}`
      : `${SITE_DOMAIN}/states`,
    jsonLd: state
      ? [
          organizationJsonLd(),
          stateServiceJsonLd(state),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "States", path: "/states" },
            { name: state.name, path: `/states/${state.slug}` },
          ]),
        ]
      : undefined,
  });

  if (!state) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-3xl font-bold text-foreground">State Not Found</h2>
          <Button asChild variant="outline">
            <Link href="/states"><ArrowLeft className="h-4 w-4 mr-2" /> Back to All States</Link>
          </Button>
        </div>
      </div>
    );
  }

  const featuredServices = services.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ArrowRight className="w-3 h-3 mx-2 opacity-50" />
          <Link href="/states" className="hover:text-primary transition-colors">States</Link>
          <ArrowRight className="w-3 h-3 mx-2 opacity-50" />
          <span className="text-foreground">{state.name}</span>
        </div>
      </div>

      <section className="py-16 md:py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <Badge variant="outline" className="border-primary text-primary font-bold px-3 py-1 mb-6 bg-primary/10">
            Now Serving {state.abbreviation}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white leading-tight">
            Golf Cart Repair & Service in <span className="text-primary">{state.name}</span>
          </h1>
          <p className="text-xl text-secondary-foreground/80 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
            From routine tune-ups to major repairs, get fast, reliable, transparently-priced golf cart service anywhere in {state.name}.
          </p>
          <Button size="lg" className="h-16 px-10 text-xl font-bold shadow-xl hover:-translate-y-1 transition-all" asChild>
            <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")} className="gap-3">
              <Phone className="h-6 w-6 fill-current" />
              Call For Service: {PHONE_NUMBER}
            </a>
          </Button>
        </div>
      </section>

      <section className="py-16 bg-card border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-foreground">Certified</h3>
              <p className="text-sm text-muted-foreground font-medium">Licensed {state.abbreviation} Techs</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-foreground">Fast Dispatch</h3>
              <p className="text-sm text-muted-foreground font-medium">Quick Turnaround</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-foreground">Local Service</h3>
              <p className="text-sm text-muted-foreground font-medium">Statewide Coverage</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-foreground">All Models</h3>
              <p className="text-sm text-muted-foreground font-medium">Club Car, EZ-GO, Yamaha</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold text-foreground mb-4">
                  Expert Golf Cart Care in {state.name}
                </h2>
                <div className="w-16 h-1.5 bg-primary rounded-full mb-6"></div>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-4">
                  Whether you live in a golf course community, a retirement village, or use your cart for neighborhood commuting, keeping it running safely is critical. We connect {state.name} residents with top-tier, certified repair professionals.
                </p>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  Call us today. We'll give you a transparent price estimate over the phone and dispatch a qualified technician to solve your issue fast.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
                <h3 className="font-bold text-xl mb-4">Available {state.name} Services:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceCategories.map((category) => (
                    <div key={category} className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {category}
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="font-bold w-full sm:w-auto" asChild>
                    <Link href="/services">View All Detailed Services <ArrowRight className="w-4 h-4 ml-2" /></Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Card className="overflow-hidden shadow-xl border-border/50">
                <div className="bg-secondary text-white p-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> {state.name} Coverage Area
                  </h3>
                </div>
                <CardContent className="p-0 bg-muted/20">
                  <iframe
                    src={getGoogleMapsEmbedUrl(state)}
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Golf Cart Service Area in ${state.name}`}
                    className="w-full grayscale-[20%] contrast-125 opacity-90"
                  />
                  <div className="p-6 text-center space-y-4">
                    <p className="font-bold text-lg text-foreground">Need service right now?</p>
                    <Button className="w-full h-12 font-bold shadow-md" asChild>
                      <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")}><Phone className="w-4 h-4 mr-2"/> Call Dispatch</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground mb-4">
              Popular Repairs in {state.name}
            </h2>
            <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
              Our {state.abbreviation} technicians are highly trained in handling these frequent cart issues.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} variant="compact" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatesLanding() {
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useSeo({
    title: "Golf Cart Services by State | Nationwide Coverage",
    description:
      "Golf cart repair and maintenance in all 50 states. Find professional golf cart service near you with transparent pricing. Call 1-888-502-7074.",
    canonical: `${SITE_DOMAIN}/states`,
    jsonLd: [
      organizationJsonLd(),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "States", path: "/states" },
      ]),
    ],
  });

  const filteredStates = usStates.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.abbreviation.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-secondary text-secondary-foreground py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <Badge variant="outline" className="border-primary text-primary font-bold px-3 py-1 mb-6 bg-primary/10">
            <MapPin className="w-3 h-3 mr-1" /> All 50 States
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Nationwide Golf Cart Service
          </h1>
          <p className="text-xl text-secondary-foreground/80 font-medium leading-relaxed mb-10">
            No matter where you live, trust our network of vetted professionals for reliable, transparently-priced repairs.
          </p>
          <Button size="lg" className="h-16 px-10 text-xl font-bold shadow-xl hover:-translate-y-1 transition-all" asChild>
            <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")} className="gap-3">
              <Phone className="h-6 w-6 fill-current" />
              Call Now: {PHONE_NUMBER}
            </a>
          </Button>
        </div>
      </section>

      <section className="py-16 bg-card border-b sticky top-[68px] sm:top-[76px] z-30 shadow-sm">
        <div className="container mx-auto px-4 max-w-xl relative">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            className="pl-12 h-14 text-lg font-bold rounded-full bg-background border-border shadow-inner focus-visible:ring-primary"
            placeholder="Find your state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {filteredStates.length === 0 ? (
             <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border max-w-2xl mx-auto">
               <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-foreground mb-2">No states found</h3>
               <p className="text-muted-foreground font-medium mb-6">
                 Try a different search term.
               </p>
               <Button variant="outline" onClick={() => setSearch("")} className="font-bold">
                 Clear search
               </Button>
             </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredStates.map((state) => (
                <Link key={state.slug} href={`/states/${state.slug}`}>
                  <Card className="hover-elevate h-full transition-all duration-300 border-border/50 group cursor-pointer">
                    <CardContent className="p-6 text-center flex flex-col items-center justify-center min-h-[140px]">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                        <MapPin className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{state.name}</h3>
                      <p className="text-sm font-bold text-muted-foreground mt-1">{state.abbreviation}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
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