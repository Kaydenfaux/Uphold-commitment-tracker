import { compareByOrder } from '../lib/sort.js'

/**
 * @typedef {import('../lib/model.js').State} State
 * @typedef {import('../lib/model.js').Collection} Collection
 * @typedef {import('../lib/model.js').Commitment} Commitment
 * @typedef {import('../lib/model.js').Thought} Thought
 * @typedef {import('../lib/model.js').Category} Category
 * @typedef {
 *   | { type: 'add', collection: 'categories', item: Category }
 *   | { type: 'add', collection: 'commitments', item: Commitment }
 *   | { type: 'add', collection: 'thoughts', item: Thought }
 *   | { type: 'update', collection: Collection, id: string, patch: Record<string, unknown> }
 *   | { type: 'remove', collection: Collection, id: string }
 *   | { type: 'removeCategory', id: string }
 *   | { type: 'setCommitmentDone', id: string, done: boolean }
 *   | { type: 'moveCommitment', id: string, categoryId: string, beforeId: string | null }
 *   | { type: 'toggleStep', commitmentId: string, stepId: string }
 *   | { type: 'consolidate', ids: string[], note: Thought }
 *   | { type: 'split', id: string, thoughts: Thought[] }
 *   | { type: 'replace', state: State }
 * } Action
 */

/**
 * @param {Commitment[]} commitments
 * @param {string} id
 * @param {(c: Commitment) => Commitment} change
 */
function mapCommitment(commitments, id, change) {
  return commitments.map((c) => (c.id === id ? change(c) : c))
}

/**
 * An order that puts a commitment just before `beforeId` in `list`, or at
 * the end when there's no `beforeId`.
 * @param {Commitment[]} list the category's other commitments, in order
 * @param {string | null} beforeId
 * @param {number} fallback used when the category is empty
 */
function orderAt(list, beforeId, fallback) {
  const i = beforeId ? list.findIndex((c) => c.id === beforeId) : -1
  if (i === -1) return list.length ? list[list.length - 1].order + 1 : fallback
  if (i === 0) return list[0].order - 1
  return (list[i - 1].order + list[i].order) / 2
}

/**
 * @param {State} state
 * @param {Action} action
 * @returns {State}
 */
export function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, [action.collection]: [...state[action.collection], action.item] }

    case 'update':
      return {
        ...state,
        [action.collection]: state[action.collection].map((item) =>
          item.id === action.id ? { ...item, ...action.patch } : item,
        ),
      }

    case 'remove':
      return { ...state, [action.collection]: state[action.collection].filter((item) => item.id !== action.id) }

    // Commitments outlive their category; they just become uncategorised.
    case 'removeCategory':
      return {
        ...state,
        categories: state.categories.filter((s) => s.id !== action.id),
        commitments: state.commitments.map((c) => (c.categoryId === action.id ? { ...c, categoryId: '' } : c)),
      }

    // Keeping a commitment ticks off its open steps too.
    case 'setCommitmentDone':
      return {
        ...state,
        commitments: mapCommitment(state.commitments, action.id, (c) => ({
          ...c,
          done: action.done,
          completedAt: action.done ? Date.now() : null,
          keptCategory: action.done ? (state.categories.find((s) => s.id === c.categoryId)?.name ?? '') : '',
          steps: action.done ? c.steps.map((s) => ({ ...s, done: true })) : c.steps,
        })),
      }

    case 'moveCommitment': {
      const moving = state.commitments.find((c) => c.id === action.id)
      if (!moving) return state
      const categoryIds = new Set(state.categories.map((s) => s.id))
      // Commitments pointing at a deleted category count as "No category".
      const categoryOf = (/** @type {Commitment} */ c) => (categoryIds.has(c.categoryId) ? c.categoryId : '')
      const list = state.commitments
        .filter((c) => !c.done && c.id !== action.id && categoryOf(c) === action.categoryId)
        .sort(compareByOrder)
      const order = orderAt(list, action.beforeId, moving.order)
      return {
        ...state,
        commitments: mapCommitment(state.commitments, action.id, (c) => ({ ...c, categoryId: action.categoryId, order })),
      }
    }

    case 'toggleStep':
      return {
        ...state,
        commitments: mapCommitment(state.commitments, action.commitmentId, (c) => ({
          ...c,
          steps: c.steps.map((s) => (s.id === action.stepId ? { ...s, done: !s.done } : s)),
        })),
      }

    // The merged thoughts are folded into the note (as its sources), so they
    // leave the list. The note is added, or replaced if it already exists.
    case 'consolidate': {
      const rest = state.thoughts.filter((t) => !action.ids.includes(t.id) && t.id !== action.note.id)
      return { ...state, thoughts: [...rest, { ...action.note, updatedAt: Date.now() }] }
    }

    // Undoes a consolidation: the note goes and its sources come back as loose thoughts.
    case 'split':
      return { ...state, thoughts: [...state.thoughts.filter((t) => t.id !== action.id), ...action.thoughts] }

    case 'replace':
      return action.state

    default:
      return state
  }
}
