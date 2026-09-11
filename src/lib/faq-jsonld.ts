/**
 * The FAQ content, and the FAQPage JSON-LD built from it.
 *
 * One list feeds both the /faq page and the structured data on product pages,
 * so an answer can never be right in one place and stale in the other.
 *
 * Everything here is checked against how the store actually behaves. Free US
 * shipping with no minimum comes from the Shopify delivery profile; the
 * payment marks from paymentSettings plus real settled orders; the mixed
 * top/bottom sizing from the picker that runs on the paired products. Do not
 * add an answer you have not verified.
 */

export type FaqGroup = {
  title: string
  items: { q: string; a: string }[]
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'Sizing & fit',
    items: [
      {
        q: 'Can I order a different size top and bottom?',
        a: "Yes, and you don't need to ask us. Pick your top size and your bottom size right on the product page. Almost nobody is the same size on top and bottom, so we stopped pretending otherwise.",
      },
      {
        q: 'Do Melancia pieces run true to size?',
        a: 'Our tops and bottoms run true to size for most fits. If you are between sizes, size up for more coverage or size down for a snugger, supportive fit. Triangle tops are fully adjustable via ties, so small variations in bust size are easy to accommodate.',
      },
      {
        q: 'How much coverage do the bottoms give?',
        a: 'Melancia bottoms are Brazilian cut, so minimal and cheeky, designed for tanning. The high-cut leg line elongates the silhouette. If you prefer more coverage, size up by one.',
      },
    ],
  },
  {
    title: 'Orders & shipping',
    items: [
      {
        q: 'How much does shipping cost?',
        a: 'Nothing, on every U.S. order. No minimum, no surprise at the end.',
      },
      {
        q: 'When will my order arrive?',
        a: 'We ship in 1 to 2 business days and delivery takes another 3 to 5. Most orders show up inside a week.',
      },
      {
        q: 'Do you ship outside the United States?',
        a: "Only within the U.S. for now. If you're somewhere else, write to us at oi@melanciaswim.com. We'd rather tell you straight than take an order we can't deliver.",
      },
      {
        q: 'How do I track my order?',
        a: "You'll get an email with your tracking number the moment it ships. Give it a day or two before you worry, carriers take their time scanning.",
      },
    ],
  },
  {
    title: 'Returns',
    items: [
      {
        q: 'Can I return a bikini I already tried on?',
        a: "Yes, as long as the hygiene liner is still there and the tags are on. Try it on over your underwear and leave the liner alone. That one sticker is the whole difference between a return we can take and one we can't.",
      },
      {
        q: 'What is your return policy?',
        a: 'We accept returns and exchanges within 30 days of delivery on unworn, unwashed items with the hygiene liner intact and all tags attached. Sale items are final sale. To start a return, email us with your order number.',
      },
    ],
  },
  {
    title: 'Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'Visa, Mastercard, American Express and Discover, plus Shop Pay, Apple Pay and Google Pay.',
      },
      {
        q: 'Is my payment secure?',
        a: "Yes. Checkout happens on Shopify, so your card goes straight to them. We never see the number and we don't store it.",
      },
    ],
  },
  {
    title: 'The swimwear itself',
    items: [
      {
        q: 'What fabric are Melancia bikinis made from?',
        a: 'All Melancia pieces are made in 82% Polyamide and 18% Elastane, a soft, high-performance fabric that dries fast, resists chlorine, and keeps its shape all season. It gives light UV protection and a smooth, second-skin feel.',
      },
      {
        q: 'How do I care for my bikini?',
        a: 'Hand wash in cold water with a gentle detergent after each use. Rinse thoroughly to get the sunscreen, salt and chlorine out. Lay it flat to dry in the shade, and skip the wringing, the machine and direct heat. Those are what break down the elastane and fade the colour.',
      },
    ],
  },
]

/** Flat list, for the schema and for anything that does not care about grouping. */
export const FAQ_ITEMS = FAQ_GROUPS.flatMap(g => g.items)

export function buildProductFaqJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  }
}
