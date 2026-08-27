import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
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
        overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-full flex-col gap-0 border-l border-black/[0.06] bg-white p-0 text-[#1d1d1f] shadow-2xl md:w-[460px] sm:max-w-none antialiased"
        data-saleor-cart-drawer
      >
        {/* Header */}
        <div className="border-b border-black/[0.06] bg-white px-6 py-6 font-sans">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0071e3]">
                  Review
                </span>
                {quantity > 0 ? (
                  <span className="rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-[11px] font-bold text-[#1d1d1f]">
                    {quantity} {quantity === 1 ? "item" : "items"}
                  </span>
                ) : null}
              </div>
              <SheetTitle className="mt-1 text-2xl font-extrabold tracking-tight text-[#1d1d1f]">
                Studio Bag
              </SheetTitle>
            </div>
            <button
              type="button"
              aria-label="Close cart"
              onClick={closeCart}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f] transition hover:bg-[#e8e8ed] hover:scale-105"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <SheetDescription className="sr-only">
            Review and manage your cart items
          </SheetDescription>
        </div>

        {/* Body */}
        {isLoading && !checkout ? (
          <div className="flex flex-1 items-center justify-center text-sm font-semibold text-[#86868b]">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#0071e3]" />
            Updating bag...
          </div>
        ) : !hasLines ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f5f5f7] text-[#86868b]">
              <ShoppingBag className="h-9 w-9 text-[#86868b]" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#1d1d1f]">
              Your Bag is Empty
            </h2>
            <p className="mt-2 text-sm text-[#6e6e73]">
              Supplies and hardware you add will appear here.
            </p>
            <Button
              asChild
              className="mt-6 rounded-full bg-[#0071e3] px-6 text-white hover:bg-[#0077ed]"
            >
              <Link to="/search" onClick={closeCart}>
                Explore Catalog
              </Link>
            </Button>
          </div>
        ) : checkout ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6 pt-2">
            <ul className="min-h-0 grow space-y-4 overflow-auto py-4 pr-1">
              {checkout.lines.map((line) => (
                <li
                  className="overflow-hidden rounded-2xl bg-[#fbfbfd] p-3.5 shadow-sm transition hover:shadow-md"
                  data-saleor-cart-line
                  key={line.id}
                >
                  <div className="flex w-full gap-4">
                    <Link
                      aria-label={`Open ${line.productName}`}
                      className="relative h-20 w-20 flex-none overflow-hidden rounded-xl bg-white p-2 shadow-inner"
                      onClick={closeCart}
                      params={{ productId: line.productSlug }}
                      to="/product/$productId"
                    >
                      {line.imageUrl ? (
                        <img
                          alt={line.imageAlt}
                          className="h-full w-full object-contain mix-blend-multiply"
                          loading="lazy"
                          src={line.imageUrl}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-center text-[10px] font-bold uppercase text-[#86868b]">
                          {line.productName}
                        </div>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <Link
                        className="min-w-0"
                        onClick={closeCart}
                        params={{ productId: line.productSlug }}
                        to="/product/$productId"
                      >
                        <span className="line-clamp-2 text-xs font-bold text-[#1d1d1f] hover:text-[#0071e3]">
                          {line.productName}
                        </span>
                        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#86868b]">
                          SKU {line.sku || "N/A"}
                        </p>
                      </Link>

                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs font-extrabold text-[#1d1d1f]">
                          {formatSaleorMoney(line.totalPrice)}
                        </p>

                        <div className="flex items-center gap-2">
                          <div className="flex h-7 items-center rounded-full bg-white p-0.5 shadow-sm">
                            <QuantityButton
                              disabled={isMutating || line.quantity <= 1}
                              icon={
                                <Minus className="h-3 w-3 text-[#1d1d1f]" />
                              }
                              label="Decrease quantity"
                              onClick={() =>
                                handleUpdateLine(line, line.quantity - 1)
                              }
                            />
                            <span className="w-5 text-center text-xs font-bold text-[#1d1d1f]">
                              {line.quantity}
                            </span>
                            <QuantityButton
                              disabled={
                                isMutating ||
                                (line.quantityAvailable !== null &&
                                  line.quantity >= line.quantityAvailable)
                              }
                              icon={<Plus className="h-3 w-3 text-[#1d1d1f]" />}
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
                            className="flex h-7 w-7 items-center justify-center rounded-full text-[#86868b] transition hover:bg-[#e8e8ed] hover:text-red-500"
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

            <div className="border-t border-black/[0.06] pt-4">
              <NtmsSaleorPromoCode />
            </div>

            {/* Total and Checkout */}
            <div className="border-y border-black/[0.06] py-4 text-xs font-medium text-[#6e6e73] space-y-1.5">
              <SummaryRow
                label="Subtotal"
                price={checkout.originalSubtotalPrice}
              />
              {checkout.automaticDiscountPrice.amount > 0 ? (
                <SummaryRow
                  discount
                  label="Automatic Promotion"
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
              <SummaryRow
                label="Estimated Freight"
                price={checkout.shippingPrice}
              />

              <div className="mt-3 flex items-center justify-between border-t border-black/[0.06] pt-3 text-[#1d1d1f]">
                <span className="text-sm font-bold">Total Due</span>
                <span className="text-lg font-extrabold text-[#1d1d1f]">
                  {formatSaleorMoney(checkout.totalPrice)}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/checkout"
                onClick={closeCart}
                data-saleor-checkout-link
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0071e3] py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,113,227,0.3)] transition-all hover:bg-[#0077ed] hover:shadow-[0_6px_20px_rgba(0,113,227,0.4)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Checkout with Bag
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={clearCartSession}
                className="mt-3 w-full text-center text-[11px] font-semibold text-[#86868b] transition hover:text-[#1d1d1f]"
              >
                Clear Cart
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
        "flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-[#f5f5f7]",
        disabled && "cursor-not-allowed opacity-30",
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
  price: { amount: number; currency: string } | null;
}) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span
        className={cn(
          "font-medium",
          discount ? "text-emerald-600" : "text-[#1d1d1f]",
        )}
      >
        {price
          ? discount
            ? `-${formatSaleorMoney(price)}`
            : formatSaleorMoney(price)
          : "Free"}
      </span>
    </div>
  );
}

function formatSaleorMoney(price: { amount: number; currency: string }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(price.amount);
}
