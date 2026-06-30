import { useLocation, useRoute, Link } from "wouter";
import { Phone, ArrowLeft, ArrowRight, Search, Clock, Wrench, Battery, Disc, Cpu, Zap, Plug, Tag, ShieldCheck, CheckCircle2, Truck, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ServiceCard } from "@/components/ServiceCard";
import { services, serviceCategories, getServicesByCategory, getServiceById } from "@shared/services";
import { serviceLocations } from "@shared/locations";
import { useState, useMemo, useEffect } from "react";

const PHONE_NUMBER = "1-844-844-4070";
const PHONE_HREF = "tel:+18448444070";

const SITE_URL = "https://affordablegolfcartservice.com";
const SERVICES_TITLE = "Golf Car Service and Repair | Cart Repair & Affordable Golf Cart Services";
const SERVICES_DESCRIPTION = "Need cheap golf cart service without cutting corners? Affordable Golf Cart Service offers low-cost cart repair & maintenance from certified technicians. Get a free estimate — call 1-844-844-4070.";

interface ServiceListItem {
  name: string;
  description: string;
  url: string;
}

const serviceListItems: ServiceListItem[] = [
  {
    name: "Golf Cart Tune-Up & Maintenance",
    description: "Multi-point inspections, adjustments, and preventative maintenance to keep your cart running reliably.",
    url: `${SITE_URL}/services/full-tune-up-package`,
  },
  {
    name: "Golf Cart Battery Service & Replacement",
    description: "Battery load testing, terminal cleaning, and lead-acid or lithium pack replacement.",
    url: `${SITE_URL}/services/lead-acid-battery-replacement-set`,
  },
  {
    name: "Golf Cart Brake Service",
    description: "Brake inspection, pad and shoe replacement, and adjustment for safe, reliable stopping.",
    url: `${SITE_URL}/services/brake-pad-replacement`,
  },
  {
    name: "Golf Cart Motor Repair",
    description: "Diagnosis, repair, rebuild, and replacement of electric and gas golf cart motors.",
    url: `${SITE_URL}/services/motor-repair-or-rebuild`,
  },
  {
    name: "Golf Cart Electrical Diagnostics & Controller Repair",
    description: "Professional electrical diagnostics, controller repair, and wiring fixes for carts that surge or cut out.",
    url: `${SITE_URL}/services/electrical-diagnostics`,
  },
  {
    name: "Golf Cart Charger Repair",
    description: "Testing, repair, and replacement of onboard and external golf cart chargers.",
    url: `${SITE_URL}/services/charger-inspection-or-repair`,
  },
];

interface FeaturedService {
  id: string;
  name: string;
  icon: typeof Wrench;
  priceRange: string;
  lowPrice: number;
  highPrice: number;
  turnaround: string;
  description: string;
  includes: string[];
}

const featuredServices: FeaturedService[] = [
  {
    id: "tune-up",
    name: "Golf Cart Tune-Up",
    icon: Wrench,
    priceRange: "$100–$450",
    lowPrice: 100,
    highPrice: 450,
    turnaround: "Same day – 1 day",
    description:
      "A tune-up keeps your golf cart running smoothly and prevents costly breakdowns. Our affordable golf cart tune-up service covers a full inspection and adjustment of the key components that affect performance and reliability.",
    includes: [
      "Multi-point safety inspection",
      "Brake and accelerator adjustment",
      "Battery and charging system check",
      "Tire pressure and tread inspection",
      "Lubrication of moving parts",
    ],
  },
  {
    id: "battery-replacement",
    name: "Battery Replacement",
    icon: Battery,
    priceRange: "$700–$3,600",
    lowPrice: 700,
    highPrice: 3600,
    turnaround: "1–2 days",
    description:
      "Weak or dead batteries are the most common reason a golf cart loses range and power. We replace lead-acid and lithium battery packs with quality components and dispose of your old batteries responsibly.",
    includes: [
      "Battery load testing and diagnosis",
      "Lead-acid or lithium pack replacement",
      "Terminal cleaning and corrosion removal",
      "Professional installation and wiring",
      "Old battery removal and recycling",
    ],
  },
  {
    id: "brake-service",
    name: "Brake Service",
    icon: Disc,
    priceRange: "$30–$300",
    lowPrice: 30,
    highPrice: 300,
    turnaround: "Same day – 1 day",
    description:
      "Safe, responsive brakes are essential. Our affordable brake service inspects, adjusts, and replaces worn brake components so your cart stops reliably every time.",
    includes: [
      "Complete brake system inspection",
      "Brake pad and shoe replacement",
      "Cable adjustment and lubrication",
      "Brake fluid check (where applicable)",
      "Road test and final adjustment",
    ],
  },
  {
    id: "motor-repair",
    name: "Motor Repair",
    icon: Cpu,
    priceRange: "$150–$1,200",
    lowPrice: 150,
    highPrice: 1200,
    turnaround: "2–4 days",
    description:
      "When your cart loses power, struggles on hills, or won't move, the motor may need attention. We diagnose and repair or replace electric and gas motors to restore full performance.",
    includes: [
      "Full motor diagnostics",
      "Brush, bearing, and winding inspection",
      "Motor repair or replacement",
      "Speed controller testing",
      "Performance verification",
    ],
  },
  {
    id: "electrical-diagnostics",
    name: "Electrical Diagnostics",
    icon: Zap,
    priceRange: "$50–$350",
    lowPrice: 50,
    highPrice: 350,
    turnaround: "Same day – 2 days",
    description:
      "Intermittent power, blown fuses, and faulty wiring can be frustrating to track down. Our technicians use professional diagnostic tools to find and fix electrical problems fast.",
    includes: [
      "Complete electrical system scan",
      "Wiring and connection inspection",
      "Solenoid, switch, and fuse testing",
      "Controller and onboard computer check",
      "Repair of faulty components",
    ],
  },
  {
    id: "charger-repair",
    name: "Charger Repair",
    icon: Plug,
    priceRange: "$50–$250",
    lowPrice: 50,
    highPrice: 250,
    turnaround: "Same day – 2 days",
    description:
      "A failing charger can leave you stranded with a dead cart. We inspect, repair, and replace both onboard and external chargers to keep your batteries topped up and healthy.",
    includes: [
      "Charger output and voltage testing",
      "Onboard and external charger repair",
      "Charging port and cable inspection",
      "Battery compatibility check",
      "Charger replacement if needed",
    ],
  },
];

