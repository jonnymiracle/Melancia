'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DiscountPage() {
  const router = useRouter()

  useEffect(() => {
    try {
      localStorage.setItem('melancia-open-discount', '1')
      sessionStorage.removeItem('melancia-discount-modal-dismissed')
    } catch { /* ignore */ }
    router.replace('/')
  }, [router])

  return null
}
