import { DEFAULT_PRIORITY } from './priorities.js'

/**
 * @typedef {import('./priorities.js').PriorityId} PriorityId
 *
 * A user-made group for commitments, e.g. "Code" or "Blender".
 * @typedef {{ id: string, name: string }} Category
 *
 * @typedef {{ id: string, title: string, done: boolean }} Step
 *
 * Something you've committed to and will uphold. It stays on screen until
 * marked as kept. Empty `due` means no target date and empty `categoryId`
 * means no category, which keeps them directly bindable to form controls.
 * `order` is the position within its category: new ones go last, and
 * dragging gives a box an order between its new neighbours.
 * `keptCategory` is the category's name at the moment it was kept, so the
 * Archive can still group it after the category is renamed or deleted.
 * @typedef {{
 *   id: string, title: string, note: string, priority: PriorityId,
 *   due: string, categoryId: string, order: number, steps: Step[],
 *   done: boolean, createdAt: number, completedAt: number | null, keptCategory: string
 * }} Commitment
 *
 * An original thought that was folded into a consolidated note.
 * @typedef {{ text: string, createdAt: number }} Source
 *
 * A thought is "loose" until consolidated. A consolidated note has a title
 * and keeps the thoughts it was made from in `sources`.
 * @typedef {{
 *   id: string, title: string, text: string, sources: Source[],
 *   createdAt: number, updatedAt: number
 * }} Thought
 *
 * @typedef {{ categories: Category[], commitments: Commitment[], thoughts: Thought[] }} State
 * @typedef {'categories' | 'commitments' | 'thoughts'} Collection
 */

// crypto.randomUUID is unavailable over plain http on a LAN IP (e.g. testing
// on a phone via `vite --host`), so use a simple unique-enough id instead.
function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/**
 * @param {Partial<Commitment>} [fields]
 * @returns {Commitment}
 */
export function createCommitment(fields = {}) {
  const now = Date.now()
  return {
    id: createId(),
    title: '',
    note: '',
    priority: DEFAULT_PRIORITY,
    due: '',
    categoryId: '',
    order: now,
    steps: [],
    done: false,
    createdAt: now,
    completedAt: null,
    keptCategory: '',
    ...fields,
  }
}

/**
 * @param {Partial<Category>} [fields]
 * @returns {Category}
 */
export function createCategory(fields = {}) {
  return { id: createId(), name: '', ...fields }
}

/**
 * @param {Partial<Step>} [fields]
 * @returns {Step}
 */
export function createStep(fields = {}) {
  return { id: createId(), title: '', done: false, ...fields }
}

/**
 * @param {Partial<Thought>} [fields]
 * @returns {Thought}
 */
export function createThought(fields = {}) {
  const now = Date.now()
  return { id: createId(), title: '', text: '', sources: [], createdAt: now, updatedAt: now, ...fields }
}

/** @param {Thought} thought */
export function isConsolidated(thought) {
  return thought.sources.length > 0
}
