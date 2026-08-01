import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, Search as SearchIcon } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useId, useState } from "react";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";
import { formatCurrency, getSearchResultPrice } from "@/lib/utils";

export default function Search() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const [isHydrated, setIsHydrated] = useState(false);
  const [query, setQuery] = useState(search?.q || "");
  const [isFocused, setIsFocused] = useState(false);
  const suggestionsId = useId();
  const suggestionsQuery = useSearchSuggestions(isHydrated ? query : "");
  const suggestions = suggestionsQuery.data ?? [];
  const showSuggestions =
    isFocused &&
    query.trim().length >= 2 &&
    (suggestionsQuery.isFetching || suggestions.length > 0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isHydrated) return;

    const normalizedQuery = query.trim();

    navigate({
      to: "/search",
      search: { q: normalizedQuery || undefined },
    });
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <search className="relative w-full md:max-w-[560px]">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="q"
          role="combobox"
          aria-label="Search products"
          aria-autocomplete="list"
          aria-controls={showSuggestions ? suggestionsId : undefined}
          aria-expanded={showSuggestions}
          placeholder="Search for products..."
          autoComplete="off"
          disabled={!isHydrated}
          value={query}
          onBlur={() => {
            window.setTimeout(() => setIsFocused(false), 150);
          }}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full rounded-xl border border-[color:var(--cyber-gold)]/18 bg-background/68 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-foreground/45 transition focus:border-[color:var(--cyber-gold)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-gold)]/50 dark:bg-black/35 dark:text-white dark:placeholder:text-neutral-400"
        />
        <button
          type="submit"
          aria-label="Search"
          disabled={!isHydrated}
          className="absolute right-0 top-0 mr-3 flex h-full cursor-pointer items-center justify-center border-none bg-transparent text-foreground/55 transition hover:text-[color:var(--cyber-gold-soft)] dark:text-neutral-300"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
        {showSuggestions ? (
          <div
            id={suggestionsId}
            className="absolute left-0 top-full z-40 mt-2 max-h-[min(64vh,32rem)] w-full overflow-hidden rounded-2xl border border-[color:var(--cyber-gold)]/16 bg-card/96 text-foreground shadow-[0_22px_70px_rgba(0,0,0,.28)] backdrop-blur-2xl dark:text-white"
          >
            <div className="border-b border-[color:var(--cyber-gold)]/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--cyber-gold-soft)]">
                Search suggestions
              </p>
              <p className="mt-1 truncate text-sm text-foreground/55">
                Matching "{query.trim()}"
              </p>
            </div>
            {suggestionsQuery.isFetching && suggestions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-foreground/60">
                Searching...
              </div>
            ) : (
              <ul
                aria-label="Search suggestions"
                className="max-h-[min(48vh,23rem)] overflow-auto"
              >
                {suggestions.map((product) => (
                  <li key={product.slug}>
                    <Link
                      to="/product/$productId"
                      params={{ productId: product.slug }}
                      className="group flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-[color:var(--cyber-gold)]/10 focus:bg-[color:var(--cyber-gold)]/10 focus:outline-none"
                    >
                      {product.productAsset?.preview ? (
                        <img
                          src={product.productAsset.preview}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-lg border border-[color:var(--cyber-gold)]/10 bg-background/55 object-contain p-1"
                          loading="lazy"
                        />
                      ) : (
                        <span className="h-12 w-12 shrink-0 rounded-lg border border-[color:var(--cyber-gold)]/10 bg-[color:var(--cyber-gold)]/10 dark:bg-neutral-800" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
                          {product.productName}
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-xs text-foreground/55 dark:text-neutral-400">
                          <span className="truncate">SKU {product.sku}</span>
                          <span className="h-1 w-1 rounded-full bg-[color:var(--cyber-gold)]/45" />
                          {formatCurrency(
                            Number(getSearchResultPrice(product)),
                            product.currencyCode,
                          )}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-foreground/35 transition group-hover:translate-x-0.5 group-hover:text-[color:var(--cyber-gold-soft)]" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/search"
              search={{ q: query.trim(), sort: "name-a-z" }}
              className="flex items-center justify-between gap-3 border-t border-[color:var(--cyber-gold)]/10 px-4 py-3 text-sm font-semibold text-[color:var(--cyber-gold-soft)] transition hover:bg-[color:var(--cyber-gold)]/8"
            >
              View all results
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </form>
    </search>
  );
}
