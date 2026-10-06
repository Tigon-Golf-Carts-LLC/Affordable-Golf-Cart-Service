import { Link } from "wouter";
import { Phone, Shield, Clock, Award, Wrench, ArrowRight, MapPin, Star, CheckCircle } from "lucide-react";
import { FaGoogle, FaStar, FaQuoteLeft, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/ServiceCard";
import { services, serviceCategories, getServicesByCategory } from "@shared/services";
import { useState } from "react";
import { SITE_DOMAIN } from "@shared/blog";
import { useSeo } from "@/lib/seo";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import heroImage from "@assets/a-professional-photograph-capturing-a-ma_lX6RWzJQUiaVFmNohW0hX_1781287551640.jpg";

const PHONE_NUMBER = "1-888-502-7074";
import { trackServicePhoneClick } from "@/lib/lead-analytics";
const PHONE_HREF = "tel:+18885027074";

const REVIEWS = [
  { name: "James R.", location: "The Villages, FL", text: "Called about my Club Car not starting and they had a tech out the next morning. Honest pricing, no surprises — my cart runs like new!" },
  { name: "Linda M.", location: "Scottsdale, AZ", text: "I was quoted a fair price over the phone and that's exactly what I paid. The technician was professional and quick. Highly recommend!" },
  { name: "Robert T.", location: "Charleston, SC", text: "Best golf cart service I've used. They handled my battery replacement and brake job the same day. Five stars all the way." },
  { name: "Patricia K.", location: "Austin, TX", text: "Friendly dispatch, a certified tech, and a warranty on the work. Couldn't ask for more. I'll definitely be calling them again." },
  { name: "Michael S.", location: "San Diego, CA", text: "Fast response and totally transparent. My EZ-GO needed a motor rebuild and they walked me through every step. Great experience." },
  { name: "Susan B.", location: "Naples, FL", text: "Quick scheduling and the repair was done right the first time. The peace of mind is absolutely worth it." },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const displayedServices = selectedCategory
    ? getServicesByCategory(selectedCategory).slice(0, 8)
    : services.slice(0, 8);

  useSeo({
    title: "Golf Cart Service Nationwide | Repair & Maintenance | Villages",
    description:
      "Professional golf cart service nationwide. Golf cart repair, maintenance, battery replacement, brake service, and tune-ups for all makes and models. Call 1-888-502-7074.",
    canonical: `${SITE_DOMAIN}/`,
    jsonLd: [organizationJsonLd(), websiteJsonLd()],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary text-secondary-foreground pt-20 pb-28 md:pt-32 md:pb-40">
        <img src={heroImage} alt="Certified golf cart service technician beside a repaired golf cart" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-secondary/80"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 via-secondary/60 to-secondary/95"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground font-semibold text-sm border border-primary/30 backdrop-blur-sm shadow-[0_0_15px_rgba(231,104,46,0.3)]">
              <MapPin className="h-4 w-4" />
              Nationwide Phone-Based Service
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              The Villages <span className="text-primary inline-block">Golf Cart Services</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary-foreground/80 max-w-2xl mx-auto leading-relaxed font-medium">
              Over 100 professional services. Transparent pricing. Certified technicians. Nationwide coverage. Your peace of mind starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 font-bold shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1" asChild>
                <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")} className="gap-2">
                  <Phone className="h-6 w-6 fill-current" />
                  Call {PHONE_NUMBER}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 font-bold bg-white/5 border-white/20 hover:bg-white/10 hover:text-white" asChild>
                <Link href="/services">
                  Browse 100+ Services
                </Link>
              </Button>
            </div>

            <div className="flex justify-center pt-6">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/15 rounded-full pl-3 pr-5 py-2 backdrop-blur-sm" data-testid="badge-hero-rating">
                <FaGoogle className="w-5 h-5 shrink-0" />
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="w-4 h-4" />)}
                </div>
                <span className="text-secondary-foreground/90 font-semibold text-sm">4.9/5 from 2,000+ happy customers</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 pt-8 text-sm font-semibold text-secondary-foreground/60">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Transparent Pricing</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> All Makes & Models</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Licensed & Insured</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Strip */}
      <section className="bg-primary text-primary-foreground py-8 relative -mt-10 mx-4 md:mx-auto container rounded-2xl shadow-2xl z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
          <div className="flex flex-col items-center text-center gap-2">
            <Shield className="h-8 w-8 opacity-90" />
            <h3 className="font-bold text-lg">Licensed & Insured</h3>
            <p className="text-primary-foreground/80 text-sm font-medium">100% Protected Service</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Wrench className="h-8 w-8 opacity-90" />
            <h3 className="font-bold text-lg">Certified Techs</h3>
            <p className="text-primary-foreground/80 text-sm font-medium">Expert Diagnostics</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Award className="h-8 w-8 opacity-90" />
            <h3 className="font-bold text-lg">Guaranteed Quality</h3>
            <p className="text-primary-foreground/80 text-sm font-medium">Satisfaction Promised</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <MapPin className="h-8 w-8 opacity-90" />
            <h3 className="font-bold text-lg">50 State Coverage</h3>
            <p className="text-primary-foreground/80 text-sm font-medium">Nationwide Support</p>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">
              Golf Cart Services with <span className="text-primary">Upfront Pricing</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              No hidden fees. No surprises. Just honest, expert golf cart repair and maintenance.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              className="font-bold rounded-full"
              onClick={() => setSelectedCategory(null)}
            >
              Popular Services
            </Button>
            {serviceCategories.slice(0, 5).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="font-bold rounded-full bg-muted/50 border-transparent hover:border-primary/50"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
            <Button variant="ghost" asChild className="rounded-full font-bold text-primary hover:text-primary hover:bg-primary/10">
              <Link href="/services">View All 100+ <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="inline-block border-primary/20 bg-primary/5 shadow-lg max-w-2xl w-full">
              <CardContent className="p-8 sm:p-12 flex flex-col items-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                  <Phone className="h-10 w-10 text-white fill-current" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Need a repair not listed here?</h3>
                <p className="text-muted-foreground font-medium mb-8 text-lg">
                  We offer over 100 specialized services. Call our experts for a quick quote and schedule your service today.
                </p>
                <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-lg" asChild>
                  <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")}>Call {PHONE_NUMBER} Now</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works / Trust Section */}
      <section className="py-20 md:py-32 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="text-primary border-primary font-bold px-3 py-1">Simple & Stress-Free</Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">How Our Nationwide Golf Cart Service Works</h2>
                <p className="text-lg text-muted-foreground font-medium">
                  We've streamlined the repair process so you don't have to worry. One phone call connects you with certified technicians ready to help.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shrink-0">1</div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Call for a Quote</h4>
                    <p className="text-muted-foreground font-medium">Tell us what's wrong. We provide transparent price ranges for all services upfront.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shrink-0">2</div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Schedule Service</h4>
                    <p className="text-muted-foreground font-medium">We coordinate with local certified technicians in your state for fast, reliable repair.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shrink-0">3</div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Get Back to Riding</h4>
                    <p className="text-muted-foreground font-medium">Enjoy your fully repaired cart, backed by our quality satisfaction guarantee.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button size="lg" className="font-bold h-12" asChild>
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 items-stretch">
              <div className="space-y-4">
                <Card className="bg-background shadow-md border-border/50 p-6 flex flex-col items-center text-center hover-elevate">
                  <Star className="w-10 h-10 text-yellow-400 fill-yellow-400 mb-3" />
                  <h4 className="font-bold text-xl">Top Rated</h4>
                  <p className="text-sm text-muted-foreground font-medium mt-2">Trusted by cart owners nationwide</p>
                </Card>
                <Card className="bg-background shadow-md border-border/50 p-6 flex flex-col items-center text-center hover-elevate">
                  <Clock className="w-10 h-10 text-primary mb-3" />
                  <h4 className="font-bold text-xl">Fast Response</h4>
                  <p className="text-sm text-muted-foreground font-medium mt-2">Quick scheduling & turnaround</p>
                </Card>
              </div>
              <div className="space-y-4">
                <Card className="bg-background shadow-md border-border/50 p-6 flex flex-col items-center text-center hover-elevate">
                  <Shield className="w-10 h-10 text-primary mb-3" />
                  <h4 className="font-bold text-xl">Warrantied</h4>
                  <p className="text-sm text-muted-foreground font-medium mt-2">Service you can count on</p>
                </Card>
                <Card className="bg-secondary text-secondary-foreground shadow-md p-6 flex flex-col items-center text-center hover-elevate">
                  <Wrench className="w-10 h-10 text-primary mb-3" />
                  <h4 className="font-bold text-xl text-white">All Brands</h4>
                  <p className="text-sm text-secondary-foreground/80 font-medium mt-2">Club Car, EZ-GO, Yamaha & more</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 md:py-32 bg-background" data-testid="section-reviews">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <Badge variant="outline" className="text-primary border-primary font-bold px-3 py-1">Trusted Nationwide</Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">What Our Customers Say</h2>
            <p className="text-lg text-muted-foreground font-medium">What golf cart owners across the country are saying about our service.</p>
          </div>

          <div className="flex justify-center mb-14">
            <div className="inline-flex items-center gap-4 sm:gap-6 bg-card border border-card-border rounded-2xl shadow-lg px-6 sm:px-8 py-5" data-testid="badge-google-rating">
              <FaGoogle className="w-9 h-9 shrink-0" />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-extrabold text-foreground">4.9</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <FaStar key={i} className="w-4 h-4" />)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-semibold">Based on 2,000+ Google reviews</p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-border" />
              <div className="hidden sm:flex flex-col items-center">
                <span className="text-2xl font-extrabold text-primary">98%</span>
                <span className="text-xs text-muted-foreground font-semibold text-center leading-tight">Would<br/>Recommend</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <Card key={i} className="bg-card border-border/50 shadow-md p-6 flex flex-col hover-elevate" data-testid={`card-review-${i}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, s) => <FaStar key={s} className="w-4 h-4" />)}
                  </div>
                  <FaGoogle className="w-5 h-5 text-muted-foreground" />
                </div>
                <FaQuoteLeft className="w-6 h-6 text-primary/20 mb-2" />
                <p className="text-foreground/90 font-medium leading-relaxed flex-1">{review.text}</p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm" data-testid={`text-review-name-${i}`}>{review.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">{review.location}</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold text-muted-foreground shrink-0">Customer</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Don't let a broken cart ruin your day.
          </h2>
          <p className="text-xl font-medium opacity-90 mb-10 max-w-2xl mx-auto">
            Our expert dispatchers are standing by to get your repair scheduled immediately.
          </p>
          <Button size="lg" variant="secondary" className="h-16 px-10 text-xl font-bold shadow-xl hover:scale-105 transition-transform" asChild>
            <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")} className="gap-3">
              <Phone className="h-6 w-6 fill-current" />
              Call Now: {PHONE_NUMBER}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}