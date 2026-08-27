import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { NtmsSaleorCatalogPreview } from "@/lib/saleor/catalog";
import { cn } from "@/lib/utils";
import { NtmsSaleorAddToCartButton } from "./ntms-add-to-cart-button";

type NtmsSaleorProduct = NtmsSaleorCatalogPreview["products"][number];
type NtmsSaleorCategory = NtmsSaleorCatalogPreview["categories"][number];

const categoryDisplayNames = new Map([
  ["Products", "Studio Essentials"],
  ["Papa", "PAPA Professional"],
  ["Power Supplies & Cords", "Power Systems"],
  ["Tubes & Grips", "Grips & Tubes"],
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

const HERO_SHOWCASES = [
  {
    tag: "FLAGSHIP ROTARY",
    headline: "Precision. Redefined.",
    subhead: "Swiss Engineered Rotary Systems & Cordless Power",
    lead: "Aerospace aluminum housing. Zero-play eccentric drive. Continuous torque delivers effortless needle penetration across all skin types.",
    cta: "Explore Machines",
    href: "/collections/$collection" as const,
    params: { collection: "machines" },
    accent: "from-amber-200 via-yellow-400 to-amber-500",
  },
  {
    tag: "SURGICAL CARTRIDGES",
    headline: "Ultra-Tight. Flawless.",
    subhead: "Medical 316L Stainless Needles & Stabilizer Membrane",
    lead: "Micro-polished taper profiles paired with proprietary bounce-back silicone membranes for absolute needle stability and minimal skin trauma.",
    cta: "Shop Needles",
    href: "/collections/$collection" as const,
    params: { collection: "needles" },
    accent: "from-zinc-100 via-zinc-300 to-zinc-500",
  },
  {
    tag: "PURE PIGMENT FORMULAS",
    headline: "Deep Black. Permanent Tone.",
    subhead: "High Solid-Load Inks & Smooth Shading Gradients",
    lead: "Pre-dispersed carbon formulations delivering rich solid fills, lightning-fast skin healing, and decades-long jet black retention.",
    cta: "Shop Inks",
    href: "/collections/$collection" as const,
    params: { collection: "ntms-91-inks" },
    accent: "from-zinc-200 via-white to-zinc-400",
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
  const hero = HERO_SHOWCASES[activeSlide];

  const featuredProduct =
    catalog.products.find((p) => p.imageUrl) ?? catalog.products[0];
  const bento1 = catalog.products[0];
  const bento2 = catalog.products[1];
  const bento3 = catalog.products[2];
  const _bento4 = catalog.products[3];

  const categories = getHomeCategories(catalog.categories);
  const products = catalog.products.slice(0, 8);

  return (
    <main className="min-h-screen bg-[#000000] text-[#f5f5f7] antialiased selection:bg-white selection:text-black">
      {/* =========================================================================
          1. APPLE STAGE HERO: Frameless Immersive Canvas & Giant Clean Typography
      ========================================================================== */}
      <section className="relative isolate flex min-h-[86vh] flex-col justify-between overflow-hidden bg-[#000000] px-6 py-12 lg:min-h-[92vh] lg:px-12 lg:py-20">
        {/* Apple Atmospheric Studio Glow (Subtle pure optical lighting) */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[650px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-10 -z-10 h-[500px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(247,200,31,0.05),transparent_70%)] blur-3xl" />

        {/* Hero Huge Floating Hardware - Completely unconstrained, no box */}
        {featuredProduct ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[55%] items-center justify-center lg:flex">
            {featuredProduct.imageUrl ? (
              <img
                src={featuredProduct.imageUrl}
                alt={featuredProduct.imageAlt}
                className="max-h-[580px] w-full object-contain drop-shadow-[0_45px_90px_rgba(0,0,0,0.95)] transition-all duration-1000 lg:scale-110"
              />
            ) : null}
          </div>
        ) : null}

        {/* Top Minimalist Slide Switcher (Apple Segments) */}
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1 rounded-full bg-[#161617]/90 p-1 backdrop-blur-2xl">
              {HERO_SHOWCASES.map((item, idx) => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold tracking-tight transition-all duration-300",
                    idx === activeSlide
                      ? "bg-white text-black shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
                      : "text-[#86868b] hover:text-[#f5f5f7]",
                  )}
                >
                  {item.tag}
                </button>
              ))}
            </div>

            <div className="hidden items-center gap-2 text-xs font-medium text-[#86868b] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#30d158] animate-pulse" />
              {catalog.totalProducts.toLocaleString()} Studio Items in Stock
            </div>
          </div>

          {/* Apple Grand Pro Statement */}
          <div className="mt-16 max-w-2xl lg:mt-28">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#86868b]">
              {hero.subhead}
            </p>
            <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
              {hero.headline}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#a1a1a6] sm:text-xl">
              {hero.lead}
            </p>

            {/* Apple Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                to={hero.href}
                params={hero.params}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-black transition-transform duration-200 hover:bg-[#e8e8ed] active:scale-95"
              >
                {hero.cta}
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/search"
                className="inline-flex h-12 items-center justify-center gap-1.5 text-sm font-semibold text-[#2997ff] transition-colors hover:text-[#70baff]"
              >
                Browse all supplies
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Clean Specs Row */}
        <div className="relative z-10 mx-auto mt-16 w-full max-w-7xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                1,590+
              </p>
              <p className="mt-1 text-xs text-[#86868b]">Pro Tattoo Supplies</p>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                316L
              </p>
              <p className="mt-1 text-xs text-[#86868b]">Surgical Steel Spec</p>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                3:00 PM
              </p>
              <p className="mt-1 text-xs text-[#86868b]">Same-Day Dispatch</p>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Zero Play
              </p>
              <p className="mt-1 text-xs text-[#86868b]">
                Swiss Drive Tolerance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. APPLE BENTO SHOWCASE: Borderless Deep Graphite Glass Cards
      ========================================================================== */}
      {bento1 ? (
        <section className="bg-[#000000] py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#86868b]">
                  Take a closer look
                </p>
                <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                  Get the highlights.
                </h2>
              </div>
              <Link
                to="/search"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#2997ff] hover:underline"
              >
                View all hardware &rarr;
              </Link>
            </div>

            {/* Apple Borderless Bento Grid */}
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {/* Primary 2-Column Hero Card */}
              <div className="group relative flex min-h-[580px] flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#161617] p-8 shadow-2xl transition-all duration-500 hover:bg-[#1c1c1e] lg:col-span-2 lg:p-12">
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#86868b]">
                      {bento1.categoryName}
                    </span>
                    <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                      {bento1.name}
                    </h3>
                  </div>
                  <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-xl">
                    {bento1.price
                      ? formatSaleorMoney(bento1.price)
                      : "Pro Item"}
                  </span>
                </div>

                {/* Massive Frameless Floating Image (85%+ Area) */}
                <div className="relative z-0 my-6 flex min-h-[380px] flex-1 items-center justify-center sm:min-h-[440px]">
                  {bento1.imageUrl ? (
                    <img
                      src={bento1.imageUrl}
                      alt={bento1.imageAlt}
                      className="max-h-[420px] w-full object-contain drop-shadow-[0_40px_70px_rgba(0,0,0,0.9)] transition-transform duration-700 group-hover:scale-106 sm:max-h-[480px]"
                    />
                  ) : (
                    <ImageFallback label={bento1.name} />
                  )}
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#86868b]">
                    In stock • Ready for studio deployment
                  </span>
                  {enableLinks ? (
                    <Link
                      to="/product/$productId"
                      params={{ productId: bento1.slug }}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#2997ff] transition hover:text-[#70baff]"
                    >
                      Learn more &rarr;
                    </Link>
                  ) : null}
                </div>
              </div>

              {/* Right Column: 2 Stacked Cards */}
              <div className="flex flex-col gap-6">
                {bento2 ? (
                  <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#161617] p-8 shadow-xl transition-all duration-500 hover:bg-[#1c1c1e]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">
                          {bento2.categoryName}
                        </span>
                        <h4 className="mt-1 line-clamp-1 text-xl font-bold text-white">
                          {bento2.name}
                        </h4>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                        {bento2.price
                          ? formatSaleorMoney(bento2.price)
                          : "Pro Item"}
                      </span>
                    </div>

                    <div className="my-6 flex h-48 items-center justify-center">
                      {bento2.imageUrl ? (
                        <img
                          src={bento2.imageUrl}
                          alt={bento2.imageAlt}
                          className="max-h-44 w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-106"
                        />
                      ) : null}
                    </div>

                    {enableLinks ? (
                      <Link
                        to="/product/$productId"
                        params={{ productId: bento2.slug }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2997ff] hover:underline"
                      >
                        Learn more &rarr;
                      </Link>
                    ) : null}
                  </div>
                ) : null}

                {bento3 ? (
                  <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#161617] p-8 shadow-xl transition-all duration-500 hover:bg-[#1c1c1e]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">
                          {bento3.categoryName}
                        </span>
                        <h4 className="mt-1 line-clamp-1 text-xl font-bold text-white">
                          {bento3.name}
                        </h4>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                        {bento3.price
                          ? formatSaleorMoney(bento3.price)
                          : "Pro Item"}
                      </span>
                    </div>

                    <div className="my-6 flex h-48 items-center justify-center">
                      {bento3.imageUrl ? (
                        <img
                          src={bento3.imageUrl}
                          alt={bento3.imageAlt}
                          className="max-h-44 w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-106"
                        />
                      ) : null}
                    </div>

                    {enableLinks ? (
                      <Link
                        to="/product/$productId"
                        params={{ productId: bento3.slug }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2997ff] hover:underline"
                      >
                        Learn more &rarr;
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* =========================================================================
          3. APPLE CATEGORY LINEUP: Seamless Floating Tiles
      ========================================================================== */}
      <section className="bg-[#000000] py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#86868b]">
                Explore the lineup
              </p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                Find the right supply.
              </h2>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#2997ff] hover:underline"
            >
              Browse all categories &rarr;
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <AppleCleanCategoryCard
                key={cat.id}
                category={cat}
                enableLinks={enableLinks}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. APPLE PRODUCT GALLERY: Pure Frameless Floating Hardware Grid
      ========================================================================== */}
      <section className="bg-[#000000] py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#86868b]">
                Studio Staples
              </p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                Essential Studio Picks.
              </h2>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#2997ff] hover:underline"
            >
              Shop full catalog &rarr;
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <AppleCleanProductCard
                key={product.id}
                product={product}
                enableLinks={enableLinks}
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

function AppleCleanCategoryCard({
  category,
  enableLinks,
}: {
  category: NtmsSaleorCategory;
  enableLinks: boolean;
}) {
  const displayName = getCategoryDisplayName(category);
  const card = (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#161617] p-8 shadow-xl transition-all duration-500 hover:bg-[#1c1c1e]">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#86868b]">
          {category.productCount.toLocaleString()} Products
        </span>
        <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">
          {displayName}
        </h3>
      </div>

      {/* Floating Hardware Image (No inner white/gray box) */}
      <div className="my-8 flex aspect-square w-full items-center justify-center">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.imageAlt}
            className="max-h-[220px] w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] transition-transform duration-700 group-hover:scale-108"
            loading="lazy"
          />
        ) : (
          <ImageFallback label={category.name} />
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#2997ff] group-hover:underline">
          Explore collection &rarr;
        </span>
      </div>
    </article>
  );

  if (!enableLinks) return card;
  return (
    <Link
      to="/collections/$collection"
      params={{ collection: category.slug }}
      className="block focus-visible:outline-none"
    >
      {card}
    </Link>
  );
}

export function AppleCleanProductCard({
  product,
  enableLinks,
}: {
  product: NtmsSaleorProduct;
  enableLinks: boolean;
}) {
  const requiresVariantSelection = product.variantCount > 1;
  const canAdd =
    !requiresVariantSelection &&
    Boolean(product.variantId) &&
    Boolean(product.quantityAvailable && product.quantityAvailable > 0);

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#161617] p-6 shadow-lg transition-all duration-500 hover:bg-[#1c1c1e]">
      {/* Floating Product Image */}
      <div className="relative aspect-square w-full items-center justify-center p-2">
        {enableLinks ? (
          <Link
            to="/product/$productId"
            params={{ productId: product.slug }}
            className="flex h-full w-full items-center justify-center focus-visible:outline-none"
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.imageAlt}
                className="max-h-full max-w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-106"
                loading="lazy"
              />
            ) : (
              <ImageFallback label={product.name} />
            )}
          </Link>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.imageAlt}
                className="max-h-full max-w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
              />
            ) : (
              <ImageFallback label={product.name} />
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#86868b]">
            {product.categoryName}
          </span>
          <h4 className="mt-1 line-clamp-2 text-sm font-bold text-white">
            {product.name}
          </h4>
        </div>

        <div className="mt-4">
          <p className="text-base font-extrabold text-white">
            {product.price ? formatSaleorMoney(product.price) : "Pending"}
          </p>

          {requiresVariantSelection ? (
            <Link
              to="/product/$productId"
              params={{ productId: product.slug }}
              className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Choose Options
            </Link>
          ) : canAdd ? (
            <NtmsSaleorAddToCartButton
              className="mt-3 h-9 w-full rounded-full bg-white text-black font-semibold hover:bg-[#e8e8ed]"
              label="Add to Cart"
              variantId={product.variantId}
            />
          ) : enableLinks ? (
            <Link
              to="/product/$productId"
              params={{ productId: product.slug }}
              className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Details
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ImageFallback({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs font-bold uppercase tracking-widest text-[#515154]">
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

export function SaleorProductCard({
  product,
  enableLinks = false,
}: {
  product: NtmsSaleorCatalogPreview["products"][number];
  enableLinks?: boolean;
}) {
  const content = (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#161617] p-6 transition-all duration-500 hover:bg-[#1c1c1e] hover:shadow-2xl">
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
            {product.categoryName || "Hardware"}
          </span>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-[#2997ff]">
            {product.name}
          </h3>
        </div>
        <p className="text-sm font-semibold text-[#f5f5f7]">
          {product.priceFormatted}
        </p>
      </div>

      <div className="relative my-8 flex min-h-[220px] items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.imageAlt}
            className="max-h-[200px] w-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] transition-transform duration-700 group-hover:scale-108"
          />
        ) : (
          <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-[#000000]/40 text-xs text-[#86868b]">
            Studio Visual
          </div>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between pt-2">
        <span className="inline-flex items-center text-xs font-semibold text-[#2997ff] transition-transform duration-300 group-hover:translate-x-1">
          Explore hardware &rarr;
        </span>
        <NtmsSaleorAddToCartButton
          lines={[{ merchandiseId: product.id, quantity: 1 }]}
          className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-all duration-300 hover:bg-[#e8e8ed] hover:scale-105"
        />
      </div>
    </article>
  );

  if (enableLinks) {
    return (
      <Link
        to="/product/$handle"
        params={{ handle: product.slug }}
        className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-[#2997ff]"
      >
        {content}
      </Link>
    );
  }

  return content;
}
