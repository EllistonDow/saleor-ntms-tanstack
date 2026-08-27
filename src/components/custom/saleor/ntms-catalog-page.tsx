import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  BadgePercent,
  Boxes,
  Layers,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { GridTileImage } from "@/components/custom/grid/tile";
import type { NtmsSaleorCatalogPreview } from "@/lib/saleor/catalog";
import { cn } from "@/lib/utils";
import { NtmsSaleorAddToCartButton } from "./ntms-add-to-cart-button";

type NtmsSaleorProduct = NtmsSaleorCatalogPreview["products"][number];
type NtmsSaleorCategory = NtmsSaleorCatalogPreview["categories"][number];

const categoryDisplayNames = new Map([
  ["Products", "Studio Essentials"],
  ["Papa", "PAPA"],
  ["Power Supplies & Cords", "Power"],
]);

export const categoryPriority = [
  "Needles",
  "Inks",
  "Machines",
  "Tubes & Grips",
  "Power Supplies & Cords",
  "Medical",
  "Shop Supply",
  "Papa",
  "Sales",
];

const HERO_SLIDES = [
  {
    badge: "FLAGSHIP ROTARY",
    title: "Precision by Design: Wireless & Direct Drive",
    description:
      "High-torque Swiss motors, adjustable needle stroke profiles, and ergonomic aircraft-grade aluminum frames engineered for multi-hour sessions.",
    ctaText: "Explore Machines",
    ctaLink: "/collections/$collection" as const,
    ctaParams: { collection: "machines" },
    categoryIcon: Zap,
  },
  {
    badge: "SURGICAL CARTRIDGES",
    title: "Ultra-Tight Liners & High-Displacement Mags",
    description:
      "Medical grade 316L stainless steel needles with zero-play stabilization membranes for crisp, trauma-free ink deposit.",
    ctaText: "Shop Needles",
    ctaLink: "/collections/$collection" as const,
    ctaParams: { collection: "needles" },
    categoryIcon: Layers,
  },
  {
    badge: "JET BLACK FORMULAS",
    title: "High Pigment Load Inks & Dynamic Shading Sets",
    description:
      "Pure, concentrated dispersion inks tested for maximum color saturation, fast healing, and permanent solid saturation.",
    ctaText: "Shop Inks",
    ctaLink: "/collections/$collection" as const,
    ctaParams: { collection: "ntms-91-inks" },
    categoryIcon: Sparkles,
  },
];

