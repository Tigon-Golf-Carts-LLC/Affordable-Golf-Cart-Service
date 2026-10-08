import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FORM_NAME, HONEYPOT, MAX_FILE_MB, buildLeadData, firstTouch, submitLead, trackingFields, validateLead, type FieldErrors } from "@/lib/leads";

/** A specific cart the lead is about. Rendered read-only so the lead shows it. */
export interface LeadCart {
  brand?: string;
  model?: string;
  vin_number?: string;
  sku_number?: string;
}

export interface LeadFormProps {
  /** Where on the site this form lives, e.g. "Contact page". Sent as `form_location`. */
  formLocation: string;
  /** Service the visitor was looking at. Sent as `service_requested`. */
  service?: string;
  /** Editable starting values (e.g. brand "Club Car" on the Club Car page). */
  defaults?: { brand?: string; model?: string };
  /** A specific listed cart: brand/model/VIN/SKU become read-only. */
  cart?: LeadCart;
  submitLabel?: string;
  className?: string;
  onSuccess?: () => void;
}

const BRANDS = ["Club Car", "E-Z-GO", "Yamaha", "TIGON", "Evolution", "Icon", "Star EV", "Advanced EV", "Denago", "Kandi", "Other"];

const SUCCESS_TEXT = "Thank you! We received your message and will contact you shortly.";

const TRACKING = ["url", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "ga_client_id"];

const textareaClass =
  "flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

