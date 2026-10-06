import { test, expect } from "./fixtures";

test("default-deny blocks unknown writes and external reads and writes", async ({ page, delivery }) => {
  await page.goto("/");
  const outcomes = await page.evaluate(async () => {
    const attempts = [
      { url: "/api/unrecognized-lead", method: "POST" },
      { url: "/api/tigon-inquiries", method: "PUT" },
      { url: "https://delivery.example.invalid/webhook", method: "POST" },
      { url: "https://delivery.example.invalid/track", method: "GET" },
    ];
    return Promise.all(attempts.map(async ({ url, method }) => {
      try {
        await fetch(url, { method });
        return "unexpectedly allowed";
      } catch {
        return "blocked";
      }
    }));
  });
  expect(outcomes).toEqual(["blocked", "blocked", "blocked", "blocked"]);
  expect(delivery.requests).toHaveLength(0);
});
