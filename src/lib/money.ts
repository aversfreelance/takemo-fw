import type { Locale } from '../i18n/copy'

export function formatMoney(amount: number, locale: Locale) {
  if (locale === 'hu') {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount / 100)
}

export function formatPence(amount: number, locale: Locale = 'en') {
  return formatMoney(amount, locale)
}

export function pickAmount(gbp: number, huf: number | undefined, locale: Locale) {
  return locale === 'hu' ? (huf ?? 0) : gbp
}
