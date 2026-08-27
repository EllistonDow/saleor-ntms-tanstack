import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type {
  NtmsSaleorCatalogPreview,
  NtmsSaleorProduct,
} from "@/lib/saleor/catalog";
import { cn } from "@/lib/utils";
import { NtmsSaleorAddToCartButton } from "./ntms-add-to-cart-button";

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
    tag: "PRO ROTARY",
    subhead: "The New Benchmark",
    headline: "Precision. Raw Power.",
    lead: "Engineered from aerospace-grade alloy with zero-tolerance coreless drive. Consistent torque throughout 10-hour sessions.",
    cta: "Explore Rotary Machines",
    href: "/collections/$collection" as const,
    params: { collection: "machines" },
  },
  {
    tag: "WIRELESS POWER",
    subhead: "Total Ergonomic Freedom",
    headline: "Pure Untethered Voltage.",
    lead: "Ultra-compact high-density lithium power packs delivering stable 0.1V adjustments and digital telemetry on an OLED lens.",
    cta: "Explore Power Systems",
    href: "/collections/$collection" as const,
    params: { collection: "power-supplies-cords" },
  },
  {
    tag: "TITANIUM NEEDLES",
    subhead: "Micro-Surgical Tolerance",
    headline: "Engineered Ink Flow.",
    lead: "Medical 316L surgical steel membrane cartridges crafted for ultra-clean saturation and zero backflow trauma.",
    cta: "Explore Cartridges",
    href: "/collections/$collection" as const,
    params: { collection: "needles" },
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

  const categories = getHomeCategories(catalog.categories);
  const products = catalog.products.slice(0, 8);

  return (
    <main className="min-h-screen bg-[#000000] text-[#f5f5f7] antialiased selection:bg-white selection:text-black">
      {/* 1. APPLE STAGE HERO: Frameless Immersive Canvas & Giant Clean Typography */}
      <section className="relative isolate flex min-h-[86vh] flex-col justify-between overflow-hidden bg-[#000000] px-6 py-12 lg:min-h-[92vh] lg:px-12 lg:py-20">
        {/* Soft Ambient Studio Spotlight */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[650px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)] blur-3xl" />

        {/* Giant Floating Product Hero (Right Bleed) */}
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

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          {/* Top Segmented Frosted Pill Control */}
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
              <span>Enterprise Tattoo Engineering</span>
              <span>&bull;</span>
              <span className="text-[#f5f5f7]">Direct Wholesale</span>
            </div>
          </div>

          {/* Hero Headlines */}
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

            {/* Clean Apple Action Links */}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              {enableLinks ? (
                <Link
                  to={hero.href}
                  params={hero.params}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-[0_4px_20px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:bg-[#e8e8ed]"
                >
                  <span>{hero.cta}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#e8e8ed]"
                >
                  <span>{hero.cta}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}

              {enableLinks ? (
                <Link
                  to="/search"
                  className="text-sm font-semibold text-[#2997ff] hover:underline"
                >
                  Search all studio hardware &rarr;
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom Hardware Metrics Bar */}
        <div className="relative z-10 mx-auto mt-16 w-full max-w-7xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {catalog.totalProducts > 0
                  ? `${catalog.totalProducts}+`
                  : "5,000+"}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#86868b]">
                In-Stock SKUs
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                0.1V
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#86868b]">
                Voltage Precision
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                100%
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#86868b]">
                EO Gas Sterilized
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Same-Day
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#86868b]">
                Studio Dispatch
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. APPLE BENTO SHOWCASE: Borderless Deep Graphite Glass Cards */}
      {bento1 ? (
        <section className="bg-[#000000] py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#86868b]">
                Featured Hardware
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Built for the highest standard.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {/* Giant Left Showcase Card */}
              <div className="group relative flex min-h-[580px] flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#161617] p-8 shadow-2xl transition-all duration-500 hover:bg-[#1c1c1e] lg:col-span-2 lg:p-12">
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#86868b]">
                      {bento1.categoryName || "Flagship Hardware"}
                    </span>
                    <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
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
                    <div className="flex h-64 w-64 items-center justify-center rounded-3xl bg-[#000000]/50 text-sm text-[#86868b]">
                      Studio Showcase Visual
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex items-center justify-between pt-4">
                  {enableLinks ? (
                    <Link
                      to="/product/$productId"
                      params={{ productId: bento1.slug }}
                      className="inline-flex items-center text-sm font-semibold text-[#2997ff] transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <span>Explore details</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-[#86868b]">
                      Engineered for professionals
                    </span>
                  )}
                  <NtmsSaleorAddToCartButton
                    variantId={bento1.variantId}
                    className="rounded-full bg-white px-6 py-2 text-xs font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-[#e8e8ed]"
                  />
                </div>
              </div>

              {/* Right Stack: 2 Refined Graphite Cards */}
              <div className="flex flex-col gap-6">
                {bento2 ? (
                  <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#161617] p-8 shadow-xl transition-all duration-500 hover:bg-[#1c1c1e]">
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
                          {bento2.categoryName || "Power System"}
                        </span>
                        <h4 className="mt-1 text-xl font-bold tracking-tight text-white">
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
                          className="max-h-[190px] w-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] transition-transform duration-700 group-hover:scale-108"
                        />
                      ) : null}
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      {enableLinks ? (
                        <Link
                          to="/product/$productId"
                          params={{ productId: bento2.slug }}
                          className="text-xs font-semibold text-[#2997ff] hover:underline"
                        >
                          View hardware &rarr;
                        </Link>
                      ) : (
                        <span className="text-xs text-[#86868b]">
                          Studio standard
                        </span>
                      )}
                      <NtmsSaleorAddToCartButton
                        variantId={bento2.variantId}
                        className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-[#e8e8ed]"
                      />
                    </div>
                  </div>
                ) : null}

                {bento3 ? (
                  <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#161617] p-8 shadow-xl transition-all duration-500 hover:bg-[#1c1c1e]">
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
                          {bento3.categoryName || "Precision Supply"}
                        </span>
                        <h4 className="mt-1 text-xl font-bold tracking-tight text-white">
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
                          className="max-h-[190px] w-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] transition-transform duration-700 group-hover:scale-108"
                        />
                      ) : null}
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      {enableLinks ? (
                        <Link
                          to="/product/$productId"
                          params={{ productId: bento3.slug }}
                          className="text-xs font-semibold text-[#2997ff] hover:underline"
                        >
                          View hardware &rarr;
                        </Link>
                      ) : (
                        <span className="text-xs text-[#86868b]">
                          Studio standard
                        </span>
                      )}
                      <NtmsSaleorAddToCartButton
                        variantId={bento3.variantId}
                        className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-[#e8e8ed]"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 3. HARDWARE CATEGORY SECTORS: Apple Minimal Pill Cards */}
      <section className="bg-[#000000] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#86868b]">
                Ecosystem
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Explore by Category.
              </h2>
            </div>
            {enableLinks ? (
              <Link
                to="/search"
                className="hidden text-sm font-semibold text-[#2997ff] hover:underline sm:inline-flex"
              >
                All categories &rarr;
              </Link>
            ) : null}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => {
              const label = categoryDisplayNames.get(cat.name) || cat.name;
              const content = (
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#161617] p-6 transition-all duration-300 hover:bg-[#1c1c1e] hover:scale-[1.02]">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-[#2997ff]">
                      {label}
                    </h3>
                    <p className="mt-1 text-xs text-[#86868b]">
                      {cat.productCount > 0
                        ? `${cat.productCount} models`
                        : "Professional series"}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2997ff] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Explore &rarr;
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[#86868b] transition-colors group-hover:bg-white group-hover:text-black">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );

              if (enableLinks) {
                return (
                  <Link
                    key={cat.id}
                    to="/collections/$collection"
                    params={{ collection: cat.slug }}
                    className="block outline-none focus-visible:ring-2 focus-visible:ring-[#2997ff]"
                  >
                    {content}
                  </Link>
                );
              }

              return <div key={cat.id}>{content}</div>;
            })}
          </div>
        </div>
      </section>

      {/* 4. CURATED HARDWARE GRID: Borderless Graphite Cards with Dominant Hardware View */}
      {products.length > 0 ? (
        <section className="bg-[#000000] py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#86868b]">
                  Precision Inventory
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Latest Hardware Releases.
                </h2>
              </div>
              {enableLinks ? (
                <Link
                  to="/search"
                  className="text-sm font-semibold text-[#2997ff] hover:underline"
                >
                  Browse all {catalog.totalProducts} items &rarr;
                </Link>
              ) : null}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((item) => (
                <SaleorProductCard
                  key={item.id}
                  product={item}
                  enableLinks={enableLinks}
                  priority={false}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 5. STUDIO PROMISE FOOTNOTE */}
      <section className="bg-[#000000] pb-24 pt-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="rounded-[2.5rem] bg-[#161617] p-8 text-center sm:p-16">
            <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Equipping Professional Tattoo Artists Nationwide.
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#a1a1a6]">
              Every machine, power system, and cartridge batch passes rigid
              quality verification before leaving our temperature-controlled
              distribution facility.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              {enableLinks ? (
                <Link
                  to="/search"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-[#e8e8ed]"
                >
                  Open Studio Catalog
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function SaleorProductCard({
  product,
  enableLinks = false,
}: {
  product: NtmsSaleorProduct;
  enableLinks?: boolean;
  priority?: boolean;
}) {
  const content = (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#161617] p-6 transition-all duration-500 hover:bg-[#1c1c1e] hover:shadow-2xl">
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
            {product.categoryName || "Hardware"}
          </span>
          <h3 className="mt-1 text-base font-bold tracking-tight text-white transition-colors group-hover:text-[#2997ff]">
            {product.name}
          </h3>
        </div>
        <p className="text-sm font-semibold text-[#f5f5f7]">
          {product.price ? formatSaleorMoney(product.price) : "Pro Item"}
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
          variantId={product.variantId}
          className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-all duration-300 hover:bg-[#e8e8ed] hover:scale-105"
        />
      </div>
    </article>
  );

  if (enableLinks) {
    return (
      <Link
        to="/product/$productId"
        params={{ productId: product.slug }}
        className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-[#2997ff]"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export function getHomeCategories(categories: NtmsSaleorCategory[]) {
  const byName = new Map(categories.map((c) => [c.name, c]));
  const ordered: NtmsSaleorCategory[] = [];

  for (const name of categoryPriority) {
    const found = byName.get(name);
    if (found) {
      ordered.push(found);
      byName.delete(name);
    }
  }

  for (const remaining of byName.values()) {
    if (remaining.name !== "Products") {
      ordered.push(remaining);
    }
  }

  return ordered;
}

function formatSaleorMoney(price: { amount: number; currency: string }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency || "USD",
  }).format(price.amount);
}
