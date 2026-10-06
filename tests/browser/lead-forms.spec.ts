import { test, expect, fillRequired, submittedForm, SUCCESS, DRAFT_KEY } from "./fixtures";

for (const variant of ["contact", "inquiry"] as const) {
  test.describe(variant, () => {
    const endpoint = variant === "contact" ? "/api/tigon-leads" : "/api/tigon-inquiries";
    const formName = variant === "contact" ? "Contact form" : "Service inquiry";
    const submitId = variant === "contact" ? "button-submit-contact" : "button-submit-inquiry";

    test.beforeEach(async ({ page }) => {
      await page.goto("/contact?utm_source=browser-test&utm_campaign=regression");
      if (variant === "inquiry") await page.getByTestId("button-global-request-service").click();
    });

    function form(page: import("@playwright/test").Page) {
      return variant === "contact" ? page.locator("main form") : page.getByRole("dialog").locator("form");
    }

    test("required fields, invalid email and short phone stop delivery", async ({ page, delivery }) => {
      const target = form(page);
      const submit = target.getByTestId(submitId);
      for (const label of ["First Name", "Last Name", "Phone Number", "Email Address"]) {
        await submit.click();
        const field = target.getByLabel(label, { exact: true });
        await expect(field).toBeFocused();
        expect(await field.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
        expect(delivery.requests).toHaveLength(0);
        await field.fill(label === "Phone Number" ? "5550102000" :
          label === "Email Address" ? "browser@example.invalid" : "Test");
      }
      const email = target.getByLabel("Email Address", { exact: true });
      await email.fill("not-an-email");
      await submit.click();
      expect(await email.evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
      await expect(email).toBeFocused();
      await email.fill("browser@example.invalid");
      const phone = target.getByLabel("Phone Number", { exact: true });
      await phone.fill("123");
      await submit.click();
      await expect(phone).toBeFocused();
      expect(await phone.evaluate((input: HTMLInputElement) => input.validationMessage))
        .toBe("Enter a phone number with at least 10 digits.");
      expect(delivery.requests).toHaveLength(0);
      await phone.fill("(555) 010-2000");
      await submit.click();
      await expect(target.getByRole("status")).toHaveText(SUCCESS);
      expect(delivery.requests).toHaveLength(1);
    });

    test("three photo uploads and optional fields reach the right multipart endpoint", async ({ page, delivery }) => {
      const target = form(page);
      await fillRequired(target);
      for (const [label, value] of [
        ["Alternate Phone", "5550103000"], ["Address", "Test address"],
        ["ZIP Code", "32162"], ["State", "Florida"], ["Golf Cart Model", "Test model"],
        ["Brand", "Test brand"], ["VIN (optional)", "TESTVIN"], ["Stock # / SKU (optional)", "TESTSKU"],
        ["How can we help?", "Test only — never delivered"],
      ]) await target.getByLabel(label, { exact: true }).fill(value);
      for (let i = 1; i <= 3; i++) {
        await target.getByLabel(`Photo ${i}`, { exact: true }).setInputFiles({
          name: `cart-${i}.png`, mimeType: "image/png", buffer: Buffer.from(`photo-${i}`),
        });
      }
      await target.getByTestId(submitId).click();
      await expect(target.getByRole("status")).toHaveText(SUCCESS);
      expect(delivery.requests).toHaveLength(1);
      const request = delivery.requests[0];
      expect(new URL(request.url()).pathname).toBe(endpoint);
      const data = await submittedForm(request);
      for (const [key, value] of Object.entries({
        form_name: formName, first_name: "Browser", last_name: "Regression",
        email: "browser@example.invalid", phone1: "(555) 010-2000",
        phone2: "5550103000", address: "Test address", zip_code: "32162", state: "Florida",
        model: "Test model", brand: "Test brand", vin_number: "TESTVIN", sku_number: "TESTSKU",
        comments: "Test only — never delivered", utm_source: "browser-test", utm_campaign: "regression",
      })) expect(data.get(key), key).toBe(value);
      expect(data.get("url")).toBe(page.url());
      for (let i = 1; i <= 3; i++) {
        const file = data.get(`image_${i}`) as File;
        expect(file.name).toBe(`cart-${i}.png`);
        expect(file.type).toBe("image/png");
        expect(await file.text()).toBe(`photo-${i}`);
        await expect(target.getByLabel(`Photo ${i}`, { exact: true })).toHaveValue("");
      }
      await expect(target.getByLabel("First Name", { exact: true })).toHaveValue("");
      await expect(target.getByLabel("How can we help?")).toHaveValue("");
      await expect(target.getByTestId(submitId)).toBeEnabled();
    });

    test("invalid and oversized photos are rejected locally; empty photos are omitted", async ({ page, delivery }) => {
      const target = form(page);
      await fillRequired(target);
      const photo = target.getByLabel("Photo 1", { exact: true });
      await photo.setInputFiles({ name: "not-a-photo.pdf", mimeType: "application/pdf", buffer: Buffer.from("pdf") });
      await target.getByTestId(submitId).click();
      await expect(target.getByRole("status")).toHaveText("not-a-photo.pdf must be a JPG, PNG, GIF, WebP, or HEIC image.");
      expect(delivery.requests).toHaveLength(0);
      await photo.setInputFiles({ name: "huge.png", mimeType: "image/png", buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
      await target.getByTestId(submitId).click();
      await expect(target.getByRole("status")).toHaveText("Each photo must be 10 MB or smaller.");
      expect(delivery.requests).toHaveLength(0);
      await photo.setInputFiles([]);
      await target.getByTestId(submitId).click();
      await expect(target.getByRole("status")).toHaveText(SUCCESS);
      const data = await submittedForm(delivery.requests[0]);
      for (let i = 1; i <= 3; i++) expect(data.has(`image_${i}`)).toBe(false);
    });

    test("pending delivery blocks duplicates and inquiry dismissal", async ({ page, delivery }) => {
      let release!: () => void;
      const pending = new Promise<void>((resolve) => { release = resolve; });
      delivery.respond = async (route) => {
        await pending;
        await route.fulfill({ json: { ok: true } });
      };
      const target = form(page);
      await fillRequired(target);
      const submit = target.getByTestId(submitId);
      await submit.click();
      await expect(submit).toBeDisabled();
      await expect(submit).toHaveText("Sending…");
      await expect.poll(() => delivery.requests.length).toBe(1);
      try {
        await target.getByLabel("First Name", { exact: true }).press("Enter");
        if (variant === "inquiry") {
          await page.keyboard.press("Escape");
          await expect(page.getByRole("dialog")).toBeVisible();
          await page.mouse.click(2, 2);
          await expect(page.getByRole("dialog")).toBeVisible();
          const close = page.getByRole("button", { name: "Close", exact: true });
          await close.focus();
          await close.press("Enter");
          await expect(page.getByRole("dialog")).toBeVisible();
        }
        expect(delivery.requests).toHaveLength(1);
      } finally {
        release();
      }
      await expect(target.getByRole("status")).toHaveText(SUCCESS);
      await expect(submit).toBeEnabled();
      if (variant === "inquiry") {
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toBeHidden();
      }
    });

    for (const failure of [
      { name: "server error", status: 503, json: { error: "Delivery unavailable. Please retry." }, message: "Delivery unavailable. Please retry." },
      { name: "rate limit", status: 429, json: {}, message: "Too many attempts. Please wait a minute and try again." },
      { name: "unsuccessful JSON", status: 200, json: { ok: false }, message: "Sorry, we couldn't send your message. Please call us instead." },
      { name: "invalid response body", status: 502, body: "Bad Gateway", message: "Sorry, we couldn't send your message. Please call us instead." },
      { name: "network failure", message: "We couldn't connect. Please check your connection and try again, or call us." },
    ]) {
      test(`${failure.name} keeps values and allows a successful retry`, async ({ page, delivery }) => {
        delivery.respond = (route) => "status" in failure
          ? route.fulfill({
              status: failure.status,
              ...("json" in failure ? { json: failure.json } : { body: failure.body }),
            })
          : route.abort("failed");
        const target = form(page);
        await fillRequired(target);
        await target.getByLabel("How can we help?").fill("Keep my details");
        await target.getByLabel("Photo 1", { exact: true }).setInputFiles({
          name: "retry.png", mimeType: "image/png", buffer: Buffer.from("retry photo"),
        });
        await target.getByTestId(submitId).click();
        await expect(target.getByRole("status")).toHaveText(failure.message);
        await expect(target.getByTestId(submitId)).toBeEnabled();
        await expect(target.getByLabel("First Name", { exact: true })).toHaveValue("Browser");
        await expect(target.getByLabel("How can we help?")).toHaveValue("Keep my details");
        expect(await target.getByLabel("Photo 1", { exact: true }).evaluate(
          (input: HTMLInputElement) => input.files?.[0]?.name,
        )).toBe("retry.png");
        if (variant === "inquiry") {
          const saved = await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!), DRAFT_KEY);
          expect(saved.comments).toBe("Keep my details");
        }
        delivery.respond = (route) => route.fulfill({ json: { ok: true } });
        await target.getByTestId(submitId).click();
        await expect(target.getByRole("status")).toHaveText(SUCCESS);
        expect(delivery.requests).toHaveLength(2);
      });
    }
  });
}
