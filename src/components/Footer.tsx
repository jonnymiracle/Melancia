import Link from 'next/link'
import Image from 'next/image'
import { InstagramIcon } from './icons'
import { SITE_EMAIL, SITE_EMAIL_MAILTO } from '@/lib/site-contact'

const INSTAGRAM = 'https://www.instagram.com/melanciaswim/'

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <Image
            src="/images/Logo original colors.png"
            alt="Melancia Swim — Brazilian Bikinis & Swimwear"
            width={120}
            height={72}
            style={{ height: 52, width: 'auto', marginBottom: 12 }}
          />
          <p>Crafted in Brasil. Made for the Sun.</p>
          <div className="footer-socials">
            <a href={INSTAGRAM} target="_blank" rel="noopener" aria-label="Instagram">
              <InstagramIcon size={17} />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link href="/shop">Brazilian Bikinis</Link></li>
          </ul>
        </div>


        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link href="/about">Our Story</Link></li>
            <li><Link href="/blog">Journal</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/shipping-policy">Shipping &amp; Returns</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href={SITE_EMAIL_MAILTO}>{SITE_EMAIL}</a></li>
            <li><Link href="/contact">Send a Message</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Melancia Swimwear. All rights reserved.</span>
        <span>Made with love in Brazil 🇧🇷</span>
      </div>
    </footer>
  )
}
