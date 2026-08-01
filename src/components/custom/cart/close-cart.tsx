import clsx from "clsx";
import { X } from "lucide-react";

export default function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--cyber-gold)]/25 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.04)] transition-all hover:border-[color:var(--cyber-gold)]/60 hover:text-[color:var(--cyber-gold-soft)] dark:text-white">
      <X
        className={clsx(
          "h-6 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />
    </div>
  );
}
