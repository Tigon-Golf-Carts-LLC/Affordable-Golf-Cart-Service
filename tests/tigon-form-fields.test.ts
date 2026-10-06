import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TigonLeadForm } from "../client/src/components/TigonLeadForm";

// tsx uses classic JSX for this project's "preserve" setting; Vite uses automatic JSX.
Object.assign(globalThis, { React });

const suppliedFields = [
  "form_name", "first_name", "last_name", "phone1", "phone2", "address",
  "email", "zip_code", "model", "brand", "vin_number", "sku_number",
  "url", "comments", "image_1", "image_2", "image_3", "utm_source",
  "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid",
  "fbclid", "ga_client_id", "referrer", "website",
];

test("Contact and modal forms render every supplied visitor and tracking field", () => {
  for (const variant of ["contact", "inquiry"] as const) {
    const markup = renderToStaticMarkup(React.createElement(TigonLeadForm, { variant }));
    for (const field of suppliedFields) {
      assert.match(markup, new RegExp(`name="${field}"`), `${variant} missing ${field}`);
    }
    for (const field of ["first_name", "last_name", "email", "phone1"]) {
      assert.match(markup, new RegExp(`<input[^>]*name="${field}"[^>]*required=""`));
    }
    for (const field of ["user_ip", "user_agent"]) {
      assert.doesNotMatch(markup, new RegExp(`name="${field}"`), `${field} is server-captured`);
    }
    assert.match(markup, variant === "contact" ? /value="Contact form"/ : /value="Service inquiry"/);
    assert.equal((markup.match(/type="file"/g) || []).length, 3);
  }
});

test("Contact page and inquiry modal field IDs remain unique when rendered together", () => {
  const markup = renderToStaticMarkup(
    React.createElement(React.Fragment, null,
      React.createElement(TigonLeadForm),
      React.createElement(TigonLeadForm, { variant: "inquiry" }),
    ),
  );
  const ids = Array.from(markup.matchAll(/\sid="([^"]+)"/g), (match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const label of markup.matchAll(/for="([^"]+)"/g)) {
    assert.ok(ids.includes(label[1]), `Label ${label[1]} must reference its own input`);
  }
});
