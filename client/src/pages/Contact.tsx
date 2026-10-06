import { Phone, Mail, MapPin, Clock, Headset, Info } from "lucide-react";
import { SITE_DOMAIN } from "@shared/blog";
import { useSeo } from "@/lib/seo";
import { organizationJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TigonLeadForm } from "@/components/TigonLeadForm";

const PHONE_NUMBER = "1-888-502-7074";
import { trackServicePhoneClick } from "@/lib/lead-analytics";
const PHONE_HREF = "tel:+18885027074";

export default function Contact() {
  useSeo({
    title: "Contact | Golf Cart Service Dispatch | Villages",
    description:
      "Contact Villages Golf Cart Services for fast, nationwide golf cart service and repair. Call 1-888-502-7074, Mon-Sat 8AM-5PM, for transparent pricing in all 50 states.",
    canonical: `${SITE_DOMAIN}/contact`,
    jsonLd: [
      organizationJsonLd(),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <Badge variant="outline" className="border-primary text-primary font-bold px-3 py-1 mb-6 bg-primary/10">
            Contact Us
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            We're Here to Help.
          </h1>
          <p className="text-xl text-secondary-foreground/80 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
            The fastest way to get your golf cart serviced is to call our nationwide dispatch center. Real humans, transparent pricing.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 relative z-20 -mt-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            
            {/* Contact Info Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Primary CTA Card */}
              <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden hover-elevate">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <Headset className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold mb-2">Call Dispatch</h2>
                    <p className="font-medium opacity-90 text-sm">For immediate pricing and scheduling</p>
                  </div>
                  <Button size="lg" variant="secondary" className="w-full h-14 text-xl font-bold shadow-lg text-primary" asChild>
                    <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")}>{PHONE_NUMBER}</a>
                  </Button>
                </CardContent>
              </Card>

              {/* Secondary Info */}
              <Card className="border-border/50 shadow-md">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Email Us</h3>
                      <a href="mailto:info@villagesgolfcartservices.com" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors break-all">
                        info@villagesgolfcartservices.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Dispatch Hours</h3>
                      <p className="text-sm font-medium text-muted-foreground">Mon - Sat: 8:00 AM - 5:00 PM</p>
                      <p className="text-sm font-medium text-muted-foreground">Sunday: Closed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Service Area</h3>
                      <p className="text-sm font-medium text-muted-foreground">Nationwide Phone-Based Dispatch.</p>
                      <p className="text-sm font-medium text-muted-foreground">Serving all 50 US States.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card className="border-border/50 shadow-xl p-2 sm:p-4">
                <CardContent className="p-6 sm:p-8 space-y-8">
                  <div>
                    <h2 className="text-2xl font-extrabold text-foreground mb-2">Send us a message</h2>
                    <p className="text-muted-foreground font-medium">Prefer writing? Fill out the form below and a service representative will contact you shortly.</p>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex gap-3 text-sm font-medium text-foreground/80">
                    <Info className="w-5 h-5 text-primary shrink-0" />
                    <p>For the fastest response and accurate price quotes, calling our dispatch center at <strong className="text-foreground">{PHONE_NUMBER}</strong> is highly recommended.</p>
                  </div>

                  <TigonLeadForm />
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

// Simple Badge component for this file
function Badge({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: "default" | "outline" }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}