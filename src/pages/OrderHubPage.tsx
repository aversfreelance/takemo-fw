import { Link, useParams } from 'react-router-dom'
import { OrderSteps } from '../components/OrderSteps'
import { PageHero } from '../components/PageHero'
import { PriceBox } from '../components/PriceBox'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { contractUrl, invoiceUrl } from '../lib/api'
import { useOrder } from '../lib/useOrder'

export function OrderHubPage() {
  const { token } = useParams()
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { order, error } = useOrder(token)

  if (error || !order) {
    return (
      <div className="page-enter">
        <PageHero title={t.start}>{t.needAccept}</PageHero>
      </div>
    )
  }

  const next =
    order.status === 'accepted'
      ? `/order/${order.token}/details`
      : order.status === 'details'
        ? `/order/${order.token}/modules`
        : order.status === 'review'
          ? `/order/${order.token}/review`
          : order.status === 'ready' || order.status === 'paid' || order.status === 'delivered'
            ? `/order/${order.token}/pay`
            : ''

  return (
    <div className="page-enter">
      <PageHero title={t.status[order.status]} />
      <section className="bg-wash pb-24">
        <div className="page-wrap max-w-3xl">
          <OrderSteps token={order.token} current="start" />
          <p className="mt-8 font-bold">
            {order.status === 'enquiry' ? t.waiting : null}
            {order.status === 'declined' ? t.declined : null}
            {order.status === 'accepted' ? t.accepted : null}
            {order.status === 'paid' ? t.paid : null}
          </p>
          <div className="mt-8">
            <PriceBox totals={order.totals} />
          </div>
          {next ? (
            <Link to={next} className="btn-primary mt-8">
              {t.continue}
            </Link>
          ) : null}
          {order.status === 'paid' || order.status === 'delivered' ? (
            <a href={contractUrl(order.token)} className="btn-outline mt-4 ml-3" target="_blank" rel="noreferrer">
              {t.contract}
            </a>
          ) : null}
          {order.status === 'delivered' ? (
            <a href={invoiceUrl(order.token)} className="btn-outline mt-4 ml-3" target="_blank" rel="noreferrer">
              {t.invoice}
            </a>
          ) : null}
        </div>
      </section>
    </div>
  )
}
