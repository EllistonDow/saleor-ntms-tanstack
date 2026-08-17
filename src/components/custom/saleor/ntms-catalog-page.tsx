import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  BadgePercent,
  Boxes,
  Search,
} from "lucide-react";
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
  "Inks",
  "Needles",
  "Machines",
  "Tubes & Grips",
  "Power Supplies & Cords",
  "Medical",
  "Shop Supply",
  "Papa",
  "Sales",
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
  const featuredProduct =
    catalog.products.find((product) => product.imageUrl) ?? catalog.products[0];
  const categories = getHomeCategories(catalog.categories);
  const products = catalog.products.slice(0, 8);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative isolate min-h-[580px] overflow-hidden border-b border-[color:var(--cyber-gold)]/18 bg-black text-white lg:min-h-[660px]">
        {featuredProduct ? (
          <HeroProductMedia
            enableLinks={enableLinks}
            product={featuredProduct}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-0 w-full bg-black/65 lg:w-[48%]" />

        <div className="relative z-10 mx-auto flex min-h-[580px] max-w-screen-2xl items-end px-4 py-10 lg:min-h-[660px] lg:items-center lg:py-16">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase text-[color:var(--cyber-gold-soft)]">
              <BadgeCheck className="h-4 w-4" />
              Professional tattoo equipment
            </p>
            <h1 className="mt-5 text-5xl font-black leading-[1.02] text-white sm:text-6xl">
              Nuclear Tattoo Supply
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
              Equipment, pigments, needles, clinical essentials, and shop
              consumables for professional tattoo, PMU, and piercing studios.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/search"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[color:var(--cyber-gold)] px-5 text-sm font-black text-black transition hover:bg-[color:var(--cyber-gold-soft)]"
              >
                Browse supplies
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/collections/$collection"
                params={{ collection: "ntms-91-inks" }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 px-5 text-sm font-bold text-white transition hover:border-[color:var(--cyber-gold)] hover:text-[color:var(--cyber-gold-soft)]"
              >
                Shop inks
                <ArrowDownRight className="h-4 w-4" />
              </Link>
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
                value="SKU-level detail"
              />
              <CatalogSignal
                icon={<BadgeCheck className="h-4 w-4" />}
                label="Coverage"
                value="Tattoo, PMU, medical"
              />
            </div>
          </div>
        </div>
      </section>

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
    <article className="group grid min-h-[184px] grid-cols-[minmax(0,1fr)_132px] border-b border-r border-[color:var(--cyber-gold)]/14 bg-card transition hover:bg-background">
      <div className="flex min-w-0 flex-col p-4 sm:p-5">
        <p className="text-[10px] font-bold uppercase text-[color:var(--cyber-gold-soft)]">
          {category.productCount.toLocaleString()} supplies
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-tight text-foreground">
          {displayName}
        </h3>
        <span className="mt-auto inline-flex h-8 w-8 items-center justify-center rounded-md border border-[color:var(--cyber-gold)]/18 text-[color:var(--cyber-gold-soft)] transition group-hover:border-[color:var(--cyber-gold)] group-hover:bg-[color:var(--cyber-gold)] group-hover:text-black">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
      <div className="min-h-0 border-l border-[color:var(--cyber-gold)]/12 bg-white">
        {category.imageUrl ? (
          <img
            alt={category.imageAlt}
            className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.04]"
            decoding="async"
            height={384}
            loading="lazy"
            src={category.imageUrl}
            width={384}
          />
        ) : (
          <ImageFallback label={category.name.slice(0, 2).toUpperCase()} />
        )}
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
