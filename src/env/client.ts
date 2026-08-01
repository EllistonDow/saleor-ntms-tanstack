import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const clientEnv = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_COMPANY_NAME: z.string().min(1, "Company name is required"),
    VITE_TWITTER_CREATOR: z.string().min(1, "Twitter creator is required"),
    VITE_TWITTER_SITE: z.string().min(1, "Twitter site is required"),
    VITE_SITE_NAME: z.string().min(1, "Site name is required"),
    VITE_PARENT_ID: z.string("Parent Id missing"),
    VITE_WEBSITE_URL: z.string().optional(),
    VITE_SEARCH_INDEXING: z.enum(["enabled", "disabled"]).default("disabled"),
    VITE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    VITE_APP_BUILD_VERSION: z.string().optional(),
    VITE_STOREFRONT_BACKEND: z.enum(["vendure", "saleor"]).default("vendure"),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
