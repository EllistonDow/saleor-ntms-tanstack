import { ArrowRight, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSaleorCart } from "./ntms-cart-context";

export function NtmsSaleorAddToCartButton({
  className,
  disabled = false,
  label = "Add",
  quantity = 1,
  size = "compact",
  variantId,
}: {
  className?: string;
  disabled?: boolean;
  label?: string;
  quantity?: number;
  size?: "compact" | "full";
  variantId?: string;
}) {
  const { addLine, isMutating, openCart } = useSaleorCart();
  const canAdd = Boolean(variantId) && !disabled;
  const safeQuantity = Number.isFinite(quantity)
    ? Math.max(1, Math.floor(quantity))
    : 1;

  const handleAdd = async () => {
    if (!variantId || !canAdd) return;

    try {
      await addLine({ quantity: safeQuantity, variantId });
      openCart();
      toast.success("Item added to cart");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to add item",
      );
    }
  };

  if (size === "full") {
    return (
      <Button
        className={cn(
          "h-12 w-full gap-2 rounded-full bg-[#0071e3] font-medium text-white shadow-sm transition hover:bg-[#0077ed] active:scale-[0.99] disabled:bg-[#d2d2d7] disabled:text-[#86868b]",
          className,
        )}
        data-saleor-add-to-cart-button
        data-saleor-quantity={safeQuantity}
        data-saleor-variant-id={variantId}
        disabled={!canAdd || isMutating}
        onClick={handleAdd}
        type="button"
      >
        {isMutating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
        {isMutating ? "Adding..." : label}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      data-saleor-add-to-cart-button
      data-saleor-quantity={safeQuantity}
      data-saleor-variant-id={variantId}
      disabled={!canAdd || isMutating}
      onClick={handleAdd}
      className={cn(
        "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#0071e3] px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0077ed] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#f5f5f7] disabled:text-[#86868b] sm:px-4",
        className,
      )}
    >
      {isMutating ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <ArrowRight className="h-3.5 w-3.5" />
      )}
      <span>{isMutating ? "Adding..." : label}</span>
    </button>
  );
}