const serviceFaqs = [
  {
    question: "How much does golf cart service cost?",
    answer:
      "Affordable golf cart services typically range from about $20 for minor adjustments to $3,600 for a full lithium battery replacement. A standard tune-up runs $100–$450, brake service $30–$300, and electrical diagnostics $50–$350. Labor generally runs $75–$350 per hour depending on complexity. Call 1-844-844-4070 for a free, accurate quote for your cart.",
  },
  {
    question: "What does a golf cart tune-up include?",
    answer:
      "A golf cart tune-up includes a multi-point safety inspection, brake and accelerator adjustment, battery and charging system check, tire pressure and tread inspection, and lubrication of all moving parts. For gas carts it also covers spark plugs, air filters, and oil changes.",
  },
  {
    question: "Do you offer mobile golf cart services?",
    answer:
      "Yes. We offer mobile golf cart service where our technicians come to you, as well as convenient pickup and delivery options. Mobile service calls are billed at a higher rate than in-house service. Call us to confirm mobile availability in your area.",
  },
  {
    question: "How long does golf cart service take?",
    answer:
      "Most services are completed the same day or within 1–2 days. Tune-ups and brake service are often same-day, while motor repairs and battery replacements may take 2–4 days depending on parts availability.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We provide affordable golf cart services across all 50 states through our network of 14 service locations. Visit our locations or state pages to find the nearest service center to you.",
  },
  {
    question: "Do your services come with a warranty?",
    answer:
      "Yes. All of our golf cart repair and maintenance services include a service warranty, quality parts, and a post-service inspection for your peace of mind.",
  },
];

const pricingRows = [
  { service: "Tune-Up & Maintenance", price: "$100 – $450", turnaround: "Same day" },
  { service: "Battery Replacement (per battery)", price: "$130 – $300", turnaround: "Same day" },
  { service: "Full Battery Pack (lithium)", price: "$1,200 – $3,600", turnaround: "1 – 2 days" },
  { service: "Brake Repair", price: "$30 – $300", turnaround: "Same day" },
  { service: "Motor Repair", price: "$150 – $1,200", turnaround: "2 – 4 days" },
  { service: "Speed Controller Repair", price: "$150 – $700", turnaround: "1 – 3 days" },
  { service: "Electrical Diagnostics", price: "$50 – $350", turnaround: "Same day" },
  { service: "Charger Repair", price: "$50 – $250", turnaround: "Same day" },
];

const costSavers = [
  "Diagnostic-first repairs — we fix the real problem, so you never pay to replace parts that aren't broken.",
  "Quality OEM and aftermarket parts sourced at fair prices and passed on to you.",
  "Flat, upfront quotes with no hidden fees or surprise charges.",
  "Efficient certified technicians who get the job done right the first time.",
  "Mobile, pickup, and in-shop options so you only pay for the service level you need.",
  "A nationwide network that keeps overhead low and our rates competitive.",
];

