import { test, expect, fillRequired, DRAFT_KEY, SUCCESS } from "./fixtures";

const routes = [
  "/", "/about", "/services", "/services/basic-tune-up",
  "/states", "/states/florida", "/blog", "/blog/page/2",
  "/blog/golf-cart-maintenance-guide", "/contact", "/not-a-real-page",
];

for (const path of routes) {
  test(`global trigger opens and dismisses on ${path}`, async ({ page, delivery }) => {
    await page.goto(path);
    const trigger = page.getByRole("button", { name: "Request golf cart service" });
    await expect(trigger).toHaveCount(1);
    await expect(trigger).toBeVisible();
    await expect(trigger).toBeInViewport();
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Tell us what your cart needs" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("First Name", { exact: true })).toBeFocused();
    const bounds = await dialog.boundingBox();
    const viewport = page.viewportSize()!;
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.width).toBeLessThanOrEqual(viewport.width);
    expect(bounds!.height).toBeLessThanOrEqual(viewport.height);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(trigger).toBeInViewport();
    expect(delivery.requests).toHaveLength(0);
  });
}

test("keyboard opening, tab containment, close button and outside dismissal", async ({ page }) => {
  await page.goto("/contact");
  const trigger = page.getByRole("button", { name: "Request golf cart service" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  const first = dialog.getByLabel("First Name", { exact: true });
  const close = dialog.getByRole("button", { name: "Close", exact: true });
  await expect(first).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  await close.focus();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Space");
  await expect(dialog).toBeVisible();
  // The modal leaves a margin on desktop and emulated phones; hit the overlay.
  await page.mouse.click(2, 2);
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("draft survives dismissal, reload and route change; photos are not persisted", async ({ page }) => {
  await page.goto("/services/basic-tune-up");
  const trigger = page.getByTestId("button-global-request-service");
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await fillRequired(dialog);
  await dialog.getByLabel("How can we help?").fill("Battery will not charge");
  await dialog.getByLabel("Brand", { exact: true }).fill("Test brand");
  await dialog.getByLabel("Photo 1", { exact: true }).setInputFiles({
    name: "cart.png", mimeType: "image/png", buffer: Buffer.from("test photo"),
  });
  const saved = await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!), DRAFT_KEY);
  expect(saved.comments).toBe("Battery will not charge");
  expect(saved).not.toHaveProperty("image_1");
  expect(saved).not.toHaveProperty("website");
  expect(saved).not.toHaveProperty("url");
  await page.keyboard.press("Escape");
  await trigger.click();
  await expect(dialog.getByLabel("First Name", { exact: true })).toHaveValue("Browser");
  await expect(dialog.getByLabel("Photo 1", { exact: true })).toHaveValue("");
  await page.reload();
  await trigger.click();
  await expect(dialog.getByLabel("How can we help?")).toHaveValue("Battery will not charge");
  await expect(dialog.getByLabel("Photo 1", { exact: true })).toHaveValue("");
  await page.keyboard.press("Escape");
  await page.goto("/states/florida");
  await trigger.click();
  await expect(dialog.getByLabel("Brand", { exact: true })).toHaveValue("Test brand");
  await expect(dialog.getByLabel("Photo 1", { exact: true })).toHaveValue("");
  await dialog.getByTestId("button-submit-inquiry").click();
  await expect(dialog.getByRole("status")).toHaveText(SUCCESS);
  expect(await page.evaluate((key) => sessionStorage.getItem(key), DRAFT_KEY)).toBeNull();
  await page.keyboard.press("Escape");
  await trigger.click();
  await expect(dialog.getByLabel("First Name", { exact: true })).toHaveValue("");
});

test("corrupt or unavailable draft storage does not prevent submitting", async ({ page }) => {
  await page.goto("/");
  await page.evaluate((key) => sessionStorage.setItem(key, "{broken json"), DRAFT_KEY);
  await page.getByTestId("button-global-request-service").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("First Name", { exact: true })).toHaveValue("");
  await page.keyboard.press("Escape");
  await page.evaluate(() => {
    for (const method of ["getItem", "setItem", "removeItem"]) {
      Object.defineProperty(Storage.prototype, method, {
        value: () => { throw new DOMException("Storage blocked", "SecurityError"); },
      });
    }
  });
  await page.getByTestId("button-global-request-service").click();
  await fillRequired(dialog);
  await dialog.getByTestId("button-submit-inquiry").click();
  await expect(dialog.getByRole("status")).toHaveText(SUCCESS);
});

test("Contact and modal forms have independent labels, values and outcomes", async ({ page, delivery }) => {
  await page.goto("/contact");
  const contact = page.locator("main form");
  await contact.getByLabel("First Name", { exact: true }).fill("Contact draft");
  await page.getByTestId("button-global-request-service").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("First Name", { exact: true })).toHaveValue("");
  const ids = await page.locator("form input[id], form textarea[id]").evaluateAll(
    (fields) => fields.map((field) => field.id),
  );
  expect(new Set(ids).size).toBe(ids.length);
  await fillRequired(dialog);
  await dialog.getByTestId("button-submit-inquiry").click();
  await expect(dialog.getByRole("status")).toHaveText(SUCCESS);
  await page.keyboard.press("Escape");
  await expect(contact.getByLabel("First Name", { exact: true })).toHaveValue("Contact draft");
  await expect(contact.getByRole("status")).toHaveCount(0);
  expect(delivery.requests).toHaveLength(1);
});
