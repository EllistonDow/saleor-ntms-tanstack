import { describe, expect, it } from "vitest";
import { getNtmsSaleorNavigationCategories } from "./ntms-shell";

describe("getNtmsSaleorNavigationCategories", () => {
  it("uses backend category names in the agreed storefront order", () => {
    const categories = getNtmsSaleorNavigationCategories([
      { name: "Medical Supplies", slug: "ntms-89-medical" },
      { name: "Sale", slug: "ntms-452-sales" },
      { name: "Inks", slug: "ntms-91-inks" },
      { name: "Products", slug: "ntms-81-products" },
    ]);

    expect(categories.map((category) => category.label)).toEqual([
      "Inks",
      "Needles",
      "Machines",
      "Tubes & Grips",
      "Power Supplies & Cords",
      "Medical Supplies",
      "Shop Supply",
      "Papa",
      "Sale",
    ]);
  });

  it("has no all supplies menu fallback", () => {
    const categories = getNtmsSaleorNavigationCategories([]);

    expect(categories).toHaveLength(9);
    expect(
      categories.some((category) => /all supplies/i.test(category.label)),
    ).toBe(false);
  });
});
