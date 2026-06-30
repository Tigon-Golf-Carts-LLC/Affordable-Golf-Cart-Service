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
  Settings,
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
const PAGE_URL = `${SITE_URL}/services/club-car-repair`;
const PAGE_TITLE = "Club Car Repairs Near Me | Certified Club Car Service";
const PAGE_DESCRIPTION =
  "Need Club Car repairs near you? Our certified technicians service Club Car DS, Precedent & Onward carts — diagnostics, repairs & parts at fair prices. Call 1-844-844-4070.";

const clubCarModels = [
  {
    name: "Club Car DS",
    description:
      "The classic, long-running DS platform. We repair drivetrains, solenoids, OBC chargers, and the aluminum frame components these durable carts are known for.",
  },
  {
    name: "Club Car Precedent",
    description:
      "Service for the popular Precedent line, including the IQ and Excel electric systems, ERIC starter-generator on gas models, and front-end suspension repairs.",
  },
  {
    name: "Club Car Onward",
    description:
      "Full repair support for the modern Onward, from lithium and lead-acid battery systems to lighting, accessories, and electronic speed controllers.",
  },
  {
    name: "Club Car Tempo & Villager",
    description:
      "Repairs for Tempo personal carts and Villager/Carryall utility models, covering brakes, bearings, electrical faults, and heavy-use wear items.",
  },
];

const commonProblems = [
  "Club Car won't move or has no power despite charged batteries",
  "OBC (Onboard Computer) faults preventing proper charging",
  "Solenoid clicking, sticking, or failing to engage",
  "Speed controller (IQ/Excel) errors and reduced top speed",
  "ERIC starter-generator and gas engine starting problems",
  "Worn brakes, cables, bushings, and front-end clunks",
  "Battery, charger, and corroded terminal connection issues",
  "Lighting, wiring, and accessory electrical faults",
];

const repairProcess = [
  {
    icon: Search,
    title: "1. Club Car Diagnosis",
    description:
      "We run a full diagnostic on your Club Car's electrical, drive, and charging systems to find the true fault — not just the symptom.",
  },
  {
    icon: ClipboardCheck,
    title: "2. Upfront Quote",
    description:
      "You get a clear, written estimate for Club Car parts and labor before any work begins, with honest repair-vs-replace advice.",
  },
  {
    icon: Wrench,
    title: "3. Expert Repair",
    description:
      "Our certified technicians repair your DS, Precedent, Onward, or utility cart using quality Club Car-compatible parts.",
  },
  {
    icon: ShieldCheck,
    title: "4. Test & Warranty",
    description:
      "We road-test your cart under load to confirm the fix and back every Club Car repair with a service warranty.",
  },
];

const clubCarFaqs = [
  {
    question: "How much do Club Car repairs cost?",
    answer:
      "Most Club Car repairs range from $75 to $600 depending on the issue. Diagnostics typically run $50 to $150 (often credited toward the repair), solenoid or OBC replacement runs $150 to $400, and a controller replacement can run $300 to $900. We always provide an upfront quote before any work — call 1-844-844-4070 for a free estimate.",
  },
  {
    question: "Do you repair Club Car DS, Precedent, and Onward models?",
    answer:
      "Yes. Our certified technicians service all major Club Car models, including the DS, Precedent, Onward, Tempo, and Villager/Carryall utility carts, on both electric (lead-acid and lithium) and gas powertrains.",
  },
  {
    question: "Where can I get Club Car repairs near me?",
    answer:
      "We provide Club Car repairs nationwide across all 50 states, with service centers from Florida and South Carolina to Pennsylvania, New Jersey, and beyond, plus mobile service that comes to you. Call 1-844-844-4070 to confirm availability and book a local technician.",
  },
  {
    question: "Can you fix Club Car charging and OBC problems?",
    answer:
      "Absolutely. Charging issues on Club Car carts are often caused by the Onboard Computer (OBC), the charger, or corroded connections. We diagnose the full charging circuit and repair or replace only what's actually faulty, so you don't overpay.",
  },
];

const statesServed = Array.from(
  new Set(serviceLocations.map((loc) => loc.state))
).sort();

