import Image from 'next/image'
import Link from 'next/link'

export type VariantCardData = {
  id: string
  handle: string
  title: string
  colorName: string | null
  imageUrl: string
  imageAlt: string
  priceAmount: string
  priceCurrency: string
}

function fmt(amount: string, currency: string) {
  const n = Number(amount)
  if (Number.isNaN(n)) return `${amount} ${currency}`
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n)
}

export default function VariantCard({
  handle,
  title,
  colorName,
  imageUrl,
  imageAlt,
  priceAmount,
  priceCurrency,
}: VariantCardData) {
  return (
    <div className="product-card">
      <Link
        href={`/shop/${handle}`}
        className="product-card-link"
        aria-label={colorName ? `${title} — ${colorName}` : title}
        tabIndex={-1}
      />

      <div className="product-image">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          quality={90}
          sizes="(max-width: 768px) 50vw, 400px"
          style={{ objectFit: 'cover' }}
        />
        <div className="product-quick-add" role="presentation">
          <Link href={`/shop/${handle}`} className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </div>

      <div className="product-info">
        <Link href={`/shop/${handle}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-name">{title}</h3>
          {colorName && <p className="variant-card-color">{colorName}</p>}
        </Link>
        <div className="product-footer">
          <span className="product-price">{fmt(priceAmount, priceCurrency)}</span>
        </div>
      </div>
    </div>
  )
}
