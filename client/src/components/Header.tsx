import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Phone, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { services, serviceCategories, getServicesByCategory } from "@shared/services";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const PHONE_NUMBER = "1-844-844-6638";
const PHONE_HREF = "tel:+18448446638";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">AG</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-foreground">Affordable Golf Cart</span>
              <span className="block text-xs text-muted-foreground -mt-1">Service</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.label === "Services" ? (
                <NavigationMenu key={link.href}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          isActive(link.href)
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        data-testid="nav-services-dropdown"
                      >
                        Services
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[700px] p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {serviceCategories.map((category) => (
                              <div key={category} className="space-y-2">
                                <Link
                                  href={`/services?category=${encodeURIComponent(category)}`}
                                  className="font-semibold text-sm text-primary hover:underline block"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {category}
                                </Link>
                                <ScrollArea className="h-32">
                                  <div className="space-y-1">
                                    {getServicesByCategory(category).map((service) => (
                                      <NavigationMenuLink key={service.id} asChild>
                                        <Link
                                          href={`/services/${service.id}`}
                                          className="block text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded px-2 py-1 transition-colors"
                                          data-testid={`nav-service-${service.id}`}
                                        >
                                          {service.name}
                                        </Link>
                                      </NavigationMenuLink>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <Link
                              href="/services"
                              className="text-sm font-medium text-primary hover:underline"
                              data-testid="nav-view-all-services"
                            >
                              View All 100 Services
                            </Link>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={PHONE_HREF}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              data-testid="link-phone-header"
            >
              <Phone className="h-4 w-4" />
              <span>{PHONE_NUMBER}</span>
            </a>
            <Button asChild className="hidden sm:flex" data-testid="button-call-now-header">
              <a href={PHONE_HREF}>
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </a>
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) =>
              link.label === "Services" ? (
                <div key={link.href}>
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(link.href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    data-testid="mobile-nav-services-toggle"
                  >
                    Services
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        mobileServicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileServicesOpen && (
                    <div className="ml-4 mt-2 space-y-1">
                      {serviceCategories.map((category) => (
                        <div key={category}>
                          <button
                            onClick={() =>
                              setExpandedCategory(
                                expandedCategory === category ? null : category
                              )
                            }
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent"
                          >
                            {category}
                            <ChevronRight
                              className={`h-4 w-4 transition-transform ${
                                expandedCategory === category ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                          {expandedCategory === category && (
                            <div className="ml-4 space-y-1">
                              {getServicesByCategory(category).map((service) => (
                                <Link
                                  key={service.id}
                                  href={`/services/${service.id}`}
                                  className="block px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded hover:bg-accent"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMobileServicesOpen(false);
                                  }}
                                  data-testid={`mobile-nav-service-${service.id}`}
                                >
                                  {service.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      <Link
                        href="/services"
                        className="block px-3 py-2 text-sm font-medium text-primary hover:underline"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileServicesOpen(false);
                        }}
                      >
                        View All Services
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href={PHONE_HREF}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary"
              data-testid="mobile-link-phone"
            >
              <Phone className="h-4 w-4" />
              {PHONE_NUMBER}
            </a>
            <Button asChild className="w-full mt-2" data-testid="mobile-button-call-now">
              <a href={PHONE_HREF}>
                <Phone className="h-4 w-4 mr-2" />
                Call Now to Schedule Today!
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
