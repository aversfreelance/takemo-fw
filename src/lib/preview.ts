import type { Order } from './api'

export function canViewPreview(order: Order) {
  return Boolean(order.previewUrl && order.previewSentAt)
}

export function previewWaitingChanges(order: Order) {
  return Boolean(order.previewFeedback && !order.previewSentAt)
}

export function previewApproved(order: Order) {
  return Boolean(order.previewApprovedAt)
}

export function previewActive(order: Order) {
  return order.status === 'paid' || order.status === 'delivered'
}
