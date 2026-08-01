import { defaultSort, type SortFilterItem, sorting } from "@/lib/constants";
import {
  getSaleorChannel,
  getSaleorRootCategorySlug,
  saleorFetch,
} from "@/lib/saleor";

type SaleorMoney = {
  amount: number;
  currency: string;
};

type SaleorVariantAttributeNode = {
  attribute?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  values?:
    | {
        id: string;
        name: string;
      }[]
    | null;
};

type SaleorVariantMediaNode = {
  alt?: string | null;
  type?: string | null;
  url: string;
};

type SaleorCategoryNode = {
  id: string;
  name: string;
  slug: string;
  products?: {
    totalCount?: number | null;
    edges?: {
      node: {
        name: string;
        thumbnail?: {
          url: string;
          alt?: string | null;
        } | null;
      };
    }[];
  } | null;
};

type SaleorProductNode = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  thumbnail?: {
    url: string;
    alt?: string | null;
  } | null;
  media?: {
    url: string;
    alt?: string | null;
    type?: string | null;
  }[];
  category?: {
    id: string;
    name: string;
    slug: string;
    products?: {
      totalCount?: number | null;
    } | null;
  } | null;
  pricing?: {
    priceRange?: {
      start?: {
        gross?: SaleorMoney | null;
      } | null;
    } | null;
  } | null;
  variants?: {
    id: string;
    name?: string | null;
    sku?: string | null;
    quantityAvailable?: number | null;
    pricing?: {
      price?: {
        gross?: SaleorMoney | null;
      } | null;
    } | null;
    attributes?: SaleorVariantAttributeNode[] | null;
    media?: SaleorVariantMediaNode[] | null;
  }[];
};

type NtmsSaleorCatalogResponse = {
  shop: {
    name: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
    products?: {
      totalCount?: number | null;
    } | null;
    children?: {
      edges: {
        node: SaleorCategoryNode;
      }[];
    } | null;
  } | null;
  categories?: {
    edges: {
      node: SaleorCategoryNode;
    }[];
  } | null;
  products?: {
    totalCount?: number | null;
    edges: {
      node: SaleorProductNode;
    }[];
  } | null;
  collections?: {
    edges: {
      node: SaleorCategoryNode;
    }[];
  } | null;
  curatedCollections?: {
    edges: {
      node: SaleorCategoryNode;
    }[];
  } | null;
};

type NtmsSaleorCategoryPageResponse = {
  category?: {
    id: string;
    name: string;
    slug: string;
    products?: {
      totalCount?: number | null;
      pageInfo: {
        hasNextPage: boolean;
        endCursor?: string | null;
      };
      edges: {
        node: SaleorProductNode;
      }[];
    } | null;
    children?: {
      edges: {
        node: SaleorCategoryNode;
      }[];
    } | null;
  } | null;
  collection?: {
    id: string;
    name: string;
    slug: string;
    products?: {
      totalCount?: number | null;
      pageInfo: {
        hasNextPage: boolean;
        endCursor?: string | null;
      };
      edges: {
        node: SaleorProductNode;
      }[];
    } | null;
  } | null;
};

type NtmsSaleorCategoryProductsConnection = NonNullable<
  NonNullable<NtmsSaleorCategoryPageResponse["category"]>["products"]
>;

type NtmsSaleorCategoryCollectionOverridesResponse = {
  collections?: {
    edges: {
      node: SaleorCategoryNode;
    }[];
  } | null;
};

type NtmsSaleorProductPageResponse = {
  product?: SaleorProductNode | null;
  products?: {
    edges: {
      node: SaleorProductNode;
    }[];
  } | null;
};

type NtmsSaleorProductsConnectionResponse = {
  products?: {
    totalCount?: number | null;
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string | null;
    };
    edges: {
      cursor: string;
      node: SaleorProductNode;
    }[];
  } | null;
};

type NtmsSaleorSitemapProductsResponse = {
  products?: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string | null;
    };
    edges: {
      node: {
        slug: string;
        category?: {
          slug: string;
        } | null;
      };
    }[];
  } | null;
};

type NtmsSaleorSortSlug = SortFilterItem["slug"];

