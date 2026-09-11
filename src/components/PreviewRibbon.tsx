import { IS_PREVIEW, DEPLOY_BRANCH } from '@/lib/site-env'

/**
 * Marks a preview deploy so nobody mistakes it for melanciaswim.com.
 *
 * This matters more than it looks: a preview points at the same Shopify store,
 * so a checkout completed here is a real order against real inventory on a real
 * card. The ribbon is the reminder.
 *
 * Renders nothing on production.
 */
export default function PreviewRibbon() {
  if (!IS_PREVIEW) return null

  return (
    <div className="preview-ribbon" role="status">
      <strong>PREVIEW</strong>
      <span>
        Branch <code>{DEPLOY_BRANCH}</code> · not the live site · checkout here creates a real order
      </span>
    </div>
  )
}
