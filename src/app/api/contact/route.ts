import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const TO = process.env.CONTACT_EMAIL ?? 'oi@melanciaswim.com'
const FROM = 'Melancia Website <noreply@melanciaswim.com>'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { firstName, lastName, email, phone, subject, message } = body as {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    subject?: string
    message?: string
  }

  if (!firstName || !lastName || !email || !subject || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2d2d2d;">
      <div style="background: #f9746c; padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; color: #fff; font-size: 20px;">New Contact Form Submission</h1>
      </div>
      <div style="border: 1px solid #eee; border-top: none; padding: 32px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; width: 140px; color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${email}" style="color: #f9746c;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${phone || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Subject</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 16px 0 0; color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Message</td>
            <td style="padding: 16px 0 0; white-space: pre-wrap; line-height: 1.6;">${message}</td>
          </tr>
        </table>
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #f0f0f0; font-size: 12px; color: #aaa; text-align: center;">
          Sent from melanciaswim.com contact form
        </div>
      </div>
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `[Melancia] ${subject} — ${firstName} ${lastName}`,
      html,
    })
  } catch (e) {
    console.error('[contact] Resend error:', e)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
