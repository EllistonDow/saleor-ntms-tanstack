import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import type { NtmsSaleorCartLine } from "@/lib/saleor/checkout";
import { cn } from "@/lib/utils";
import { useSaleorCart } from "./ntms-cart-context";
import { NtmsSaleorPromoCode } from "./ntms-promo-code";

export function NtmsSaleorCartDrawer() {
  const {
    checkout,
    clearCartSession,
    closeCart,
    isCartOpen,
    isLoading,
    isMutating,
    removeLine,
    updateLine,
  } = useSaleorCart();
  const quantity = checkout?.quantity ?? 0;
  const hasLines = Boolean(checkout && checkout.lines.length > 0);

  const handleUpdateLine = async (
    line: NtmsSaleorCartLine,
    quantity: number,
  ) => {
    try {
      await updateLine({ lineId: line.id, quantity });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update item",
      );
    }
  };

  const handleRemoveLine = async (line: NtmsSaleorCartLine) => {
    try {
      await removeLine(line.id);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to remove item",
      );
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="fixed inset-0 bg-black/65 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all ease-in-out duration-300 data-[state=open]:backdrop-blur-[2px] data-[state=closed]:backdrop-blur-none"
        className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-full flex-col gap-0 border-l border-[color:var(--cyber-gold)]/18 bg-card p-0 text-foreground shadow-[0_30px_90px_rgba(0,0,0,.34)] md:w-[440px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right transition-all ease-in-out duration-300 sm:max-w-none"
        data-saleor-cart-drawer
      >
        <div className="border-b border-[color:var(--cyber-gold)]/14 bg-background px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase text-[color:var(--cyber-gold-soft)]">
                  Cart
                </p>
                {quantity > 0 ? (
                  <span className="rounded-full border border-[color:var(--cyber-cyan)]/18 bg-background/70 px-2 py-0.5 text-[11px] font-semibold text-foreground/58">
                    {quantity} item{quantity === 1 ? "" : "s"}
                  </span>
                ) : null}
              </div>
              <SheetTitle className="mt-2 text-2xl font-semibold">
                Your cart
              </SheetTitle>
              <p className="mt-2 max-w-xs text-sm leading-5 text-foreground/52">
                Review quantities and totals before checkout.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close cart"
              onClick={closeCart}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[color:var(--cyber-gold)]/18 text-foreground/60 transition hover:border-[color:var(--cyber-gold)]/46 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <SheetDescription className="sr-only">
            Review and manage your cart items
          </SheetDescription>
        </div>

        {isLoading && !checkout ? (
          <div className="flex flex-1 items-center justify-center text-sm text-foreground/55">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-[color:var(--cyber-gold-soft)]" />
            Loading cart
          </div>
        ) : !hasLines ? (
          <div className="px-5 pt-5 sm:px-6">
            <div className="rounded-md border border-[color:var(--cyber-gold)]/14 bg-background p-6 text-center">
              <ShoppingCart className="mx-auto h-8 w-8 text-[color:var(--cyber-gold-soft)]" />
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                Your cart is empty
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-foreground/55">
                Add products to continue to checkout.
              </p>
              <Button asChild className="mt-5">
                <Link to="/search" onClick={closeCart}>
                  Search products
                </Link>
              </Button>
            </div>
          </div>
        ) : checkout ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-5 pt-2 sm:px-6 sm:pb-6">
            <ul className="min-h-0 grow space-y-3 overflow-auto py-4 pr-1">
              {checkout.lines.map((line) => (
                <li
                  className="overflow-hidden rounded-md border border-[color:var(--cyber-gold)]/14 bg-background transition hover:border-[color:var(--cyber-gold)]/34"
                  data-saleor-cart-line
                  key={line.id}
                >
                  <div className="flex w-full gap-3 p-3">
                    <Link
                      aria-label={`Open ${line.productName}`}
                      className="relative h-[88px] w-[88px] flex-none overflow-hidden rounded-md border border-[color:var(--cyber-gold)]/14 bg-white"
                      onClick={closeCart}
                      params={{ productId: line.productSlug }}
                      to="/product/$productId"
                    >
                      {line.imageUrl ? (
                        <img
                          alt={line.imageAlt}
                          className="h-full w-full object-contain p-2"
                          loading="lazy"
                          src={line.imageUrl}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs font-semibold uppercase text-foreground/35">
                          {line.productName}
                        </div>
                      )}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <Link
                        className="z-30 min-w-0"
                        onClick={closeCart}
                        params={{ productId: line.productSlug }}
                        to="/product/$productId"
                      >
                        <span className="line-clamp-2 text-sm font-semibold leading-5 text-foreground transition hover:text-[color:var(--cyber-gold-soft)]">
                          {line.productName}
                        </span>
                        <p className="mt-1 truncate text-[11px] font-medium uppercase text-foreground/38">
                          SKU {line.sku || "pending"}
                        </p>
                      </Link>

                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase text-foreground/40">
                            Line total
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[color:var(--cyber-gold-soft)]">
                            {formatSaleorMoney(line.totalPrice)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="ml-auto flex h-9 flex-row items-center rounded-md border border-[color:var(--cyber-gold)]/14 bg-card p-0.5">
                            <QuantityButton
                              disabled={isMutating || line.quantity <= 1}
                              icon={<Minus className="h-3.5 w-3.5" />}
                              label="Decrease quantity"
                              onClick={() =>
                                handleUpdateLine(line, line.quantity - 1)
                              }
                            />
                            <p className="w-7 text-center">
                              <span className="w-full text-sm font-semibold">
                                {line.quantity}
                              </span>
                            </p>
                            <QuantityButton
                              disabled={
                                isMutating ||
                                (line.quantityAvailable !== null &&
                                  line.quantity >= line.quantityAvailable)
                              }
                              icon={<Plus className="h-3.5 w-3.5" />}
                              label="Increase quantity"
                              onClick={() =>
                                handleUpdateLine(line, line.quantity + 1)
                              }
                            />
                          </div>
                          <button
                            type="button"
                            aria-label="Remove item"
                            data-saleor-cart-remove-line
                            disabled={isMutating}
                            onClick={() => handleRemoveLine(line)}
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--cyber-gold)]/14 bg-card text-foreground/55 transition hover:border-red-300/30 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-[color:var(--cyber-gold)]/14 py-4">
              <NtmsSaleorPromoCode />
            </div>

            <div className="border-y border-[color:var(--cyber-gold)]/14 py-4 text-sm text-foreground/60">
              <SummaryRow
                label="Subtotal"
                price={checkout.originalSubtotalPrice}
              />
              {checkout.automaticDiscountPrice.amount > 0 ? (
                <SummaryRow
                  discount
                  label="Automatic quantity discount"
                  price={checkout.automaticDiscountPrice}
                />
              ) : null}
              {checkout.discountPrice.amount > 0 ? (
                <SummaryRow
                  discount
                  label={checkout.discountName || "Discount"}
                  price={checkout.discountPrice}
                />
              ) : null}
              <SummaryRow label="Shipping" price={checkout.shippingPrice} />
              <div className="mt-3 flex items-center justify-between border-t border-[color:var(--cyber-gold)]/12 pt-3">
                <p className="font-medium text-foreground">Total</p>
                <p className="text-xl font-semibold text-[color:var(--cyber-gold-soft)]">
                  {formatSaleorMoney(checkout.totalPrice)}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/checkout"
                onClick={closeCart}
                data-saleor-checkout-link
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[color:var(--cyber-gold)] px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-[color:var(--cyber-gold-soft)]"
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/search"
                onClick={closeCart}
                className="mt-3 flex w-full items-center justify-center rounded-md border border-[color:var(--cyber-gold)]/18 px-4 py-3 text-sm font-semibold text-foreground/62 transition hover:border-[color:var(--cyber-gold)]/42 hover:text-foreground"
              >
                Continue shopping
              </Link>
              <button
                type="button"
                onClick={clearCartSession}
                className="mt-3 w-full text-center text-xs font-semibold uppercase text-foreground/35 transition hover:text-foreground/65"
              >
                Reset cart
              </button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function QuantityButton({
  disabled,
  icon,
  label,
  onClick,
}: {
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-foreground/58 transition hover:bg-[color:var(--cyber-gold)]/10 hover:text-foreground",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {icon}
    </button>
  );
}

function SummaryRow({
  discount = false,
  label,
  price,
}: {
  discount?: boolean;
  label: string;
  price: { amount: number; currency: string };
}) {
  return (
    <div className="mb-3 flex items-center justify-between border-b border-[color:var(--cyber-gold)]/12 pb-2 last:mb-0">
      <p>{label}</p>
      <p
        className={cn(
          "text-right font-medium text-foreground",
          discount && "text-emerald-300",
        )}
      >
        {discount ? "-" : ""}
        {formatSaleorMoney(price)}
      </p>
    </div>
  );
}

function formatSaleorMoney(price: { amount: number; currency: string }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(price.amount);
}
