import Image from "next/image";
import BuyNowButton from "@/components/BuyNowButton";

type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
};

type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
};

type ProductCardProps = {
  product: ShopifyProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  const variant = product.variants.edges[0]?.node;

  return (
    <article>
      {product.featuredImage && (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          width={400}
          height={400}
        />
      )}

      <h2>{product.title}</h2>

      {variant && (
        <p>
          {variant.price.amount} {variant.price.currencyCode}
        </p>
      )}

      {variant ? (
        <BuyNowButton
          variantId={variant.id}
          disabled={!variant.availableForSale}
        />
      ) : (
        <button disabled>Unavailable</button>
      )}
    </article>
  );
}