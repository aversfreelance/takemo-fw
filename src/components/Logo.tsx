import { Link } from 'react-router-dom'

export function Logo({ light = false, footer = false }: { light?: boolean; footer?: boolean }) {
  const src = footer || light ? '/logos/takemo-footer-logo.png' : '/logos/takemo-logo.png'
  const height = footer ? 'h-12 md:h-14' : 'h-11 md:h-[52px]'

  return (
    <Link to="/" className="logo-in inline-flex items-center no-underline" aria-label="Takemo — Take Mee Online">
      <img
        src={src}
        alt="Takemo — Take Mee Online"
        className={`${height} w-auto ${light ? 'brightness-0 invert' : ''}`}
      />
    </Link>
  )
}
