import { Link } from "wouter";
import { Phone, Shield, Users, Award, Clock, Wrench, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PHONE_NUMBER = "1-844-844-6638";
const PHONE_HREF = "tel:+18448446638";

const features = [
  "Over 100 professional services",
  "Experienced certified technicians",
  "Mobile service available",
  "Competitive pricing",
  "Fast turnaround times",
  "Quality parts and materials",
  "All makes and models",
  "Satisfaction guaranteed",
];

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Affordable Golf Cart Service
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Your trusted partner for professional golf cart maintenance, repair, and customization services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Who We Are
              </h2>
              <p className="text-muted-foreground mb-4">
                At Affordable Golf Cart Service, we are dedicated to providing top-quality golf cart maintenance, repair, and customization services at prices that won't break the bank. Our team of experienced technicians brings years of expertise to every job, ensuring your golf cart receives the care it deserves.
              </p>
              <p className="text-muted-foreground mb-4">
                Whether you need a simple tune-up, battery replacement, brake service, or a complete custom makeover, we have the skills and equipment to handle it all. We service all makes and models, including Club Car, EZ-GO, Yamaha, and more.
              </p>
              <p className="text-muted-foreground mb-6">
                We understand that your golf cart is an important investment, which is why we treat every cart as if it were our own. From routine maintenance to major repairs, you can count on us for honest, reliable service at fair prices.
              </p>
              <Button asChild data-testid="button-about-contact">
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Licensed & Insured</h3>
                  <p className="text-sm text-muted-foreground">Fully certified for your peace of mind</p>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Expert Team</h3>
                  <p className="text-sm text-muted-foreground">Skilled technicians with years of experience</p>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <Award className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Quality Service</h3>
                  <p className="text-sm text-muted-foreground">Commitment to excellence every time</p>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Fast Turnaround</h3>
                  <p className="text-sm text-muted-foreground">Get back on the course quickly</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-muted-foreground">
              We're committed to providing the best golf cart service experience in the industry.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-3 rounded-lg bg-background">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We offer over 100 different services to meet all your golf cart needs, including:
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-left mb-10">
              <Card>
                <CardContent className="p-4">
                  <Wrench className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Maintenance & Tune-Ups</h3>
                  <p className="text-sm text-muted-foreground">Regular maintenance to keep your cart running smoothly</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Wrench className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Battery Services</h3>
                  <p className="text-sm text-muted-foreground">Testing, replacement, and maintenance for all battery types</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Wrench className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Electrical & Motor</h3>
                  <p className="text-sm text-muted-foreground">Expert diagnosis and repair of electrical systems</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Wrench className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Brakes & Suspension</h3>
                  <p className="text-sm text-muted-foreground">Safety-critical repairs and upgrades</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Wrench className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Body & Exterior</h3>
                  <p className="text-sm text-muted-foreground">Cosmetic repairs and custom paint services</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Wrench className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Custom Upgrades</h3>
                  <p className="text-sm text-muted-foreground">Lift kits, sound systems, lighting, and more</p>
                </CardContent>
              </Card>
            </div>
            <Button size="lg" asChild data-testid="button-about-services">
              <Link href="/services">
                View All 100+ Services
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Contact us today to schedule your golf cart service appointment. Our friendly team is ready to help!
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-about-call">
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
