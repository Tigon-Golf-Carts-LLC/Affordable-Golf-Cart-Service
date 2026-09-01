import { Link } from "wouter";
import { Phone, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";
import { PHONE_NUMBER, PHONE_HREF, SITE_URL } from "@/lib/site";
import { STATIC_PAGE_SEO } from "@shared/seo";

const { title: PAGE_TITLE, description: PAGE_DESCRIPTION } = STATIC_PAGE_SEO["/blog/golf-cart-repair-cost"];

const PAGE_URL = `${SITE_URL}/blog/golf-cart-repair-cost`;

const costTable = [
  { repair: "Diagnostic / Inspection", cost: "$50 – $150", notes: "Often waived if you proceed with the repair" },
  { repair: "Tune-Up & Maintenance", cost: "$100 – $450", notes: "Varies between electric and gas carts" },
  { repair: "Single Battery Replacement", cost: "$130 – $300", notes: "Per battery, lead-acid" },
  { repair: "Full Battery Pack (lead-acid)", cost: "$800 – $1,500", notes: "Typically 4–8 batteries" },
  { repair: "Full Battery Pack (lithium)", cost: "$1,200 – $3,600", notes: "Higher upfront, longer lifespan" },
  { repair: "Motor Repair / Replacement", cost: "$150 – $1,200", notes: "Repair is cheaper than full replacement" },
  { repair: "Speed Controller", cost: "$150 – $700", notes: "Repair, reprogram, or replace" },
  { repair: "Brake Repair", cost: "$30 – $300", notes: "Pads, shoes, cables, and drums" },
  { repair: "Electrical Diagnostics & Repair", cost: "$50 – $350", notes: "Wiring, solenoid, switches" },
  { repair: "Charger Repair / Replacement", cost: "$50 – $250", notes: "Onboard and external chargers" },
];

const guideFaqs = [
  {
    question: "How much does it cost to fix a golf cart that won't move?",
    answer:
      "A cart that won't move is most often a battery, solenoid, speed controller, or motor issue. Diagnostics run $50–$150, and the repair itself can range from a $130 battery to a $700 controller or up to $1,200 for motor work. A professional diagnosis is the cheapest way to avoid replacing the wrong part.",
  },
  {
    question: "Is it cheaper to repair or replace a golf cart battery?",
    answer:
      "If only one or two batteries in the pack have failed, replacing those individual batteries ($130–$300 each) is cheaper. If the whole pack is old and weak, a full replacement (lead-acid $800–$1,500 or lithium $1,200–$3,600) is the better long-term value.",
  },
  {
    question: "How much does golf cart motor repair cost?",
    answer:
      "Golf cart motor repair typically costs $150–$1,200. Replacing worn brushes or bearings is on the lower end, while a full motor replacement is on the higher end. Labor usually runs $75–$350 per hour.",
  },
  {
    question: "How can I find affordable golf cart repair near me?",
    answer:
      "Look for a shop that offers free or low-cost diagnostics, transparent upfront quotes, a service warranty, and works on your cart's brand. Call 1-844-844-4070 for affordable golf cart repair with transparent pricing across all 50 states.",
  },
];

export default function RepairCostGuide() {
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
          "@type": "Article",
          "@id": `${PAGE_URL}#article`,
          headline: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: PAGE_URL,
          author: {
            "@type": "Organization",
            name: "Affordable Golf Cart Service",
          },
          publisher: {
            "@type": "Organization",
            name: "Affordable Golf Cart Service",
            url: SITE_URL,
          },
          mainEntityOfPage: PAGE_URL,
        },
        {
          "@type": "FAQPage",
          mainEntity: guideFaqs.map((faq) => ({
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
    script.id = "guide-structured-data";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("guide-structured-data");
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
              Pricing Guide
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              How Much Does Golf Cart Repair Cost? A Complete Pricing Guide
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about golf cart repair costs in {new Date().getFullYear()} — from batteries and motors to brakes and electrical work — plus how to find affordable golf cart repair without overpaying.
            </p>
          </div>
        </div>
      </section>

      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg max-w-none text-muted-foreground">
            <p>
              If your golf cart has started slowing down, refusing to start, or making noises it shouldn't, your first question is probably: how much is this going to cost? The honest answer is that golf cart repair costs vary widely depending on the type of cart, the part that's failing, and where you live. Most individual repairs fall between $50 and $1,200, while a full battery pack replacement can run as high as $3,600. In this complete pricing guide, we'll break down what you can expect to pay for the most common golf cart repairs, explain when a do-it-yourself fix makes sense, and show you how to find{" "}
              <Link href="/services" className="text-primary font-medium" data-testid="link-guide-services-1">
                affordable golf cart repair
              </Link>{" "}
              you can trust.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Golf Cart Repair Cost Breakdown
            </h2>
            <p>
              Here's a quick reference table of typical golf cart repair costs. Use it as a starting point — your final price depends on your cart's make and model, the parts required, and your location. For an exact quote, see our full{" "}
              <Link href="/services" className="text-primary font-medium" data-testid="link-guide-services-2">
                golf cart services and pricing
              </Link>{" "}
              or call {PHONE_NUMBER}.
            </p>
          </div>

          <div className="max-w-3xl mx-auto my-8">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left" data-testid="table-guide-pricing">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 font-semibold text-foreground">Repair</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Typical Cost</th>
                      <th className="px-4 py-3 font-semibold text-foreground hidden sm:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costTable.map((row, idx) => (
                      <tr key={idx} className="border-b last:border-0" data-testid={`row-guide-${idx}`}>
                        <td className="px-4 py-3 font-medium text-foreground">{row.repair}</td>
                        <td className="px-4 py-3 text-primary font-semibold">{row.cost}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto prose prose-lg max-w-none text-muted-foreground">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Battery Replacement Costs
            </h2>
            <p>
              Batteries are the single biggest expense in golf cart ownership, and battery trouble is the most common reason a cart underperforms. A single lead-acid replacement battery costs roughly $130 to $300 installed. If your entire pack is worn out, expect to pay $800 to $1,500 for a complete lead-acid set (most carts use four to eight batteries). Lithium upgrades cost more upfront — typically $1,200 to $3,600 — but they last far longer, charge faster, and weigh less, which often makes them the more affordable choice over the life of the cart. Before replacing anything, a good technician will load-test each battery, because sometimes only one or two have failed and the rest are fine.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Motor Repair Costs
            </h2>
            <p>
              Motor problems show up as slow speeds, struggling on hills, overheating, or a cart that won't move at all. Motor repair generally costs $150 to $1,200. On the lower end, replacing worn brushes or bearings restores performance for a fraction of the cost of a new motor. On the higher end, a full motor replacement — including parts and labor — sits near the top of the range. Because labor runs $75 to $350 per hour, an accurate diagnosis matters: replacing a motor when the real problem is the speed controller is an expensive mistake.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Brake Repair Costs
            </h2>
            <p>
              Brakes are one of the more affordable repairs, typically costing $30 to $300. Simple cable adjustments are inexpensive, while replacing worn pads, shoes, and servicing the drums sits at the higher end. Because brakes are a safety system, this is not a repair to put off — spongy, grinding, or weak brakes should be inspected right away.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              Electrical & Charging Repair Costs
            </h2>
            <p>
              Electrical issues — bad solenoids, faulty key switches, damaged wiring, or a failing speed controller — typically cost $50 to $350 to diagnose and repair, while a controller replacement can reach $700. Charger problems are usually cheaper: testing and repairing an onboard or external charger runs $50 to $250. Since electrical faults can mimic battery or motor problems, professional diagnostics are the cheapest way to pinpoint the real cause.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              DIY vs. Professional Golf Cart Repair
            </h2>
            <p>
              Some golf cart maintenance is well within reach for a handy owner: checking and topping off battery water, cleaning corroded terminals, tightening cables, checking tire pressure, and replacing fuses are all reasonable DIY tasks that can save you money. The risk comes with bigger jobs. Diagnosing electrical faults, rebuilding a motor, programming a speed controller, or working around a high-voltage battery pack can be dangerous and, if done incorrectly, can damage expensive components or void warranties.
            </p>
            <div className="not-prose grid gap-4 sm:grid-cols-2 my-6">
              <Card data-testid="card-diy">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">Good DIY Tasks</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Battery watering, cleaning terminals, tire pressure, fuse swaps, and basic visual inspections.
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-pro">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h3 className="font-bold text-foreground">Leave to the Pros</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Motor work, controller programming, electrical diagnostics, and battery pack replacement.
                  </p>
                </CardContent>
              </Card>
            </div>
            <p>
              When the job goes beyond basic maintenance, professional{" "}
              <Link href="/services/golf-cart-repair" className="text-primary font-medium" data-testid="link-guide-repair">
                golf cart repair
              </Link>{" "}
              usually saves money in the long run by getting the diagnosis right the first time and protecting your warranty.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4">
              How to Find Affordable Golf Cart Repair
            </h2>
            <p>
              "Affordable" should never mean cutting corners. The best way to keep costs down is to choose a repair service that is transparent and trustworthy from the start. Look for these signs of a fair, affordable golf cart repair shop:
            </p>
            <ul>
              <li><strong>Upfront, transparent quotes</strong> covering parts and labor before any work begins.</li>
              <li><strong>Free or low-cost diagnostics</strong>, ideally waived if you proceed with the repair.</li>
              <li><strong>A service warranty</strong> and post-service inspection on every job.</li>
              <li><strong>Experience with your brand</strong> — EZGO, Club Car, Yamaha, and others.</li>
              <li><strong>Flexible options</strong> like mobile repair or pickup and delivery to save you time.</li>
            </ul>
            <p>
              By comparing quotes, asking about warranties, and choosing a technician who explains exactly what your cart needs and why, you can get quality repairs at a price that fits your budget. To see our full list of services with transparent pricing, visit our{" "}
              <Link href="/services" className="text-primary font-medium" data-testid="link-guide-services-3">
                affordable golf cart repair services
              </Link>{" "}
              page.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mt-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Golf Cart Repair Cost FAQs
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {guideFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`guide-faq-${idx}`} data-testid={`guide-faq-item-${idx}`}>
                  <AccordionTrigger className="text-left font-semibold" data-testid={`guide-faq-question-${idx}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`guide-faq-answer-${idx}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </article>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get an Exact Quote for Your Cart
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Stop guessing what your repair will cost. Call now for a free, transparent quote on affordable golf cart repair.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild data-testid="button-guide-cta-call">
              <a href={PHONE_HREF} className="gap-2">
                <Phone className="h-5 w-5" />
                Call Now: {PHONE_NUMBER}
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10" asChild data-testid="button-guide-cta-services">
              <Link href="/services" className="gap-2">
                View Services & Pricing
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