type NtmsSaleorPageInput = number | string | null | undefined;

type NtmsSaleorSearchOptions = {
  page?: NtmsSaleorPageInput;
  query?: string;
  sort?: string;
};

type NtmsSaleorCategoryPageOptions = {
  page?: NtmsSaleorPageInput;
  sort?: string;
};

type SaleorProductOrder = {
  channel: string;
  direction: "ASC" | "DESC";
  field: "NAME" | "PRICE";
};

export type NtmsSaleorCategory = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  imageUrl: string;
  imageAlt: string;
};

export type NtmsSaleorProduct = {
  id: string;
  name: string;
  slug: string;
  variantId: string;
  variantCount: number;
  imageUrl: string;
  imageAlt: string;
  categoryName: string;
  price: SaleorMoney | null;
  sku: string;
  quantityAvailable: number | null;
};

export type NtmsSaleorProductMedia = {
  url: string;
  alt: string;
};

export type NtmsSaleorVariantAttributeValue = {
  id: string;
  name: string;
};

export type NtmsSaleorVariantAttribute = {
  id: string;
  name: string;
  slug: string;
  values: NtmsSaleorVariantAttributeValue[];
};

export type NtmsSaleorProductVariant = {
  id: string;
  name: string;
  sku: string;
  price: SaleorMoney | null;
  quantityAvailable: number | null;
  attributes: NtmsSaleorVariantAttribute[];
  media?: NtmsSaleorProductMedia[];
};

export type NtmsSaleorCatalogPreview = {
  shopName: string;
  channel: string;
  rootCategory: NtmsSaleorCategory | null;
  categories: NtmsSaleorCategory[];
  curatedCollections: NtmsSaleorCategory[];
  products: NtmsSaleorProduct[];
  totalProducts: number;
};

