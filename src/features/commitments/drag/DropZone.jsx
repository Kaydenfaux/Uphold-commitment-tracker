import { useCommitmentDrag } from './useCommitmentDrag.js'

/**
 * A group on the Commitments page that commitment boxes can be dropped into
 * and reordered within. An empty `categoryId` is the "No category" group.
 * While a category is dragged, `lifted` marks the one being moved and
 * `insert` shows a line on the side where it would land.
 * @param {{
 *   categoryId: string, labelledBy?: string, label?: string, collapsed?: boolean,
 *   lifted?: boolean, insert?: 'before' | 'after', children: import('react').ReactNode
 * }} props
 */
export function DropZone({ categoryId, labelledBy, label, collapsed = false, lifted = false, insert, children }) {
  const drag = useCommitmentDrag()?.drag
  return (
    <section
      className="group drop"
      data-drop-category={categoryId}
      data-over={drag?.target?.categoryId === categoryId}
      data-collapsed={collapsed}
      data-lifted={lifted}
      data-insert={insert}
      aria-labelledby={labelledBy}
      aria-label={label}
      // Mid-drag a category may lose its only box; holding its height stops the page jumping under the pointer.
      style={drag ? { minHeight: drag.heights[categoryId] } : undefined}
    >
      {children}
    </section>
  )
}
