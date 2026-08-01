import { useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useSignOutMutation } from "@/hooks/use-account-mutations";

export function SignOutButton({
  variant = "dropdown",
}: {
  variant?: "dropdown" | "button";
}) {
  const router = useRouter();
  const signOutMutation = useSignOutMutation();
  const label = signOutMutation.isPending ? "Signing out..." : "Sign out";
  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Error signing out",
        );
      },
      onSuccess: async () => {
        await router.navigate({ to: "/" });
        await router.invalidate();
      },
    });
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        disabled={signOutMutation.isPending}
        onClick={handleSignOut}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[color:var(--cyber-gold)]/12 bg-background/55 px-3 py-2.5 text-sm font-medium text-foreground/62 transition hover:border-rose-500/28 hover:bg-rose-500/10 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        {label}
      </button>
    );
  }

  return (
    <DropdownMenuItem
      disabled={signOutMutation.isPending}
      onSelect={(event) => {
        event.preventDefault();
        handleSignOut();
      }}
    >
      {label}
    </DropdownMenuItem>
  );
}
