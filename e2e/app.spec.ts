import { expect, test } from "@playwright/test";

test("selecting and resetting letters remains usable", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/");

  const a = page.getByRole("button", { name: "A" });
  await expect(a).toBeEnabled();

  await a.click();
  await expect(a).toBeDisabled();
  await expect(page.getByText("25 letters available")).toBeVisible();

  await page.getByRole("button", { name: "Reset" }).click();

  await expect(page.getByRole("button", { name: "A" })).toBeEnabled();
  await expect(page.getByText("26 letters available")).toBeVisible();
});
