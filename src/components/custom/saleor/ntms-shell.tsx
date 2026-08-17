import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/custom/theme/theme-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import type { NtmsSaleorCategory } from "@/lib/saleor/catalog";
import { cn } from "@/lib/utils";
import { useSaleorCart } from "./ntms-cart-context";

type NtmsNavigationCategory = Pick<NtmsSaleorCategory, "name" | "slug">;

const ntmsNavigationFallback = [
  { label: "Inks", slug: "ntms-91-inks" },
  { label: "Needles", slug: "ntms-289-needles" },
  { label: "Machines", slug: "ntms-103-machines" },
  { label: "Tubes & Grips", slug: "ntms-107-tubes-and-grips" },
  {
    label: "Power Supplies & Cords",
    slug: "ntms-85-power-supplies-and-cords",
  },
  { label: "Medical", slug: "ntms-89-medical" },
  { label: "Shop Supply", slug: "ntms-113-shop-supply" },
  { label: "Papa", slug: "ntms-117-papa" },
  { label: "Sales", slug: "ntms-452-sales" },
] as const;

const ntmsFooterCategorySlugs = [
  "ntms-91-inks",
  "ntms-103-machines",
  "ntms-289-needles",
  "ntms-113-shop-supply",
] as const;

export function getNtmsSaleorNavigationCategories(
  categories: NtmsNavigationCategory[],
) {
  const categoriesBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );

  return ntmsNavigationFallback.map((fallback) => {
    const category = categoriesBySlug.get(fallback.slug);
    return category
      ? { label: category.name, slug: category.slug }
      : { ...fallback };
  });
}

function getNtmsSaleorFooterCategories(
  navigationCategories: ReturnType<typeof getNtmsSaleorNavigationCategories>,
) {
  const categoriesBySlug = new Map(
    navigationCategories.map((category) => [category.slug, category]),
  );

  return ntmsFooterCategorySlugs.flatMap((slug) => {
    const category = categoriesBySlug.get(slug);
    return category ? [category] : [];
  });
}

export function NtmsSaleorShell({
  categories,
  children,
}: {
  categories: NtmsNavigationCategory[];
  children: React.ReactNode;
}) {
  const matchRoute = useMatchRoute();
  const navigationCategories = getNtmsSaleorNavigationCategories(categories);
  const isCheckout =
    Boolean(matchRoute({ to: "/checkout" })) ||
    Boolean(matchRoute({ to: "/checkout/$step" })) ||
    Boolean(matchRoute({ to: "/checkout/confirmation/$code" }));

  if (isCheckout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NtmsSaleorHeader categories={navigationCategories} />
      {children}
      <NtmsSaleorFooter
        categories={getNtmsSaleorFooterCategories(navigationCategories)}
      />
    </div>
  );
}

