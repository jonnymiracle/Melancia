'use client'

import VariantCard from '@/components/VariantCard'
import type { VariantCardData } from '@/components/VariantCard'
import HeroSlideshow from '@/components/HeroSlideshow'

type Props = {
  variantCards: VariantCardData[]
}

export default function ShopCatalog({ variantCards }: Props) {
  return (
    <>
      <HeroSlideshow />

      <div className="shop-layout">
        <div className="shop-main">
          <header className="collection-intro">
            <h1>Brazilian Bikinis</h1>
          </header>

          <div className="shop-toolbar">
            <span className="shop-count">
              <strong>{variantCards.length}</strong> styles
            </span>
          </div>

          <div className="product-grid">
            {variantCards.map(card => (
              <VariantCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
