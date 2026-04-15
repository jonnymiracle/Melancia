'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function PageLoader() {
  const [hidden, setHidden] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    const hideTimer = setTimeout(() => setHidden(true), 2200)
    const removeTimer = setTimeout(() => setRemoved(true), 2650)
    return () => { clearTimeout(hideTimer); clearTimeout(removeTimer) }
  }, [])

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