const technicianProfiles = [
  {
    role: "Master Electric Drive Technicians",
    focus: "Motors, controllers & lithium systems",
    description:
      "Our electric drive specialists diagnose and repair drive motors, speed controllers, solenoids, and both lead-acid and lithium battery systems. They use professional diagnostic equipment to pinpoint power loss, range, and charging problems on EZGO, Club Car, Yamaha, and every other major brand.",
  },
  {
    role: "Gas Engine Specialists",
    focus: "Carburetors, ignition & engine rebuilds",
    description:
      "Trained on both two-cycle and four-cycle golf cart engines, our gas specialists handle carburetor cleaning, fuel system repair, ignition tuning, governor adjustments, and full engine rebuilds to restore smooth, reliable power to your cart.",
  },
  {
    role: "Brake & Safety Technicians",
    focus: "Brakes, steering, suspension & tires",
    description:
      "These technicians inspect and repair braking systems, steering, suspension, and tires so your cart stops, handles, and rides safely every single time it leaves our shop or a mobile visit.",
  },
  {
    role: "Mobile Service Technicians",
    focus: "On-site repair & maintenance",
    description:
      "Our mobile technicians bring the shop to you, performing tune-ups, battery service, electrical diagnostics, and many repairs on-site at your home, golf community, or business across all 50 states.",
  },
];

const servicesStates = Array.from(
  new Set(serviceLocations.map((loc) => loc.state))
).sort();

const fixProcessSteps = [
  {
    icon: Phone,
    title: "1. Tell Us What's Wrong",
    description:
      "Call and describe the symptoms — won't start, no power, won't hold a charge, strange noises. We'll tell you what's likely going on and book the fastest way to get your golf cart fixed.",
  },
  {
    icon: Search,
    title: "2. Diagnose the Real Problem",
    description:
      "Our certified technicians run a full diagnostic to find the true cause before touching a wrench, so we fix your golf cart right the first time instead of guessing and swapping parts.",
  },
  {
    icon: Tag,
    title: "3. Approve an Upfront Quote",
    description:
      "You get a clear, written quote for parts and labor before any work begins — no hidden fees and no surprise charges, so you decide exactly how to fix your cart.",
  },
  {
    icon: Wrench,
    title: "4. Fix It Right",
    description:
      "We fix your golf cart with quality OEM or aftermarket parts and experienced workmanship, whether it's a quick repair, a battery replacement, or a full motor rebuild.",
  },
  {
    icon: ShieldCheck,
    title: "5. Test & Warranty",
    description:
      "We road-test the cart to confirm the fix holds under real use, then back the work with a service warranty so you can drive with confidence.",
  },
];

const commonFixes = [
  {
    icon: Zap,
    problem: "Golf Cart Won't Move or Has No Power",
    solution:
      "We check the battery charge, key switch, forward/reverse selector, solenoid, and main wiring to find what's interrupting power. Most no-power carts are fixed by replacing a failed solenoid, repairing corroded cables, or addressing a weak battery pack.",
  },
  {
    icon: Battery,
    problem: "Battery Won't Hold a Charge",
    solution:
      "We load-test each battery, clean and repair corroded terminals, and check the charger output. If the batteries can no longer hold a charge, we replace lead-acid or lithium batteries to restore full range.",
  },
  {
    icon: Cpu,
    problem: "Cart Loses Power or Slows on Hills",
    solution:
      "Lost speed and weak hill-climbing usually trace to the speed controller, motor, or a tired battery pack. We test each component under load and repair, reprogram, or replace the part that's actually causing the power loss.",
  },
  {
    icon: Wrench,
    problem: "Cart Won't Start or Respond",
    solution:
      "For gas carts we service the carburetor, spark plug, and fuel system; for electric carts we check the controller, solenoid, and wiring. We pinpoint why your cart won't start and fix the root cause, not just the symptom.",
  },
  {
    icon: Disc,
    problem: "Weak, Noisy, or Spongy Brakes",
    solution:
      "We inspect the entire braking system, replace worn pads and shoes, adjust the cables, service the drums, and road-test the cart so it stops safely and quietly every time.",
  },
];

const servicePackages = [
  {
    icon: Tag,
    name: "Quick Service Package",
    price: "From $99",
    blurb: "Perfect for keeping a healthy cart running right.",
    features: [
      "Multi-point safety inspection",
      "Brake & accelerator adjustment",
      "Battery & charging system check",
      "Tire pressure & tread check",
    ],
  },
  {
    icon: ShieldCheck,
    name: "Complete Care Package",
    price: "From $249",
    blurb: "Our most popular value bundle for full peace of mind.",
    features: [
      "Everything in Quick Service",
      "Full tune-up & lubrication",
      "Battery load testing & cleaning",
      "Brake service & diagnostics scan",
    ],
    featured: true,
  },
  {
    icon: Wrench,
    name: "Performance & Restore",
    price: "Custom quote",
    blurb: "For major repairs, upgrades, and full restorations.",
    features: [
      "Motor & controller repair",
      "Battery pack replacement",
      "Custom upgrades & lift kits",
      "Body, paint & full restoration",
    ],
  },
];

