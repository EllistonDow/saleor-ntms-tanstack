import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-[color:var(--cyber-gold)]/70 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--cyber-gold)]/25 bg-[color:var(--cyber-gold)]/12 text-[color:var(--cyber-gold-soft)] [a&]:hover:bg-[color:var(--cyber-gold)]/18",
        secondary:
          "border-[color:var(--cyber-cyan)]/20 bg-[color:var(--cyber-cyan)]/10 text-[color:var(--cyber-cyan)] [a&]:hover:bg-[color:var(--cyber-cyan)]/14",
        destructive:
          "border-rose-500/30 bg-rose-500/12 text-rose-100 [a&]:hover:bg-rose-500/18 focus-visible:ring-rose-500/20 dark:bg-rose-500/18 dark:text-rose-50",
        outline:
          "border-[color:var(--cyber-gold)]/18 bg-background/60 text-foreground [a&]:hover:bg-[color:var(--cyber-gold)]/8 [a&]:hover:text-[color:var(--cyber-gold-soft)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