export function LeadForm({ formLocation, service, defaults, cart, submitLabel = "Send", className, onSuccess }: LeadFormProps) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  // Capture landing-page UTMs as soon as the form mounts, and pre-fill the
  // hidden tracking inputs so a no-JS-fallback reader still sees them.
  useEffect(() => {
    firstTouch();
    const form = formRef.current;
    if (!form) return;
    const t = trackingFields();
    for (const k of TRACKING) {
      const el = form.elements.namedItem(k) as HTMLInputElement | null;
      if (el) el.value = t[k] || "";
    }
  }, []);

  const id = (name: string) => `${uid}-${name}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const found = validateLead(form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      setStatus("error");
      setMessage("Please fix the highlighted fields.");
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    setStatus("sending");
    setMessage("Sending…");
    try {
      await submitLead(buildLeadData(form));
      form.reset();
      setStatus("sent");
      setMessage(SUCCESS_TEXT);
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Sorry, something went wrong. Please try again or call us.");
    }
  }

  function field(name: string, label: ReactNode, input: ReactNode, half = true) {
    const err = errors[name];
    return (
      <div className={cn("flex flex-col gap-1.5", half ? "sm:col-span-1" : "sm:col-span-2")}>
        <label htmlFor={id(name)} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {input}
        {err && (
          <p id={id(name) + "-err"} className="text-sm text-destructive">
            {err}
          </p>
        )}
      </div>
    );
  }

  function aria(name: string) {
    return errors[name] ? { "aria-invalid": true, "aria-describedby": id(name) + "-err" } : {};
  }

  const req = <span className="text-destructive">*</span>;
  const sending = status === "sending";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onInput={(e) => {
        const name = (e.target as HTMLInputElement).name;
        if (name && errors[name]) setErrors(({ [name]: _cleared, ...rest }) => rest);
      }}
      noValidate
      encType="multipart/form-data"
      className={cn("relative", className)}
      data-testid="form-lead"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {field("first_name", <>First name {req}</>, <Input id={id("first_name")} name="first_name" type="text" autoComplete="given-name" required {...aria("first_name")} />)}
        {field("last_name", <>Last name {req}</>, <Input id={id("last_name")} name="last_name" type="text" autoComplete="family-name" required {...aria("last_name")} />)}
        {field("email", <>Email {req}</>, <Input id={id("email")} name="email" type="email" autoComplete="email" required {...aria("email")} />)}
        {field("phone1", <>Phone {req}</>, <Input id={id("phone1")} name="phone1" type="tel" autoComplete="tel" required {...aria("phone1")} />)}
        {field("phone2", "Alternate phone", <Input id={id("phone2")} name="phone2" type="tel" {...aria("phone2")} />)}
        {field("zip_code", "ZIP code", <Input id={id("zip_code")} name="zip_code" type="text" inputMode="numeric" autoComplete="postal-code" />)}
        {field("address", "Address", <Input id={id("address")} name="address" type="text" autoComplete="street-address" />, false)}

        {cart ? (
          <>
            {field("brand", "Brand", <Input id={id("brand")} name="brand" type="text" readOnly value={cart.brand || ""} />)}
            {field("model", "Model", <Input id={id("model")} name="model" type="text" readOnly value={cart.model || ""} />)}
            {field("vin_number", "VIN", <Input id={id("vin_number")} name="vin_number" type="text" readOnly value={cart.vin_number || ""} />)}
            {field("sku_number", "Stock # / SKU", <Input id={id("sku_number")} name="sku_number" type="text" readOnly value={cart.sku_number || ""} />)}
          </>
        ) : (
          <>
            {field(
              "brand",
              "Cart brand",
              <>
                <Input id={id("brand")} name="brand" type="text" list={id("brands")} defaultValue={defaults?.brand} placeholder="e.g. Club Car" />
                <datalist id={id("brands")}>
                  {BRANDS.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </>,
            )}
            {field("model", "Cart model", <Input id={id("model")} name="model" type="text" defaultValue={defaults?.model} placeholder="e.g. Precedent" />)}
            {field("vin_number", "VIN (optional)", <Input id={id("vin_number")} name="vin_number" type="text" />)}
            {field("sku_number", "Stock # / SKU (optional)", <Input id={id("sku_number")} name="sku_number" type="text" />)}
          </>
        )}

        {field(
          "comments",
          "Message",
          <textarea id={id("comments")} name="comments" rows={4} className={textareaClass} placeholder="Tell us what's going on with your cart and how we can help." />,
          false,
        )}

        <fieldset className="sm:col-span-2 grid gap-3 sm:grid-cols-3">
          <legend className="text-sm font-medium text-foreground mb-1.5">
            Photos (optional, up to {MAX_FILE_MB} MB each: JPG, PNG, GIF, WebP or HEIC)
          </legend>
          {(["image_1", "image_2", "image_3"] as const).map((name, i) => (
            <div key={name} className="flex flex-col gap-1">
              <label htmlFor={id(name)} className="sr-only">
                Photo {i + 1}
              </label>
              <Input
                id={id(name)}
                name={name}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/heic,.heic"
                className="h-auto py-1.5 cursor-pointer"
                {...aria(name)}
              />
              {errors[name] && (
                <p id={id(name) + "-err"} className="text-sm text-destructive">
                  {errors[name]}
                </p>
              )}
            </div>
          ))}
        </fieldset>
      </div>

      {/* Spam trap: off-screen, never seen by people; bots fill it in. Must be sent empty. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor={id(HONEYPOT)}>Leave this field empty</label>
        <input type="text" id={id(HONEYPOT)} name={HONEYPOT} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <input type="hidden" name="form_name" value={FORM_NAME} />
      <input type="hidden" name="form_location" value={formLocation} />
      {service && <input type="hidden" name="service_requested" value={service} />}
      {TRACKING.map((k) => (
        <input key={k} type="hidden" name={k} defaultValue="" />
      ))}

      <Button type="submit" size="lg" className="w-full mt-6" disabled={sending} data-testid="button-lead-submit">
        {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        {sending ? "Sending…" : submitLabel}
      </Button>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "mt-3 text-sm font-semibold min-h-[1.25rem]",
          status === "sent" && "text-primary flex items-center gap-2",
          status === "error" && "text-destructive",
          status === "sending" && "text-muted-foreground",
        )}
        data-testid="text-lead-status"
      >
        {status === "sent" && <CheckCircle2 className="h-5 w-5 shrink-0" />}
        {message}
      </p>
    </form>
  );
}
