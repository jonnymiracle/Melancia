'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

/**
 * The logo curtain that covers the page while it gets its bearings.
 *
 * Two ways to use it:
 *
 * 1. No props, which is how the root layout mounts it. The curtain holds for a
 *    fixed beat and lifts. This only ever runs on a hard page load, because the
 *    layout does not remount on a client-side navigation.
 *
 * 2. With `ready`, which is how a page with heavy hero media mounts it. The
 *    curtain holds until that page says its media can paint. Arriving from the
 *    nav is a client-side transition, so the layout's curtain never runs and
 *    the hero would otherwise show up empty while its video or photo downloads.
 *
 * `maxMs` is a release valve in the second case, not a target. If the media
 * never reports ready, because it failed to decode or the download stalled, the
 * curtain lifts anyway rather than trapping the visitor behind a logo.
 */

/** Long enough that a cached hero does not make the curtain flash. */
const MIN_MS = 500
/** Matches the .page-loader.hide animation in globals.css. */
const FADE_MS = 450

type Props = {
  /** When given, the curtain waits for this instead of the fixed beat. */
  ready?: boolean
  /** Hard ceiling, and the plain duration when `ready` is not given. */
  maxMs?: number
}

export default function PageLoader({ ready, maxMs = 2200 }: Props) {
  const [minPassed, setMinPassed] = useState(false)
  const [capped, setCapped] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    const minTimer = setTimeout(() => setMinPassed(true), MIN_MS)
    const capTimer = setTimeout(() => setCapped(true), maxMs)
    return () => { clearTimeout(minTimer); clearTimeout(capTimer) }
  }, [maxMs])

  const hidden = capped || (ready === true && minPassed)

  useEffect(() => {
    if (!hidden) return
    const timer = setTimeout(() => setRemoved(true), FADE_MS)
    return () => clearTimeout(timer)
  }, [hidden])

  if (removed) return null

  return (
    <div className={`page-loader${hidden ? ' hide' : ''}`}>
      <Image
        src="/images/Logo original colors.png"
        alt="Melancia"
        width={200}
        height={120}
        priority
        style={{ width: 200, height: 'auto', maxWidth: '50vw' }}
      />
    </div>
  )
}
