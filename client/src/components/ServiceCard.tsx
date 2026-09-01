import { Link } from "wouter";
import { Phone, ArrowRight, Wrench, Battery, Circle, Gauge, Zap, Paintbrush, Sparkles, Search, Sparkle, Snowflake } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@/lib/data";
import { PHONE_HREF } from "@/lib/site";


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
      <Card className="hover-elevate transition-all duration-200" data-testid={`card-service-${service.id}`}>
        <CardHeader className="pb-2 flex flex-row items-start gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-2">
              {service.name}
            </h3>
            <Badge variant="secondary" className="mt-1 text-xs">
              {service.priceRange}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="pt-2">
          <Button asChild size="sm" className="w-full" data-testid={`button-call-${service.id}`}>
            <a href={PHONE_HREF}>
              <Phone className="h-3 w-3 mr-1" />
              Call Now
            </a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate transition-all duration-200 flex flex-col h-full" data-testid={`card-service-${service.id}`}>
      <CardHeader className="pb-3 flex flex-row items-start gap-3">
        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/services/${service.id}`}>
            <h3 className="font-semibold text-foreground leading-tight hover:text-primary transition-colors line-clamp-2" data-testid={`link-service-title-${service.id}`}>
              {service.name}
            </h3>
          </Link>
          <Badge variant="secondary" className="mt-2">
            {service.priceRange}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {service.description}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2">
          Category: {service.category}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-0">
        <Button asChild className="w-full" data-testid={`button-call-${service.id}`}>
          <a href={PHONE_HREF}>
            <Phone className="h-4 w-4 mr-2" />
            Call Now to Schedule Today!
          </a>
        </Button>
        <Link href={`/services/${service.id}`} className="w-full">
          <Button variant="outline" className="w-full" data-testid={`button-details-${service.id}`}>
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
