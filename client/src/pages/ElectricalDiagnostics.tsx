import { Link } from "wouter";
import {
  Phone,
  ArrowRight,
  Cpu,
  AlertTriangle,
  Wrench,
  Search,
  ClipboardCheck,
  ShieldCheck,
  Gauge,
  Zap,
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
import { useEffect } from "react";

const PHONE_NUMBER = "1-844-844-4070";
const PHONE_HREF = "tel:+18448444070";
const SITE_URL = "https://affordablegolfcartservice.com";
const PAGE_URL = `${SITE_URL}/services/electrical-diagnostics`;
const PAGE_TITLE = "Golf Cart Controller Repair & Electrical Diagnostics";
const PAGE_DESCRIPTION =
  "Is your golf cart not responding? Our certified techs specialize in golf cart controller repair and electrical diagnostics. Fast service, fair prices. Call 1-844-844-4070.";

const symptoms = [
  "Cart hesitates, surges, or jerks when you press the pedal",
  "Sudden loss of power or the cart cuts out while driving",
  "Reduced top speed or weak acceleration",
  "Cart won't move at all even with charged batteries",
  "Blinking diagnostic or error codes on the controller",
  "A burning smell or excessive heat near the controller",
];

const repairProcess = [
  {
    icon: Search,
    title: "1. Full Diagnostic Scan",
    description:
      "We connect diagnostic equipment, read controller error codes, and test the throttle, solenoid, and wiring to pinpoint the true fault.",
  },
  {
    icon: ClipboardCheck,
    title: "2. Transparent Quote",
    description:
      "You get a clear, upfront quote for parts and labor before any work begins — and honest advice on repair vs. replacement.",
  },
  {
    icon: Wrench,
    title: "3. Repair or Replace",
    description:
      "We repair, reprogram, or replace the controller using quality parts, then resolve any related wiring or solenoid issues.",
  },
  {
    icon: ShieldCheck,
    title: "4. Test & Warranty",
    description:
      "We road-test the cart under load to confirm smooth throttle response, and back the work with a service warranty.",
  },
];

const controllerFaqs = [
  {
    question: "How do I know if my golf cart controller is bad?",
    answer:
      "Common signs of a bad golf cart controller include jerky or surging acceleration, sudden power cut-outs, reduced top speed, blinking error codes, or a cart that won't move despite charged batteries and a working solenoid. A burning smell or excess heat near the controller is another warning sign. Because these symptoms overlap with battery, solenoid, and throttle problems, a professional diagnostic scan is the most reliable way to confirm a faulty controller.",
  },
  {
    question: "How much does golf cart controller repair cost?",
    answer:
      "Golf cart controller repair typically costs $150 to $700 depending on whether the controller can be repaired and reprogrammed or needs full replacement. A new controller plus installation generally runs $300 to $1,000. Diagnostics usually cost $50 to $150 and are often credited toward the repair. Call 1-844-844-4070 for a free, accurate quote.",
  },
  {
    question: "Can a golf cart controller be repaired or does it need replacement?",
    answer:
      "It depends on the failure. Some controller issues — loose connections, programming faults, or minor component failures — can be repaired or reprogrammed at a lower cost. If the controller has internal damage from a power surge, water, or burned-out components, replacement is the safer, more reliable option. Our technicians always diagnose first and recommend the most cost-effective path for your cart.",
  },
];

export default function ElectricalDiagnostics() {
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
          name: "Golf Cart Controller Repair & Electrical Diagnostics",
          serviceType: "Golf Cart Controller Repair",
          description:
            "Professional golf cart controller repair and electrical diagnostics for electric and gas carts, including controller repair, reprogramming, and replacement.",
          url: PAGE_URL,
          areaServed: { "@type": "Country", name: "United States" },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: 50,
            highPrice: 1000,
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
          mainEntity: controllerFaqs.map((faq) => ({
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
    script.id = "controller-structured-data";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("controller-structured-data");
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
            <Badge variant="secondary" className="mb-4" data-testid="badge-controller-hero">
              <Cpu className="h-3 w-3 mr-1" />
              Controller & Electrical Experts
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Golf Cart Controller Repair
              <span className="text-primary block">& Electrical Diagnostics</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Is your golf cart not responding, surging, or cutting out? Our certified technicians specialize in golf cart controller repair and electrical diagnostics — diagnosing the real fault fast and fixing it at a fair price.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-controller-hero-call">
                <a href={PHONE_HREF} className="gap-2">
                  <Phone className="h-5 w-5" />
                  Call Now: {PHONE_NUMBER}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-controller-hero-services">
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
              What Is a Golf Cart Controller?
            </h2>
            <p>
              The controller is the brain of your golf cart's drive system. Every time you press the accelerator, the throttle sends a signal to the controller, which then regulates exactly how much power flows from the batteries to the motor. This is what gives you smooth, gradual acceleration instead of an abrupt jolt. On an electric cart, the controller manages voltage and current to the motor; on a gas cart with electric components, related modules manage starting and charging functions. Without a working controller, your cart either won't move at all or behaves erratically — surging, hesitating, or cutting out without warning.
            </p>
            <p>
              Modern golf cart controllers are sophisticated electronic units, often programmable to set speed limits, acceleration curves, and safety features. Because they sit at the center of the electrical system, a controller problem can look like a battery, solenoid, or motor issue — and vice versa. That's exactly why proper electrical diagnostics matter so much. Replacing a controller when the real culprit is a corroded cable or a weak solenoid is an expensive mistake, and our diagnostic-first approach is designed to prevent it.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Signs Your Controller Needs Repair
            </h2>
            <p>
              Controller faults usually show up in how your cart drives. If you notice any of the following symptoms, it's worth having your golf cart controller and electrical system inspected before the problem leaves you stranded:
            </p>
            <ul className="not-prose grid gap-3 sm:grid-cols-2 my-6">
              {symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2" data-testid={`symptom-${idx}`}>
                  <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{symptom}</span>
                </li>
              ))}
            </ul>
            <p>
              These symptoms can also point to throttle sensors, solenoids, wiring, or batteries, which is why a full electrical diagnostic is the smartest first step. Our technicians use professional diagnostic tools to read controller error codes and test each part of the circuit, so you only pay to fix what's actually broken.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Controller Repair vs. Replacement
            </h2>
            <p>
              One of the most common questions we hear is whether a golf cart controller can be repaired or whether it needs to be replaced entirely. The honest answer is: it depends on the type of failure. When the problem is a loose or corroded connection, a programming or calibration fault, or a single failed component, repair and reprogramming is often possible — and it's the more affordable choice, typically running $150 to $700. We can frequently restore proper throttle response without the cost of a brand-new unit.
            </p>
            <p>
              However, when a controller has suffered internal damage — from a power surge, water intrusion, or burned-out electronics — replacement is the safer, more reliable path. A new controller plus professional installation generally costs $300 to $1,000 depending on your cart's make, model, and the controller's amperage rating. While replacement costs more upfront, it restores full performance and comes with manufacturer-backed reliability. Our technicians always diagnose first and give you a transparent recommendation, so you can make an informed decision based on cost, the age of your cart, and how you use it.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Our Repair Process
            </h2>
            <p>
              We keep golf cart controller repair straightforward, honest, and convenient from your first call to the final test drive:
            </p>
          </div>

          <div className="max-w-4xl mx-auto mt-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {repairProcess.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="text-center" data-testid={`controller-step-${idx}`}>
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

      <section className="py-12 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Gauge className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Accurate Diagnostics</h3>
              <p className="text-sm text-muted-foreground">We find the real fault, not just the symptom</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">All Major Brands</h3>
              <p className="text-sm text-muted-foreground">EZGO, Club Car, Yamaha & more</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Warranty Backed</h3>
              <p className="text-sm text-muted-foreground">Every repair guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Golf Cart Controller Repair FAQs
              </h2>
              <p className="text-lg text-muted-foreground">
                Answers to the most common questions about golf cart controller repair and electrical diagnostics.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {controllerFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`controller-faq-${idx}`} data-testid={`controller-faq-item-${idx}`}>
                  <AccordionTrigger className="text-left font-semibold" data-testid={`controller-faq-question-${idx}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`controller-faq-answer-${idx}`}>
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
            Golf Cart Not Responding? We Can Help.
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Don't let a faulty controller keep your cart parked. Call now for expert golf cart controller repair and electrical diagnostics at a fair price.
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-controller-cta-call">
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
