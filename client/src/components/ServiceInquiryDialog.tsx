import { useState } from "react";
import { Wrench } from "lucide-react";
import { TigonLeadForm } from "@/components/TigonLeadForm";
import { Button } from "@/components/ui/button";
import { trackLeadEvent } from "@/lib/lead-analytics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ServiceInquiryDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) return;
    if (nextOpen && !open) trackLeadEvent("service_inquiry_opened", "inquiry");
    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="h-14 rounded-full px-6 text-base font-bold shadow-lg transition-transform duration-200 hover:-translate-y-0.5 sm:px-7"
          aria-label="Request golf cart service"
          data-testid="button-global-request-service"
        >
          <Wrench className="mr-2 h-5 w-5" aria-hidden="true" />
          Request Service
        </Button>
      </DialogTrigger>
      </div>
      <DialogContent
        className="max-h-[calc(100dvh-1.25rem)] w-[calc(100%-1.25rem)] max-w-3xl overflow-y-auto rounded-xl border-border bg-background p-5 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-8"
        onEscapeKeyDown={(event) => {
          if (isSubmitting) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (isSubmitting) event.preventDefault();
        }}
      >
        <DialogHeader className="mb-2 pr-8 text-left">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Villages Golf Cart Services
          </p>
          <DialogTitle className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Tell us what your cart needs
          </DialogTitle>
          <DialogDescription className="max-w-2xl text-sm leading-relaxed">
            Share a few details and our service team will follow up. Photos are optional and can
            help us understand the issue.
          </DialogDescription>
        </DialogHeader>
        <TigonLeadForm variant="inquiry" onSubmittingChange={setIsSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
