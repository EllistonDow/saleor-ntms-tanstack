import {
  CardElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  loadStripe,
  type StripeElementsOptions,
  type StripePaymentElementOptions,
} from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CreditCard,
  Loader2,
  MapPinned,
  Package2,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type {
  NtmsSaleorAddressInput,
  NtmsSaleorCheckout,
  NtmsSaleorOrder,
} from "@/lib/saleor/checkout";
import { encodeNtmsSaleorOrderRouteId } from "@/lib/saleor/route-ids";
import {
  completeSaleorCheckout,
  createSaleorStripePaymentIntent,
  initializeSaleorLegacyStripePayment,
  initializeSaleorPayPalPayment,
  initializeSaleorStripePayment,
  processSaleorPayPalPayment,
  processSaleorStripePayment,
  saveSaleorCheckoutAddress,
  setSaleorCheckoutDeliveryMethod,
} from "./ntms-cart-actions";
import { useSaleorCart } from "./ntms-cart-context";
import { getNtmsSaleorPaymentSessionKey } from "./ntms-checkout-payment-session";

type CheckoutFormValues = NtmsSaleorAddressInput & {
  email: string;
};

type CheckoutOrderPlacedHandler = (order: NtmsSaleorOrder) => Promise<void>;

type PayPalButtonsInstance = {
  close?: () => Promise<void>;
  render: (container: HTMLElement) => Promise<void>;
};

type PayPalSdkWindow = Window & {
  paypal?: {
    Buttons: (options: {
      createOrder: () => Promise<string>;
      onApprove: (data: { orderID?: string }) => Promise<void>;
      onCancel: () => void;
      onError: (error: unknown) => void;
      style?: {
        color?: string;
        height?: number;
        layout?: string;
        shape?: string;
        tagline?: boolean;
      };
    }) => PayPalButtonsInstance;
  };
};

let activeSaleorPayPalSdkPromise: Promise<void> | undefined;
let activeSaleorPayPalSdkSrc: string | undefined;

