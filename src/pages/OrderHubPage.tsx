import { Link, useParams } from 'react-router-dom'
import { OrderPreviewPanel } from '../components/OrderPreviewPanel'
import { OrderSteps } from '../components/OrderSteps'
import { PageHero } from '../components/PageHero'
import { PriceBox } from '../components/PriceBox'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { contractUrl, depositInvoiceUrl, handoverUrl, invoiceUrl } from '../lib/api'
import { hasHandover } from '../lib/handover'
import { canPayDeposit, depositConfirmed } from '../lib/orderStatus'
import { previewActive, previewApproved } from '../lib/preview'
import { useOrder } from '../lib/useOrder'

export function OrderHubPage() {
  const { token } = useParams()
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { order, setOrder, error } = useOrder(token)

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
        : canPayDeposit(order) || order.depositPending
          ? `/order/${order.token}/modules`
          : order.status === 'paid' && !previewApproved(order)
              ? `/order/${order.token}/preview`
              : order.status === 'delivered' && order.balanceDue && !order.balancePaidAt
                ? `/order/${order.token}/pay`
                : order.status === 'paid' || order.status === 'delivered'
                  ? `/order/${order.token}/review`
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
            {order.depositPending || order.balancePending ? t.paymentPending : null}
            {order.status === 'delivered' && order.balanceDue && !order.balancePaidAt && !order.balancePending
              ? t.paymentSent
              : null}
            {order.status === 'paid' && previewApproved(order) ? t.previewApproved : null}
          </p>
          <div className="mt-8">
            <PriceBox totals={order.totals} />
          </div>
          {previewActive(order) ? <OrderPreviewPanel order={order} onUpdate={setOrder} /> : null}
          {next ? (
            <Link to={next} className="btn-primary mt-8">
              {order.status === 'paid' && !previewApproved(order) ? t.previewTitle : t.continue}
            </Link>
          ) : null}
          {depositConfirmed(order) ? (
            <>
              <a href={contractUrl(order.token)} className="btn-outline mt-4 ml-3" target="_blank" rel="noreferrer">
                {t.contract}
              </a>
              <a href={depositInvoiceUrl(order.token)} className="btn-outline mt-4 ml-3" target="_blank" rel="noreferrer">
                {t.depositInvoice}
              </a>
            </>
          ) : null}
          {order.status === 'delivered' && order.balancePaidAt ? (
            <>
              <a href={invoiceUrl(order.token)} className="btn-outline mt-4 ml-3" target="_blank" rel="noreferrer">
                {t.invoice}
              </a>
              {hasHandover(order) ? (
                <a href={handoverUrl(order.token)} className="btn-outline mt-4 ml-3" target="_blank" rel="noreferrer">
                  {t.handoverDoc}
                </a>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </div>
  )
}
