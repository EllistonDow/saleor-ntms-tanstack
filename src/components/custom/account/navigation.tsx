import { Link } from "@tanstack/react-router";
import {
  KeyRound,
  Mail,
  MapPinned,
  Package2,
  Settings2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { CommerceSignal } from "@/components/custom/layout/commerce-surface";
import { useAuth } from "@/hooks/use-auth";
import { SignOutButton } from "./sign-out-button";

const navigation = [
  { name: "Orders", href: "/account/orders", icon: Package2 },
  { name: "Addresses", href: "/account/addresses", icon: MapPinned },
  { name: "Settings", href: "/account/settings", icon: Settings2 },
  { name: "Security", href: "/account/security", icon: KeyRound },
];

export function AccountNavigation() {
  const { activeCustomer } = useAuth();
  const displayName = [activeCustomer?.firstName, activeCustomer?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className="relative overflow-hidden rounded-2xl border border-[color:var(--cyber-gold)]/14 bg-card/92 p-3 shadow-[0_18px_54px_rgba(0,0,0,.1)] backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--cyber-gold)]/70 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-1 bg-[color:var(--cyber-gold)]/70" />
      <div className="border-b border-[color:var(--cyber-gold)]/10 px-2 pb-4 pl-3">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color:var(--cyber-gold)]/18 bg-background/70 text-[color:var(--cyber-gold-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,.05)]">
            <UserRound className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cyber-gold-soft)]">
              Account
            </p>
            <p className="mt-1 truncate text-base font-semibold text-foreground">
              {displayName || "Customer account"}
            </p>
            {activeCustomer?.emailAddress ? (
              <p className="mt-1 flex min-w-0 items-center gap-1.5 truncate text-xs text-foreground/50">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{activeCustomer.emailAddress}</span>
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <CommerceSignal icon={<ShieldCheck className="h-3.5 w-3.5" />}>
            Verified session
          </CommerceSignal>
        </div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto lg:block lg:space-y-1.5 lg:overflow-visible">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="group flex min-w-fit items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition lg:min-w-0"
            activeProps={{
              className:
                "border border-[color:var(--cyber-gold)]/16 bg-[color:var(--cyber-gold)]/10 text-[color:var(--cyber-gold-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,.04)]",
            }}
            inactiveProps={{
              className:
                "text-foreground/62 hover:bg-[color:var(--cyber-gold)]/5 hover:text-foreground",
            }}
          >
            <span className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {item.name}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-3 border-t border-[color:var(--cyber-gold)]/8 pt-3">
        <SignOutButton variant="button" />
      </div>
    </nav>
  );
}
