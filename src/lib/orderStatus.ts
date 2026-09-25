import type { Order } from './api'

const PAYMENT_DEADLINE_MS = 72 * 60 * 60 * 1000

export function canPayDeposit(order: Order) {
  return (order.status === 'review' || order.status === 'ready') && !order.paidAt
}

export function depositConfirmed(order: Order) {
  return Boolean(order.paidAt)
}

export function awaitingDepositConfirm(order: Order) {
  return Boolean(order.depositPending && !order.paidAt)
}

export function canPayBalance(order: Order) {
  return order.status === 'delivered' && Boolean(order.balanceDue) && !order.balancePaidAt
}

export function paymentOverdue(order: Order) {
  const now = Date.now()

  if (canPayDeposit(order) && !order.depositPending) {
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
    canPayDeposit(order) ||
    (order.status === 'delivered' && order.balanceDue && !order.balancePaidAt)
  ) {
    return overdue ? 'border-brand bg-[#fee2e2]' : 'border-brand bg-white'
  }
  if (order.paidAt && !order.balancePaidAt) return 'border-brand-soft bg-white'
  return 'border-ink bg-white'
}
