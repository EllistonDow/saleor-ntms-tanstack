import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  BadgePercent,
  Layers,
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
  ["Papa", "PAPA Supply"],
  ["Power Supplies & Cords", "Power & Cordage"],
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
    title: "Precision. Redefined.",
    subtitle: "Swiss Engineered Rotary Systems & Cordless Power",
    description:
      "Crafted from aircraft-grade aerospace alloys with zero-tolerance drive shafts. Engineered for 10+ hour continuous tattooing with instant torque response.",
    ctaText: "Explore Machines",
    ctaLink: "/collections/$collection" as const,
    ctaParams: { collection: "machines" },
    categoryIcon: Zap,
  },
  {
    badge: "SURGICAL CARTRIDGES",
    title: "Ultra-Tight. Flawless.",
    subtitle: "Medical 316L Stainless Needles & Stabilizer Membrane",
    description:
      "Micro-polished taper profiles paired with proprietary bounce-back silicone membranes for absolute needle stability and minimal skin trauma.",
    ctaText: "Shop Needles",
    ctaLink: "/collections/$collection" as const,
    ctaParams: { collection: "needles" },
    categoryIcon: Layers,
  },
  {
    badge: "PURE PIGMENT FORMULAS",
    title: "Deep Black. Permanent Tone.",
    subtitle: "High Solid-Load Inks & Smooth Shading Gradients",
    description:
      "Pre-dispersed carbon formulations delivering rich solid fills, lightning-fast skin healing, and decades-long jet black retention.",
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
    <main className="min-h-screen bg-[#050505] text-zinc-100 antialiased selection:bg-[color:var(--cyber-gold)] selection:text-black">
      {/* -------------------------------------------------------------------------
          APPLE-STYLE STAGE HERO: 80vh Ambient Dark Canvas + Massive Typography
      -------------------------------------------------------------------------- */}
      <section className="relative isolate flex min-h-[82vh] flex-col justify-between overflow-hidden border-b border-white/[0.08] bg-black px-4 py-12 lg:min-h-[88vh] lg:py-20">
        {/* Apple Atmospheric Studio Glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(247,200,31,0.12),transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[480px] w-[580px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_70%)] blur-2xl" />

        {/* Hero Product Giant Floating Hardware Backdrop */}
        {featuredProduct ? (
          <AppleHeroHardwareMedia
            enableLinks={enableLinks}
            product={featuredProduct}
          />
        ) : null}

        <div className="relative z-10 mx-auto w-full max-w-screen-2xl">
          {/* Top Apple-Style Segmented Pill Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/80 p-1 backdrop-blur-xl shadow-2xl">
              {HERO_SLIDES.map((slide, idx) => {
                const Icon = slide.categoryIcon;
                const isSelected = idx === activeSlide;
                return (
                  <button
                    key={slide.badge}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300",
                      isSelected
                        ? "bg-white text-black shadow-lg"
                        : "text-zinc-400 hover:text-white",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5",
                        isSelected ? "text-black" : "text-zinc-500",
                      )}
                    />
                    <span>{slide.badge}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-zinc-900/50 px-4 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-md sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Studio Stock Active
            </div>
          </div>

          {/* Apple Grand Pro Typography Presentation */}
          <div className="mt-14 max-w-3xl lg:mt-24">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--cyber-gold-soft)]">
              {currentHero.subtitle}
            </p>
            <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
              {currentHero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg sm:leading-8">
              {currentHero.description}
            </p>

            {/* Apple Action Buttons (Pill-shaped, sleek) */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to={currentHero.ctaLink}
                params={currentHero.ctaParams}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-black shadow-[0_12px_36px_rgba(255,255,255,0.18)] transition hover:bg-zinc-200 active:scale-95"
              >
                {currentHero.ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/search"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/[0.12] hover:border-white/40 active:scale-95"
              >
                Explore All Products
                <ArrowDownRight className="h-4 w-4 text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Feature Metrics Bar */}
        <div className="relative z-10 mx-auto mt-12 w-full max-w-screen-2xl border-t border-white/[0.08] pt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <AppleMetricItem
              label="Pro Inventory"
              value={`${catalog.totalProducts.toLocaleString()}+ Supplies`}
            />
            <AppleMetricItem label="Engineered Quality" value="ISO 13485 Std" />
            <AppleMetricItem
              label="Same-Day Dispatch"
              value="Orders by 3PM EST"
            />
            <AppleMetricItem
              label="Direct Studio Sync"
              value="Live Warehouse"
            />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          APPLE-STYLE BENTO HARDWARE SHOWCASE: Full-Canvas Bleed & High Gloss
      -------------------------------------------------------------------------- */}
      {bentoSpotlight ? (
        <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#09090b] py-16 lg:py-24">
          <div className="mx-auto max-w-screen-2xl px-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--cyber-gold-soft)]">
                  Hardware Showcase
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Engineered for Masters.
                </h2>
              </div>
              <Link
                to="/search"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 transition hover:text-white"
              >
                View all studio hardware
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Apple Bento Grid Matrix */}
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {/* Major 2-Column Spotlight Hero Canvas */}
              <div className="group relative flex min-h-[580px] flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/[0.1] bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-white/25 lg:col-span-2 lg:p-12">
                {/* Subtle spotlight radial highlight */}
                <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[color:var(--cyber-gold)]/10 blur-3xl transition-opacity group-hover:opacity-100" />

                {/* Top Floating Badge & Specs */}
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[color:var(--cyber-gold-soft)]">
                      {bentoSpotlight.categoryName}
                    </span>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-4xl">
                      {bentoSpotlight.name}
                    </h3>
                  </div>
                  <div className="rounded-full border border-white/15 bg-black/60 px-4 py-2 backdrop-blur-xl shadow-lg">
                    <PriceLabel
                      compact
                      price={bentoSpotlight.price}
                      priorPrice={bentoSpotlight.priorPrice}
                    />
                  </div>
                </div>

                {/* Apple-Style Dominant Image Canvas: 100% Unrestricted Bleed */}
                <div className="relative z-0 my-6 flex min-h-[360px] flex-1 items-center justify-center sm:min-h-[420px]">
                  {bentoSpotlight.imageUrl ? (
                    <img
                      src={bentoSpotlight.imageUrl}
                      alt={bentoSpotlight.imageAlt}
                      className="max-h-[380px] w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.85)] transition-all duration-700 group-hover:scale-106 sm:max-h-[460px]"
                    />
                  ) : (
                    <ImageFallback label={bentoSpotlight.name} />
                  )}
                </div>

                {/* Floating Bottom Action Bar */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6">
                  <div className="flex items-center gap-3">
                    <StockBadge
                      quantityAvailable={bentoSpotlight.quantityAvailable}
                    />
                    <span className="text-xs text-zinc-400">
                      SKU: {bentoSpotlight.sku || "Pro Baseline"}
                    </span>
                  </div>
                  {enableLinks ? (
                    <Link
                      to="/product/$productId"
                      params={{ productId: bentoSpotlight.slug }}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black shadow-lg transition hover:bg-zinc-200 active:scale-95"
                    >
                      Buy / Inspect
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </div>

              {/* Two Vertical Stacked Apple Cards */}
              <div className="flex flex-col gap-6">
                {bentoSecondary1 ? (
                  <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.1] bg-gradient-to-b from-zinc-900/70 to-zinc-950/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:border-white/25">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                          {bentoSecondary1.categoryName}
                        </span>
                        <h4 className="mt-1 line-clamp-1 text-lg font-bold text-white group-hover:text-[color:var(--cyber-gold-soft)]">
                          {bentoSecondary1.name}
                        </h4>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-bold text-[color:var(--cyber-gold-soft)] backdrop-blur-md">
                        {bentoSecondary1.price
                          ? formatSaleorMoney(bentoSecondary1.price)
                          : "Pending"}
                      </span>
                    </div>

                    {/* Expansive Secondary Hardware Graphic */}
                    <div className="my-4 flex h-52 items-center justify-center p-2">
                      {bentoSecondary1.imageUrl ? (
                        <img
                          src={bentoSecondary1.imageUrl}
                          alt={bentoSecondary1.imageAlt}
                          className="max-h-48 w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:scale-106"
                        />
                      ) : (
                        <ImageFallback
                          label={bentoSecondary1.name.slice(0, 2)}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <StockBadge
                        quantityAvailable={bentoSecondary1.quantityAvailable}
                      />
                      {enableLinks ? (
                        <Link
                          to="/product/$productId"
                          params={{ productId: bentoSecondary1.slug }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-zinc-300 transition hover:text-white"
                        >
                          View details &rarr;
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {bentoSecondary2 ? (
                  <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.1] bg-gradient-to-b from-zinc-900/70 to-zinc-950/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:border-white/25">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                          {bentoSecondary2.categoryName}
                        </span>
                        <h4 className="mt-1 line-clamp-1 text-lg font-bold text-white group-hover:text-[color:var(--cyber-gold-soft)]">
                          {bentoSecondary2.name}
                        </h4>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-bold text-[color:var(--cyber-gold-soft)] backdrop-blur-md">
                        {bentoSecondary2.price
                          ? formatSaleorMoney(bentoSecondary2.price)
                          : "Pending"}
                      </span>
                    </div>

                    {/* Expansive Secondary Hardware Graphic */}
                    <div className="my-4 flex h-52 items-center justify-center p-2">
                      {bentoSecondary2.imageUrl ? (
                        <img
                          src={bentoSecondary2.imageUrl}
                          alt={bentoSecondary2.imageAlt}
                          className="max-h-48 w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:scale-106"
                        />
                      ) : (
                        <ImageFallback
                          label={bentoSecondary2.name.slice(0, 2)}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <StockBadge
                        quantityAvailable={bentoSecondary2.quantityAvailable}
                      />
                      {enableLinks ? (
                        <Link
                          to="/product/$productId"
                          params={{ productId: bentoSecondary2.slug }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-zinc-300 transition hover:text-white"
                        >
                          View details &rarr;
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

      {/* -------------------------------------------------------------------------
          APPLE-STYLE CATEGORY TILES: Clean Rounded Large Media Cards
      -------------------------------------------------------------------------- */}
      <section className="border-b border-white/[0.08] bg-[#050505] py-16 lg:py-24">
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--cyber-gold-soft)]">
                Supply Directory
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Explore by Category.
              </h2>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 transition hover:text-white"
            >
              Search complete catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <AppleSupplyCard
                key={category.id}
                category={category}
                enableLinks={enableLinks}
              />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          APPLE PRODUCT GALLERY: Clean Minimalist Studio Hardware Grid
      -------------------------------------------------------------------------- */}
      <section className="bg-black py-16 lg:py-24">
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--cyber-gold-soft)]">
                Studio Staples
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Essential Studio Picks.
              </h2>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 transition hover:text-white"
            >
              Browse all items
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <AppleProductCard
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

function AppleMetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-white/15 pl-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function AppleHeroHardwareMedia({
  enableLinks,
  product,
}: {
  enableLinks: boolean;
  product: NtmsSaleorProduct;
}) {
  const content = product.imageUrl ? (
    <img
      alt={product.imageAlt}
      className="h-full w-full object-contain p-6 opacity-30 drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)] transition-all duration-700 sm:opacity-50 lg:p-12 lg:opacity-95 lg:scale-110"
      decoding="async"
      fetchPriority="high"
      height={720}
      loading="eager"
      src={product.imageUrl}
      width={720}
    />
  ) : (
    <ImageFallback label={product.name} />
  );

  if (!enableLinks) {
    return (
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden lg:flex lg:w-[58%] lg:items-center lg:justify-center">
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
      className="absolute inset-y-0 right-0 z-0 hidden focus-visible:outline-none lg:flex lg:w-[58%] lg:items-center lg:justify-center"
    >
      {content}
    </Link>
  );
}

function AppleSupplyCard({
  category,
  enableLinks,
}: {
  category: NtmsSaleorCategory;
  enableLinks: boolean;
}) {
  const displayName = getCategoryDisplayName(category);
  const card = (
    <article className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-zinc-900/50 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:border-white/25 hover:bg-zinc-900/80">
      {/* Category Large Image Feature */}
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-white/[0.03] p-4 transition duration-500 group-hover:bg-white/[0.06]">
        {category.imageUrl ? (
          <img
            alt={category.imageAlt}
            className="max-h-full max-w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition duration-700 group-hover:scale-108"
            decoding="async"
            height={420}
            loading="lazy"
            src={category.imageUrl}
            width={420}
          />
        ) : (
          <ImageFallback label={category.name.slice(0, 2).toUpperCase()} />
        )}
        <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300 backdrop-blur-md">
          {category.productCount.toLocaleString()} items
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Collection
          </span>
          <h3 className="text-xl font-bold text-white group-hover:text-[color:var(--cyber-gold-soft)]">
            {displayName}
          </h3>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-zinc-300 transition group-hover:bg-white group-hover:text-black">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  );

  if (!enableLinks) return card;
  return (
    <Link
      to="/collections/$collection"
      params={{ collection: category.slug }}
      preload="intent"
      className="block focus-visible:outline-none"
    >
      {card}
    </Link>
  );
}

export function AppleProductCard({
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
      className="object-contain p-4 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-105"
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
      className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-zinc-900/40 p-4 shadow-lg backdrop-blur-xl transition-all duration-500 hover:border-white/25 hover:bg-zinc-900/80 sm:p-5"
      data-saleor-product-card
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white/[0.03] p-2 transition group-hover:bg-white/[0.06]">
        {enableLinks ? (
          <Link
            to="/product/$productId"
            params={{ productId: product.slug }}
            preload="intent"
            className="block h-full focus-visible:outline-none"
          >
            {media}
          </Link>
        ) : (
          media
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {product.categoryName}
          </span>
          {enableLinks ? (
            <Link
              to="/product/$productId"
              params={{ productId: product.slug }}
              preload="intent"
              className="mt-1 block focus-visible:outline-none"
            >
              <h3 className="line-clamp-2 text-sm font-bold text-white transition group-hover:text-[color:var(--cyber-gold-soft)]">
                {product.name}
              </h3>
            </Link>
          ) : (
            <h3 className="mt-1 line-clamp-2 text-sm font-bold text-white">
              {product.name}
            </h3>
          )}
        </div>

        <div className="mt-4 border-t border-white/[0.06] pt-3">
          <div className="flex items-center justify-between">
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
              className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/[0.06] px-3 text-xs font-bold text-white transition hover:bg-white hover:text-black active:scale-95"
              data-saleor-choose-options
            >
              Choose options
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : canAdd ? (
            <NtmsSaleorAddToCartButton
              className="mt-3 h-9 w-full rounded-full"
              label="Add to cart"
              variantId={product.variantId}
            />
          ) : enableLinks ? (
            <Link
              to="/product/$productId"
              params={{ productId: product.slug }}
              preload="intent"
              className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/[0.06] px-3 text-xs font-bold text-white transition hover:bg-white hover:text-black active:scale-95"
            >
              View details
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
        "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        quantityAvailable && quantityAvailable > 0
          ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-400"
          : "border border-amber-400/20 bg-amber-500/10 text-amber-400",
      )}
    >
      {quantityAvailable && quantityAvailable > 0 ? "In stock" : "Low Stock"}
    </span>
  );
}

function PriceLabel({
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
      <div className="flex items-center gap-2">
        <span className="text-sm font-extrabold text-white">
          {price ? formatSaleorMoney(price) : "Price pending"}
        </span>
        {discountPercent && priorPrice ? (
          <span className="text-xs text-zinc-500 line-through">
            {formatSaleorMoney(priorPrice)}
          </span>
        ) : null}
      </div>
      {discountPercent ? (
        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
          <BadgePercent className="h-3 w-3" />
          Save {discountPercent}%
        </span>
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
    <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs font-bold uppercase tracking-widest text-zinc-600">
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
