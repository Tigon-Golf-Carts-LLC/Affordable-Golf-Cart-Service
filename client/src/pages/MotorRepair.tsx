import { Link } from "wouter";
import {
  Phone,
  ArrowRight,
  Wrench,
  Search,
  ClipboardCheck,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  AlertTriangle,
  Cog,
  Zap,
  Flame,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";
import { serviceLocations } from "@shared/locations";

const PHONE_NUMBER = "1-844-844-4070";
const PHONE_HREF = "tel:+18448444070";
const SITE_URL = "https://affordablegolfcartservice.com";
const PAGE_URL = `${SITE_URL}/services/motor-repair`;
const PAGE_TITLE = "Golf Cart Engine Repair Near Me | Motor Repair Experts";
const PAGE_DESCRIPTION =
  "Golf cart engine trouble? Our certified mechanics provide expert golf cart engine repair near you — fast diagnostics, same-week service, and fair pricing. Call 1-844-844-4070.";

const symptoms = [
  "No power or the cart won't move despite a charged battery or full tank",
  "Motor or engine overheating during normal driving",
  "Unusual sounds — grinding, whining, knocking, or clicking",
  "Loss of top speed, sluggish acceleration, or power loss on hills",
  "Burning smell or excessive heat near the motor or engine",
  "Hard starting, stalling, or rough idle on gas-powered carts",
  "Vibration, surging, or jerking under load",
  "Smoke from the engine bay or motor housing",
];

const diagnosticProcess = [
  {
    icon: Search,
    title: "1. Full Inspection",
    description:
      "We test the motor or engine along with the controller, batteries, fuel, and ignition systems to isolate the true cause of the failure.",
  },
  {
    icon: ClipboardCheck,
    title: "2. Upfront Estimate",
    description:
      "You get a clear, written quote for parts and labor before any work starts, plus honest advice on repair vs. rebuild vs. replacement.",
  },
  {
    icon: Wrench,
    title: "3. Repair or Rebuild",
    description:
      "Our certified mechanics repair, rebuild, or replace your electric motor or gas engine using quality OEM or aftermarket parts.",
  },
  {
    icon: ShieldCheck,
    title: "4. Test & Warranty",
    description:
      "We road-test the cart under load to confirm smooth power delivery, then back the work with a service warranty.",
  },
];

const motorFaqs = [
  {
    question: "How much does golf cart engine repair cost?",
    answer:
      "Golf cart engine and motor repair typically ranges from $150 to $1,600 depending on the cart and the work needed. Motor repair or rebuild generally runs $400 to $1,000, a full electric motor replacement runs $500 to $1,600, and gas engine repairs vary by part. Diagnostics usually cost $50 to $150 and are often credited toward the repair. Call 1-844-844-4070 for a free, accurate quote.",
  },
  {
    question: "Do you repair both electric motors and gas engines?",
    answer:
      "Yes. Our certified mechanics service both electric drive motors and gas engines on all major golf cart brands, including EZGO, Club Car, and Yamaha. Whether you need an electric motor rebuild, a controller-related repair, or gas engine work like a carburetor, ignition, or compression repair, we can help.",
  },
  {
    question: "How long does golf cart engine repair take?",
    answer:
      "Many golf cart engine and motor repairs are completed within the same week, and minor jobs are often done the same day. A full motor rebuild or engine overhaul that requires ordered parts may take a few business days. We give you a realistic timeline with your estimate and offer mobile and pickup options to minimize downtime.",
  },
  {
    question: "Where can I get golf cart engine repair near me?",
    answer:
      "We provide golf cart engine repair nationwide across all 50 states, with local service centers in Florida, South Carolina, Pennsylvania, New Jersey, North Carolina, and beyond, plus mobile mechanics who come to you. Call 1-844-844-4070 to confirm availability and book a local technician.",
  },
];

const statesServed = Array.from(
  new Set(serviceLocations.map((loc) => loc.state))
).sort();

export default function MotorRepair() {
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
          name: "Golf Cart Engine & Motor Repair",
          serviceType: "Golf Cart Engine Repair",
          description:
            "Expert golf cart engine and motor repair for electric and gas carts, including motor repair, rebuild, replacement, and gas engine service.",
          url: PAGE_URL,
          areaServed: serviceLocations.map((loc) => ({
            "@type": "City",
            name: `${loc.city}, ${loc.stateAbbr}`,
            geo: {
              "@type": "GeoCoordinates",
              latitude: loc.lat,
              longitude: loc.lng,
            },
          })),
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: 50,
            highPrice: 1600,
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
          "@type": "LocalBusiness",
          "@id": `${PAGE_URL}#business`,
          name: "Affordable Golf Cart Service",
          telephone: "+1-844-844-4070",
          url: SITE_URL,
          priceRange: "$$",
          areaServed: statesServed.map((state) => ({
            "@type": "State",
            name: state,
          })),
          location: serviceLocations.map((loc) => ({
            "@type": "Place",
            name: `${loc.city}, ${loc.stateAbbr}`,
            address: {
              "@type": "PostalAddress",
              streetAddress: loc.address,
              addressLocality: loc.city,
              addressRegion: loc.stateAbbr,
              postalCode: loc.zip,
              addressCountry: "US",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: loc.lat,
              longitude: loc.lng,
            },
          })),
        },
        {
          "@type": "FAQPage",
          mainEntity: motorFaqs.map((faq) => ({
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
    script.id = "motor-structured-data";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("motor-structured-data");
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
            <Badge variant="secondary" className="mb-4" data-testid="badge-motor-hero">
              <Cog className="h-3 w-3 mr-1" />
              Engine & Motor Repair Experts
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Golf Cart Engine Repair Near You
              <span className="text-primary block">Expert Motor Service</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Lost power, overheating, or strange sounds from your cart? Our certified mechanics provide expert golf cart engine repair near you — for both electric motors and gas engines — with fast diagnostics and fair pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-motor-hero-call">
                <a href={PHONE_HREF} className="gap-2">
                  <Phone className="h-5 w-5" />
                  Call Now: {PHONE_NUMBER}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-motor-hero-services">
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
              Expert Golf Cart Engine & Motor Repair
            </h2>
            <p>
              The motor or engine is the heart of your golf cart, and when it starts to fail, your cart loses the power and reliability you depend on. Our certified mechanics specialize in golf cart engine repair near you, diagnosing and fixing both electric drive motors and gas engines across every major brand, including EZGO, Club Car, and Yamaha. Whether your cart has lost power, overheats, makes unusual sounds, or simply won't move, we find the real cause fast and get you back on the road — often with same-week service.
            </p>
            <p>
              Because golf cart power problems can come from the motor, the controller, the batteries, the fuel system, or the wiring, a generic "replace the motor" approach often wastes your money. Our diagnostic-first process pinpoints the true fault before any work begins, so you only pay to fix what's actually broken. From a quick repair to a full motor rebuild or engine overhaul, every job is backed by transparent, upfront pricing and a service warranty.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Electric Motor vs. Gas Engine Repair
            </h2>
            <div className="not-prose grid gap-4 sm:grid-cols-2 my-6">
              <div className="rounded-lg border bg-card p-5" data-testid="motor-type-electric">
                <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary shrink-0" />
                  Electric Motor Repair
                </h3>
                <p className="text-sm text-muted-foreground">
                  We service worn brushes, bearings, windings, and overheating issues on electric drive motors, and we repair or rebuild motors that have lost torque or top speed. We also test the controller, solenoid, and wiring, since these often cause symptoms that mimic a bad motor.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-5" data-testid="motor-type-gas">
                <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary shrink-0" />
                  Gas Engine Repair
                </h3>
                <p className="text-sm text-muted-foreground">
                  For gas-powered carts, we handle carburetor cleaning and rebuilds, ignition and spark issues, fuel system repairs, valve and compression problems, starter-generator service, and full engine rebuilds to restore smooth, reliable power.
                </p>
              </div>
            </div>
            <p>
              Not sure whether you have an electric or gas powertrain problem? That's exactly what our diagnostic visit is for. We identify the system at fault and recommend the most cost-effective path — repair, rebuild, or replacement — based on your cart's age, condition, and how you use it.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Common Engine & Motor Symptoms
            </h2>
            <p>
              If your golf cart shows any of these warning signs, it's worth having the motor or engine inspected before a small issue becomes an expensive breakdown:
            </p>
            <ul className="not-prose grid gap-3 sm:grid-cols-2 my-6">
              {symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2" data-testid={`motor-symptom-${idx}`}>
                  <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{symptom}</span>
                </li>
              ))}
            </ul>
            <p>
              These symptoms can overlap with battery, controller, and fuel problems, which is why a complete diagnostic is the smartest first step. Our mechanics use professional tools to test each part of the system, so the repair targets the real cause.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Our Diagnostic & Repair Process
            </h2>
            <p>
              We keep golf cart engine repair straightforward, honest, and convenient from your first call to the final test drive:
            </p>
          </div>

          <div className="max-w-4xl mx-auto mt-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {diagnosticProcess.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="text-center" data-testid={`motor-step-${idx}`}>
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
          <div className="max-w-3xl mx-auto prose prose-lg max-w-none text-muted-foreground">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-7 w-7 text-primary" />
              Repair Timeline & Pricing
            </h2>
            <p>
              We know a cart that won't run is a major inconvenience, so we work fast. Minor motor and engine repairs are often completed the same day, and most jobs are finished within the same week. A full motor rebuild or gas engine overhaul that requires ordered parts may take a few business days — and we'll always give you a realistic timeline with your written estimate. To minimize downtime, we offer mobile service and pickup-and-delivery options in many areas.
            </p>
            <p>
              Pricing is always transparent and upfront. Diagnostics typically run $50 to $150 and are often credited toward the repair. Motor repair or rebuild generally runs $400 to $1,000, while a full electric motor replacement runs $500 to $1,600 depending on your cart's make and motor type. Gas engine repairs vary by the specific part and labor involved. You'll get a clear quote before any work begins — call{" "}
              <a href={PHONE_HREF} className="text-primary font-medium" data-testid="link-motor-pricing-phone">{PHONE_NUMBER}</a>{" "}
              for a free estimate.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Golf Cart Engine Repair Near You
            </h2>
            <p>
              Searching for "golf cart engine repair near me"? Affordable Golf Cart Service has certified mechanics serving golf cart owners nationwide across all 50 states. We operate local service centers in golf cart hotspots including Florida, South Carolina, Pennsylvania, New Jersey, North Carolina, Virginia, Indiana, Ohio, and Delaware — and we offer mobile engine and motor service that comes directly to your home or community. From Lecanto, FL and Orangeburg, SC to Pocono Pines, PA and the Jersey Shore, our team is ready to restore your cart's power.
            </p>
            <ul className="not-prose flex flex-wrap gap-2 my-6">
              {statesServed.map((state, idx) => (
                <li key={idx} className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-foreground" data-testid={`motor-state-${idx}`}>
                  <MapPin className="h-4 w-4 text-primary" />
                  {state}
                </li>
              ))}
            </ul>
            <p>
              Don't see your city? We serve surrounding communities and offer pickup, delivery, and mobile options. Check our{" "}
              <Link href="/locations" className="text-primary font-medium" data-testid="link-motor-locations">service locations</Link>{" "}
              to find golf cart engine repair near you, or call to confirm coverage in your area.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Golf Cart Engine Repair FAQs
              </h2>
              <p className="text-lg text-muted-foreground">
                Answers to the most common questions about golf cart engine repair, pricing, and service areas.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {motorFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`motor-faq-${idx}`} data-testid={`motor-faq-item-${idx}`}>
                  <AccordionTrigger className="text-left font-semibold" data-testid={`motor-faq-question-${idx}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`motor-faq-answer-${idx}`}>
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
            Need Golf Cart Engine Repair Near You?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Don't let a failing motor or engine keep your cart parked. Call now for expert golf cart engine repair — electric or gas — at a fair price.
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-motor-cta-call">
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
