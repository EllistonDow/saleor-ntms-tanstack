import { chromium } from "playwright";

function usage() {
  console.log(`Usage:
  node scripts/smoke-ntms-saleor-checkout.mjs [--base-url URL] [--complete-order]

Options:
  --base-url        Override the NTMS TanStack storefront URL.
  --complete-order  Complete the order when a non-card Saleor test gateway is selected.
`);
}

function failUsage(message) {
  console.error(`FAIL: ${message}`);
  usage();
  process.exit(2);
}

function requireArgValue(option, index, args) {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    failUsage(`${option} requires a value`);
  }
  return value;
}

function requireNonEmptyOption(option, value) {
  if (!value) {
    failUsage(`${option} requires a value`);
  }
  return value;
}

let cliBaseUrl;
let completeOrder = /^(1|true|yes|on)$/i.test(
  String(process.env.NTMS_SALEOR_CHECKOUT_SMOKE_COMPLETE_ORDER ?? ""),
);
const args = process.argv.slice(2);

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "-h" || arg === "--help" || arg === "help") {
    usage();
    process.exit(0);
  }
  if (arg === "--base-url") {
    cliBaseUrl = requireArgValue(arg, index, args);
    index += 1;
    continue;
  }
  if (arg.startsWith("--base-url=")) {
    cliBaseUrl = requireNonEmptyOption("--base-url", arg.slice(11));
    continue;
  }
  if (arg === "--complete-order") {
    completeOrder = true;
    continue;
  }

  failUsage(`unsupported argument: ${arg}`);
}

const baseUrl = requireNonEmptyOption(
  "base URL",
  cliBaseUrl ||
    process.env.BASE_URL ||
    process.env.PLAYWRIGHT_BASE_URL ||
    "http://localhost:3010",
).replace(/\/+$/, "");
const smokeProductPath =
  process.env.SALEOR_CHECKOUT_SMOKE_PRODUCT_PATH ||
  "/product/ntms-10272-natural-fawn-andrea-afferni-eternal-ink";
const headless = process.env.PLAYWRIGHT_HEADLESS !== "false";
const timeout = Number(process.env.NTMS_SALEOR_CHECKOUT_SMOKE_TIMEOUT ?? 60_000);
const storefrontFailurePatterns =
  /Storefront error|Something interrupted the storefront|useSaleorCart must be used within|createServerOnlyFn\(\) functions can only be called on the server|server-only/i;
const transientConsolePatterns = /TypeError: Failed to fetch/i;

const failures = [];
const consoleMessages = [];
const transientConsole = [];
const checked = [];

function recordFailure(label, error) {
  failures.push(`${label}: ${error?.stack || error?.message || error}`);
}

async function assertNoStorefrontError(page, label) {
  const bodyText = await page.locator("body").innerText({ timeout: 15_000 });
  if (storefrontFailurePatterns.test(bodyText)) {
    throw new Error(`${label} rendered error: ${bodyText.slice(0, 900)}`);
  }
}

async function waitForUsable(page, label) {
  await page.waitForLoadState("networkidle", { timeout: 25_000 }).catch(() => {
    // Client transitions can keep background work open; body assertions below
    // catch real storefront errors.
  });
  await assertNoStorefrontError(page, label);
}

async function waitForButtonEnabled(page, selector, label) {
  await page.locator(selector).waitFor({ state: "visible", timeout });
  await page.waitForFunction(
    (buttonSelector) => {
      const button = document.querySelector(buttonSelector);
      return button instanceof HTMLButtonElement && !button.disabled;
    },
    selector,
    { timeout },
  );
  checked.push(label);
}

