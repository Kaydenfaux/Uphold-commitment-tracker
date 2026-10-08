import { useState } from 'react'
import { useStore } from '../../store/useStore.js'
import { Dialog } from '../../ui/Dialog.jsx'
import { Field } from '../../ui/Field.jsx'
import { PriorityPicker } from '../../ui/PriorityPicker.jsx'
import { useDeleteCommitment } from './useDeleteCommitment.js'

/** @typedef {import('../../lib/model.js').Commitment} Commitment */

/**
 * Creates the commitment if it isn't in the store yet, otherwise edits it.
 * @param {{ commitment: Commitment, onClose: () => void, onDeleted?: () => void }} props
 */
export function CommitmentDialog({ commitment, onClose, onDeleted }) {
  const { state, dispatch } = useStore()
  const deleteCommitment = useDeleteCommitment()
  const [draft, setDraft] = useState(commitment)
  const isNew = !state.commitments.some((c) => c.id === commitment.id)
  const set = (/** @type {Partial<Commitment>} */ patch) => setDraft((d) => ({ ...d, ...patch }))

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  function handleSave(e) {
    e.preventDefault()
    const title = draft.title.trim()
    if (!title) return
    const fields = { title, note: draft.note.trim(), priority: draft.priority, due: draft.due, categoryId: draft.categoryId }
    // Editing patches only the form's fields, so steps ticked meanwhile aren't overwritten.
    dispatch(
      isNew
        ? { type: 'add', collection: 'commitments', item: { ...draft, ...fields } }
        : { type: 'update', collection: 'commitments', id: commitment.id, patch: fields },
    )
    onClose()
  }

  async function handleDelete() {
    if (!(await deleteCommitment(commitment))) return
    onClose()
    onDeleted?.()
  }

  return (
    <Dialog title={isNew ? 'Make a commitment' : 'Edit commitment'} onClose={onClose}>
      <form className="form" onSubmit={handleSave}>
        <Field label="What are you committing to?">
          <input
            className="input"
            required
            placeholder="e.g. Find a job, Start freelancing"
            value={draft.title}
            onChange={(e) => set({ title: e.target.value })}
          />
        </Field>
        <Field label="Why it matters (optional)">
          <textarea
            className="input"
            rows={2}
            placeholder="A line to remind you why you made this commitment"
            value={draft.note}
            onChange={(e) => set({ note: e.target.value })}
          />
        </Field>
        <PriorityPicker value={draft.priority} onChange={(priority) => set({ priority })} />
        <div className="form__row">
          <Field label="Category">
            <select className="input" value={draft.categoryId} onChange={(e) => set({ categoryId: e.target.value })}>
              <option value="">No category</option>
              {state.categories.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Target date (optional)">
            <input type="date" className="input" value={draft.due} onChange={(e) => set({ due: e.target.value })} />
          </Field>
        </div>
        <div className="form__actions">
          {!isNew && (
            <button type="button" className="btn btn--danger" onClick={handleDelete}>Delete</button>
          )}
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary">{isNew ? 'Commit' : 'Save'}</button>
        </div>
      </form>
    </Dialog>
  )
}
