/**
 * @typedef {import('./model.js').Commitment} Commitment
 */

/** The order the user gave them: made first, or dragged earlier, comes first. @param {Commitment} a @param {Commitment} b */
export function compareByOrder(a, b) {
  return a.order - b.order || a.createdAt - b.createdAt
}

/** Most recently completed first. @param {Commitment} a @param {Commitment} b */
export function compareCompleted(a, b) {
  return (b.completedAt ?? 0) - (a.completedAt ?? 0)
}
