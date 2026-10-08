import { useState } from 'react'
import { useStore } from '../../store/useStore.js'
import { Dialog } from '../../ui/Dialog.jsx'
import { Field } from '../../ui/Field.jsx'
import { useConfirm } from '../../ui/confirm/useConfirm.js'

/**
 * Creates the category if it isn't in the store yet, otherwise renames it.
 * @param {{ category: import('../../lib/model.js').Category, onClose: () => void }} props
 */
export function CategoryDialog({ category, onClose }) {
  const { state, dispatch } = useStore()
  const confirm = useConfirm()
  const [name, setName] = useState(category.name)
  const isNew = !state.categories.some((s) => s.id === category.id)

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  function handleSave(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    dispatch(
      isNew
        ? { type: 'add', collection: 'categories', item: { ...category, name: trimmed } }
        : { type: 'update', collection: 'categories', id: category.id, patch: { name: trimmed } },
    )
    onClose()
  }

  async function handleDelete() {
    const count = state.commitments.filter((c) => c.categoryId === category.id).length
    const ok = await confirm({
      title: `Delete the “${category.name}” category?`,
      message: count
        ? `Its ${count} commitment${count === 1 ? '' : 's'} won’t be deleted. They’ll move to “No category”.`
        : undefined,
      confirmLabel: 'Delete category',
      danger: true,
    })
    if (!ok) return
    dispatch({ type: 'removeCategory', id: category.id })
    onClose()
  }

  return (
    <Dialog title={isNew ? 'Add category' : 'Edit category'} onClose={onClose}>
      <form className="form" onSubmit={handleSave}>
        <Field label="Category name">
          <input
            className="input"
            required
            placeholder="e.g. Code, Blender, Health"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <div className="form__actions">
          {!isNew && (
            <button type="button" className="btn btn--danger" onClick={handleDelete}>Delete</button>
          )}
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary">{isNew ? 'Add category' : 'Save'}</button>
        </div>
      </form>
    </Dialog>
  )
}
