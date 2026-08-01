import { beforeEach, describe, expect, test, vi } from "vitest";
import { saleorFetch } from "@/lib/saleor";
import { getNtmsSaleorCategoryPage } from "./catalog";

vi.mock("@/lib/saleor", () => ({
  getSaleorChannel: () => "default-channel",
  getSaleorRootCategorySlug: () => "ntms-81-products",
  saleorFetch: vi.fn(),
}));

const mockedSaleorFetch = vi.mocked(saleorFetch);

describe("Saleor category catalog", () => {
  beforeEach(() => {
    mockedSaleorFetch.mockReset();
  });

  test("walks collection cursors to expose products beyond the first page", async () => {
    mockedSaleorFetch
      .mockResolvedValueOnce(
        categoryResponse({
          categoryCursor: "category-page-2",
          categoryHasNextPage: true,
          collectionCursor: "collection-page-2",
          collectionHasNextPage: true,
          productSlug: "first-page-product",
        }),
      )
      .mockResolvedValueOnce(
        categoryResponse({
          categoryCursor: null,
          categoryHasNextPage: false,
          collectionCursor: "collection-page-3",
          collectionHasNextPage: true,
          productSlug: "second-page-product",
        }),
      );

    const page = await getNtmsSaleorCategoryPage("ntms-103-machines", {
      page: "2",
      sort: "name-a-z",
    });

    expect(mockedSaleorFetch).toHaveBeenCalledTimes(2);
    expect(mockedSaleorFetch.mock.calls[1]?.[0].variables).toMatchObject({
      categoryAfter: "category-page-2",
      collectionAfter: "collection-page-2",
      first: 24,
    });
    expect(page).toMatchObject({
      hasNextPage: true,
      hasPreviousPage: true,
      page: 2,
      pageSize: 24,
      totalPages: 3,
      totalProducts: 50,
    });
    expect(page?.products.map((product) => product.slug)).toEqual([
      "second-page-product",
    ]);
  });
});

function categoryResponse({
  categoryCursor,
  categoryHasNextPage,
  collectionCursor,
  collectionHasNextPage,
  productSlug,
}: {
  categoryCursor: string | null;
  categoryHasNextPage: boolean;
  collectionCursor: string | null;
  collectionHasNextPage: boolean;
  productSlug: string;
}) {
  return {
    category: {
      id: "category-machines",
      name: "Machines",
      slug: "ntms-103-machines",
      children: { edges: [] },
      products: {
        totalCount: 3,
        pageInfo: {
          endCursor: categoryCursor,
          hasNextPage: categoryHasNextPage,
        },
        edges: [{ node: productNode(`category-${productSlug}`) }],
      },
    },
    collection: {
      id: "collection-machines",
      name: "Machines",
      slug: "ntms-103-machines",
      products: {
        totalCount: 50,
        pageInfo: {
          endCursor: collectionCursor,
          hasNextPage: collectionHasNextPage,
        },
        edges: [{ node: productNode(productSlug) }],
      },
    },
  };
}

function productNode(slug: string) {
  return {
    id: `product-${slug}`,
    name: slug,
    slug,
    variants: [
      {
        id: `variant-${slug}`,
        quantityAvailable: 10,
        sku: `SKU-${slug}`,
      },
    ],
  };
}
