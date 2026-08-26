import { expect, test } from '@playwright/test';

// Happy-path E2E safety net: register → add child → log drink → verify → sign out.
// Runs in LOCAL mode (client-side PBKDF2 auth + localStorage) against the Vite dev server.

const PASSWORD = 'TestPassw0rd!';

test('parent can register, add a child, log a drink, see it on the dashboard, and sign out', async ({ page }) => {
  const email = `e2e-parent-${Date.now()}@example.org`;

  // ── 1. Register a parent account and land in the app ──────────────────────
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /tracking for families/i })).toBeVisible();

  await page.getByLabel('Full name').fill('E2E Parent');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD);
  await page.getByLabel('Confirm password').fill(PASSWORD);
  await page.locator('form').getByRole('button', { name: 'Get started' }).click();

  await expect(page.getByRole('dialog', { name: 'Welcome to EveryStep' })).toBeVisible();
  await page.getByRole('button', { name: 'Dismiss welcome screen' }).click();

  // Signed in: primary navigation is rendered.
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();

  // ── 2. Add a child profile ────────────────────────────────────────────────
  await page.getByRole('link', { name: 'Profiles' }).click();
  await page.getByRole('button', { name: '+ Add child' }).click();
  await page.getByPlaceholder("Child's name").fill('E2E Kid');
  await page.getByRole('button', { name: 'Save child profile' }).click();
  await expect(page.getByRole('button', { name: 'E2E Kid DOB not recorded' })).toBeVisible();

  // ── 3. Log one drink entry for that child ─────────────────────────────────
  // The Drinks summary card links to the Add Entry page with the drink tab preselected.
  await page.getByRole('link', { name: 'Today' }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole('link', { name: 'Add Drinks entry' }).click();
  await expect(page).toHaveURL(/\/add/);
  await expect(page.getByRole('heading', { name: 'Log a Drink' })).toBeVisible();
  await page.getByRole('button', { name: '200ml' }).click();
  await page.getByRole('button', { name: 'Save Drink Entry 💧' }).click();

  // Saving a drink navigates back to the dashboard.
  await expect(page).toHaveURL(/\/$/);

  // ── 4. The entry appears on the dashboard for today ───────────────────────
  await expect(page.getByText('Nothing logged yet today')).not.toBeVisible();
  await expect(page.getByRole('button', { name: '200ml - cup' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add Drinks entry' })).toContainText('200ml');

  // The Diary (log) shows today's entry as well.
  await page.getByRole('link', { name: 'Diary' }).click();
  await expect(page.getByText('200ml – cup')).toBeVisible();

  // ── 5. Sign out and confirm we are back on the login screen ───────────────
  await page.getByRole('link', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.locator('form').getByRole('button', { name: 'Get started' })).toBeVisible();
});
