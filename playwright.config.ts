import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Manually load .env variables (dotenv not installed as a dependency).
 * Supports KEY=VALUE and KEY="VALUE" formats; ignores comments and empty lines.
 */
try {
  const envPath = resolve(__dirname, 'tests', '.env');
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    if (key && !(key in process.env)) process.env[key] = val;
  }
} catch {
  // .env file not found — rely on environment variables set by the shell
}

/**
 * Dedicated port for THIS project's own server.
 *
 * ⚠️ Do NOT default to 3000: a sibling OneEntry project (nextjs-restaurant) is
 * commonly running there, and `reuseExistingServer` would silently hijack it —
 * every test would then run against the wrong app and fail. We always spin up
 * (or reuse) OUR OWN production build on a dedicated port instead.
 *
 * Override with PORT / BASE_URL when pointing at an already-running instance.
 */
const PORT = Number(process.env.PORT) || 3100;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /*
   * Retries. These E2E tests run end-to-end against the LIVE OneEntry cloud API
   * (variable latency, login rate-limits) with a per-test UI sign-in, so an
   * occasional transient failure (slow page, throttled login) is expected and
   * not a real regression. One local retry absorbs those without masking genuine
   * bugs — a real failure fails the retry too, and a retried pass is reported as
   * "flaky", not green. CI keeps 2.
   */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /*
   * Per-test timeout. Raised above Playwright's 30s default because every page
   * talks to the live OneEntry API (variable latency), and the heaviest pages —
   * the product reviews section fetches up to 500 nested form-data records
   * server-side — can be slow under load; the reviews expand→drawer flow also
   * chains several auto-retry budgets. 60s lets a slow load degrade to a pass
   * instead of a spurious timeout, without slowing tests that pass quickly.
   */
  timeout: 75_000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /*
   * Run OUR OWN production build before the tests.
   *
   * A production server is used deliberately — `next dev` (Turbopack) leaks
   * memory under a long E2E run and eventually OOM-crashes the server, which
   * surfaces as spurious "Target page/context closed" / goto timeouts late in
   * the run. `next build && next start` is stable and faster end-to-end.
   *
   * `reuseExistingServer` (local only) picks up a server you already started on
   * PORT — so a local run skips the rebuild if you keep one warm:
   *   npm run build && npx next start -p 3100
   *
   * Set PW_NO_SERVER=1 to manage the server yourself entirely (with BASE_URL).
   */
  ...(process.env.PW_NO_SERVER
    ? {}
    : {
        webServer: {
          command: `npm run build && npx next start -p ${PORT}`,
          url: BASE_URL,
          reuseExistingServer: !process.env.CI,
          timeout: 300_000,
        },
      }),
});
