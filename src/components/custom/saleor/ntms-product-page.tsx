import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  ChevronRight,
  Layers3,
  Minus,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GridTileImage } from "@/components/custom/grid/tile";
import type {
  NtmsSaleorProductPage,
  NtmsSaleorProductVariant,
} from "@/lib/saleor/catalog";
import { NtmsSaleorAddToCartButton } from "./ntms-add-to-cart-button";
import { SaleorProductCard } from "./ntms-catalog-page";
import {
  getPreferredSaleorVariant,
  getSaleorVariantAttributeGroups,
  NtmsSaleorVariantSelector,
} from "./ntms-variant-selector";

export const saleorVariantSearchThreshold = 8;

export function shouldSearchSaleorProductVariants(variantCount: number) {
  return variantCount > saleorVariantSearchThreshold;
}

export function filterSaleorProductVariants<
  T extends Pick<NtmsSaleorProductVariant, "name" | "sku">,
>(variants: T[], query: string): T[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return variants;
  }

  return variants.filter((variant) =>
    `${variant.name} ${variant.sku}`.toLowerCase().includes(normalizedQuery),
  );
}

export function getSaleorVariantBySku(
  variants: NtmsSaleorProductVariant[],
  sku: string | undefined,
) {
  const normalizedSku = sku?.trim().toLowerCase();
  if (!normalizedSku) return undefined;
  return variants.find(
    (variant) => variant.sku.trim().toLowerCase() === normalizedSku,
  );
}