export function NtmsSaleorCheckoutPage() {
  const navigate = useNavigate();
  const { checkout, clearCartSession, isLoading, syncCheckout } =
    useSaleorCart();
  const [formValues, setFormValues] = useState<CheckoutFormValues>(() =>
    getInitialFormValues(null),
  );
  const [selectedGatewayId, setSelectedGatewayId] = useState("");
  const addressMutation = useMutation({
    mutationFn: async (values: CheckoutFormValues) => {
      if (!checkout) {
        throw new Error("Cart is empty");
      }

      const result = await saveSaleorCheckoutAddress({
        data: {
          address: {
            city: values.city,
            companyName: values.companyName,
            country: values.country,
            countryArea: values.countryArea,
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            postalCode: values.postalCode,
            streetAddress1: values.streetAddress1,
            streetAddress2: values.streetAddress2,
          },
          checkoutId: checkout.id,
          email: values.email,
        },
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.checkout;
    },
    onSuccess: (nextCheckout) => {
      syncCheckout(nextCheckout);
      toast.success("Checkout details saved");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to save");
    },
  });
  const deliveryMutation = useMutation({
    mutationFn: async (deliveryMethodId: string) => {
      if (!checkout) {
        throw new Error("Cart is empty");
      }

      const result = await setSaleorCheckoutDeliveryMethod({
        data: {
          checkoutId: checkout.id,
          deliveryMethodId,
        },
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.checkout;
    },
    onSuccess: (nextCheckout) => {
      syncCheckout(nextCheckout);
      toast.success("Delivery method saved");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to save delivery",
      );
    },
  });
  const handleOrderPlaced = async (order: NtmsSaleorOrder) => {
    clearCartSession();
    toast.success("Order placed");
    await navigate({
      to: "/checkout/confirmation/$code",
      params: { code: encodeNtmsSaleorOrderRouteId(order.id) },
    });
  };
  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!checkout) {
        throw new Error("Cart is empty");
      }

      const result = await completeSaleorCheckout({
        data: {
          checkoutId: checkout.id,
          gatewayId: selectedGatewayId,
        },
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.order;
    },
    onSuccess: handleOrderPlaced,
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to place order",
      );
    },
  });

  useEffect(() => {
    if (checkout) {
      setFormValues(getInitialFormValues(checkout));
    }
  }, [checkout]);

  useEffect(() => {
    if (!checkout || checkout.paymentGateways.length === 0) {
      setSelectedGatewayId("");
      return;
    }

    const currentGatewayStillAvailable = checkout.paymentGateways.some(
      (gateway) => gateway.id === selectedGatewayId && gateway.supported,
    );
    if (currentGatewayStillAvailable) {
      return;
    }

    const defaultGateway =
      checkout.paymentGateways.find((gateway) => gateway.supported) ??
      checkout.paymentGateways[0];
    setSelectedGatewayId(defaultGateway.id);
  }, [checkout, selectedGatewayId]);

  const canSubmitAddress = useMemo(
    () =>
      formValues.email.trim().includes("@") &&
      formValues.firstName.trim().length > 1 &&
      formValues.lastName.trim().length > 1 &&
      formValues.streetAddress1.trim().length > 2 &&
      formValues.city.trim().length > 1 &&
      (formValues.countryArea ?? "").trim().length > 1 &&
      formValues.postalCode.trim().length > 2,
    [formValues],
  );
  const selectedGateway = checkout?.paymentGateways.find(
    (gateway) => gateway.id === selectedGatewayId,
  );
  const requiresStripeForm =
    selectedGateway?.kind === "stripe" ||
    selectedGateway?.kind === "legacy-stripe";
  const requiresPayPalButtons = selectedGateway?.kind === "paypal";
  const requiresPaymentPanel = requiresStripeForm || requiresPayPalButtons;
  const canPlaceOrder = Boolean(
    checkout?.selectedShippingMethod &&
      checkout.shippingAddress &&
      checkout.billingAddress &&
      selectedGateway?.supported &&
      !requiresPaymentPanel,
  );
  const canUseStripeForm = Boolean(
    checkout?.selectedShippingMethod &&
      checkout.shippingAddress &&
      checkout.billingAddress &&
      requiresStripeForm,
  );
  const canUsePayPalButtons = Boolean(
    checkout?.selectedShippingMethod &&
      checkout.shippingAddress &&
      checkout.billingAddress &&
      requiresPayPalButtons,
  );

  const handleChange =
    (field: keyof CheckoutFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormValues((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmitAddress) return;
    await addressMutation.mutateAsync(formValues);
  };

  if (isLoading && !checkout) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 text-foreground">
        <div className="mx-auto max-w-screen-md">
          <Link
            to="/"
            className="text-sm font-black uppercase text-foreground transition hover:text-[color:var(--cyber-gold-soft)]"
          >
            Nuclear Tattoo Supply
          </Link>
          <div className="mt-8 border border-[color:var(--cyber-gold)]/12 bg-card p-8 text-center">
            <p className="text-sm font-semibold text-foreground/58">
              Loading checkout
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!checkout || checkout.lines.length === 0) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 text-foreground">
        <div className="mx-auto max-w-screen-md">
          <Link
            to="/"
            className="text-sm font-black uppercase text-foreground transition hover:text-[color:var(--cyber-gold-soft)]"
          >
            Nuclear Tattoo Supply
          </Link>
          <div className="mt-8 border border-[color:var(--cyber-gold)]/12 bg-card p-8 text-center">
            <Package2 className="mx-auto h-9 w-9 text-[color:var(--cyber-gold-soft)]" />
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Your cart is empty
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/58">
              Add products before returning to checkout.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild>
                <Link to="/search">Search products</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Catalog</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      data-saleor-checkout-page
    >
      <header className="border-b border-[color:var(--cyber-gold)]/10 bg-background">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link
            to="/"
            className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/68 transition hover:text-[color:var(--cyber-gold-soft)]"
          >
            Nuclear Tattoo Supply
          </Link>
          <span className="rounded-full border border-[color:var(--cyber-gold)]/14 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--cyber-gold-soft)]">
            Checkout
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-screen-2xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <section className="grid gap-3 sm:grid-cols-3">
            <CheckoutStepPill
              active
              icon={<MapPinned className="h-4 w-4" />}
              label="Address"
              value={checkout.shippingAddress ? "Saved" : "Required"}
            />
            <CheckoutStepPill
              active={Boolean(checkout.selectedShippingMethod)}
              icon={<Truck className="h-4 w-4" />}
              label="Shipping"
              value={
                checkout.selectedShippingMethod
                  ? checkout.selectedShippingMethod.name
                  : "Select rate"
              }
            />
            <CheckoutStepPill
              active={Boolean(selectedGateway?.supported)}
              icon={<CreditCard className="h-4 w-4" />}
              label="Payment"
              value={
                selectedGateway?.supported
                  ? "Ready"
                  : (selectedGateway?.supportLabel ?? "Select method")
              }
            />
          </section>

          <section className="overflow-hidden rounded-md border border-[color:var(--cyber-gold)]/12 bg-card">
            <div className="border-b border-[color:var(--cyber-gold)]/10 px-5 py-5">
              <div className="flex items-center gap-2 text-[color:var(--cyber-gold-soft)]">
                <MapPinned className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Contact and address
                </p>
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Delivery details
              </h1>
            </div>

            <form
              className="p-5"
              data-saleor-checkout-address-form
              onSubmit={handleSubmit}
            >
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <CheckoutInput
                  label="Email"
                  name="email"
                  onChange={handleChange("email")}
                  required
                  type="email"
                  value={formValues.email}
                />
                <CheckoutInput
                  label="Phone"
                  name="phone"
                  onChange={handleChange("phone")}
                  value={formValues.phone ?? ""}
                />
                <CheckoutInput
                  label="First name"
                  name="firstName"
                  onChange={handleChange("firstName")}
                  required
                  value={formValues.firstName}
                />
                <CheckoutInput
                  label="Last name"
                  name="lastName"
                  onChange={handleChange("lastName")}
                  required
                  value={formValues.lastName}
                />
                <CheckoutInput
                  className="sm:col-span-2"
                  label="Company"
                  name="companyName"
                  onChange={handleChange("companyName")}
                  value={formValues.companyName ?? ""}
                />
                <CheckoutInput
                  className="sm:col-span-2"
                  label="Street address"
                  name="streetAddress1"
                  onChange={handleChange("streetAddress1")}
                  required
                  value={formValues.streetAddress1}
                />
                <CheckoutInput
                  className="sm:col-span-2"
                  label="Apartment, suite, unit"
                  name="streetAddress2"
                  onChange={handleChange("streetAddress2")}
                  value={formValues.streetAddress2 ?? ""}
                />
                <CheckoutInput
                  label="City"
                  name="city"
                  onChange={handleChange("city")}
                  required
                  value={formValues.city}
                />
                <CheckoutInput
                  label="State"
                  name="countryArea"
                  onChange={handleChange("countryArea")}
                  required
                  value={formValues.countryArea ?? ""}
                />
                <CheckoutInput
                  label="Postal code"
                  name="postalCode"
                  onChange={handleChange("postalCode")}
                  required
                  value={formValues.postalCode}
                />
                <Field>
                  <FieldLabel>
                    Country
                    <select
                      className="mt-2 h-10 w-full rounded-md border border-[color:var(--cyber-gold)]/20 bg-background px-3 text-sm text-foreground focus:border-[color:var(--cyber-gold)]/60 focus:outline-none focus:ring-2 focus:ring-[color:var(--cyber-gold)]/35"
                      name="country"
                      onChange={handleChange("country")}
                      value={formValues.country}
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                  </FieldLabel>
                </Field>
              </FieldGroup>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--cyber-gold)]/10 pt-5">
                <p className="text-sm text-foreground/52">
                  Billing address will match delivery address.
                </p>
                <Button
                  data-saleor-checkout-save-address
                  disabled={!canSubmitAddress || addressMutation.isPending}
                  type="submit"
                >
                  {addressMutation.isPending ? "Saving" : "Save details"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </section>

          <DeliverySection
            checkout={checkout}
            isSaving={deliveryMutation.isPending}
            onSelect={(deliveryMethodId) =>
              deliveryMutation.mutateAsync(deliveryMethodId)
            }
          />

          <PaymentSection
            canUsePayPalButtons={canUsePayPalButtons}
            canUseStripeForm={canUseStripeForm}
            checkout={checkout}
            onOrderPlaced={handleOrderPlaced}
            onSelectGateway={setSelectedGatewayId}
            selectedGateway={selectedGateway ?? null}
            selectedGatewayId={selectedGatewayId}
          />
        </div>

        <CheckoutSummary
          canPlaceOrder={canPlaceOrder}
          checkout={checkout}
          isPlacingOrder={completeMutation.isPending}
          onPlaceOrder={() => completeMutation.mutate()}
          requiresPaymentPanel={requiresPaymentPanel}
        />
      </div>
    </main>
  );
}