export function NtmsSaleorCatalogPage({
  catalog,
  enableLinks = false,
}: {
  backLabel?: string;
  backTo?: string;
  catalog: NtmsSaleorCatalogPreview;
  enableLinks?: boolean;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentHero = HERO_SLIDES[activeSlide];

  const featuredProduct =
    catalog.products.find((product) => product.imageUrl) ?? catalog.products[0];
  const bentoSpotlight = catalog.products[0];
  const bentoSecondary1 = catalog.products[1];
  const bentoSecondary2 = catalog.products[2];

  const categories = getHomeCategories(catalog.categories);
  const products = catalog.products.slice(0, 8);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 80vh / Immersive Carousel Hero */}
      <section className="relative isolate min-h-[580px] overflow-hidden border-b border-[color:var(--cyber-gold)]/18 bg-black text-white lg:min-h-[660px]">
        {featuredProduct ? (
          <HeroProductMedia
            enableLinks={enableLinks}
            product={featuredProduct}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-0 w-full bg-gradient-to-r from-black via-black/85 to-black/30 lg:w-[54%]" />

        <div className="relative z-10 mx-auto flex min-h-[580px] max-w-screen-2xl items-end px-4 py-10 lg:min-h-[660px] lg:items-center lg:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--cyber-gold)]/30 bg-[color:var(--cyber-gold)]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[color:var(--cyber-gold-soft)]">
                <currentHero.categoryIcon className="h-3.5 w-3.5" />
                {currentHero.badge}
              </span>
              <span className="text-xs font-semibold uppercase text-white/50">
                Studio Grade
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[1.02] text-white sm:text-5xl lg:text-6xl">
              {currentHero.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
              {currentHero.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to={currentHero.ctaLink}
                params={currentHero.ctaParams}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[color:var(--cyber-gold)] px-6 text-sm font-black text-black shadow-[0_12px_32px_rgba(247,200,31,0.22)] transition hover:bg-[color:var(--cyber-gold-soft)]"
              >
                {currentHero.ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/search"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 text-sm font-bold text-white transition hover:border-[color:var(--cyber-gold)] hover:bg-white/10 hover:text-[color:var(--cyber-gold-soft)]"
              >
                Browse Full Catalog
                <ArrowDownRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Slide Navigation Trigger Indicators */}
            <div
              className="mt-8 flex items-center gap-2"
              role="tablist"
              aria-label="Hero Carousel Slides"
            >
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.badge}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeSlide}
                  aria-label={slide.badge}
                  onClick={() => setActiveSlide(idx)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    idx === activeSlide
                      ? "w-10 bg-[color:var(--cyber-gold)]"
                      : "w-2.5 bg-white/30 hover:bg-white/60",
                  )}
                />
              ))}
            </div>

            <div className="mt-10 grid max-w-xl divide-y divide-white/15 border-y border-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <CatalogSignal
                icon={<Boxes className="h-4 w-4" />}
                label="Catalog"
                value={`${catalog.totalProducts.toLocaleString()} supplies`}
              />
              <CatalogSignal
                icon={<Search className="h-4 w-4" />}
                label="Reference"
                value="Live Stock Sync"
              />
              <CatalogSignal
                icon={<BadgeCheck className="h-4 w-4" />}
                label="Delivery"
                value="Same-Day Shipping"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Editorial Modern Spotlight Grid - Image-First Visual Architecture */}
      {bentoSpotlight ? (
        <section className="border-b border-[color:var(--cyber-gold)]/14 bg-background/50 py-12">
          <div className="mx-auto max-w-screen-2xl px-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Studio Spotlight"
                title="Hardware & Cartridge Showcase"
              />
              <Link
                to="/search"
                className="inline-flex items-center gap-2 text-sm font-bold text-foreground/58 transition hover:text-[color:var(--cyber-gold-soft)]"
              >
                View all hardware
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* Primary Bento Spotlight Card - Dominant Visual Showcase */}
              <div className="group relative flex min-h-[540px] flex-col justify-between overflow-hidden rounded-2xl border border-[color:var(--cyber-gold)]/25 bg-card p-6 shadow-2xl transition-all duration-300 hover:border-[color:var(--cyber-gold)]/60 lg:col-span-2 lg:p-8">
                {/* Background Ambient Glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(247,200,31,0.08),transparent_70%)]" />

                {/* Floating Top Header Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="rounded-full bg-[color:var(--cyber-gold)] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-md">
                    Pro Spotlight
                  </span>
                  <div className="rounded-full border border-white/15 bg-black/60 px-4 py-1.5 backdrop-blur-md">
                    <PriceLabel
                      compact
                      price={bentoSpotlight.price}
                      priorPrice={bentoSpotlight.priorPrice}
                    />
                  </div>
                </div>

                {/* Huge Dominant Product Image Showcase (80% Visual Focus) */}
                <div className="relative z-0 my-4 flex min-h-[340px] flex-1 items-center justify-center p-2 sm:min-h-[380px]">
                  {bentoSpotlight.imageUrl ? (
                    <img
                      src={bentoSpotlight.imageUrl}
                      alt={bentoSpotlight.imageAlt}
                      className="max-h-[360px] w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] transition-transform duration-500 group-hover:scale-105 sm:max-h-[420px]"
                    />
                  ) : (
                    <ImageFallback label={bentoSpotlight.name} />
                  )}
                </div>

                {/* Minimal Overlay Footer Information */}
                <div className="relative z-10 rounded-xl border border-white/10 bg-black/75 p-4 backdrop-blur-lg sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[color:var(--cyber-gold-soft)]">
                        {bentoSpotlight.categoryName}
                      </p>
                      <h3 className="mt-1 truncate text-xl font-black text-white sm:text-2xl">
                        {bentoSpotlight.name}
                      </h3>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StockBadge
                        quantityAvailable={bentoSpotlight.quantityAvailable}
                      />
                      {enableLinks ? (
                        <Link
                          to="/product/$productId"
                          params={{ productId: bentoSpotlight.slug }}
                          className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--cyber-gold)] px-4 py-2.5 text-xs font-black text-black shadow transition hover:bg-[color:var(--cyber-gold-soft)]"
                        >
                          Inspect Details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Complementary Secondary Vertical Cards - Large Media Focus */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {bentoSecondary1 ? (
                  <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[color:var(--cyber-gold)]/20 bg-card p-5 shadow-lg transition-all duration-300 hover:border-[color:var(--cyber-gold)]/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--cyber-gold-soft)]">
                        {bentoSecondary1.categoryName}
                      </span>
                      <span className="rounded-md border border-white/10 bg-black/50 px-2.5 py-0.5 text-xs font-bold text-[color:var(--cyber-gold-soft)]">
                        {bentoSecondary1.price
                          ? formatSaleorMoney(bentoSecondary1.price)
                          : "Pending"}
                      </span>
                    </div>

                    {/* Large Secondary Image Area */}
                    <div className="my-3 flex h-48 items-center justify-center rounded-xl bg-white/[0.03] p-2 transition group-hover:bg-white/[0.06]">
                      {bentoSecondary1.imageUrl ? (
                        <img
                          src={bentoSecondary1.imageUrl}
                          alt={bentoSecondary1.imageAlt}
                          className="max-h-44 w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <ImageFallback
                          label={bentoSecondary1.name.slice(0, 2)}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <h4 className="truncate text-sm font-bold text-foreground">
                        {bentoSecondary1.name}
                      </h4>
                      {enableLinks ? (
                        <Link
                          to="/product/$productId"
                          params={{ productId: bentoSecondary1.slug }}
                          className="ml-2 inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[color:var(--cyber-gold-soft)] transition hover:text-white"
                        >
                          Details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {bentoSecondary2 ? (
                  <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[color:var(--cyber-gold)]/20 bg-card p-5 shadow-lg transition-all duration-300 hover:border-[color:var(--cyber-gold)]/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--cyber-gold-soft)]">
                        {bentoSecondary2.categoryName}
                      </span>
                      <span className="rounded-md border border-white/10 bg-black/50 px-2.5 py-0.5 text-xs font-bold text-[color:var(--cyber-gold-soft)]">
                        {bentoSecondary2.price
                          ? formatSaleorMoney(bentoSecondary2.price)
                          : "Pending"}
                      </span>
                    </div>

                    {/* Large Secondary Image Area */}
                    <div className="my-3 flex h-48 items-center justify-center rounded-xl bg-white/[0.03] p-2 transition group-hover:bg-white/[0.06]">
                      {bentoSecondary2.imageUrl ? (
                        <img
                          src={bentoSecondary2.imageUrl}
                          alt={bentoSecondary2.imageAlt}
                          className="max-h-44 w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <ImageFallback
                          label={bentoSecondary2.name.slice(0, 2)}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <h4 className="truncate text-sm font-bold text-foreground">
                        {bentoSecondary2.name}
                      </h4>
                      {enableLinks ? (
                        <Link
                          to="/product/$productId"
                          params={{ productId: bentoSecondary2.slug }}
                          className="ml-2 inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[color:var(--cyber-gold-soft)] transition hover:text-white"
                        >
                          Details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Category Index Grid */}
      <section className="border-b border-[color:var(--cyber-gold)]/14">
        <div className="mx-auto max-w-screen-2xl px-4 py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Supply index" title="Build the order" />
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-sm font-bold text-foreground/58 transition hover:text-[color:var(--cyber-gold-soft)]"
            >
              Search the catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-7 grid border-l border-t border-[color:var(--cyber-gold)]/14 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <SupplyIndexItem
                key={category.id}
                category={category}
                enableLinks={enableLinks}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Index */}
      {catalog.curatedCollections.length > 0 ? (
        <section className="border-b border-[color:var(--cyber-gold)]/14 bg-card">
          <div className="mx-auto max-w-screen-2xl px-4 py-11">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Brand index" title="Shop by brand" />
              <Link
                to="/search"
                className="inline-flex items-center gap-2 text-sm font-bold text-foreground/58 transition hover:text-[color:var(--cyber-gold-soft)]"
              >
                Search all brands
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid border-l border-t border-[color:var(--cyber-gold)]/14 sm:grid-cols-3">
              {catalog.curatedCollections.map((collection) => (
                <BrandCollectionItem
                  collection={collection}
                  enableLinks={enableLinks}
                  key={collection.id}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Product Grid */}
      <section className="bg-card">
        <div className="mx-auto max-w-screen-2xl px-4 py-11">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Studio picks" title="Commonly ordered" />
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-sm font-bold text-foreground/58 transition hover:text-[color:var(--cyber-gold-soft)]"
            >
              Search all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <SaleorProductCard
                enableLinks={enableLinks}
                key={product.id}
                product={product}
                priority={false}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function getHomeCategories(categories: NtmsSaleorCategory[]) {
  return [...categories]
    .sort((left, right) => {
      const leftIndex = categoryPriority.indexOf(left.name);
      const rightIndex = categoryPriority.indexOf(right.name);
      if (leftIndex !== -1 || rightIndex !== -1) {
        return (
          (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) -
          (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex)
        );
      }
      return right.productCount - left.productCount;
    })
    .slice(0, categoryPriority.length);
}

function getCategoryDisplayName(category: NtmsSaleorCategory) {
  return categoryDisplayNames.get(category.name) ?? category.name;
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-bold text-foreground">{title}</h2>
    </div>
  );
}

function CatalogSignal({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 px-0 py-4 first:pt-4 last:pb-4 sm:px-4 sm:first:pl-0 sm:last:pr-0">
      <span className="text-[color:var(--cyber-gold-soft)]">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase text-white/55">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function HeroProductMedia({
  enableLinks,
  product,
}: {
  enableLinks: boolean;
  product: NtmsSaleorProduct;
}) {
  const content = product.imageUrl ? (
    <img
      alt={product.imageAlt}
      className="h-full w-full object-contain p-8 opacity-55 sm:p-10 lg:p-14 lg:opacity-100"
      decoding="async"
      fetchPriority="high"
      height={512}
      loading="eager"
      src={product.imageUrl}
      width={512}
    />
  ) : (
    <ImageFallback label={product.name} />
  );

  if (!enableLinks) {
    return (
      <div className="absolute inset-y-0 right-0 z-0 hidden lg:block lg:w-[62%]">
        {content}
      </div>
    );
  }

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.slug }}
      preload="intent"
      aria-label={`Open ${product.name}`}
      className="absolute inset-y-0 right-0 z-0 hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--cyber-gold)] lg:block lg:w-[62%]"
    >
      {content}
    </Link>
  );
}

function SupplyIndexItem({
  category,
  enableLinks,
}: {
  category: NtmsSaleorCategory;
  enableLinks: boolean;
}) {
  const displayName = getCategoryDisplayName(category);
  const content = (
    <article className="group flex flex-col border-b border-r border-[color:var(--cyber-gold)]/14 bg-card transition hover:border-[color:var(--cyber-gold)]/40 hover:bg-card/90">
      {/* Large Image Showcase Area */}
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden border-b border-[color:var(--cyber-gold)]/10 bg-white p-4">
        {category.imageUrl ? (
          <img
            alt={category.imageAlt}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-108"
            decoding="async"
            height={420}
            loading="lazy"
            src={category.imageUrl}
            width={420}
          />
        ) : (
          <ImageFallback label={category.name.slice(0, 2).toUpperCase()} />
        )}
        <span className="absolute right-3 top-3 rounded-md bg-black/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[color:var(--cyber-gold-soft)] backdrop-blur-md">
          {category.productCount.toLocaleString()} items
        </span>
      </div>

      {/* Concise Visual Label */}
      <div className="flex items-center justify-between p-4 sm:p-5">
        <h3 className="truncate text-lg font-bold text-foreground group-hover:text-[color:var(--cyber-gold-soft)]">
          {displayName}
        </h3>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[color:var(--cyber-gold)]/18 text-[color:var(--cyber-gold-soft)] transition group-hover:border-[color:var(--cyber-gold)] group-hover:bg-[color:var(--cyber-gold)] group-hover:text-black">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  );

  if (!enableLinks) {
    return content;
  }

  return (
    <Link
      to="/collections/$collection"
      params={{ collection: category.slug }}
      preload="intent"
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-gold)]"
    >
      {content}
    </Link>
  );
}

function BrandCollectionItem({
  collection,
  enableLinks,
}: {
  collection: NtmsSaleorCategory;
  enableLinks: boolean;
}) {
  const content = (
    <article className="group min-h-[152px] border-b border-r border-[color:var(--cyber-gold)]/14 p-5 transition hover:bg-background">
      <p className="text-[10px] font-bold uppercase text-[color:var(--cyber-gold-soft)]">
        {collection.productCount.toLocaleString()} products
      </p>
      <h3 className="mt-3 text-2xl font-semibold leading-tight text-foreground">
        {collection.name}
      </h3>
      <span className="mt-6 inline-flex h-8 w-8 items-center justify-center rounded-md border border-[color:var(--cyber-gold)]/18 text-[color:var(--cyber-gold-soft)] transition group-hover:border-[color:var(--cyber-gold)] group-hover:bg-[color:var(--cyber-gold)] group-hover:text-black">
        <ArrowRight className="h-4 w-4" />
      </span>
    </article>
  );

  if (!enableLinks) return content;
  return (
    <Link
      to="/collections/$collection"
      params={{ collection: collection.slug }}
      preload="intent"
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-gold)]"
    >
      {content}
    </Link>
  );
}

export function SaleorProductCard({
  enableLinks = false,
  product,
  priority,
}: {
  enableLinks?: boolean;
  product: NtmsSaleorProduct;
  priority: boolean;
}) {
  const requiresVariantSelection = product.variantCount > 1;
  const canAdd =
    !requiresVariantSelection &&
    Boolean(product.variantId) &&
    Boolean(product.quantityAvailable && product.quantityAvailable > 0);
  const media = product.imageUrl ? (
    <GridTileImage
      alt={product.imageAlt}
      className="object-contain p-4"
      frame={false}
      height={512}
      priority={priority}
      src={product.imageUrl}
      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
      layout="constrained"
      width={512}
    />
  ) : (
    <ImageFallback label="Nuclear Tattoo Supply" />
  );

  return (
    <article
      className="group flex h-full min-h-[280px] flex-col overflow-hidden rounded-md border border-[color:var(--cyber-gold)]/14 bg-card transition hover:border-[color:var(--cyber-gold)]/42 hover:bg-card/90"
      data-saleor-product-card
    >
      <div className="aspect-square border-b border-[color:var(--cyber-gold)]/10 bg-white">
        {enableLinks ? (
          <Link
            to="/product/$productId"
            params={{ productId: product.slug }}
            preload="intent"
            className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--cyber-gold)]"
          >
            {media}
          </Link>
        ) : (
          media
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="line-clamp-1 text-[10px] font-bold uppercase text-[color:var(--cyber-gold-soft)]">
          {product.categoryName}
        </p>
        {enableLinks ? (
          <Link
            to="/product/$productId"
            params={{ productId: product.slug }}
            preload="intent"
            className="mt-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-gold)]"
          >
            <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-foreground transition group-hover:text-[color:var(--cyber-gold-soft)]">
              {product.name}
            </h3>
          </Link>
        ) : (
          <h3 className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-foreground transition group-hover:text-[color:var(--cyber-gold-soft)]">
            {product.name}
          </h3>
        )}
        <p className="mt-2 line-clamp-1 text-xs text-foreground/48">
          {requiresVariantSelection
            ? `${product.variantCount.toLocaleString()} variants`
            : `SKU ${product.sku || "pending"}`}
        </p>
        <div className="mt-auto border-t border-[color:var(--cyber-gold)]/12 pt-3">
          <div className="flex items-end justify-between gap-2">
            <PriceLabel
              compact
              price={product.price}
              priorPrice={product.priorPrice}
            />
            <StockBadge quantityAvailable={product.quantityAvailable} />
          </div>
          {requiresVariantSelection ? (
            <Link
              to="/product/$productId"
              params={{ productId: product.slug }}
              preload="intent"
              className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-[color:var(--cyber-gold)]/22 px-3 text-xs font-semibold text-foreground/72 transition hover:border-[color:var(--cyber-gold)]/52 hover:text-[color:var(--cyber-gold-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-gold)]"
              data-saleor-choose-options
            >
              Choose options
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : canAdd ? (
            <NtmsSaleorAddToCartButton
              className="mt-3 h-9 w-full"
              label="Add"
              variantId={product.variantId}
            />
          ) : enableLinks ? (
            <Link
              to="/product/$productId"
              params={{ productId: product.slug }}
              preload="intent"
              className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-[color:var(--cyber-gold)]/22 px-3 text-xs font-semibold text-foreground/72 transition hover:border-[color:var(--cyber-gold)]/52 hover:text-[color:var(--cyber-gold-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-gold)]"
            >
              View item
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function StockBadge({
  quantityAvailable,
}: {
  quantityAvailable: number | null;
}) {
  return (
    <span
      className={cn(
        "rounded-sm border px-2 py-1 text-[10px] font-semibold",
        quantityAvailable && quantityAvailable > 0
          ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
          : "border-amber-300/20 bg-amber-400/10 text-amber-100",
      )}
    >
      {quantityAvailable && quantityAvailable > 0 ? "In stock" : "Check stock"}
    </span>
  );
}

function PriceLabel({
  compact = false,
  price,
  priorPrice,
}: {
  compact?: boolean;
  price: { amount: number; currency: string } | null;
  priorPrice: { amount: number; currency: string } | null;
}) {
  const discountPercent = saleorDiscountPercent(price, priorPrice);

  return (
    <div className="min-w-0">
      {!compact ? <p className="text-xs text-foreground/48">Price</p> : null}
      <div className="mt-1 flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1">
        <p className="text-base font-semibold leading-none text-[color:var(--cyber-gold-soft)]">
          {price ? formatSaleorMoney(price) : "Price pending"}
        </p>
        {discountPercent && priorPrice ? (
          <p className="text-xs text-foreground/42 line-through">
            {formatSaleorMoney(priorPrice)}
          </p>
        ) : null}
      </div>
      {discountPercent ? (
        <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-300">
          <BadgePercent className="h-3.5 w-3.5" />
          Save {discountPercent}%
        </p>
      ) : null}
    </div>
  );
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
