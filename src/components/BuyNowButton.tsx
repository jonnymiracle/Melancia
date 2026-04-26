"use client";

type BuyNowButtonProps = {
  variantId: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
};

export default function BuyNowButton({
  variantId,
  quantity = 1,
  disabled = false,
  className,
}: BuyNowButtonProps) {
  async function handleBuyNow() {
    try {
      const res = await fetch("/api/shopify/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId,
          quantity,
        }),
      });

      const data = await res.json();

      const checkoutUrl = data?.data?.cartCreate?.cart?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("Checkout URL not found");
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Buy now error:", error);
      alert("Something went wrong starting checkout.");
    }
  }

  return (
    <button
      type="button"
      className={['btn', 'btn-primary', className].filter(Boolean).join(' ')}
      onClick={handleBuyNow}
      disabled={disabled || !variantId}
    >
      Buy Now
    </button>
  );
}