export default function ClubCarRepair() {
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
          name: "Club Car Repair",
          serviceType: "Club Car Repair",
          description:
            "Certified Club Car repair for DS, Precedent, Onward, Tempo, and Villager/Carryall models, including electrical diagnostics, drivetrain, charging, and brake repairs.",
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
            highPrice: 900,
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
          mainEntity: clubCarFaqs.map((faq) => ({
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
    script.id = "club-car-structured-data";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("club-car-structured-data");
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
            <Badge variant="secondary" className="mb-4" data-testid="badge-clubcar-hero">
              <Settings className="h-3 w-3 mr-1" />
              Certified Club Car Specialists
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Club Car Repairs Near You
              <span className="text-primary block">Certified Technicians</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Trouble with your Club Car DS, Precedent, or Onward? Our certified technicians provide expert Club Car repairs near you — fast diagnostics, quality parts, and fair, upfront pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-clubcar-hero-call">
                <a href={PHONE_HREF} className="gap-2">
                  <Phone className="h-5 w-5" />
                  Call Now: {PHONE_NUMBER}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-clubcar-hero-services">
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
              Certified Club Car Repair Specialists
            </h2>
            <p>
              Club Car builds some of the most popular and durable golf carts on the road, but even the best-engineered cart needs expert service to stay reliable. Whether you drive a classic DS, a sleek Precedent, a modern Onward, or a hard-working Villager utility cart, our certified technicians know these machines inside and out. We diagnose and repair Club Car-specific systems — from the Onboard Computer (OBC) and IQ/Excel speed controllers to the ERIC starter-generator on gas models — so your cart gets fixed right the first time.
            </p>
            <p>
              Because Club Car carts use unique components that differ from EZGO and Yamaha, generic repairs often miss the real problem. Our diagnostic-first approach means we identify the true fault before quoting any work — saving you from paying to replace parts that were never broken. From a Club Car that won't move to charging faults, solenoid clicks, and worn brakes, we deliver honest, affordable Club Car repairs near you with a service warranty on every job.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Club Car Models We Service
            </h2>
            <p>
              Our technicians are trained on the full Club Car lineup, across both electric and gas powertrains:
            </p>
            <div className="not-prose grid gap-4 sm:grid-cols-2 my-6">
              {clubCarModels.map((model, idx) => (
                <div key={idx} className="rounded-lg border bg-card p-5" data-testid={`clubcar-model-${idx}`}>
                  <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    {model.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Common Club Car Problems We Fix
            </h2>
            <p>
              Club Car carts are tough, but certain issues come up again and again. If your cart shows any of these symptoms, our technicians can help:
            </p>
            <ul className="not-prose grid gap-3 sm:grid-cols-2 my-6">
              {commonProblems.map((problem, idx) => (
                <li key={idx} className="flex items-start gap-2" data-testid={`clubcar-problem-${idx}`}>
                  <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{problem}</span>
                </li>
              ))}
            </ul>
            <p>
              Many of these problems overlap — a Club Car that won't move could be a dead solenoid, a controller fault, an OBC issue, or simply a weak battery pack. That's why we always run a complete diagnostic before recommending repairs, so you only pay to fix what's actually wrong.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Our Club Car Repair Process
            </h2>
            <p>
              We keep Club Car repair straightforward and convenient from your first call to the final test drive:
            </p>
          </div>

          <div className="max-w-4xl mx-auto mt-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {repairProcess.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="text-center" data-testid={`clubcar-step-${idx}`}>
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
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Club Car Repair Pricing
            </h2>
            <p>
              We believe in transparent, upfront pricing on every Club Car repair. While exact costs depend on your cart's model and the specific fault, here are typical ranges: a full diagnostic runs $50 to $150 and is often credited toward the repair; solenoid replacement runs $150 to $300; OBC or charger repair runs $150 to $400; and a speed controller replacement runs $300 to $900. Routine work like brake service, battery replacement, and tune-ups is priced competitively, and you always get a written quote before we start. Call{" "}
              <a href={PHONE_HREF} className="text-primary font-medium" data-testid="link-clubcar-pricing-phone">{PHONE_NUMBER}</a>{" "}
              for a free, accurate estimate on your Club Car.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Club Car Repairs Near You
            </h2>
            <p>
              Looking for "Club Car repairs near me"? Affordable Golf Cart Service has certified technicians serving golf cart owners nationwide across all 50 states. We operate local service centers in Club Car strongholds including Florida, South Carolina, Pennsylvania, New Jersey, North Carolina, Virginia, Indiana, Ohio, and Delaware — and we offer mobile Club Car service that comes directly to your home or community. From Lecanto, FL and Orangeburg, SC to Pocono Pines, PA and the Jersey Shore, our team is ready to keep your Club Car running its best.
            </p>
            <ul className="not-prose flex flex-wrap gap-2 my-6">
              {statesServed.map((state, idx) => (
                <li key={idx} className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-foreground" data-testid={`clubcar-state-${idx}`}>
                  <MapPin className="h-4 w-4 text-primary" />
                  {state}
                </li>
              ))}
            </ul>
            <p>
              Don't see your city listed? We serve surrounding communities and offer pickup, delivery, and mobile options. Check our{" "}
              <Link href="/locations" className="text-primary font-medium" data-testid="link-clubcar-locations">service locations</Link>{" "}
              to find Club Car repair near you, or call to confirm coverage in your area.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Club Car Repair FAQs
              </h2>
              <p className="text-lg text-muted-foreground">
                Answers to the most common questions about Club Car repair, pricing, and service areas.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {clubCarFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`clubcar-faq-${idx}`} data-testid={`clubcar-faq-item-${idx}`}>
                  <AccordionTrigger className="text-left font-semibold" data-testid={`clubcar-faq-question-${idx}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`clubcar-faq-answer-${idx}`}>
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
            Need Club Car Repairs Near You?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Don't let a Club Car problem keep you parked. Call now for certified Club Car repair on DS, Precedent, Onward, and utility models at a fair price.
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-clubcar-cta-call">
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
