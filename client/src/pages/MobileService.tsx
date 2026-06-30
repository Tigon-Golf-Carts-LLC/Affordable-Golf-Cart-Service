import { Link } from "wouter";
import {
  Phone,
  ArrowRight,
  Truck,
  Home as HomeIcon,
  CalendarCheck,
  MapPin,
  Battery,
  Disc,
  Wrench,
  Cpu,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { serviceLocations } from "@shared/locations";
import { usStates } from "@shared/states";
import { useEffect } from "react";

const PHONE_NUMBER = "1-844-844-4070";
const PHONE_HREF = "tel:+18448444070";
const SITE_URL = "https://affordablegolfcartservice.com";
const PAGE_URL = `${SITE_URL}/services/mobile-golf-cart-service`;
const PAGE_TITLE = "Mobile Golf Cart Service | On-Site Repair & Maintenance";
const PAGE_DESCRIPTION =
  "Mobile golf cart service that comes to you. On-site tune-ups, battery replacement, brake service & diagnostics at your home or community. Call 1-844-844-4070 to book!";

const included = [
  { icon: Wrench, name: "On-Site Tune-Ups", description: "Full multi-point tune-ups performed right in your driveway or community." },
  { icon: Battery, name: "Battery Replacement", description: "Battery testing, terminal cleaning, and replacement without leaving home." },
  { icon: Disc, name: "Brake Service", description: "Brake inspection, adjustment, and pad replacement on location." },
  { icon: Cpu, name: "Diagnostics & Repair", description: "Electrical, controller, and motor diagnostics with on-the-spot repairs." },
];

const howItWorks = [
  {
    icon: Phone,
    title: "1. Call & Describe",
    description: "Call us and tell us what's going on with your cart and where it's located.",
  },
  {
    icon: CalendarCheck,
    title: "2. Book a Time",
    description: "We schedule a convenient appointment window that works for you.",
  },
  {
    icon: Truck,
    title: "3. We Come to You",
    description: "Our technician arrives at your home, community, or business fully equipped.",
  },
  {
    icon: ShieldCheck,
    title: "4. Repaired On-Site",
    description: "We diagnose and repair on location, then test the cart before we leave.",
  },
];

const mobileFaqs = [
  {
    question: "How does mobile golf cart service work?",
    answer:
      "Mobile golf cart service brings our certified technicians directly to your location. You call to describe the issue, we schedule an appointment, and our fully-equipped technician comes to your home, golf community, or business to diagnose and repair your cart on-site — no need to haul it anywhere.",
  },
  {
    question: "How much does mobile golf cart service cost?",
    answer:
      "Mobile golf cart service is billed at a higher rate than in-shop service to cover travel and on-site work, but you save the time and hassle of transporting your cart. The exact cost depends on the repair and your location. Call 1-844-844-4070 for a transparent quote before we head out.",
  },
  {
    question: "What can be repaired during a mobile visit?",
    answer:
      "Most common services can be done on-site, including tune-ups, battery testing and replacement, brake service, charger and electrical diagnostics, and many controller and motor repairs. For major rebuilds that need shop equipment, we also offer pickup and delivery.",
  },
  {
    question: "What areas do you serve for mobile golf cart service?",
    answer:
      `We offer mobile golf cart service across all 50 states, with technicians serving ${serviceLocations.length} locations and the surrounding communities. Call us to confirm mobile availability in your area.`,
  },
];

export default function MobileService() {
  useEffect(() => {
    document.title = PAGE_TITLE;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", PAGE_DESCRIPTION);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "@id": `${PAGE_URL}#service`,
          name: "Mobile Golf Cart Service",
          serviceType: "Mobile Golf Cart Repair",
          description:
            "On-site mobile golf cart service including tune-ups, battery replacement, brake service, and diagnostics performed at your home, community, or business.",
          url: PAGE_URL,
          areaServed: usStates.map((state) => ({
            "@type": "State",
            name: state.name,
          })),
          availableChannel: {
            "@type": "ServiceChannel",
            name: "On-Site Mobile Service",
            serviceLocation: {
              "@type": "Place",
              name: "Customer's location (home, community, or business)",
            },
          },
          provider: {
            "@type": "LocalBusiness",
            name: "Affordable Golf Cart Service",
            telephone: "+1-844-844-4070",
            url: SITE_URL,
            priceRange: "$$",
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: mobileFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "mobile-structured-data";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("mobile-structured-data");
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4" data-testid="badge-mobile-hero">
              <Truck className="h-3 w-3 mr-1" />
              On-Site Service Nationwide
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Mobile Golf Cart Service
              <span className="text-primary block">We Come to You</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Skip the hassle of hauling your cart to a shop. Our mobile golf cart service brings certified technicians directly to your home, golf community, or business for on-site tune-ups, battery replacement, brake service, and diagnostics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-mobile-hero-call">
                <a href={PHONE_HREF} className="gap-2">
                  <Phone className="h-5 w-5" />
                  Book Mobile Service: {PHONE_NUMBER}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-mobile-hero-services">
                <Link href="/services">
                  View All Services
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg max-w-none text-muted-foreground">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              How Mobile Golf Cart Service Works
            </h2>
            <p>
              Getting your golf cart repaired shouldn't mean renting a trailer, finding a way to load a cart that may not even run, and driving it across town to a shop. Our mobile golf cart service eliminates all of that. We bring the shop to you. Whether you're in a gated golf community, at home, on a farm, or running a resort or business that relies on a fleet of carts, our certified technicians arrive in fully-stocked service vehicles ready to diagnose and repair your cart right where it sits.
            </p>
            <p>
              The process is simple and transparent. You give us a call and describe the problem and your location. We schedule a convenient appointment window, and a technician comes out with the tools, diagnostic equipment, and common parts needed to handle most repairs on the first visit. We diagnose the real issue, give you an upfront quote before doing any work, complete the repair on-site, and test the cart before we leave. For complex rebuilds that genuinely require shop equipment, we also offer pickup and delivery so you're still never stuck transporting the cart yourself.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mt-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="text-center" data-testid={`mobile-step-${idx}`}>
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What's Included in Mobile Service
            </h2>
            <p className="text-lg text-muted-foreground">
              Most of our most-requested services can be performed right at your location.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2">
            {included.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx} data-testid={`card-included-${idx}`}>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg max-w-none text-muted-foreground">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Service Areas
            </h2>
            <p>
              We provide mobile golf cart service across all 50 states, with technicians based at{" "}
              {serviceLocations.length} locations and serving the surrounding communities. From retirement and golf communities to resorts, campgrounds, farms, and private residences, if you have a golf cart that needs attention, we can come to you. Not sure if we cover your neighborhood? Just call{" "}
              <a href={PHONE_HREF} className="text-primary font-medium" data-testid="link-mobile-phone-area">{PHONE_NUMBER}</a>{" "}
              and we'll confirm mobile availability in your area and book a visit.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Booking & Pricing
            </h2>
            <p>
              Booking mobile golf cart service is easy — there's no online form to wrestle with. Simply call us, describe your cart and the issue, and we'll schedule a convenient appointment. Because mobile service includes travel and on-site labor, it's billed at a higher rate than dropping your cart at the shop, but for most owners the convenience and saved time are well worth it — especially when you'd otherwise need to rent a trailer or arrange transport. As always, you'll get a clear, upfront quote before any work begins, with no hidden fees, and every repair is backed by our service warranty.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <HomeIcon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">At Your Location</h3>
              <p className="text-sm text-muted-foreground">Home, community, or business</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Save Time</h3>
              <p className="text-sm text-muted-foreground">No hauling or trailer rental</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Nationwide</h3>
              <p className="text-sm text-muted-foreground">All 50 states covered</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Mobile Golf Cart Service FAQs
              </h2>
              <p className="text-lg text-muted-foreground">
                Common questions about our on-site mobile golf cart service.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {mobileFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`mobile-faq-${idx}`} data-testid={`mobile-faq-item-${idx}`}>
                  <AccordionTrigger className="text-left font-semibold" data-testid={`mobile-faq-question-${idx}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`mobile-faq-answer-${idx}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Service That Comes to You?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Book mobile golf cart service today and let our technicians handle the repair right at your door.
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-mobile-cta-call">
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
