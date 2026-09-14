import { Link } from 'react-router-dom'
import { useCatalog } from '../catalog/CatalogProvider'
import { careText, careTitle } from '../catalog/labels'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { formatMoney, pickAmount } from '../lib/money'

export function MaintenancePage() {
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const catalog = useCatalog()

  return (
    <div className="page-enter">
      <PageHero title={t.care}>{t.careLead}</PageHero>
      <section className="bg-wash pb-24">
        <div className="page-wrap grid gap-4 lg:grid-cols-3">
          {catalog.care.map((pack, index) => (
            <Reveal key={pack.id} delay={index * 80} variant="zoom">
              <article className={`pack-card help-${pack.tone % 6}`}>
                <h2>{careTitle(pack, locale)}</h2>
                <p className="pack-price">
                  {formatMoney(pickAmount(pack.monthly, pack.monthlyHuf, locale), locale)}
                  <small> {t.monthly}</small>
                </p>
                <p className="mt-3 font-bold">{careText(pack, locale)}</p>
                <p className="mt-3 font-bold">
                  {pack.hours} {t.hours}
                </p>
                <p className="mt-1 font-bold">
                  {pack.responseHours} {t.response}
                </p>
                <p className="mt-6 font-bold">
                  {t.yearly}: {formatMoney(pickAmount(pack.yearly, pack.yearlyHuf, locale), locale)} · {t.yearlyNote}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  <Link to={`/start?care=${pack.id}&term=monthly`} className="btn-primary">
                    {t.monthly}
                  </Link>
                  <Link to={`/start?care=${pack.id}&term=yearly`} className="btn-outline">
                    {t.yearly}
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
