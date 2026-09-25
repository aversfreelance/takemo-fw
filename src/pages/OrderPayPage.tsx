import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { OrderSteps } from '../components/OrderSteps'
import { PageHero } from '../components/PageHero'
import { PriceBox } from '../components/PriceBox'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api, contractUrl, handoverUrl, invoiceUrl } from '../lib/api'
import { hasHandover } from '../lib/handover'
import { orderCardClass } from '../lib/orderStatus'
import { useOrder } from '../lib/useOrder'

export function OrderPayPage() {
  const { token } = useParams()
  const [params] = useSearchParams()
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { order, setOrder, error } = useOrder(token)
  const [busy, setBusy] = useState(false)
  const [payError, setPayError] = useState(false)
  const [payFailed, setPayFailed] = useState(false)

  useEffect(() => {
    if (!token || params.get('paid') !== '1') return
    api
      .confirmPay(token)
      .then(({ order: next, checkout }) => {
        setOrder(next)
        setPayFailed(checkout === 'failed')
      })
      .catch(() => api.getOrder(token).then(setOrder))
  }, [params, token, setOrder])

  if (error || !order) return <PageHero title={t.pay}>{t.needAccept}</PageHero>

  async function pay(kind: 'balance' = 'balance') {
    if (!order) return
    setBusy(true)
    setPayError(false)
    try {
      if (order.stripeEnabled) {
        const { url } = await api.checkout(order.token, kind)
        window.location.href = url
        return
      }
      setOrder(await api.demoPay(order.token))
    } catch {
      setPayError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page-enter">
      <PageHero title={t.pay} />
      <section className="bg-wash pb-24">
        <div className="page-wrap max-w-3xl">
          <OrderSteps token={order.token} current="pay" />
          <div className={`mt-10 rounded-[18px] border-[3px] p-6 ${orderCardClass(order)}`}>
            <PriceBox totals={order.totals} sticky={false} />
            {payError || payFailed ? <p className="mt-6 font-extrabold text-brand">{t.payFailed}</p> : null}
            {order.balancePaidAt ? (
              <p className="mt-6 text-xl font-extrabold">{t.paidFull}</p>
            ) : order.balancePending || order.depositPending ? (
              <p className="mt-6 text-xl font-extrabold">{t.paymentPending}</p>
            ) : order.status === 'paid' || order.status === 'delivered' ? (
              <p className="mt-6 font-extrabold">{t.paid}</p>
            ) : null}
            {order.status === 'delivered' && order.balanceDue && !order.balancePaidAt && !order.balancePending ? (
              <button type="button" className="btn-primary mt-8" disabled={busy} onClick={() => void pay('balance')}>
                {t.payCard} — {t.remainder}
              </button>
            ) : null}
            {order.status === 'paid' || order.status === 'delivered' ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={contractUrl(order.token)} className="btn-primary" target="_blank" rel="noreferrer">
                  {t.contract}
                </a>
                {order.status === 'delivered' && order.balancePaidAt ? (
                  <>
                    <a href={invoiceUrl(order.token)} className="btn-outline" target="_blank" rel="noreferrer">
                      {t.invoice}
                    </a>
                    {hasHandover(order) ? (
                      <a href={handoverUrl(order.token)} className="btn-outline" target="_blank" rel="noreferrer">
                        {t.handoverDoc}
                      </a>
                    ) : null}
                  </>
                ) : null}
              </div>
            ) : null}
            {order.status !== 'paid' && order.status !== 'delivered' ? (
              <p className="mt-6 font-bold">{t.status[order.status]}</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
