const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!domain || !token) {
    throw new Error("Missing Shopify environment variables");
  }

  const res = await fetch(`https://${domain}/api/2026-01/graphql.json`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (!res.ok || json.errors) {
    const detail = JSON.stringify(json.errors ?? { status: res.status });
    console.error("[shopifyFetch] error:", detail);
    throw new Error(`Shopify API request failed (${res.status}): ${detail}`);
  }

  return json;
}
