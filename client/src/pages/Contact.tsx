import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { PHONE_NUMBER, PHONE_HREF, EMAIL_ADDRESS, EMAIL_HREF } from "@/lib/site";
import { STATIC_PAGE_SEO } from "@shared/seo";
import { usePageSeo } from "@/lib/usePageSeo";

export default function Contact() {
  usePageSeo(STATIC_PAGE_SEO["/contact"]);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions or ready to schedule service? Get in touch with our team today!
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                <Card className="hover-elevate">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        Speak directly with our service team
                      </p>
                      <a
                        href={PHONE_HREF}
                        className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
                        data-testid="contact-phone-link"
                      >
                        {PHONE_NUMBER}
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        Send us a message anytime
                      </p>
                      <a
                        href="mailto:info@affordablegolfcartservice.com"
                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                        data-testid="contact-email-link"
                      >
                        info@affordablegolfcartservice.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        When we're available to help
                      </p>
                      <div className="text-foreground">
                        <p>Monday - Saturday: 8:00 AM - 6:00 PM</p>
                        <p className="text-muted-foreground">Sunday: Closed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Service Area</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        We come to you!
                      </p>
                      <p className="text-foreground">
                        Mobile service available in your local area. Call for coverage details.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Talk to a Technician</h2>
                  </div>
                  <p className="text-muted-foreground">
                    This site is served as static files, so there is no contact form to submit.
                    Calling reaches a technician directly and is the fastest way to book service.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a
                    href={PHONE_HREF}
                    className="flex items-start gap-4 rounded-lg border p-4 hover-elevate transition-colors"
                    data-testid="link-contact-call-card"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Call for immediate service</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        Same-day and mobile appointments, free estimates over the phone.
                      </p>
                      <span className="text-primary font-semibold">{PHONE_NUMBER}</span>
                    </div>
                  </a>

                  <a
                    href={EMAIL_HREF + "?subject=" + encodeURIComponent("Golf cart service request")}
                    className="flex items-start gap-4 rounded-lg border p-4 hover-elevate transition-colors"
                    data-testid="link-contact-email-card"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email us your details</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        Include your cart make, model, and the symptoms you are seeing.
                      </p>
                      <span className="text-primary font-semibold break-all">{EMAIL_ADDRESS}</span>
                    </div>
                  </a>

                  <ul className="text-sm text-muted-foreground space-y-2 pt-2">
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Phone lines are staffed 7 days a week.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Mobile service comes to you — ask about coverage in your area.</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button size="lg" className="w-full" asChild data-testid="button-contact-call">
                    <a href={PHONE_HREF}>
                      <Phone className="h-5 w-5 mr-2" />
                      Call Now: {PHONE_NUMBER}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Schedule Service?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Don't wait - call now to speak with our friendly team and get your golf cart the service it needs!
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-contact-footer-call">
            <a href={PHONE_HREF} className="gap-2">
              <Phone className="h-5 w-5" />
              Call Now to Schedule Today!
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
