import { createServerFn } from "@tanstack/react-start";
import {
  getNtmsSaleorCatalogPreview,
  getNtmsSaleorCategoryPage,
  getNtmsSaleorProductPage,
  getNtmsSaleorSearchPage,
  type NtmsSaleorCatalogPreview,
  type NtmsSaleorCategoryPage,
  type NtmsSaleorProductPage,
  type NtmsSaleorSearchPage,
} from "@/lib/saleor/catalog";

export const getSaleorCatalogPreview = createServerFn({ method: "POST" })
  .validator(() => ({}))
  .handler(
    async (): Promise<NtmsSaleorCatalogPreview> =>
      getNtmsSaleorCatalogPreview(),
  );

export const getSaleorSearchPage = createServerFn({ method: "POST" })
  .validator(
    (data: { page?: number | string; query?: string; sort?: string }) => data,
  )
  .handler(
    async ({ data }): Promise<NtmsSaleorSearchPage> =>
      getNtmsSaleorSearchPage(data),
  );

export const getSaleorCategoryPage = createServerFn({ method: "POST" })
  .validator(
    (data: { collection?: string; page?: number | string; sort?: string }) =>
      data,
  )
  .handler(async ({ data }): Promise<NtmsSaleorCategoryPage | null> => {
    if (!data.collection) {
      return null;
    }

    return getNtmsSaleorCategoryPage(data.collection, {
      page: data.page,
      sort: data.sort,
    });
  });

export const getSaleorProductPage = createServerFn({ method: "POST" })
  .validator((data: { productId?: string }) => data)
  .handler(async ({ data }): Promise<NtmsSaleorProductPage | null> => {
    if (!data.productId) {
      return null;
    }

    return getNtmsSaleorProductPage(data.productId);
  });