export type NtmsSaleorCategoryPage = {
  channel: string;
  category: NtmsSaleorCategory;
  children: NtmsSaleorCategory[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isCollectionOnly: boolean;
  page: number;
  pageSize: number;
  products: NtmsSaleorProduct[];
  sort: NtmsSaleorSortSlug;
  totalPages: number;
  totalProducts: number;
};

export type NtmsSaleorProductPage = {
  channel: string;
  product: NtmsSaleorProduct & {
    description: string;
    media: NtmsSaleorProductMedia[];
    variants: NtmsSaleorProductVariant[];
    category: NtmsSaleorCategory | null;
  };
  relatedProducts: NtmsSaleorProduct[];
};

export type NtmsSaleorSearchPage = {
  channel: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  pageSize: number;
  query: string;
  products: NtmsSaleorProduct[];
  sort: NtmsSaleorSortSlug;
  totalPages: number;
  totalProducts: number;
  searchedProducts: number;
};

export type NtmsSaleorSitemapEntry = {
  path: string;
};

const saleorProductsPageSize = 24;
const saleorMaxPage = 100;

const saleorProductOrderBySlug: Record<
  NtmsSaleorSortSlug,
  Omit<SaleorProductOrder, "channel">
> = {
  "name-a-z": { direction: "ASC", field: "NAME" },
  "name-z-a": { direction: "DESC", field: "NAME" },
  "price-asc": { direction: "ASC", field: "PRICE" },
  "price-desc": { direction: "DESC", field: "PRICE" },
};

const ntmsSaleorCatalogQuery = `
  query NtmsSaleorCatalogPreview($channel: String!, $rootSlug: String!) {
    shop { name }
    categories(first: 48, level: 0) {
      edges {
        node {
          id
          name
          slug
          products(first: 1, channel: $channel) {
            totalCount
            edges {
              node {
                name
                thumbnail(size: 384, format: WEBP) { url alt }
              }
            }
          }
        }
      }
    }
    category(slug: $rootSlug) {
      id
      name
      slug
      products(first: 0, channel: $channel) { totalCount }
      children(first: 24) {
        edges {
          node {
            id
            name
            slug
            products(first: 1, channel: $channel) {
              totalCount
              edges {
                node {
                  name
                  thumbnail(size: 384, format: WEBP) { url alt }
                }
              }
            }
          }
        }
      }
    }
    products(first: 12, channel: $channel) {
      totalCount
      edges {
        node {
          id
          name
          slug
          thumbnail(size: 512, format: WEBP) { url alt }
          category { name slug }
          pricing { priceRange { start { gross { amount currency } } } }
          variants { id sku quantityAvailable }
        }
      }
    }
    collections(first: 48, channel: $channel) {
      edges {
        node {
          id
          name
          slug
          products(first: 1) {
            totalCount
            edges {
              node {
                name
                thumbnail(size: 384, format: WEBP) { url alt }
              }
            }
          }
        }
      }
    }
    curatedCollections: collections(
      first: 12
      channel: $channel
      filter: { slugs: ["ntms-brand-eternal-ink", "ntms-brand-dermaglo-ink", "ntms-brand-fk-irons"] }
    ) {
      edges {
        node {
          id
          name
          slug
          products(first: 1) {
            totalCount
            edges {
              node {
                name
                thumbnail(size: 384, format: WEBP) { url alt }
              }
            }
          }
        }
      }
    }
  }
`;

const saleorProductBaseFields = `
  id
  name
  slug
  thumbnail(size: 512, format: WEBP) { url alt }
  category {
    id
    name
    slug
    products(first: 0, channel: $channel) { totalCount }
  }
  pricing { priceRange { start { gross { amount currency } } } }
`;

const saleorProductVariantFields = `
  id
  name
  sku
  quantityAvailable
  pricing { price { gross { amount currency } } }
`;

const saleorProductCardFields = `
  ${saleorProductBaseFields}
  variants { ${saleorProductVariantFields} }
`;

const saleorProductDetailFields = `
  ${saleorProductBaseFields}
  variants {
    ${saleorProductVariantFields}
    media { url alt type }
    attributes(variantSelection: ALL) {
      attribute { id name slug }
      values { id name }
    }
  }
`;

const ntmsSaleorCategoryPageQuery = `
  query NtmsSaleorCategoryPage(
    $categoryAfter: String
    $channel: String!
    $collectionAfter: String
    $first: Int!
    $slug: String!
    $sortBy: ProductOrder
  ) {
    category(slug: $slug) {
      id
      name
      slug
      products(first: $first, after: $categoryAfter, channel: $channel, sortBy: $sortBy) {
        totalCount
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            ${saleorProductCardFields}
          }
        }
      }
      children(first: 32) {
        edges {
          node {
            id
            name
            slug
            products(first: 1, channel: $channel) {
              totalCount
              edges {
                node {
                  name
                  thumbnail(size: 384, format: WEBP) { url alt }
                }
              }
            }
          }
        }
      }
    }
    collection(slug: $slug, channel: $channel) {
      id
      name
      slug
      products(first: $first, after: $collectionAfter, sortBy: $sortBy) {
        totalCount
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            ${saleorProductCardFields}
          }
        }
      }
    }
  }
`;

const ntmsSaleorCategoryCollectionOverridesQuery = `
  query NtmsSaleorCategoryCollectionOverrides($channel: String!, $slugs: [String!]!) {
    collections(
      first: 100
      channel: $channel
      filter: { slugs: $slugs }
    ) {
      edges {
        node {
          id
          name
          slug
          products(first: 1) {
            totalCount
            edges {
              node {
                name
                thumbnail(size: 384, format: WEBP) { url alt }
              }
            }
          }
        }
      }
    }
  }
`;

const ntmsSaleorProductPageQuery = `
  query NtmsSaleorProductPage($channel: String!, $slug: String!) {
    product(slug: $slug, channel: $channel) {
      ${saleorProductDetailFields}
      description
      media { url alt type }
    }
    products(first: 9, channel: $channel) {
      edges {
        node {
          ${saleorProductCardFields}
        }
      }
    }
  }
`;

const ntmsSaleorProductsConnectionQuery = `
  query NtmsSaleorProductsConnection(
    $after: String
    $channel: String!
    $first: Int!
    $search: String
    $sortBy: ProductOrder
  ) {
    products(
      first: $first
      after: $after
      channel: $channel
      search: $search
      sortBy: $sortBy
    ) {
      totalCount
      pageInfo { hasNextPage endCursor }
      edges {
        cursor
        node {
          ${saleorProductCardFields}
        }
      }
    }
  }
`;

const ntmsSaleorSitemapProductsQuery = `
  query NtmsSaleorSitemapProducts(
    $after: String
    $channel: String!
    $first: Int!
  ) {
    products(first: $first, after: $after, channel: $channel) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          slug
          category { slug }
        }
      }
    }
  }
`;

export async function getNtmsSaleorCatalogPreview(): Promise<NtmsSaleorCatalogPreview> {
  const channel = getSaleorChannel();
  const rootSlug = getSaleorRootCategorySlug();
  const data = await saleorFetch<
    NtmsSaleorCatalogResponse,
    { channel: string; rootSlug: string }
  >({
    query: ntmsSaleorCatalogQuery,
    variables: { channel, rootSlug },
  });

  const rootCategory = data.category ? mapCategory(data.category) : null;
  const collectionOverrides = new Map(
    (data.collections?.edges ?? []).map((edge) => [
      edge.node.slug,
      mapCategory(edge.node),
    ]),
  );
  const rootChildCategories = (data.category?.children?.edges ?? [])
    .map((edge) => mapCategory(edge.node))
    .map((category) =>
      applyCollectionOverride(category, collectionOverrides.get(category.slug)),
    )
    .filter((category) => category.productCount > 0)
    .sort((left, right) => right.productCount - left.productCount);
  const topLevelCategories = (data.categories?.edges ?? [])
    .map((edge) => mapCategory(edge.node))
    .map((category) =>
      applyCollectionOverride(category, collectionOverrides.get(category.slug)),
    )
    .filter(
      (category) =>
        category.productCount > 0 &&
        category.slug !== rootSlug &&
        category.slug !== "default-category",
    )
    .sort((left, right) => right.productCount - left.productCount);
  const categories =
    topLevelCategories.length > 0 ? topLevelCategories : rootChildCategories;

  return {
    shopName: data.shop.name,
    channel,
    rootCategory,
    categories,
    curatedCollections: (data.curatedCollections?.edges ?? [])
      .map((edge) => mapCategory(edge.node))
      .filter((collection) => collection.productCount > 0),
    products: (data.products?.edges ?? []).map((edge) => mapProduct(edge.node)),
    totalProducts: data.products?.totalCount ?? 0,
  };
}

export async function getNtmsSaleorCategoryPage(
  slug: string,
  options: NtmsSaleorCategoryPageOptions = {},
): Promise<NtmsSaleorCategoryPage | null> {
  const channel = getSaleorChannel();
  const requestedPage = normalizePage(options.page);
  const sort = getSaleorSortSlug(options.sort);
  const sortBy = getSaleorProductOrder(sort, channel);
  let categoryAfter: string | null = null;
  let collectionAfter: string | null = null;
  let currentPage = 1;
  let data: NtmsSaleorCategoryPageResponse | null = null;

  while (true) {
    data = await saleorFetch<
      NtmsSaleorCategoryPageResponse,
      {
        categoryAfter: string | null;
        channel: string;
        collectionAfter: string | null;
        first: number;
        slug: string;
        sortBy: SaleorProductOrder;
      }
    >({
      query: ntmsSaleorCategoryPageQuery,
      variables: {
        categoryAfter,
        channel,
        collectionAfter,
        first: saleorProductsPageSize,
        slug,
        sortBy,
      },
    });

    const categoryConnection: NtmsSaleorCategoryProductsConnection | null =
      data.category?.products ?? null;
    const collectionConnection: NtmsSaleorCategoryProductsConnection | null =
      data.collection?.products ?? null;
    const useCollection =
      (collectionConnection?.totalCount ?? 0) >
      (categoryConnection?.totalCount ?? 0);
    const preferredConnection = useCollection
      ? collectionConnection
      : categoryConnection;

    if (
      currentPage >= requestedPage ||
      !preferredConnection?.pageInfo.hasNextPage
    ) {
      break;
    }

    if (categoryConnection?.pageInfo.hasNextPage) {
      categoryAfter = categoryConnection.pageInfo.endCursor ?? null;
    }
    if (collectionConnection?.pageInfo.hasNextPage) {
      collectionAfter = collectionConnection.pageInfo.endCursor ?? null;
    }

    const preferredAfter = useCollection ? collectionAfter : categoryAfter;
    if (!preferredAfter) {
      break;
    }

    currentPage += 1;
  }

  if (!data || (!data.category && !data.collection)) {
    return null;
  }

  const collectionOverride = data.collection
    ? mapCategory(data.collection)
    : null;
  const categoryBase = data.category
    ? mapCategory(data.category)
    : collectionOverride;
  if (!categoryBase) {
    return null;
  }

  const category = data.category
    ? applyCollectionOverride(categoryBase, collectionOverride)
    : categoryBase;
  const childSlugs =
    data.category?.children?.edges.map((edge) => edge.node.slug) ?? [];
  const collectionOverrideData = childSlugs.length
    ? await saleorFetch<
        NtmsSaleorCategoryCollectionOverridesResponse,
        { channel: string; slugs: string[] }
      >({
        query: ntmsSaleorCategoryCollectionOverridesQuery,
        variables: { channel, slugs: childSlugs },
      })
    : null;
  const collectionOverrides = new Map(
    (collectionOverrideData?.collections?.edges ?? []).map((edge) => [
      edge.node.slug,
      mapCategory(edge.node),
    ]),
  );
  const children = (data.category?.children?.edges ?? [])
    .map((edge) =>
      applyCollectionOverride(
        mapCategory(edge.node),
        collectionOverrides.get(edge.node.slug),
      ),
    )
    .filter((child) => child.productCount > 0)
    .sort((left, right) => right.productCount - left.productCount);
  const categoryDirectTotal = data.category?.products?.totalCount ?? 0;
  const collectionTotal = collectionOverride?.productCount ?? 0;
  const collectionProducts =
    data.collection?.products?.edges.map((edge) => mapProduct(edge.node)) ?? [];
  const categoryProducts = (data.category?.products?.edges ?? []).map((edge) =>
    mapProduct(edge.node),
  );
  const products =
    collectionTotal > categoryDirectTotal
      ? collectionProducts
      : categoryProducts;
  const selectedConnection =
    collectionTotal > categoryDirectTotal
      ? data.collection?.products
      : data.category?.products;
  const totalProducts = Math.max(collectionTotal, categoryDirectTotal);
  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts / saleorProductsPageSize),
  );
  const page = totalProducts === 0 ? 1 : Math.min(currentPage, totalPages);

  return {
    channel,
    category,
    children,
    hasNextPage: selectedConnection?.pageInfo.hasNextPage ?? false,
    hasPreviousPage: page > 1,
    isCollectionOnly: !data.category,
    page,
    pageSize: saleorProductsPageSize,
    products,
    sort,
    totalPages,
    totalProducts,
  };
}