function NtmsSaleorHeader({
  categories,
}: {
  categories: ReturnType<typeof getNtmsSaleorNavigationCategories>;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--cyber-gold)]/14 bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:grid-cols-[auto_minmax(360px,1fr)_auto] lg:gap-6">
          <NtmsLogo />
          <div className="order-3 col-span-2 lg:order-2 lg:col-span-1">
            <NtmsSearchForm />
          </div>
          <NtmsHeaderActions categories={categories} />
        </div>
      </div>

      <nav
        aria-label="Primary categories"
        className="hidden border-t border-[color:var(--cyber-gold)]/10 lg:block"
      >
        <div className="mx-auto flex max-w-screen-2xl gap-5 overflow-x-auto px-4">
          {categories.map((item) => (
            <Link
              key={item.slug}
              to="/collections/$collection"
              params={{ collection: item.slug }}
              preload="intent"
              className="shrink-0 border-b-2 border-transparent py-3 text-xs font-bold uppercase text-foreground/64 transition hover:border-[color:var(--cyber-gold)] hover:text-foreground sm:text-sm"
              activeProps={{
                "aria-current": "page",
                className:
                  "border-[color:var(--cyber-gold)] text-[color:var(--cyber-gold-soft)]",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

function NtmsLogo() {
  return (
    <Link to="/" className="order-1 flex min-w-0 items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[color:var(--cyber-gold)] text-sm font-black text-black">
        N
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-black uppercase leading-tight text-foreground">
          Nuclear Tattoo Supply
        </span>
        <span className="hidden text-[11px] font-semibold uppercase text-foreground/45 sm:block">
          Professional tattoo supply
        </span>
      </span>
    </Link>
  );
}

const ntmsHeaderIconButtonClass =
  "relative flex h-10 w-10 items-center justify-center rounded-md border border-[color:var(--cyber-gold)]/22 bg-background text-foreground transition hover:border-[color:var(--cyber-gold)]/60 hover:text-[color:var(--cyber-gold-soft)]";

function NtmsHeaderActions({
  categories,
}: {
  categories: ReturnType<typeof getNtmsSaleorNavigationCategories>;
}) {
  const { checkout, isLoading, openCart } = useSaleorCart();
  const quantity = checkout?.quantity ?? 0;

  return (
    <div className="order-2 flex shrink-0 items-center justify-end gap-2 lg:order-3">
      <NtmsMobileNavigation categories={categories} />
      <span className="hidden sm:contents">
        <ThemeToggle />
      </span>
      <Link
        to="/account"
        aria-label="My account"
        title="My account"
        className={ntmsHeaderIconButtonClass}
      >
        <UserRound className="h-4 w-4" />
      </Link>
      <button
        type="button"
        aria-label={
          quantity > 0 ? `Open cart, ${quantity} item(s)` : "Open cart"
        }
        title="Shopping cart"
        data-saleor-cart-button
        onClick={openCart}
        className={ntmsHeaderIconButtonClass}
      >
        <ShoppingCart className="h-4 w-4" />
        {quantity > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border border-black/20 bg-[color:var(--cyber-magenta)] px-1 text-[11px] font-semibold leading-none text-white shadow-[0_0_16px_rgba(255,79,216,.35)]">
            {quantity}
          </span>
        ) : null}
        {isLoading ? (
          <span
            className={cn(
              "absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[color:var(--cyber-gold)]",
              "animate-pulse",
            )}
          />
        ) : null}
      </button>
    </div>
  );
}

function NtmsMobileNavigation({
  categories,
}: {
  categories: ReturnType<typeof getNtmsSaleorNavigationCategories>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        type="button"
        aria-label="Browse categories"
        title="Browse categories"
        onClick={() => setOpen(true)}
        className={`${ntmsHeaderIconButtonClass} lg:hidden`}
      >
        <Menu className="h-4 w-4" />
      </button>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="flex h-full w-[min(22rem,92vw)] flex-col gap-0 border-r border-[color:var(--cyber-gold)]/20 bg-card p-4 shadow-[0_30px_90px_rgba(0,0,0,.45)]"
      >
        <SheetTitle className="sr-only">Browse categories</SheetTitle>
        <SheetDescription className="sr-only">
          Shop Nuclear Tattoo Supply product categories.
        </SheetDescription>
        <div className="flex items-center justify-between gap-4 border-b border-[color:var(--cyber-gold)]/14 pb-4">
          <NtmsLogo />
          <SheetClose asChild>
            <button
              type="button"
              aria-label="Close categories"
              title="Close categories"
              className={ntmsHeaderIconButtonClass}
            >
              <X className="h-4 w-4" />
            </button>
          </SheetClose>
        </div>
        <nav
          aria-label="Mobile categories"
          className="mt-5 flex flex-1 flex-col gap-1 overflow-y-auto"
        >
          {categories.map((item) => (
            <Link
              key={item.slug}
              to="/collections/$collection"
              params={{ collection: item.slug }}
              preload="intent"
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between border-b border-[color:var(--cyber-gold)]/12 py-3 text-sm font-semibold text-foreground/70 transition hover:text-[color:var(--cyber-gold-soft)]"
              activeProps={{
                "aria-current": "page",
                className:
                  "group flex items-center justify-between border-b border-[color:var(--cyber-gold)]/12 py-3 text-sm font-semibold text-[color:var(--cyber-gold-soft)] transition",
              }}
            >
              {item.label}
              <ArrowRight className="h-4 w-4 text-foreground/35 transition group-hover:translate-x-0.5 group-hover:text-[color:var(--cyber-gold-soft)]" />
            </Link>
          ))}
        </nav>
        <div className="mt-5 border-t border-[color:var(--cyber-gold)]/14 pt-4 sm:hidden">
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NtmsSearchForm() {
  return (
    <search aria-label="Site search" className="min-w-0">
      <form action="/search" className="min-w-0">
        <div className="relative flex min-w-0 items-center">
          <Search
            aria-hidden="true"
            className="-translate-y-1/2 pointer-events-none absolute left-3 top-1/2 h-4 w-4 text-foreground/38"
          />
          <input
            aria-label="Search products"
            className="h-11 w-full rounded-md border border-[color:var(--cyber-gold)]/18 bg-card pl-10 pr-3 text-sm font-semibold text-foreground outline-none placeholder:text-foreground/35 focus:border-[color:var(--cyber-gold)]/45 focus:ring-2 focus:ring-[color:var(--cyber-gold)]/24"
            name="q"
            placeholder="Search inks, needles, machines"
            type="search"
          />
        </div>
      </form>
    </search>
  );
}

function NtmsSaleorFooter({
  categories,
}: {
  categories: ReturnType<typeof getNtmsSaleorNavigationCategories>;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--cyber-gold)]/14 bg-card">
      <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)_minmax(0,.9fr)]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[color:var(--cyber-gold)] text-sm font-black text-black">
              N
            </span>
            <span>
              <span className="block text-sm font-bold uppercase leading-tight">
                Nuclear Tattoo Supply
              </span>
              <span className="text-xs font-semibold uppercase text-foreground/45">
                Professional tattoo supply
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-lg text-sm leading-6 text-foreground/58">
            Tattoo, PMU, piercing, and studio essentials organized for working
            shops.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
            Shop
          </p>
          <ul className="mt-4 grid gap-2 text-sm font-semibold">
            {categories.map((item) => (
              <li key={item.slug}>
                <Link
                  to="/collections/$collection"
                  params={{ collection: item.slug }}
                  preload="intent"
                  className="text-foreground/58 transition hover:text-[color:var(--cyber-gold-soft)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/search"
                className="text-foreground/58 transition hover:text-[color:var(--cyber-gold-soft)]"
              >
                Search catalog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
            Ordering
          </p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-foreground/58">
            <p>
              Product details, SKU references, and inventory status support
              ordering decisions.
            </p>
            <p>Built for tattoo, PMU, piercing, and studio supply buyers.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-[color:var(--cyber-gold)]/10 px-4 py-5">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-2 text-xs font-semibold uppercase text-foreground/42 sm:flex-row sm:items-center sm:justify-between">
          <p suppressHydrationWarning>© {year} Nuclear Tattoo Supply</p>
          <p>Professional supply storefront</p>
        </div>
      </div>
    </footer>
  );
}
