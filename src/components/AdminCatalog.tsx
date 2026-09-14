import { useEffect, useState } from 'react'
import { type Catalog, type CareItem, type ModuleItem, type SiteItem } from '../catalog'
import { publishCatalog } from '../catalog/CatalogProvider'
import { careText, careTitle, groupTitle, moduleLabel, sitePoints, siteTitle } from '../catalog/labels'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api } from '../lib/api'

function pounds(pence: number) {
  return String(Math.round(pence) / 100)
}

function pence(value: string) {
  const n = Number(value.replace(',', '.'))
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

function lines(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function hydrate(catalog: Catalog): Catalog {
  return {
    ...catalog,
    sites: catalog.sites.map((site) => ({
      ...site,
      title: { hu: siteTitle(site, 'hu'), en: siteTitle(site, 'en') },
      points: { hu: [...sitePoints(site, 'hu')], en: [...sitePoints(site, 'en')] },
    })),
    care: catalog.care.map((pack) => ({
      ...pack,
      title: { hu: careTitle(pack, 'hu'), en: careTitle(pack, 'en') },
      text: { hu: careText(pack, 'hu'), en: careText(pack, 'en') },
    })),
    groups: catalog.groups.map((group) => ({
      ...group,
      title: { hu: groupTitle(group, 'hu'), en: groupTitle(group, 'en') },
      items: group.items.map((item) => ({
        ...item,
        label: { hu: moduleLabel(item, 'hu'), en: moduleLabel(item, 'en') },
      })),
    })),
  }
}

export function AdminCatalog() {
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const [draft, setDraft] = useState<Catalog | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.getCatalog().then((data) => setDraft(hydrate(data)))
  }, [])

  if (!draft) return null

  function updateSite(index: number, patch: Partial<SiteItem>) {
    setDraft((current) => {
      if (!current) return current
      const sites = current.sites.map((site, i) => (i === index ? { ...site, ...patch } : site))
      return { ...current, sites }
    })
  }

  function updateCare(index: number, patch: Partial<CareItem>) {
    setDraft((current) => {
      if (!current) return current
      const care = current.care.map((item, i) => (i === index ? { ...item, ...patch } : item))
      return { ...current, care }
    })
  }

  function updateModule(groupIndex: number, itemIndex: number, patch: Partial<ModuleItem>) {
    setDraft((current) => {
      if (!current) return current
      const groups = current.groups.map((group, gi) =>
        gi === groupIndex
          ? {
              ...group,
              items: group.items.map((item, ii) => (ii === itemIndex ? { ...item, ...patch } : item)),
            }
          : group,
      )
      return { ...current, groups }
    })
  }

  async function save() {
    if (!draft) return
    const next = await api.saveCatalog(draft)
    publishCatalog(next)
    setDraft(hydrate(next))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mt-12">
      <h2 className="section-title left">{t.prices}</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <label className="tick">
          <span>
            {t.vatPct}
            <input
              className="field mt-2"
              value={Math.round((draft.vatRateHuf ?? 0.27) * 100)}
              onChange={(event) => setDraft({ ...draft, vatRateHuf: Number(event.target.value) / 100 })}
            />
          </span>
        </label>
        <label className="tick">
          <span>
            {t.vatPctEn}
            <input
              className="field mt-2"
              value={Math.round(draft.vatRate * 100)}
              onChange={(event) => setDraft({ ...draft, vatRate: Number(event.target.value) / 100 })}
            />
          </span>
        </label>
        <label className="tick">
          <span>
            {t.depositPct}
            <input
              className="field mt-2"
              value={Math.round(draft.depositRate * 100)}
              onChange={(event) => setDraft({ ...draft, depositRate: Number(event.target.value) / 100 })}
            />
          </span>
        </label>
      </div>

      <h3 className="builder-h">{t.websites}</h3>
      <div className="grid gap-4">
        {draft.sites.map((site, index) => (
          <article key={site.id} className="rounded-[18px] border-[3px] border-ink bg-white p-5">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="field"
                placeholder={t.titleHu}
                value={site.title?.hu || ''}
                onChange={(event) => updateSite(index, { title: { hu: event.target.value, en: site.title?.en || '' } })}
              />
              <input
                className="field"
                placeholder={t.titleEn}
                value={site.title?.en || ''}
                onChange={(event) => updateSite(index, { title: { hu: site.title?.hu || '', en: event.target.value } })}
              />
              <label>
                {t.priceGbp}
                <input
                  className="field mt-1"
                  value={pounds(site.price)}
                  onChange={(event) => updateSite(index, { price: pence(event.target.value) })}
                />
              </label>
              <label>
                {t.priceHuf}
                <input
                  className="field mt-1"
                  value={site.priceHuf ?? 0}
                  onChange={(event) => updateSite(index, { priceHuf: Number(event.target.value.replace(/\s/g, '')) || 0 })}
                />
              </label>
              <label>
                {t.includes}
                <input
                  className="field mt-1"
                  value={site.includes.join(', ')}
                  onChange={(event) =>
                    updateSite(index, {
                      includes: event.target.value
                        .split(',')
                        .map((id) => id.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>
              <textarea
                className="field resize-y"
                rows={5}
                placeholder={t.pointsHu}
                value={(site.points?.hu || []).join('\n')}
                onChange={(event) =>
                  updateSite(index, {
                    points: { hu: lines(event.target.value), en: site.points?.en || [] },
                  })
                }
              />
              <textarea
                className="field resize-y"
                rows={5}
                placeholder={t.pointsEn}
                value={(site.points?.en || []).join('\n')}
                onChange={(event) =>
                  updateSite(index, {
                    points: { hu: site.points?.hu || [], en: lines(event.target.value) },
                  })
                }
              />
            </div>
            <button
              type="button"
              className="btn-outline mt-4"
              onClick={() => setDraft({ ...draft, sites: draft.sites.filter((_, i) => i !== index) })}
            >
              {t.remove}
            </button>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="btn-outline mt-4"
        onClick={() =>
          setDraft({
            ...draft,
            sites: [
              ...draft.sites,
              {
                id: `site-${Date.now()}`,
                price: 54900,
                priceHuf: 229000,
                includes: ['contact'],
                tone: draft.sites.length % 6,
                title: { hu: '', en: '' },
                points: { hu: [], en: [] },
              },
            ],
          })
        }
      >
        {t.add}
      </button>

      <h3 className="builder-h">{t.care}</h3>
      <div className="grid gap-4">
        {draft.care.map((pack, index) => (
          <article key={pack.id} className="rounded-[18px] border-[3px] border-ink bg-white p-5">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="field"
                placeholder={t.titleHu}
                value={pack.title?.hu || ''}
                onChange={(event) => updateCare(index, { title: { hu: event.target.value, en: pack.title?.en || '' } })}
              />
              <input
                className="field"
                placeholder={t.titleEn}
                value={pack.title?.en || ''}
                onChange={(event) => updateCare(index, { title: { hu: pack.title?.hu || '', en: event.target.value } })}
              />
              <textarea
                className="field resize-y"
                rows={2}
                value={pack.text?.hu || ''}
                onChange={(event) => updateCare(index, { text: { hu: event.target.value, en: pack.text?.en || '' } })}
              />
              <textarea
                className="field resize-y"
                rows={2}
                value={pack.text?.en || ''}
                onChange={(event) => updateCare(index, { text: { hu: pack.text?.hu || '', en: event.target.value } })}
              />
              <label>
                {t.hours}
                <input
                  className="field mt-1"
                  value={pack.hours}
                  onChange={(event) => updateCare(index, { hours: Number(event.target.value) || 0 })}
                />
              </label>
              <label>
                {t.response}
                <input
                  className="field mt-1"
                  value={pack.responseHours}
                  onChange={(event) => updateCare(index, { responseHours: Number(event.target.value) || 0 })}
                />
              </label>
              <label>
                {t.monthlyGbp}
                <input
                  className="field mt-1"
                  value={pounds(pack.monthly)}
                  onChange={(event) => {
                    const monthly = pence(event.target.value)
                    updateCare(index, { monthly, yearly: Math.round(monthly * 12 * 0.9) })
                  }}
                />
              </label>
              <label>
                {t.yearlyGbp}
                <input
                  className="field mt-1"
                  value={pounds(pack.yearly)}
                  onChange={(event) => updateCare(index, { yearly: pence(event.target.value) })}
                />
              </label>
              <label>
                {t.monthlyHuf}
                <input
                  className="field mt-1"
                  value={pack.monthlyHuf ?? 0}
                  onChange={(event) => {
                    const monthlyHuf = Number(event.target.value.replace(/\s/g, '')) || 0
                    updateCare(index, { monthlyHuf, yearlyHuf: Math.round(monthlyHuf * 12 * 0.9) })
                  }}
                />
              </label>
              <label>
                {t.yearlyHuf}
                <input
                  className="field mt-1"
                  value={pack.yearlyHuf ?? 0}
                  onChange={(event) => updateCare(index, { yearlyHuf: Number(event.target.value.replace(/\s/g, '')) || 0 })}
                />
              </label>
            </div>
            <button
              type="button"
              className="btn-outline mt-4"
              onClick={() => setDraft({ ...draft, care: draft.care.filter((_, i) => i !== index) })}
            >
              {t.remove}
            </button>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="btn-outline mt-4"
        onClick={() =>
          setDraft({
            ...draft,
            care: [
              ...draft.care,
              {
                id: `care-${Date.now()}`,
                hours: 2,
                responseHours: 48,
                monthly: 3900,
                yearly: 42120,
                monthlyHuf: 24900,
                yearlyHuf: 268920,
                tone: draft.care.length % 6,
                title: { hu: '', en: '' },
                text: { hu: '', en: '' },
              },
            ],
          })
        }
      >
        {t.add}
      </button>

      {draft.groups.map((group, groupIndex) => (
        <div key={group.id}>
          <h3 className="builder-h">{group.title?.[locale] || group.id}</h3>
          <div className="grid gap-3">
            {group.items.map((item, itemIndex) => (
              <article key={item.id} className="grid gap-3 rounded-[14px] border-[3px] border-ink bg-white p-4 md:grid-cols-[1fr_1fr_110px_110px_auto]">
                <input
                  className="field"
                  value={item.label?.hu || ''}
                  onChange={(event) =>
                    updateModule(groupIndex, itemIndex, { label: { hu: event.target.value, en: item.label?.en || '' } })
                  }
                />
                <input
                  className="field"
                  value={item.label?.en || ''}
                  onChange={(event) =>
                    updateModule(groupIndex, itemIndex, { label: { hu: item.label?.hu || '', en: event.target.value } })
                  }
                />
                <input
                  className="field"
                  value={pounds(item.price)}
                  onChange={(event) => updateModule(groupIndex, itemIndex, { price: pence(event.target.value) })}
                />
                <input
                  className="field"
                  value={item.priceHuf ?? 0}
                  onChange={(event) =>
                    updateModule(groupIndex, itemIndex, { priceHuf: Number(event.target.value.replace(/\s/g, '')) || 0 })
                  }
                />
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      groups: draft.groups.map((g, gi) =>
                        gi === groupIndex ? { ...g, items: g.items.filter((_, i) => i !== itemIndex) } : g,
                      ),
                    })
                  }
                >
                  {t.remove}
                </button>
              </article>
            ))}
          </div>
          <button
            type="button"
            className="btn-outline mt-3"
            onClick={() =>
              setDraft({
                ...draft,
                groups: draft.groups.map((g, gi) =>
                  gi === groupIndex
                    ? {
                        ...g,
                        items: [...g.items, { id: `mod-${Date.now()}`, price: 3900, priceHuf: 9900, label: { hu: '', en: '' } }],
                      }
                    : g,
                ),
              })
            }
          >
            {t.add}
          </button>
        </div>
      ))}

      <div className="mt-10 flex items-center gap-4">
        <button type="button" className="btn-primary" onClick={() => void save()}>
          {t.savePrices}
        </button>
        {saved ? <p className="font-extrabold">{t.saved}</p> : null}
      </div>
    </div>
  )
}