export async function getNtmsSaleorProductPage(
  slug: string,
): Promise<NtmsSaleorProductPage | null> {
  const channel = getSaleorChannel();
  const data = await saleorFetch<
    NtmsSaleorProductPageResponse,
    { channel: string; slug: string }
  >({
    query: ntmsSaleorProductPageQuery,
    variables: { channel, slug },
  });

  if (!data.product) {
    return null;
  }

  const product = data.product;
  const relatedProducts = (data.products?.edges ?? [])
    .map((edge) => mapProduct(edge.node))
    .filter((item) => item.slug !== product.slug)
    .slice(0, 8);

  return {
    channel,
    product: {
      ...mapProduct(product),
      description: parseSaleorDescription(product.description),
      media: mapProductMedia(product),
      variants: mapProductVariants(product),
      category: product.category ? mapCategory(product.category) : null,
    },
    relatedProducts,
  };
}

export async function getNtmsSaleorSearchPage(
  options: NtmsSaleorSearchOptions | string | undefined,
): Promise<NtmsSaleorSearchPage> {
  const channel = getSaleorChannel();
  const searchOptions =
    typeof options === "string" ? { query: options } : (options ?? {});
  const searchQuery = normalizeSearchQuery(searchOptions.query);
  const requestedPage = normalizePage(searchOptions.page);
  const sort = getSaleorSortSlug(searchOptions.sort);
  const sortBy = getSaleorProductOrder(sort, channel);
  let connection: NtmsSaleorProductsConnectionResponse["products"] = null;
  let currentPage = 1;
  let totalProducts = 0;
  let after: string | null = null;

  while (true) {
    const data: NtmsSaleorProductsConnectionResponse = await saleorFetch<
      NtmsSaleorProductsConnectionResponse,
      {
        after: string | null;
        channel: string;
        first: number;
        search: string | null;
        sortBy: SaleorProductOrder;
      }
    >({
      query: ntmsSaleorProductsConnectionQuery,
      variables: {
        after,
        channel,
        first: saleorProductsPageSize,
        search: searchQuery || null,
        sortBy,
      },
    });

    connection = data.products;
    if (!connection) {
      break;
    }

    totalProducts = connection.totalCount ?? totalProducts;
    if (currentPage >= requestedPage || !connection.pageInfo.hasNextPage) {
      break;
    }

    after = connection.pageInfo.endCursor ?? null;
    if (!after) {
      break;
    }

    currentPage += 1;
  }

  const products = (connection?.edges ?? []).map((edge) =>
    mapProduct(edge.node),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts / saleorProductsPageSize),
  );
  const page = totalProducts === 0 ? 1 : Math.min(currentPage, totalPages);

  return {
    channel,
    hasNextPage: connection?.pageInfo.hasNextPage ?? false,
    hasPreviousPage: page > 1,
    page,
    pageSize: saleorProductsPageSize,
    query: searchQuery,
    products,
    sort,
    totalPages,
    totalProducts,
    searchedProducts: totalProducts,
  };
}

