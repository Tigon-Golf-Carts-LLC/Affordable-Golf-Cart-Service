import { Link } from "wouter";
import { Phone, ArrowRight, Wrench, Battery, Circle, Gauge, Zap, Paintbrush, Sparkles, Search, Sparkle, Snowflake, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@shared/services";

import { trackServicePhoneClick } from "@/lib/lead-analytics";
const PHONE_HREF = "tel:+18885027074";

const categoryIcons: Record<string, typeof Wrench> = {
  "Maintenance & Tune-Ups": Wrench,
  "Battery Services": Battery,
  "Tires & Wheels": Circle,
  "Brakes & Suspension": Gauge,
  "Electrical & Motor": Zap,
  "Body & Exterior": Paintbrush,
  "Accessories & Upgrades": Sparkles,
  "Inspections & Diagnostics": Search,
  "Cleaning & Detailing": Sparkle,
  "Seasonal Services": Snowflake,
};

interface ServiceCardProps {
  service: Service;
  variant?: "default" | "compact";
}

export function ServiceCard({ service, variant = "default" }: ServiceCardProps) {
  const Icon = categoryIcons[service.category] || Wrench;

  if (variant === "compact") {
    return (
      <Card className="hover-elevate transition-all duration-300 border-border/50 shadow-sm" data-testid={`card-service-${service.id}`}>
        <CardHeader className="p-4 flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/services/${service.id}`}>
              <h3 className="font-bold text-sm text-foreground leading-tight truncate hover:text-primary transition-colors">
                {service.name}
              </h3>
            </Link>
            <p className="text-primary font-bold text-sm mt-0.5">{service.priceRange}</p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate transition-all duration-300 flex flex-col h-full overflow-hidden border-border/50 group" data-testid={`card-service-${service.id}`}>
      <CardHeader className="p-5 pb-4 bg-muted/30">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <Badge variant="outline" className="bg-background/50 font-bold border-primary/20 text-primary">
            {service.priceRange}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{service.category}</p>
          <Link href={`/services/${service.id}`}>
            <h3 className="font-bold text-lg text-foreground leading-tight hover:text-primary transition-colors line-clamp-2" data-testid={`link-service-title-${service.id}`}>
              {service.name}
            </h3>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-5 pt-4 border-t border-border/50">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {service.description}
        </p>
        <ul className="mt-4 space-y-1.5">
          <li className="flex items-center gap-2 text-xs font-medium text-foreground/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Transparent Pricing
          </li>
          <li className="flex items-center gap-2 text-xs font-medium text-foreground/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Certified Techs
          </li>
        </ul>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex flex-col gap-3">
        <Button asChild className="w-full font-bold shadow-md hover:shadow-lg transition-all" data-testid={`button-call-${service.id}`}>
          <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("service_card")}>
            <Phone className="h-4 w-4 mr-2" />
            Call to Schedule
          </a>
        </Button>
        <Button asChild variant="ghost" className="w-full text-sm font-semibold text-muted-foreground hover:text-primary" data-testid={`button-details-${service.id}`}>
          <Link href={`/services/${service.id}`}>
            View Full Details <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}