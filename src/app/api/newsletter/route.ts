import { NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Normalise a phone number to E.164 format (US assumed if no country code). */
function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  if (digits.length > 8) return `+${digits}`
  return null
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const rec = body as { email?: string; phone?: string; source?: string }
  const email = typeof rec.email === 'string' ? rec.email.trim() : ''
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const phone = typeof rec.phone === 'string' ? normalisePhone(rec.phone) : null

  const apiKey = process.env.KLAVIYO_API_KEY
  const listId = process.env.KLAVIYO_LIST_ID

  if (!apiKey || !listId) {
    console.info('[newsletter] No Klaviyo config — email not saved:', email)
    return NextResponse.json({ ok: true })
  }

  // Build profile attributes — phone saved to profile, SMS list subscription handled separately in Klaviyo flows
  const profileAttributes: Record<string, unknown> = {
    email,
    subscriptions: {
      email: { marketing: { consent: 'SUBSCRIBED' } },
    },
  }
  if (phone) {
    profileAttributes.phone_number = phone
  }

  try {
    const res = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'Content-Type': 'application/json',
        'revision': '2024-10-15',
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: profileAttributes,
                },
              ],
            },
          },
          relationships: {
            list: {
              data: { type: 'list', id: listId },
            },
          },
        },
      }),
    })

    const responseText = await res.text()
    if (!res.ok) {
      console.error('[newsletter] Klaviyo error:', res.status, responseText)
      return NextResponse.json({ error: 'Subscription failed', klaviyo_status: res.status, klaviyo_response: responseText }, { status: 500 })
    }
    console.log('[newsletter] Klaviyo success:', res.status, responseText)
  } catch (e) {
    console.error('[newsletter] Klaviyo fetch failed:', e)
    return NextResponse.json({ error: 'Network error', detail: String(e) }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
