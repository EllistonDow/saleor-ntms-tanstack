import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";
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
    <main className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] antialiased">
      {/* 1. Breadcrumbs in Apple Light Style */}
      <div className="border-b border-black/[0.04] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-2 text-[11px] font-medium tracking-tight text-[#86868b]"
          >
            <Link to="/" className="shrink-0 transition hover:text-[#0071e3]">
              Store
            </Link>
            {product.category ? (
              <>
                <ChevronRight className="h-3 w-3 shrink-0 text-[#86868b]" />
                <Link
                  to="/collections/$collection"
                  params={{ collection: product.category.slug }}
                  className="shrink-0 transition hover:text-[#0071e3]"
                >
                  {product.category.name}
                </Link>
              </>
            ) : null}
            <ChevronRight className="h-3 w-3 shrink-0 text-[#86868b]" />
            <span className="min-w-0 truncate font-semibold text-[#1d1d1f]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Apple Studio Stage: Dominant Product Gallery & Purchase Panel */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Main Stage Gallery (Left 7 Cols) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] sm:p-12">
              <button
                aria-label="Open image viewer"
                className="group relative flex min-h-[380px] sm:min-h-[480px] w-full cursor-zoom-in items-center justify-center text-left"
                disabled={!selectedImage}
                onClick={() => setIsGalleryOpen(true)}
                type="button"
              >
                {selectedImage ? (
                  <img
                    alt={selectedMedia?.alt || product.imageAlt}
                    className="max-h-[460px] w-full object-contain mix-blend-multiply drop-shadow-[0_25px_45px_rgba(0,0,0,0.1)] transition-transform duration-700 group-hover:scale-105"
                    src={selectedImage}
                  />
                ) : (
                  <ImageFallback label={product.name} />
                )}
                {selectedImage ? (
                  <span className="absolute right-4 bottom-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f] shadow-sm transition hover:bg-[#e8e8ed]">
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

            {/* Thumbnail Strip */}
            {activeGallery.length > 1 ? (
              <fieldset className="mt-4 flex w-full gap-3 overflow-x-auto pb-2">
                <legend className="sr-only">Product images</legend>
                {activeGallery.map((media, index) => {
                  const active = media.url === selectedImage;

                  return (
                    <button
                      aria-label={`Show image ${index + 1} of ${activeGallery.length}`}
                      aria-pressed={active}
                      className={[
                        "h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white p-2 shadow-sm transition-all duration-300",
                        active
                          ? "ring-2 ring-[#0071e3] scale-105 shadow-md"
                          : "opacity-60 hover:opacity-100",
                      ].join(" ")}
                      key={media.url}
                      onClick={() => setSelectedMediaUrl(media.url)}
                      type="button"
                    >
                      <img
                        alt=""
                        className="h-full w-full object-contain mix-blend-multiply"
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

          {/* Product Purchase & Spec Column (Right 5 Cols) */}
          <aside className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] sm:p-10">
              {product.category ? (
                <Link
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0071e3] transition hover:underline"
                  params={{ collection: product.category.slug }}
                  to="/collections/$collection"
                >
                  {product.category.name}
                </Link>
              ) : (
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0071e3]">
                  Precision Hardware
                </p>
              )}

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-3xl leading-snug">
                {product.name}
              </h1>

              {/* Price & Stock Badge */}
              <div className="mt-6 flex items-baseline justify-between border-b border-black/[0.06] pb-6">
                <div>
                  <p className="text-3xl font-extrabold text-[#1d1d1f]">
                    {selectedPrice
                      ? formatSaleorMoney(selectedPrice)
                      : "Pro Item"}
                  </p>
                  {selectedDiscountPercent && selectedPriorPrice ? (
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-sm text-[#86868b] line-through">
                        {formatSaleorMoney(selectedPriorPrice)}
                      </p>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                        Save {selectedDiscountPercent}%
                      </span>
                    </div>
                  ) : null}
                </div>

                <span
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                    canAdd
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700",
                  ].join(" ")}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      canAdd ? "bg-emerald-500" : "bg-amber-500",
                    )}
                  />
                  {canAdd ? "In Stock" : "Limited Stock"}
                </span>
              </div>

              {/* SKU & Options Meta Bar */}
              <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-[#f5f5f7] p-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
                    SKU Code
                  </span>
                  <p
                    className="mt-0.5 font-bold text-[#1d1d1f]"
                    data-saleor-selected-sku
                  >
                    {selectedSku}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
                    Variants
                  </span>
                  <p
                    className="mt-0.5 font-bold text-[#1d1d1f]"
                    data-saleor-variant-count
                  >
                    {product.variants.length} available
                  </p>
                </div>
              </div>

              {/* Variant Selector */}
              {product.variants.length > 1 ? (
                <div className="mt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f]">
                    Select Specification
                  </span>

                  {hasAttributeSelector && selectedVariant ? (
                    <div className="mt-3">
                      <NtmsSaleorVariantSelector
                        groups={variantAttributeGroups}
                        onSelectVariant={selectVariant}
                        selectedVariant={selectedVariant}
                        variants={product.variants}
                      />
                      {selectedConfiguration.length > 0 ? (
                        <p
                          aria-live="polite"
                          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#0071e3]"
                          data-saleor-selected-configuration
                        >
                          <Check className="h-3.5 w-3.5 shrink-0" />
                          {selectedConfiguration.join(" / ")}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {!hasAttributeSelector && hasVariantSearch ? (
                    <div className="relative mt-3">
                      <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#86868b]"
                      />
                      <input
                        aria-label="Search product variants"
                        autoComplete="off"
                        className="h-9 w-full rounded-full bg-[#f5f5f7] pl-8 pr-3 text-xs font-medium text-[#1d1d1f] outline-none transition placeholder:text-[#86868b] focus:bg-white focus:ring-2 focus:ring-[#0071e3]/30"
                        data-saleor-variant-search
                        onChange={(event) =>
                          setVariantSearchQuery(event.currentTarget.value)
                        }
                        placeholder="Search SKU or size..."
                        spellCheck={false}
                        type="search"
                        value={variantSearchQuery}
                      />
                    </div>
                  ) : null}

                  {!hasAttributeSelector ? (
                    <div
                      className={[
                        "mt-3 divide-y divide-black/[0.04] overflow-hidden rounded-2xl border border-black/[0.06] bg-white",
                        hasVariantSearch ? "max-h-60 overflow-y-auto" : "",
                      ].join(" ")}
                      data-saleor-variant-options
                    >
                      {visibleVariants.map((variant) => {
                        const active = variant.id === selectedVariant?.id;
                        const variantPrice = variant.price ?? product.price;

                        return (
                          <label
                            className={[
                              "flex cursor-pointer items-center justify-between p-3 text-left transition",
                              active
                                ? "bg-[#0071e3]/08 text-[#0071e3]"
                                : "hover:bg-[#f5f5f7]",
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
                            <div className="min-w-0">
                              <span className="block truncate text-xs font-bold text-[#1d1d1f]">
                                {variant.name}
                              </span>
                              <span className="block text-[11px] text-[#86868b]">
                                SKU {variant.sku || "N/A"}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-[#1d1d1f]">
                              {variantPrice
                                ? formatSaleorMoney(variantPrice)
                                : ""}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Quantity and Primary Add to Cart Button */}
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/[0.06] pt-6">
                <div>
                  <span className="text-xs font-bold text-[#1d1d1f]">
                    Quantity
                  </span>
                  <p className="text-[11px] text-[#86868b]">Studio supply</p>
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
                  className="w-full rounded-full bg-[#0071e3] py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,113,227,0.3)] transition-all hover:bg-[#0077ed] hover:shadow-[0_6px_20px_rgba(0,113,227,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                  disabled={!canAdd}
                  label="Add to Bag"
                  quantity={quantity}
                  size="full"
                  variantId={selectedVariant?.id || product.variantId}
                />
              </div>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-3 gap-2 border-t border-black/[0.04] pt-6 text-center text-[10px] font-semibold text-[#86868b]">
                <PurchaseSignal
                  icon={<PackageCheck className="h-4 w-4 text-[#0071e3]" />}
                  label="Direct Certified"
                />
                <PurchaseSignal
                  icon={<Truck className="h-4 w-4 text-[#0071e3]" />}
                  label="Priority Express"
                />
                <PurchaseSignal
                  icon={<ShieldCheck className="h-4 w-4 text-[#0071e3]" />}
                  label="Sterility Assured"
                />
              </div>
            </div>
          </aside>
        </section>

        {/* Product Details Section */}
        <section className="mt-16 rounded-[2.5rem] bg-white p-8 sm:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0071e3]">
            Studio Specification
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-3xl">
            Product Overview &amp; Details
          </h2>
          {product.description ? (
            <div className="mt-6 max-w-4xl space-y-4 text-base leading-relaxed text-[#515154]">
              {product.description.split(/\n{2,}/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[#86868b]">
              Full technical specifications and batch certifications verified by
              Nuclear Tattoo Supply.
            </p>
          )}
        </section>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 ? (
          <section className="mt-16">
            <div className="flex items-center justify-between pb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0071e3]">
                  Studio Pairings
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-3xl">
                  More in {product.category?.name ?? "Hardware"}
                </h2>
              </div>
              {product.category ? (
                <Link
                  className="text-xs font-semibold text-[#0071e3] hover:underline"
                  params={{ collection: product.category.slug }}
                  to="/collections/$collection"
                >
                  View full series &rarr;
                </Link>
              ) : null}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((item, index) => (
                <SaleorProductCard
                  enableLinks
                  key={item.id}
                  product={item}
                  priority={index < 2}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {/* Mobile Sticky Buy Bar */}
      {showMobileBuyBar ? (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/90 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-2xl lg:hidden"
          data-saleor-mobile-buy-bar
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#1d1d1f]">
                {product.name}
              </p>
              <p className="text-sm font-extrabold text-[#0071e3]">
                {selectedPrice ? formatSaleorMoney(selectedPrice) : ""}
              </p>
            </div>
            <NtmsSaleorAddToCartButton
              className="rounded-full bg-[#0071e3] px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#0077ed]"
              disabled={!canAdd}
              label={`Add (${quantity})`}
              quantity={quantity}
              variantId={selectedVariant?.id || product.variantId}
            />
          </div>
        </div>
      ) : null}

      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="h-[min(90vh,920px)] max-w-[min(96vw,1100px)] overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl">
          <DialogTitle className="sr-only">
            {product.name} image viewer
          </DialogTitle>
          <DialogDescription className="sr-only">
            View product images at a larger size.
          </DialogDescription>
          <div className="relative flex min-h-0 flex-1 items-center justify-center p-8 sm:p-14">
            {selectedImage ? (
              <img
                alt={selectedMedia?.alt || product.imageAlt}
                className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-xl"
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
        "absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1d1d1f] shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition hover:bg-white hover:scale-105 active:scale-95",
        isPrevious ? "left-4" : "right-4",
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
    <div className="flex h-9 shrink-0 items-center rounded-full bg-[#f5f5f7] p-1">
      <button
        aria-label="Decrease quantity"
        className="grid h-7 w-7 place-items-center rounded-full text-[#1d1d1f] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
        data-saleor-decrease-quantity
        disabled={!canAdd || quantity <= 1}
        onClick={() => updateQuantity(quantity - 1)}
        type="button"
      >
        <Minus className="h-3 w-3" />
      </button>
      <input
        aria-label="Quantity"
        className="h-full w-10 border-0 bg-transparent px-1 text-center text-xs font-bold text-[#1d1d1f] outline-none disabled:text-[#86868b]"
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
        className="grid h-7 w-7 place-items-center rounded-full text-[#1d1d1f] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
        data-saleor-increase-quantity
        disabled={!canAdd || quantity >= maxQuantity}
        onClick={() => updateQuantity(quantity + 1)}
        type="button"
      >
        <Plus className="h-3 w-3" />
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
    <div className="flex flex-col items-center gap-1.5">
      <span>{icon}</span>
      <span className="leading-tight">{label}</span>
    </div>
  );
}

function ImageFallback({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs font-semibold uppercase text-[#86868b]">
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
