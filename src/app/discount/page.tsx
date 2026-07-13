'use client'

import { useEffect } from 'react'

export default function DiscountPage() {
  useEffect(() => {
    try {
      localStorage.setItem('melancia-open-discount', '1')
      sessionStorage.removeItem('melancia-discount-modal-dismissed')
    } catch { /* ignore */ }
    window.location.replace('/')
  }, [])

  return null
}
