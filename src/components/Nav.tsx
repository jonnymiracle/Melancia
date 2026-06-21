'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { getStoredCartId } from '@/lib/cart-storage'
import { BagIcon } from './icons'


export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartQty, setCartQty] = useState(0)
  const pathname = usePathname()

  const syncCartQty = useCallback(async () => {
    const id = getStoredCartId()
    if (!id) {
      setCartQty(0)
      return
    }
    try {
      const res = await fetch(
        `/api/shopify/cart?cartId=${encodeURIComponent(id)}`,
      )
      const body = await res.json()
      const q = body.data?.cart?.totalQuantity
      setCartQty(typeof q === 'number' ? q : 0)
    } catch {
      setCartQty(0)
    }
  }, [])

  useEffect(() => {
    void syncCartQty()
    window.addEventListener('melancia-cart-updated', syncCartQty)
    return () =>
      window.removeEventListener('melancia-cart-updated', syncCartQty)
  }, [syncCartQty])

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      // Hide on scroll down (past 80px), show on scroll up
      if (y > 80) {
        setNavHidden(y > lastY)
      } else {
        setNavHidden(false)
      }
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isActive = (href: string) => pathname === href

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}${navHidden ? ' nav-hidden' : ''}${menuOpen ? ' menu-open' : ''}`} id="mainNav">

      {/* Left: Shop + Our Story */}
      <div className="nav-links-container">
        <Link href="/shop" className={isActive('/shop') ? 'active' : ''}>Shop</Link>
        <Link href="/about" className={isActive('/about') ? 'active' : ''}>Our Story</Link>
      </div>

      {/* Center: logo */}
      <div className="nav-logo-container">
        <Link href="/" className="nav-logo">
          <Image
            src="/images/Logo original colors.png"
            alt="Melancia"
            width={160}
            height={64}
            style={{ height: 64, width: 'auto' }}
            priority
          />
        </Link>
      </div>

      {/* Right: Journal + Contact (mirrors left column) */}
      <div className="nav-links-right">
        <Link href="/blog" className={pathname.startsWith('/blog') ? 'active' : ''}>Journal</Link>
        <Link href="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link>
      </div>

      {/* Cart + hamburger — absolutely positioned so they don't affect grid symmetry */}
      <div className="nav-icons">
        <Link
          href="/cart"
          className={`nav-cart-link${isActive('/cart') ? ' active' : ''}`}
          aria-label={
            cartQty > 0
              ? `Shopping bag, ${cartQty} item${cartQty === 1 ? '' : 's'}`
              : 'Shopping bag'
          }
        >
          <span className="nav-cart-icon-wrap">
            <BagIcon />
            {cartQty > 0 ? (
              <span className="nav-cart-dot" aria-hidden />
            ) : null}
          </span>
        </Link>
        <button
          className={`nav-hamburger${menuOpen ? ' is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer — all 4 links, shown when hamburger open */}
      <ul className={`nav-mobile-menu${menuOpen ? ' nav-open' : ''}`} id="nav-menu">
        <li><Link href="/shop" className={isActive('/shop') ? 'active' : ''}>Shop</Link></li>
        <li><Link href="/about" className={isActive('/about') ? 'active' : ''}>Our Story</Link></li>
        <li><Link href="/blog" className={pathname.startsWith('/blog') ? 'active' : ''}>Journal</Link></li>
        <li><Link href="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link></li>
      </ul>

    </nav>
  )
}
