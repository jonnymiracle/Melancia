'use client'

import { useState } from 'react'

type Props = {
  /** Identifies which form submitted (server logs / webhook payload). */
  source?: string
  className?: string
}

export function NewsletterForm({ source = 'site', className }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') ?? '').trim()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      if (!res.ok) {
        setStatus('err')
        return
      }
      setStatus('ok')
      e.currentTarget.reset()
    } catch {
      setStatus('err')
    }
  }

  return (
    <form className={['newsletter-form', className].filter(Boolean).join(' ')} onSubmit={onSubmit}>
      <input type="email" name="email" placeholder="Your email address" aria-label="Email" required />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? '…' : 'Subscribe'}
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
