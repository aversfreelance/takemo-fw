import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ModulePicker, type Selection } from '../components/ModulePicker'
import { OrderSteps } from '../components/OrderSteps'
import { PageHero } from '../components/PageHero'
import { PriceBox } from '../components/PriceBox'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api, depositInvoiceUrl } from '../lib/api'
import { canPayDeposit, depositConfirmed, orderCardClass } from '../lib/orderStatus'
import { useOrder } from '../lib/useOrder'

export function OrderModulesPage() {
  const { token } = useParams()
  const [params] = useSearchParams()
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { order, setOrder, error } = useOrder(token)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [busy, setBusy] = useState(false)
  const [payError, setPayError] = useState(false)
  const [payFailed, setPayFailed] = useState(false)

  useEffect(() => {
    if (!order) return
    setSelection({
      siteId: order.selection.siteId,
      moduleIds: order.selection.moduleIds,
      careId: order.selection.careId,
      careTerm: order.selection.careTerm || 'monthly',
    })
  }, [order])

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

  if (error || !order) return <PageHero title={t.modules}>{t.needAccept}</PageHero>
  if (['enquiry', 'declined'].includes(order.status)) {
    return <PageHero title={t.modules}>{t.needAccept}</PageHero>
  }
  if (!selection) return null

  const modulesLocked = order.status !== 'accepted' && order.status !== 'details'
  const showDeposit = canPayDeposit(order) || order.depositPending

  async function saveModules() {
    if (!order || !selection) return
    setBusy(true)
    setPayError(false)
    try {
      await api.saveSelection(order.token, selection)
      setOrder(await api.submitReview(order.token))
    } finally {
      setBusy(false)
    }
  }

  async function payDeposit() {
    if (!order) return
    setBusy(true)
    setPayError(false)
    try {
      if (order.stripeEnabled) {
        const { url } = await api.checkout(order.token, 'deposit')
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
      <PageHero title={t.modules}>{t.modulesLead}</PageHero>
      <section className="bg-wash pb-24">
        <div className="page-wrap max-w-3xl">
          <OrderSteps token={order.token} current="modules" />
          <div className="mt-10">
            <ModulePicker value={selection} onChange={setSelection} />
          </div>

          {!modulesLocked ? (
            <button type="button" className="btn-primary mt-10" disabled={busy} onClick={() => void saveModules()}>
              {t.continue}
            </button>
          ) : null}

          {showDeposit ? (
            <div className={`mt-10 rounded-[18px] border-[3px] p-6 ${orderCardClass(order)}`}>
              <p className="font-extrabold">{t.deposit}</p>
              <div className="mt-4">
                <PriceBox totals={order.totals} />
              </div>
              {payError || payFailed ? <p className="mt-6 font-extrabold text-brand">{t.payFailed}</p> : null}
              {order.depositPending ? (
                <p className="mt-6 text-xl font-extrabold">{t.paymentPending}</p>
              ) : order.paidAt ? (
                <p className="mt-6 font-extrabold">{t.paid}</p>
              ) : (
                <button type="button" className="btn-primary mt-8" disabled={busy} onClick={() => void payDeposit()}>
                  {order.stripeEnabled ? `${t.payCard} — ${t.deposit}` : t.demoPay}
                </button>
              )}
            </div>
          ) : null}

          {depositConfirmed(order) ? (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={`/order/${order.token}/review`} className="btn-primary">
                {t.review}
              </Link>
              <a href={depositInvoiceUrl(order.token)} className="btn-outline" target="_blank" rel="noreferrer">
                {t.depositInvoice}
              </a>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
