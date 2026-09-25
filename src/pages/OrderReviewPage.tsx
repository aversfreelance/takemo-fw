import { Navigate, useParams } from 'react-router-dom'
import { OrderPreviewPanel } from '../components/OrderPreviewPanel'
import { OrderSteps } from '../components/OrderSteps'
import { PageHero } from '../components/PageHero'
import { PriceBox } from '../components/PriceBox'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { canPayDeposit, depositConfirmed } from '../lib/orderStatus'
import { previewActive } from '../lib/preview'
import { useOrder } from '../lib/useOrder'

export function OrderReviewPage() {
  const { token } = useParams()
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { order, setOrder, error } = useOrder(token)

  if (error || !order) return <PageHero title={t.review}>{t.needAccept}</PageHero>
  if (!previewActive(order) && (canPayDeposit(order) || order.depositPending || !depositConfirmed(order))) {
    return <Navigate to={`/order/${order.token}/modules`} replace />
  }

  return (
    <div className="page-enter">
      <PageHero title={previewActive(order) ? t.previewTitle : t.review} />
      <section className="bg-wash pb-24">
        <div className="page-wrap max-w-3xl">
          <OrderSteps token={order.token} current="review" />
          {previewActive(order) ? (
            <OrderPreviewPanel order={order} onUpdate={setOrder} />
          ) : (
            <>
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
                  <dt>{t.websiteColors}</dt>
                  <dd>
                    {order.details?.palette &&
                    !['ink-red', 'ink-blue', 'ink-yellow', 'green', 'us'].includes(order.details.palette)
                      ? order.details.palette
                      : '—'}
                  </dd>
                </div>
                {order.details?.referenceFile1 || order.details?.referenceFile2 ? (
                  <div>
                    <dt>{t.referenceImages}</dt>
                    <dd className="flex flex-wrap gap-3">
                      {order.details.referenceFile1 ? (
                        <img src={order.details.referenceFile1} alt="" className="max-h-24 rounded border border-line" />
                      ) : null}
                      {order.details.referenceFile2 ? (
                        <img src={order.details.referenceFile2} alt="" className="max-h-24 rounded border border-line" />
                      ) : null}
                    </dd>
                  </div>
                ) : null}
              </dl>
              <div className="mt-8">
                <PriceBox totals={order.totals} />
              </div>
              {order.depositPending ? <p className="mt-8 font-bold">{t.paymentPending}</p> : null}
              <p className="mt-8 font-bold">{t.status[order.status]}</p>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
