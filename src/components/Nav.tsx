'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SearchIcon, AccountIcon, CartIcon } from './icons'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isActive = (href: string) => pathname === href

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="mainNav">
      <div className="nav-logo-container">
        <Link href="/" className="nav-logo">
          <Image
            src="/images/Logo original colors.png"
            alt="Melancia"
            width={120}
            height={72}
            style={{ height: 48, width: 'auto' }}
            priority
          />
        </Link>
      </div>

      <div className="nav-links-container">
        <ul className={`nav-links${menuOpen ? ' nav-open' : ''}`}>
          <li><Link href="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
          <li><Link href="/shop" className={isActive('/shop') ? 'active' : ''}>Shop</Link></li>
          <li><Link href="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link></li>
        </ul>
      </div>

      <div className="nav-icons">
        <a href="#" aria-label="Search"><SearchIcon /></a>
        <a href="#" aria-label="Account"><AccountIcon /></a>
        <a href="#" aria-label="Cart"><CartIcon /></a>
      </div>

      <button
        className={`nav-hamburger${menuOpen ? ' is-open' : ''}`}
        aria-label="Menu"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        <span /><span /><span />
      </button>
    </nav>
  )
}
