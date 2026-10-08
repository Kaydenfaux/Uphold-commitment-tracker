import { useCommitmentDrag } from './useCommitmentDrag.js'

/**
 * A group on the Commitments page that commitment boxes can be dropped into
 * and reordered within. An empty `categoryId` is the "No category" group.
 * @param {{ categoryId: string, labelledBy?: string, label?: string, children: import('react').ReactNode }} props
 */
export function DropZone({ categoryId, labelledBy, label, children }) {
  const drag = useCommitmentDrag()?.drag
  return (
    <section
      className="group drop"
      data-drop-category={categoryId}
      data-over={drag?.target?.categoryId === categoryId}
      aria-labelledby={labelledBy}
      aria-label={label}
      // Mid-drag a category may lose its only box; holding its height stops the page jumping under the pointer.
      style={drag ? { minHeight: drag.heights[categoryId] } : undefined}
    >
      {children}
    </section>
  )
}
