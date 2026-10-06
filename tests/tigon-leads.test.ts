import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { createServer } from "node:http";
import { registerRoutes } from "../server/routes";

test("TIGON proxy validates forms and forwards multipart leads without signing", async () => {
  const app = express();
  const server = createServer(app);
  await registerRoutes(server, app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const localUrl = `http://127.0.0.1:${address.port}/api/tigon-leads`;
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.TIGON_WEBHOOK_URL;
  const originalEnvironment = process.env.NODE_ENV;

  const originalOrigins = process.env.TIGON_ALLOWED_ORIGINS;
  let outboundCalls = 0;
  let outgoing: RequestInit | undefined;
  let outgoingUrl = "";
  let upstreamStatus = 200;
  let upstreamBody = '{"ok":true,"id":"test-only"}';

  globalThis.fetch = async (_url, options) => {
    outboundCalls++;
    outgoingUrl = String(_url);
    outgoing = options;
    return new Response(upstreamBody, {
      status: upstreamStatus,
      headers: { "Content-Type": "application/json" },
    });
  };

  function validForm() {
    const form = new FormData();
    const fields = {
      form_name: "Contact form",
      first_name: "Test",
      last_name: "Sample",
      email: "test@example.invalid",
      phone1: "(555) 010-2000",
      phone2: "5550103000",
      address: "Test address",
      zip_code: "19104",
      model: "Customer-entered model",
      brand: "Customer-entered brand",
      vin_number: "TESTVIN",
      sku_number: "TESTSKU",
      url: "https://villagesgolfcartservices.com/contact",
      comments: "Local automated test; never delivered",
      website: "",
      referrer: "https://example.invalid/",
      utm_source: "test",
      utm_medium: "test",
      utm_campaign: "test",
      utm_term: "test",
      utm_content: "test",
      gclid: "test-click",
      fbclid: "test-social-click",
      ga_client_id: "123456.789012",
    };
    for (const [field, value] of Object.entries(fields)) form.set(field, value);
    return form;
  }

  try {
    process.env.NODE_ENV = "development";
    delete process.env.TIGON_WEBHOOK_URL;
    let response = await originalFetch(localUrl, { method: "POST", body: validForm() });
    assert.equal(response.status, 503);
    assert.equal(outboundCalls, 0);
    response = await originalFetch(localUrl.replace("/api/tigon-leads", "/api/tigon-inquiries"), {
      method: "POST", body: validForm(),
    });
    assert.equal(response.status, 503);
    assert.equal(outboundCalls, 0);

    // This fake endpoint is intercepted above; tests never contact TIGON.
    process.env.TIGON_WEBHOOK_URL = "https://tigoniot.com/hooks/test-only";
    const badPhone = validForm();
    badPhone.set("phone1", "123");
    response = await originalFetch(localUrl, { method: "POST", body: badPhone });
    assert.equal(response.status, 400);
    assert.equal(outboundCalls, 0);

    const missingName = validForm();
    missingName.delete("first_name");
    response = await originalFetch(localUrl, { method: "POST", body: missingName });
    assert.equal(response.status, 400);
    assert.equal(outboundCalls, 0);

    const spam = validForm();
    spam.set("website", "spam");
    response = await originalFetch(localUrl, { method: "POST", body: spam });
    assert.equal(response.status, 200);
    assert.equal(outboundCalls, 0);

    const unsupportedPhoto = validForm();
    unsupportedPhoto.set("image_1", new Blob(["bad"]), "file.pdf");
    response = await originalFetch(localUrl, { method: "POST", body: unsupportedPhoto });
    assert.equal(response.status, 400);
    assert.equal(outboundCalls, 0);

    const oversizedPhoto = validForm();
    oversizedPhoto.set("image_1", new Blob([new Uint8Array(10 * 1024 * 1024 + 1)]), "large.png");
    response = await originalFetch(localUrl, { method: "POST", body: oversizedPhoto });
    assert.equal(response.status, 400);
    assert.equal(outboundCalls, 0);

    const form = validForm();
    form.set("user_ip", "must not be forwarded");
    form.set("user_agent", "must not be forwarded");
    form.set("image_1", new Blob(["photo bytes"], { type: "image/png" }), "photo.png");
    response = await originalFetch(localUrl, { method: "POST", body: form });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, id: "test-only" });
    assert.equal(outboundCalls, 1);
    assert.ok(outgoing?.body instanceof FormData);
    const forwarded = outgoing.body;
    for (const [key, value] of validForm().entries()) assert.equal(forwarded.get(key), value);
    const photo = forwarded.get("image_1");
    assert.ok(photo && typeof photo !== "string");
    assert.equal(photo.name, "photo.png");
    assert.equal(await photo.text(), "photo bytes");
    assert.equal(forwarded.has("user_ip"), false);
    assert.equal(forwarded.has("user_agent"), false);
    assert.equal(new Headers(outgoing.headers).has("X-Tigon-Signature"), false);
    assert.equal(new Headers(outgoing.headers).has("Content-Type"), false);

    const inquiryUrl = localUrl.replace("/api/tigon-leads", "/api/tigon-inquiries");
    const inquiry = validForm();
    inquiry.set("form_name", "Spoofed form");
    inquiry.set("url", "https://villagesgolfcartservices.com/services/test?utm_source=test");
    inquiry.set("image_1", new Blob(["inquiry photo"], { type: "image/png" }), "cart.png");
    response = await originalFetch(inquiryUrl, { method: "POST", body: inquiry });
    assert.equal(response.status, 200);
    assert.equal(outgoingUrl, "https://tigoniot.com/hooks/test-only");
    assert.ok(outgoing?.body instanceof FormData);
    assert.equal(outgoing.body.get("form_name"), "Service inquiry");
    for (const [key, value] of validForm().entries()) {
      if (key !== "form_name" && key !== "url") assert.equal(outgoing.body.get(key), value);
    }
    assert.equal(outgoing.body.get("url"), inquiry.get("url"));
    assert.equal(outgoing.body.get("utm_source"), "test");
    const inquiryPhoto = outgoing.body.get("image_1");
    assert.ok(inquiryPhoto && typeof inquiryPhoto !== "string");
    assert.equal(await inquiryPhoto.text(), "inquiry photo");
    assert.equal(new Headers(outgoing.headers).has("X-Tigon-Signature"), false);

    const invalidInquiry = validForm();
    invalidInquiry.set("email", "not-an-email");
    response = await originalFetch(inquiryUrl, { method: "POST", body: invalidInquiry });
    assert.equal(response.status, 400);

    response = await originalFetch(localUrl, { method: "POST", body: validForm() });
    assert.equal(response.status, 200);
    assert.equal(outgoingUrl, "https://tigoniot.com/hooks/test-only");
    assert.ok(outgoing?.body instanceof FormData);
    assert.equal(outgoing.body.get("form_name"), "Contact form");

    upstreamStatus = 429;
    upstreamBody = '{"ok":false,"error":"Wait a minute"}';
    response = await originalFetch(localUrl, { method: "POST", body: validForm() });
    assert.equal(response.status, 429);
    assert.deepEqual(await response.json(), { error: "Wait a minute" });

    upstreamStatus = 400;
    upstreamBody = '{"ok":false,"error":"Lead validation failed"}';
    response = await originalFetch(localUrl, { method: "POST", body: validForm() });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "Lead validation failed" });

    upstreamStatus = 200;
    upstreamBody = "not JSON";
    response = await originalFetch(localUrl, { method: "POST", body: validForm() });
    assert.equal(response.status, 502);

    const callsBeforeOriginCheck = outboundCalls;
    process.env.NODE_ENV = "production";
    response = await originalFetch(localUrl, {
      method: "POST",
      body: validForm(),
      headers: { Origin: "https://other-site.invalid" },
    });
    assert.equal(response.status, 403);
    assert.equal(outboundCalls, callsBeforeOriginCheck);

    process.env.TIGON_ALLOWED_ORIGINS = "https://static.example.invalid";
    for (const origin of [
      "https://villagesgolfcartservices.com",
      "https://villages-golf-cart-services.replit.app",
      "https://static.example.invalid",
    ]) {
      response = await originalFetch(localUrl, {
        method: "OPTIONS",
        headers: {
          Origin: origin,
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "content-type",
        },
      });
      assert.equal(response.status, 204);
      assert.equal(response.headers.get("access-control-allow-origin"), origin);
      assert.equal(response.headers.get("access-control-allow-methods"), "POST");
      assert.equal(response.headers.get("access-control-allow-credentials"), null);
      assert.match(response.headers.get("vary") || "", /Origin/);
    }
    for (const origin of ["null", "https://static.example.invalid.attacker.invalid", "https://other-site.invalid"]) {
      response = await originalFetch(localUrl, {
        method: "OPTIONS",
        headers: { Origin: origin, "Access-Control-Request-Method": "POST" },
      });
      assert.equal(response.status, 403);
      assert.equal(response.headers.get("access-control-allow-origin"), null);
    }
    response = await originalFetch(localUrl, { method: "POST", body: validForm() });
    assert.equal(response.status, 403);
    assert.equal(outboundCalls, callsBeforeOriginCheck);

    response = await originalFetch(localUrl, {
      method: "OPTIONS",
      headers: {
        Origin: "https://static.example.invalid",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "authorization",
      },
    });
    assert.equal(response.status, 403);
    assert.equal(outboundCalls, callsBeforeOriginCheck);

    upstreamBody = '{"ok":true,"id":"static-test-only"}';
    response = await originalFetch(localUrl, {
      method: "POST",
      body: validForm(),
      headers: { Origin: "https://static.example.invalid" },
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("access-control-allow-origin"), "https://static.example.invalid");
    assert.deepEqual(await response.json(), { ok: true, id: "static-test-only" });
    assert.equal(outboundCalls, callsBeforeOriginCheck + 1);

    upstreamStatus = 429;
    upstreamBody = '{"ok":false,"error":"Wait a minute"}';
    response = await originalFetch(localUrl, {
      method: "POST",
      body: validForm(),
      headers: { Origin: "https://static.example.invalid" },
    });
    assert.equal(response.status, 429);
    assert.equal(response.headers.get("access-control-allow-origin"), "https://static.example.invalid");

    // The newly merged modal must also work from the static site's origin.
    const staticInquiryUrl = localUrl.replace("/api/tigon-leads", "/api/tigon-inquiries");
    const callsBeforeStaticInquiry = outboundCalls;
    response = await originalFetch(staticInquiryUrl, {
      method: "OPTIONS",
      headers: {
        Origin: "https://static.example.invalid",
        "Access-Control-Request-Method": "POST",
      },
    });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), "https://static.example.invalid");
    response = await originalFetch(staticInquiryUrl, {
      method: "POST",
      headers: { Origin: "https://other-site.invalid" },
      body: validForm(),
    });
    assert.equal(response.status, 403);
    assert.equal(outboundCalls, callsBeforeStaticInquiry);
    upstreamStatus = 200;
    upstreamBody = '{"ok":true,"id":"static-inquiry-test-only"}';
    response = await originalFetch(staticInquiryUrl, {
      method: "POST",
      headers: { Origin: "https://static.example.invalid" },
      body: validForm(),
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("access-control-allow-origin"), "https://static.example.invalid");
    assert.deepEqual(await response.json(), { ok: true, id: "static-inquiry-test-only" });
    assert.ok(outgoing?.body instanceof FormData);
    assert.equal(outgoing.body.get("form_name"), "Service inquiry");
    assert.equal(outboundCalls, callsBeforeStaticInquiry + 1);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.TIGON_WEBHOOK_URL;
    else process.env.TIGON_WEBHOOK_URL = originalUrl;
    if (originalEnvironment === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalEnvironment;
    if (originalOrigins === undefined) delete process.env.TIGON_ALLOWED_ORIGINS;
    else process.env.TIGON_ALLOWED_ORIGINS = originalOrigins;
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
