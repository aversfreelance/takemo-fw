import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api, type CompanyProfile } from '../lib/api'

export function AdminCompany() {
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const [form, setForm] = useState<CompanyProfile | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void api.getCompany().then(setForm)
  }, [])

  if (!form) return null

  async function save() {
    if (!form) return
    setSaved(false)
    setForm(await api.saveCompany(form))
    setSaved(true)
  }

  return (
    <div className="mt-10 max-w-2xl grid gap-4">
      <p className="font-bold">{t.companyLead}</p>
      <label className="grid gap-1">
        <span className="text-sm font-extrabold uppercase tracking-[0.12em]">{t.companyName}</span>
        <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-extrabold uppercase tracking-[0.12em]">{t.companyAddress}</span>
        <textarea
          className="field min-h-24"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-extrabold uppercase tracking-[0.12em]">{t.companyNumber}</span>
        <input
          className="field"
          value={form.companyNumber}
          onChange={(e) => setForm({ ...form, companyNumber: e.target.value })}
        />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-extrabold uppercase tracking-[0.12em]">{t.companyVat}</span>
        <input className="field" value={form.vatNumber} onChange={(e) => setForm({ ...form, vatNumber: e.target.value })} />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-extrabold uppercase tracking-[0.12em]">{t.companyEmail}</span>
        <input className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-extrabold uppercase tracking-[0.12em]">{t.companyWebsite}</span>
        <input className="field" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary" onClick={() => void save()}>
          {t.saveCompany}
        </button>
        {saved ? <span className="font-extrabold text-brand">{t.saved}</span> : null}
      </div>
    </div>
  )
}
