/**
 * Public env vars (safe for the browser). Add keys here as the app grows.
 */
export function getPublicEnv() {
  return {
    shopifyStoreUrl:
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL ??
      "https://guitarporn.example.com/shop",
  } as const;
}
