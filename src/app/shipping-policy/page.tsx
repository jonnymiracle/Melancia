import Link from 'next/link'
import { SITE_EMAIL, SITE_EMAIL_MAILTO } from '@/lib/site-contact'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Melancia Swim ships bikinis and swimwear within the USA. Learn about shipping times, free shipping thresholds, international delivery, and our 30-day return policy.',
  alternates: {
    canonical: 'https://www.melanciaswim.com/shipping-policy',
  },
}

export default function ShippingPolicyPage() {
  return (
    <>
      <div className="contact-hero">
        <h1>Shipping Policy</h1>
        <p>Last updated May 2026</p>
      </div>

      <div className="policy-body">

        <section className="policy-section">
          <h2>Processing Time</h2>
          <p>All orders are processed within <strong>1–2 business days</strong> after payment is confirmed. Orders placed on weekends or holidays are processed the next business day. You will receive a tracking number by email once your order has shipped.</p>
        </section>

        <section className="policy-section">
          <h2>Domestic Shipping (United States)</h2>
          <table className="policy-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Estimated Delivery</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard Shipping</td>
                <td>3–5 business days</td>
                <td>Calculated at checkout</td>
              </tr>
              <tr>
                <td>Free Standard Shipping</td>
                <td>3–5 business days</td>
                <td>Free on orders $80+</td>
              </tr>
            </tbody>
          </table>
          <p>Free shipping is applied automatically at checkout on orders of <strong>$80 or more</strong> (calculated after discounts, before taxes).</p>
        </section>

        <section className="policy-section">
          <h2>International Shipping</h2>
          <p>We ship worldwide. International delivery typically takes <strong>7–14 business days</strong> depending on your location and local customs processing.</p>
          <table className="policy-table">
            <thead>
              <tr>
                <th>Order Total</th>
                <th>Shipping Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Under $120</td>
                <td>Calculated at checkout</td>
              </tr>
              <tr>
                <td>$120 and over</td>
                <td>Free international shipping</td>
              </tr>
            </tbody>
          </table>
          <p><strong>Please note:</strong> The customer is responsible for any import duties, customs fees, or taxes charged by your country. These are not included in your order total and are collected by your local customs authority.</p>
        </section>

        <section className="policy-section">
          <h2>Tracking Your Order</h2>
          <p>Once your order ships, you will receive a confirmation email with a tracking number. Please allow <strong>1–2 business days</strong> for tracking information to update after you receive the email.</p>
          <p>If your tracking number shows no movement after 5 business days, please reach out to us and we will look into it right away.</p>
        </section>

        <section className="policy-section">
          <h2>Lost or Undelivered Orders</h2>
          <p>If your order is marked as delivered but you have not received it, please:</p>
          <ol>
            <li>Check with neighbors and around your property.</li>
            <li>Allow 1–2 additional business days — carriers sometimes mark packages early.</li>
            <li>Contact us at <a href={SITE_EMAIL_MAILTO}>{SITE_EMAIL}</a> and we will work with the carrier to resolve the issue as quickly as possible.</li>
          </ol>
        </section>

        <section className="policy-section">
          <h2>Returns &amp; Exchanges</h2>
          <p>We accept returns and exchanges within <strong>30 days</strong> of delivery, provided items are:</p>
          <ul>
            <li>Unworn and unwashed</li>
            <li>In original condition with all tags attached</li>
            <li>Swimwear must have the hygiene liner intact</li>
          </ul>
          <p><strong>Sale items are final sale</strong> and not eligible for return or exchange.</p>
          <p>To start a return or exchange, email us at <a href={SITE_EMAIL_MAILTO}>{SITE_EMAIL}</a> with your order number.</p>
        </section>

        <section className="policy-section">
          <h2>Questions?</h2>
          <p>We&apos;re happy to help. Reach out at <a href={SITE_EMAIL_MAILTO}>{SITE_EMAIL}</a> and we&apos;ll get back to you within 24 hours. You can also visit our <Link href="/contact">Contact page</Link> for more ways to reach us.</p>
        </section>

      </div>
    </>
  )
}
