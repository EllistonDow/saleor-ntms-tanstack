export const SALEOR_STRIPE_GATEWAY_ID = "saleor.app.payment.stripe";
export const SALEOR_PAYPAL_GATEWAY_ID = "saleor.app.paypal";
export const SALEOR_LEGACY_STRIPE_GATEWAY_ID = "app.saleor.stripe";
export const SALEOR_LEGACY_STRIPE_PLUGIN_ID = "saleor.payments.stripe";
export const SALEOR_MIRUMEE_LEGACY_STRIPE_PLUGIN_ID = "mirumee.payments.stripe";
export const SALEOR_ADYEN_GATEWAY_ID = "app.saleor.adyen";
export const SALEOR_DUMMY_PAYMENT_APP_GATEWAY_ID =
  "saleor.io.dummy-payment-app";
export const SALEOR_LEGACY_DUMMY_GATEWAY_ID = "mirumee.payments.dummy";

export type NtmsSaleorPaymentGatewayConfig = {
  field: string;
  value?: string | null;
};

export type NtmsSaleorPaymentGatewayKind =
  | "legacy-dummy"
  | "payment-app-dummy"
  | "stripe"
  | "paypal"
  | "legacy-stripe"
  | "adyen"
  | "unsupported-app"
  | "unknown";

export type NtmsSaleorPaymentGatewayClassification = {
  kind: NtmsSaleorPaymentGatewayKind;
  productionCandidate: boolean;
  productionSafe: boolean;
  productionBlocker: string | null;
  supported: boolean;
};

export type NtmsSaleorPaymentGatewayLike = {
  id: string;
  name: string;
};

export function classifyNtmsSaleorPaymentGateway(
  gateway: NtmsSaleorPaymentGatewayLike,
): NtmsSaleorPaymentGatewayClassification {
  if (gateway.id === SALEOR_DUMMY_PAYMENT_APP_GATEWAY_ID) {
    return {
      kind: "payment-app-dummy",
      productionCandidate: false,
      productionSafe: false,
      productionBlocker:
        "Saleor dummy payment app is test-only and must not be enabled for production checkout.",
      supported: true,
    };
  }

  if (
    gateway.id === SALEOR_LEGACY_DUMMY_GATEWAY_ID ||
    /dummy/i.test(gateway.id) ||
    /dummy/i.test(gateway.name)
  ) {
    return {
      kind: "legacy-dummy",
      productionCandidate: false,
      productionSafe: false,
      productionBlocker:
        "Saleor legacy dummy payment plugin is test-only and must not be enabled for production checkout.",
      supported: true,
    };
  }

  if (
    gateway.id === SALEOR_STRIPE_GATEWAY_ID ||
    gateway.id === SALEOR_LEGACY_STRIPE_GATEWAY_ID
  ) {
    return {
      kind: "stripe",
      productionCandidate: true,
      productionSafe: true,
      productionBlocker: null,
      supported: true,
    };
  }

  if (gateway.id === SALEOR_PAYPAL_GATEWAY_ID) {
    return {
      kind: "paypal",
      productionCandidate: true,
      productionSafe: true,
      productionBlocker: null,
      supported: true,
    };
  }

  if (
    gateway.id === SALEOR_LEGACY_STRIPE_PLUGIN_ID ||
    gateway.id === SALEOR_MIRUMEE_LEGACY_STRIPE_PLUGIN_ID
  ) {
    return {
      kind: "legacy-stripe",
      productionCandidate: true,
      productionSafe: false,
      productionBlocker:
        "Saleor legacy Stripe plugin uses the deprecated checkout payment flow; use the Stripe Payment App before production checkout.",
      supported: true,
    };
  }

  if (gateway.id === SALEOR_ADYEN_GATEWAY_ID) {
    return {
      kind: "adyen",
      productionCandidate: true,
      productionSafe: false,
      productionBlocker:
        "Adyen is detected, but this storefront does not have a wired Adyen payment component yet.",
      supported: false,
    };
  }

  if (
    gateway.id.startsWith("app.saleor.") ||
    gateway.id.startsWith("saleor.app.")
  ) {
    return {
      kind: "unsupported-app",
      productionCandidate: true,
      productionSafe: false,
      productionBlocker:
        "This payment app is not approved or wired in the Nuclear Tattoo Supply storefront.",
      supported: false,
    };
  }

  return {
    kind: "unknown",
    productionCandidate: false,
    productionSafe: false,
    productionBlocker:
      "Unknown Saleor payment gateway is not approved for production checkout.",
    supported: false,
  };
}

export function isNtmsSaleorDummyPaymentGateway(
  gateway: NtmsSaleorPaymentGatewayLike,
) {
  const { kind } = classifyNtmsSaleorPaymentGateway(gateway);
  return kind === "legacy-dummy" || kind === "payment-app-dummy";
}

export function isNtmsSaleorProductionPaymentGateway(
  gateway: NtmsSaleorPaymentGatewayLike,
) {
  return classifyNtmsSaleorPaymentGateway(gateway).productionCandidate;
}

export function isNtmsSaleorProductionSafePaymentGateway(
  gateway: NtmsSaleorPaymentGatewayLike,
) {
  return classifyNtmsSaleorPaymentGateway(gateway).productionSafe;
}

export function getNtmsSaleorPaymentGatewayProductionBlocker(
  gateway: NtmsSaleorPaymentGatewayLike,
) {
  return classifyNtmsSaleorPaymentGateway(gateway).productionBlocker;
}

export function getNtmsSaleorPaymentGatewaySupportLabel(
  gateway: NtmsSaleorPaymentGatewayLike,
) {
  const { kind, supported } = classifyNtmsSaleorPaymentGateway(gateway);

  if (supported) {
    return "Available";
  }

  if (kind === "stripe" || kind === "legacy-stripe") {
    return "Available";
  }

  if (kind === "adyen") {
    return "Setup pending";
  }

  if (kind === "unsupported-app") {
    return "Unsupported app";
  }

  return "Unavailable";
}
