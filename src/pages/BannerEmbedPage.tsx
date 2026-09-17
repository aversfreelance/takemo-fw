import { Navigate, useParams } from 'react-router-dom'
import { BANNER_SIZES, SiteBanner, type BannerSize } from '../components/SiteBanner'

const ids = BANNER_SIZES.map((item) => item.id)

export function BannerEmbedPage() {
  const { size } = useParams()
  if (!size || !ids.includes(size as BannerSize)) return <Navigate to="/" replace />

  return (
    <div className="banner-embed">
      <SiteBanner size={size as BannerSize} />
    </div>
  )
}
