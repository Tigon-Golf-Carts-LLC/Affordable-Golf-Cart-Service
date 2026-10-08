/**
 * Inquiry and Contact regression: drives the built site in Chromium and checks
 * that every lead form posts what TIGON IOT expects.
 *
 * TIGON is never contacted: requests to the endpoint are intercepted and
 * answered locally, so the build should use a dummy TIGON_LEAD_ENDPOINT.
 *
 * Run: `TIGON_LEAD_ENDPOINT=https://tigoniot.com/hooks/TEST npm run build:site`
 *      then `npm run test:leads`.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Locator, type Page } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 4179);
const BASE = `http://localhost:${PORT}`;

const failures: string[] = [];
function check(ok: unknown, label: string) {
  console.log(`  ${ok ? "✓" : "✗"} ${label}`);
  if (!ok) failures.push(label);
}

/** Parse the text parts of a multipart body into name -> value (files -> filename). */
function parseMultipart(body: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of body.matchAll(/name="([^"]+)"(?:; filename="([^"]*)")?[^\r]*\r\n(?:[^\r]+\r\n)*\r\n([^\r]*)/g)) {
    out.set(m[1], m[2] !== undefined ? `file:${m[2]}` : m[3]);
  }
  return out;
}

interface Captured {
  contentType: string;
  fields: Map<string, string>;
}

async function fill(form: Locator, values: Record<string, string>) {
  for (const [name, value] of Object.entries(values)) await form.locator(`[name="${name}"]`).fill(value);
}

const VALID = { first_name: "Jane", last_name: "Sample", email: "jane.sample@example.com", phone1: "(555) 010-2000" };

const REQUIRED_NAMES = [
  "form_name", "first_name", "last_name", "phone1", "phone2", "address", "email", "zip_code", "model", "brand",
  "vin_number", "sku_number", "url", "comments", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_term",
  "utm_content", "gclid", "fbclid", "ga_client_id", "website",
];

