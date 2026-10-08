import { DEFAULT_PRIORITY, isPriorityId } from './priorities.js'

/**
 * @typedef {import('./model.js').State} State
 * @typedef {import('./model.js').Commitment} Commitment
 * @typedef {import('./model.js').Thought} Thought
 */

const STORAGE_KEY = 'uphold:v3'
// Read in order if nothing is saved under STORAGE_KEY yet, so data from before
// the rename (projecty:v3) and the v2 focus + to-dos version still loads.
// They're left untouched in storage.
const LEGACY_KEYS = ['projecty:v3', 'projecty:v2']

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** @param {unknown} value */
function records(value) {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

/** @param {unknown} value */
function text(value) {
  return typeof value === 'string' ? value : ''
}

/** @param {unknown} value */
function time(value) {
  return typeof value === 'number' ? value : null
}

/** @param {unknown} value */
function priority(value) {
  return typeof value === 'string' && isPriorityId(value)
    ? /** @type {import('./priorities.js').PriorityId} */ (value)
    : DEFAULT_PRIORITY
}

/** @param {Record<string, unknown>} item */
function hasIdAndTitle(item) {
  return typeof item.id === 'string' && typeof item.title === 'string'
}

/** @param {Record<string, unknown>} c @returns {Commitment} */
function toCommitment(c) {
  const createdAt = time(c.createdAt) ?? Date.now()
  return {
    id: text(c.id),
    title: text(c.title),
    note: text(c.note),
    priority: priority(c.priority),
    due: text(c.due),
    categoryId: text(c.categoryId ?? c.sectionId),
    // Older data had no manual order, so it starts in the order it was made.
    order: time(c.order) ?? createdAt,
    steps: records(c.steps)
      .filter(hasIdAndTitle)
      .map((s) => ({ id: text(s.id), title: text(s.title), done: s.done === true })),
    done: c.done === true,
    createdAt,
    completedAt: time(c.completedAt),
    keptCategory: text(c.keptCategory),
  }
}

/** @param {Record<string, unknown>} t @returns {Thought} */
function toThought(t) {
  const createdAt = time(t.createdAt) ?? Date.now()
  return {
    id: text(t.id),
    title: text(t.title),
    text: text(t.text),
    sources: records(t.sources).map((s) => ({ text: text(s.text), createdAt: time(s.createdAt) ?? createdAt })),
    createdAt,
    updatedAt: time(t.updatedAt) ?? createdAt,
  }
}

/**
 * v1/v2 had focus items (or projects) with to-dos linked to them. Linked
 * to-dos become a commitment's steps; open unlinked ones become loose
 * thoughts so nothing disappears without the user seeing it.
 * @param {Record<string, unknown>} data
 * @returns {State}
 */
function fromLegacy(data) {
  const tasks = records(data.tasks).filter(hasIdAndTitle)
  const focus = records(data.focus ?? data.projects).filter(hasIdAndTitle)
  const focusIds = new Set(focus.map((f) => f.id))
  const parentOf = (/** @type {Record<string, unknown>} */ t) => t.focusId ?? t.projectId

  return {
    categories: [],
    commitments: focus.map((f) =>
      toCommitment({
        ...f,
        note: f.note ?? f.description,
        done: f.done === true || f.status === 'done',
        steps: tasks.filter((t) => parentOf(t) === f.id),
      }),
    ),
    thoughts: tasks
      .filter((t) => !focusIds.has(parentOf(t)) && t.done !== true)
      .map((t) => toThought({ id: t.id, text: [t.title, text(t.notes)].filter(Boolean).join('\n'), createdAt: t.createdAt })),
  }
}

/**
 * Validates untrusted data from localStorage, keeps only known fields and
 * fills in missing ones, so data saved by older versions still loads.
 * @param {unknown} data
 * @returns {State | null}
 */
export function normalizeState(data) {
  if (!isRecord(data)) return null
  if (Array.isArray(data.commitments)) {
    return {
      // Saved before categories were renamed from sections.
      categories: records(data.categories ?? data.sections)
        .filter((s) => typeof s.id === 'string' && typeof s.name === 'string')
        .map((s) => ({ id: text(s.id), name: text(s.name) })),
      commitments: records(data.commitments).filter(hasIdAndTitle).map(toCommitment),
      thoughts: records(data.thoughts)
        .filter((t) => typeof t.id === 'string' && typeof t.text === 'string')
        .map(toThought),
    }
  }
  if (Array.isArray(data.tasks)) return fromLegacy(data)
  return null
}

/** @param {string} key */
function read(key) {
  const raw = localStorage.getItem(key)
  return raw ? normalizeState(JSON.parse(raw)) : null
}

/** @returns {State | null} */
export function loadState() {
  try {
    for (const key of [STORAGE_KEY, ...LEGACY_KEYS]) {
      const state = read(key)
      if (state) return state
    }
    return null
  } catch {
    return null
  }
}

/** @param {State} state */
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be full or disabled (private mode); the app still works in memory.
  }
}
