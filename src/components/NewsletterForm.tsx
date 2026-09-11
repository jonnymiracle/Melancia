'use client'

import { useState } from 'react'
import { WELCOME_CODE, WELCOME_PERCENT } from '@/lib/welcome-offer'
import { applyDiscount } from '@/lib/apply-discount-client'

type Props = {
  /** Identifies which form submitted (server logs / webhook payload). */
  source?: string
  className?: string
  placeholder?: string
  buttonLabel?: string
  showPhone?: boolean
  /**
   * Show the discount code on screen the moment the email lands, instead of
   * only mailing it. Klaviyo takes about five minutes to deliver, which is long
   * enough that people leave without ever using the offer they just gave an
   * email for. The email still goes out, so they also have it later.
   */
  revealCode?: boolean
}

export function NewsletterForm({
  source = 'site',
  className,
  placeholder = 'Your email address',
  buttonLabel = 'Subscribe',
  showPhone = false,
  revealCode = false,
}: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  /**
   * null while applyDiscount is still in flight, so the message never claims
   * something that has not happened yet. 'failed' falls back to handing over
   * the code, because a shopper with nothing is worse than one who types.
   */
  const [applied, setApplied] = useState<'applied' | 'queued' | 'failed' | null>(null)


  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const email = String(fd.get('email') ?? '').trim()
    const phone = String(fd.get('phone') ?? '').trim()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone: phone || undefined, source }),
      })
      if (!res.ok) {
        setStatus('err')
        return
      }
      // Put it on the bag so she never has to type it. Resolved before the
      // success message appears, so the message is right the first time
      // instead of correcting itself half a second later.
      if (revealCode) {
        const result = await applyDiscount(WELCOME_CODE)
        setApplied(
          result.state === 'applied' || result.state === 'queued' ? result.state : 'failed',
        )
      }

      setStatus('ok')
      form.reset()
    } catch {
      setStatus('err')
    }
  }

  return (
    <form className={['newsletter-form', className].filter(Boolean).join(' ')} onSubmit={onSubmit}>
      <input type="email" name="email" placeholder={placeholder} aria-label="Email" required />
      {showPhone && (
        <>
          <input
            type="tel"
            name="phone"
            placeholder="Phone (optional) — get a text on launch day"
            aria-label="Phone number"
          />
          <p className="newsletter-form-sms-consent">
            By entering your number you agree to receive marketing texts from Melancia Swim. Reply STOP to unsubscribe.
          </p>
        </>
      )}
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? '…' : buttonLabel}
      </button>
      {status === 'ok' && revealCode ? (
        <div className="welcome-code" role="status">
          <p className="welcome-code-headline">
            {applied === 'applied'
              ? `Your ${WELCOME_PERCENT}% is on your bag`
              : applied === 'queued'
                ? `Your ${WELCOME_PERCENT}% is waiting on your bag`
                : `Your ${WELCOME_PERCENT}% is on its way`}
          </p>
          <p className="welcome-code-note">
            {applied === 'applied'
              ? 'Nothing to type at checkout. We emailed it to you as well.'
              : applied === 'queued'
                ? 'It comes off by itself the moment you add your first piece. We emailed it to you as well.'
                : 'It lands on your bag in a moment. We emailed it to you as well.'}
          </p>
        </div>
      ) : null}
      {status === 'ok' && !revealCode ? (
        <p className="newsletter-form-msg newsletter-form-msg--ok" role="status">
          Thanks, you&apos;re on the list.
        </p>
      ) : null}
      {status === 'err' ? (
        <p className="newsletter-form-msg newsletter-form-msg--err" role="alert">
          Something went wrong. Try again in a moment.
        </p>
      ) : null}
    </form>
  )
}
