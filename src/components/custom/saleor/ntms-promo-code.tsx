import { Loader2, TicketPercent, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSaleorCart } from "./ntms-cart-context";

export function NtmsSaleorPromoCode() {
  const { addPromoCode, checkout, isMutating, removePromoCode } =
    useSaleorCart();
  const [code, setCode] = useState("");
  const activeCode = checkout?.voucherCode.trim() ?? "";

  const handleApply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const promoCode = code.trim();
    if (!promoCode) return;
    try {
      await addPromoCode(promoCode);
      setCode("");
      toast.success("Promo code applied");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to apply promo code",
      );
    }
  };

  const handleRemove = async () => {
    try {
      await removePromoCode();
      toast.success("Promo code removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to remove promo code",
      );
    }
  };

  if (activeCode) {
    return (
      <div
        className="flex min-h-11 items-center justify-between gap-3 border border-emerald-300/20 bg-emerald-400/8 px-3 py-2"
        data-saleor-promo-code-active
      >
        <div className="flex min-w-0 items-center gap-2">
          <TicketPercent className="h-4 w-4 shrink-0 text-emerald-300" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase text-emerald-200/70">
              Promo applied
            </p>
            <p className="truncate text-sm font-semibold text-emerald-100">
              {activeCode}
            </p>
          </div>
        </div>
        <button
          aria-label="Remove promo code"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-emerald-100/65 transition hover:bg-emerald-300/10 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          data-saleor-remove-promo-code
          disabled={isMutating}
          onClick={handleRemove}
          title="Remove promo code"
          type="button"
        >
          {isMutating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex min-w-0 gap-2"
      data-saleor-promo-code-form
      onSubmit={handleApply}
    >
      <div className="relative min-w-0 flex-1">
        <TicketPercent className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground/38" />
        <Input
          aria-label="Promo code"
          autoCapitalize="characters"
          autoComplete="off"
          className="h-11 pl-9"
          data-saleor-promo-code-input
          disabled={isMutating}
          onChange={(event) => setCode(event.currentTarget.value)}
          placeholder="Promo code"
          spellCheck={false}
          value={code}
        />
      </div>
      <Button
        className="h-11 shrink-0 gap-2 px-4"
        data-saleor-apply-promo-code
        disabled={isMutating || !code.trim()}
        type="submit"
        variant="outline"
      >
        {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Apply
      </Button>
    </form>
  );
}
