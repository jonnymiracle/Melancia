import Link from 'next/link'
import Image from 'next/image'
import { InstagramIcon } from './icons'

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
            <li><Link href="/collections/brazilian-bikini-sets">Bikini Sets</Link></li>
            <li><Link href="/collections/brazilian-bikini-tops">Bikini Tops</Link></li>
          </ul>
        </div>


        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link href="/about">Our Story</Link></li>
            <li><Link href="/blog">Journal</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/size-guide">Size Guide</Link></li>
            <li><Link href="/shipping-policy">Shipping &amp; Returns</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Melancia Swimwear. All rights reserved.</span>
      </div>
    </footer>
  )
}
