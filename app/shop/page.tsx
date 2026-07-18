import type { Metadata } from "next";
import { ShopPage } from "@/components/shop/shop-page";
import { getPublicEnv } from "@/lib/env/public";

export const metadata: Metadata = {
  title: "Shop",
  description: "Curated gear picks — guitars, amps, effects, and accessories we'd actually buy. No sponsored garbage.",
};

export default function Shop() {
  const { shopifyStoreUrl } = getPublicEnv();
  return <ShopPage shopUrl={shopifyStoreUrl} />;
}
