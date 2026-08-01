import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Package2, ReceiptText } from "lucide-react";
import {
  CommercePageHero,
  CommerceSignal,
} from "@/components/custom/layout/commerce-surface";
import { StatusPanel } from "@/components/custom/layout/status-panel";
import { OrderStatusSummary } from "@/components/custom/order/order-status-summary";
import { Button } from "@/components/ui/button";
import { orderHistoryQueryOptions, useOrderHistory } from "@/hooks/use-orders";
import { type AccountOrder, formatSaleorCurrency } from "@/lib/account-types";
import { createBasicMeta } from "@/lib/metadata";
import { formatCurrency, formatDate, getOrderStatusColor } from "@/lib/utils";

export const Route = createFileRoute("/_account/account/orders/")({
  loader: async ({ context }) => {
    const ordersResult = await context.queryClient.ensureQueryData(
      orderHistoryQueryOptions(),
    );

    return {
      orders: ordersResult.items,
    };
  },
  head: ({ loaderData }) => {
    const ordersCount = loaderData?.orders?.length || 0;
    const description =
      ordersCount > 0
        ? `View your ${ordersCount} ${ordersCount === 1 ? "order" : "orders"}. Track shipments, view order details, and manage returns.`
        : "Your order history. Start shopping to see your orders here.";

    return {
      meta: createBasicMeta("Order History", description, true),
    };
  },
  component: AccountOrdersComponent,
});

function AccountOrdersComponent() {
  const { orders: loaderOrders } = Route.useLoaderData();
  const ordersQuery = useOrderHistory();
  const orders = ordersQuery.data?.items ?? loaderOrders;
  const orderCount = orders.length;

  return (
    <div className="space-y-6 py-4">
      <CommercePageHero
        eyebrow="Account"
        title="Order history"
        description="Track recent orders, review totals, and open any order detail."
        icon={<Package2 className="h-5 w-5" />}
        meta={
          <CommerceSignal icon={<Package2 className="h-4 w-4" />}>
            {orderCount} orders
          </CommerceSignal>
        }
      />

      {orderCount === 0 ? (
        <StatusPanel
          icon={<Package2 className="h-5 w-5" />}
          title="No orders yet"
          description="Your first order will appear here once checkout completes."
          actions={
            <>
              <Button asChild>
                <Link to="/">
                  Start shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/search">Search products</Link>
              </Button>
            </>
          }
        />
      ) : (
        <section className="overflow-hidden rounded-2xl border border-[color:var(--cyber-gold)]/10 bg-card/90 shadow-[0_18px_48px_rgba(0,0,0,.08)]">
          <div className="flex items-center justify-between gap-4 border-b border-[color:var(--cyber-gold)]/8 px-6 py-5">
            <div className="flex items-center gap-2 text-[color:var(--cyber-gold-soft)]">
              <ReceiptText className="h-4 w-4" />
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em]">
                Recent orders
              </h2>
            </div>
            <span className="rounded-full border border-[color:var(--cyber-gold)]/12 bg-background/60 px-2.5 py-1 text-xs text-foreground/55">
              Live account
            </span>
          </div>
          <ul className="divide-y divide-[color:var(--cyber-gold)]/10">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  to="/account/orders/$code"
                  params={{ code: order.code }}
                  className="block px-6 py-5 transition hover:bg-[color:var(--cyber-gold)]/3"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          Order #{order.code}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getOrderStatusColor(order.state)}`}
                        >
                          {order.stateLabel}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-foreground/55">
                        Placed on {formatDate(order.createdAt)} ·{" "}
                        {order.totalQuantity}{" "}
                        {order.totalQuantity === 1 ? "item" : "items"}
                      </p>
                      <OrderStatusSummary
                        compact
                        deliverySummary={getAccountDeliverySummary(order)}
                        orderState={order.stateLabel}
                        paymentSummary={getAccountPaymentSummary(order)}
                      />
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium text-foreground">
                        {formatAccountOrderCurrency(order, order.totalWithTax)}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 text-sm text-foreground/55">
                        View details
                        <ArrowRight className="h-4 w-4" />
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function formatAccountOrderCurrency(order: AccountOrder, amount: number) {
  return order.isSaleor
    ? formatSaleorCurrency(amount, order.currencyCode)
    : formatCurrency(amount, order.currencyCode);
}

function getAccountPaymentSummary(order: AccountOrder) {
  return order.paymentState || "Payment not recorded";
}

function getAccountDeliverySummary(order: AccountOrder) {
  return order.shippingMethodName || "Shipping not recorded";
}