function DeliverySection({
  checkout,
  isSaving,
  onSelect,
}: {
  checkout: NtmsSaleorCheckout;
  isSaving: boolean;
  onSelect: (deliveryMethodId: string) => Promise<NtmsSaleorCheckout | null>;
}) {
  return (
    <section
      className="overflow-hidden rounded-md border border-[color:var(--cyber-gold)]/12 bg-card"
      data-saleor-checkout-shipping-section
    >
      <div className="border-b border-[color:var(--cyber-gold)]/10 px-5 py-5">
        <div className="flex items-center gap-2 text-[color:var(--cyber-gold-soft)]">
          <Truck className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            Delivery
          </p>
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Shipping method
        </h2>
      </div>
      <div className="space-y-3 p-5">
        {checkout.shippingMethods.length > 0 ? (
          checkout.shippingMethods.map((method) => {
            const selected = checkout.selectedShippingMethod?.id === method.id;
            const deliveryEstimate = formatDeliveryEstimate(
              method.minimumDeliveryDays,
              method.maximumDeliveryDays,
            );
            return (
              <button
                className={`w-full rounded-md border p-4 text-left transition ${
                  selected
                    ? "border-[color:var(--cyber-gold)]/36 bg-[color:var(--cyber-gold)]/10"
                    : "border-[color:var(--cyber-gold)]/12 bg-background hover:border-[color:var(--cyber-gold)]/28"
                }`}
                data-saleor-shipping-method-button
                data-saleor-shipping-method-id={method.id}
                data-saleor-shipping-method-selected={
                  selected ? "true" : "false"
                }
                disabled={isSaving}
                key={method.id}
                onClick={() => onSelect(method.id)}
                type="button"
              >
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block font-semibold text-foreground">
                      {method.name}
                    </span>
                    {method.description || method.message ? (
                      <span className="mt-1 block text-sm text-foreground/55">
                        {method.description || method.message}
                      </span>
                    ) : null}
                    {deliveryEstimate ? (
                      <span
                        className="mt-1 block text-sm text-foreground/55"
                        data-saleor-shipping-method-delivery
                      >
                        {deliveryEstimate}
                      </span>
                    ) : null}
                  </span>
                  <span className="font-semibold text-[color:var(--cyber-gold-soft)]">
                    {formatSaleorMoney(method.price)}
                  </span>
                </span>
              </button>
            );
          })
        ) : (
          <p className="rounded-md border border-[color:var(--cyber-gold)]/10 bg-background p-4 text-sm leading-6 text-foreground/56">
            Save a delivery address to load shipping methods.
          </p>
        )}
      </div>
    </section>
  );
}

function PaymentSection({
  canUsePayPalButtons,
  canUseStripeForm,
  checkout,
  onOrderPlaced,
  onSelectGateway,
  selectedGateway,
  selectedGatewayId,
}: {
  canUsePayPalButtons: boolean;
  canUseStripeForm: boolean;
  checkout: NtmsSaleorCheckout;
  onOrderPlaced: CheckoutOrderPlacedHandler;
  onSelectGateway: (gatewayId: string) => void;
  selectedGateway: NtmsSaleorCheckout["paymentGateways"][number] | null;
  selectedGatewayId: string;
}) {
  return (
    <section
      className="overflow-hidden rounded-md border border-[color:var(--cyber-gold)]/12 bg-card"
      data-saleor-checkout-payment-section
    >
      <div className="border-b border-[color:var(--cyber-gold)]/10 px-5 py-5">
        <div className="flex items-center gap-2 text-[color:var(--cyber-gold-soft)]">
          <CreditCard className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            Payment
          </p>
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Payment method
        </h2>
      </div>
      <div className="space-y-3 p-5">
        {checkout.paymentGateways.length > 0 ? (
          checkout.paymentGateways.map((gateway) => {
            const selected = selectedGatewayId === gateway.id;
            return (
              <button
                className={`w-full rounded-md border p-4 text-left transition ${
                  selected
                    ? "border-[color:var(--cyber-gold)]/36 bg-[color:var(--cyber-gold)]/10"
                    : "border-[color:var(--cyber-gold)]/12 bg-background hover:border-[color:var(--cyber-gold)]/28"
                } ${!gateway.supported ? "cursor-not-allowed opacity-55" : ""}`}
                data-saleor-payment-gateway-button
                data-saleor-payment-gateway-id={gateway.id}
                data-saleor-payment-gateway-kind={gateway.kind}
                data-saleor-payment-gateway-selected={
                  selected ? "true" : "false"
                }
                data-saleor-payment-gateway-supported={
                  gateway.supported ? "true" : "false"
                }
                disabled={!gateway.supported}
                key={gateway.id}
                onClick={() => onSelectGateway(gateway.id)}
                type="button"
              >
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block font-semibold text-foreground">
                      {gateway.name}
                    </span>
                    <p className="mt-1 text-sm text-foreground/52">
                      {gateway.currencies.join(", ")}
                    </p>
                  </span>
                  <span className="rounded-full border border-[color:var(--cyber-gold)]/14 bg-card px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--cyber-gold-soft)]">
                    {gateway.supportLabel}
                  </span>
                </span>
              </button>
            );
          })
        ) : (
          <p className="rounded-md border border-[color:var(--cyber-gold)]/10 bg-background p-4 text-sm leading-6 text-foreground/56">
            Select a delivery method to continue.
          </p>
        )}
        {selectedGateway?.kind === "stripe" ? (
          <StripePaymentPanel
            canUseStripeForm={canUseStripeForm}
            checkout={checkout}
            gatewayId={selectedGateway.id}
            onOrderPlaced={onOrderPlaced}
          />
        ) : null}
        {selectedGateway?.kind === "legacy-stripe" ? (
          <LegacyStripePaymentPanel
            canUseStripeForm={canUseStripeForm}
            checkout={checkout}
            gateway={selectedGateway}
            onOrderPlaced={onOrderPlaced}
          />
        ) : null}
        {selectedGateway?.kind === "paypal" ? (
          <PayPalPaymentPanel
            canUsePayPalButtons={canUsePayPalButtons}
            checkout={checkout}
            gatewayId={selectedGateway.id}
            onOrderPlaced={onOrderPlaced}
          />
        ) : null}
      </div>
    </section>
  );
}

