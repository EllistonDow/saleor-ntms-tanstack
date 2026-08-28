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
      <main className="min-h-screen bg-[#fbfbfd] px-4 py-16 text-[#1d1d1f] antialiased">
        <div className="mx-auto max-w-screen-md">
          <Link
            to="/"
            className="text-xs font-semibold tracking-wider uppercase text-[#86868b] transition hover:text-[#1d1d1f]"
          >
            Nuclear Tattoo Supply
          </Link>
          <div className="mt-8 rounded-[2rem] border border-black/[0.04] bg-white p-10 text-center shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f5f7]">
              <PackageCheck className="h-7 w-7 text-[#86868b]" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">
              Order not found
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6e6e73]">
              The Saleor order confirmation link is no longer available.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button
                asChild
                className="h-11 rounded-full bg-[#0071e3] px-6 font-medium text-white shadow-sm hover:bg-[#0077ed]"
              >
                <Link to="/search">Search Products</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-[#d2d2d7] bg-white px-6 font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]"
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
    <main className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] antialiased">
      <header className="border-b border-black/[0.04] bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-6 py-4">
          <Link
            to="/"
            className="text-xs font-semibold uppercase tracking-wider text-[#86868b] transition hover:text-[#1d1d1f]"
          >
            Nuclear Tattoo Supply
          </Link>
          <span className="rounded-full bg-[#f5f5f7] px-3.5 py-1 text-xs font-semibold tracking-tight text-[#1d1d1f]">
            Confirmation
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-screen-2xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-black/[0.04] bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-[#0071e3]">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-wider">
                Order Confirmed
              </p>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1d1d1f] sm:text-4xl">
              Order #{order.number}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6e6e73]">
              Your checkout was accepted and your order has been created.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric label="Status" value={order.statusDisplay} />
              <Metric label="Payment" value={order.paymentStatusDisplay} />
              <Metric
                label="Delivery"
                value={order.shippingMethodName || "Standard"}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/[0.04] bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              <ReceiptText className="h-4 w-4 text-[#0071e3]" />
              Items
            </h2>
            <ul className="mt-6 divide-y divide-black/[0.04]">
              {order.lines.map((line) => (
                <li
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  key={line.id}
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#f5f5f7] p-2">
                    {line.imageUrl ? (
                      <img
                        alt={line.imageAlt}
                        className="h-full w-full object-contain mix-blend-multiply"
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
                  <p className="shrink-0 text-sm font-semibold text-[#1d1d1f]">
                    {formatSaleorMoney(line.totalPrice)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="sticky top-20 rounded-[2rem] border border-black/[0.04] bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
          <div className="border-b border-black/[0.04] pb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              Receipt Summary
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#1d1d1f]">
              {order.userEmail || "Guest Order"}
            </h2>
          </div>
          <div className="pt-5">
            <SummaryRow label="Subtotal" price={order.subtotalPrice} />
            <SummaryRow label="Shipping" price={order.shippingPrice} />
            <div className="mt-4 flex items-center justify-between border-t border-black/[0.04] pt-4">
              <p className="text-base font-semibold text-[#1d1d1f]">Total</p>
              <p className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
                {formatSaleorMoney(order.totalPrice)}
              </p>
            </div>
            <div className="mt-6 grid gap-3">
              <Button
                asChild
                className="h-11 w-full rounded-full bg-[#0071e3] font-medium text-white shadow-sm hover:bg-[#0077ed]"
              >
                <Link to="/">Continue Shopping</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-full border-[#d2d2d7] bg-white font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]"
              >
                <Link to="/search">Search Products</Link>
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
    <div className="rounded-2xl bg-[#f5f5f7] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#1d1d1f]">{value}</p>
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
      <p>{label}</p>
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
