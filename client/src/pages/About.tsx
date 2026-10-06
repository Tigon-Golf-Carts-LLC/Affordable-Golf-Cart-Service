import { Link } from "wouter";
import { Phone, Shield, Users, Award, Clock, CheckCircle2, ArrowRight, Wrench, MapPin } from "lucide-react";
import { SITE_DOMAIN } from "@shared/blog";
import { useSeo } from "@/lib/seo";
import { organizationJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PHONE_NUMBER = "1-888-502-7074";
import { trackServicePhoneClick } from "@/lib/lead-analytics";
const PHONE_HREF = "tel:+18885027074";

const guarantees = [
  { icon: Shield, title: "Licensed & Insured", desc: "Full protection for your valuable vehicle" },
  { icon: Users, title: "Certified Technicians", desc: "Expert care for all major cart brands" },
  { icon: Award, title: "Satisfaction Promised", desc: "We don't stop until the job is done right" },
  { icon: Clock, title: "Prompt Service", desc: "Fast scheduling to get you back riding" },
];

export default function About() {
  useSeo({
    title: "About Us | Nationwide Golf Cart Service | Villages",
    description:
      "Learn how Villages Golf Cart Services delivers nationwide golf cart service, connecting you with certified technicians for honest repairs in all 50 states. Call 1-888-502-7074.",
    canonical: `${SITE_DOMAIN}/about`,
    jsonLd: [
      organizationJsonLd(),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]),
    ],
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-secondary text-secondary-foreground py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="border-primary text-primary font-bold px-3 py-1 mb-6 bg-primary/10">About Us</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white">
            Built on Trust. <span className="text-primary">Driven by Expertise.</span>
          </h1>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl mx-auto font-medium leading-relaxed">
            We're a nationwide golf cart service network of certified professionals dedicated to transparent pricing, honest repairs, and keeping you on the move.
          </p>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
                We believe golf cart repair shouldn't be a hassle.
              </h2>
              <div className="w-20 h-1.5 bg-primary rounded-full"></div>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                Finding a reliable mechanic for your golf cart can be frustrating. You're never quite sure what the price will be, if the technicians are certified, or if they can even service your specific model.
              </p>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                Villages Golf Cart Services was built to solve exactly that. We operate as a nationwide phone-based service—one central hub connecting you to top-tier, vetted professionals in your area. We provide transparent price ranges before the work begins, ensuring you never face surprise bills.
              </p>
              <ul className="space-y-3 pt-4">
                {[
                  "No physical showrooms — lower overhead means better service value.",
                  "Over 100 specialized services for Club Car, EZ-GO, Yamaha, and more.",
                  "One phone number handles everything from quotes to scheduling."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                    <span className="font-semibold text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guarantees.map((g, i) => {
                const Icon = g.icon;
                return (
                  <Card key={i} className="bg-muted/30 border-border/50 hover-elevate">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{g.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{g.desc}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Scale */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20 text-center">
            <div className="py-4 md:py-0">
              <div className="text-5xl font-extrabold mb-2 text-white">50</div>
              <div className="text-lg font-bold uppercase tracking-wider opacity-90 flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" /> States Covered
              </div>
            </div>
            <div className="py-4 md:py-0">
              <div className="text-5xl font-extrabold mb-2 text-white">100+</div>
              <div className="text-lg font-bold uppercase tracking-wider opacity-90 flex items-center justify-center gap-2">
                <Wrench className="w-5 h-5" /> Professional Services
              </div>
            </div>
            <div className="py-4 md:py-0">
              <div className="text-5xl font-extrabold mb-2 text-white">1</div>
              <div className="text-lg font-bold uppercase tracking-wider opacity-90 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> Call Solves It All
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6">
            Experience the professional difference.
          </h2>
          <p className="text-xl text-muted-foreground font-medium mb-10">
            Our expert dispatchers are ready to answer your questions and provide transparent pricing for your cart's needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-lg" asChild>
              <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")} className="gap-2">
                <Phone className="w-5 h-5 fill-current" />
                Call {PHONE_NUMBER}
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold" asChild>
              <Link href="/services">Browse Our Services <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}