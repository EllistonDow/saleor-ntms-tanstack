import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-[color:var(--cyber-gold)]/70 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--cyber-gold)]/24 bg-[color:var(--cyber-gold)] text-black shadow-[0_10px_28px_rgba(247,200,31,.14)] hover:-translate-y-px hover:border-[color:var(--cyber-gold)]/40 hover:bg-[color:var(--cyber-gold-soft)] hover:shadow-[0_16px_34px_rgba(247,200,31,.18)]",
        destructive:
          "border-rose-500/30 bg-rose-500/15 text-rose-50 hover:bg-rose-500/20 focus-visible:ring-rose-500/20 dark:bg-rose-500/20 dark:text-rose-50",
        outline:
          "border-[color:var(--cyber-gold)]/16 bg-background/72 shadow-[inset_0_1px_0_rgba(255,255,255,.03)] hover:border-[color:var(--cyber-gold)]/36 hover:bg-[color:var(--cyber-gold)]/7 dark:bg-black/28 dark:border-white/10 dark:hover:bg-white/4",
        secondary:
          "border border-border bg-secondary/80 text-secondary-foreground hover:bg-secondary",
        ghost:
          "border-transparent hover:bg-[color:var(--cyber-gold)]/10 hover:text-[color:var(--cyber-gold-soft)] dark:hover:bg-[color:var(--cyber-gold)]/10",
        link: "border-transparent text-[color:var(--cyber-gold)] underline-offset-4 hover:text-[color:var(--cyber-gold-soft)] hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
