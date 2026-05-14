export default function AnnouncementBar() {
  const message =
    'New summer collection just dropped  ·  Made in Brasil with love  ·  New summer collection just dropped  ·  Made in Brasil with love  ·  New summer collection just dropped  ·  Made in Brasil with love'

  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        <span>{message}</span>
        <span aria-hidden="true">{message}</span>
      </div>
    </div>
  )
}
