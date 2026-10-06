import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Phone, Menu, X, ChevronDown, ChevronRight, MapPin, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { serviceCategories, getServicesByCategory } from "@shared/services";
import { usStates } from "@shared/states";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import { trackServicePhoneClick } from "@/lib/lead-analytics";
const PHONE_NUMBER = "1-888-502-7074";
const PHONE_HREF = "tel:+18885027074";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileStatesOpen, setMobileStatesOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [location] = useLocation();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/states", label: "States" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => location === href || (href !== "/" && location.startsWith(href));

  // Split states into 5 columns
  const stateColumns = Array.from({ length: 5 }, (_, i) => 
    usStates.slice(i * 10, (i + 1) * 10)
  );

  return (
    <>
      <div className="bg-secondary text-secondary-foreground text-sm py-2 px-4 text-center sm:text-left flex justify-center sm:justify-between items-center z-50 relative">
        <div className="hidden sm:flex items-center gap-4 text-xs font-medium opacity-90">
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Nationwide Golf Cart Service</span>
          <span className="flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5"/> 100+ Services Available</span>
        </div>
        <div className="flex items-center gap-3 font-semibold justify-center w-full sm:w-auto">
          <span className="opacity-90 hidden sm:inline text-xs">Call for Immediate Service:</span>
          <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("header_top")} className="flex items-center gap-1.5 hover:text-primary transition-colors text-base sm:text-sm">
            <Phone className="w-4 h-4 text-primary" /> {PHONE_NUMBER}
          </a>
        </div>
      </div>
      <header className={`sticky top-0 z-40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-all duration-200 ${scrolled ? 'shadow-md py-2' : 'border-b py-3'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img src="/logo.png" alt="Villages Golf Cart Services" className="h-10 sm:h-12 w-auto object-contain" />
              <div className="hidden lg:flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight">Villages</span>
                <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">Golf Cart Services</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) =>
                link.label === "Services" ? (
                  <NavigationMenu key={link.href}>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className={`bg-transparent px-3 py-2 text-sm font-semibold transition-colors ${
                            isActive(link.href)
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          data-testid="nav-services-dropdown"
                        >
                          Services
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[800px] p-6 grid grid-cols-2 gap-8">
                            <div className="col-span-2 flex items-center justify-between pb-4 border-b">
                              <div>
                                <h4 className="font-bold text-lg">Our Services</h4>
                                <p className="text-sm text-muted-foreground">Expert repair and maintenance for your golf cart</p>
                              </div>
                              <Button asChild variant="outline" size="sm">
                                <Link href="/services" data-testid="nav-view-all-services">View All 100+ Services</Link>
                              </Button>
                            </div>
                            {serviceCategories.map((category) => (
                              <div key={category} className="space-y-3">
                                <Link
                                  href={`/services?category=${encodeURIComponent(category)}`}
                                  className="font-bold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {category}
                                  <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all"/>
                                </Link>
                                <div className="grid grid-cols-1 gap-1">
                                  {getServicesByCategory(category).slice(0, 4).map((service) => (
                                    <NavigationMenuLink key={service.id} asChild>
                                      <Link
                                        href={`/services/${service.id}`}
                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 truncate"
                                        data-testid={`nav-service-${service.id}`}
                                      >
                                        {service.name}
                                      </Link>
                                    </NavigationMenuLink>
                                  ))}
                                  {getServicesByCategory(category).length > 4 && (
                                     <Link href={`/services?category=${encodeURIComponent(category)}`} className="text-xs text-primary font-medium mt-1">
                                        + {getServicesByCategory(category).length - 4} more
                                     </Link>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                ) : link.label === "States" ? (
                  <NavigationMenu key={link.href}>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className={`bg-transparent px-3 py-2 text-sm font-semibold transition-colors ${
                            isActive(link.href)
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          data-testid="nav-states-dropdown"
                        >
                          States
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[700px] p-6">
                            <div className="flex items-center justify-between pb-4 border-b mb-6">
                              <div>
                                <h4 className="font-bold text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Nationwide Coverage</h4>
                                <p className="text-sm text-muted-foreground">Select your state to see local service details</p>
                              </div>
                              <Button asChild variant="outline" size="sm">
                                <Link href="/states" data-testid="nav-view-all-states">View Map & All States</Link>
                              </Button>
                            </div>
                            <div className="grid grid-cols-5 gap-4">
                              {stateColumns.map((column, colIndex) => (
                                <div key={colIndex} className="space-y-1.5">
                                  {column.map((state) => (
                                    <NavigationMenuLink key={state.slug} asChild>
                                      <Link
                                        href={`/states/${state.slug}`}
                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5 truncate"
                                        data-testid={`nav-state-${state.slug}`}
                                        title={state.name}
                                      >
                                        {state.name}
                                      </Link>
                                    </NavigationMenuLink>
                                  ))}
                                </div>
                              ))}
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
                    className={`px-3 py-2 text-sm font-semibold transition-colors rounded-md ${
                      isActive(link.href)
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                    data-testid={`nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <Button asChild className="hidden lg:flex shadow-md hover:shadow-lg transition-all font-bold" data-testid="button-call-now-header">
                <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("header_desktop")}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden shrink-0"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 lg:hidden border-b shadow-xl bg-background/95 backdrop-blur-xl h-[calc(100vh-80px)] overflow-y-auto">
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
              {navLinks.map((link) =>
                link.label === "Services" ? (
                  <div key={link.href} className="bg-muted/30 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-base font-bold ${
                        isActive(link.href) ? "text-primary" : "text-foreground"
                      }`}
                      data-testid="mobile-nav-services-toggle"
                    >
                      Services
                      <ChevronDown className={`h-5 w-5 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    {mobileServicesOpen && (
                      <div className="px-4 pb-4 space-y-1">
                        <Link
                          href="/services"
                          className="block py-2 text-sm font-bold text-primary border-b border-border/50 mb-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          View All 100+ Services
                        </Link>
                        {serviceCategories.map((category) => (
                          <div key={category} className="border-b border-border/50 last:border-0">
                            <button
                              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                              className="w-full flex items-center justify-between py-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
                            >
                              {category}
                              <ChevronRight className={`h-4 w-4 transition-transform ${expandedCategory === category ? "rotate-90" : ""}`} />
                            </button>
                            {expandedCategory === category && (
                              <div className="pl-4 pb-3 space-y-2">
                                {getServicesByCategory(category).slice(0, 5).map((service) => (
                                  <Link
                                    key={service.id}
                                    href={`/services/${service.id}`}
                                    className="block py-1.5 text-sm text-muted-foreground hover:text-primary"
                                    onClick={() => setMobileMenuOpen(false)}
                                    data-testid={`mobile-nav-service-${service.id}`}
                                  >
                                    {service.name}
                                  </Link>
                                ))}
                                <Link href={`/services?category=${encodeURIComponent(category)}`} className="block py-1.5 text-xs font-bold text-primary uppercase tracking-wider" onClick={() => setMobileMenuOpen(false)}>
                                  See all in {category} →
                                </Link>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : link.label === "States" ? (
                  <div key={link.href} className="bg-muted/30 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setMobileStatesOpen(!mobileStatesOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-base font-bold ${
                        isActive(link.href) ? "text-primary" : "text-foreground"
                      }`}
                      data-testid="mobile-nav-states-toggle"
                    >
                      States Covered
                      <ChevronDown className={`h-5 w-5 transition-transform ${mobileStatesOpen ? "rotate-180" : ""}`} />
                    </button>
                    {mobileStatesOpen && (
                      <div className="px-4 pb-4">
                        <Link
                          href="/states"
                          className="block py-2 text-sm font-bold text-primary border-b border-border/50 mb-3"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          View Map & All 50 States
                        </Link>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {usStates.map((state) => (
                            <Link
                              key={state.slug}
                              href={`/states/${state.slug}`}
                              className="block py-1.5 text-sm text-muted-foreground hover:text-primary truncate"
                              onClick={() => setMobileMenuOpen(false)}
                              data-testid={`mobile-nav-state-${state.slug}`}
                            >
                              {state.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 text-base font-bold rounded-lg ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              
              <div className="mt-6 pt-6 border-t">
                <Button size="lg" asChild className="w-full font-bold shadow-lg" data-testid="mobile-button-call-now">
                  <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("header_mobile")}>
                    <Phone className="h-5 w-5 mr-2 fill-current" />
                    Call {PHONE_NUMBER}
                  </a>
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4 uppercase tracking-wider font-semibold">
                  Nationwide Service • Expert Techs
                </p>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}