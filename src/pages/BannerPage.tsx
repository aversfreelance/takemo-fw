import { BANNER_SIZES, SiteBanner } from '../components/SiteBanner'

export function BannerPage() {
  return (
    <div className="page-enter bg-wash pt-36 pb-20">
      <div className="page-wrap flex flex-col items-center gap-10 overflow-x-auto">
        {BANNER_SIZES.map((item) => (
          <div key={item.id} className={`banner-preview${item.id === '1080x1920' ? ' is-reel' : ''}`}>
            <p className="banner-preview-label">{item.w} × {item.h}</p>
            {item.id === '1080x1920' ? (
              <div className="banner-preview-frame">
                <SiteBanner size={item.id} />
              </div>
            ) : (
              <SiteBanner size={item.id} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
