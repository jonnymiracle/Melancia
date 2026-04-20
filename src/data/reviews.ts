import { CustomerReview } from '@/types'

export const customerReviews: CustomerReview[] = [
  {
    id: 1,
    name: 'Sofia M.',
    year: 2025,
    rating: 5,
    text:
      'I wore the Watermelon Set on my trip to Tulum and got so many compliments. The fit is incredible — it actually stays put in the ocean!',
  },
  {
    id: 2,
    name: 'Valentina R.',
    year: 2025,
    rating: 5,
    text:
      "Finally a brand that gets it right. The colors are exactly like the photos, the fabric is so soft, and the sizing is true-to-size. I'm obsessed.",
  },
  {
    id: 3,
    name: 'Camila P.',
    year: 2024,
    rating: 5,
    text:
      "The Lavender Dream top is my new favorite. It's so comfortable and the design is unique. Already ordering a second color!",
  },
  {
    id: 4,
    name: 'Robert F.',
    year: 2024,
    rating: 4,
    text:
      'Ordered a set as a gift — great packaging and fast shipping. She says the quality is excellent and it fits perfectly.',
  },
  {
    id: 5,
    name: 'Elena K.',
    year: 2024,
    rating: 5,
    text:
      'Obsessed with the Coral Crush top. Holds everything in place without digging in — rare for triangle styles.',
  },
  {
    id: 6,
    name: 'Maria G.',
    year: 2023,
    rating: 4,
    text:
      'Beautiful prints and fabric. One star off only because I wish there were more extended sizes — otherwise perfect.',
  },
  {
    id: 7,
    name: 'Isabella T.',
    year: 2023,
    rating: 5,
    text:
      'Survived a full week in the pool and salt water. Color stayed bright and never went sheer. Will buy again.',
  },
  {
    id: 8,
    name: 'Lucia H.',
    year: 2023,
    rating: 5,
    text:
      'The cover-up paired with my one-piece gets compliments every time. Lightweight and easy to throw in a tote.',
  },
]

/** First three reviews — matches homepage “What Our Girls Are Saying” */
export const featuredCustomerReviews: CustomerReview[] = customerReviews.slice(0, 3)
