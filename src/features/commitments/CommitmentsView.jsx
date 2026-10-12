import { useState } from 'react'
import { createCategory } from '../../lib/model.js'
import { compareByOrder } from '../../lib/sort.js'
import { useStore } from '../../store/useStore.js'
import { AddCommitmentButton } from './AddCommitmentButton.jsx'
import { CategoryDialog } from './CategoryDialog.jsx'
import { CategorySection } from './CategorySection.jsx'
import { CommitmentGrid } from './CommitmentGrid.jsx'
import { CategoryGhost } from './drag/CategoryGhost.jsx'
import { DragProvider } from './drag/DragProvider.jsx'
import { DropZone } from './drag/DropZone.jsx'

/** @typedef {import('../../lib/model.js').Category} Category */

export function CommitmentsView() {
  const { state } = useStore()
  const [editingCategory, setEditingCategory] = useState(/** @type {Category | null} */ (null))

  const active = state.commitments.filter((c) => !c.done).sort(compareByOrder)
  const keptCount = state.commitments.filter((c) => c.done).length
  const categoryIds = new Set(state.categories.map((s) => s.id))
  const unsorted = active.filter((c) => !categoryIds.has(c.categoryId))
  const hasCategories = state.categories.length > 0

  /** @param {boolean} dragging */
  const renderPage = (dragging) => (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Commitments</h1>
          <p className="page-intro">
            Things you’ve committed to and will uphold. Each one stays here until you’ve completed it.
            {' Drag a box to reorder it or move it to another category. Drag a category’s name to move the whole category, or click it to open or close it.'}
          </p>
        </div>
        <div className="section-head__actions">
          <button type="button" className="btn btn--sm" onClick={() => setEditingCategory(createCategory())}>
            <span aria-hidden="true">+</span> Add category
          </button>
          <AddCommitmentButton />
        </div>
      </header>

      {state.categories.map((category, i) => (
        <CategorySection
          key={category.id}
          category={category}
          items={active.filter((c) => c.categoryId === category.id)}
          isLast={i === state.categories.length - 1}
          onEdit={() => setEditingCategory(category)}
        />
      ))}
      <CategoryGhost />

      {/* Without any categories this is simply the list of commitments. While a
          box is dragged, "No category" shows even when empty so it can be dropped on. */}
      {!hasCategories ? (
        <DropZone categoryId="" label="Commitments">
          <CommitmentGrid items={unsorted} sortable />
        </DropZone>
      ) : (
        (unsorted.length > 0 || dragging) && (
          <DropZone categoryId="" labelledBy="category-none">
            <div className="section-head">
              <h2 id="category-none" className="section-title">
                No category
                <span className="section-title__count">{unsorted.length}</span>
              </h2>
            </div>
            <CommitmentGrid
              items={unsorted}
              sortable
              empty={<p className="drop__hint">Drop here to take it out of its category</p>}
            />
          </DropZone>
        )
      )}

      {keptCount > 0 && (
        <p className="completed">
          <a className="section-head__link" href="#/archive">
            {keptCount} completed, see them in the Archive
          </a>
        </p>
      )}
    </>
  )

  return (
    <>
      <DragProvider>{renderPage}</DragProvider>
      {editingCategory && (
        <CategoryDialog key={editingCategory.id} category={editingCategory} onClose={() => setEditingCategory(null)} />
      )}
    </>
  )
}
