import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthTab = "sign-in" | "register";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  buildVersion?: string | null;
  className?: string;
  activeAuthTab?: AuthTab;
}

export function AuthShell({
  title,
  children,
  footer,
  buildVersion,
  className,
  activeAuthTab,
}: AuthShellProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        "mx-auto flex min-h-[calc(100vh-92px)] w-full max-w-screen-2xl items-start justify-center px-4 py-8 text-foreground sm:px-6 sm:py-10 lg:px-8",
        className,
      )}
    >
      <aside className="w-full max-w-xl rounded-lg border border-[color:var(--cyber-gold)]/14 bg-card/94 p-5 shadow-[0_18px_54px_rgba(0,0,0,.14)] backdrop-blur-xl sm:p-6">
        {activeAuthTab ? <AuthTabs activeTab={activeAuthTab} /> : null}
        {children}
        {footer || buildVersion ? (
          <div className="mt-5 border-t border-[color:var(--cyber-gold)]/10 pt-5">
            {footer}
            {buildVersion ? (
              <p
                className={cn(
                  "text-center text-xs text-foreground/38",
                  footer ? "mt-4" : "",
                )}
                data-testid="storefront-version"
              >
                Build {buildVersion}
              </p>
            ) : null}
          </div>
        ) : null}
      </aside>
    </section>
  );
}

function AuthTabs({ activeTab }: { activeTab: AuthTab }) {
  return (
    <nav
      aria-label="Account access"
      className="mb-6 grid grid-cols-2 rounded-lg border border-[color:var(--cyber-gold)]/14 bg-background/56 p-1"
    >
      <AuthTabLink
        active={activeTab === "sign-in"}
        label="Sign in"
        to="/sign-in"
      />
      <AuthTabLink
        active={activeTab === "register"}
        label="Sign up"
        to="/register"
      />
    </nav>
  );
}

function AuthTabLink({
  active,
  label,
  to,
}: {
  active: boolean;
  label: string;
  to: "/sign-in" | "/register";
}) {
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-10 items-center justify-center rounded-md text-sm font-bold transition",
        active
          ? "bg-[color:var(--cyber-gold)] text-black shadow-[0_10px_28px_rgba(245,184,0,.22)]"
          : "text-foreground/55 hover:bg-card/80 hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
