import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { OrderSteps } from '../components/OrderSteps'
import { PageHero } from '../components/PageHero'
import { PriceBox } from '../components/PriceBox'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api, contractUrl, invoiceUrl } from '../lib/api'
import { useOrder } from '../lib/useOrder'

export function OrderPayPage() {
  const { token } = useParams()
  const [params] = useSearchParams()
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { order, setOrder, error } = useOrder(token)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!token || params.get('paid') !== '1') return
    api.getOrder(token).then(setOrder)
  }, [params, token, setOrder])

  if (error || !order) return <PageHero title={t.pay}>{t.needAccept}</PageHero>

  async function pay() {
    if (!order) return
    setBusy(true)
    try {
      if (order.stripeEnabled) {
        const { url } = await api.checkout(order.token)
        window.location.href = url
        return
      }
      setOrder(await api.demoPay(order.token))
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
          <div className="mt-10">
            <PriceBox totals={order.totals} />
          </div>
          {order.status === 'ready' ? (
            <button type="button" className="btn-primary mt-8" disabled={busy} onClick={() => void pay()}>
              {order.stripeEnabled ? t.payCard : t.demoPay}
            </button>
          ) : null}
          {order.status === 'paid' || order.status === 'delivered' ? (
            <div className="mt-8 font-bold">
              <p>{t.paid}</p>
              <a href={contractUrl(order.token)} className="btn-primary mt-6" target="_blank" rel="noreferrer">
                {t.contract}
              </a>
              {order.status === 'delivered' ? (
                <a href={invoiceUrl(order.token)} className="btn-outline mt-4 ml-3" target="_blank" rel="noreferrer">
                  {t.invoice}
                </a>
              ) : null}
            </div>
          ) : null}
          {order.status !== 'ready' && order.status !== 'paid' && order.status !== 'delivered' ? (
            <p className="mt-8 font-bold">{t.status[order.status]}</p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
