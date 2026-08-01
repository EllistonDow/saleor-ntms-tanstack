import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { UserIcon } from "lucide-react";

export default function OpenSignIn({ className }: { className?: string }) {
  return (
    <Link
      to={"/sign-in"}
      className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--cyber-gold)]/25 bg-background/70 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.04)] backdrop-blur-xl transition-all hover:border-[color:var(--cyber-gold)]/60 hover:text-[color:var(--cyber-gold-soft)] dark:bg-black/35 dark:text-white"
    >
      <UserIcon
        className={clsx(
          "h-4 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />
    </Link>
  );
}