function StripePaymentPanel({
  canUseStripeForm,
  checkout,
  gatewayId,
  onOrderPlaced,
}: {
  canUseStripeForm: boolean;
  checkout: NtmsSaleorCheckout;
  gatewayId: string;
  onOrderPlaced: CheckoutOrderPlacedHandler;
}) {
  const paymentSessionKey = getNtmsSaleorPaymentSessionKey(checkout, gatewayId);
  const activePaymentSessionKeyRef = useRef(paymentSessionKey);
  const paymentSessionRequestIdRef = useRef(0);
  const [failedPaymentSessionKey, setFailedPaymentSessionKey] = useState<
    string | null
  >(null);
  const [paymentSession, setPaymentSession] = useState<{
    key: string;
    value: {
      amount: number;
      currency: string;
      publishableKey: string;
    };
  } | null>(null);
  const initializeMutation = useMutation({
    mutationFn: async (variables: {
      checkoutId: string;
      gatewayId: string;
      requestId: number;
      sessionKey: string;
    }) => {
      const result = await initializeSaleorStripePayment({
        data: {
          checkoutId: variables.checkoutId,
          gatewayId: variables.gatewayId,
        },
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.payment;
    },
    onSuccess: (payment, variables) => {
      if (
        activePaymentSessionKeyRef.current !== variables.sessionKey ||
        paymentSessionRequestIdRef.current !== variables.requestId
      ) {
        return;
      }
      setFailedPaymentSessionKey(null);
      setPaymentSession({ key: variables.sessionKey, value: payment });
    },
    onError: (_error, variables) => {
      if (
        activePaymentSessionKeyRef.current !== variables.sessionKey ||
        paymentSessionRequestIdRef.current !== variables.requestId
      ) {
        return;
      }
      setPaymentSession(null);
      setFailedPaymentSessionKey(variables.sessionKey);
    },
  });

  useEffect(() => {
    activePaymentSessionKeyRef.current = paymentSessionKey;
    const requestId = paymentSessionRequestIdRef.current + 1;
    paymentSessionRequestIdRef.current = requestId;
    setPaymentSession(null);
    setFailedPaymentSessionKey(null);
    if (!canUseStripeForm) {
      return;
    }

    initializeMutation.mutate({
      checkoutId: checkout.id,
      gatewayId,
      requestId,
      sessionKey: paymentSessionKey,
    });
  }, [
    canUseStripeForm,
    checkout.id,
    gatewayId,
    initializeMutation.mutate,
    paymentSessionKey,
  ]);

  if (!canUseStripeForm) {
    return (
      <p className="rounded-md border border-[color:var(--cyber-gold)]/10 bg-background p-4 text-sm leading-6 text-foreground/56">
        Save delivery details and select a shipping method before entering card
        details.
      </p>
    );
  }

  if (failedPaymentSessionKey === paymentSessionKey) {
    return (
      <PaymentInitializationError
        onRetry={() => {
          activePaymentSessionKeyRef.current = paymentSessionKey;
          const requestId = paymentSessionRequestIdRef.current + 1;
          paymentSessionRequestIdRef.current = requestId;
          setFailedPaymentSessionKey(null);
          setPaymentSession(null);
          initializeMutation.mutate({
            checkoutId: checkout.id,
            gatewayId,
            requestId,
            sessionKey: paymentSessionKey,
          });
        }}
        message="The secure card form could not be loaded. Try again or choose a different payment method."
      />
    );
  }

  if (
    initializeMutation.isPending ||
    !paymentSession ||
    paymentSession.key !== paymentSessionKey
  ) {
    return (
      <div className="rounded-md border border-[color:var(--cyber-gold)]/10 bg-background p-4 text-sm font-semibold text-foreground/58">
        Initializing secure card form
      </div>
    );
  }

  return (
    <StripeElementsForm
      checkout={checkout}
      gatewayId={gatewayId}
      onOrderPlaced={onOrderPlaced}
      paymentSession={paymentSession.value}
    />
  );
}

function PayPalPaymentPanel({
  canUsePayPalButtons,
  checkout,
  gatewayId,
  onOrderPlaced,
}: {
  canUsePayPalButtons: boolean;
  checkout: NtmsSaleorCheckout;
  gatewayId: string;
  onOrderPlaced: CheckoutOrderPlacedHandler;
}) {
  const paymentSessionKey = getNtmsSaleorPaymentSessionKey(checkout, gatewayId);
  const activePaymentSessionKeyRef = useRef(paymentSessionKey);
  const paymentSessionRequestIdRef = useRef(0);
  const [failedPaymentSessionKey, setFailedPaymentSessionKey] = useState<
    string | null
  >(null);
  const [paymentSession, setPaymentSession] = useState<{
    key: string;
    value: {
      clientId: string;
      currency: string;
      environment: string;
      orderId: string;
      transactionId: string;
    };
  } | null>(null);
  const initializeMutation = useMutation({
    mutationFn: async (variables: {
      checkoutId: string;
      gatewayId: string;
      requestId: number;
      sessionKey: string;
    }) => {
      const result = await initializeSaleorPayPalPayment({
        data: {
          checkoutId: variables.checkoutId,
          gatewayId: variables.gatewayId,
        },
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.payment;
    },
    onSuccess: (payment, variables) => {
      if (
        activePaymentSessionKeyRef.current !== variables.sessionKey ||
        paymentSessionRequestIdRef.current !== variables.requestId
      ) {
        return;
      }
      setFailedPaymentSessionKey(null);
      setPaymentSession({ key: variables.sessionKey, value: payment });
    },
    onError: (_error, variables) => {
      if (
        activePaymentSessionKeyRef.current !== variables.sessionKey ||
        paymentSessionRequestIdRef.current !== variables.requestId
      ) {
        return;
      }
      setPaymentSession(null);
      setFailedPaymentSessionKey(variables.sessionKey);
    },
  });

  useEffect(() => {
    activePaymentSessionKeyRef.current = paymentSessionKey;
    const requestId = paymentSessionRequestIdRef.current + 1;
    paymentSessionRequestIdRef.current = requestId;
    setPaymentSession(null);
    setFailedPaymentSessionKey(null);
    if (!canUsePayPalButtons) {
      return;
    }

    initializeMutation.mutate({
      checkoutId: checkout.id,
      gatewayId,
      requestId,
      sessionKey: paymentSessionKey,
    });
  }, [
    canUsePayPalButtons,
    checkout.id,
    gatewayId,
    initializeMutation.mutate,
    paymentSessionKey,
  ]);

  if (!canUsePayPalButtons) {
    return (
      <p className="rounded-md border border-[color:var(--cyber-gold)]/10 bg-background p-4 text-sm leading-6 text-foreground/56">
        Save delivery details and select a shipping method before using PayPal.
      </p>
    );
  }

  if (failedPaymentSessionKey === paymentSessionKey) {
    return (
      <PaymentInitializationError
        onRetry={() => {
          activePaymentSessionKeyRef.current = paymentSessionKey;
          const requestId = paymentSessionRequestIdRef.current + 1;
          paymentSessionRequestIdRef.current = requestId;
          setFailedPaymentSessionKey(null);
          setPaymentSession(null);
          initializeMutation.mutate({
            checkoutId: checkout.id,
            gatewayId,
            requestId,
            sessionKey: paymentSessionKey,
          });
        }}
        message="PayPal Checkout could not be loaded. Try again or choose a different payment method."
      />
    );
  }

  if (
    initializeMutation.isPending ||
    !paymentSession ||
    paymentSession.key !== paymentSessionKey
  ) {
    return (
      <div className="rounded-md border border-[color:var(--cyber-gold)]/10 bg-background p-4 text-sm font-semibold text-foreground/58">
        Initializing PayPal Checkout
      </div>
    );
  }

  return (
    <SaleorPayPalButtons
      checkoutId={checkout.id}
      gatewayId={gatewayId}
      onOrderPlaced={onOrderPlaced}
      paymentSession={paymentSession.value}
    />
  );
}

function SaleorPayPalButtons({
  checkoutId,
  gatewayId,
  onOrderPlaced,
  paymentSession,
}: {
  checkoutId: string;
  gatewayId: string;
  onOrderPlaced: CheckoutOrderPlacedHandler;
  paymentSession: {
    clientId: string;
    currency: string;
    environment: string;
    orderId: string;
    transactionId: string;
  };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onOrderPlacedRef = useRef(onOrderPlaced);
  const paypalButtonsRef = useRef<PayPalButtonsInstance | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    onOrderPlacedRef.current = onOrderPlaced;
  }, [onOrderPlaced]);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    async function teardown() {
      if (paypalButtonsRef.current?.close) {
        try {
          await paypalButtonsRef.current.close();
        } catch (error) {
          console.error(error);
        }
      }

      paypalButtonsRef.current = null;
      if (container) {
        container.innerHTML = "";
      }
    }

    async function initialize() {
      setIsLoading(true);
      setPaymentError(null);
      await teardown();

      try {
        await loadSaleorPayPalSdk({
          clientId: paymentSession.clientId,
          currencyCode: paymentSession.currency,
        });

        const paypal = (window as PayPalSdkWindow).paypal;
        if (cancelled || !paypal || !container) {
          return;
        }

        const buttons = paypal.Buttons({
          style: {
            color: "gold",
            height: 46,
            layout: "vertical",
            shape: "rect",
            tagline: false,
          },
          createOrder: async () => paymentSession.orderId,
          onApprove: async ({ orderID }) => {
            if (!orderID) {
              throw new Error("PayPal approval did not include an order ID.");
            }
            if (orderID !== paymentSession.orderId) {
              throw new Error("PayPal returned an unexpected order ID.");
            }

            setIsApproving(true);
            setPaymentError(null);
            try {
              const processResult = await processSaleorPayPalPayment({
                data: { transactionId: paymentSession.transactionId },
              });
              if (!processResult.success) {
                throw new Error(processResult.error);
              }

              const completeResult = await completeSaleorCheckout({
                data: {
                  checkoutId,
                  gatewayId,
                },
              });
              if (!completeResult.success) {
                throw new Error(completeResult.error);
              }

              await onOrderPlacedRef.current(completeResult.order);
            } catch (error) {
              setPaymentError(
                error instanceof Error && error.message
                  ? error.message
                  : "PayPal payment failed.",
              );
            } finally {
              setIsApproving(false);
            }
          },
          onCancel: () => {
            setPaymentError(null);
          },
          onError: (error) => {
            console.error(error);
            setPaymentError(
              error instanceof Error && error.message
                ? error.message
                : "PayPal Checkout is currently unavailable.",
            );
          },
        });

        paypalButtonsRef.current = buttons;
        await buttons.render(container);

        if (!cancelled) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setPaymentError(
            error instanceof Error && error.message
              ? error.message
              : "Unable to initialize PayPal Checkout.",
          );
          setIsLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
      void teardown();
    };
  }, [
    checkoutId,
    gatewayId,
    paymentSession.clientId,
    paymentSession.currency,
    paymentSession.orderId,
    paymentSession.transactionId,
  ]);

  return (
    <div
      className="rounded-md border border-[color:var(--cyber-gold)]/12 bg-background p-4"
      data-saleor-paypal-payment-panel
    >
      <div className={isApproving ? "pointer-events-none opacity-50" : ""}>
        {isLoading ? (
          <div className="mb-3 rounded-md border border-[color:var(--cyber-gold)]/10 bg-card p-3 text-sm font-semibold text-foreground/58">
            Loading PayPal Checkout
          </div>
        ) : null}
        <div ref={containerRef} />
      </div>
      {isApproving ? (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-[color:var(--cyber-gold)]/10 bg-card p-3 text-sm font-semibold text-foreground/58">
          <Loader2 className="h-4 w-4 animate-spin" />
          Capturing PayPal payment
        </div>
      ) : null}
      {paymentError ? (
        <p className="mt-3 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm leading-6 text-destructive">
          {paymentError}
        </p>
      ) : null}
      <p className="mt-3 text-xs leading-5 text-foreground/45">
        PayPal opens a secure approval window and returns to Nuclear Tattoo
        Supply to place the order.
      </p>
    </div>
  );
}

function StripeElementsForm({
  checkout,
  gatewayId,
  onOrderPlaced,
  paymentSession,
}: {
  checkout: NtmsSaleorCheckout;
  gatewayId: string;
  onOrderPlaced: CheckoutOrderPlacedHandler;
  paymentSession: {
    amount: number;
    currency: string;
    publishableKey: string;
  };
}) {
  const stripePromise = useMemo(
    () => loadStripe(paymentSession.publishableKey),
    [paymentSession.publishableKey],
  );
  const options = useMemo<StripeElementsOptions>(
    () => ({
      amount: paymentSession.amount,
      appearance: {
        theme: "night",
        variables: {
          colorPrimary: "#f5b51b",
          colorBackground: "#101010",
          colorText: "#f6f0df",
          colorDanger: "#ff6b6b",
          borderRadius: "8px",
        },
      },
      currency: paymentSession.currency,
      mode: "payment",
    }),
    [paymentSession.amount, paymentSession.currency],
  );

  return (
    <Elements options={options} stripe={stripePromise}>
      <StripeCardForm
        checkout={checkout}
        gatewayId={gatewayId}
        onOrderPlaced={onOrderPlaced}
      />
    </Elements>
  );
}

function LegacyStripePaymentPanel({
  canUseStripeForm,
  checkout,
  gateway,
  onOrderPlaced,
}: {
  canUseStripeForm: boolean;
  checkout: NtmsSaleorCheckout;
  gateway: NtmsSaleorCheckout["paymentGateways"][number];
  onOrderPlaced: CheckoutOrderPlacedHandler;
}) {
  const publishableKey =
    getGatewayConfigValue(gateway, "public_api_key") ??
    getGatewayConfigValue(gateway, "api_key");

  if (!canUseStripeForm) {
    return (
      <p className="rounded-md border border-[color:var(--cyber-gold)]/10 bg-background p-4 text-sm leading-6 text-foreground/56">
        Save delivery details and select a shipping method before entering card
        details.
      </p>
    );
  }

  if (!publishableKey) {
    return (
      <p className="rounded-md border border-[color:var(--cyber-gold)]/10 bg-background p-4 text-sm leading-6 text-foreground/56">
        Stripe is enabled, but the public key is missing.
      </p>
    );
  }

  return (
    <LegacyStripeElementsForm
      checkout={checkout}
      gatewayId={gateway.id}
      onOrderPlaced={onOrderPlaced}
      publishableKey={publishableKey}
    />
  );
}

function LegacyStripeElementsForm({
  checkout,
  gatewayId,
  onOrderPlaced,
  publishableKey,
}: {
  checkout: NtmsSaleorCheckout;
  gatewayId: string;
  onOrderPlaced: CheckoutOrderPlacedHandler;
  publishableKey: string;
}) {
  const stripePromise = useMemo(
    () => loadStripe(publishableKey),
    [publishableKey],
  );

  return (
    <Elements stripe={stripePromise}>
      <LegacyStripeCardForm
        checkout={checkout}
        gatewayId={gatewayId}
        onOrderPlaced={onOrderPlaced}
      />
    </Elements>
  );
}

function LegacyStripeCardForm({
  checkout,
  gatewayId,
  onOrderPlaced,
}: {
  checkout: NtmsSaleorCheckout;
  gatewayId: string;
  onOrderPlaced: CheckoutOrderPlacedHandler;
}) {
  const elements = useElements();
  const stripe = useStripe();
  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!stripe || !elements) {
        throw new Error("Stripe card form is not ready");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Stripe card form is not ready");
      }

      const initializeResult = await initializeSaleorLegacyStripePayment({
        data: {
          checkoutId: checkout.id,
          gatewayId,
        },
      });

      if (!initializeResult.success) {
        throw new Error(initializeResult.error);
      }

      const billingAddress =
        checkout.billingAddress ?? checkout.shippingAddress;
      const paymentResult = await stripe.confirmCardPayment(
        initializeResult.payment.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              address: {
                city: billingAddress?.city ?? "",
                country: billingAddress?.countryCode ?? "US",
                line1: billingAddress?.streetAddress1 ?? "",
                line2: billingAddress?.streetAddress2 ?? "",
                postal_code: billingAddress?.postalCode ?? "",
                state: billingAddress?.countryArea ?? "",
              },
              email: checkout.email,
              name: `${billingAddress?.firstName ?? ""} ${
                billingAddress?.lastName ?? ""
              }`.trim(),
              phone: billingAddress?.phone || undefined,
            },
          },
        },
      );

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message ?? "Stripe payment failed");
      }

      const completeResult = await completeSaleorCheckout({
        data: {
          checkoutId: checkout.id,
          gatewayId,
        },
      });

      if (!completeResult.success) {
        throw new Error(completeResult.error);
      }

      return completeResult.order;
    },
    onSuccess: onOrderPlaced,
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to place order",
      );
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || completeMutation.isPending) {
      return;
    }

    completeMutation.mutate();
  };

  return (
    <form
      className="rounded-md border border-[color:var(--cyber-gold)]/12 bg-background p-4"
      onSubmit={handleSubmit}
    >
      <div className="rounded-md border border-[color:var(--cyber-gold)]/12 bg-card p-3">
        <CardElement options={legacyStripeCardElementOptions} />
      </div>
      <Button
        className="mt-4 h-11 w-full gap-2 font-semibold"
        disabled={!stripe || !elements || completeMutation.isPending}
        type="submit"
      >
        {completeMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShieldCheck className="h-4 w-4" />
        )}
        {completeMutation.isPending ? "Placing order" : "Pay by card"}
      </Button>
    </form>
  );
}

