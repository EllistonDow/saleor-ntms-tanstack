import { Link } from "@tanstack/react-router";
import {
  ArrowDownAZ,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  SearchX,
} from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type SortFilterItem, sorting } from "@/lib/constants";
import type { NtmsSaleorSearchPage } from "@/lib/saleor/catalog";
import { SaleorProductCard } from "./ntms-catalog-page";

export function NtmsSaleorSearchPageView({
  page,
}: {
  page: NtmsSaleorSearchPage;
}) {
  const searchInputId = useId();
  const hasQuery = page.query.length > 0;
  const totalResultsLabel = page.totalProducts === 1 ? "result" : "results";
  const firstResult =
    page.totalProducts > 0 ? (page.page - 1) * page.pageSize + 1 : 0;
  const lastResult =
    page.totalProducts > 0 ? firstResult + page.products.length - 1 : 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-[color:var(--cyber-gold)]/14">
        <div className="mx-auto max-w-screen-2xl px-4 py-4">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase text-foreground/45"
          >
            <Link
              to="/"
              className="shrink-0 transition hover:text-[color:var(--cyber-gold-soft)]"
            >
              Nuclear Tattoo Supply
            </Link>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 truncate text-foreground/70">Search</span>
          </nav>
        </div>

        <div className="mx-auto grid max-w-screen-2xl gap-7 px-4 py-9 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.7fr)] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
              Supply search
            </p>
            <h1 className="mt-3 break-words text-4xl font-black leading-[1.04] text-foreground sm:text-5xl">
              {hasQuery ? `Results for "${page.query}"` : "Search catalog"}
            </h1>
          </div>

          <form
            action="/search"
            className="min-w-0 border-y border-[color:var(--cyber-gold)]/14 py-4"
          >
            <input name="sort" type="hidden" value={page.sort} />
            <label className="sr-only" htmlFor={searchInputId}>
              Search catalog
            </label>
            <div className="flex min-w-0 gap-2">
              <div className="relative min-w-0 flex-1">
                <Search
                  aria-hidden="true"
                  className="-translate-y-1/2 pointer-events-none absolute left-3 top-1/2 h-4 w-4 text-foreground/38"
                />
                <Input
                  className="h-11 border-[color:var(--cyber-gold)]/18 bg-card pl-9"
                  defaultValue={page.query}
                  id={searchInputId}
                  name="q"
                  placeholder="Product, SKU, brand..."
                />
              </div>
              <Button className="h-11 shrink-0" type="submit">
                Search
              </Button>
            </div>
          </form>
        </div>
      </header>

      <section className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-9 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="border-y border-[color:var(--cyber-gold)]/14 py-4">
            <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
              Search reference
            </p>
            <dl className="mt-4 grid gap-4 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase text-foreground/42">
                  Query
                </dt>
                <dd className="mt-1 break-words font-semibold text-foreground">
                  {hasQuery ? page.query : "All published supplies"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-foreground/42">
                  Results
                </dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {page.totalProducts.toLocaleString()} {totalResultsLabel}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-foreground/42">
                  Current page
                </dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {page.page.toLocaleString()} of{" "}
                  {page.totalPages.toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-4 border-b border-[color:var(--cyber-gold)]/14 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
                Search results
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-foreground">
                {hasQuery ? "Matching supplies" : "Catalog preview"}
              </h2>
            </div>
            <p className="text-sm font-semibold text-foreground/50">
              {page.totalProducts > 0
                ? `${firstResult.toLocaleString()}-${lastResult.toLocaleString()} shown`
                : "No results"}
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-4 border-y border-[color:var(--cyber-gold)]/14 py-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[color:var(--cyber-gold)]/18 text-[color:var(--cyber-gold-soft)]">
                <ArrowDownAZ className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
                  Sort results
                </p>
                <p className="mt-1 text-sm text-foreground/52">
                  Page {page.page.toLocaleString()} of{" "}
                  {page.totalPages.toLocaleString()}
                </p>
              </div>
            </div>
            <nav aria-label="Sort results" className="flex flex-wrap gap-2">
              {sorting.map((item) => (
                <SortLink
                  currentSort={page.sort}
                  item={item}
                  key={item.slug}
                  query={page.query}
                />
              ))}
            </nav>
          </div>

          {page.products.length > 0 ? (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 2xl:grid-cols-4">
                {page.products.map((product, index) => (
                  <SaleorProductCard
                    enableLinks
                    key={product.id}
                    product={product}
                    priority={index < 2}
                  />
                ))}
              </div>
              <SearchPagination page={page} />
            </>
          ) : (
            <div className="mt-6 border border-[color:var(--cyber-gold)]/14 bg-card p-8 text-center">
              <SearchX className="mx-auto h-8 w-8 text-[color:var(--cyber-gold-soft)]" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                {hasQuery ? "No products matched" : "No products available"}
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-foreground/55">
                {hasQuery
                  ? "Try a broader product name, SKU, or brand."
                  : "The catalog did not return any published products."}
              </p>
              {hasQuery ? (
                <Button asChild className="mt-5">
                  <Link
                    to="/search"
                    search={{ page: undefined, q: undefined, sort: page.sort }}
                  >
                    Clear search
                  </Link>
                </Button>
              ) : (
                <Button asChild className="mt-5">
                  <Link to="/">Back to catalog</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function SortLink({
  currentSort,
  item,
  query,
}: {
  currentSort: SortFilterItem["slug"];
  item: SortFilterItem;
  query: string;
}) {
  const active = currentSort === item.slug;

  return (
    <Link
      to="/search"
      search={{
        page: undefined,
        q: query || undefined,
        sort: item.slug,
      }}
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

function SearchPagination({ page }: { page: NtmsSaleorSearchPage }) {
  if (page.totalPages <= 1) {
    return null;
  }

  const previousPage = page.page <= 2 ? undefined : (page.page - 1).toString();
  const nextPage = (page.page + 1).toString();
  const search = {
    q: page.query || undefined,
    sort: page.sort,
  };

  return (
    <nav
      aria-label="Search pagination"
      className="mt-8 flex flex-col gap-3 border-y border-[color:var(--cyber-gold)]/14 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm font-semibold text-foreground/58">
        Page {page.page.toLocaleString()} of {page.totalPages.toLocaleString()}
      </p>
      <div className="flex gap-2">
        {page.hasPreviousPage ? (
          <Button asChild variant="outline">
            <Link
              to="/search"
              rel="prev"
              search={{
                ...search,
                after: undefined,
                page: previousPage,
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
          </Button>
        ) : (
          <Button disabled variant="outline">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        )}
        {page.hasNextPage ? (
          <Button asChild>
            <Link
              to="/search"
              rel="next"
              search={{
                ...search,
                after: page.nextPageCursor || undefined,
                page: nextPage,
              }}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button disabled>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </nav>
  );
}