export async function getNtmsSaleorSitemapEntries(): Promise<
  NtmsSaleorSitemapEntry[]
> {
  const channel = getSaleorChannel();
  const paths = new Set<string>(["/"]);
  const curatedCollections = await saleorFetch<
    {
      collections?: {
        edges: {
          node: {
            slug: string;
            products?: { totalCount?: number | null } | null;
          };
        }[];
      } | null;
    },
    { channel: string }
  >({
    query: `query NtmsSaleorCuratedCollectionSitemap($channel: String!) {
      collections(
        first: 100
        channel: $channel
        filter: { slugs: ["ntms-brand-eternal-ink", "ntms-brand-dermaglo-ink", "ntms-brand-fk-irons"] }
      ) {
        edges { node { slug products(first: 0) { totalCount } } }
      }
    }`,
    variables: { channel },
  });
  for (const edge of curatedCollections.collections?.edges ?? []) {
    if ((edge.node.products?.totalCount ?? 0) > 0) {
      paths.add(`/collections/${edge.node.slug}`);
    }
  }
  let after: string | null = null;

  for (let page = 0; page < 250; page += 1) {
    const data: NtmsSaleorSitemapProductsResponse = await saleorFetch<
      NtmsSaleorSitemapProductsResponse,
      { after: string | null; channel: string; first: number }
    >({
      query: ntmsSaleorSitemapProductsQuery,
      variables: {
        after,
        channel,
        first: 100,
      },
    });
    const connection: NtmsSaleorSitemapProductsResponse["products"] =
      data.products;

    if (!connection) {
      break;
    }

    for (const edge of connection.edges) {
      const productSlug = edge.node.slug.trim();
      const categorySlug = edge.node.category?.slug?.trim();

      if (categorySlug) {
        paths.add(`/collections/${categorySlug}`);
      }
      if (productSlug) {
        paths.add(`/product/${productSlug}`);
      }
    }

    if (!connection.pageInfo.hasNextPage) {
      break;
    }

    after = connection.pageInfo.endCursor ?? null;
    if (!after) {
      break;
    }
  }

  return [...paths]
    .sort((left, right) => left.localeCompare(right))
    .map((path) => ({ path }));
}

