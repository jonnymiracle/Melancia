'use client'

import { useEffect, useState } from 'react'
import {
  BANDS, CUPS, JEANS,
  topRangeFor, bottomRangeFor, cartSizeFor,
} from '@/lib/size-recommendation'

const DISMISS_KEY = 'melancia-size-calc-dismissed'
/** EngagementPopover writes this when the discount modal is closed. */
const DISCOUNT_KEY = 'melancia-discount-modal-dismissed'
const DELAY_MS = 2000

type Props = {
  onApply: (top: 'Small' | 'Medium' | 'Large', bottom: 'Small' | 'Medium' | 'Large') => void
}

function read(key: string) {
  try { return !!sessionStorage.getItem(key) } catch { return false }
}

/**
 * Slides in on a product page and turns a bra and jean size into a Melancia
 * size for each piece, then drops both into the picker.
 *
 * It waits for the discount modal rather than racing it. Both were set to
 * appear at two seconds, and that modal covers the screen, so firing together
 * would have wasted this entirely.
 */
export default function SizeCalculator({ onApply }: Props) {
  const [shown, setShown] = useState(false)
  const [band, setBand] = useState<number>(32)
  const [cup, setCup] = useState<string>('D')
  const [jean, setJean] = useState<number>(8)

  useEffect(() => {
    if (read(DISMISS_KEY)) return

    let timer: ReturnType<typeof setTimeout> | null = null
    let poll: ReturnType<typeof setInterval> | null = null

    const arm = () => { timer = setTimeout(() => setShown(true), DELAY_MS) }

    if (read(DISCOUNT_KEY)) {
      arm()
    } else {
      // The discount modal is still due or still open. Wait it out, but do not
      // wait forever if it never appears.
      poll = setInterval(() => {
        if (read(DISCOUNT_KEY)) {
          if (poll) clearInterval(poll)
          poll = null
          arm()
        }
      }, 600)
    }

    return () => {
      if (timer) clearTimeout(timer)
      if (poll) clearInterval(poll)
    }
  }, [])

  const topRange = topRangeFor(band, cup)
  const bottomRange = bottomRangeFor(jean)

  function dismiss() {
    setShown(false)
    try { sessionStorage.setItem(DISMISS_KEY, '1') } catch { /* private mode */ }
  }

  function apply() {
    onApply(cartSizeFor(topRange), cartSizeFor(bottomRange))
    dismiss()
  }

  if (!shown) return null

  return (
    <aside className="size-calc" role="region" aria-label="Size calculator">
      <div className="size-calc-head">
        <h2>SIZE CALCULATOR</h2>
        <button type="button" className="size-calc-close" onClick={dismiss} aria-label="Close">
          ×
        </button>
      </div>

      <div className="size-calc-ask">
        <div className="size-calc-q">
          <span className="size-calc-qname">Brassiere</span>
          <span className="size-calc-pair">
            <select value={band} onChange={e => setBand(Number(e.target.value))} aria-label="Band">
              {BANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={cup} onChange={e => setCup(e.target.value)} aria-label="Cup">
              {CUPS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </span>
        </div>
        <div className="size-calc-q">
          <span className="size-calc-qname">Jean</span>
          <select value={jean} onChange={e => setJean(Number(e.target.value))} aria-label="Jean size">
            {JEANS.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
      </div>

      <div className="size-calc-result">
        <span className="size-calc-label">Our recommendation</span>
        <div className="size-calc-pieces">
          <div className="size-calc-piece">
            <span className="size-calc-plabel">Top</span>
            <span className="size-calc-psize">{topRange}</span>
          </div>
          <div className="size-calc-piece">
            <span className="size-calc-plabel">Bottom</span>
            <span className="size-calc-psize">{bottomRange}</span>
          </div>
        </div>
        <button type="button" className="size-calc-apply" onClick={apply}>
          Use these sizes
        </button>
      </div>
    </aside>
  )
}
