import { Link } from 'react-router-dom'
import { useCatalog } from '../catalog/CatalogProvider'
import { sitePoints, siteTitle } from '../catalog/labels'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { formatMoney, pickAmount } from '../lib/money'

export function WebsitesPage() {
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const catalog = useCatalog()

  return (
    <div className="page-enter">
      <PageHero title={t.websites}>{t.websitesLead}</PageHero>
      <section className="bg-wash pb-24">
        <div className="page-wrap grid gap-4 md:grid-cols-2">
          {catalog.sites.map((site, index) => (
            <Reveal key={site.id} delay={index * 80} variant="zoom">
              <article id={site.id} className={`pack-card help-${site.tone % 6} scroll-mt-8`}>
                <h2>{siteTitle(site, locale)}</h2>
                <p className="pack-price">{formatMoney(pickAmount(site.price, site.priceHuf, locale), locale)}</p>
                <ul>
                  {sitePoints(site, locale).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <Link to={`/start?site=${site.id}`} className="btn-primary mt-8">
                  {t.choose}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
