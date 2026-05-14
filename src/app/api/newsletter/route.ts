import { NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const rec = body as { email?: string; source?: string }
  const email = typeof rec.email === 'string' ? rec.email.trim() : ''
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const source =
    typeof rec.source === 'string' ? rec.source.slice(0, 120) : 'unknown'
  const payload = { email, source, at: new Date().toISOString() }

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      /* still acknowledge to user; check webhook logs */
    }
  } else {
    console.info('[newsletter]', payload)
  }

  return NextResponse.json({ ok: true })
}
