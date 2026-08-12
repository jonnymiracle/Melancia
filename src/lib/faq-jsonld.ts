/**
 * FAQPage JSON-LD builder for product pages.
 *
 * Emits a static FAQ set that answers the questions AI agents and shoppers
 * most commonly ask about Melancia swimwear: sizing, fit, fabric, coverage,
 * and returns. The questions are brand-voice, not legalese.
 *
 * Usage:
 *   const schema = buildProductFaqJsonLd()
 */

export function buildProductFaqJsonLd(): Record<string, unknown> {
  const faqs = [
    {
      q: 'How do Melancia swimwear pieces fit — do they run true to size?',
      a: 'Our tops and bottoms run true to size for most fits. If you are between sizes, size up for more coverage or size down for a snugger, supportive fit. Triangle tops are fully adjustable via ties, so small variations in bust size are easy to accommodate. Check our Size Guide for exact measurements.',
    },
    {
      q: 'What fabric are Melancia bikinis made from?',
      a: 'All Melancia pieces are crafted in 82% Polyamide, 18% Elastane — a soft, high-performance fabric that is quick-drying, chlorine-resistant, and retains its shape all season. It offers light UV protection and a smooth, second-skin feel.',
    },
    {
      q: 'How much coverage do the bikini bottoms provide?',
      a: 'Melancia bottoms are Brazilian cut — minimal, cheeky coverage designed for tanning. The high-cut leg line elongates the silhouette. If you prefer more coverage, we recommend sizing up by one size.',
    },
    {
      q: 'Can I return or exchange my Melancia swimwear?',
      a: 'Yes. We accept returns and exchanges within 30 days of delivery on unworn, unwashed items with the hygiene liner intact and all tags attached. Sale items are final sale. To start a return, email us with your order number.',
    },
    {
      q: 'How long does shipping take within the United States?',
      a: 'Shipping is free on every U.S. order with no minimum. Orders ship within 1–2 business days and standard domestic delivery takes 3–5 business days. We currently ship within the United States only.',
    },
    {
      q: 'How do I care for my Melancia bikini?',
      a: 'Hand wash in cold water with a gentle detergent after each use. Rinse thoroughly to remove sunscreen, salt, and chlorine. Lay flat to dry in the shade — avoid wringing, machine washing, or direct heat, which can break down the elastane and fade the colour.',
    },
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  }
}
