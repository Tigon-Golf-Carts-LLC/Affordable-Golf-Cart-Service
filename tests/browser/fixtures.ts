import { test as base, expect, type Locator, type Request, type Route } from "@playwright/test";

export const DRAFT_KEY = "villages-service-inquiry-draft";
export const SUCCESS = "Thank you. We received your message and will contact you shortly.";

type Delivery = {
  requests: Request[];
  respond: (route: Route) => Promise<void>;
};

export const test = base.extend<{ delivery: Delivery }>({
  delivery: [async ({ context, baseURL }, use) => {
    // Refuse configuration drift to a published site, even if the fixture
    // would intercept its current lead endpoints.
    if (baseURL !== "http://127.0.0.1:4173") {
      throw new Error("Lead regressions must use the isolated frontend on port 4173");
    }
    const delivery: Delivery = {
      requests: [],
      respond: (route) => route.fulfill({ json: { ok: true } }),
    };
    // Default-deny every non-GET request, not just today's two lead endpoints.
    // Block external traffic too (maps, analytics, and any future direct webhook).
    await context.route("**/*", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin !== new URL(baseURL!).origin) return route.abort("blockedbyclient");
      if (!["GET", "HEAD"].includes(request.method())) {
        if (
          request.method() === "POST" &&
          ["/api/tigon-leads", "/api/tigon-inquiries"].includes(url.pathname)
        ) {
          delivery.requests.push(request);
          return delivery.respond(route);
        }
        return route.abort("blockedbyclient");
      }
      return route.continue();
    });
    await use(delivery);
  }, { auto: true }],
});

export { expect };

export async function fillRequired(form: Locator) {
  await form.getByLabel("First Name", { exact: true }).fill("Browser");
  await form.getByLabel("Last Name", { exact: true }).fill("Regression");
  await form.getByLabel("Phone Number", { exact: true }).fill("(555) 010-2000");
  await form.getByLabel("Email Address", { exact: true }).fill("browser@example.invalid");
}

// Decode the actual browser-generated multipart body rather than reading the DOM.
export async function submittedForm(request: Request) {
  const body = request.postDataBuffer();
  if (!body) throw new Error("Missing multipart submission body");
  return new Response(new Uint8Array(body), {
    headers: { "content-type": request.headers()["content-type"] },
  }).formData();
}
