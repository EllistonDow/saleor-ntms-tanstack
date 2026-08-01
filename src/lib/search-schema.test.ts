import { describe, expect, test } from "vitest";
import { defaultSort } from "./constants";
import { baseSearchSchema } from "./search-schema";

describe("storefront search parameters", () => {
  test("uses the default sort when the URL omits it", () => {
    expect(baseSearchSchema.parse({}).sort).toBe(defaultSort.slug);
  });

  test("falls back instead of rendering an error for an invalid sort", () => {
    expect(baseSearchSchema.parse({ sort: "featured" }).sort).toBe(
      defaultSort.slug,
    );
  });
});
