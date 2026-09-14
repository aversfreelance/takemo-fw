import { shop, shopCopy } from '../i18n/shop'
import type { Locale } from '../i18n/copy'
import type { CareItem, Catalog, ModuleItem, SiteItem } from '.'

export function siteTitle(site: SiteItem, locale: Locale) {
  const fallback = shopCopy(locale).sites[site.id as keyof typeof shop.hu.sites]
  return site.title?.[locale] || fallback?.title || site.id
}

export function sitePoints(site: SiteItem, locale: Locale) {
  const fallback = shopCopy(locale).sites[site.id as keyof typeof shop.hu.sites]
  return site.points?.[locale] || fallback?.points || []
}

export function careTitle(pack: CareItem, locale: Locale) {
  const fallback = shopCopy(locale).carePacks[pack.id as keyof typeof shop.hu.carePacks]
  return pack.title?.[locale] || fallback?.title || pack.id
}

export function careText(pack: CareItem, locale: Locale) {
  const fallback = shopCopy(locale).carePacks[pack.id as keyof typeof shop.hu.carePacks]
  return pack.text?.[locale] || fallback?.text || ''
}

export function moduleLabel(item: ModuleItem, locale: Locale) {
  const fallback = shopCopy(locale).moduleLabels[item.id as keyof typeof shop.hu.moduleLabels]
  return item.label?.[locale] || fallback || item.id
}

export function groupTitle(group: Catalog['groups'][number], locale: Locale) {
  const fallback = shopCopy(locale).groups[group.id as keyof typeof shop.hu.groups]
  return group.title?.[locale] || fallback || group.id
}
