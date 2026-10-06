import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getTigonTrackingFields, TIGON_TRACKING_FIELDS } from "@/lib/tigon-lead";
import { getCurrentRouteCategory, trackLeadEvent } from "@/lib/lead-analytics";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
]);
const ALLOWED_FILE_EXTENSIONS = /\.(jpe?g|png|gif|webp|heic)$/i;
const INQUIRY_DRAFT_KEY = "villages-service-inquiry-draft";

type SubmissionStatus = {
  kind: "success" | "error";
  message: string;
};

const hiddenFields = [
  "url",
  "referrer",
  ...TIGON_TRACKING_FIELDS,
  "ga_client_id",
];

type TigonLeadFormProps = {
  variant?: "contact" | "inquiry";
  onSubmittingChange?: (submitting: boolean) => void;
};

export function TigonLeadForm({
  variant = "contact",
  onSubmittingChange,
}: TigonLeadFormProps) {
  const formId = useId().replace(/:/g, "");
  const idFor = (field: string) => `tigon-${formId}-${field}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus | null>(null);

  useEffect(() => {
    const form = formRef.current;
    if (variant !== "inquiry" || !form) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem(INQUIRY_DRAFT_KEY) || "{}") as Record<
        string,
        string
      >;
      for (const [name, value] of Object.entries(saved)) {
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLInputElement && field.type === "file") continue;
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
          field.value = value;
        }
      }
    } catch {
      // Draft recovery is best-effort when browser storage is unavailable.
    }
  }, [variant]);

  function handleDraftChange(event: ChangeEvent<HTMLFormElement>) {
    if (variant !== "inquiry") return;
    const values: Record<string, string> = {};
    for (const [name, value] of Array.from(new FormData(event.currentTarget).entries())) {
      if (typeof value === "string" && !hiddenFields.includes(name) && name !== "website") {
        values[name] = value;
      }
    }
    try {
      sessionStorage.setItem(INQUIRY_DRAFT_KEY, JSON.stringify(values));
    } catch {
      // Draft recovery is best-effort when browser storage is unavailable.
    }
  }

  function clearInquiryDraft() {
    if (variant !== "inquiry") return;
    try {
      sessionStorage.removeItem(INQUIRY_DRAFT_KEY);
    } catch {
      // Ignore storage failures; the submission has already completed.
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const phone = form.elements.namedItem("phone1") as HTMLInputElement;
    const phoneDigits = phone.value.replace(/\D/g, "");

    phone.setCustomValidity(
      phoneDigits.length < 10 ? "Enter a phone number with at least 10 digits." : "",
    );
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const honeypot = String(data.get("website") || "").trim();
    if (honeypot) {
      form.reset();
      clearInquiryDraft();
      setStatus({
        kind: "success",
        message: "Thank you. We received your message and will contact you shortly.",
      });
      return;
    }

    try {
      for (const name of ["image_1", "image_2", "image_3"]) {
        const input = form.elements.namedItem(name) as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) {
          data.delete(name);
          continue;
        }

        const hasAllowedType =
          ALLOWED_FILE_TYPES.has(file.type) || ALLOWED_FILE_EXTENSIONS.test(file.name);
        if (!hasAllowedType) {
          throw new Error(`${file.name} must be a JPG, PNG, GIF, WebP, or HEIC image.`);
        }
        if (file.size > MAX_FILE_BYTES) {
          throw new Error("Each photo must be 10 MB or smaller.");
        }
      }

      data.set("form_name", variant === "inquiry" ? "Service inquiry" : "Contact form");
      for (const [name, value] of Object.entries(getTigonTrackingFields())) {
        data.set(name, value);
      }

      setIsSubmitting(true);
      onSubmittingChange?.(true);
      setStatus(null);
      const submissionRouteCategory = getCurrentRouteCategory();
      const response = await fetch(
        variant === "inquiry"
          ? import.meta.env.VITE_INQUIRY_RELAY_URL || "/api/tigon-inquiries"
          : import.meta.env.VITE_LEAD_RELAY_URL || "/api/tigon-leads",
        {
          method: "POST",
          body: data,
        },
      );
      const responseData = await response.json().catch(() => null);

      if (response.status === 429) {
        throw new Error("Too many attempts. Please wait a minute and try again.");
      }
      if (!response.ok || responseData?.ok !== true) {
        throw new Error(
          responseData?.error || "Sorry, we couldn't send your message. Please call us instead.",
        );
      }

      trackLeadEvent("lead_form_submitted", variant, submissionRouteCategory);
      form.reset();
      clearInquiryDraft();
      setStatus({
        kind: "success",
        message: "Thank you. We received your message and will contact you shortly.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof TypeError
            ? "We couldn't connect. Please check your connection and try again, or call us."
            : error instanceof Error
            ? error.message
            : "Sorry, we couldn't send your message. Please call us instead.",
      });
    } finally {
      setIsSubmitting(false);
      onSubmittingChange?.(false);
    }
  }

  const fieldClassName = "h-12 bg-muted/30 focus-visible:ring-primary";
  const fileAccept = "image/jpeg,image/png,image/gif,image/webp,image/heic,.heic";

  return (
    <form
      ref={formRef}
      className="space-y-6"
      onSubmit={handleSubmit}
      onChange={handleDraftChange}
      encType="multipart/form-data"
    >
      <p className="text-sm text-muted-foreground">
        First name, last name, phone, and email are required. All other details and photos are optional.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor={idFor("first-name")} className="font-bold text-foreground">First Name</Label>
          <Input
            id={idFor("first-name")}
            name="first_name"
            autoComplete="given-name"
            placeholder="John"
            className={fieldClassName}
            data-testid="input-first-name"
            required
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor={idFor("last-name")} className="font-bold text-foreground">Last Name</Label>
          <Input
            id={idFor("last-name")}
            name="last_name"
            autoComplete="family-name"
            placeholder="Doe"
            className={fieldClassName}
            data-testid="input-last-name"
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor={idFor("phone1")} className="font-bold text-foreground">Phone Number</Label>
          <Input
            id={idFor("phone1")}
            name="phone1"
            type="tel"
            autoComplete="tel"
            placeholder="(555) 123-4567"
            className={fieldClassName}
            data-testid="input-phone"
            onInput={(event) => event.currentTarget.setCustomValidity("")}
            required
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor={idFor("email")} className="font-bold text-foreground">Email Address</Label>
          <Input
            id={idFor("email")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            className={fieldClassName}
            data-testid="input-email"
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor={idFor("phone2")} className="font-bold text-foreground">Alternate Phone</Label>
          <Input id={idFor("phone2")} name="phone2" type="tel" className={fieldClassName} />
        </div>
        <div className="space-y-3">
          <Label htmlFor={idFor("address")} className="font-bold text-foreground">Address</Label>
          <Input
            id={idFor("address")}
            name="address"
            autoComplete="street-address"
            className={fieldClassName}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor={idFor("zip")} className="font-bold text-foreground">ZIP Code</Label>
          <Input
            id={idFor("zip")}
            name="zip_code"
            inputMode="numeric"
            autoComplete="postal-code"
            className={fieldClassName}
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor={idFor("state")} className="font-bold text-foreground">State</Label>
          <Input id={idFor("state")} name="state" placeholder="e.g. Florida" className={fieldClassName} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor={idFor("model")} className="font-bold text-foreground">Golf Cart Model</Label>
          <Input id={idFor("model")} name="model" placeholder="If known" className={fieldClassName} />
        </div>
        <div className="space-y-3">
          <Label htmlFor={idFor("brand")} className="font-bold text-foreground">Brand</Label>
          <Input id={idFor("brand")} name="brand" placeholder="If known" className={fieldClassName} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor={idFor("vin")} className="font-bold text-foreground">VIN (optional)</Label>
          <Input id={idFor("vin")} name="vin_number" className={fieldClassName} />
        </div>
        <div className="space-y-3">
          <Label htmlFor={idFor("sku")} className="font-bold text-foreground">Stock # / SKU (optional)</Label>
          <Input id={idFor("sku")} name="sku_number" className={fieldClassName} />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor={idFor("comments")} className="font-bold text-foreground">How can we help?</Label>
        <Textarea
          id={idFor("comments")}
          name="comments"
          placeholder="Please describe your golf cart issue, make, and model..."
          className="min-h-[150px] resize-y bg-muted/30 focus-visible:ring-primary text-base p-4"
          data-testid="input-message"
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm font-bold text-foreground">Photos (optional, up to 10 MB each)</p>
        {(["image_1", "image_2", "image_3"] as const).map((name, index) => (
          <div className="space-y-2" key={name}>
            <Label htmlFor={idFor(name)} className="font-medium">
              Photo {index + 1}
            </Label>
            <Input
              id={idFor(name)}
              name={name}
              type="file"
              accept={fileAccept}
              className="h-auto min-h-12 bg-muted/30 py-2"
            />
          </div>
        ))}
      </div>

      <div
        className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <Label htmlFor={idFor("website")}>Leave this field empty</Label>
        <Input
          id={idFor("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <input
        type="hidden"
        name="form_name"
        value={variant === "inquiry" ? "Service inquiry" : "Contact form"}
      />
      {hiddenFields.map((name) => (
        <input type="hidden" name={name} key={name} value="" />
      ))}

      {status && (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm font-semibold ${status.kind === "success" ? "text-green-700" : "text-destructive"}`}
        >
          {status.message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full h-14 text-lg font-bold"
        data-testid={variant === "inquiry" ? "button-submit-inquiry" : "button-submit-contact"}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending…" : variant === "inquiry" ? "Request Service" : "Send Message"}
      </Button>
    </form>
  );
}
