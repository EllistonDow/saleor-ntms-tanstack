import { Link } from "@tanstack/react-router";
import { CheckCircle2, PackageCheck, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NtmsSaleorOrder } from "@/lib/saleor/checkout";

export function NtmsSaleorOrderConfirmationPage({
  order,
}: {
  order: NtmsSaleorOrder | null;
}) {
  if (!order) {
    return (
      <main className="min-h-screen bg-[#fbfbfd] px-4 py-16 text-[#1d1d1f]">
        <div className="mx-auto max-w-screen-md">
          <Link
            to="/"
            className="text-sm font-semibold tracking-tight text-[#1d1d1f] transition hover:text-[#0071e3]"
          >
            Nuclear Tattoo Supply
          </Link>
          <div className="mt-8 rounded-[1.5rem] border border-black/[0.06] bg-white p-12 text-center shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
            <PackageCheck className="mx-auto h-10 w-10 text-[#86868b]" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#1d1d1f]">
              Order not found
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6e6e73]">
              The Saleor order confirmation link is no longer available.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                asChild
                className="rounded-full bg-[#0071e3] px-6 text-white hover:bg-[#0077ed]"
              >
                <Link to="/search">Search products</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-black/10 text-[#1d1d1f] hover:bg-black/[0.03]"
              >
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
      className="min-h-screen bg-gradient-to-b from-[#ffffff] via-[#fbfbfd] to-[#f5f5f7] text-[#1d1d1f]"
      data-saleor-order-confirmation-page
    >
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#ffffff]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-6 py-4">
          <Link
            to="/"
            className="text-base font-semibold tracking-tight text-[#1d1d1f] transition hover:opacity-70"
          >
            Nuclear Tattoo Supply
          </Link>
          <span className="rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-emerald-600">
            Confirmed
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-screen-2xl gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
        <section className="overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
          <div className="border-b border-black/[0.06] px-6 py-6">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                Order confirmed
              </p>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1d1d1f] sm:text-4xl">
              Order #{order.number}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e6e73]">
              Thank you! Your checkout was accepted and your order has been created.
            </p>
          </div>

          <div className="grid gap-3 p-6 sm:grid-cols-3">
            <Metric label="Status" value={order.statusDisplay} />
            <Metric label="Payment" value={order.paymentStatusDisplay} />
            <Metric
              label="Delivery"
              value={order.shippingMethodName || "Standard Shipping"}
            />
          </div>

          <div className="border-t border-black/[0.06] p-6">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0071e3]">
              <ReceiptText className="h-4 w-4" />
              Purchased items ({order.lines.length})
            </h2>
            <ul className="mt-4 space-y-3.5">
              {order.lines.map((line) => (
                <li
                  className="flex items-center gap-3.5 rounded-2xl border border-black/[0.06] bg-[#fbfbfd] p-4 transition hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                  key={line.id}
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-black/[0.06] bg-white">
                    {line.imageUrl ? (
                      <img
                        alt={line.imageAlt}
                        className="h-full w-full object-contain p-1.5 mix-blend-multiply"
                        src={line.imageUrl}
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-[#1d1d1f]">
                      {line.productName}
                    </p>
                    <p className="mt-0.5 text-xs text-[#86868b]">
                      Qty {line.quantity}
                      {line.sku ? ` · SKU ${line.sku}` : ""}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-[#1d1d1f]">
                    {formatSaleorMoney(line.totalPrice)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="sticky top-24 overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
          <div className="border-b border-black/[0.06] px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0071e3]">
              Receipt Summary
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-[#1d1d1f]">
              {order.userEmail || "Guest order"}
            </h2>
          </div>
          <div className="p-6">
            <SummaryRow label="Subtotal" price={order.subtotalPrice} />
            <SummaryRow label="Shipping" price={order.shippingPrice} />
            <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-4">
              <p className="text-base font-bold text-[#1d1d1f]">Total</p>
              <p className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
                {formatSaleorMoney(order.totalPrice)}
              </p>
            </div>
            <div className="mt-6 grid gap-3">
              <Button
                asChild
                className="h-12 rounded-full bg-[#0071e3] font-semibold text-white shadow-sm hover:bg-[#0077ed]"
              >
                <Link to="/">Continue shopping</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-black/10 text-[#1d1d1f] hover:bg-black/[0.03]"
              >
                <Link to="/search">Search catalog</Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-[#fbfbfd] p-4.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
        {label}
      </p>
      <p className="mt-1.5 truncate text-sm font-bold text-[#1d1d1f]">{value}</p>
    </div>
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
    <div className="mb-2.5 flex items-center justify-between text-sm text-[#6e6e73]">
      <p className="font-normal">{label}</p>
      <p className="font-medium text-[#1d1d1f]">{formatSaleorMoney(price)}</p>
    </div>
  );
}

function formatSaleorMoney(price: { amount: number; currency: string }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(price.amount);
}
