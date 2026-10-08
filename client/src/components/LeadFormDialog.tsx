import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ClipboardList, Phone, X } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { LeadForm, type LeadCart } from "@/components/LeadForm";
import { PHONE_HREF, PHONE_NUMBER } from "@/lib/site";

export interface LeadDialogOptions {
  /** Service the visitor was looking at, sent as `service_requested`. */
  service?: string;
  defaults?: { brand?: string; model?: string };
  cart?: LeadCart;
  title?: string;
}

const LeadDialogContext = createContext<(opts?: LeadDialogOptions) => void>(() => {});

/** Open the site-wide "Request Service" popup form. */
export function useLeadDialog() {
  return useContext(LeadDialogContext);
}

/**
 * One popup lead form shared by every page. Uses the native <dialog> element
 * for focus trapping, Esc-to-close and the backdrop, so no extra dependency.
 */
export function LeadDialogProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [opts, setOpts] = useState<LeadDialogOptions | null>(null);
  // Bumped on every open so the form remounts empty with the new pre-fill.
  const [key, setKey] = useState(0);

  const open = useCallback((next: LeadDialogOptions = {}) => {
    setOpts(next);
    setKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const dlg = ref.current;
    if (opts && dlg && !dlg.open) dlg.showModal();
  }, [opts, key]);

  const close = () => ref.current?.close();

  return (
    <LeadDialogContext.Provider value={open}>
      {children}
      <dialog
        ref={ref}
        onClose={() => setOpts(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        aria-labelledby="lead-dialog-title"
        className="w-[min(100%-2rem,42rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border bg-card text-card-foreground p-0 shadow-xl backdrop:bg-black/60"
        data-testid="dialog-lead"
      >
        {opts && (
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 id="lead-dialog-title" className="text-2xl font-bold text-foreground">
                {opts.title || "Request Service"}
              </h2>
              <Button variant="ghost" size="icon" onClick={close} aria-label="Close" data-testid="button-lead-dialog-close">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-muted-foreground mb-6">
              {opts.service ? <>Tell us about your cart and we'll follow up about <strong>{opts.service}</strong>. </> : "Tell us about your cart and we'll get back to you shortly. "}
              Need help now?{" "}
              <a href={PHONE_HREF} className="text-primary font-semibold whitespace-nowrap">
                Call {PHONE_NUMBER}
              </a>
            </p>
            <LeadForm key={key} formLocation="Request Service popup" service={opts.service} defaults={opts.defaults} cart={opts.cart} submitLabel="Send Request" />
          </div>
        )}
      </dialog>
    </LeadDialogContext.Provider>
  );
}

/** "Request Service" button that opens the popup form. Sits beside Call Now buttons. */
export function RequestServiceButton({
  service,
  defaults,
  cart,
  label = "Request Service Online",
  ...buttonProps
}: LeadDialogOptions & { label?: string } & Omit<ButtonProps, "onClick" | "children">) {
  const open = useLeadDialog();
  return (
    <Button type="button" variant="outline" onClick={() => open({ service, defaults, cart })} {...buttonProps}>
      <ClipboardList className="h-5 w-5" />
      {label}
    </Button>
  );
}