export function NtmsSaleorProductPageView({
  initialVariantSku,
  onVariantSkuChange,
  page,
}: {
  initialVariantSku?: string;
  onVariantSkuChange?: (sku: string) => void;
  page: NtmsSaleorProductPage;
}) {
  const { product, relatedProducts } = page;
  const primaryImage = product.media[0]?.url || product.imageUrl;
  const gallery = product.media.length
    ? product.media
    : primaryImage
      ? [{ url: primaryImage, alt: product.imageAlt }]
      : [];
  const defaultMediaUrl = gallery[0]?.url ?? primaryImage;
  const initialVariant =
    getSaleorVariantBySku(product.variants, initialVariantSku) ??
    getPreferredSaleorVariant(product.variants);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(
    initialVariant?.media?.[0]?.url ?? defaultMediaUrl,
  );
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => initialVariant?.id ?? product.variantId,
  );
  const [quantity, setQuantity] = useState(1);
  const [variantSearchQuery, setVariantSearchQuery] = useState("");
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ??
    product.variants[0];
  const selectedVariantMedia = selectedVariant?.media ?? [];
  const activeGallery = selectedVariantMedia.length
    ? selectedVariantMedia
    : gallery;
  const selectedMedia =
    activeGallery.find((media) => media.url === selectedMediaUrl) ??
    activeGallery[0];
  const selectedImage = selectedMedia?.url || primaryImage;
  const selectedPrice = selectedVariant?.price ?? product.price;
  const selectedSku = selectedVariant?.sku || product.sku || "Pending";
  const selectedQuantity =
    selectedVariant?.quantityAvailable ?? product.quantityAvailable;
  const availableQuantity = getAvailableQuantity(selectedQuantity);
  const maxQuantity = Math.max(1, availableQuantity);
  const canAdd =
    Boolean(selectedVariant?.id || product.variantId) && availableQuantity > 0;
  const variantAttributeGroups = useMemo(
    () => getSaleorVariantAttributeGroups(product.variants),
    [product.variants],
  );
  const hasAttributeSelector = variantAttributeGroups.length > 0;
  const hasVariantSearch =
    shouldSearchSaleorProductVariants(product.variants.length) &&
    !hasAttributeSelector;
  const visibleVariants = useMemo(
    () => filterSaleorProductVariants(product.variants, variantSearchQuery),
    [product.variants, variantSearchQuery],
  );
  const selectedConfiguration = variantAttributeGroups.flatMap((group) => {
    const selectedValue = selectedVariant?.attributes
      .find((attribute) => attribute.id === group.id)
      ?.values.at(0)?.name;
    return selectedValue ? [`${group.name}: ${selectedValue}`] : [];
  });

  useEffect(() => {
    const requestedVariant = getSaleorVariantBySku(
      product.variants,
      initialVariantSku,
    );
    if (!requestedVariant || requestedVariant.id === selectedVariantId) {
      return;
    }

    setSelectedVariantId(requestedVariant.id);
    setSelectedMediaUrl(requestedVariant.media?.[0]?.url ?? defaultMediaUrl);
    setQuantity((currentQuantity) =>
      Math.min(
        currentQuantity,
        Math.max(1, getAvailableQuantity(requestedVariant.quantityAvailable)),
      ),
    );
  }, [defaultMediaUrl, initialVariantSku, product.variants, selectedVariantId]);

  const selectVariant = (variantId: string) => {
    const nextVariant = product.variants.find(
      (variant) => variant.id === variantId,
    );
    const nextMaximum = Math.max(
      1,
      getAvailableQuantity(nextVariant?.quantityAvailable),
    );

    setSelectedVariantId(variantId);
    setSelectedMediaUrl(nextVariant?.media?.[0]?.url ?? defaultMediaUrl);
    setQuantity((currentQuantity) => Math.min(currentQuantity, nextMaximum));
    if (nextVariant?.sku) {
      onVariantSkuChange?.(nextVariant.sku);
    }
  };

  const updateQuantity = (nextQuantity: number) => {
    if (!Number.isFinite(nextQuantity)) return;

    setQuantity(Math.min(Math.max(1, Math.floor(nextQuantity)), maxQuantity));
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-screen-2xl px-4 py-5">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-2 overflow-hidden border-b border-[color:var(--cyber-gold)]/14 pb-4 text-xs font-semibold uppercase text-foreground/45"
        >
          <Link
            to="/"
            className="shrink-0 transition hover:text-[color:var(--cyber-gold-soft)]"
          >
            Nuclear Tattoo Supply
          </Link>
          {product.category ? (
            <>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <Link
                to="/collections/$collection"
                params={{ collection: product.category.slug }}
                className="hidden shrink-0 transition hover:text-[color:var(--cyber-gold-soft)] sm:inline"
              >
                {product.category.name}
              </Link>
            </>
          ) : null}
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 truncate text-foreground/70">
            {product.name}
          </span>
        </nav>

        <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1.14fr)_minmax(360px,0.7fr)] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <div className="overflow-hidden border border-[color:var(--cyber-gold)]/18 bg-white">
              <div className="aspect-square bg-white">
                {selectedImage ? (
                  <GridTileImage
                    alt={selectedMedia?.alt || product.imageAlt}
                    className="object-contain p-7 sm:p-10"
                    frame={false}
                    priority
                    src={selectedImage}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    layout="fullWidth"
                  />
                ) : (
                  <ImageFallback label={product.name} />
                )}
              </div>
            </div>

            {activeGallery.length > 1 ? (
              <div className="mt-3 grid grid-cols-5 border-l border-t border-[color:var(--cyber-gold)]/14 sm:grid-cols-6">
                {activeGallery.slice(0, 6).map((media) => {
                  const active = media.url === selectedImage;

                  return (
                    <button
                      aria-label={`Show ${media.alt || product.name}`}
                      aria-pressed={active}
                      className={[
                        "aspect-square border-b border-r border-[color:var(--cyber-gold)]/14 bg-white p-2 transition focus-visible:ring-inset",
                        active
                          ? "ring-2 ring-inset ring-[color:var(--cyber-gold)]"
                          : "hover:bg-[color:var(--cyber-gold)]/8",
                      ].join(" ")}
                      key={media.url}
                      onClick={() => setSelectedMediaUrl(media.url)}
                      type="button"
                    >
                      <img
                        alt=""
                        className="h-full w-full object-contain"
                        src={media.url}
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <aside className="min-w-0 border border-[color:var(--cyber-gold)]/18 bg-card p-5 lg:sticky lg:top-24 sm:p-6">
            <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
              {product.category?.name ?? "Tattoo supply"}
            </p>
            <h1 className="mt-4 break-words text-3xl font-black leading-[1.04] text-foreground sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-6 flex items-end justify-between gap-4 border-y border-[color:var(--cyber-gold)]/14 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase text-foreground/42">
                  Price
                </p>
                <p className="mt-1 text-3xl font-semibold text-[color:var(--cyber-gold-soft)]">
                  {selectedPrice ? formatSaleorMoney(selectedPrice) : "Pending"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-foreground/42">
                  Stock
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground/74">
                  {selectedQuantity && selectedQuantity > 0
                    ? `${selectedQuantity} available`
                    : "Check stock"}
                </p>
              </div>
            </div>

            <div className="grid divide-y divide-[color:var(--cyber-gold)]/14 border-b border-[color:var(--cyber-gold)]/14 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <ProductSignal
                icon={<Boxes className="h-4 w-4" />}
                label="SKU"
                value={<span data-saleor-selected-sku>{selectedSku}</span>}
              />
              <ProductSignal
                icon={<Layers3 className="h-4 w-4" />}
                label="Variants"
                value={
                  <span data-saleor-variant-count>
                    {product.variants.length.toLocaleString()}
                  </span>
                }
              />
            </div>

            {product.variants.length > 1 ? (
              <fieldset className="mt-6">
                <legend className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
                  Choose variant
                </legend>
                {hasAttributeSelector && selectedVariant ? (
                  <div className="mt-4">
                    <NtmsSaleorVariantSelector
                      groups={variantAttributeGroups}
                      onSelectVariant={selectVariant}
                      selectedVariant={selectedVariant}
                      variants={product.variants}
                    />
                    {selectedConfiguration.length > 0 ? (
                      <p
                        aria-live="polite"
                        className="mt-4 border-l-2 border-[color:var(--cyber-gold)]/55 pl-3 text-sm leading-6 text-foreground/68"
                        data-saleor-selected-configuration
                      >
                        {selectedConfiguration.join(" / ")}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {!hasAttributeSelector && hasVariantSearch ? (
                  <div className="relative mt-3">
                    <Search
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground/42"
                    />
                    <input
                      aria-label="Search product variants"
                      autoComplete="off"
                      className="h-10 w-full border border-[color:var(--cyber-gold)]/20 bg-background py-2 pr-3 pl-9 text-sm text-foreground outline-none transition placeholder:text-foreground/42 focus-visible:border-[color:var(--cyber-gold)]/60 focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-gold)]/25"
                      data-saleor-variant-search
                      onChange={(event) =>
                        setVariantSearchQuery(event.currentTarget.value)
                      }
                      placeholder="Search SKU or variant"
                      spellCheck={false}
                      type="search"
                      value={variantSearchQuery}
                    />
                  </div>
                ) : null}
                {!hasAttributeSelector ? (
                  <div
                    className={[
                      "mt-3 border-l border-t border-[color:var(--cyber-gold)]/14",
                      hasVariantSearch ? "max-h-96 overflow-y-auto" : "",
                    ].join(" ")}
                    data-saleor-variant-options
                  >
                    {visibleVariants.map((variant) => {
                      const active = variant.id === selectedVariant?.id;
                      const variantPrice = variant.price ?? product.price;

                      return (
                        <label
                          className={[
                            "grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-r border-[color:var(--cyber-gold)]/14 p-3 text-left transition",
                            active
                              ? "bg-[color:var(--cyber-gold)]/12"
                              : "hover:bg-background",
                          ].join(" ")}
                          key={variant.id}
                        >
                          <input
                            checked={active}
                            className="sr-only"
                            data-saleor-variant-option-id={variant.id}
                            name="saleor-product-variant"
                            onChange={() => selectVariant(variant.id)}
                            type="radio"
                            value={variant.id}
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-foreground">
                              {variant.name}
                            </span>
                            <span className="mt-1 block truncate text-xs text-foreground/48">
                              SKU {variant.sku || "pending"}
                            </span>
                          </span>
                          <span className="text-right">
                            <span className="block text-sm font-semibold text-[color:var(--cyber-gold-soft)]">
                              {variantPrice
                                ? formatSaleorMoney(variantPrice)
                                : "Pending"}
                            </span>
                            <span className="mt-1 block text-xs text-foreground/48">
                              {variant.quantityAvailable &&
                              variant.quantityAvailable > 0
                                ? `${variant.quantityAvailable} stock`
                                : "Check stock"}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                    {visibleVariants.length === 0 ? (
                      <p className="border-b border-r border-[color:var(--cyber-gold)]/14 px-3 py-5 text-sm text-foreground/52">
                        No matching variants
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </fieldset>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-4 border-y border-[color:var(--cyber-gold)]/14 py-4">
              <div>
                <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
                  Quantity
                </p>
                <p className="mt-1 text-xs text-foreground/48">
                  {availableQuantity > 0
                    ? `Maximum ${availableQuantity}`
                    : "Check stock"}
                </p>
              </div>
              <div className="flex h-10 shrink-0 items-center border border-[color:var(--cyber-gold)]/20 bg-background">
                <button
                  aria-label="Decrease quantity"
                  className="grid h-full w-10 place-items-center border-r border-[color:var(--cyber-gold)]/20 text-foreground/65 transition hover:bg-[color:var(--cyber-gold)]/10 hover:text-[color:var(--cyber-gold-soft)] disabled:cursor-not-allowed disabled:opacity-35"
                  data-saleor-decrease-quantity
                  disabled={!canAdd || quantity <= 1}
                  onClick={() => updateQuantity(quantity - 1)}
                  type="button"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  aria-label="Quantity"
                  className="h-full w-12 border-0 bg-transparent px-1 text-center text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--cyber-gold)] disabled:text-foreground/40"
                  data-saleor-product-quantity
                  disabled={!canAdd}
                  inputMode="numeric"
                  max={maxQuantity}
                  min={1}
                  onChange={(event) =>
                    updateQuantity(event.currentTarget.valueAsNumber)
                  }
                  step={1}
                  type="number"
                  value={quantity}
                />
                <button
                  aria-label="Increase quantity"
                  className="grid h-full w-10 place-items-center border-l border-[color:var(--cyber-gold)]/20 text-foreground/65 transition hover:bg-[color:var(--cyber-gold)]/10 hover:text-[color:var(--cyber-gold-soft)] disabled:cursor-not-allowed disabled:opacity-35"
                  data-saleor-increase-quantity
                  disabled={!canAdd || quantity >= maxQuantity}
                  onClick={() => updateQuantity(quantity + 1)}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <NtmsSaleorAddToCartButton
              className="mt-6"
              disabled={!canAdd}
              label="Add to cart"
              quantity={quantity}
              size="full"
              variantId={selectedVariant?.id || product.variantId}
            />
          </aside>
        </section>

        {product.description ? (
          <section className="border-t border-[color:var(--cyber-gold)]/14 py-8">
            <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
              Product details
            </p>
            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-7 text-foreground/64">
              {product.description.split(/\n{2,}/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ) : null}

        {relatedProducts.length > 0 ? (
          <section className="border-t border-[color:var(--cyber-gold)]/14 py-11">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
                  Continue sourcing
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-foreground">
                  Related studio supplies
                </h2>
              </div>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/58 transition hover:text-[color:var(--cyber-gold-soft)]"
              >
                Search catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {relatedProducts.slice(0, 8).map((item, index) => (
                <SaleorProductCard
                  enableLinks
                  key={item.id}
                  product={item}
                  priority={index < 4}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function ProductSignal({
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

function ImageFallback({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm font-semibold uppercase text-foreground/35">
      {label}
    </div>
  );
}

function formatSaleorMoney(price: { amount: number; currency: string }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(price.amount);
}

function getAvailableQuantity(quantity: number | null | undefined) {
  if (typeof quantity !== "number" || !Number.isFinite(quantity)) return 0;

  return Math.max(0, Math.floor(quantity));
}
