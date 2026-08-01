import { Link } from "@tanstack/react-router";
import {
  ArrowDownAZ,
  ArrowRight,
  Boxes,
  Layers3,
  Search,
  SearchX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type SortFilterItem, sorting } from "@/lib/constants";
import type { NtmsSaleorCategoryPage } from "@/lib/saleor/catalog";
import { SaleorProductCard } from "./ntms-catalog-page";

export function NtmsSaleorCategoryPageView({
  page,
}: {
  page: NtmsSaleorCategoryPage;
}) {
  const {
    category,
    children,
    isCollectionOnly,
    products,
    sort,
    totalProducts,
  } = page;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-[color:var(--cyber-gold)]/14">
        <div className="mx-auto max-w-screen-2xl px-4 py-4">
          <nav className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase text-foreground/45">
            <Link
              to="/"
              className="shrink-0 transition hover:text-[color:var(--cyber-gold-soft)]"
            >
              Nuclear Tattoo Supply
            </Link>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 truncate text-foreground/70">
              {category.name}
            </span>
          </nav>
        </div>

        <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-9 lg:grid-cols-[minmax(0,1fr)_minmax(460px,0.8fr)] lg:items-end">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
              {isCollectionOnly ? "Curated collection" : "Category"}
            </p>
            <h1 className="mt-3 text-5xl font-black leading-[1.04] text-foreground">
              {category.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/60">
              Product references for professional studio ordering.
            </p>
          </div>
          <div className="grid divide-y divide-[color:var(--cyber-gold)]/14 border-y border-[color:var(--cyber-gold)]/14 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <CollectionMetric
              icon={<Boxes className="h-4 w-4" />}
              label="Products"
              value={totalProducts.toLocaleString()}
            />
            <CollectionMetric
              icon={<Layers3 className="h-4 w-4" />}
              label="Subcategories"
              value={children.length.toLocaleString()}
            />
            <CollectionMetric
              icon={<Search className="h-4 w-4" />}
              label="Sort views"
              value={sorting.length.toLocaleString()}
            />
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-9 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="border-b border-[color:var(--cyber-gold)]/14 pb-4 lg:border-b-0 lg:pb-0">
            <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
              Browse collection
            </p>
            <nav
              aria-label={`${category.name} subcategories`}
              className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:grid lg:gap-0 lg:overflow-visible"
            >
              <CollectionNavLink
                active
                collection={category.slug}
                label={`All ${category.name}`}
                sort={sort}
              />
              {children.map((child) => (
                <CollectionNavLink
                  collection={child.slug}
                  key={child.id}
                  label={`${child.name} (${child.productCount.toLocaleString()})`}
                  sort={sort}
                />
              ))}
            </nav>
          </div>

          {category.imageUrl ? (
            <div className="mt-7 hidden border-y border-[color:var(--cyber-gold)]/14 bg-white lg:block">
              <img
                alt={category.imageAlt}
                className="aspect-square h-auto w-full object-contain p-5"
                src={category.imageUrl}
              />
            </div>
          ) : null}
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-4 border-b border-[color:var(--cyber-gold)]/14 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
                Catalog entries
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-foreground">
                {totalProducts.toLocaleString()} {category.name} supplies
              </h2>
            </div>
            <p className="text-sm font-semibold text-foreground/50">
              Showing {products.length.toLocaleString()} items
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-4 border-y border-[color:var(--cyber-gold)]/14 py-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[color:var(--cyber-gold)]/18 text-[color:var(--cyber-gold-soft)]">
                <ArrowDownAZ className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
                  Sort catalog
                </p>
                <p className="mt-1 text-sm text-foreground/52">
                  Choose the order for this collection.
                </p>
              </div>
            </div>
            <nav aria-label="Sort products" className="flex flex-wrap gap-2">
              {sorting.map((item) => (
                <CategorySortLink
                  collection={category.slug}
                  currentSort={sort}
                  item={item}
                  key={item.slug}
                />
              ))}
            </nav>
          </div>

          {products.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 2xl:grid-cols-4">
              {products.map((product, index) => (
                <SaleorProductCard
                  enableLinks
                  key={product.id}
                  product={product}
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 border border-[color:var(--cyber-gold)]/14 bg-card p-8 text-center">
              <SearchX className="mx-auto h-8 w-8 text-[color:var(--cyber-gold-soft)]" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                No visible products yet
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-foreground/55">
                No published products are currently visible in this collection.
              </p>
              <Button asChild className="mt-5">
                <Link to="/">Back to catalog</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CollectionNavLink({
  active = false,
  collection,
  label,
  sort,
}: {
  active?: boolean;
  collection: string;
  label: string;
  sort: SortFilterItem["slug"];
}) {
  return (
    <Link
      to="/collections/$collection"
      params={{ collection }}
      search={{ sort }}
      className={[
        "shrink-0 border border-[color:var(--cyber-gold)]/14 px-3 py-2 text-sm font-semibold transition lg:border-x-0 lg:border-t-0 lg:px-0",
        active
          ? "border-[color:var(--cyber-gold)]/50 bg-[color:var(--cyber-gold)]/10 text-foreground lg:bg-transparent"
          : "text-foreground/58 hover:border-[color:var(--cyber-gold)]/42 hover:text-foreground",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

function CategorySortLink({
  collection,
  currentSort,
  item,
}: {
  collection: string;
  currentSort: SortFilterItem["slug"];
  item: SortFilterItem;
}) {
  const active = currentSort === item.slug;

  return (
    <Link
      to="/collections/$collection"
      params={{ collection }}
      search={{ sort: item.slug }}
      className={[
        "inline-flex h-9 items-center justify-center rounded-md border px-3 text-xs font-semibold transition",
        active
          ? "border-[color:var(--cyber-gold)]/45 bg-[color:var(--cyber-gold)] text-black"
          : "border-[color:var(--cyber-gold)]/14 text-foreground/58 hover:border-[color:var(--cyber-gold)]/42 hover:text-foreground",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {item.name}
    </Link>
  );
}

function CollectionMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 px-0 py-4 sm:px-4 sm:first:pl-0 sm:last:pr-0">
      <span className="shrink-0 text-[color:var(--cyber-gold-soft)]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase text-foreground/44">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}
