import { formatMoney } from '../lib/money'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'

export function PriceBox({
  totals,
  sticky = true,
}: {
  totals: { net: number; vat: number; gross: number; deposit: number; remainder: number; vatRate?: number }
  sticky?: boolean
}) {
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const vatPct = Math.round((totals.vatRate ?? (locale === 'hu' ? 0.27 : 0.2)) * 100)

  return (
    <aside className={`price-box${sticky ? ' is-sticky' : ''}`}>
      <p>
        <span>{t.total}</span>
        <strong>{formatMoney(totals.net, locale)}</strong>
      </p>
      <p>
        <span>
          {t.vat} {vatPct}%
        </span>
        <strong>{formatMoney(totals.vat, locale)}</strong>
      </p>
      <p className="is-gross">
        <span>
          {t.total} + {t.vat}
        </span>
        <strong>{formatMoney(totals.gross, locale)}</strong>
      </p>
      <p className="is-now">
        <span>{t.deposit}</span>
        <strong>{formatMoney(totals.deposit, locale)}</strong>
      </p>
      <p>
        <span>{t.remainder}</span>
        <strong>{formatMoney(totals.remainder, locale)}</strong>
      </p>
    </aside>
  )
}
