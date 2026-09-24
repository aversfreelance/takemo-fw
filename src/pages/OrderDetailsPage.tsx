import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OrderSteps } from '../components/OrderSteps'
import { PageHero } from '../components/PageHero'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api } from '../lib/api'
import { useOrder } from '../lib/useOrder'

export function OrderDetailsPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { order, error } = useOrder(token)
  const [logoMode, setLogoMode] = useState<'upload' | 'us'>('us')

  useEffect(() => {
    if (order?.details?.logoMode) setLogoMode(order.details.logoMode)
  }, [order])

  if (error || !order) return <PageHero title={t.details}>{t.needAccept}</PageHero>
  if (order.status === 'enquiry' || order.status === 'declined') {
    return <PageHero title={t.details}>{order.status === 'declined' ? t.declined : t.waiting}</PageHero>
  }

  const site = order.selection.siteId || order.enquiry.siteType
  const legacyPalettes = new Set(['ink-red', 'ink-blue', 'ink-yellow', 'green', 'us'])
  const colorDefault =
    order.details?.palette && !legacyPalettes.has(order.details.palette) ? order.details.palette : ''

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    data.set('logoMode', logoMode)
    const next = await api.saveDetails(token as string, data)
    navigate(`/order/${next.token}/modules`)
  }

  return (
    <div className="page-enter">
      <PageHero title={t.details}>
        <p className="font-bold">{t.detailsCustomNote}</p>
      </PageHero>
      <section className="bg-wash pb-24">
        <div className="page-wrap max-w-3xl">
          <OrderSteps token={order.token} current="details" />
          <form className="mt-10 grid gap-3" onSubmit={onSubmit}>
            <input required name="businessName" placeholder={t.businessName} className="field" defaultValue={order.details?.businessName} />
            <input name="companyNumber" placeholder={t.companyNumber} className="field" defaultValue={order.details?.companyNumber} />
            <textarea name="address" placeholder={t.address} rows={3} className="field resize-y" defaultValue={order.details?.address} />
            <input name="vatNumber" placeholder={t.vatNumber} className="field" defaultValue={order.details?.vatNumber} />
            <input name="domain" placeholder={t.domain} className="field" defaultValue={order.details?.domain} />

            <div className="flex flex-wrap gap-2">
              <button type="button" className={logoMode === 'us' ? 'btn-primary' : 'btn-outline'} onClick={() => setLogoMode('us')}>
                {t.logoUs}
              </button>
              <button type="button" className={logoMode === 'upload' ? 'btn-primary' : 'btn-outline'} onClick={() => setLogoMode('upload')}>
                {t.logoUpload}
              </button>
            </div>
            {logoMode === 'upload' ? <input type="file" name="logo" accept="image/*" className="field" /> : null}

            <input name="colors" placeholder={t.websiteColors} className="field" defaultValue={colorDefault} />

            <div className="grid gap-2">
              <p className="font-extrabold">{t.referenceImages}</p>
              <input type="file" name="reference1" accept="image/*" className="field" />
              <input type="file" name="reference2" accept="image/*" className="field" />
            </div>

            <textarea name="content" rows={5} placeholder={t.content} className="field resize-y" defaultValue={order.details?.content} />
            {site === 'shop' ? (
              <>
                <input name="products" placeholder={t.products} className="field" defaultValue={order.details?.products} />
                <input name="frequency" placeholder={t.frequency} className="field" defaultValue={order.details?.frequency} />
              </>
            ) : null}
            {site === 'media' ? (
              <input name="mediaKind" placeholder={t.mediaKind} className="field" defaultValue={order.details?.mediaKind} />
            ) : null}

            <button type="submit" className="btn-primary mt-4 w-fit">
              {t.continue}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
