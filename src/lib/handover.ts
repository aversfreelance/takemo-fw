import type { Order } from './api'

export function handoverText(order: Pick<Order, 'handover'>) {
  const value = order.handover
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    const legacy = value as { domain?: string; hosting?: string; database?: string }
    return [legacy.domain, legacy.hosting, legacy.database].filter(Boolean).join('\n\n')
  }
  return ''
}

export function hasHandover(order: Pick<Order, 'handover'>) {
  return Boolean(handoverText(order).trim())
}
