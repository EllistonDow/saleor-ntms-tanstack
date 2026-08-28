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
        className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-[#d2d2d7]/50 bg-[#f5f5f7] px-3.5 py-2"
        data-saleor-promo-code-active
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <TicketPercent className="h-4 w-4 shrink-0 text-[#0071e3]" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">
              Promo Applied
            </p>
            <p className="truncate text-sm font-semibold text-[#1d1d1f]">
              {activeCode}
            </p>
          </div>
        </div>
        <button
          aria-label="Remove promo code"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#86868b] transition hover:bg-black/5 hover:text-[#1d1d1f] disabled:cursor-not-allowed disabled:opacity-50"
          data-saleor-remove-promo-code
          disabled={isMutating}
          onClick={handleRemove}
          title="Remove promo code"
          type="button"
        >
          {isMutating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <X className="h-3.5 w-3.5" />
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
        <TicketPercent className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#86868b]" />
        <Input
          aria-label="Promo code"
          autoCapitalize="characters"
          autoComplete="off"
          className="h-10 rounded-full border-[#d2d2d7]/60 bg-[#f5f5f7] pl-10 text-xs font-medium text-[#1d1d1f] placeholder:text-[#86868b] focus-visible:border-[#0071e3] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0071e3]/20"
          data-saleor-promo-code-input
          disabled={isMutating}
          onChange={(event) => setCode(event.currentTarget.value)}
          placeholder="Promo code"
          spellCheck={false}
          value={code}
        />
      </div>
      <Button
        className="h-10 shrink-0 rounded-full border-none bg-[#f5f5f7] px-4 text-xs font-semibold text-[#1d1d1f] shadow-none hover:bg-[#e8e8ed] hover:text-[#0071e3] disabled:opacity-50"
        data-saleor-apply-promo-code
        disabled={isMutating || !code.trim()}
        type="submit"
        variant="ghost"
      >
        {isMutating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        Apply
      </Button>
    </form>
  );
}
