'use client'

import type { Piece } from '@/lib/piece-availability'

type Props = {
  piece: Piece
  /** Every size the product offers, in display order. */
  sizes: string[]
  /** The subset of `sizes` in stock for this piece in the chosen colour. */
  inStock: string[]
  chosen: string | null
  onChoose: (size: string) => void
}

/**
 * One size row for a single half of a bikini. Rendered twice on a paired
 * product so the customer can size the top and bottom independently.
 */
export default function PieceSizePicker({ piece, sizes, inStock, chosen, onChoose }: Props) {
  const label = piece.toUpperCase()

  return (
    <div className="pdp-variants">
      <span className="pdp-variants-label">
        {chosen ? `${label} SIZE — ${chosen.toUpperCase()}` : `CHOOSE YOUR ${label} SIZE`}
      </span>
      <div className="pdp-size-pills">
        {sizes.map(size => {
          const available = inStock.includes(size)
          return (
            <button
              key={size}
              type="button"
              className={`pdp-size-pill${chosen === size ? ' selected' : ''}`}
              onClick={() => onChoose(size)}
              disabled={!available}
              aria-label={available ? size : `${size} — sold out`}
            >
              {size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
