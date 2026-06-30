import { Link } from "wouter";
import {
  Phone,
  Download,
  Battery,
  Disc,
  CircleDot,
  Zap,
  Snowflake,
  CalendarCheck,
  ShieldCheck,
  CheckCircle2,
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
const PAGE_URL = `${SITE_URL}/services/golf-cart-tune-up`;
const PDF_URL = "/golf-cart-maintenance-checklist.pdf";
const PAGE_TITLE = "Golf Cart Maintenance & Tune-Up Services | Keep Your Cart Running";
const PAGE_DESCRIPTION =
  "Complete golf cart maintenance & tune-up services: battery care, tires, brakes, electrical checks & storage prep. Free maintenance checklist. Call 1-844-844-4070!";

const checklistSteps = [
  { name: "Check battery water levels", text: "Top off each lead-acid battery cell with distilled water to the proper level — never overfill." },
  { name: "Inspect brakes", text: "Test brake responsiveness, check pads and shoes for wear, and adjust brake cables as needed." },
  { name: "Clean terminals", text: "Remove corrosion from battery terminals and cable ends, then apply an anti-corrosion protectant." },
  { name: "Check tire pressure", text: "Set all tires to the recommended PSI and inspect tread and sidewalls for wear or cracks." },
  { name: "Test lights and signals", text: "Verify headlights, taillights, turn signals, horn, and gauges all work correctly." },
  { name: "Inspect motor brushes", text: "Check motor brushes for wear and listen for unusual motor noise that signals a problem." },
];

const maintenanceAreas = [
  {
    icon: Battery,
    title: "Battery Maintenance",
    body:
      "Batteries are the heart of an electric golf cart, and they're the number one reason carts lose range and power. Check water levels on lead-acid batteries monthly and top off with distilled water, keep terminals clean and free of corrosion, and make sure connections are tight. Charge batteries fully after each use and avoid deep discharges. A periodic load test catches a weak battery before it leaves you stranded — and replacing a single failing battery early can protect the rest of the pack.",
  },
  {
    icon: CircleDot,
    title: "Tire & Wheel Care",
    body:
      "Properly inflated tires improve range, ride comfort, and safety. Check tire pressure regularly and keep all tires at the manufacturer's recommended PSI, since underinflated tires drain batteries faster and wear unevenly. Inspect tread depth and sidewalls for cracks or dry rot, especially on carts that sit outdoors. Rotate tires periodically for even wear and confirm lug nuts are torqued correctly.",
  },
  {
    icon: Disc,
    title: "Brake Maintenance",
    body:
      "Reliable brakes are essential for safety. Inspect brake pads and shoes for wear, adjust brake cables so the pedal feels firm and responsive, and listen for grinding or squealing that points to worn components. For gas carts with hydraulic brakes, check the brake fluid level and condition. Address any soft, spongy, or uneven braking right away — brakes are not the place to wait.",
  },
  {
    icon: Zap,
    title: "Electrical System Checks",
    body:
      "A golf cart's electrical system ties everything together. Inspect wiring for frayed, loose, or corroded connections, and clean any terminals showing buildup. Test the solenoid, switches, and fuses, and confirm the speed controller and onboard computer respond correctly. Make sure all lights, signals, and accessories work. Catching a loose connection early prevents intermittent power loss and bigger failures down the road.",
  },
  {
    icon: Snowflake,
    title: "Storage Prep",
    body:
      "If your cart sits for the off-season, a little prep prevents springtime headaches. Fully charge the batteries and disconnect the main connector to reduce parasitic drain, clean and protect the terminals, and store the cart in a cool, dry place. Inflate tires properly or elevate the cart to prevent flat spots, and top off the battery charge periodically through the storage period so you're ready to roll when the season returns.",
  },
  {
    icon: CalendarCheck,
    title: "Seasonal Maintenance Checklist",
    body:
      "The easiest way to keep a golf cart reliable is to follow a consistent schedule. Monthly tasks cover the quick essentials — battery water, terminal cleaning, tire pressure, lights, and a brake check. Seasonal service goes deeper into electrical connections, charger testing, brake adjustment, and motor inspection. Annual maintenance includes a full battery load test, brake service, motor and controller inspection, and a complete multi-point safety check. Download our free checklist below to keep it all on track.",
  },
];

const maintenanceFaqs = [
  {
    question: "How often should I perform golf cart maintenance?",
    answer:
      "Do quick checks monthly (battery water, terminals, tire pressure, lights, and brakes), deeper maintenance each season (electrical connections, charger test, brake adjustment, motor inspection), and a full service annually including a battery load test and complete safety inspection.",
  },
  {
    question: "What does a golf cart tune-up include?",
    answer:
      "A tune-up typically includes a multi-point safety inspection, brake and accelerator adjustment, a battery and charging system check, tire pressure and tread inspection, and lubrication of moving parts — restoring smooth, reliable performance.",
  },
  {
    question: "Can I do golf cart maintenance myself?",
    answer:
      "Many basics — checking battery water, cleaning terminals, setting tire pressure, and testing lights — are easy to do yourself with our free checklist. For brake service, motor and controller work, and full load testing, professional service is recommended. Call 1-844-844-4070 if you'd rather we handle it.",
  },
];

export default function GolfCartMaintenance() {
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
          "@type": "HowTo",
          name: "Golf Cart Maintenance Checklist",
          description:
            "A step-by-step golf cart maintenance checklist to keep your electric or gas golf cart running reliably.",
          totalTime: "PT45M",
          tool: [
            { "@type": "HowToTool", name: "Distilled water" },
            { "@type": "HowToTool", name: "Tire pressure gauge" },
            { "@type": "HowToTool", name: "Wire brush or terminal cleaner" },
          ],
          step: checklistSteps.map((s, idx) => ({
            "@type": "HowToStep",
            position: idx + 1,
            name: s.name,
            text: s.text,
            url: `${PAGE_URL}#step-${idx + 1}`,
          })),
        },
        {
          "@type": "Service",
          name: "Golf Cart Maintenance & Tune-Up Services",
          serviceType: "Golf Cart Maintenance",
          description:
            "Professional golf cart maintenance and tune-up services including battery care, tire and wheel service, brake maintenance, electrical checks, and storage prep.",
          url: PAGE_URL,
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
          mainEntity: maintenanceFaqs.map((faq) => ({
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
    script.id = "maintenance-structured-data";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("maintenance-structured-data");
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
            <Badge variant="secondary" className="mb-4" data-testid="badge-maintenance-hero">
              <CalendarCheck className="h-3 w-3 mr-1" />
              Keep Your Cart Running
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Golf Cart Maintenance
              <span className="text-primary block">&amp; Tune-Up Services</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Regular golf cart maintenance prevents costly breakdowns and keeps your cart running like new. From battery care and tire service to brakes, electrical checks, and storage prep, our certified technicians handle it all — and our free maintenance checklist helps you stay on track between visits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-maintenance-hero-call">
                <a href={PHONE_HREF} className="gap-2">
                  <Phone className="h-5 w-5" />
                  Schedule Service: {PHONE_NUMBER}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-maintenance-hero-pdf">
                <a href={PDF_URL} download className="gap-2">
                  <Download className="h-5 w-5" />
                  Free Maintenance Checklist
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg max-w-none text-muted-foreground">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Why Golf Cart Maintenance Matters
            </h2>
            <p>
              A golf cart is a real investment, and like any vehicle it runs best when it's cared for on a regular schedule. Routine golf cart maintenance does more than keep your cart looking good — it protects your battery pack, extends the life of expensive components, keeps you safe, and saves you money by catching small problems before they become major repairs. Whether you use your cart on the course, around a community, on a farm, or for work, a little preventative care goes a long way.
            </p>
            <p>
              The good news is that much of golf cart maintenance is simple and routine. By following a consistent checklist — monthly quick checks, deeper seasonal service, and an annual full inspection — you can avoid the most common causes of breakdowns. Below we break down the key areas of golf cart maintenance, and you can download our free printable checklist to keep everything on schedule. When a job calls for professional tools or expertise, our certified technicians are just a phone call away.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Key Areas of Golf Cart Maintenance
            </h2>
            <p className="text-lg text-muted-foreground">
              The essentials that keep your cart safe, reliable, and ready to go.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
            {maintenanceAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <Card key={idx} data-testid={`card-maintenance-${idx}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{area.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{area.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Golf Cart Maintenance Checklist
              </h2>
              <p className="text-lg text-muted-foreground">
                Follow these six steps to keep your golf cart in top shape.
              </p>
            </div>
            <ol className="space-y-4">
              {checklistSteps.map((step, idx) => (
                <li
                  key={idx}
                  id={`step-${idx + 1}`}
                  className="flex items-start gap-4"
                  data-testid={`maintenance-step-${idx}`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{step.name}</h3>
                    <p className="text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border bg-primary/10 p-6">
              <div className="flex items-start gap-3">
                <Download className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold text-foreground">Free Printable Maintenance Checklist</h3>
                  <p className="text-sm text-muted-foreground">
                    Download our one-page golf cart maintenance checklist covering monthly, seasonal, and annual tasks.
                  </p>
                </div>
              </div>
              <Button asChild data-testid="button-maintenance-pdf-download">
                <a href={PDF_URL} download className="gap-2 shrink-0">
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Golf Cart Maintenance FAQs
              </h2>
              <p className="text-lg text-muted-foreground">
                Common questions about keeping your golf cart well maintained.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {maintenanceFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`maintenance-faq-${idx}`} data-testid={`maintenance-faq-item-${idx}`}>
                  <AccordionTrigger className="text-left font-semibold" data-testid={`maintenance-faq-question-${idx}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`maintenance-faq-answer-${idx}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Certified Technicians
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Transparent Pricing
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Prefer to let the pros handle it? Explore our full range of{" "}
              <Link href="/services" className="text-primary hover:text-primary/80 font-medium" data-testid="link-maintenance-services">
                golf cart services
              </Link>{" "}
              or schedule a professional tune-up today.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Keep Your Golf Cart Running Like New
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Schedule professional golf cart maintenance and tune-up service with our certified technicians today.
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-maintenance-cta-call">
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
