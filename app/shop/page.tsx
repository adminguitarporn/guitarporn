import type { Metadata } from "next";
import { ShopPage } from "@/components/shop/shop-page";
import { getPublicEnv } from "@/lib/env/public";
import { pageMeta } from "@/lib/seo";
import { getShopCatalog } from "@/lib/shopify";

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getShopCatalog();
  const live = catalog.status === "ready" && catalog.products.length > 0;
  return pageMeta({
    title: "Shop",
    description: live
      ? "The GuitarPorn store — merch and gear from the connected Shopify shop."
      : "Upcoming GuitarPorn drop. A preview and a waitlist until the Shopify store is connected. No prices yet.",
    path: "/shop",
  });
}

export default async function Shop() {
  const { shopifyStoreUrl } = getPublicEnv();
  const catalog = await getShopCatalog();
  return <ShopPage shopUrl={shopifyStoreUrl} catalog={catalog} />;
}
