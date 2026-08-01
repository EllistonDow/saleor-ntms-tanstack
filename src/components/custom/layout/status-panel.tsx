import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatusPanelProps {
  title: string;
  description: ReactNode;
  eyebrow?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  variant?: "default" | "destructive";
  size?: "default" | "compact";
  testId?: string;
  className?: string;
}

export function StatusPanel({
  title,
  description,
  eyebrow,
  icon,
  actions,
  variant = "default",
  size = "default",
  testId,
  className,
}: StatusPanelProps) {
  const isDestructive = variant === "destructive";
  const isCompact = size === "compact";

  return (
    <section
      data-testid={testId}
      className={cn(
        "rounded-2xl border backdrop-blur-xl",
        isCompact
          ? "p-4 shadow-[0_18px_55px_rgba(0,0,0,.1)]"
          : "p-6 shadow-[0_24px_80px_rgba(0,0,0,.12)]",
        isDestructive
          ? "border-rose-500/20 bg-rose-500/10"
          : "border-[color:var(--cyber-gold)]/12 bg-card/90",
        className,
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-2xl">
          {eyebrow ? (
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.22em]",
                isDestructive
                  ? "text-rose-200/80"
                  : "text-[color:var(--cyber-gold-soft)]",
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <div
            className={cn(
              isCompact ? "mt-2" : "mt-3",
              "flex items-start",
              icon ? "gap-3" : "gap-0",
            )}
          >
            {icon ? (
              <div
                className={cn(
                  "mt-0.5 flex shrink-0 items-center justify-center rounded-xl border",
                  isCompact ? "h-9 w-9" : "h-11 w-11",
                  isDestructive
                    ? "border-rose-500/25 bg-rose-500/12 text-rose-100"
                    : "border-[color:var(--cyber-gold)]/12 bg-background/70 text-[color:var(--cyber-gold-soft)]",
                )}
              >
                {icon}
              </div>
            ) : null}
            <div className="min-w-0">
              <h2
                className={cn(
                  "font-semibold tracking-tight",
                  isCompact ? "text-lg" : "text-2xl",
                  isDestructive ? "text-rose-50" : "text-foreground",
                )}
              >
                {title}
              </h2>
              <div
                className={cn(
                  isCompact ? "mt-2" : "mt-3",
                  "text-sm leading-6",
                  isDestructive ? "text-rose-50/80" : "text-foreground/60",
                )}
              >
                {description}
              </div>
            </div>
          </div>
        </div>

        {actions ? (
          <div className="flex flex-wrap gap-3 lg:justify-end">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}
