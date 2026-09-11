import type { Metadata } from 'next'
import Link from 'next/link'
import { FAQ_GROUPS, buildProductFaqJsonLd } from '@/lib/faq-jsonld'
import { SITE_EMAIL, SITE_EMAIL_MAILTO } from '@/lib/site-contact'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Answers about Melancia bikini sizing, mixing top and bottom sizes, free U.S. shipping, returns, and payment.',
  alternates: {
    canonical: 'https://www.melanciaswim.com/faq',
  },
}

export default function FaqPage() {
  // The same list drives the page and the schema, so they cannot drift apart.
  const jsonLd = buildProductFaqJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="contact-hero plain">
        <h1>Questions</h1>
        <p>The ones we get asked most</p>
      </div>

      <div className="policy-body">
        {FAQ_GROUPS.map(group => (
          <section key={group.title} className="policy-section">
            <h2>{group.title}</h2>
            <dl className="faq-list">
              {group.items.map(({ q, a }) => (
                <div key={q} className="faq-item">
                  <dt>{q}</dt>
                  <dd>{a}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <section className="policy-section">
          <h2>Still stuck?</h2>
          <p>
            Write to us at <a href={SITE_EMAIL_MAILTO}>{SITE_EMAIL}</a> and a real person will
            answer. If it is about sizing, tell us your usual bra and jean size and we will point
            you at the right one.
          </p>
          <p>
            You can also read the full <Link href="/shipping-policy">shipping and returns policy</Link>.
          </p>
        </section>
      </div>
    </>
  )
}
