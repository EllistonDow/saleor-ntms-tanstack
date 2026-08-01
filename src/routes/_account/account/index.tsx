import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Mail, ShieldCheck, ShoppingBag, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { createBasicMeta } from "@/lib/metadata";
import { isSaleorStorefront } from "@/lib/storefront-mode";

export const Route = createFileRoute("/_account/account/")({
  preload: false,
  loader: () => {
    if (isSaleorStorefront) {
      return null;
    }

    throw redirect({
      to: "/account/orders",
    });
  },
  head: () => ({
    meta: createBasicMeta(
      "My Account",
      "View your Nuclear Tattoo Supply customer account.",
      true,
    ),
  }),
  component: AccountOverviewComponent,
});

function AccountOverviewComponent() {
  const { activeCustomer } = useAuth();
  const displayName = [activeCustomer?.firstName, activeCustomer?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-5 py-4">
      <section className="rounded-lg border border-[color:var(--cyber-gold)]/12 bg-card/90 p-5 shadow-[0_18px_48px_rgba(0,0,0,.1)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--cyber-gold-soft)]">
              Your account
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              {displayName || "My account"}
            </h1>
            {activeCustomer?.emailAddress ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-foreground/58">
                <Mail className="h-4 w-4 text-[color:var(--cyber-gold-soft)]" />
                {activeCustomer.emailAddress}
              </p>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--cyber-gold)]/14 bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground/60">
            <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--cyber-gold-soft)]" />
            Signed in
          </span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <AccountSummaryTile
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Shopping"
          value="Continue browsing the Nuclear Tattoo Supply catalog."
          action={
            <Button asChild>
              <Link to="/search">Shop products</Link>
            </Button>
          }
        />
        <AccountSummaryTile
          icon={<UserRound className="h-4 w-4" />}
          label="Profile"
          value="Signed-in customer profile."
        />
      </section>
    </div>
  );
}

function AccountSummaryTile({
  action,
  icon,
  label,
  value,
}: {
  action?: ReactNode;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[color:var(--cyber-gold)]/10 bg-card/76 p-5">
      <div className="flex items-center gap-2 text-[color:var(--cyber-gold-soft)]">
        {icon}
        <p className="text-xs font-bold uppercase tracking-[0.18em]">{label}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-foreground/58">{value}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
