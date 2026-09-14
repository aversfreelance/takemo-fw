import raw from './catalog.json'

export type LocaleKey = 'hu' | 'en'
export type CareTerm = 'monthly' | 'yearly'
export type Localized = { hu: string; en: string }

export type SiteItem = {
  id: string
  price: number
  priceHuf?: number
  includes: string[]
  tone: number
  title?: Localized
  points?: { hu: string[]; en: string[] }
}

export type CareItem = {
  id: string
  hours: number
  responseHours: number
  monthly: number
  yearly: number
  monthlyHuf?: number
  yearlyHuf?: number
  tone: number
  title?: Localized
  text?: Localized
}

export type ModuleItem = {
  id: string
  price: number
  priceHuf?: number
  label?: Localized
}

export type Catalog = {
  version?: number
  currency: 'GBP'
  vatRate: number
  vatRateHuf?: number
  depositRate: number
  sites: SiteItem[]
  care: CareItem[]
  groups: { id: string; title?: Localized; items: ModuleItem[] }[]
}

export const fallbackCatalog = raw as Catalog

export function siteById(catalog: Catalog, id: string) {
  return catalog.sites.find((item) => item.id === id)
}

export function careById(catalog: Catalog, id: string) {
  return catalog.care.find((item) => item.id === id)
}

export function moduleById(catalog: Catalog, id: string) {
  for (const group of catalog.groups) {
    const found = group.items.find((item) => item.id === id)
    if (found) return found
  }
  return undefined
}

export function includedModules(catalog: Catalog, siteId?: string) {
  return new Set(siteById(catalog, siteId ?? '')?.includes ?? [])
}

export function computeTotals(
  catalog: Catalog,
  input: {
    siteId?: string
    moduleIds?: string[]
    careId?: string
    careTerm?: CareTerm
  },
  locale: LocaleKey = 'en',
) {
  const hu = locale === 'hu'
  const included = includedModules(catalog, input.siteId)
  const site = siteById(catalog, input.siteId ?? '')
  let net = hu ? (site?.priceHuf ?? 0) : (site?.price ?? 0)

  for (const id of input.moduleIds ?? []) {
    if (included.has(id)) continue
    const item = moduleById(catalog, id)
    net += hu ? (item?.priceHuf ?? 0) : (item?.price ?? 0)
  }

  const care = careById(catalog, input.careId ?? '')
  if (care) {
    net += hu
      ? input.careTerm === 'yearly'
        ? (care.yearlyHuf ?? 0)
        : (care.monthlyHuf ?? 0)
      : input.careTerm === 'yearly'
        ? care.yearly
        : care.monthly
  }

  const vatRate = hu ? (catalog.vatRateHuf ?? 0.27) : catalog.vatRate
  const vat = Math.round(net * vatRate)
  const gross = net + vat
  const deposit = Math.round(gross * catalog.depositRate)
  const remainder = gross - deposit
  return { net, vat, gross, deposit, remainder, vatRate, currency: hu ? 'HUF' : 'GBP' }
}
