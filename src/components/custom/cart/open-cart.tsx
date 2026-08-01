import clsx from "clsx";
import { ShoppingCartIcon } from "lucide-react";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--cyber-gold)]/25 bg-background/70 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.04)] backdrop-blur-xl transition-all hover:border-[color:var(--cyber-gold)]/60 hover:text-[color:var(--cyber-gold-soft)] dark:bg-black/35 dark:text-white">
      <ShoppingCartIcon
        className={clsx(
          "h-4 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />

      {quantity ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 flex h-5 min-w-5 items-center justify-center rounded-full border border-black/20 bg-[color:var(--cyber-magenta)] px-1 text-[11px] font-semibold leading-none text-white shadow-[0_0_16px_rgba(255,79,216,.35)]">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
