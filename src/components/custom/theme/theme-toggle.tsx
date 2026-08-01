import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

const preferenceLabel = {
  light: "Light theme",
  dark: "Dark theme",
  system: "System theme",
};

export function ThemeToggle() {
  const { preference, resolvedTheme, toggleTheme } = useTheme();
  const Icon =
    preference === "system" ? Laptop : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <button
      type="button"
      aria-label={`Switch theme. Current: ${preferenceLabel[preference]}`}
      title={`Theme: ${preference}`}
      onClick={toggleTheme}
      className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--cyber-gold)]/25 bg-background/70 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.04)] backdrop-blur-xl transition-all hover:border-[color:var(--cyber-gold)]/60 hover:text-[color:var(--cyber-gold-soft)] dark:bg-black/35"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
