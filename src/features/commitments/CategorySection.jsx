import { useStore } from '../../store/useStore.js'
import { AddCommitmentButton } from './AddCommitmentButton.jsx'
import { CommitmentGrid } from './CommitmentGrid.jsx'
import { DropZone } from './drag/DropZone.jsx'
import { useCommitmentDrag } from './drag/useCommitmentDrag.js'

/**
 * One category on the Commitments page. Its heading opens and closes it, and
 * dragging the heading moves the whole category up or down the page.
 * @param {{
 *   category: import('../../lib/model.js').Category, items: import('../../lib/model.js').Commitment[],
 *   isLast: boolean, onEdit: () => void
 * }} props
 */
export function CategorySection({ category, items, isLast, onEdit }) {
  const { dispatch } = useStore()
  const dnd = useCommitmentDrag()
  const moving = dnd?.categoryDrag
  const headingId = `category-${category.id}`
  const { collapsed } = category

  /** @type {'before' | 'after' | undefined} */
  let insert
  if (moving?.beforeId === category.id) insert = 'before'
  else if (moving && moving.beforeId === null && isLast) insert = 'after'

  return (
    <DropZone
      categoryId={category.id}
      labelledBy={headingId}
      collapsed={collapsed}
      lifted={moving?.id === category.id}
      insert={insert}
    >
      <div className="section-head">
        <h2 id={headingId} className="section-title">
          <button
            type="button"
            className="category-toggle"
            aria-expanded={!collapsed}
            onClick={() =>
              dispatch({ type: 'update', collection: 'categories', id: category.id, patch: { collapsed: !collapsed } })
            }
            onPointerDown={dnd ? (e) => dnd.startCategoryDrag(e, category.id) : undefined}
          >
            <span className="category-toggle__chevron" aria-hidden="true" />
            {category.name}
            <span className="section-title__count">{items.length}</span>
          </button>
        </h2>
        <div className="section-head__actions">
          <button type="button" className="btn btn--quiet btn--sm" onClick={onEdit}>
            Edit
          </button>
          {!collapsed && items.length > 0 && <AddCommitmentButton categoryId={category.id} label="Add" />}
        </div>
      </div>
      {!collapsed && (
        <CommitmentGrid
          items={items}
          categoryId={category.id}
          emptyLabel={`Add a commitment to ${category.name}`}
          sortable
        />
      )}
    </DropZone>
  )
}
