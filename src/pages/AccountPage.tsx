import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api, type Order } from '../lib/api'
import { useAuth } from '../lib/auth'
import { formatMoney } from '../lib/money'

export function AccountPage() {
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    api.myOrders().then(setOrders).catch(() => setOrders([]))
  }, [])

  return (
    <div className="page-enter">
      <PageHero title={t.account}>{user?.email}</PageHero>
      <section className="bg-wash pb-24">
        <div className="page-wrap max-w-3xl">
          <div className="mb-8 flex flex-wrap gap-2">
            <Link to="/start" className="btn-primary">
              {t.start}
            </Link>
            <button
              type="button"
              className="btn-outline"
              onClick={() => void logout().then(() => navigate('/login'))}
            >
              {t.logout}
            </button>
          </div>
          <div className="grid gap-4">
            {orders.map((order) => (
              <Link key={order.id} to={`/order/${order.token}`} className="rounded-[18px] border-[3px] border-ink bg-white p-6 no-underline text-ink">
                <p className="text-xs font-extrabold uppercase text-brand">{t.status[order.status]}</p>
                <h2 className="mt-2 text-2xl font-extrabold">{order.details?.businessName || order.enquiry.name}</h2>
                <p className="mt-2 font-bold">{formatMoney(order.totals.gross, order.locale)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
