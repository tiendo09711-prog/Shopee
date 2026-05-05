export const ORDER_TRANSITIONS = Object.freeze({
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipping', 'cancelled'],
  shipping: ['delivered'],
  delivered: ['completed', 'return_requested'],
  return_requested: ['refunded', 'completed'],
  completed: [],
  cancelled: [],
  refunded: []
})

export function canTransitionOrder(from, to) {
  return ORDER_TRANSITIONS[from]?.includes(to) || false
}
