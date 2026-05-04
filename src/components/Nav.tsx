'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { getStoredCartId } from '@/lib/cart-storage'
import { SearchIcon, AccountIcon, CartIcon } from './icons'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
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
        <a aria-label="Search"><SearchIcon /></a>
        {/* <a href="#" aria-label="Account"><AccountIcon /></a> */}
        <Link
          href="/cart"
          className={`nav-cart-link${isActive('/cart') ? ' active' : ''}`}
          aria-label={
            cartQty > 0 ? `Cart, ${cartQty} item${cartQty === 1 ? '' : 's'}` : 'Cart'
          }
        >
          <span className="nav-cart-icon-wrap">
            <CartIcon />
            {cartQty > 0 ? (
              <span className="nav-cart-dot" aria-hidden />
            ) : null}
          </span>
        </Link>
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
