import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ModulePicker, type Selection } from '../components/ModulePicker'
import { OrderSteps } from '../components/OrderSteps'
import { PageHero } from '../components/PageHero'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api } from '../lib/api'
import { useOrder } from '../lib/useOrder'

export function OrderModulesPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const { order, error } = useOrder(token)
  const [selection, setSelection] = useState<Selection | null>(null)

  useEffect(() => {
    if (!order) return
    setSelection({
      siteId: order.selection.siteId,
      moduleIds: order.selection.moduleIds,
      careId: order.selection.careId,
      careTerm: order.selection.careTerm || 'monthly',
    })
  }, [order])

  if (error || !order) return <PageHero title={t.modules}>{t.needAccept}</PageHero>
  if (['enquiry', 'declined'].includes(order.status)) {
    return <PageHero title={t.modules}>{t.needAccept}</PageHero>
  }
  if (!selection) return null

  async function save() {
    if (!order || !selection) return
    await api.saveSelection(order.token, selection)
    const next = await api.submitReview(order.token)
    navigate(`/order/${next.token}/review`)
  }

  return (
    <div className="page-enter">
      <PageHero title={t.modules}>{t.modulesLead}</PageHero>
      <section className="bg-wash pb-24">
        <div className="page-wrap">
          <OrderSteps token={order.token} current="modules" />
          <div className="mt-10">
            <ModulePicker value={selection} onChange={setSelection} />
          </div>
          <button type="button" className="btn-primary mt-10" onClick={() => void save()}>
            {t.continue}
          </button>
        </div>
      </section>
    </div>
  )
}
