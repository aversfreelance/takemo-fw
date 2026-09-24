import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { AdminCatalog } from '../components/AdminCatalog'
import { AdminCompany } from '../components/AdminCompany'
import { formatMoney } from '../lib/money'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api, contractUrl, handoverUrl, invoiceUrl, type Order } from '../lib/api'
import { handoverText, hasHandover } from '../lib/handover'
import { orderCardClass } from '../lib/orderStatus'
import { useAuth } from '../lib/auth'

export function AdminPage() {
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(Boolean(user?.admin || sessionStorage.getItem('takemo-admin')))
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<'prices' | 'orders' | 'company'>('orders')
  const [askPaid, setAskPaid] = useState<{ id: string; step: 1 | 2 } | null>(null)
  const [actError, setActError] = useState('')
  const [handover, setHandover] = useState<Record<string, string>>({})
  const [previewUrl, setPreviewUrl] = useState<Record<string, string>>({})

  async function load() {
    const next = await api.listOrders()
    setOrders(next)
    setHandover((current) => {
      const merged = { ...current }
      for (const order of next) {
        merged[order.id] = handoverText(order)
      }
      return merged
    })
    setPreviewUrl((current) => {
      const merged = { ...current }
      for (const order of next) {
        merged[order.id] = order.previewUrl || ''
      }
      return merged
    })
  }

  useEffect(() => {
    if (user?.admin) setAuthed(true)
  }, [user])

  useEffect(() => {
    if (authed) void load().catch(() => setAuthed(false))
  }, [authed])

  if (user && !user.admin && !sessionStorage.getItem('takemo-admin')) {
    return <Navigate to="/" replace />
  }

  async function login(event: FormEvent) {
    event.preventDefault()
    const { token } = await api.login(password)
    sessionStorage.setItem('takemo-admin', token)
    setAuthed(true)
  }

  function handoverFor(id: string) {
    return handover[id] || ''
  }

  function previewFor(id: string) {
    return previewUrl[id] || ''
  }

  async function act(id: string, action: string, body?: { text?: string; previewUrl?: string }) {
    setActError('')
    try {
      await api.act(id, action, { text: handoverFor(id), previewUrl: previewFor(id), ...body })
      await load()
      setAskPaid(null)
    } catch {
      setActError(action)
    }
  }

  const asking = askPaid ? orders.find((item) => item.id === askPaid.id) : null

  if (!authed) {
    return (
      <section className="page-enter bg-wash pt-36 pb-24">
        <form className="page-wrap max-w-md" onSubmit={(event) => void login(event)}>
          <h1 className="section-title left">{t.admin}</h1>
          <input
            type="password"
            className="field mt-8"
            placeholder={t.password}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit" className="btn-primary mt-4">
            {t.login}
          </button>
        </form>
      </section>
    )
  }

  return (
    <section className="page-enter bg-wash pt-36 pb-24">
      <div className="page-wrap">
        <h1 className="section-title left">{t.admin}</h1>
        <div className="mt-8 flex flex-wrap gap-2">
          <button type="button" className={tab === 'prices' ? 'btn-primary' : 'btn-outline'} onClick={() => setTab('prices')}>
            {t.prices}
          </button>
          <button type="button" className={tab === 'orders' ? 'btn-primary' : 'btn-outline'} onClick={() => setTab('orders')}>
            {t.orders}
          </button>
          <button type="button" className={tab === 'company' ? 'btn-primary' : 'btn-outline'} onClick={() => setTab('company')}>
            {t.company}
          </button>
        </div>
        {actError ? <p className="mt-6 font-extrabold text-brand">…</p> : null}
        {tab === 'prices' ? <AdminCatalog /> : null}
        {tab === 'company' ? <AdminCompany /> : null}
        {tab === 'orders' ? (
        <div className="mt-10 grid gap-4">
          {orders.map((order) => (
            <article key={order.id} className={`rounded-[18px] border-[3px] p-6 ${orderCardClass(order)}`}>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand">{t.status[order.status]}</p>
              <h2 className="mt-2 text-2xl font-extrabold">
                {order.details?.businessName || order.enquiry.name} · {order.id}
              </h2>
              <p className="mt-2 font-bold">
                {order.enquiry.email} · {order.enquiry.phone}
              </p>
              <p className="mt-3 font-bold">{order.enquiry.message}</p>
              <p className="mt-4 font-extrabold">
                {formatMoney(order.totals.gross, order.locale)} · 20% {formatMoney(order.totals.deposit, order.locale)} · 80%{' '}
                {formatMoney(order.totals.remainder, order.locale)}
              </p>
              {order.depositPending ? (
                <p className="mt-4 font-extrabold text-brand">{t.paymentPending} — 20%</p>
              ) : null}
              {order.balancePending ? (
                <p className="mt-4 font-extrabold text-brand">{t.paymentPending} — 80%</p>
              ) : null}
              {order.status === 'paid' ? (
                <div className="mt-5 grid gap-3">
                  <p className="font-extrabold">{t.previewTitle}</p>
                  <label className="grid gap-1">
                    <span className="text-sm font-extrabold uppercase tracking-[0.12em]">{t.previewUrl}</span>
                    <input
                      className="field"
                      value={previewFor(order.id)}
                      onChange={(event) => setPreviewUrl((current) => ({ ...current, [order.id]: event.target.value }))}
                      placeholder="https://…vercel.app"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="btn-outline" onClick={() => void act(order.id, 'set-preview')}>
                      {t.savePreviewUrl}
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={!previewFor(order.id).trim()}
                      onClick={() => void act(order.id, 'send-preview')}
                    >
                      {order.previewSentAt && !order.previewFeedback ? t.previewSent : t.sendPreview}
                    </button>
                  </div>
                  {order.previewRound ? (
                    <p className="text-sm font-bold">
                      {t.previewRound}: {order.previewRound}
                    </p>
                  ) : null}
                  {order.previewFeedback ? (
                    <div className="rounded-[12px] border-2 border-brand bg-white p-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand">{t.previewFeedback}</p>
                      <p className="mt-2 font-bold">{order.previewFeedback}</p>
                    </div>
                  ) : null}
                  {order.previewApprovedAt ? (
                    <p className="font-extrabold text-[#15803d]">{t.previewApproved}</p>
                  ) : null}
                </div>
              ) : null}
              {order.status === 'delivered' || order.status === 'paid' ? (
                <div className="mt-5 grid gap-3">
                  <p className="font-extrabold">{t.handoverTitle}</p>
                  <p className="text-sm font-bold">{t.handoverLead}</p>
                  <textarea
                    className="field min-h-40"
                    value={handoverFor(order.id)}
                    onChange={(event) => setHandover((current) => ({ ...current, [order.id]: event.target.value }))}
                  />
                  <button type="button" className="btn-outline" onClick={() => void act(order.id, 'handover')}>
                    {t.saveHandover}
                  </button>
                </div>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2">
                {order.status === 'enquiry' ? (
                  <>
                    <button type="button" className="btn-primary" onClick={() => void act(order.id, 'accept')}>
                      {t.accept}
                    </button>
                    <button type="button" className="btn-outline" onClick={() => void act(order.id, 'decline')}>
                      {t.decline}
                    </button>
                  </>
                ) : null}
                {order.status === 'review' || order.status === 'details' ? (
                  <button type="button" className="btn-primary" onClick={() => void act(order.id, 'ready')}>
                    {t.ready}
                  </button>
                ) : null}
                {order.depositPending ? (
                  <button type="button" className="btn-primary" onClick={() => void act(order.id, 'confirm-deposit')}>
                    {t.paymentReceived}
                  </button>
                ) : null}
                {order.status === 'ready' && !order.depositPending ? (
                  <button type="button" className="btn-outline" onClick={() => void act(order.id, 'paid')}>
                    {t.demoPay}
                  </button>
                ) : null}
                {order.status === 'paid' ? (
                  <button
                    type="button"
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!order.previewApprovedAt}
                    onClick={() => void act(order.id, 'deliver')}
                  >
                    {t.status.delivered}
                  </button>
                ) : null}
                {order.status === 'delivered' && !order.balancePaidAt ? (
                  <>
                    <button
                      type="button"
                      className="btn-primary cursor-not-allowed opacity-70 disabled:pointer-events-none"
                      disabled={order.balanceDue}
                      onClick={() => void act(order.id, 'balance-due')}
                    >
                      {order.balanceDue ? t.cardPaymentSent : t.payCard}
                    </button>
                    {order.balancePending ? (
                      <button type="button" className="btn-primary" onClick={() => void act(order.id, 'confirm-balance')}>
                        {t.paymentReceived}
                      </button>
                    ) : (
                      <button type="button" className="btn-outline" onClick={() => setAskPaid({ id: order.id, step: 1 })}>
                        {t.alreadyPaid}
                      </button>
                    )}
                  </>
                ) : null}
                {order.status === 'paid' || order.status === 'delivered' ? (
                  <a href={contractUrl(order.token)} className="btn-outline" target="_blank" rel="noreferrer">
                    {t.contract}
                  </a>
                ) : null}
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
            </article>
          ))}
        </div>
        ) : null}
      </div>
      {askPaid && asking ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-ink/60" aria-label="Close" onClick={() => setAskPaid(null)} />
          <div className="relative w-full max-w-md rounded-[18px] border-[3px] border-ink bg-white p-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-brand">
              {askPaid.step === 1 ? '1 / 2' : '2 / 2'}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold">
              {t.alreadyPaid}?
            </h2>
            <p className="mt-4 text-2xl font-extrabold">
              80% {formatMoney(asking.totals.remainder, asking.locale)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {askPaid.step === 1 ? (
                <button type="button" className="btn-primary" onClick={() => setAskPaid({ id: askPaid.id, step: 2 })}>
                  {t.alreadyPaid}
                </button>
              ) : (
                <button type="button" className="btn-primary" onClick={() => void act(askPaid.id, 'balance')}>
                  {t.alreadyPaid}
                </button>
              )}
              <button type="button" className="btn-outline" onClick={() => setAskPaid(null)}>
                ×
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
