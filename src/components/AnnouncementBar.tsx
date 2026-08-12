import { FREE_SHIPPING_ENABLED, FREE_SHIPPING_BAR } from '@/lib/free-shipping'

const SEPARATOR = '  ·  '
/** Repeats per track copy — enough to stay wider than the viewport on desktop. */
const REPEATS = 6

export default function AnnouncementBar() {
  if (!FREE_SHIPPING_ENABLED) return null

  const message = Array.from({ length: REPEATS }, () => FREE_SHIPPING_BAR).join(SEPARATOR)

  return (
    <div className="announcement-bar">
      {/* Rendered twice so the marquee loops seamlessly. */}
      <div className="announcement-track">
        <span>{message}</span>
        <span aria-hidden="true">{message}</span>
      </div>
    </div>
  )
}
