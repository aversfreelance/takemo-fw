import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCatalog } from '../catalog/CatalogProvider'
import { siteTitle } from '../catalog/labels'
import { OrderSteps } from '../components/OrderSteps'
import { PageHero } from '../components/PageHero'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'

export function StartPage() {
  const { copy, locale } = useLocale()
  const t = shopCopy(locale)
  const catalog = useCatalog()
  const { user } = useAuth()
  const [params] = useSearchParams()
  const [sent, setSent] = useState<{ token: string } | null>(null)
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError('')
    try {
      const order = await api.createOrder({
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        phone: String(data.get('phone') || ''),
        siteType: String(data.get('siteType') || ''),
        message: String(data.get('message') || ''),
        locale,
        siteId: params.get('site') || '',
        careId: params.get('care') || '',
        careTerm: params.get('term') || 'monthly',
        moduleIds: params.get('mods') || '',
      })
      localStorage.setItem('takemo-order', order.token)
      setSent({ token: order.token })
    } catch {
      setError('error')
    }
  }

  return (
    <div className="page-enter">
      <PageHero title={t.start}>{t.startLead}</PageHero>
      <section className="bg-wash pb-24">
        <div className="page-wrap max-w-3xl">
          <OrderSteps current="start" />
          {sent ? (
            <div className="mt-10 rounded-[18px] border-[3px] border-ink bg-[#ffd24a] p-8 font-bold">
              <p>{t.waiting}</p>
              <Link to={`/order/${sent.token}`} className="btn-primary mt-6">
                {t.continue}
              </Link>
            </div>
          ) : (
            <form className="mt-10 grid gap-3" onSubmit={onSubmit}>
              <input required name="name" placeholder={copy.name} className="field" defaultValue={user?.name} />
              <input required type="email" name="email" placeholder={copy.email} className="field" defaultValue={user?.email} />
              <input name="phone" placeholder={copy.phone} className="field" />
              <select name="siteType" className="field" defaultValue={params.get('site') || params.get('care') || ''}>
                <option value="">{t.siteNone}</option>
                {catalog.sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {siteTitle(site, locale)}
                  </option>
                ))}
                <option value="care">{t.careOnly}</option>
              </select>
              <textarea required name="message" rows={7} placeholder={copy.message} className="field resize-y" />
              <label className="flex items-center gap-2 text-sm font-bold">
                <input required type="checkbox" />
                {t.privacy}
              </label>
              {error ? <p className="font-bold text-brand">…</p> : null}
              <button type="submit" className="btn-primary w-fit">
                {t.send}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
