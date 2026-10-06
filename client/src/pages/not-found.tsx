import { Link } from "wouter";
import { Wrench, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PHONE_NUMBER = "1-888-502-7074";
import { trackServicePhoneClick } from "@/lib/lead-analytics";
const PHONE_HREF = "tel:+18885027074";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-background flex items-center justify-center py-20">
      <div className="container mx-auto px-4 max-w-2xl text-center space-y-8">
        
        <div className="relative inline-flex items-center justify-center">
          <div className="text-[150px] md:text-[200px] font-extrabold text-muted/30 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/20 rotate-12">
              <Wrench className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Oops! Looks like we took a wrong turn.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg mx-auto">
            The page you are looking for has been moved, deleted, or possibly never existed.
          </p>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="h-14 px-8 text-lg font-bold w-full sm:w-auto shadow-lg" asChild data-testid="404-call-button">
            <a href={PHONE_HREF} onClick={() => trackServicePhoneClick("page_cta")} className="gap-2">
              <Phone className="w-5 h-5 fill-current" />
              Call Dispatch Instead
            </a>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold w-full sm:w-auto" asChild data-testid="404-home-button">
            <Link href="/" className="gap-2">
              <ArrowLeft className="w-5 h-5" />
              Return Home
            </Link>
          </Button>
        </div>
        
        <div className="pt-12 text-sm font-semibold text-muted-foreground">
          Need a specific service? <Link href="/services" className="text-primary hover:underline">Browse all 100+ services here.</Link>
        </div>
      </div>
    </div>
  );
}