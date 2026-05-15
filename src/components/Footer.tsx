import Link from 'next/link'
import Image from 'next/image'
import { InstagramIcon } from './icons'
import { SOL_DE_IPANEMA_SLUG } from '@/lib/shop-collections'

const INSTAGRAM = 'https://www.instagram.com/melanciaswim/'

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <Image
            src="/images/Logo original colors.png"
            alt="Melancia"
            width={120}
            height={72}
            style={{ height: 52, width: 'auto', marginBottom: 12 }}
          />
          <p>Swimwear designed for the free-spirited. Made with love, worn with confidence.</p>
          <div className="footer-socials">
            <a href={INSTAGRAM} target="_blank" rel="noopener" aria-label="Instagram">
              <InstagramIcon size={17} />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li>
              <Link href={`/shop?collection=${SOL_DE_IPANEMA_SLUG}`}>Sol de Ipanema</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            {/* <li><Link href="/size-guide">Size Guide</Link></li> */}
            <li><Link href="/contact">Shipping Info</Link></li>
            <li><Link href="/contact">Returns</Link></li>
            <li><Link href="/contact">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link href="/about">Our Story</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Melancia Swimwear. All rights reserved.</span>
        <span>Privacy Policy · Terms of Service</span>
      </div>
    </footer>
  )
}
