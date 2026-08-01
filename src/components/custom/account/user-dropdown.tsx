import { Link } from "@tanstack/react-router";
import { UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "./sign-out-button";

type CustomerSummary = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddress?: string | null;
};

export function UserDropdown({ customer }: { customer: CustomerSummary }) {
  const fullName = `${customer.firstName} ${customer.lastName}`.trim();
  const displayName = fullName || customer.emailAddress || "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account menu for ${displayName}`}
          className="relative flex h-11 w-auto cursor-pointer items-center justify-center rounded-lg border border-[color:var(--cyber-gold)]/25 bg-background/70 px-3 md:px-4 text-sm font-medium text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.04)] backdrop-blur-xl transition-all hover:border-[color:var(--cyber-gold)]/60 hover:text-[color:var(--cyber-gold-soft)] dark:bg-black/35 dark:text-white"
        >
          <UserIcon className="h-4 transition-all ease-in-out md:mr-1" />
          <span className="hidden md:inline ml-1">{displayName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Hello, {displayName}!</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/account">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account/orders">Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account/addresses">Addresses</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account/security">Security</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
