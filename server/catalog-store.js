import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sql, useNeon } from './neon.js'

const require = createRequire(import.meta.url)
const root = dirname(fileURLToPath(import.meta.url))
const liveFile = join(root, 'data', 'catalog.json')

function seed() {
  return structuredClone(require('../src/catalog/catalog.json'))
}

function byId(list = []) {
  return Object.fromEntries(list.map((item) => [item.id, item]))
}

function mergePrices(live, fresh) {
  const liveSites = byId(live.sites)
  const liveCare = byId(live.care)
  const next = structuredClone(fresh)
  next.sites = next.sites.map((site) => ({
    ...site,
    title: liveSites[site.id]?.title || site.title,
  }))
  next.care = next.care.map((pack) => ({
    ...pack,
    title: liveCare[pack.id]?.title || pack.title,
    text: liveCare[pack.id]?.text || pack.text,
  }))
  next.groups = next.groups.map((group, index) => {
    const liveItems = byId(live.groups?.[index]?.items || live.groups?.find((g) => g.id === group.id)?.items)
    return {
      ...group,
      title: live.groups?.find((g) => g.id === group.id)?.title || group.title,
      items: group.items.map((item) => ({
        ...item,
        label: item.id === 'cms' ? undefined : liveItems[item.id]?.label || item.label,
      })),
    }
  })
  return next
}

async function readLive() {
  if (useNeon()) {
    const db = await sql()
    const rows = await db`SELECT data FROM catalog WHERE id = 1 LIMIT 1`
    return rows[0]?.data || null
  }
  if (!existsSync(liveFile)) return null
  try {
    return JSON.parse(readFileSync(liveFile, 'utf8'))
  } catch {
    return null
  }
}

export async function getCatalog() {
  const fresh = seed()
  const live = await readLive()
  if (!live) return fresh
  if ((live.version || 0) < (fresh.version || 0)) {
    return saveCatalog(mergePrices(live, fresh))
  }
  return live
}

export async function saveCatalog(next) {
  next.version = seed().version
  if (useNeon()) {
    const db = await sql()
    await db`
      INSERT INTO catalog (id, data)
      VALUES (1, ${next})
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
    `
    return next
  }
  mkdirSync(dirname(liveFile), { recursive: true })
  writeFileSync(liveFile, JSON.stringify(next, null, 2))
  return next
}

function siteById(catalog, id) {
  return catalog.sites.find((item) => item.id === id)
}

function careById(catalog, id) {
  return catalog.care.find((item) => item.id === id)
}

function moduleById(catalog, id) {
  for (const group of catalog.groups) {
    const found = group.items.find((item) => item.id === id)
    if (found) return found
  }
  return undefined
}

export async function computeTotals(selection = {}, locale = 'en') {
  const catalog = await getCatalog()
  const hu = locale === 'hu'
  const site = siteById(catalog, selection.siteId)
  const included = new Set(site?.includes ?? [])
  let net = hu ? (site?.priceHuf ?? 0) : (site?.price ?? 0)

  for (const id of selection.moduleIds ?? []) {
    if (included.has(id)) continue
    const item = moduleById(catalog, id)
    net += hu ? (item?.priceHuf ?? 0) : (item?.price ?? 0)
  }

  const care = careById(catalog, selection.careId)
  if (care) {
    net += hu
      ? selection.careTerm === 'yearly'
        ? (care.yearlyHuf ?? 0)
        : (care.monthlyHuf ?? 0)
      : selection.careTerm === 'yearly'
        ? care.yearly
        : care.monthly
  }

  const vatRate = hu ? (catalog.vatRateHuf ?? 0.27) : (catalog.vatRate ?? 0.2)
  const vat = Math.round(net * vatRate)
  const gross = net + vat
  const deposit = Math.round(gross * (catalog.depositRate ?? 0.2))
  return { net, vat, gross, deposit, remainder: gross - deposit, vatRate, currency: hu ? 'HUF' : 'GBP' }
}
