import { cache } from "react";

/**
 * Shopify Storefront API.
 *
 * Activates when BOTH env vars are set (see SETUP.md):
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN   e.g. guitarporn.myshopify.com
 *   SHOPIFY_STOREFRONT_TOKEN           Storefront API access token
 *
 * Until then, the shop page shows an upcoming-drop preview and a waitlist.
 * It does not invent prices or scarcity badges.
 */

export type ShopCategory = "Men" | "Women" | "Accessories" | "Gear";

export type ShopProduct = {
  id: string;
  title: string;
  url: string;
  imageUrl: string | null;
  price: string;
  category: ShopCategory | null;
};

export type ShopCatalog =
  | { status: "unconfigured" }
  | { status: "unavailable" }
  | { status: "ready"; products: ShopProduct[] };

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN ?? "";

const QUERY = /* GraphQL */ `
  {
    products(first: 50, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        productType
        tags
        onlineStoreUrl
        featuredImage {
          url
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

type ProductNode = {
  id: string;
  title: string;
  handle: string;
  productType: string;
  tags: string[];
  onlineStoreUrl: string | null;
  featuredImage: { url: string } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
};

const CATEGORIES: Record<string, ShopCategory> = {
  men: "Men",
  women: "Women",
  accessories: "Accessories",
  gear: "Gear",
};

function categoryFrom(productType: string, tags: string[]): ShopCategory | null {
  for (const candidate of [productType, ...tags]) {
    const match = CATEGORIES[candidate.trim().toLowerCase()];
    if (match) return match;
  }
  return null;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mapNode(node: ProductNode): ShopProduct {
  const { amount, currencyCode } = node.priceRange.minVariantPrice;
  return {
    id: node.id,
    title: node.title,
    url: node.onlineStoreUrl ?? `https://${DOMAIN}/products/${node.handle}`,
    imageUrl: node.featuredImage?.url ?? null,
    price: `${Number(amount).toLocaleString()} ${currencyCode}`,
    category: categoryFrom(node.productType, node.tags ?? []),
  };
}

/**
 * Live catalog when the Storefront API is configured.
 * `unconfigured` — missing domain or token.
 * `unavailable` — credentials are set but the request failed.
 * `ready` — the store answered, even if the product list is empty.
 */
export const getShopCatalog = cache(async (): Promise<ShopCatalog> => {
  if (!DOMAIN || !TOKEN) return { status: "unconfigured" };

  try {
    const res = await fetch(`https://${DOMAIN}/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({ query: QUERY }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { status: "unavailable" };

    const json = (await res.json()) as {
      data?: { products?: { nodes?: ProductNode[] } };
    };
    const nodes = json.data?.products?.nodes ?? [];
    return { status: "ready", products: nodes.map(mapNode) };
  } catch {
    return { status: "unavailable" };
  }
});

/**
 * Returns 5 random products from the store (re-shuffled every request;
 * the underlying Storefront response is cached for an hour),
 * or null when Shopify isn't configured or didn't answer.
 */
export async function getFeaturedProducts(): Promise<ShopProduct[] | null> {
  const catalog = await getShopCatalog();
  if (catalog.status !== "ready" || catalog.products.length === 0) return null;
  return shuffle(catalog.products).slice(0, 5);
}
