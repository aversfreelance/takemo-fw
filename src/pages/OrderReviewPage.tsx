import { Link, useParams } from 'react-router-dom'
import { OrderSteps } from '../components/OrderSteps'
import { PageHero } from '../components/PageHero'
import { PriceBox } from '../components/PriceBox'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { useOrder } from '../lib/useOrder'

export function OrderReviewPage() {
  const { token } = useParams()
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { order, error } = useOrder(token)

  if (error || !order) return <PageHero title={t.review}>{t.needAccept}</PageHero>

  return (
    <div className="page-enter">
      <PageHero title={t.review} />
      <section className="bg-wash pb-24">
        <div className="page-wrap max-w-3xl">
          <OrderSteps token={order.token} current="review" />
          <dl className="review-list mt-10">
            <div>
              <dt>{t.businessName}</dt>
              <dd>{order.details?.businessName || '—'}</dd>
            </div>
            <div>
              <dt>{t.domain}</dt>
              <dd>{order.details?.domain || '—'}</dd>
            </div>
            <div>
              <dt>{t.palette}</dt>
              <dd>{t.palettes[(order.details?.palette as keyof typeof t.palettes) || 'us']}</dd>
            </div>
          </dl>
          <div className="mt-8">
            <PriceBox totals={order.totals} />
          </div>
          <p className="mt-8 font-bold">{t.status[order.status]}</p>
          {order.status === 'ready' ? (
            <Link to={`/order/${order.token}/pay`} className="btn-primary mt-6">
              {t.pay}
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  )
}
