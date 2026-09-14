import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ModulePicker, type Selection } from '../components/ModulePicker'
import { PageHero } from '../components/PageHero'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'

export function ModulesPage() {
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const [params] = useSearchParams()
  const [selection, setSelection] = useState<Selection>({
    siteId: params.get('site') || '',
    moduleIds: [],
    careId: params.get('care') || '',
    careTerm: params.get('term') === 'yearly' ? 'yearly' : 'monthly',
  })

  const query = new URLSearchParams()
  if (selection.siteId) query.set('site', selection.siteId)
  if (selection.careId) query.set('care', selection.careId)
  if (selection.careTerm === 'yearly') query.set('term', 'yearly')
  query.set('mods', selection.moduleIds.join(','))

  return (
    <div className="page-enter">
      <PageHero title={t.modules}>{t.modulesLead}</PageHero>
      <section className="bg-wash pb-24">
        <div className="page-wrap">
          <ModulePicker value={selection} onChange={setSelection} />
          <Link to={`/start?${query.toString()}`} className="btn-primary mt-10">
            {t.start}
          </Link>
        </div>
      </section>
    </div>
  )
}