async function runCheckoutSmoke(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();

  page.on("console", (message) => {
    const text = message.text();
    const line = `${message.type()}: ${text}`;
    consoleMessages.push(line);
    if (storefrontFailurePatterns.test(text)) {
      failures.push(`console ${line}`);
    } else if (transientConsolePatterns.test(text)) {
      transientConsole.push(line);
    }
  });
  page.on("pageerror", (error) => recordFailure("pageerror", error));

  try {
    await page.goto(`${baseUrl}${smokeProductPath}`, {
      timeout,
      waitUntil: "networkidle",
    });
    await waitForUsable(page, "product");
    checked.push("product");

    await page.locator("[data-saleor-add-to-cart-button]").first().click();
    await page
      .locator("[data-saleor-cart-drawer]")
      .waitFor({ state: "visible", timeout });
    await page
      .locator("[data-saleor-cart-line]")
      .first()
      .waitFor({ state: "visible", timeout });
    checked.push("add to cart");

    await page.locator("[data-saleor-checkout-link]").click();
    await page.waitForURL(/\/checkout(?:\/)?$/, { timeout });
    await page
      .locator("[data-saleor-checkout-page]")
      .waitFor({ state: "visible", timeout });
    await waitForUsable(page, "checkout");
    checked.push("checkout page");

    const email = `ntms-smoke+${Date.now()}@example.com`;
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="phone"]').fill("+16502530000");
    await page.locator('input[name="firstName"]').fill("NTMS");
    await page.locator('input[name="lastName"]').fill("Smoke");
    await page.locator('input[name="companyName"]').fill("NTMS Smoke Studio");
    await page.locator('input[name="streetAddress1"]').fill("1600 Amphitheatre Pkwy");
    await page.locator('input[name="streetAddress2"]').fill("Suite 100");
    await page.locator('input[name="city"]').fill("Mountain View");
    await page.locator('input[name="countryArea"]').fill("CA");
    await page.locator('input[name="postalCode"]').fill("94043");
    await page.locator('select[name="country"]').selectOption("US");
    await page.locator("[data-saleor-checkout-save-address]").click();
    await page
      .locator("[data-saleor-shipping-method-button]")
      .first()
      .waitFor({ state: "visible", timeout });
    await waitForUsable(page, "address saved");
    checked.push("address saved");

    const shippingMethod = page
      .locator("[data-saleor-shipping-method-button]")
      .first();
    await shippingMethod.click();
    await page
      .locator('[data-saleor-shipping-method-selected="true"]')
      .first()
      .waitFor({ state: "visible", timeout });
    await page
      .locator("[data-saleor-payment-gateway-button]")
      .first()
      .waitFor({ state: "visible", timeout });
    await waitForUsable(page, "shipping selected");
    checked.push("shipping selected");

    const supportedDummyGateway = page
      .locator(
        [
          '[data-saleor-payment-gateway-kind="legacy-dummy"][data-saleor-payment-gateway-supported="true"]',
          '[data-saleor-payment-gateway-kind="payment-app-dummy"][data-saleor-payment-gateway-supported="true"]',
        ].join(", "),
      )
      .first();
    const supportedGateway = page
      .locator('[data-saleor-payment-gateway-button][data-saleor-payment-gateway-supported="true"]')
      .first();
    const gateway =
      (await supportedDummyGateway.count()) > 0
        ? supportedDummyGateway
        : supportedGateway;

    await gateway.waitFor({ state: "visible", timeout });
    await gateway.click();
    const selectedGateway = page
      .locator('[data-saleor-payment-gateway-selected="true"]')
      .first();
    await selectedGateway.waitFor({ state: "visible", timeout });
    const selectedGatewayKind = await selectedGateway.getAttribute(
      "data-saleor-payment-gateway-kind",
    );
    checked.push(`payment gateway: ${selectedGatewayKind || "unknown"}`);

    const placeOrderButton = page.locator("[data-saleor-place-order-button]");
    if (
      selectedGatewayKind === "legacy-dummy" ||
      selectedGatewayKind === "payment-app-dummy"
    ) {
      await waitForButtonEnabled(
        page,
        "[data-saleor-place-order-button]",
        "place order ready",
      );

      if (completeOrder) {
        await placeOrderButton.click();
        await page.waitForURL(/\/checkout\/confirmation\//, { timeout });
        await waitForUsable(page, "confirmation");
        checked.push("order completed");
      }
    } else {
      await page
        .locator("[data-saleor-checkout-payment-section]")
        .waitFor({ state: "visible", timeout });
      checked.push("payment section ready");
    }
  } catch (error) {
    recordFailure(baseUrl, error);
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch({ headless });
try {
  await runCheckoutSmoke(browser);
} finally {
  await browser.close();
}

const result = {
  ok: failures.length === 0,
  baseUrl,
  checked,
  completeOrder,
  failures,
  severeConsole: consoleMessages.filter((line) =>
    storefrontFailurePatterns.test(line),
  ),
  transientConsole: transientConsole.slice(-5),
};

if (failures.length > 0) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(result, null, 2));
