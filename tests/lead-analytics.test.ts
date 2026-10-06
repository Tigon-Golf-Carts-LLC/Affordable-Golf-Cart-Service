import assert from "node:assert/strict";
import test from "node:test";
import {
  getCurrentRouteCategory,
  getRouteCategory,
  trackLeadEvent,
  trackServicePhoneClick,
} from "../client/src/lib/lead-analytics";

test("route categories contain only fixed labels, not paths, identifiers, or query values", () => {
  const cases = [
    ["/", "home"],
    ["/about", "about"],
    ["/services/", "services"],
    ["/services/cart-private-id?email=private@example.invalid", "service_detail"],
    ["/states", "states"],
    ["/states/florida#private", "state_detail"],
    ["/contact?phone=5550102000", "contact"],
    ["/blog", "blog"],
    ["/blog/page/2", "blog_page"],
    ["/blog/private-slug", "blog_post"],
    ["/unknown/private-id", "not_found"],
    ["/constructor", "not_found"],
    ["/services/private/nested", "not_found"],
  ];
  for (const [path, expected] of cases) {
    assert.equal(getRouteCategory(path), expected);
  }
});

test("phone clicks send only fixed categories and placements and tolerate tracker failures", async () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  try {
    Reflect.deleteProperty(globalThis, "window");
    assert.doesNotThrow(() => trackServicePhoneClick("footer"));
    const browser = { location: { pathname: "/services/private-cart", search: "?phone=private", hash: "#private" }, umami: undefined as Window["umami"] };
    Object.defineProperty(globalThis, "window", { configurable: true, value: browser });
    assert.doesNotThrow(() => trackServicePhoneClick("footer"));
    browser.umami = { track: () => { throw new Error("Tracker failure"); } };
    assert.doesNotThrow(() => trackServicePhoneClick("header_mobile"));
    browser.umami = { track: () => Promise.reject(new Error("Tracker failure")) };
    assert.equal(trackServicePhoneClick("page_cta"), undefined);
    await new Promise((resolve) => setImmediate(resolve));

    const events: unknown[] = [];
    browser.umami = { track: (name, data) => { events.push({ name, data }); } };
    const locations = ["header_top", "header_desktop", "header_mobile", "footer", "page_cta", "service_card"] as const;
    for (const location of locations) trackServicePhoneClick(location);
    assert.deepEqual(events, locations.map((location) => ({
      name: "service_phone_clicked",
      data: { link_location: location, route_category: "service_detail" },
    })));
    browser.location.pathname = "/unknown/private";
    trackServicePhoneClick("footer");
    assert.deepEqual(events.at(-1), {
      name: "service_phone_clicked",
      data: { link_location: "footer", route_category: "not_found" },
    });
  } finally {
    Reflect.deleteProperty(globalThis, "window");
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  }
});

test("lead events are safe with no browser, absent tracker, throws, or rejected promises", async () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  try {
    Reflect.deleteProperty(globalThis, "window");
    assert.equal(getCurrentRouteCategory(), "not_found");
    assert.doesNotThrow(() => trackLeadEvent("lead_form_submitted", "contact"));

    const browser = { location: { pathname: "/contact" }, umami: undefined as Window["umami"] };
    Object.defineProperty(globalThis, "window", { configurable: true, value: browser });
    assert.doesNotThrow(() => trackLeadEvent("lead_form_submitted", "contact"));
    browser.umami = { track: () => { throw new Error("Tracker failure"); } };
    assert.doesNotThrow(() => trackLeadEvent("lead_form_submitted", "contact"));
    browser.umami = { track: () => Promise.reject(new Error("Tracker failure")) };
    trackLeadEvent("lead_form_submitted", "inquiry");
    await new Promise((resolve) => setImmediate(resolve));

    const events: unknown[] = [];
    browser.umami = { track: (name, data) => { events.push({ name, data }); } };
    browser.location.pathname = "/services/customer-cart-id";
    trackLeadEvent("service_inquiry_opened", "inquiry");
    const categoryAtSubmission = getCurrentRouteCategory();
    browser.location.pathname = "/contact";
    trackLeadEvent("lead_form_submitted", "inquiry", categoryAtSubmission);
    trackLeadEvent("lead_form_submitted", "contact");
    assert.deepEqual(events, [
      { name: "service_inquiry_opened", data: { form_variant: "inquiry", route_category: "service_detail" } },
      { name: "lead_form_submitted", data: { form_variant: "inquiry", route_category: "service_detail" } },
      { name: "lead_form_submitted", data: { form_variant: "contact", route_category: "contact" } },
    ]);
  } finally {
    Reflect.deleteProperty(globalThis, "window");
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  }
});
