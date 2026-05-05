export default function AnnouncementBar() {
  const message = 'Free shipping on orders over $80  ·  New summer collection just dropped  ·  Made in Brasil with love  ·  Free shipping on orders over $80  ·  New summer collection just dropped  ·  Made in Brasil with love'

  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        <span>{message}</span>
        <span aria-hidden="true">{message}</span>
      </div>
    </div>
  )
}
