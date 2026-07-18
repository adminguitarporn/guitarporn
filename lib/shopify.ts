/**
 * Shopify Storefront API — powers the "From the shop" block on the homepage.
 *
 * Activates when BOTH env vars are set (see .env.example):
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN   e.g. guitarporn.myshopify.com
 *   SHOPIFY_STOREFRONT_TOKEN           Storefront API access token
 *
 * Until then, callers get null and render a fallback.
 */

export type ShopProduct = {
  id: string;
  title: string;
  url: string;
  imageUrl: string | null;
  price: string;
};

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN ?? "";

const QUERY = /* GraphQL */ `
  {
    products(first: 20, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
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
  onlineStoreUrl: string | null;
  featuredImage: { url: string } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Returns 5 random products from the store (re-shuffled every hour via ISR),
 * or null when Shopify isn't configured yet.
 */
export async function getFeaturedProducts(): Promise<ShopProduct[] | null> {
  if (!DOMAIN || !TOKEN) return null;

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
    if (!res.ok) return null;

    const json = (await res.json()) as {
      data?: { products?: { nodes?: ProductNode[] } };
    };
    const nodes = json.data?.products?.nodes ?? [];
    if (nodes.length === 0) return null;

    return shuffle(nodes)
      .slice(0, 5)
      .map((n) => {
        const { amount, currencyCode } = n.priceRange.minVariantPrice;
        return {
          id: n.id,
          title: n.title,
          url: n.onlineStoreUrl ?? `https://${DOMAIN}/products/${n.handle}`,
          imageUrl: n.featuredImage?.url ?? null,
          price: `${Number(amount).toLocaleString()} ${currencyCode}`,
        };
      });
  } catch {
    return null;
  }
}
