import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock, ShieldCheck, Wrench, Star } from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaGoogle } from "react-icons/fa";
import { serviceCategories } from "@shared/services";
import { usStates } from "@shared/states";
import { Button } from "@/components/ui/button";

import { trackServicePhoneClick } from "@/lib/lead-analytics";
const PHONE_NUMBER = "1-888-502-7074";
const PHONE_HREF = "tel:+18885027074";

export function Footer() {
  const featuredStateSlugs = ['florida', 'arizona', 'california', 'texas', 'south-carolina', 'north-carolina', 'georgia', 'pennsylvania'];
  const featuredStates = featuredStateSlugs
    .map(slug => usStates.find(s => s.slug === slug))
    .filter(Boolean) as typeof usStates;

  return (
    <footer className="bg-secondary text-secondary-foreground border-t mt-auto pt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block bg-white p-3 rounded-lg">
              <img src="/logo.png" alt="Villages Golf Cart Services" className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-secondary-foreground/80 leading-relaxed max-w-sm">
              Nationwide, phone-based professional golf cart service and repair. We bring the experts to you with transparent pricing and guaranteed satisfaction.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={PHONE_HREF}
                onClick={() => trackServicePhoneClick("footer")}
                className="flex items-center gap-3 text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
                data-testid="footer-link-phone"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Phone className="h-5 w-5 fill-current" />
                </div>
                {PHONE_NUMBER}
              </a>
              <div className="flex items-center gap-3 text-secondary-foreground/80 font-medium">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Licensed, Insured & Certified
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-5 text-white">Company</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/services", label: "All Services" },
                { href: "/states", label: "Service Areas" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact Us" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-secondary-foreground/70 hover:text-primary transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-bold text-lg mb-5 text-white">Top Services</h3>
            <ul className="space-y-3">
              {serviceCategories.slice(0, 6).map((category) => (
                <li key={category}>
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors font-medium flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-bold text-lg mb-5 text-white">Contact & Hours</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:info@villagesgolfcartservices.com" className="text-secondary-foreground/80 hover:text-primary transition-colors font-medium break-all">
                    info@villagesgolfcartservices.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-secondary-foreground/80 font-medium">
                  <p>Mon - Sat: 8:00 AM - 5:00 PM</p>
                  <p className="text-secondary-foreground/60 text-sm mt-0.5">Sunday: Closed</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-secondary-foreground/80 font-medium">
                  <p>Nationwide Coverage</p>
                  <p className="text-secondary-foreground/60 text-sm mt-0.5">We serve all 50 US States</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4" data-testid="footer-payments">
            <span className="text-sm font-semibold text-secondary-foreground/70">We Accept:</span>
            <div className="flex items-center gap-3 text-secondary-foreground/90">
              <FaCcVisa className="w-10 h-10" title="Visa" />
              <FaCcMastercard className="w-10 h-10" title="Mastercard" />
              <FaCcAmex className="w-10 h-10" title="American Express" />
              <FaCcDiscover className="w-10 h-10" title="Discover" />
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm font-semibold text-secondary-foreground/70">
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Licensed & Insured</span>
            <span className="flex items-center gap-2"><FaGoogle className="w-4 h-4" /> <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> 4.9 Rated</span></span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Satisfaction Guaranteed</span>
          </div>
        </div>

        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary-foreground/60 font-medium">
          <p>
            © {new Date().getFullYear()} Villages Golf Cart Services. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}