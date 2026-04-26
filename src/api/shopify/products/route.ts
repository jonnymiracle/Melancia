import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

export async function GET() {
  const query = `
    query Products {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            featuredImage {
              url
              altText
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch(query);
  return NextResponse.json(data);
}