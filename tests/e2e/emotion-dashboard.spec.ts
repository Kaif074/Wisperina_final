import { test, expect } from "@playwright/test";

test("Emotion Dashboard analyzes text with mocked API", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("APILAYER_KEY", "e2e-key");
  });
  await page.route("https://api.apilayer.com/text_to_emotion", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ Happy: 0.6, Sad: 0.1, Surprise: 0.2, Angry: 0, Fear: 0.1 }),
    });
  });

  await page.goto("/emotion");
  await page.fill("input[placeholder='Type text to analyze']", "This is great!");
  await page.click("button:has-text('Analyze')");
  await expect(page.getByText(/latest results/i)).toBeVisible();
  const items = page.locator('span.capitalize');
  await expect(items).toHaveCountGreaterThan(0);
});