function StripeCardForm({
  checkout,
  gatewayId,
  onOrderPlaced,
}: {
  checkout: NtmsSaleorCheckout;
  gatewayId: string;
  onOrderPlaced: CheckoutOrderPlacedHandler;
}) {
  const elements = useElements();
  const stripe = useStripe();
  const createIntentMutation = useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const result = await createSaleorStripePaymentIntent({
        data: {
          checkoutId: checkout.id,
          gatewayId,
          paymentMethodId,
        },
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.payment;
    },
  });
  const processMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      const result = await processSaleorStripePayment({
        data: {
          transactionId,
        },
      });

      if (!result.success) {
        throw new Error(result.error);
      }
    },
  });
  const completeMutation = useMutation({
    mutationFn: async () => {
      const result = await completeSaleorCheckout({
        data: {
          checkoutId: checkout.id,
          gatewayId,
        },
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.order;
    },
    onSuccess: onOrderPlaced,
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to place order",
      );
    },
  });
  const isSubmitting =
    createIntentMutation.isPending ||
    processMutation.isPending ||
    completeMutation.isPending;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || isSubmitting) {
      return;
    }

    const submitResult = await elements.submit();
    if (submitResult.error) {
      toast.error(submitResult.error.message ?? "Card details are incomplete");
      return;
    }
    if (!submitResult.selectedPaymentMethod) {
      toast.error("Stripe did not return a payment method");
      return;
    }

    let paymentIntent:
      | {
          clientSecret: string;
          transactionId: string;
        }
      | undefined;
    try {
      paymentIntent = await createIntentMutation.mutateAsync(
        submitResult.selectedPaymentMethod,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create Stripe payment",
      );
      return;
    }

    const billingAddress = checkout.billingAddress ?? checkout.shippingAddress;
    const paymentResult = await stripe.confirmPayment({
      elements,
      clientSecret: paymentIntent.clientSecret,
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: {
          billing_details: {
            address: {
              city: billingAddress?.city ?? "",
              country: billingAddress?.countryCode ?? "US",
              line1: billingAddress?.streetAddress1 ?? "",
              line2: billingAddress?.streetAddress2 ?? "",
              postal_code: billingAddress?.postalCode ?? "",
              state: billingAddress?.countryArea ?? "",
            },
            email: checkout.email,
            name: `${billingAddress?.firstName ?? ""} ${
              billingAddress?.lastName ?? ""
            }`.trim(),
            phone: billingAddress?.phone || undefined,
          },
        },
      },
      redirect: "if_required",
    });

    if (paymentResult.error) {
      toast.error(paymentResult.error.message ?? "Stripe payment failed");
      return;
    }

    try {
      await processMutation.mutateAsync(paymentIntent.transactionId);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to process Stripe payment",
      );
      return;
    }

    completeMutation.mutate();
  };

  return (
    <form
      className="rounded-md border border-[color:var(--cyber-gold)]/12 bg-background p-4"
      onSubmit={handleSubmit}
    >
      <PaymentElement options={stripePaymentElementOptions} />
      <Button
        className="mt-4 h-11 w-full gap-2 font-semibold"
        disabled={!stripe || !elements || isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShieldCheck className="h-4 w-4" />
        )}
        {isSubmitting ? "Placing order" : "Pay by card"}
      </Button>
    </form>
  );
}

