import { useMatchRoute } from "@tanstack/react-router";
import { Circle, CircleCheck, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCheckoutSteps } from "@/lib/vendure/checkout-flow";

export function CheckoutSteps() {
  const matchRoute = useMatchRoute();
  const stepMatch = matchRoute({ to: "/checkout/$step" });
  const confirmationMatch = matchRoute({ to: "/checkout/confirmation/$code" });

  // If on confirmation page, show all steps as done
  // Otherwise, use the current step from params
  const currentStep = confirmationMatch
    ? "confirmation"
    : stepMatch
      ? stepMatch.step
      : undefined;
  const steps = getCheckoutSteps(currentStep);

  return (
    <nav
      aria-label="Checkout progress"
      className="relative min-w-0 overflow-hidden rounded-2xl border border-[color:var(--cyber-gold)]/14 bg-card/90 p-3 shadow-[0_18px_55px_rgba(0,0,0,.12)] backdrop-blur-xl"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--cyber-gold)]/75 to-transparent" />
      <ol className="grid max-w-full grid-cols-2 gap-2 sm:grid-cols-4">
        {steps.map((step, index) => {
          const isConfirmation = !!confirmationMatch;
          const isDone = isConfirmation || step.done;
          const isActive = step.active && !isConfirmation;

          return (
            <li
              key={`step-${step.identifier}`}
              className={cn({
                "z-10 flex min-w-0 items-center gap-3 rounded-xl border px-3 py-3 transition": true,
                "border-[color:var(--cyber-gold)]/12 bg-background/70 text-foreground/55":
                  !isDone && !isActive,
                "border-[color:var(--cyber-gold)]/25 bg-[color:var(--cyber-gold)]/10 text-[color:var(--cyber-gold-soft)]":
                  isDone,
                "border-[color:var(--cyber-gold)]/35 bg-[color:var(--cyber-gold)]/14 text-foreground shadow-[0_12px_28px_rgba(0,0,0,.08)]":
                  isActive,
              })}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[color:var(--cyber-gold)]/14 bg-background/65">
                {isDone && <CircleCheck className="h-4 w-4" />}
                {isActive && <CircleDot className="h-4 w-4" />}
                {!isActive && !isDone && <Circle className="h-4 w-4" />}
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/42">
                  Step {index + 1}
                </span>
                <span className="block truncate text-sm font-semibold">
                  {step.title}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
