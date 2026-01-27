import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { serviceCategories } from "@shared/services";

const PHONE_NUMBER = "1-844-844-6638";
const PHONE_HREF = "tel:+18448446638";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">AG</span>
              </div>
              <div>
                <span className="font-bold text-lg text-foreground">Affordable Golf Cart</span>
                <span className="block text-xs text-muted-foreground -mt-1">Service</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted partner for professional golf cart service, repair, and maintenance. We offer over 100 services to keep your cart running smoothly.
            </p>
            <a
              href={PHONE_HREF}
              className="flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
              data-testid="footer-link-phone"
            >
              <Phone className="h-5 w-5" />
              {PHONE_NUMBER}
            </a>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-services">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-contact">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Service Categories</h3>
            <ul className="space-y-2">
              {serviceCategories.slice(0, 6).map((category) => (
                <li key={category}>
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`footer-link-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary mt-1 shrink-0" />
                <div>
                  <span className="text-sm text-muted-foreground">Call Us</span>
                  <a href={PHONE_HREF} className="block text-sm font-medium text-foreground hover:text-primary">
                    {PHONE_NUMBER}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-1 shrink-0" />
                <div>
                  <span className="text-sm text-muted-foreground">Email</span>
                  <a href="mailto:info@affordablegolfcartservice.com" className="block text-sm font-medium text-foreground hover:text-primary">
                    info@affordablegolfcartservice.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-primary mt-1 shrink-0" />
                <div>
                  <span className="text-sm text-muted-foreground">Hours</span>
                  <span className="block text-sm font-medium text-foreground">Mon-Sat: 8AM-6PM</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                <div>
                  <span className="text-sm text-muted-foreground">Service Area</span>
                  <span className="block text-sm font-medium text-foreground">Serving Your Local Area</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Affordable Golf Cart Service. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            <a href="https://affordablegolfcartservice.com" className="hover:text-foreground transition-colors" data-testid="footer-link-website">
              affordablegolfcartservice.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
