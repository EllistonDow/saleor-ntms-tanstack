import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    VENDURE_SHOP_API_ENDPOINT: z.url("Must be a valid URL"),
    SALEOR_API_ENDPOINT: z
      .url("Must be a valid URL")
      .default("http://localhost:8000/graphql/"),
    SALEOR_CHANNEL: z.string().min(1).default("default-channel"),
    SALEOR_ROOT_CATEGORY_SLUG: z.string().min(1).default("__root__"),
    SALEOR_ALLOW_UNSAFE_PAYMENT_GATEWAYS: z
      .enum(["enabled", "disabled"])
      .default("disabled"),
    SALEOR_ENABLED_PAYMENT_GATEWAYS: z.string().default(""),
    NTMS_SALEOR_PRICING_URL: z.url("Must be a valid URL").optional(),
    NTMS_SALEOR_PRICING_SECRET: z.string().min(32).optional(),
    VITE_WEBSITE_URL: z.string().url().optional(),
    VITE_SEARCH_INDEXING: z.enum(["enabled", "disabled"]).default("disabled"),
    SESSION_SECRET: z
      .string()
      .min(32, "Session secret must be at least 32 characters"),
    VITE_APP_BUILD_VERSION: z.string().optional(),
    VITE_STOREFRONT_BACKEND: z.enum(["vendure", "saleor"]).default("vendure"),
    APP_SERVICE_NAME: z.string().min(1).default("saleor-ntms-tanstack"),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

// Helper functions to check environment
export const isDevelopment = serverEnv.NODE_ENV === "development";
export const isProduction = serverEnv.NODE_ENV === "production";
export const isTest = serverEnv.NODE_ENV === "test";
