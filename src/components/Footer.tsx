import Link from 'next/link'
import Image from 'next/image'
import { InstagramIcon, TikTokIcon, PinterestIcon } from './icons'

const INSTAGRAM = 'https://www.instagram.com/YOUR_HANDLE'
const TIKTOK    = 'https://www.tiktok.com/@YOUR_HANDLE'
const PINTEREST = 'https://www.pinterest.com/YOUR_HANDLE'

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
            <a href={TIKTOK} target="_blank" rel="noopener" aria-label="TikTok">
              <TikTokIcon size={17} />
            </a>
            <a href={PINTEREST} target="_blank" rel="noopener" aria-label="Pinterest">
              <PinterestIcon size={17} />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link href="/shop">New Arrivals</Link></li>
            <li><Link href="/shop">Sets</Link></li>
            <li><Link href="/shop">Tops</Link></li>
            <li><Link href="/shop">Bottoms</Link></li>
            <li><Link href="/shop">One Pieces</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li><Link href="/size-guide">Size Guide</Link></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">Our Story</a></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><a href="#">Sustainability</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2025 Melancia Swimwear. All rights reserved.</span>
        <span>Privacy Policy · Terms of Service</span>
      </div>
    </footer>
  )
}
