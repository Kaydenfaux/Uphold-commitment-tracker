/** @typedef {'urgent' | 'high' | 'medium' | 'low' | 'someday'} PriorityId */

/** @type {ReadonlyArray<{ id: PriorityId, label: string, hint: string }>} */
export const PRIORITIES = [
  { id: 'urgent', label: 'Urgent', hint: 'Needs doing now' },
  { id: 'high', label: 'High', hint: 'This week' },
  { id: 'medium', label: 'Medium', hint: 'Soon' },
  { id: 'low', label: 'Low', hint: 'When there’s time' },
  { id: 'someday', label: 'Someday', hint: 'Maybe, eventually' },
]

/** @type {PriorityId} */
export const DEFAULT_PRIORITY = 'medium'

const RANK = Object.fromEntries(PRIORITIES.map((p, i) => [p.id, i]))

/** @param {string} id */
export function isPriorityId(id) {
  return Object.hasOwn(RANK, id)
}


/** @param {string} id */
export function priorityLabel(id) {
  return PRIORITIES.find((p) => p.id === id)?.label ?? id
}
