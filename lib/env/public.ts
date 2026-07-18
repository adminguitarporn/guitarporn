/**
 * Public env vars (safe for the browser). Add keys here as the app grows.
 */
export function getPublicEnv() {
  return {
    /** Set NEXT_PUBLIC_SHOPIFY_STORE_URL to your Shopify storefront URL
     *  (e.g. https://shop.guitarporn.club) to activate the shop banner. */
    shopifyStoreUrl: process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL ?? "",
  } as const;
}
