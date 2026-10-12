import { useStore } from '../../../store/useStore.js'
import { useCommitmentDrag } from './useCommitmentDrag.js'

/** The heading of the category being dragged, following the pointer. */
export function CategoryGhost() {
  const { state } = useStore()
  const moving = useCommitmentDrag()?.categoryDrag
  const category = moving && state.categories.find((s) => s.id === moving.id)
  if (!moving || !category) return null
  const count = state.commitments.filter((c) => !c.done && c.categoryId === category.id).length

  return (
    <div
      className="category-ghost section-title"
      aria-hidden="true"
      style={{
        width: moving.width,
        transform: `translate(${moving.x - moving.offsetX}px, ${moving.y - moving.offsetY}px)`,
      }}
    >
      <span className="category-toggle__chevron" data-collapsed={category.collapsed} />
      {category.name}
      <span className="section-title__count">{count}</span>
    </div>
  )
}
