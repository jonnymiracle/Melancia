'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NewsletterForm } from '@/components/NewsletterForm'

const STORAGE_KEY = 'melancia-discount-modal-dismissed'
const SCROLL_PX = 80

/** Tanning-club timing: unlock after scrolling, then delay 5–10s before opening */
function delayMs() {
  return 5000 + Math.floor(Math.random() * 5000)
}

export default function EngagementPopover() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'offer' | 'email'>('offer')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scheduledRef = useRef(false)

  const dismiss = useCallback(() => {
    setOpen(false)
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return
    } catch {
      /* ignore */
    }

    function clearTimer() {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    function scheduleReveal() {
      if (scheduledRef.current) return
      scheduledRef.current = true
      clearTimer()
      timerRef.current = setTimeout(() => {
        setOpen(true)
        timerRef.current = null
      }, delayMs())
    }

    function onScrollOrInteraction() {
      if (typeof window === 'undefined') return
      if (window.scrollY >= SCROLL_PX) {
        scheduleReveal()
      }
    }

    const onWheel = () => scheduleReveal()
    const onTouchMove = () => scheduleReveal()

    window.addEventListener('scroll', onScrollOrInteraction, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true, once: true })
    requestAnimationFrame(onScrollOrInteraction)

    return () => {
      window.removeEventListener('scroll', onScrollOrInteraction)
      window.removeEventListener('wheel', onWheel)
      clearTimer()
    }
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, dismiss])

  function handleReady() {
    setStep('email')
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) dismiss()
  }

  if (!open) return null

  return (
    <div
      className="discount-modal-backdrop"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <div
        className="discount-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="discount-modal-heading"
      >
        <div className="discount-modal-bg" aria-hidden="true" />

        <button type="button" className="discount-modal-close" onClick={dismiss} aria-label="Close">
          ×
        </button>

        <div className="discount-modal-inner">
          <div className="discount-modal-pane discount-modal-pane--content">
            <div className="discount-modal-brand">
              <Image
                src="/images/Logo original colors.png"
                alt=""
                width={160}
                height={56}
                style={{ height: 'auto', width: 160, maxWidth: '60%' }}
              />
            </div>

            <h2 id="discount-modal-heading" className="discount-modal-title">
              {step === 'offer' ? 'Watch out for our discounts!' : 'Drop your email'}
            </h2>

            {step === 'offer' && (
              <>
                <p className="discount-modal-lede">Sunshine not required.</p>
                <div className="discount-modal-actions">
                  <button type="button" className="discount-modal-btn discount-modal-btn--primary" onClick={handleReady}>
                    I&apos;m ready
                  </button>
                  <button type="button" className="discount-modal-btn discount-modal-btn--ghost" onClick={dismiss}>
                    No thanks
                  </button>
                </div>
              </>
            )}

            {step === 'email' && (
              <>
                <p className="discount-modal-lede">We&apos;ll send your code — unsubscribe anytime.</p>
                <div className="discount-modal-form-wrap">
                  <NewsletterForm />
                </div>
                <button type="button" className="discount-modal-dismiss-link" onClick={dismiss}>
                  Maybe later
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
