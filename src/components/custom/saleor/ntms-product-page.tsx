import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Boxes,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  Layers3,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GridTileImage } from "@/components/custom/grid/tile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showMobileBuyBar, setShowMobileBuyBar] = useState(false);
  const [variantSearchQuery, setVariantSearchQuery] = useState("");
  const primaryPurchaseRef = useRef<HTMLDivElement>(null);
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
  const selectedMediaIndex = Math.max(
    0,
    activeGallery.findIndex((media) => media.url === selectedImage),
  );
  const selectedPrice = selectedVariant?.price ?? product.price;
  const selectedPriorPrice = selectedVariant?.priorPrice ?? product.priorPrice;
  const selectedDiscountPercent = saleorDiscountPercent(
    selectedPrice,
    selectedPriorPrice,
  );
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

  useEffect(() => {
    const updateMobileBuyBar = () => {
      const purchaseSection = primaryPurchaseRef.current;
      setShowMobileBuyBar(
        Boolean(
          purchaseSection && purchaseSection.getBoundingClientRect().bottom < 0,
        ),
      );
    };

    updateMobileBuyBar();
    window.addEventListener("scroll", updateMobileBuyBar, { passive: true });
    window.addEventListener("resize", updateMobileBuyBar);

    return () => {
      window.removeEventListener("scroll", updateMobileBuyBar);
      window.removeEventListener("resize", updateMobileBuyBar);
    };
  }, []);

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

  const showAdjacentMedia = (direction: -1 | 1) => {
    if (activeGallery.length < 2) return;
    const nextIndex =
      (selectedMediaIndex + direction + activeGallery.length) %
      activeGallery.length;
    setSelectedMediaUrl(activeGallery[nextIndex]?.url ?? selectedMediaUrl);
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

        <section className="grid gap-8 py-7 lg:grid-cols-[minmax(0,1fr)_minmax(400px,0.72fr)] lg:items-start lg:gap-10 xl:gap-14">
          <div className="min-w-0 lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-md border border-white/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,.22)]">
              <button
                aria-label="Open image viewer"
                className="group relative block aspect-square w-full cursor-zoom-in bg-white text-left"
                disabled={!selectedImage}
                onClick={() => setIsGalleryOpen(true)}
                type="button"
              >
                {selectedImage ? (
                  <GridTileImage
                    alt={selectedMedia?.alt || product.imageAlt}
                    className="object-contain p-6 sm:p-10 xl:p-12"
                    frame={false}
                    isInteractive={false}
                    priority
                    src={selectedImage}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    layout="fullWidth"
                  />
                ) : (
                  <ImageFallback label={product.name} />
                )}
                {selectedImage ? (
                  <span className="absolute right-3 bottom-3 inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white/92 text-black/65 shadow-md transition group-hover:text-black">
                    <Expand className="h-4 w-4" />
                  </span>
                ) : null}
              </button>

              {activeGallery.length > 1 ? (
                <>
                  <GalleryNavigationButton
                    direction="previous"
                    onClick={() => showAdjacentMedia(-1)}
                  />
                  <GalleryNavigationButton
                    direction="next"
                    onClick={() => showAdjacentMedia(1)}
                  />
                </>
              ) : null}
            </div>

            {activeGallery.length > 1 ? (
              <fieldset className="mt-3 flex w-full min-w-0 max-w-full gap-2 overflow-x-auto pb-1">
                <legend className="sr-only">Product images</legend>
                {activeGallery.map((media, index) => {
                  const active = media.url === selectedImage;

                  return (
                    <button
                      aria-label={`Show image ${index + 1} of ${activeGallery.length}`}
                      aria-pressed={active}
                      className={[
                        "h-[72px] w-[72px] shrink-0 rounded-md border bg-white p-1.5 transition focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-gold)]/50",
                        active
                          ? "border-[color:var(--cyber-gold)] shadow-[0_0_0_1px_var(--cyber-gold)]"
                          : "border-white/12 opacity-72 hover:opacity-100",
                      ].join(" ")}
                      key={media.url}
                      onClick={() => setSelectedMediaUrl(media.url)}
                      type="button"
                    >
                      <img
                        alt=""
                        className="h-full w-full object-contain"
                        decoding="async"
                        height={64}
                        loading="lazy"
                        src={media.url}
                        width={64}
                      />
                    </button>
                  );
                })}
              </fieldset>
            ) : null}
          </div>

          <aside className="min-w-0 lg:border-l lg:border-[color:var(--cyber-gold)]/14 lg:pl-10 xl:pl-14">
            {product.category ? (
              <Link
                className="inline-flex items-center gap-2 text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)] transition hover:text-foreground"
                params={{ collection: product.category.slug }}
                to="/collections/$collection"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {product.category.name}
              </Link>
            ) : (
              <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
                Tattoo supply
              </p>
            )}
            <h1 className="mt-4 break-words text-3xl font-black leading-[1.08] text-foreground sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-[color:var(--cyber-gold)]/14 pb-6">
              <div>
                <p className="text-3xl font-semibold text-[color:var(--cyber-gold-soft)]">
                  {selectedPrice ? formatSaleorMoney(selectedPrice) : "Pending"}
                </p>
                {selectedDiscountPercent && selectedPriorPrice ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <p className="text-sm text-foreground/42 line-through">
                      {formatSaleorMoney(selectedPriorPrice)}
                    </p>
                    <p className="inline-flex items-center gap-1 text-xs font-bold uppercase text-emerald-300">
                      <BadgePercent className="h-3.5 w-3.5" />
                      Save {selectedDiscountPercent}%
                    </p>
                  </div>
                ) : null}
              </div>
              <p
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                  canAdd
                    ? "border-emerald-400/20 bg-emerald-400/8 text-emerald-300"
                    : "border-amber-300/20 bg-amber-300/8 text-amber-200",
                ].join(" ")}
              >
                {canAdd ? <Check className="h-3.5 w-3.5" /> : null}
                {canAdd
                  ? `${availableQuantity} in stock`
                  : "Check availability"}
              </p>
            </div>

            <div className="grid grid-cols-2 divide-x divide-[color:var(--cyber-gold)]/14 border-b border-[color:var(--cyber-gold)]/14">
              <ProductSignal
                icon={<Boxes className="h-4 w-4" />}
                label="SKU"
                value={<span data-saleor-selected-sku>{selectedSku}</span>}
              />
              <ProductSignal
                icon={<Layers3 className="h-4 w-4" />}
                label="Options"
                value={
                  <span data-saleor-variant-count>
                    {product.variants.length.toLocaleString()}
                  </span>
                }
              />
            </div>

            {product.variants.length > 1 ? (
              <fieldset className="mt-7 rounded-md border border-[color:var(--cyber-gold)]/14 bg-card/46 p-4 sm:p-5">
                <legend className="px-2 text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
                  Configure product
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
                        className="mt-4 flex items-start gap-2 border-t border-[color:var(--cyber-gold)]/12 pt-4 text-sm leading-6 text-foreground/68"
                        data-saleor-selected-configuration
                      >
                        <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[color:var(--cyber-gold-soft)]" />
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
                      "mt-3 overflow-hidden rounded-md border border-[color:var(--cyber-gold)]/14",
                      hasVariantSearch ? "max-h-96 overflow-y-auto" : "",
                    ].join(" ")}
                    data-saleor-variant-options
                  >
                    {visibleVariants.map((variant) => {
                      const active = variant.id === selectedVariant?.id;
                      const variantPrice = variant.price ?? product.price;
                      const variantPriorPrice =
                        variant.priorPrice ?? product.priorPrice;
                      const variantDiscountPercent = saleorDiscountPercent(
                        variantPrice,
                        variantPriorPrice,
                      );

                      return (
                        <label
                          className={[
                            "grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-[color:var(--cyber-gold)]/14 p-3 text-left transition last:border-b-0",
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
                            {variantDiscountPercent && variantPriorPrice ? (
                              <span className="mt-1 block text-xs text-foreground/42 line-through">
                                {formatSaleorMoney(variantPriorPrice)}
                              </span>
                            ) : null}
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
                      <p className="px-3 py-5 text-sm text-foreground/52">
                        No matching variants
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </fieldset>
            ) : null}

            <div className="mt-7 flex items-center justify-between gap-4 border-y border-[color:var(--cyber-gold)]/14 py-4">
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
              <QuantityControl
                canAdd={canAdd}
                maxQuantity={maxQuantity}
                quantity={quantity}
                updateQuantity={updateQuantity}
              />
            </div>

            <div className="mt-6" ref={primaryPurchaseRef}>
              <NtmsSaleorAddToCartButton
                disabled={!canAdd}
                label="Add to cart"
                quantity={quantity}
                size="full"
                variantId={selectedVariant?.id || product.variantId}
              />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[color:var(--cyber-gold)]/12 pt-5 text-center text-[11px] font-semibold text-foreground/52">
              <PurchaseSignal icon={<PackageCheck />} label="Live inventory" />
              <PurchaseSignal icon={<Truck />} label="UPS rates" />
              <PurchaseSignal icon={<ShieldCheck />} label="Secure checkout" />
            </div>
          </aside>
        </section>

        <section className="grid gap-8 border-t border-[color:var(--cyber-gold)]/14 py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
              Product information
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              Details
            </h2>
            {product.description ? (
              <div className="mt-5 max-w-3xl space-y-4 text-[15px] leading-7 text-foreground/66">
                {product.description.split(/\n{2,}/).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-7 text-foreground/52">
                Product specifications are shown for the selected option.
              </p>
            )}
          </div>
          <dl className="divide-y divide-[color:var(--cyber-gold)]/12 border-y border-[color:var(--cyber-gold)]/12 text-sm">
            <ProductFact label="SKU" value={selectedSku} />
            <ProductFact
              label="Category"
              value={product.category?.name ?? "Tattoo supply"}
            />
            <ProductFact
              label="Available options"
              value={product.variants.length.toLocaleString()}
            />
            <ProductFact
              label="Inventory"
              value={
                canAdd ? `${availableQuantity} available` : "Check availability"
              }
            />
          </dl>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="border-t border-[color:var(--cyber-gold)]/14 py-11">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
                  Continue sourcing
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-foreground">
                  More in {product.category?.name ?? "this category"}
                </h2>
              </div>
              {product.category ? (
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/58 transition hover:text-[color:var(--cyber-gold-soft)]"
                  params={{ collection: product.category.slug }}
                  to="/collections/$collection"
                >
                  View category
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/58 transition hover:text-[color:var(--cyber-gold-soft)]"
                  to="/search"
                >
                  Search catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
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

        <div className="h-20 lg:hidden" aria-hidden="true" />
      </div>

      {showMobileBuyBar ? (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--cyber-gold)]/18 bg-background/96 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(0,0,0,.3)] backdrop-blur-lg lg:hidden"
          data-saleor-mobile-buy-bar
        >
          <div className="mx-auto flex max-w-screen-2xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-foreground/50">
                {selectedSku}
              </p>
              <p className="mt-0.5 text-lg font-semibold text-[color:var(--cyber-gold-soft)]">
                {selectedPrice ? formatSaleorMoney(selectedPrice) : "Pending"}
              </p>
            </div>
            <NtmsSaleorAddToCartButton
              className="h-11 w-auto min-w-40 px-5"
              disabled={!canAdd}
              label={`Add ${quantity} to cart`}
              quantity={quantity}
              size="full"
              variantId={selectedVariant?.id || product.variantId}
            />
          </div>
        </div>
      ) : null}

      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="h-[min(90vh,920px)] max-w-[min(96vw,1100px)] grid-rows-[minmax(0,1fr)] gap-0 overflow-hidden rounded-md border-white/12 bg-black p-0">
          <DialogTitle className="sr-only">
            {product.name} image viewer
          </DialogTitle>
          <DialogDescription className="sr-only">
            View product images at a larger size.
          </DialogDescription>
          <div className="relative flex min-h-0 flex-1 items-center justify-center p-5 sm:p-10">
            {selectedImage ? (
              <img
                alt={selectedMedia?.alt || product.imageAlt}
                className="max-h-full max-w-full object-contain"
                src={selectedImage}
              />
            ) : null}
            {activeGallery.length > 1 ? (
              <>
                <GalleryNavigationButton
                  direction="previous"
                  onClick={() => showAdjacentMedia(-1)}
                />
                <GalleryNavigationButton
                  direction="next"
                  onClick={() => showAdjacentMedia(1)}
                />
              </>
            ) : null}
            <span className="absolute right-4 bottom-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white/72">
              {selectedMediaIndex + 1} / {Math.max(1, activeGallery.length)}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function GalleryNavigationButton({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  const isPrevious = direction === "previous";
  const Icon = isPrevious ? ChevronLeft : ChevronRight;

  return (
    <button
      aria-label={`${isPrevious ? "Previous" : "Next"} product image`}
      className={[
        "absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md border border-black/10 bg-white/92 text-black/65 shadow-md transition hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-gold)]",
        isPrevious ? "left-3" : "right-3",
      ].join(" ")}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      type="button"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function QuantityControl({
  canAdd,
  maxQuantity,
  quantity,
  updateQuantity,
}: {
  canAdd: boolean;
  maxQuantity: number;
  quantity: number;
  updateQuantity: (quantity: number) => void;
}) {
  return (
    <div className="flex h-10 shrink-0 items-center rounded-md border border-[color:var(--cyber-gold)]/20 bg-background">
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
        onChange={(event) => updateQuantity(event.currentTarget.valueAsNumber)}
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
  );
}

function PurchaseSignal({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <span className="text-[color:var(--cyber-gold-soft)] [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <span className="leading-4">{label}</span>
    </div>
  );
}

function ProductFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-4 py-4">
      <dt className="text-foreground/48">{label}</dt>
      <dd className="break-words text-right font-semibold text-foreground/78">
        {value}
      </dd>
    </div>
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

function saleorDiscountPercent(
  price: { amount: number } | null,
  priorPrice: { amount: number } | null,
) {
  if (!price || !priorPrice || priorPrice.amount <= price.amount) return null;
  return Math.max(
    1,
    Math.round(((priorPrice.amount - price.amount) / priorPrice.amount) * 100),
  );
}

function getAvailableQuantity(quantity: number | null | undefined) {
  if (typeof quantity !== "number" || !Number.isFinite(quantity)) return 0;

  return Math.max(0, Math.floor(quantity));
}
