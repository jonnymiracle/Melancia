'use client'

export function NewsletterForm() {
  return (
    <form
      className="newsletter-form"
      onSubmit={(e) => e.preventDefault()}
    >
      <input type="email" placeholder="Your email address" aria-label="Email" />
      <button type="submit">Subscribe</button>
    </form>
  )
}
