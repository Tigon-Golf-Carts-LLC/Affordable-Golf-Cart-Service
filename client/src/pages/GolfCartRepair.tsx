import { Link } from "wouter";
import {
  Phone,
  ArrowRight,
  Wrench,
  Battery,
  Disc,
  Cpu,
  Zap,
  Plug,
  Fuel,
  Cog,
  Search,
  ClipboardCheck,
  ShieldCheck,
  Truck,
  MapPin,
  Star,
  Clock,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { serviceLocations } from "@shared/locations";
import { useEffect } from "react";

const PHONE_NUMBER = "1-844-844-4070";
const PHONE_HREF = "tel:+18448444070";
const SITE_URL = "https://affordablegolfcartservice.com";
const PAGE_URL = `${SITE_URL}/services/golf-cart-repair`;
const PAGE_TITLE = "Golf Cart Repair Services | Expert & Affordable";
const PAGE_DESCRIPTION =
  "Fast, reliable golf cart repair for electric & gas carts — motor, controller, battery, brake & charger repair. Call 1-844-844-4070 for affordable golf cart repair near you!";

const repairTypes = [
  {
    id: "electric-golf-cart-repair",
    name: "Electric Golf Cart Repair",
    icon: Zap,
    priceRange: "$75–$1,200",
    description:
      "Electric golf carts rely on a healthy battery pack, solenoid, speed controller, and motor working together. When your electric cart slows down, won't accelerate, or stops charging, our technicians trace the fault through the entire electrical system — from the key switch and forward/reverse selector to the controller and onboard charger — and repair only what's needed.",
  },
  {
    id: "gas-golf-cart-repair",
    name: "Gas Golf Cart Repair",
    icon: Fuel,
    priceRange: "$80–$1,000",
    description:
      "Gas-powered carts need carburetor, ignition, fuel, and clutch systems in good shape. We fix hard starting, stalling, loss of power, rough idling, and excessive smoke with tune-ups, carburetor cleaning or rebuilds, spark plug and filter replacement, and belt and clutch service to get your gas cart running strong again.",
  },
  {
    id: "motor-repair",
    name: "Motor Repair",
    icon: Cpu,
    priceRange: "$150–$1,200",
    description:
      "A worn motor causes slow speeds, struggling on hills, overheating, or a complete no-go condition. We test motor windings, brushes, and bearings, then repair or replace electric and gas motors and verify performance under load so your cart regains full power.",
  },
  {
    id: "controller-repair",
    name: "Speed Controller Repair",
    icon: Cog,
    priceRange: "$150–$700",
    description:
      "The speed controller manages how power reaches the motor. Symptoms like jerky acceleration, sudden cut-outs, or error codes often point to a failing controller. We diagnose, reprogram, repair, or replace controllers from all major brands and confirm smooth throttle response.",
  },
  {
    id: "battery-issues",
    name: "Battery & Charging Repair",
    icon: Battery,
    priceRange: "$30–$3,600",
    description:
      "Reduced range, slow charging, or a cart that dies quickly usually means battery trouble. We load-test individual batteries, clean and repair corroded terminals and cables, balance packs, and replace lead-acid or lithium batteries when they can no longer hold a charge.",
  },
  {
    id: "brake-repair",
    name: "Brake Repair",
    icon: Disc,
    priceRange: "$30–$300",
    description:
      "Spongy, noisy, or weak brakes are a safety risk. We inspect the full braking system, replace worn pads and shoes, adjust cables, service drums, and road-test the cart so it stops reliably every time.",
  },
  {
    id: "charger-repair",
    name: "Charger Repair",
    icon: Plug,
    priceRange: "$50–$250",
    description:
      "A failing charger can leave you stranded with a dead cart. We test charger output and voltage, repair onboard and external chargers, inspect charging ports and cables, and replace chargers that are beyond repair.",
  },
];

const repairProcess = [
  {
    icon: Search,
    title: "1. Diagnosis",
    description:
      "We perform a full diagnostic inspection to pinpoint the exact cause of the problem — not just the symptom.",
  },
  {
    icon: ClipboardCheck,
    title: "2. Transparent Quote",
    description:
      "You receive a clear, upfront quote covering parts and labor before any repair work begins. No surprises.",
  },
  {
    icon: Wrench,
    title: "3. Expert Repair",
    description:
      "Our certified technicians complete the repair using quality parts, with most jobs finished the same day or within a few days.",
  },
  {
    icon: ShieldCheck,
    title: "4. Testing & Warranty",
    description:
      "We test the cart under real conditions and back every repair with a service warranty and post-service inspection.",
  },
  {
    icon: Truck,
    title: "5. Pickup & Delivery",
    description:
      "Choose mobile service where we come to you, or convenient pickup and delivery to get your cart back on the road.",
  },
];

const repairFaqs = [
  {
    question: "How much does golf cart repair cost?",
    answer:
      "Golf cart repair costs vary by the problem. Minor brake and electrical fixes start around $30, a controller repair runs $150–$700, motor repair $150–$1,200, and a full battery pack replacement can reach $3,600. Labor typically runs $75–$350 per hour. Call 1-844-844-4070 for a free, accurate quote.",
  },
  {
    question: "How long does a golf cart repair take?",
    answer:
      "Most repairs are completed the same day or within 1–2 days. More involved jobs like motor or controller replacement may take 2–4 days depending on parts availability.",
  },
  {
    question: "Do you repair both electric and gas golf carts?",
    answer:
      "Yes. Our technicians are trained to repair both electric and gas golf carts of all major brands, including EZGO, Club Car, Yamaha, and more.",
  },
  {
    question: "Do you offer mobile golf cart repair?",
    answer:
      "Yes. We offer mobile golf cart repair where our technicians come to you, plus pickup and delivery options. Mobile calls are billed at a higher rate than in-house service.",
  },
  {
    question: "How do I know if my golf cart needs a new battery or charger?",
    answer:
      "If your cart loses range quickly or won't hold a charge, the battery pack may be failing. If it won't charge at all, the charger is often the culprit. We load-test batteries and test charger output to identify the real cause before recommending a replacement.",
  },
];

const diagnosisSteps = [
  {
    name: "Check the batteries and connections",
    text: "Inspect battery charge level, look for corrosion on terminals, and ensure all cables are tight. Weak or corroded batteries are the most common cause of poor performance.",
  },
  {
    name: "Test the charger",
    text: "Plug in the charger and confirm it powers on and delivers the correct voltage. A charger that clicks off immediately or never starts may be faulty.",
  },
  {
    name: "Inspect the solenoid and key switch",
    text: "Listen for a click from the solenoid when you press the pedal. No click can indicate a bad solenoid, key switch, or wiring issue.",
  },
  {
    name: "Evaluate the speed controller",
    text: "Jerky movement, cut-outs, or error codes often point to the controller. Note any blinking diagnostic codes to share with your technician.",
  },
  {
    name: "Check the motor",
    text: "If the cart is silent and won't move with power confirmed, the motor may have worn brushes or bearings and need repair or replacement.",
  },
  {
    name: "Call a professional",
    text: "If the problem isn't obvious, call 1-844-844-4070 for a professional diagnosis to avoid misdiagnosing and replacing the wrong part.",
  },
];

const testimonials = [
  {
    quote:
      "My electric cart wouldn't accelerate and they had it diagnosed and fixed the same day. Fair price and friendly techs.",
    author: "Robert M.",
    location: "Florida",
  },
  {
    quote:
      "The mobile repair option was a lifesaver. They came to my community, replaced my controller, and tested everything before leaving.",
    author: "Linda K.",
    location: "South Carolina",
  },
  {
    quote:
      "Honest pricing and they explained exactly what was wrong with my gas cart. Runs like new now.",
    author: "James T.",
    location: "North Carolina",
  },
];

export default function GolfCartRepair() {
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
          name: "Golf Cart Repair",
          serviceType: "Golf Cart Repair",
          description:
            "Fast, reliable, and affordable golf cart repair for electric and gas carts, including motor, controller, battery, brake, and charger repair.",
          url: PAGE_URL,
          areaServed: { "@type": "Country", name: "United States" },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: 30,
            highPrice: 3600,
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
          "@type": "HowTo",
          name: "How to diagnose common golf cart problems",
          description:
            "A step-by-step guide to diagnosing the most common golf cart problems before calling for professional repair.",
          totalTime: "PT30M",
          step: diagnosisSteps.map((s, idx) => ({
            "@type": "HowToStep",
            position: idx + 1,
            name: s.name,
            text: s.text,
          })),
        },
        {
          "@type": "FAQPage",
          mainEntity: repairFaqs.map((faq) => ({
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
    script.id = "repair-structured-data";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("repair-structured-data");
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
            <Badge variant="secondary" className="mb-4" data-testid="badge-repair-hero">
              <Wrench className="h-3 w-3 mr-1" />
              Expert Golf Cart Repair
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Golf Cart Repair
              <span className="text-primary block">Fast, Reliable & Affordable Service</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whatever's wrong with your cart, our certified technicians fix it right. We handle electric and gas golf cart repair — motor, controller, battery, brake, and charger repair — with transparent pricing and fast turnaround at {serviceLocations.length} locations nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-repair-hero-call">
                <a href={PHONE_HREF} className="gap-2">
                  <Phone className="h-5 w-5" />
                  Call Now: {PHONE_NUMBER}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-repair-hero-services">
                <Link href="/services">
                  View All Services
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,hsl(var(--primary)/0.1)_0%,transparent_50%)] pointer-events-none" />
      </section>

      <section className="py-12 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Certified Technicians</h3>
              <p className="text-sm text-muted-foreground">Trained on all major brands</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Fast Turnaround</h3>
              <p className="text-sm text-muted-foreground">Many repairs done same day</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Warranty Backed</h3>
              <p className="text-sm text-muted-foreground">Every repair guaranteed</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Nationwide</h3>
              <p className="text-sm text-muted-foreground">50 states, {serviceLocations.length} locations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Golf Cart Repair Services We Offer
            </h2>
            <p className="text-lg text-muted-foreground">
              From a simple brake adjustment to a complete motor rebuild, we repair every part of your golf cart. Here are the most common golf cart repairs we handle.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {repairTypes.map((repair) => {
              const Icon = repair.icon;
              return (
                <Card key={repair.id} data-testid={`card-repair-${repair.id}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{repair.name}</h3>
                        <Badge variant="outline" className="mt-1" data-testid={`badge-repair-price-${repair.id}`}>
                          {repair.priceRange}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{repair.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Golf Cart Repair Process
            </h2>
            <p className="text-lg text-muted-foreground">
              We keep golf cart repair simple, honest, and convenient from the first call to the final test drive.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {repairProcess.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="text-center" data-testid={`repair-step-${idx}`}>
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
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              How to Diagnose Common Golf Cart Problems
            </h2>
            <p className="text-muted-foreground mb-8 text-center">
              Before you call for golf cart repair, these steps can help you understand what's wrong with your cart and speed up the repair.
            </p>
            <ol className="space-y-4">
              {diagnosisSteps.map((step, idx) => (
                <li key={idx} className="flex gap-4" data-testid={`diagnosis-step-${idx}`}>
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{step.name}</h3>
                    <p className="text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              Why Choose Our Golf Cart Repair Service?
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                When your golf cart breaks down, you need a repair service you can trust to fix it right the first time. Our certified technicians have years of hands-on experience repairing electric and gas golf carts from every major manufacturer, including EZGO, Club Car, and Yamaha. We invest in professional diagnostic equipment so we can identify the true root cause of a problem instead of guessing and replacing parts that don't need replacing — saving you money and getting your cart back faster.
              </p>
              <p>
                Affordable golf cart repair shouldn't mean cutting corners. Every repair we perform uses quality parts and is backed by a service warranty and a post-service inspection. We believe in transparent pricing, so you'll always receive a clear quote covering parts and labor before we begin any work. Labor typically runs $75–$350 per hour depending on the complexity of the job, and we'll explain exactly what your cart needs and why.
              </p>
              <p>
                We make repair convenient, too. Choose in-shop service at one of our {serviceLocations.length} locations across all 50 states, or take advantage of our mobile repair service where our technicians come directly to your home, golf community, or business. We also offer pickup and delivery so you never have to worry about transporting a cart that won't run. Whether it's a quick brake adjustment or a full motor and controller rebuild, we have the tools, parts, and expertise to handle it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              What Our Customers Say
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t, idx) => (
                <Card key={idx} data-testid={`testimonial-${idx}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{t.quote}"</p>
                    <p className="font-semibold text-foreground text-sm">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Golf Cart Repair FAQs
              </h2>
              <p className="text-lg text-muted-foreground">
                Common questions about our golf cart repair services and pricing.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {repairFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`repair-faq-${idx}`} data-testid={`repair-faq-item-${idx}`}>
                  <AccordionTrigger className="text-left font-semibold" data-testid={`repair-faq-question-${idx}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`repair-faq-answer-${idx}`}>
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
            Need Golf Cart Repair Today?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Don't let a broken cart slow you down. Call now to schedule your golf cart repair with our expert technicians!
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-repair-cta-call">
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
