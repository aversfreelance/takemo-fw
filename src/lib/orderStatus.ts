import type { Order } from './api'

const PAYMENT_DEADLINE_MS = 72 * 60 * 60 * 1000

export function paymentOverdue(order: Order) {
  const now = Date.now()

  if (order.status === 'ready' && !order.paidAt && !order.depositPending) {
    const start = new Date(order.readyAt || order.updatedAt).getTime()
    return now - start > PAYMENT_DEADLINE_MS
  }

  if (order.status === 'delivered' && order.balanceDue && !order.balancePaidAt && !order.balancePending) {
    const start = new Date(order.balanceDueAt || order.deliveredAt || order.updatedAt).getTime()
    return now - start > PAYMENT_DEADLINE_MS
  }

  return false
}

export function orderCardClass(order: Order) {
  if (order.balancePaidAt) return 'border-[#15803d] bg-[#dcfce7]'
  const overdue = paymentOverdue(order)
  if (
    order.depositPending ||
    order.balancePending ||
    order.status === 'ready' ||
    (order.status === 'delivered' && order.balanceDue && !order.balancePaidAt)
  ) {
    return overdue ? 'border-brand bg-[#fee2e2]' : 'border-brand bg-white'
  }
  if (order.paidAt && !order.balancePaidAt) return 'border-brand-soft bg-white'
  return 'border-ink bg-white'
}
