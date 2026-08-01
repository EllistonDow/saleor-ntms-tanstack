import { Link } from "@tanstack/react-router";
import type { ResultOf } from "gql.tada";
import { ArrowRight, CircleAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/custom/cart/cart-context";
import { GridTileImage } from "@/components/custom/grid/tile";
import { useAddCartItemMutation } from "@/hooks/use-cart-mutations";
import { cn, formatCurrency } from "@/lib/utils";
import type searchResultFragment from "@/lib/vendure/fragments/search-result";

type ProductCardVariant = "grid" | "featured" | "rail";

export function ProductCard({
  product,
  currencyCode,
  priority = false,
  variant = "grid",
  className,
}: {
  product: ResultOf<typeof searchResultFragment>;
  currencyCode: string;
  priority?: boolean;
  variant?: ProductCardVariant;
  className?: string;
}) {
  const effectiveCurrencyCode = product.currencyCode || currencyCode;
  const price = getPriceSummary(product, effectiveCurrencyCode);
  const isFeatured = variant === "featured";
  const isRail = variant === "rail";
  const description = isFeatured
    ? getPlainProductDescription(product.description)
    : "";
  const asset =
    product.productVariantAsset?.preview || product.productAsset?.preview || "";
  const variantName = getVariantName(
    product.productName,
    product.productVariantName,
  );
  const canQuickAdd =
    product.inStock &&
    Boolean(product.productVariantId) &&
    product.priceWithTax.__typename === "SinglePrice" &&
    !variantName;
  const { openCart } = useCart();
  const addCartItemMutation = useAddCartItemMutation();

  const handleQuickAdd = async () => {
    if (!canQuickAdd) return;

    try {
      await addCartItemMutation.mutateAsync(product.productVariantId);
      openCart();
      toast.success("Item added to cart");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error adding item to cart",
      );
    }
  };

  return (
    <article
      className={cn(
        "group relative flex h-full min-h-[244px] flex-col overflow-hidden rounded-lg border border-[color:var(--cyber-gold)]/10 bg-card/90 shadow-[0_12px_30px_rgba(0,0,0,.07)] transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--cyber-gold)]/28 hover:bg-card/96 hover:shadow-[0_20px_46px_rgba(0,0,0,.12)] focus-within:border-[color:var(--cyber-gold)]/34 sm:min-h-[286px]",
        isFeatured && "min-h-full",
        isRail && "min-h-[272px] sm:min-h-[306px]",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[color:var(--cyber-gold)]/40 to-transparent opacity-0 transition group-hover:opacity-100" />
      <Link
        aria-label={`${product.productName} - ${price.label}`}
        className={cn(
          "relative block overflow-hidden border-b border-[color:var(--cyber-gold)]/8 bg-background/48 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--cyber-gold)]",
          isFeatured ? "aspect-[1.12]" : "aspect-[1.08]",
        )}
        to="/product/$productId"
        params={{ productId: product.slug }}
      >
        {asset ? (
          <GridTileImage
            alt={product.productName}
            className="object-contain p-3.5 sm:p-5"
            frame={false}
            priority={priority}
            src={asset}
            sizes={
              isFeatured
                ? "(min-width: 1024px) 44vw, 100vw"
                : isRail
                  ? "(min-width: 1024px) 22vw, 72vw"
                  : "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            }
            layout="fullWidth"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-foreground/35">
            NTMS
          </div>
        )}
        {!product.inStock ? (
          <span className="absolute left-2.5 top-2.5 inline-flex h-7 items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-400/10 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-100 shadow-[0_8px_18px_rgba(0,0,0,.1)] backdrop-blur-xl">
            <CircleAlert className="h-3 w-3" />
            <span>Check stock</span>
          </span>
        ) : null}
        <span className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--cyber-gold)]/14 bg-card/82 text-[color:var(--cyber-gold-soft)] shadow-[0_8px_20px_rgba(0,0,0,.12)] backdrop-blur-xl transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
      <div
        className={cn(
          "flex flex-1 flex-col p-3 sm:p-4",
          isFeatured && "sm:p-5",
        )}
      >
        <div>
          <Link
            to="/product/$productId"
            params={{ productId: product.slug }}
            className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-gold)]"
          >
            <h3
              className={cn(
                "line-clamp-2 font-semibold text-foreground transition group-hover:text-[color:var(--cyber-gold-soft)]",
                isFeatured
                  ? "text-base leading-6 sm:text-lg"
                  : "min-h-10 text-sm leading-5",
              )}
            >
              {product.productName}
            </h3>
          </Link>
          {variantName ? (
            <p className="mt-1 line-clamp-1 text-xs font-medium text-[color:var(--cyber-gold-soft)]">
              {variantName}
            </p>
          ) : null}
          {description ? (
            <p
              className={cn(
                "mt-2 hidden text-foreground/50",
                isFeatured
                  ? "sm:line-clamp-3 sm:text-sm sm:leading-6"
                  : "lg:line-clamp-1 lg:text-xs lg:leading-5",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-[color:var(--cyber-gold)]/8 pt-2.5 sm:pt-3">
          <div className="min-w-0">
            {isFeatured ? (
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/38 sm:block">
                {price.caption}
              </p>
            ) : null}
            <p
              className={cn(
                "font-semibold leading-none text-[color:var(--cyber-gold-soft)] sm:mt-1",
                isFeatured ? "text-xl" : "text-[17px] sm:text-lg",
              )}
            >
              {price.label}
            </p>
          </div>
          {canQuickAdd ? (
            <button
              type="button"
              aria-label={`Add ${product.productName} to cart`}
              disabled={addCartItemMutation.isPending}
              onClick={handleQuickAdd}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-[color:var(--cyber-gold)]/22 bg-[color:var(--cyber-gold)] px-2.5 text-xs font-bold text-black shadow-[0_10px_24px_rgba(247,200,31,.16)] transition hover:-translate-y-px hover:bg-[color:var(--cyber-gold-soft)] disabled:cursor-not-allowed disabled:opacity-60 sm:px-3"
            >
              {addCartItemMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5" />
              )}
              <span>{addCartItemMutation.isPending ? "Adding" : "Add"}</span>
            </button>
          ) : (
            <Link
              to="/product/$productId"
              params={{ productId: product.slug }}
              aria-label={
                product.inStock
                  ? `Select options for ${product.productName}`
                  : `View details for ${product.productName}`
              }
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-[color:var(--cyber-gold)]/14 bg-background/60 px-2.5 text-xs font-semibold text-foreground/68 transition hover:border-[color:var(--cyber-gold)]/30 hover:bg-[color:var(--cyber-gold)]/7 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-gold)] sm:px-3"
            >
              <span>{product.inStock ? "View" : "Details"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function getPriceSummary(
  product: ResultOf<typeof searchResultFragment>,
  currencyCode: string,
) {
  const price = product.priceWithTax;

  if (price.__typename === "PriceRange") {
    const min = formatCurrency(price.min, currencyCode);

    return {
      caption: price.min === price.max ? "Live price" : "Price range",
      label: price.min === price.max ? min : `From ${min}`,
    };
  }

  if (price.__typename === "SinglePrice") {
    return {
      caption: "Live price",
      label: formatCurrency(price.value, currencyCode),
    };
  }

  return {
    caption: "Live price",
    label: formatCurrency(0, currencyCode),
  };
}

function getVariantName(
  productName: string,
  productVariantName?: string | null,
) {
  const variantName = productVariantName?.trim();

  if (!variantName || variantName === productName) {
    return "";
  }

  return variantName.replace(productName, "").trim() || variantName;
}

function getPlainProductDescription(description?: string | null) {
  return (
    description
      ?.replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim() ?? ""
  );
}