function mapCategory(category: SaleorCategoryNode): NtmsSaleorCategory {
  const leadProduct = category.products?.edges?.[0]?.node;

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    productCount: category.products?.totalCount ?? 0,
    imageUrl: leadProduct?.thumbnail?.url ?? "",
    imageAlt: leadProduct?.thumbnail?.alt || leadProduct?.name || category.name,
  };
}

function applyCollectionOverride(
  category: NtmsSaleorCategory,
  collection: NtmsSaleorCategory | null | undefined,
): NtmsSaleorCategory {
  if (!collection || collection.productCount <= category.productCount) {
    return category;
  }

  return {
    ...category,
    productCount: collection.productCount,
    imageUrl: collection.imageUrl || category.imageUrl,
    imageAlt: collection.imageAlt || category.imageAlt,
  };
}

function mapProduct(product: SaleorProductNode): NtmsSaleorProduct {
  const firstVariant = product.variants?.[0];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    variantId: firstVariant?.id ?? "",
    variantCount: product.variants?.length ?? 0,
    imageUrl: product.thumbnail?.url ?? "",
    imageAlt: product.thumbnail?.alt || product.name,
    categoryName: product.category?.name ?? "Tattoo supply",
    price: product.pricing?.priceRange?.start?.gross ?? null,
    sku: firstVariant?.sku ?? "",
    quantityAvailable: firstVariant?.quantityAvailable ?? null,
  };
}

