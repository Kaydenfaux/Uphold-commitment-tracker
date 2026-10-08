import { AddCommitmentButton } from './AddCommitmentButton.jsx'
import { CommitmentBox } from './CommitmentBox.jsx'
import { useCommitmentDrag } from './drag/useCommitmentDrag.js'

/**
 * `sortable` grids take part in dragging: their boxes can be picked up, and
 * while one is dragged over, a placeholder shows where it would land.
 * `empty` replaces the "add a commitment" tile shown when there are none.
 * @param {{
 *   items: import('../../lib/model.js').Commitment[], showEmpty?: boolean, empty?: import('react').ReactNode,
 *   categoryId?: string, emptyLabel?: string, sortable?: boolean
 * }} props
 */
export function CommitmentGrid({ items, showEmpty = true, empty, categoryId = '', emptyLabel, sortable = false }) {
  const dnd = useCommitmentDrag()
  const drag = sortable ? dnd?.drag : null
  const spot = drag ? (drag.target ?? drag.origin) : null
  const placeholder = spot?.categoryId === categoryId && (
    <div key="placeholder" className="box-placeholder" style={{ height: drag?.height }} aria-hidden="true" />
  )

  if (!items.length && !placeholder) {
    if (!showEmpty) return null
    return empty ?? <AddCommitmentButton variant="tile" categoryId={categoryId} label={emptyLabel} />
  }

  const boxes = items.map((commitment) => (
    <CommitmentBox key={commitment.id} commitment={commitment} sortable={sortable} />
  ))
  if (placeholder) {
    const i = spot?.beforeId ? items.findIndex((c) => c.id === spot.beforeId) : -1
    boxes.splice(i === -1 ? boxes.length : i, 0, placeholder)
  }
  return <div className="box-grid">{boxes}</div>
}
