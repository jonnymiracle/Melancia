/**
 * Payment marks shown in the footer.
 *
 * Verified against the store rather than assumed: Shopify's paymentSettings
 * reports SHOPIFY_PAY, APPLE_PAY and GOOGLE_PAY as the enabled wallets, and
 * real orders have settled through Shopify Payments on both Visa (#1009, via
 * Shop Pay) and Mastercard (#1011). Amex and Discover are confirmed accepted
 * by the shop owner.
 *
 * Only list what checkout actually takes — a card mark here that fails at
 * checkout costs more trust than showing nothing would have.
 *
 * Drawn inline so the footer costs no extra requests. These are simplified
 * marks, not the networks' official brand assets; swap in the official SVGs
 * if you ever want them pixel-exact.
 */

type Mark = { key: string; label: string; svg: React.ReactNode }

/** Every mark sits on the same 38×24 white plate so the row reads as one object. */
const MARKS: Mark[] = [
  {
    key: 'visa',
    label: 'Visa',
    svg: (
      <text
        x="19" y="16.5" textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif" fontSize="9.5"
        fontWeight="700" fontStyle="italic" letterSpacing="0.5" fill="#1A1F71"
      >
        VISA
      </text>
    ),
  },
  {
    key: 'mastercard',
    label: 'Mastercard',
    svg: (
      <>
        <circle cx="15.5" cy="12" r="6.4" fill="#EB001B" />
        <circle cx="22.5" cy="12" r="6.4" fill="#F79E1B" />
        <path
          d="M19 7.1a6.38 6.38 0 0 0 0 9.8 6.38 6.38 0 0 0 0-9.8z"
          fill="#FF5F00"
        />
      </>
    ),
  },
  {
    key: 'amex',
    label: 'American Express',
    svg: (
      <>
        <rect x="3" y="3" width="32" height="18" rx="2" fill="#1F72CD" />
        <text
          x="19" y="15" textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif" fontSize="6.6"
          fontWeight="700" letterSpacing="0.3" fill="#FFFFFF"
        >
          AMEX
        </text>
      </>
    ),
  },
  {
    key: 'discover',
    label: 'Discover',
    svg: (
      <>
        <text
          x="16" y="15.5" textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif" fontSize="6.1"
          fontWeight="700" letterSpacing="-0.1" fill="#231F20"
        >
          DISCVR
        </text>
        <circle cx="30" cy="13" r="4.2" fill="#F76B1C" />
      </>
    ),
  },
  {
    key: 'shoppay',
    label: 'Shop Pay',
    svg: (
      <>
        <rect x="3" y="4.5" width="32" height="15" rx="3.4" fill="#5A31F4" />
        <text
          x="19" y="14.7" textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif" fontSize="7.2"
          fontWeight="700" letterSpacing="-0.2" fill="#FFFFFF"
        >
          shop
        </text>
      </>
    ),
  },
  {
    key: 'applepay',
    label: 'Apple Pay',
    svg: (
      <>
        <path
          d="M13.4 8.3c.5-.6.83-1.42.74-2.25-.71.03-1.58.48-2.1 1.08-.46.52-.87 1.37-.76 2.17.8.06 1.6-.4 2.12-1zm.73 1.16c-1.17-.07-2.16.66-2.72.66-.56 0-1.41-.63-2.33-.61-1.2.02-2.31.7-2.92 1.77-1.25 2.17-.33 5.38.89 7.14.6.87 1.3 1.84 2.23 1.8.89-.03 1.23-.58 2.31-.58s1.38.58 2.33.56c.96-.02 1.57-.88 2.16-1.75.68-1 .96-1.96.98-2.01-.02-.02-1.88-.73-1.9-2.87-.02-1.79 1.46-2.65 1.53-2.69-.84-1.23-2.14-1.37-2.6-1.4z"
          fill="#000000"
        />
        <text
          x="27" y="16" textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif" fontSize="8"
          fontWeight="500" fill="#000000"
        >
          Pay
        </text>
      </>
    ),
  },
  {
    key: 'googlepay',
    label: 'Google Pay',
    svg: (
      <>
        <text
          x="12" y="16" textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif" fontSize="9.5"
          fontWeight="500" fill="#4285F4"
        >
          G
        </text>
        <text
          x="25" y="16" textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif" fontSize="8"
          fontWeight="500" fill="#5F6368"
        >
          Pay
        </text>
      </>
    ),
  },
]

export default function PaymentMethods() {
  return (
    <div className="footer-payments">
      <span className="footer-payments-label">We accept</span>
      <ul className="footer-payments-row">
        {MARKS.map(({ key, label, svg }) => (
          <li key={key}>
            <svg
              viewBox="0 0 38 24"
              role="img"
              aria-label={label}
              className="pay-mark"
            >
              <title>{label}</title>
              <rect width="38" height="24" rx="4" fill="#FFFFFF" />
              {svg}
            </svg>
          </li>
        ))}
      </ul>
    </div>
  )
}