function mapProductMedia(product: SaleorProductNode): NtmsSaleorProductMedia[] {
  const media = (product.media ?? [])
    .filter((item) => item.type === "IMAGE" && item.url)
    .map((item) => ({
      url: item.url,
      alt: item.alt || product.name,
    }));

  if (media.length > 0) {
    return media;
  }

  return product.thumbnail?.url
    ? [
        {
          url: product.thumbnail.url,
          alt: product.thumbnail.alt || product.name,
        },
      ]
    : [];
}

function mapProductVariants(
  product: SaleorProductNode,
): NtmsSaleorProductVariant[] {
  return (product.variants ?? []).map((variant) => ({
    id: variant.id,
    name: variant.name || product.name,
    sku: variant.sku ?? "",
    price: variant.pricing?.price?.gross ?? null,
    quantityAvailable: variant.quantityAvailable ?? null,
    media: (variant.media ?? [])
      .filter((media) => media.type === "IMAGE" && media.url)
      .map((media) => ({
        url: media.url,
        alt: media.alt || variant.name || product.name,
      })),
    attributes: (variant.attributes ?? []).flatMap((assignment) => {
      const attribute = assignment.attribute;
      const values = assignment.values ?? [];
      if (!attribute || values.length === 0) {
        return [];
      }
      return [
        {
          id: attribute.id,
          name: attribute.name,
          slug: attribute.slug,
          values: values.map((value) => ({ id: value.id, name: value.name })),
        },
      ];
    }),
  }));
}

function parseSaleorDescription(description: string | null | undefined) {
  if (!description) {
    return "";
  }

  try {
    const parsed = JSON.parse(description) as {
      blocks?: {
        data?: {
          text?: string;
        };
      }[];
    };

    const text = parsed.blocks
      ?.map((block) => block.data?.text ?? "")
      .filter(Boolean)
      .join("\n\n");

    return stripHtml(text || description);
  } catch {
    return stripHtml(description);
  }
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearchQuery(query: string | undefined) {
  return (query ?? "").trim();
}

function normalizePage(page: NtmsSaleorPageInput) {
  const pageNumber =
    typeof page === "number" ? page : Number((page ?? "").toString().trim());

  if (!Number.isFinite(pageNumber) || pageNumber < 1) {
    return 1;
  }

  return Math.min(Math.floor(pageNumber), saleorMaxPage);
}

function getSaleorSortSlug(sort: string | undefined): NtmsSaleorSortSlug {
  return (sorting.find((item) => item.slug === sort) ?? defaultSort).slug;
}

function getSaleorProductOrder(
  sort: NtmsSaleorSortSlug,
  channel: string,
): SaleorProductOrder {
  return {
    ...saleorProductOrderBySlug[sort],
    channel,
  };
}