const dealershipComparison = [
  { service: "Standard Tune-Up", ourPrice: "$100 – $450", dealerPrice: "$250 – $600" },
  { service: "Battery Replacement (per battery)", ourPrice: "$130 – $300", dealerPrice: "$200 – $400" },
  { service: "Brake Repair", ourPrice: "$30 – $300", dealerPrice: "$150 – $450" },
  { service: "Electrical Diagnostics", ourPrice: "$50 – $350", dealerPrice: "$120 – $250" },
];

const beforeAfter = [
  {
    title: "Won't Hold a Charge",
    before:
      "Customer's electric cart lost power after just a few holes and took all night to charge.",
    after:
      "We load-tested the pack, replaced two failing batteries, and cleaned corroded cables — full range restored at an affordable price.",
  },
  {
    title: "No Acceleration",
    before:
      "Cart hesitated and cut out when pressing the pedal, leaving the owner stranded.",
    after:
      "We diagnosed a failing speed controller, reprogrammed and replaced it, and the cart now accelerates smoothly.",
  },
  {
    title: "Weak, Noisy Brakes",
    before:
      "Spongy brakes and grinding noise made the cart unsafe to drive around the neighborhood.",
    after:
      "We replaced worn pads, adjusted the cables, and road-tested it — safe, quiet, reliable stopping every time.",
  },
];

