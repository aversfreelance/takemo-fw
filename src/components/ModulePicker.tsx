import { computeTotals, includedModules, type CareTerm } from '../catalog'
import { useCatalog } from '../catalog/CatalogProvider'
import { careTitle, groupTitle, moduleLabel, siteTitle } from '../catalog/labels'
import { formatMoney, pickAmount } from '../lib/money'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { PriceBox } from './PriceBox'

export type Selection = {
  siteId: string
  moduleIds: string[]
  careId: string
  careTerm: CareTerm
}

export function ModulePicker({
  value,
  onChange,
}: {
  value: Selection
  onChange: (next: Selection) => void
}) {
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const catalog = useCatalog()
  const included = includedModules(catalog, value.siteId)
  const totals = computeTotals(catalog, value, locale)

  function toggleModule(id: string) {
    if (included.has(id)) return
    const has = value.moduleIds.includes(id)
    onChange({
      ...value,
      moduleIds: has ? value.moduleIds.filter((item) => item !== id) : [...value.moduleIds, id],
    })
  }

  return (
    <div className="builder-grid">
      <div>
        <h3 className="builder-h">{t.websites}</h3>
        <div className="tick-list">
          {catalog.sites.map((site) => (
            <label key={site.id} className="tick">
              <input
                type="radio"
                name="site"
                checked={value.siteId === site.id}
                onChange={() => onChange({ ...value, siteId: site.id })}
              />
              <span>
                {siteTitle(site, locale)}
                <em>{formatMoney(pickAmount(site.price, site.priceHuf, locale), locale)}</em>
              </span>
            </label>
          ))}
        </div>

        {catalog.groups.map((group) => (
          <div key={group.id} id={group.id}>
            <h3 className="builder-h">{groupTitle(group, locale)}</h3>
            <div className="tick-list">
              {group.items.map((item) => {
                const on = included.has(item.id) || value.moduleIds.includes(item.id)
                return (
                  <label key={item.id} className={`tick${included.has(item.id) ? ' is-in' : ''}`}>
                    <input
                      type="checkbox"
                      checked={on}
                      disabled={included.has(item.id)}
                      onChange={() => toggleModule(item.id)}
                    />
                    <span>
                      {moduleLabel(item, locale)}
                      <em>{included.has(item.id) ? t.included : formatMoney(pickAmount(item.price, item.priceHuf, locale), locale)}</em>
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}

        <h3 className="builder-h">{t.care}</h3>
        <div className="tick-list">
          <label className="tick">
            <input
              type="radio"
              name="care"
              checked={!value.careId}
              onChange={() => onChange({ ...value, careId: '' })}
            />
            <span>—</span>
          </label>
          {catalog.care.map((pack) => (
            <label key={pack.id} className="tick">
              <input
                type="radio"
                name="care"
                checked={value.careId === pack.id}
                onChange={() => onChange({ ...value, careId: pack.id })}
              />
              <span>
                {careTitle(pack, locale)}
                <em>
                  {formatMoney(
                    pickAmount(
                      value.careTerm === 'yearly' ? pack.yearly : pack.monthly,
                      value.careTerm === 'yearly' ? pack.yearlyHuf : pack.monthlyHuf,
                      locale,
                    ),
                    locale,
                  )}{' '}
                  {value.careTerm === 'yearly' ? t.yearly : t.monthly}
                </em>
              </span>
            </label>
          ))}
        </div>
        {value.careId ? (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className={value.careTerm === 'monthly' ? 'btn-primary' : 'btn-outline'}
              onClick={() => onChange({ ...value, careTerm: 'monthly' })}
            >
              {t.monthly}
            </button>
            <button
              type="button"
              className={value.careTerm === 'yearly' ? 'btn-primary' : 'btn-outline'}
              onClick={() => onChange({ ...value, careTerm: 'yearly' })}
            >
              {t.yearly} · {t.yearlyNote}
            </button>
          </div>
        ) : null}
      </div>
      <PriceBox totals={totals} />
    </div>
  )
}
