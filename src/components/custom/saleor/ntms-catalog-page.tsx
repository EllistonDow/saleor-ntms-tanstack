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
    <main className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] antialiased selection:bg-[#0071e3] selection:text-white">
      {/* 1. APPLE STORE STAGE HERO: Clean Airy Canvas & Dominant Product Bleed */}
      <section className="relative isolate flex min-h-[82vh] flex-col justify-between overflow-hidden bg-gradient-to-b from-[#ffffff] via-[#fbfbfd] to-[#f5f5f7] px-6 py-10 lg:min-h-[88vh] lg:px-12 lg:py-16">
        {/* Soft Ambient Radial Floor Glare */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,113,227,0.06),transparent_70%)] blur-3xl" />

        {/* Giant Floating Product Hero (Natural Blend) */}
        {featuredProduct ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[55%] items-center justify-center lg:flex">
            {featuredProduct.imageUrl ? (
              <img
                src={featuredProduct.imageUrl}
                alt={featuredProduct.imageAlt}
                className="max-h-[560px] w-full object-contain mix-blend-multiply drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all duration-1000 lg:scale-105"
              />
            ) : null}
          </div>
        ) : null}

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          {/* Top Segmented Frosted Pill Control */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1 rounded-full bg-[#f5f5f7]/90 p-1.5 shadow-sm backdrop-blur-xl">
              {HERO_SHOWCASES.map((item, idx) => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold tracking-tight transition-all duration-300",
                    idx === activeSlide
                      ? "bg-white text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                      : "text-[#6e6e73] hover:text-[#1d1d1f]",
                  )}
                >
                  {item.tag}
                </button>
              ))}
            </div>

            <div className="hidden items-center gap-2 text-xs font-medium text-[#6e6e73] sm:flex">
              <span>Enterprise Tattoo Engineering</span>
              <span>&bull;</span>
              <span className="text-[#1d1d1f]">Direct Wholesale</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="mt-16 max-w-2xl lg:mt-24">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0071e3]">
              {hero.subhead}
            </p>
            <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-7xl lg:text-8xl">
              {hero.headline}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#515154] sm:text-xl">
              {hero.lead}
            </p>

            {/* Apple Action Links */}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              {enableLinks ? (
                <Link
                  to={hero.href}
                  params={hero.params}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0071e3] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,113,227,0.3)] transition-all duration-300 hover:scale-105 hover:bg-[#0077ed]"
                >
                  <span>{hero.cta}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0071e3] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#0077ed]"
                >
                  <span>{hero.cta}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}

              {enableLinks ? (
                <Link
                  to="/search"
                  className="text-sm font-semibold text-[#0066cc] hover:underline"
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
              <p className="text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl">
                {catalog.totalProducts > 0
                  ? `${catalog.totalProducts}+`
                  : "5,000+"}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#6e6e73]">
                In-Stock SKUs
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl">
                0.1V
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#6e6e73]">
                Voltage Precision
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl">
                100%
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#6e6e73]">
                EO Gas Sterilized
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl">
                Same-Day
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#6e6e73]">
                Studio Dispatch
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. APPLE BENTO SHOWCASE: Seamless Studio Light Cards */}
      {bento1 ? (
        <section className="bg-[#f5f5f7] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6e6e73]">
                Featured Hardware
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-5xl">
                Built for the highest standard.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {/* Giant Left Showcase Card */}
              <div className="group relative flex min-h-[580px] flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#ffffff] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] lg:col-span-2 lg:p-12">
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#6e6e73]">
                      {bento1.categoryName || "Flagship Hardware"}
                    </span>
                    <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-3xl">
                      {bento1.name}
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#f5f5f7] px-4 py-1.5 text-sm font-bold text-[#1d1d1f]">
                    {bento1.price
                      ? formatSaleorMoney(bento1.price)
                      : "Pro Item"}
                  </span>
                </div>

                {/* Seamless Floating Image (Zero White Patch borders) */}
                <div className="relative z-0 my-6 flex min-h-[380px] flex-1 items-center justify-center sm:min-h-[440px]">
                  {bento1.imageUrl ? (
                    <img
                      src={bento1.imageUrl}
                      alt={bento1.imageAlt}
                      className="max-h-[440px] w-full object-contain mix-blend-multiply drop-shadow-[0_25px_35px_rgba(0,0,0,0.07)] transition-transform duration-700 group-hover:scale-106 sm:max-h-[480px]"
                    />
                  ) : (
                    <div className="flex h-64 w-64 items-center justify-center rounded-3xl bg-[#f5f5f7] text-sm text-[#6e6e73]">
                      Studio Hardware Visual
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex items-center justify-between pt-4">
                  {enableLinks ? (
                    <Link
                      to="/product/$productId"
                      params={{ productId: bento1.slug }}
                      className="inline-flex items-center text-sm font-semibold text-[#0066cc] transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <span>Explore details</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-[#6e6e73]">
                      Engineered for professionals
                    </span>
                  )}
                  <NtmsSaleorAddToCartButton
                    variantId={bento1.variantId}
                    className="rounded-full bg-[#1d1d1f] px-6 py-2 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#333336]"
                  />
                </div>
              </div>

              {/* Right Stack: 2 Clean White Studio Cards */}
              <div className="flex flex-col gap-6">
                {bento2 ? (
                  <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#ffffff] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)]">
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                          {bento2.categoryName || "Power System"}
                        </span>
                        <h4 className="mt-1 text-xl font-bold tracking-tight text-[#1d1d1f]">
                          {bento2.name}
                        </h4>
                      </div>
                      <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-xs font-bold text-[#1d1d1f]">
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
                          className="max-h-[200px] w-full object-contain mix-blend-multiply drop-shadow-[0_15px_25px_rgba(0,0,0,0.06)] transition-transform duration-700 group-hover:scale-108"
                        />
                      ) : null}
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      {enableLinks ? (
                        <Link
                          to="/product/$productId"
                          params={{ productId: bento2.slug }}
                          className="text-xs font-semibold text-[#0066cc] hover:underline"
                        >
                          View hardware &rarr;
                        </Link>
                      ) : (
                        <span className="text-xs text-[#6e6e73]">
                          Studio standard
                        </span>
                      )}
                      <NtmsSaleorAddToCartButton
                        variantId={bento2.variantId}
                        className="rounded-full bg-[#1d1d1f] px-4 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#333336]"
                      />
                    </div>
                  </div>
                ) : null}

                {bento3 ? (
                  <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#ffffff] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)]">
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                          {bento3.categoryName || "Precision Supply"}
                        </span>
                        <h4 className="mt-1 text-xl font-bold tracking-tight text-[#1d1d1f]">
                          {bento3.name}
                        </h4>
                      </div>
                      <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-xs font-bold text-[#1d1d1f]">
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
                          className="max-h-[200px] w-full object-contain mix-blend-multiply drop-shadow-[0_15px_25px_rgba(0,0,0,0.06)] transition-transform duration-700 group-hover:scale-108"
                        />
                      ) : null}
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      {enableLinks ? (
                        <Link
                          to="/product/$productId"
                          params={{ productId: bento3.slug }}
                          className="text-xs font-semibold text-[#0066cc] hover:underline"
                        >
                          View hardware &rarr;
                        </Link>
                      ) : (
                        <span className="text-xs text-[#6e6e73]">
                          Studio standard
                        </span>
                      )}
                      <NtmsSaleorAddToCartButton
                        variantId={bento3.variantId}
                        className="rounded-full bg-[#1d1d1f] px-4 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#333336]"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 3. HARDWARE CATEGORY SECTORS: Apple Minimal Studio Cards */}
      <section className="bg-[#fbfbfd] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6e6e73]">
                Ecosystem
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl">
                Explore by Category.
              </h2>
            </div>
            {enableLinks ? (
              <Link
                to="/search"
                className="hidden text-sm font-semibold text-[#0066cc] hover:underline sm:inline-flex"
              >
                All categories &rarr;
              </Link>
            ) : null}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => {
              const label = categoryDisplayNames.get(cat.name) || cat.name;
              const content = (
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#ffffff] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.07)] hover:scale-[1.02]">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] transition-colors group-hover:text-[#0071e3]">
                      {label}
                    </h3>
                    <p className="mt-1 text-xs text-[#6e6e73]">
                      {cat.productCount > 0
                        ? `${cat.productCount} models`
                        : "Professional series"}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#0071e3] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Explore &rarr;
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f7] text-[#6e6e73] transition-colors group-hover:bg-[#0071e3] group-hover:text-white">
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
                    className="block outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
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

      {/* 4. CURATED HARDWARE GRID: Pure Studio Cards with Seamless Hardware View */}
      {products.length > 0 ? (
        <section className="bg-[#f5f5f7] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6e6e73]">
                  Precision Inventory
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl">
                  Latest Hardware Releases.
                </h2>
              </div>
              {enableLinks ? (
                <Link
                  to="/search"
                  className="text-sm font-semibold text-[#0066cc] hover:underline"
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
      <section className="bg-[#fbfbfd] pb-24 pt-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="rounded-[2.5rem] bg-[#ffffff] p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:p-16">
            <h3 className="text-2xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-3xl">
              Equipping Professional Tattoo Artists Nationwide.
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#515154]">
              Every machine, power system, and cartridge batch passes rigid
              quality verification before leaving our temperature-controlled
              distribution facility.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              {enableLinks ? (
                <Link
                  to="/search"
                  className="rounded-full bg-[#1d1d1f] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#333336]"
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
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#ffffff] p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1">
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
            {product.categoryName || "Hardware"}
          </span>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-[#1d1d1f] transition-colors group-hover:text-[#0071e3]">
            {product.name}
          </h3>
        </div>
        <p className="text-sm font-semibold text-[#1d1d1f]">
          {product.price ? formatSaleorMoney(product.price) : "Pro Item"}
        </p>
      </div>

      {/* Product Image Stage: seamless white blend with subtle floating elevation */}
      <div className="relative my-8 flex min-h-[220px] items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.imageAlt}
            className="max-h-[210px] w-full object-contain mix-blend-multiply drop-shadow-[0_15px_25px_rgba(0,0,0,0.08)] transition-transform duration-700 group-hover:scale-108"
          />
        ) : (
          <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-[#f5f5f7] text-xs text-[#6e6e73]">
            Studio Visual
          </div>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between pt-2">
        <span className="inline-flex items-center text-xs font-semibold text-[#0066cc] transition-transform duration-300 group-hover:translate-x-1">
          Explore hardware &rarr;
        </span>
        <NtmsSaleorAddToCartButton
          variantId={product.variantId}
          className="rounded-full bg-[#f5f5f7] px-4 py-1.5 text-xs font-semibold text-[#1d1d1f] transition-all duration-300 hover:bg-[#1d1d1f] hover:text-white hover:scale-105"
        />
      </div>
    </article>
  );

  if (enableLinks) {
    return (
      <Link
        to="/product/$productId"
        params={{ productId: product.slug }}
        className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
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