function ServiceDetail({ serviceId }: { serviceId: string }) {
  const service = getServiceById(serviceId);

  useEffect(() => {
    if (service) {
      document.title = `${service.name} | Affordable Golf Cart Services`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          `${service.name} (${service.priceRange}) — ${service.description} Affordable golf cart service nationwide. Call 1-844-844-4070 for a free quote!`
        );
      }
    }
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Service Not Found</h2>
            <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/services">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const relatedServices = getServicesByCategory(service.category)
    .filter((s) => s.id !== service.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to All Services
          </Link>
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-3">
              {service.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {service.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="outline" className="text-lg px-4 py-1">
                {service.priceRange}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-foreground">Service Details</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    {service.description}
                  </p>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-foreground mb-2">Price Range</h3>
                    <p className="text-muted-foreground">
                      {service.priceRange} - Pricing varies based on your specific needs, cart model, parts required, and location. Contact us for an accurate quote.
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-foreground mb-2">What's Included</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>• Professional diagnostic assessment</li>
                      <li>• Quality parts and materials</li>
                      <li>• Expert technician service</li>
                      <li>• Service warranty</li>
                      <li>• Post-service inspection</li>
                    </ul>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-foreground mb-2">Service Notes</h3>
                    <p className="text-muted-foreground text-sm">
                      Labor rates typically run $75–$350 per hour depending on service complexity. Mobile service calls where we come to you are billed at a higher rate than in-house service. Shipping, delivery, and parts costs are additional. Pricing may vary by state and area.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader className="text-center">
                  <h3 className="text-xl font-bold text-foreground">Schedule This Service</h3>
                  <p className="text-muted-foreground">Call now to get started</p>
                </CardHeader>
                <CardContent className="text-center">
                  <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-2xl font-bold text-primary mb-4">{PHONE_NUMBER}</p>
                  <Button size="lg" className="w-full" asChild data-testid={`button-service-detail-call-${service.id}`}>
                    <a href={PHONE_HREF}>
                      <Phone className="h-5 w-5 mr-2" />
                      Call Now to Schedule Today!
                    </a>
                  </Button>
                </CardContent>
                <CardFooter className="text-center text-sm text-muted-foreground">
                  Available Mon-Sat, 8AM-6PM
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="py-12 bg-card border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Related Services in {service.category}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedServices.map((relatedService) => (
                <ServiceCard key={relatedService.id} service={relatedService} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need This Service?
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Call now to schedule your {service.name} appointment!
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href={PHONE_HREF} className="gap-2">
              <Phone className="h-5 w-5" />
              {PHONE_NUMBER}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

function ServicesList() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = SERVICES_TITLE;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", SERVICES_DESCRIPTION);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          name: "Golf Cart Services",
          description:
            "Professional golf cart services including repair, maintenance, tune-ups, battery, brake, motor, electrical, and charger service.",
          itemListElement: serviceListItems.map((item, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: item.name,
            description: item.description,
            url: item.url,
          })),
        },
        ...featuredServices.map((s) => ({
          "@type": "Service",
          name: `Affordable Golf Cart ${s.name}`,
          serviceType: s.name,
          description: s.description,
          url: `${SITE_URL}/services`,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: s.lowPrice,
            highPrice: s.highPrice,
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "USD",
              minPrice: s.lowPrice,
              maxPrice: s.highPrice,
            },
          },
          provider: {
            "@type": "LocalBusiness",
            name: "Affordable Golf Cart Service",
            telephone: "+1-844-844-4070",
            url: SITE_URL,
          },
        })),
        {
          "@type": "FAQPage",
          mainEntity: serviceFaqs.map((faq) => ({
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
          name: "How to Fix Common Golf Cart Problems",
          description:
            "A step-by-step guide to diagnosing and fixing the five most common golf cart problems, from no power and dead batteries to weak brakes.",
          step: commonFixes.map((fix, idx) => ({
            "@type": "HowToStep",
            position: idx + 1,
            name: fix.problem,
            text: fix.solution,
          })),
        },
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "services-structured-data";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("services-structured-data");
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  const filteredServices = useMemo(() => {
    let result = selectedCategory
      ? getServicesByCategory(selectedCategory)
      : services;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Professional Cart Repair &amp; Affordable Golf Cart Services – Maintenance, Battery Replacement &amp; More
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-primary mb-4">
              Quality Golf Cart Services You Can Count On — Without the High Price Tag
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Affordable golf cart services don't have to mean cutting corners. Our certified technicians deliver complete cart repair, maintenance, and tune-ups for every golf cart — from battery replacement and motor repair to brakes and electrical diagnostics — at honest, upfront prices. Our comprehensive golf car service and repair solutions cover everything from routine maintenance to full motor overhauls, and our cart repair specialists fix electric and gas carts of all makes and models. With 100+ services available across all 50 states and local service centers nationwide, quality affordable golf cart services are always within reach, backed by our satisfaction guarantee.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground" data-testid="badge-guarantee">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Satisfaction Guarantee
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground" data-testid="badge-transparent-pricing">
                <Tag className="h-5 w-5 text-primary" />
                Transparent Pricing
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground" data-testid="badge-fast-turnaround">
                <Clock className="h-5 w-5 text-primary" />
                Fast Turnaround
              </div>
            </div>
            <Button size="lg" asChild data-testid="button-services-header-call">
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Golf Cart Service Pricing – Some of the Cheapest Rates Around
              </h2>
              <p className="text-lg text-muted-foreground">
                Looking for the cheapest golf cart services that don't cut corners? No hidden fees, no surprises — here's what our affordable golf cart repair and maintenance actually costs. You always get a clear, upfront quote before any work begins.
              </p>
            </div>
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left" data-testid="table-pricing">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 font-semibold text-foreground">Repair Service</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Typical Price Range</th>
                      <th className="px-4 py-3 font-semibold text-foreground hidden sm:table-cell">Typical Turnaround</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingRows.map((row, idx) => (
                      <tr key={idx} className="border-b last:border-0" data-testid={`row-pricing-${idx}`}>
                        <td className="px-4 py-3 font-medium text-foreground">{row.service}</td>
                        <td className="px-4 py-3 text-primary font-semibold">{row.price}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row.turnaround}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Final pricing depends on your cart's make, model, parts needed, and location. Call{" "}
              <a href={PHONE_HREF} className="text-primary hover:text-primary/80 font-medium" data-testid="link-pricing-phone">{PHONE_NUMBER}</a>{" "}
              for a free, exact quote.
            </p>
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
                How We Keep Costs Low
              </h3>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-6">
                We've built our business to deliver some of the cheapest golf cart services in the country without sacrificing quality. Here's how we keep your repair bill down:
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {costSavers.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2" data-testid={`cost-saver-${idx}`}>
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Cheap Golf Cart Service Without the Cheap Results
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We believe cheap golf cart service should mean a smaller bill — never lower quality. Our certified technicians use the same professional parts and diagnostic equipment as the dealerships, typically at lower prices. Compare our rates below and choose the value package that fits your cart.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-14">
              {servicePackages.map((pkg, idx) => {
                const Icon = pkg.icon;
                return (
                  <Card
                    key={idx}
                    className={pkg.featured ? "border-primary border-2 relative" : ""}
                    data-testid={`card-package-${idx}`}
                  >
                    {pkg.featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{pkg.name}</h3>
                      <p className="text-2xl font-bold text-primary mb-2">{pkg.price}</p>
                      <p className="text-sm text-muted-foreground mb-4">{pkg.blurb}</p>
                      <ul className="space-y-2">
                        {pkg.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
                Our Rates vs. Typical Dealership Prices
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Here's how affordable our service is compared to what dealerships and big repair shops typically charge for the same work.
              </p>
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-left" data-testid="table-comparison">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 font-semibold text-foreground">Service</th>
                        <th className="px-4 py-3 font-semibold text-primary">Our Price</th>
                        <th className="px-4 py-3 font-semibold text-muted-foreground">Typical Dealership</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dealershipComparison.map((row, idx) => (
                        <tr key={idx} className="border-b last:border-0" data-testid={`row-comparison-${idx}`}>
                          <td className="px-4 py-3 font-medium text-foreground">{row.service}</td>
                          <td className="px-4 py-3 text-primary font-semibold">{row.ourPrice}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.dealerPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Dealership figures are typical industry estimates and vary by location, brand, and shop. Your final price always comes as a clear, upfront quote.
              </p>
              <p className="text-center text-muted-foreground mt-8">
                Ready for cheap golf cart service that actually lasts? Call{" "}
                <a href={PHONE_HREF} className="text-primary hover:text-primary/80 font-medium" data-testid="link-cheap-phone">{PHONE_NUMBER}</a>{" "}
                for a free, no-obligation estimate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Before &amp; After: Real Repair Results
              </h2>
              <p className="text-lg text-muted-foreground">
                See how affordable golf cart repair turns common problems into carts that run like new.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {beforeAfter.map((item, idx) => (
                <Card key={idx} data-testid={`card-beforeafter-${idx}`}>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-3">{item.title}</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="inline-block text-xs font-semibold uppercase tracking-wide text-destructive mb-1">Before</span>
                        <p className="text-muted-foreground">{item.before}</p>
                      </div>
                      <div>
                        <span className="inline-block text-xs font-semibold uppercase tracking-wide text-primary mb-1">After</span>
                        <p className="text-muted-foreground">{item.after}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 rounded-lg bg-primary/10 p-6 text-center">
              <ShieldCheck className="h-10 w-10 text-primary shrink-0" />
              <div className="text-left">
                <h3 className="font-bold text-foreground">Our Satisfaction Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  Every repair is backed by a service warranty and post-service inspection. If you're not satisfied with the work, we'll make it right.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Complete Golf Cart Services Under One Roof
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything your cart needs, handled by one trusted team.
              </p>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Whether you drive an electric or gas golf cart, our golf cart services cover the full lifecycle of your vehicle. Routine{" "}
                <Link href="/services/golf-cart-tune-up" className="text-primary hover:text-primary/80 font-medium" data-testid="link-services-maintenance">
                  golf cart maintenance
                </Link>{" "}
                and tune-ups keep small issues from turning into expensive breakdowns, while our repair services tackle everything from dead batteries and worn brakes to failing motors, faulty controllers, and stubborn electrical gremlins. Because we work on every major brand and model, you don't have to track down a different specialist for each problem — we're a true one-stop shop for golf cart owners, communities, resorts, and fleets alike.
              </p>
              <p>
                Our most-requested golf cart services include comprehensive tune-ups, battery testing and replacement (lead-acid and lithium), brake inspection and pad replacement, motor repair and rebuilds, electrical diagnostics and controller repair, and charger service. Each job is performed with quality parts and finished with a road test so your cart leaves running the way it should. And when you can't bring your cart to us, our mobile golf cart service brings the same expertise directly to your driveway or community.
              </p>
              <p>
                Drive a gas-powered cart? Our certified mechanics handle complete{" "}
                <Link href="/services/motor-repair" className="text-primary hover:text-primary/80 font-medium" data-testid="link-services-gas-repair">
                  gas golf cart repair
                </Link>{" "}
                — from carburetor cleaning, fuel system fixes, and spark plug replacement to governor adjustments and full engine rebuilds — so your gas cart starts easily and runs strong.
              </p>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {serviceListItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3" data-testid={`overview-service-${idx}`}>
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground font-medium">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose Us for Golf Cart Services
              </h2>
              <p className="text-lg text-muted-foreground">
                Certified expertise, honest pricing, and service that puts you first.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Certified, Experienced Technicians</h3>
                  <p className="text-sm text-muted-foreground">
                    Our technicians are factory-trained and experienced across all major golf cart brands, gas and electric, so the job is done right the first time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Tag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Transparent, Upfront Pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    You get a clear quote before any work begins — no hidden fees and no surprises when you pick up your cart.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Satisfaction Guarantee</h3>
                  <p className="text-sm text-muted-foreground">
                    Every repair is backed by a service warranty and post-service inspection. If you're not happy, we'll make it right.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Fast Turnaround & Nationwide Service</h3>
                  <p className="text-sm text-muted-foreground">
                    With in-shop, mobile, and pickup options across all 50 states, we get you back on the course or the road quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Most Popular Affordable Golf Cart Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Each service is performed by certified technicians using quality parts, backed by a service warranty. Pricing varies by cart model, parts, and location — call 1-844-844-4070 for an accurate quote.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} data-testid={`card-featured-${service.id}`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{service.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" data-testid={`badge-price-${service.id}`}>
                            {service.priceRange}
                          </Badge>
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {service.turnaround}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{service.description}</p>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">What's Included:</h4>
                      <ul className="space-y-1">
                        {service.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Wrench className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild data-testid={`button-featured-call-${service.id}`}>
                      <a href={PHONE_HREF} className="gap-2">
                        <Phone className="h-4 w-4" />
                        Call Now to Schedule Today!
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-8 border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-services"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                data-testid="filter-all-services"
              >
                All ({services.length})
              </Button>
              {serviceCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`filter-services-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredServices.length === 0 ? (
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="p-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Services Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6 text-sm text-muted-foreground">
                Showing {filteredServices.length} service{filteredServices.length !== 1 ? "s" : ""}
                {selectedCategory && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Professional Golf Car Repair &amp; Maintenance Services
              </h2>
              <p className="text-lg text-muted-foreground">
                Whether you call it a golf cart or a golf car, our certified technicians fix it right. We handle complete golf car repair and golf cart repair for both electric and gas models — explore the most common repairs below, or{" "}
                <Link href="/services/golf-cart-repair" className="text-primary hover:text-primary/80 font-medium" data-testid="link-repair-page-anchor">
                  visit our dedicated golf cart repair page
                </Link>{" "}
                for full details, pricing, and our repair process. Our golf car repair service covers everything from quick fixes to full rebuilds at honest, upfront prices.
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Electric Golf Cart Repair</h3>
                <p>
                  Electric golf carts depend on a healthy battery pack, solenoid, speed controller, and motor all working together. When an electric cart loses speed, won't accelerate, hesitates, or stops charging, the fault can be anywhere in the system. Our technicians trace the problem from the key switch and forward/reverse selector through the solenoid, controller, and onboard charger, then repair only what's actually broken. Common electric cart repairs include replacing worn solenoids, repairing or reprogramming speed controllers, fixing corroded battery cables, and replacing batteries that no longer hold a charge.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Gas Golf Car Repair</h3>
                <p>
                  Gas-powered golf carts need their carburetor, ignition, fuel, and clutch systems in good working order. Hard starting, stalling, rough idling, loss of power on hills, and excessive smoke are all signs your gas cart needs attention. Our gas golf car repair service includes tune-ups, carburetor cleaning and rebuilds, spark plug and filter replacement, fuel system service, and belt and clutch repair to restore reliable performance and smooth running.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Motor Repair</h3>
                <p>
                  A worn or failing motor leads to slow speeds, struggling on inclines, overheating, or a cart that won't move at all. We test motor windings, brushes, and bearings to determine whether a repair or replacement makes more sense, then service electric and gas motors and confirm full power output under load before returning your cart.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Controller Repair</h3>
                <p>
                  The speed controller regulates how power is delivered from the batteries to the motor. Jerky acceleration, sudden cut-outs, limited top speed, or diagnostic error codes usually point to a controller problem. Our{" "}
                  <Link href="/services/electrical-diagnostics" className="text-primary hover:text-primary/80 font-medium" data-testid="link-controller-anchor">
                    golf cart controller repair
                  </Link>{" "}
                  service diagnoses, reprograms, repairs, or replaces controllers from all major brands and verifies smooth, consistent throttle response.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Battery Issues</h3>
                <p>
                  Battery trouble is the most common reason a golf cart underperforms. Reduced range, slow charging, or a cart that dies quickly often means one or more batteries are failing. We load-test each battery individually, clean and repair corroded terminals and cables, balance the pack, and replace lead-acid or lithium batteries when they can no longer hold a charge — so you get back the range and power you expect.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Brake Repair</h3>
                <p>
                  Spongy, noisy, or weak brakes are a serious safety hazard. Our brake repair service includes a full inspection of the braking system, replacement of worn pads and shoes, cable adjustment, drum service, and a road test so your cart stops safely and reliably every time you need it to.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Charger Repair</h3>
                <p>
                  A failing charger can leave you with a dead cart and nowhere to go. We test charger output and voltage, repair onboard and external chargers, inspect charging ports and cables for damage, and replace chargers that are beyond repair. Getting your charging system right is essential to protecting your battery pack and your investment.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Golf Cart Wheel Alignment</h3>
                <p>
                  A cart that pulls to one side or wears tires unevenly usually needs an alignment. Our{" "}
                  <Link href="/services/golf-cart-alignment" className="text-primary hover:text-primary/80 font-medium" data-testid="link-alignment-anchor">
                    golf cart wheel alignment
                  </Link>{" "}
                  service sets toe and camber back to spec, corrects steering pull, and protects your tires from premature wear — typically $50 to $150.
                </p>
              </div>
              <p>
                No matter the make, model, or problem, our team has the tools, parts, and experience to get your cart running again. For a free quote on any golf cart repair, call{" "}
                <a href={PHONE_HREF} className="text-primary hover:text-primary/80 font-medium" data-testid="link-repair-phone-anchor">
                  {PHONE_NUMBER}
                </a>{" "}
                today.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-card to-accent/20 p-8 md:p-10">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Mobile Golf Cart Service Available
                </h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Can't bring your cart to us? We'll come to you. Our mobile golf cart service brings certified technicians directly to your home, golf community, or business — no trailer rental or transport required. We handle on-site tune-ups, battery replacement, brake service, and electrical diagnostics, all backed by the same upfront pricing and service warranty you'd get in the shop.
              </p>
              <p className="text-muted-foreground mb-6">
                Available across all 50 states, mobile service saves you time and hassle while keeping your cart running at peak performance. Call to confirm availability in your area and book a visit.
              </p>
              <Button asChild data-testid="button-services-mobile">
                <Link href="/services/mobile-golf-cart-service" className="gap-2">
                  Explore Mobile Golf Cart Service
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg max-w-none text-muted-foreground">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
              How We Fix Golf Carts – Our Repair Process
            </h2>
            <p>
              When something goes wrong, you just want your cart running again. Our process is built to fix your golf cart quickly, honestly, and affordably — no guesswork and no surprise charges. Here's exactly how we fix golf carts, from your first call to the final test drive.
            </p>
          </div>
          <div className="max-w-5xl mx-auto mt-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {fixProcessSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="text-center" data-testid={`fix-step-${idx}`}>
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
          <div className="max-w-3xl mx-auto prose prose-lg max-w-none text-muted-foreground mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              How We Fix the 5 Most Common Golf Cart Problems
            </h3>
            <p>
              Most service calls come down to a handful of issues. Here are the most common golf cart problems and exactly how we fix them:
            </p>
          </div>
          <div className="max-w-4xl mx-auto mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {commonFixes.map((fix, idx) => {
                const Icon = fix.icon;
                return (
                  <div key={idx} className="rounded-lg border bg-card p-5" data-testid={`common-fix-${idx}`}>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary shrink-0" />
                      {fix.problem}
                    </h4>
                    <p className="text-sm text-muted-foreground">{fix.solution}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-muted-foreground mt-8">
              Whatever's wrong, we can get your cart fixed. Call{" "}
              <a href={PHONE_HREF} className="text-primary font-medium" data-testid="link-fix-phone">{PHONE_NUMBER}</a>{" "}
              to get your golf cart fixed fast.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-2 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Our Certified Golf Cart Technicians
              </h2>
              <p className="text-lg text-muted-foreground">
                Every golf cart services job is handled by factory-trained, experienced technicians who specialize in repair and maintenance across all major gas and electric cart brands.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {technicianProfiles.map((tech, idx) => (
                <div key={idx} className="flex items-start gap-4 rounded-lg border bg-card p-5" data-testid={`technician-${idx}`}>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{tech.role}</h3>
                    <p className="text-sm font-medium text-primary mb-1">{tech.focus}</p>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Golf Cart Service Areas
              </h2>
              <p className="text-lg text-muted-foreground">
                We provide golf cart services nationwide across all 50 states, with local service centers and mobile technicians in these areas and the surrounding communities.
              </p>
            </div>
            <ul className="flex flex-wrap justify-center gap-2 mb-8">
              {servicesStates.map((state, idx) => (
                <li key={idx} className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-foreground" data-testid={`service-area-${idx}`}>
                  <MapPin className="h-4 w-4 text-primary" />
                  {state}
                </li>
              ))}
            </ul>
            <div className="text-center">
              <Button variant="outline" asChild data-testid="button-services-locations">
                <Link href="/locations" className="gap-2">
                  Find a Golf Cart Service Location Near You
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Affordable Golf Cart Services FAQs
              </h2>
              <p className="text-lg text-muted-foreground">
                Answers to the most common questions about our golf cart repair and maintenance services.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {serviceFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} data-testid={`faq-item-${idx}`}>
                  <AccordionTrigger className="text-left font-semibold" data-testid={`faq-question-${idx}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${idx}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Don't See What You Need?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            We offer many more services not listed here. Call us to discuss your specific golf cart needs!
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-services-footer-call">
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

export default function Services() {
  const [, params] = useRoute("/services/:id");

  if (params?.id) {
    return <ServiceDetail serviceId={params.id} />;
  }

  return <ServicesList />;
}
