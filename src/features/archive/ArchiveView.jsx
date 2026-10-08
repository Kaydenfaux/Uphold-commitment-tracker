import { compareCompleted } from '../../lib/sort.js'
import { useStore } from '../../store/useStore.js'
import { EmptyState } from '../../ui/EmptyState.jsx'
import { CommitmentGrid } from '../commitments/CommitmentGrid.jsx'

/** @typedef {import('../../lib/model.js').Commitment} Commitment */

export function ArchiveView() {
  const { state } = useStore()

  const kept = state.commitments.filter((c) => c.done).sort(compareCompleted)
  const currentName = new Map(state.categories.map((s) => [s.id, s.name]))
  // Kept before keptCategory existed, those fall back to the category they still point at.
  const groupOf = (/** @type {Commitment} */ c) => c.keptCategory || currentName.get(c.categoryId) || ''

  /** @type {Map<string, Commitment[]>} */
  const groups = new Map()
  for (const c of kept) {
    const name = groupOf(c)
    groups.set(name, [...(groups.get(name) ?? []), c])
  }
  // Same order as the Commitments page, then categories that no longer exist, then uncategorised.
  const order = state.categories.map((s) => s.name)
  const rank = (/** @type {string} */ name) => {
    if (!name) return Infinity
    const i = order.indexOf(name)
    return i === -1 ? order.length : i
  }
  const names = [...groups.keys()].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Archive</h1>
          <p className="page-intro">
            Everything you’ve completed, grouped by the category it was in. Open a category to see them.
          </p>
        </div>
      </header>

      {names.length ? (
        names.map((name) => {
          const items = groups.get(name) ?? []
          return (
            <details key={name || 'none'} className="archive-group">
              <summary>
                <span className="section-title">
                  {name || 'No category'}
                  <span className="section-title__count">{items.length}</span>
                </span>
              </summary>
              <CommitmentGrid items={items} showEmpty={false} />
            </details>
          )
        })
      ) : (
        <EmptyState title="Nothing completed yet. When you mark a commitment as completed, it moves here.">
          <a href="#/commitments">Go to commitments</a>
        </EmptyState>
      )}
    </>
  )
}
