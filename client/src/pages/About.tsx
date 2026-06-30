import { useEffect } from "react";
import { Link } from "wouter";
import {
  Phone,
  Shield,
  Users,
  Award,
  Clock,
  Wrench,
  CheckCircle,
  ArrowRight,
  Cpu,
  Fuel,
  Disc,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PHONE_NUMBER = "1-844-844-4070";
const PHONE_HREF = "tel:+18448444070";

const SITE_URL = "https://affordablegolfcartservice.com";
const ABOUT_TITLE =
  "Golf Car Mechanic | Meet Our Certified Golf Cart Repair Technicians | Affordable Golf Cart Service";
const ABOUT_DESCRIPTION =
  "Meet the certified golf car mechanics at Affordable Golf Cart Service — factory-trained on EZGO, Club Car & Yamaha with years of repair experience. Call 1-844-844-4070 to book your service.";

const mechanics = [
  {
    id: "electric-drive-mechanics",
    icon: Cpu,
    name: "Electric Drive Mechanics",
    focus: "Motors, controllers & lithium systems",
    description:
      "Each electric-drive golf car mechanic on our team diagnoses and repairs drive motors, speed controllers, solenoids, and both lead-acid and lithium battery systems. They use professional diagnostic equipment to pinpoint power loss, range, and charging problems on every major brand.",
    certifications: ["EZGO", "Club Car", "Yamaha"],
    knowsAbout: [
      "golf cart repair",
      "EZGO repair",
      "Club Car service",
      "lithium battery systems",
      "speed controller repair",
    ],
  },
  {
    id: "gas-engine-mechanics",
    icon: Fuel,
    name: "Gas Engine Mechanics",
    focus: "Carburetors, ignition & engine rebuilds",
    description:
      "Trained on both two-cycle and four-cycle golf cart engines, every gas golf car mechanic handles carburetor cleaning, fuel system repair, ignition tuning, governor adjustments, and full engine rebuilds to restore smooth, reliable power.",
    certifications: ["EZGO", "Club Car", "Yamaha"],
    knowsAbout: [
      "gas golf cart repair",
      "carburetor service",
      "engine rebuilds",
      "EZGO repair",
      "Yamaha golf cart service",
    ],
  },
  {
    id: "brake-safety-mechanics",
    icon: Disc,
    name: "Brake & Safety Mechanics",
    focus: "Brakes, steering, suspension & tires",
    description:
      "These technicians inspect and repair braking systems, steering, suspension, and tires so your cart stops, handles, and rides safely every single time it leaves our shop or a mobile visit.",
    certifications: ["Club Car", "EZGO", "Yamaha"],
    knowsAbout: [
      "golf cart brake repair",
      "suspension repair",
      "steering service",
      "tire service",
    ],
  },
  {
    id: "mobile-service-mechanics",
    icon: Truck,
    name: "Mobile Service Mechanics",
    focus: "On-site repair & maintenance",
    description:
      "Our mobile golf car mechanics bring the shop to you, performing tune-ups, battery service, electrical diagnostics, and many repairs on-site at your home, golf community, or business across all 50 states.",
    certifications: ["EZGO", "Club Car", "Yamaha"],
    knowsAbout: [
      "mobile golf cart repair",
      "golf cart maintenance",
      "battery service",
      "electrical diagnostics",
    ],
  },
];

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
  useEffect(() => {
    document.title = ABOUT_TITLE;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", ABOUT_DESCRIPTION);
    }

    const orgId = `${SITE_URL}/#organization`;
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["LocalBusiness", "Organization"],
          "@id": orgId,
          name: "Affordable Golf Cart Service",
          description:
            "Professional golf cart repair, maintenance, and customization performed by certified golf car mechanics across the US.",
          telephone: "+1-844-844-4070",
          url: SITE_URL,
          areaServed: "United States",
          employee: mechanics.map((m) => ({
            "@id": `${SITE_URL}/about#${m.id}`,
          })),
        },
        ...mechanics.map((m) => ({
          "@type": "Person",
          "@id": `${SITE_URL}/about#${m.id}`,
          name: m.name,
          jobTitle: "Golf Cart Mechanic",
          description: m.description,
          knowsAbout: m.knowsAbout,
          worksFor: { "@id": orgId },
        })),
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "about-structured-data";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("about-structured-data");
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet Our Certified Golf Car Mechanics
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              When you need a golf car mechanic you can trust, our factory-trained team delivers honest, expert repair and maintenance for every make and model — backed by years of hands-on experience.
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
                At Affordable Golf Cart Service, every golf car mechanic on our team is dedicated to providing top-quality golf cart maintenance, repair, and customization at prices that won't break the bank. Our technicians bring years of expertise to every job, ensuring your cart receives the care it deserves.
              </p>
              <p className="text-muted-foreground mb-4">
                Whether you need a simple tune-up, battery replacement, brake service, or a complete custom makeover, our mechanics have the skills and equipment to handle it all. We service all makes and models, including Club Car, EZ-GO, Yamaha, and more.
              </p>
              <p className="text-muted-foreground mb-6">
                We understand that your golf cart is an important investment, which is why we treat every cart as if it were our own. From routine maintenance to major repairs, you can count on a skilled golf car mechanic for honest, reliable service at fair prices.
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
              Our Certified Golf Car Mechanic Team
            </h2>
            <p className="text-lg text-muted-foreground">
              From electric drive systems to gas engines, brakes, and on-site mobile repair, every golf car mechanic on our team is factory-trained on the brands you drive — including EZGO, Club Car, and Yamaha.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {mechanics.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <Card key={tech.id} className="hover-elevate" data-testid={`card-mechanic-${idx}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">{tech.name}</h3>
                        <p className="text-sm font-medium text-primary mb-2">{tech.focus}</p>
                        <p className="text-sm text-muted-foreground mb-3">{tech.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {tech.certifications.map((cert) => (
                            <span
                              key={cert}
                              className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-background border rounded-full px-2.5 py-1"
                              data-testid={`badge-cert-${idx}-${cert.toLowerCase()}`}
                            >
                              <CheckCircle className="h-3.5 w-3.5 text-primary" />
                              {cert} Certified
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Our Mechanics?
            </h2>
            <p className="text-lg text-muted-foreground">
              We're committed to providing the best golf cart service experience in the industry.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              What Our Mechanics Repair
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our golf car mechanics handle over 100 different services to meet all your golf cart needs, including:
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
            Contact us today to schedule your golf cart service appointment. Our friendly team of mechanics is ready to help!
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
