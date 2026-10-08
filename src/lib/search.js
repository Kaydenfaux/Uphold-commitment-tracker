import { isConsolidated } from './model.js'
import { compareByOrder, compareCompleted } from './sort.js'

/**
 * @typedef {import('./model.js').State} State
 * @typedef {import('./model.js').Commitment} Commitment
 * @typedef {import('./model.js').Thought} Thought
 * @typedef {{ commitments: Commitment[], notes: Thought[], thoughts: Thought[] }} SearchResults
 */

/**
 * Every word of the query has to appear somewhere in the fields, in any
 * order, so "blender light" finds "Lighting for the Blender scene".
 * @param {string[]} words
 * @param {string[]} fields
 */
function matches(words, fields) {
  const haystack = fields.join('\n').toLowerCase()
  return words.every((w) => haystack.includes(w))
}

/**
 * @param {State} state
 * @param {string} query
 * @returns {SearchResults}
 */
export function search(state, query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return { commitments: [], notes: [], thoughts: [] }

  const categoryName = new Map(state.categories.map((s) => [s.id, s.name]))
  const commitments = state.commitments.filter((c) =>
    matches(words, [c.title, c.note, categoryName.get(c.categoryId) ?? '', c.keptCategory, ...c.steps.map((s) => s.title)]),
  )
  const thoughts = state.thoughts.filter((t) => matches(words, [t.title, t.text, ...t.sources.map((s) => s.text)]))

  return {
    commitments: [
      ...commitments.filter((c) => !c.done).sort(compareByOrder),
      ...commitments.filter((c) => c.done).sort(compareCompleted),
    ],
    notes: thoughts.filter(isConsolidated).sort((a, b) => b.updatedAt - a.updatedAt),
    thoughts: thoughts.filter((t) => !isConsolidated(t)).sort((a, b) => b.createdAt - a.createdAt),
  }
}
