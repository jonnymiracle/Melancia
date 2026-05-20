'use client'

import { useState } from 'react'

type Props = {
  /** Identifies which form submitted (server logs / webhook payload). */
  source?: string
  className?: string
  placeholder?: string
  buttonLabel?: string
  showPhone?: boolean
}

export function NewsletterForm({
  source = 'site',
  className,
  placeholder = 'Your email address',
  buttonLabel = 'Subscribe',
  showPhone = false,
}: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

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
      {status === 'ok' ? (
        <p className="newsletter-form-msg newsletter-form-msg--ok" role="status">
          Thanks — you&apos;re on the list.
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
