import { Link } from "wouter";
import {
  Phone,
  ArrowRight,
  Wrench,
  Search,
  ClipboardCheck,
  ShieldCheck,
  MapPin,
  AlertTriangle,
  Gauge,
  Clock,
  DollarSign,
  Ruler,
  CheckCircle2,
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
import { serviceLocations } from "@/lib/data";
import { PHONE_NUMBER, PHONE_HREF, SITE_URL } from "@/lib/site";
import { STATIC_PAGE_SEO } from "@shared/seo";

const { title: PAGE_TITLE, description: PAGE_DESCRIPTION } = STATIC_PAGE_SEO["/services/golf-cart-alignment"];

const PAGE_URL = `${SITE_URL}/services/golf-cart-alignment`;

const symptoms = [
  "The cart pulls or drifts to one side when you let go of the wheel",
  "Uneven or rapid tire wear, with one edge wearing faster than the other",
  "A steering wheel that sits off-center while driving straight",
  "Vibration or wandering at higher speeds",
  "The cart feels loose, twitchy, or hard to keep in a straight line",
  "Squealing tires when cornering at low speed",
];

const alignmentSteps = [
  {
    icon: Search,
    title: "1. Inspection & Test Drive",
    description:
      "We test-drive the cart and inspect the tires, steering linkage, tie rods, bushings, and front-end components to confirm the problem is alignment and not a worn or bent part.",
  },
  {
    icon: Ruler,
    title: "2. Measure Toe & Camber",
    description:
      "Using alignment gauges, we measure toe (how the front wheels point in or out) and camber against the manufacturer's specification for your cart's make and model.",
  },
  {
    icon: Wrench,
    title: "3. Adjust the Tie Rods",
    description:
      "We loosen the tie-rod jam nuts and adjust the rod length in small increments to bring toe back to spec, correcting the steering pull and centering the wheel.",
  },
  {
    icon: ClipboardCheck,
    title: "4. Re-measure & Verify",
    description:
      "We re-measure after each adjustment, tighten the jam nuts, set tire pressures evenly, and confirm every reading is within spec before final road-testing.",
  },
  {
    icon: ShieldCheck,
    title: "5. Final Test Drive",
    description:
      "A final test drive confirms the cart tracks straight, the wheel is centered, and the pull is gone — then we back the work with our service warranty.",
  },
];

const costFactors = [
  {
    title: "Toe-Only Adjustment",
    price: "$50 – $80",
    description:
      "A straightforward front-end toe adjustment on a cart with healthy steering components. This is the most common alignment job and the quickest to complete.",
  },
  {
    title: "Full Front-End Alignment",
    price: "$80 – $150",
    description:
      "A complete alignment that sets toe and camber, plus a thorough inspection of tie rods, bushings, and steering linkage to make sure the correction holds.",
  },
  {
    title: "Alignment With Minor Repairs",
    price: "$150+",
    description:
      "When worn tie-rod ends, bushings, or bent components are found, those parts must be replaced before alignment. Cost depends on the parts your cart needs.",
  },
];

const alignmentFaqs = [
  {
    question: "How much does golf cart alignment cost?",
    answer:
      "Golf cart alignment typically costs between $50 and $150. A simple front-end toe adjustment usually runs $50 to $80, while a full alignment that sets toe and camber and inspects the steering components runs $80 to $150. If worn tie-rod ends, bushings, or bent parts are found, those repairs add to the cost. Call 1-844-844-4070 for a free, accurate quote.",
  },
  {
    question: "How do I know if my golf cart needs alignment?",
    answer:
      "The most common signs are a cart that pulls or drifts to one side, a steering wheel that sits off-center while driving straight, uneven or rapid tire wear, vibration or wandering at speed, and squealing tires when cornering slowly. If you notice any of these, an alignment check is worthwhile before the tires wear out prematurely.",
  },
  {
    question: "How long does golf cart alignment take?",
    answer:
      "Most golf cart alignments are completed in about 30 to 60 minutes. A simple toe adjustment is often done the same day while you wait, and a full alignment with a front-end inspection still typically finishes within an hour. If worn parts need to be replaced first, it may take a little longer depending on parts availability.",
  },
  {
    question: "How often should I align my golf cart?",
    answer:
      "We recommend checking your golf cart's alignment once a year, and any time you replace tires, install a lift kit, hit a curb or pothole hard, or notice pulling or uneven tire wear. Carts driven on rough terrain or used heavily benefit from more frequent checks to protect the tires and steering.",
  },
];

const statesServed = Array.from(
  new Set(serviceLocations.map((loc) => loc.state))
).sort();

export default function GolfCartAlignment() {
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
          name: "Golf Cart Wheel Alignment",
          serviceType: "Golf Cart Alignment",
          description:
            "Professional golf cart wheel alignment service — toe and camber adjustment to correct pulling, uneven tire wear, and off-center steering.",
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
            highPrice: 150,
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
          mainEntity: alignmentFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
        {
          "@type": "HowTo",
          name: "How to Align a Golf Cart",
          description:
            "The step-by-step process certified technicians use to align a golf cart's front wheels and correct steering pull and uneven tire wear.",
          totalTime: "PT45M",
          estimatedCost: {
            "@type": "MonetaryAmount",
            currency: "USD",
            value: "50-150",
          },
          step: alignmentSteps.map((step, idx) => ({
            "@type": "HowToStep",
            position: idx + 1,
            name: step.title.replace(/^\d+\.\s*/, ""),
            text: step.description,
          })),
        },
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "alignment-structured-data";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("alignment-structured-data");
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
            <Badge variant="secondary" className="mb-4" data-testid="badge-alignment-hero">
              <Gauge className="h-3 w-3 mr-1" />
              Wheel Alignment Experts
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Golf Cart Alignment Service & Cost Guide
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Is your cart pulling to one side or wearing tires unevenly? Our certified technicians provide professional golf cart wheel alignment — typically $50 to $150 — to keep your cart tracking straight and your tires lasting longer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-alignment-hero-call">
                <a href={PHONE_HREF} className="gap-2">
                  <Phone className="h-5 w-5" />
                  Call Now: {PHONE_NUMBER}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-alignment-hero-services">
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
              What Is Golf Cart Alignment?
            </h2>
            <p>
              Golf cart alignment is the process of adjusting the angles of your cart's front wheels so they point in the correct direction relative to each other and the road. The two angles that matter most on a golf cart are <strong>toe</strong> — whether the front of the wheels point inward or outward — and <strong>camber</strong>, the inward or outward tilt of the wheels when viewed from the front. When these angles drift out of the manufacturer's specification, your cart no longer tracks straight, the steering pulls, and your tires wear out far faster than they should.
            </p>
            <p>
              Misalignment usually happens gradually. Hitting curbs and potholes, driving on rough terrain, installing a lift kit or new tires, and normal wear in the tie rods and bushings all nudge the front end out of alignment over time. The good news is that a proper alignment is a quick, affordable fix that restores safe, predictable handling and protects the much more expensive tires from premature wear.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Signs Your Golf Cart Needs an Alignment
            </h2>
            <p>
              Most alignment problems show up first in how the cart drives and how the tires wear. Watch for these common warning signs:
            </p>
            <ul className="not-prose grid gap-3 sm:grid-cols-2 my-6">
              {symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2" data-testid={`alignment-symptom-${idx}`}>
                  <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{symptom}</span>
                </li>
              ))}
            </ul>
            <p>
              If you notice any of these, it's worth having the alignment checked promptly. Driving a misaligned cart even a few weeks can scrub thousands of miles of life off a set of tires — making the alignment pay for itself.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              The Golf Cart Alignment Process
            </h2>
            <p>
              Aligning a golf cart is precise work, but our process keeps it fast and straightforward. Here's exactly how our certified technicians align your cart:
            </p>
          </div>

          <div className="max-w-4xl mx-auto mt-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {alignmentSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="text-center" data-testid={`alignment-step-${idx}`}>
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 text-sm">{step.title}</h3>
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
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="h-7 w-7 text-primary" />
                Golf Cart Alignment Cost
              </h2>
              <p>
                Golf cart alignment typically costs between <strong>$50 and $150</strong>. The exact price depends on the type of adjustment your cart needs and whether any worn steering parts have to be replaced first. Here's how the cost breaks down:
              </p>
            </div>
            <div className="not-prose grid gap-4 sm:grid-cols-3 my-8">
              {costFactors.map((factor, idx) => (
                <div key={idx} className="rounded-lg border bg-background p-5" data-testid={`alignment-cost-${idx}`}>
                  <h3 className="font-bold text-foreground mb-1">{factor.title}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">{factor.price}</p>
                  <p className="text-sm text-muted-foreground">{factor.description}</p>
                </div>
              ))}
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Every quote is transparent and upfront — you'll know the price before any work begins, with no hidden fees. Because a misaligned cart wears tires unevenly, paying $50 to $150 for an alignment is almost always cheaper than replacing a prematurely worn set of tires. Call{" "}
                <a href={PHONE_HREF} className="text-primary font-medium" data-testid="link-alignment-cost-phone">{PHONE_NUMBER}</a>{" "}
                for a free estimate on your cart.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
                How Often Should You Align a Golf Cart?
              </h2>
              <p>
                As a rule of thumb, have your golf cart's alignment checked <strong>once a year</strong> and any time you replace the tires or install a lift kit. You should also get it checked after any hard impact — hitting a curb, pothole, or rock can knock the front end out of spec instantly. Carts driven on rough or uneven terrain, or used heavily for work or community transportation, benefit from more frequent checks. A quick alignment check during your annual tune-up is the easiest way to catch a problem before it ruins a set of tires.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg max-w-none text-muted-foreground">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Golf Cart Alignment Near You
            </h2>
            <p>
              Affordable Golf Cart Service provides professional wheel alignment nationwide across all 50 states, with local service centers in golf cart hotspots and mobile technicians who come to you. From routine toe adjustments to full front-end alignments, our certified technicians keep your cart driving straight wherever you are.
            </p>
            <ul className="not-prose flex flex-wrap gap-2 my-6">
              {statesServed.map((state, idx) => (
                <li key={idx} className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-foreground" data-testid={`alignment-state-${idx}`}>
                  <MapPin className="h-4 w-4 text-primary" />
                  {state}
                </li>
              ))}
            </ul>
            <p>
              Don't see your city? We serve surrounding communities and offer pickup, delivery, and mobile options. Check our{" "}
              <Link href="/locations" className="text-primary font-medium" data-testid="link-alignment-locations">service locations</Link>{" "}
              to find golf cart alignment near you, or call to confirm coverage in your area.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Golf Cart Alignment FAQs
              </h2>
              <p className="text-lg text-muted-foreground">
                Answers to the most common questions about golf cart alignment cost, signs, and service.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {alignmentFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`alignment-faq-${idx}`} data-testid={`alignment-faq-item-${idx}`}>
                  <AccordionTrigger className="text-left font-semibold" data-testid={`alignment-faq-question-${idx}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`alignment-faq-answer-${idx}`}>
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
            Need a Golf Cart Alignment?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Stop the pulling and uneven tire wear. Call now for a fast, affordable golf cart wheel alignment — typically $50 to $150 — backed by our service warranty.
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-alignment-cta-call">
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
