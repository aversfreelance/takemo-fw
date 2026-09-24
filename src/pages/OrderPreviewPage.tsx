import { useParams } from 'react-router-dom'
import { OrderPreviewPanel } from '../components/OrderPreviewPanel'
import { OrderSteps } from '../components/OrderSteps'
import { PageHero } from '../components/PageHero'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { previewActive } from '../lib/preview'
import { useOrder } from '../lib/useOrder'

export function OrderPreviewPage() {
  const { token } = useParams()
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { order, setOrder, error } = useOrder(token)

  if (error || !order) return <PageHero title={t.previewTitle}>{t.needAccept}</PageHero>
  if (!previewActive(order)) return <PageHero title={t.previewTitle}>{t.previewNotReady}</PageHero>

  return (
    <div className="page-enter">
      <PageHero title={t.previewTitle} />
      <section className="bg-wash pb-24">
        <div className="page-wrap max-w-3xl">
          <OrderSteps token={order.token} current="review" />
          <OrderPreviewPanel order={order} onUpdate={setOrder} />
        </div>
      </section>
    </div>
  )
}
