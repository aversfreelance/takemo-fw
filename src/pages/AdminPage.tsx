import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { AdminCatalog } from '../components/AdminCatalog'
import { formatMoney } from '../lib/money'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api, contractUrl, invoiceUrl, type Order } from '../lib/api'
import { useAuth } from '../lib/auth'

export function AdminPage() {
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(Boolean(user?.admin || sessionStorage.getItem('takemo-admin')))
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<'prices' | 'orders'>('prices')

  async function load() {
    setOrders(await api.listOrders())
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

  async function act(id: string, action: string) {
    await api.act(id, action)
    await load()
  }

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
        </div>
        {tab === 'prices' ? <AdminCatalog /> : null}
        {tab === 'orders' ? (
        <div className="mt-10 grid gap-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-[18px] border-[3px] border-ink bg-white p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand">{t.status[order.status]}</p>
              <h2 className="mt-2 text-2xl font-extrabold">
                {order.details?.businessName || order.enquiry.name} · {order.id}
              </h2>
              <p className="mt-2 font-bold">
                {order.enquiry.email} · {order.enquiry.phone}
              </p>
              <p className="mt-3 font-bold">{order.enquiry.message}</p>
              <p className="mt-4 font-extrabold">
                {formatMoney(order.totals.gross, order.locale)} · 20% {formatMoney(order.totals.deposit, order.locale)}
              </p>
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
                {order.status === 'ready' ? (
                  <button type="button" className="btn-outline" onClick={() => void act(order.id, 'paid')}>
                    {t.demoPay}
                  </button>
                ) : null}
                {order.status === 'paid' ? (
                  <button type="button" className="btn-primary" onClick={() => void act(order.id, 'deliver')}>
                    {t.delivered}
                  </button>
                ) : null}
                {order.status === 'paid' || order.status === 'delivered' ? (
                  <a href={contractUrl(order.token)} className="btn-outline" target="_blank" rel="noreferrer">
                    {t.contract}
                  </a>
                ) : null}
                {order.status === 'delivered' ? (
                  <a href={invoiceUrl(order.token)} className="btn-outline" target="_blank" rel="noreferrer">
                    {t.invoice}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        ) : null}
      </div>
    </section>
  )
}
