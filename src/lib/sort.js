import { isDueWithinMonth } from './dates.js'
import { priorityRank } from './priorities.js'

/**
 * @typedef {import('./model.js').Commitment} Commitment
 */

/** The order the user gave them: made first, or dragged earlier, comes first. @param {Commitment} a @param {Commitment} b */
export function compareByOrder(a, b) {
  return a.order - b.order || a.createdAt - b.createdAt
}

/**
 * What needs attention first, for the home page: anything due within a month
 * (overdue included) by date, soonest first; then everything else by
 * priority. Ties keep the user's own order.
 * @param {Commitment} a @param {Commitment} b
 */
export function compareByUrgency(a, b) {
  const aSoon = isDueWithinMonth(a.due)
  const bSoon = isDueWithinMonth(b.due)
  if (aSoon !== bSoon) return aSoon ? -1 : 1
  if (aSoon && a.due !== b.due) return a.due < b.due ? -1 : 1
  return priorityRank(a.priority) - priorityRank(b.priority) || compareByOrder(a, b)
}

/** Most recently completed first. @param {Commitment} a @param {Commitment} b */
export function compareCompleted(a, b) {
  return (b.completedAt ?? 0) - (a.completedAt ?? 0)
}