async function contactPage(page: Page, posted: Captured[], reply: { status: number; body: string }) {
  console.log("\n/contact");
  await page.goto(`${BASE}/contact?utm_source=google&utm_medium=cpc&utm_campaign=spring-sale&gclid=GCLID1`);
  const form = page.locator("[data-testid=form-lead]").first();
  await form.waitFor();

  for (const name of REQUIRED_NAMES.filter((n) => n !== "form_name")) {
    check((await form.locator(`[name="${name}"]`).count()) === 1, `has field "${name}"`);
  }
  for (const name of ["image_1", "image_2", "image_3"]) {
    check((await form.locator(`input[type=file][name="${name}"]`).count()) === 1, `has photo input "${name}"`);
  }
  const trap = form.locator('[name="website"]');
  check((await trap.getAttribute("tabindex")) === "-1", "spam trap has tabindex=-1");
  check(!(await trap.isVisible()) || (await trap.boundingBox())!.x < 0, "spam trap is off-screen");

  // Empty submit: required-field errors, nothing sent.
  await form.locator("[data-testid=button-lead-submit]").click();
  const errors = (await form.locator("p.text-destructive").allTextContents()).join(" | ");
  check(/first name/i.test(errors) && /last name/i.test(errors) && /email/i.test(errors) && /phone/i.test(errors), "required-field errors shown");
  check(posted.length === 0, "empty form is not sent");

  // Bad email / short phone.
  await fill(form, { ...VALID, email: "not-an-email", phone1: "555-010" });
  await form.locator("[data-testid=button-lead-submit]").click();
  const errors2 = (await form.locator("p.text-destructive").allTextContents()).join(" | ");
  check(/valid email/i.test(errors2), "invalid email rejected");
  check(/10 digits/i.test(errors2), "phone under 10 digits rejected");
  check(posted.length === 0, "invalid form is not sent");

  // Oversized photo.
  await fill(form, VALID);
  await form.locator('[name="image_1"]').setInputFiles({ name: "big.jpg", mimeType: "image/jpeg", buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
  await form.locator("[data-testid=button-lead-submit]").click();
  check(/10 MB/i.test((await form.locator("p.text-destructive").allTextContents()).join(" ")), "photo over 10 MB rejected");
  check(posted.length === 0, "oversized photo is not sent");

  // Valid submission with one photo.
  await form.locator('[name="image_1"]').setInputFiles({ name: "cart.jpg", mimeType: "image/jpeg", buffer: Buffer.from([0xff, 0xd8, 0xff]) });
  await fill(form, { phone2: "(555) 010-3000", address: "12 Main St", zip_code: "19104", brand: "Club Car", model: "Precedent", comments: "Regression test" });
  reply.status = 200;
  reply.body = '{"ok":true,"id":"test"}';
  await form.locator("[data-testid=button-lead-submit]").click();
  await page.waitForFunction(() => /thank you/i.test(document.querySelector("[data-testid=text-lead-status]")?.textContent || ""), null, { timeout: 10_000 }).catch(() => {});
  check(/thank you/i.test((await form.locator("[data-testid=text-lead-status]").textContent()) || ""), "thank-you message shown");
  check(posted.length === 1, "exactly one request sent");
  const sent = posted[0];
  if (sent) {
    const f = sent.fields;
    check(sent.contentType.startsWith("multipart/form-data"), "sent as multipart/form-data");
    for (const name of REQUIRED_NAMES) check(f.has(name), `sent "${name}"`);
    check(f.get("form_name") === "Contact form", 'form_name = "Contact form"');
    check(f.get("first_name") === "Jane" && f.get("phone1") === "(555) 010-2000", "visitor details sent");
    check(f.get("utm_source") === "google" && f.get("gclid") === "GCLID1", "UTM / gclid sent");
    check(f.get("ga_client_id") === "123456.789012", "ga_client_id parsed from _ga cookie");
    check((f.get("url") || "").includes("/contact"), "page url sent");
    check(f.get("website") === "", "spam trap sent empty");
    check(f.get("image_1") === "file:cart.jpg", "photo sent as image_1");
    check(!f.has("image_2") && !f.has("image_3"), "empty photo inputs left out");
    check(!f.has("user_ip") && !f.has("user_agent"), "user_ip / user_agent not sent");
  }

  // Error from TIGON is shown to the visitor.
  posted.length = 0;
  reply.status = 429;
  reply.body = '{"ok":false,"error":"rate limited"}';
  await fill(form, VALID);
  await form.locator("[data-testid=button-lead-submit]").click();
  await page.waitForTimeout(1000);
  check(/wait a minute/i.test((await form.locator("[data-testid=text-lead-status]").textContent()) || ""), "HTTP 429 asks visitor to wait");
  check(await form.locator("[data-testid=button-lead-submit]").isEnabled(), "submit button re-enabled after error");
}

async function popup(page: Page, posted: Captured[], reply: { status: number; body: string }) {
  console.log("\nRequest Service popup (/services/club-car-repair)");
  posted.length = 0;
  reply.status = 200;
  reply.body = '{"ok":true,"id":"test2"}';
  await page.goto(`${BASE}/services/club-car-repair`);
  const open = page.locator('[data-testid="button-request-service-0"]');
  await open.waitFor();
  await open.click();
  const dialog = page.locator("[data-testid=dialog-lead]");
  check(await dialog.evaluate((d) => (d as HTMLDialogElement).open), "popup opens");
  const form = dialog.locator("[data-testid=form-lead]");
  check((await form.locator('[name="brand"]').inputValue()) === "Club Car", "brand pre-filled on Club Car page");
  await fill(form, VALID);
  await form.locator("[data-testid=button-lead-submit]").click();
  await page.waitForTimeout(1000);
  check(/thank you/i.test((await form.locator("[data-testid=text-lead-status]").textContent()) || ""), "popup thank-you shown");
  const f = posted[0]?.fields;
  check(f?.get("form_name") === "Contact form", 'popup form_name = "Contact form"');
  check(f?.get("form_location") === "Request Service popup", "popup form_location sent");
  check(f?.get("service_requested") === "Club Car Repair", "popup service_requested sent");
  check(f?.get("utm_source") === "google", "first-touch UTM remembered across pages");
  await page.keyboard.press("Escape");
  check(!(await dialog.evaluate((d) => (d as HTMLDialogElement).open)), "popup closes on Esc");
}

async function main() {
  console.log("→ Inquiry and Contact regression");
  const server = spawn(process.execPath, ["--import", "tsx", path.join(ROOT, "script", "serve-dist.ts")], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: "ignore",
  });
  try {
    for (let i = 0; i < 50; i++) {
      try {
        if ((await fetch(BASE + "/")).ok) break;
      } catch {
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    const browser = await chromium.launch();
    const context = await browser.newContext();
    await context.addCookies([{ name: "_ga", value: "GA1.1.123456.789012", url: BASE }]);
    const page = await context.newPage();
    const pageErrors: string[] = [];
    page.on("pageerror", (e) => pageErrors.push(String(e)));

    // Only the site and the (intercepted) lead endpoint; block third parties.
    const posted: Captured[] = [];
    const reply = { status: 200, body: '{"ok":true}' };
    await context.route(/^https?:\/\//, async (route) => {
      const req = route.request();
      const url = req.url();
      if (url.startsWith(BASE)) return route.continue();
      if (req.method() === "POST" && /\/hooks\//.test(url)) {
        posted.push({
          contentType: req.headers()["content-type"] || "",
          fields: parseMultipart(req.postDataBuffer()?.toString("latin1") || ""),
        });
        return route.fulfill({
          status: reply.status,
          contentType: "application/json",
          headers: { "access-control-allow-origin": "*" },
          body: reply.body,
        });
      }
      if (req.method() === "OPTIONS") return route.fulfill({ status: 204, headers: { "access-control-allow-origin": "*" } });
      return route.abort();
    });

    await contactPage(page, posted, reply);
    await popup(page, posted, reply);
    check(pageErrors.length === 0, `no page errors${pageErrors.length ? ": " + pageErrors.join("; ") : ""}`);
    await browser.close();
  } finally {
    server.kill();
  }

  if (failures.length) {
    console.error(`\n✗ ${failures.length} check(s) failed:\n  - ${failures.join("\n  - ")}`);
    process.exit(1);
  }
  console.log("\n✓ Inquiry and Contact regression passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