function loadSaleorPayPalSdk({
  clientId,
  currencyCode,
}: {
  clientId: string;
  currencyCode: string;
}) {
  const sdkSrc = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
    clientId,
  )}&components=buttons&currency=${encodeURIComponent(currencyCode)}&intent=capture`;

  if (
    (window as PayPalSdkWindow).paypal &&
    activeSaleorPayPalSdkSrc === sdkSrc &&
    activeSaleorPayPalSdkPromise
  ) {
    return activeSaleorPayPalSdkPromise;
  }

  if (activeSaleorPayPalSdkSrc !== sdkSrc) {
    document
      .querySelectorAll('script[data-paypal-sdk="true"]')
      .forEach((element) => {
        element.remove();
      });
    (window as PayPalSdkWindow).paypal = undefined;
    activeSaleorPayPalSdkPromise = undefined;
  }

  activeSaleorPayPalSdkSrc = sdkSrc;
  activeSaleorPayPalSdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.dataset.paypalSdk = "true";
    script.onerror = () =>
      reject(new Error("Failed to load the PayPal JavaScript SDK."));
    script.onload = () => resolve();
    script.src = sdkSrc;
    document.head.appendChild(script);
  });

  return activeSaleorPayPalSdkPromise;
}

function PaymentInitializationError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="rounded-md border border-destructive/20 bg-destructive/10 p-4"
      data-saleor-payment-initialization-error
      role="alert"
    >
      <p className="text-sm leading-6 text-foreground/76">{message}</p>
      <Button
        className="mt-3 gap-2"
        data-saleor-retry-payment-initialization
        onClick={onRetry}
        type="button"
        variant="outline"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}

function CheckoutSummary({
  canPlaceOrder,
  checkout,
  isPlacingOrder,
  onPlaceOrder,
  requiresPaymentPanel,
}: {
  canPlaceOrder: boolean;
  checkout: NtmsSaleorCheckout;
  isPlacingOrder: boolean;
  onPlaceOrder: () => void;
  requiresPaymentPanel: boolean;
}) {
  return (
    <aside className="sticky top-6 overflow-hidden rounded-md border border-[color:var(--cyber-gold)]/12 bg-card">
      <div className="border-b border-[color:var(--cyber-gold)]/10 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cyber-gold-soft)]">
          Order summary
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {checkout.quantity} item{checkout.quantity === 1 ? "" : "s"}
        </h2>
      </div>
      <ul className="max-h-[42vh] space-y-3 overflow-auto p-5">
        {checkout.lines.map((line) => (
          <li className="flex gap-3" key={line.id}>
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-[color:var(--cyber-gold)]/10 bg-background">
              {line.imageUrl ? (
                <img
                  alt={line.imageAlt}
                  className="h-full w-full object-contain p-1.5"
                  src={line.imageUrl}
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-semibold">
                {line.productName}
              </p>
              <p className="mt-1 text-xs text-foreground/45">
                Qty {line.quantity}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-[color:var(--cyber-gold-soft)]">
              {formatSaleorMoney(line.totalPrice)}
            </p>
          </li>
        ))}
      </ul>
      <div className="border-t border-[color:var(--cyber-gold)]/10 p-5">
        <SummaryRow label="Subtotal" price={checkout.subtotalPrice} />
        <SummaryRow label="Shipping" price={checkout.shippingPrice} />
        <div className="mt-3 flex items-center justify-between border-t border-[color:var(--cyber-gold)]/10 pt-3">
          <p className="font-semibold">Total</p>
          <p className="text-2xl font-semibold text-[color:var(--cyber-gold-soft)]">
            {formatSaleorMoney(checkout.totalPrice)}
          </p>
        </div>
        <Button
          className="mt-5 h-12 w-full gap-2 font-semibold"
          data-saleor-place-order-button
          disabled={!canPlaceOrder || isPlacingOrder}
          onClick={onPlaceOrder}
          type="button"
        >
          {isPlacingOrder ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          {isPlacingOrder ? "Placing order" : "Place order"}
        </Button>
        {!canPlaceOrder ? (
          <p className="mt-3 text-xs leading-5 text-foreground/45">
            {requiresPaymentPanel
              ? "Complete the selected payment method above to place the order."
              : "Save delivery details and select a shipping method before placing the order."}
          </p>
        ) : (
          <p className="mt-3 text-xs leading-5 text-foreground/45">
            Payment will be handled by the configured Saleor gateway.
          </p>
        )}
      </div>
    </aside>
  );
}

const stripePaymentElementOptions: StripePaymentElementOptions = {
  layout: "tabs",
  fields: {
    billingDetails: "never",
  },
};

const legacyStripeCardElementOptions = {
  hidePostalCode: true,
  style: {
    base: {
      "::placeholder": {
        color: "rgba(246, 240, 223, 0.42)",
      },
      color: "#f6f0df",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "16px",
      iconColor: "#f5b51b",
    },
    invalid: {
      color: "#ff6b6b",
      iconColor: "#ff6b6b",
    },
  },
};

function getGatewayConfigValue(
  gateway: NtmsSaleorCheckout["paymentGateways"][number],
  field: string,
) {
  return gateway.config.find((item) => item.field === field)?.value?.trim();
}

function CheckoutStepPill({
  active,
  icon,
  label,
  value,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`rounded-md border p-4 ${
        active
          ? "border-[color:var(--cyber-gold)]/24 bg-[color:var(--cyber-gold)]/9"
          : "border-[color:var(--cyber-gold)]/10 bg-card"
      }`}
    >
      <div className="flex items-center gap-2 text-[color:var(--cyber-gold-soft)]">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </p>
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function CheckoutInput({
  className,
  label,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
}) {
  return (
    <Field className={className}>
      <FieldLabel>
        {label}
        <Input className="mt-2 h-10" {...props} />
      </FieldLabel>
    </Field>
  );
}

function SummaryRow({
  label,
  price,
}: {
  label: string;
  price: { amount: number; currency: string };
}) {
  return (
    <div className="mb-2 flex items-center justify-between text-sm text-foreground/58">
      <p>{label}</p>
      <p>{formatSaleorMoney(price)}</p>
    </div>
  );
}

function getInitialFormValues(
  checkout: NtmsSaleorCheckout | null,
): CheckoutFormValues {
  const address = checkout?.shippingAddress;

  return {
    email: checkout?.email ?? "",
    firstName: address?.firstName ?? "",
    lastName: address?.lastName ?? "",
    companyName: address?.companyName ?? "",
    streetAddress1: address?.streetAddress1 ?? "",
    streetAddress2: address?.streetAddress2 ?? "",
    city: address?.city ?? "",
    postalCode: address?.postalCode ?? "",
    country: address?.countryCode ?? "US",
    countryArea: address?.countryArea ?? "",
    phone: address?.phone ?? "",
  };
}

function formatSaleorMoney(price: { amount: number; currency: string }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(price.amount);
}

function formatDeliveryEstimate(
  minimumDeliveryDays: number | null,
  maximumDeliveryDays: number | null,
) {
  const minimum = Number.isInteger(minimumDeliveryDays)
    ? minimumDeliveryDays
    : null;
  const maximum = Number.isInteger(maximumDeliveryDays)
    ? maximumDeliveryDays
    : null;
  if (minimum === null && maximum === null) return null;

  if (minimum !== null && maximum !== null) {
    if (minimum === maximum) {
      return `Estimated delivery: ${minimum} business ${minimum === 1 ? "day" : "days"}`;
    }
    return `Estimated delivery: ${minimum}-${maximum} business days`;
  }
  if (minimum !== null) return `Estimated delivery: ${minimum}+ business days`;
  return `Estimated delivery: within ${maximum} business days`;
}
