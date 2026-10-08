import { useState } from 'react'
import { isConsolidated } from '../../lib/model.js'
import { useStore } from '../../store/useStore.js'
import { Dialog } from '../../ui/Dialog.jsx'
import { Field } from '../../ui/Field.jsx'
import { useDeleteThought } from './useDeleteThought.js'

/**
 * Adds the thought if it isn't in the store yet, otherwise edits it (or the
 * consolidated note, which also has a title).
 * @param {{ thought: import('../../lib/model.js').Thought, onClose: () => void, onDeleted?: () => void }} props
 */
export function ThoughtDialog({ thought, onClose, onDeleted }) {
  const { state, dispatch } = useStore()
  const deleteThought = useDeleteThought()
  const [title, setTitle] = useState(thought.title)
  const [text, setText] = useState(thought.text)
  const isNew = !state.thoughts.some((t) => t.id === thought.id)
  const isNote = isConsolidated(thought)

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  function handleSave(e) {
    e.preventDefault()
    if (!text.trim() || (isNote && !title.trim())) return
    const fields = { title: title.trim(), text: text.trim() }
    dispatch(
      isNew
        ? { type: 'add', collection: 'thoughts', item: { ...thought, ...fields } }
        : { type: 'update', collection: 'thoughts', id: thought.id, patch: { ...fields, updatedAt: Date.now() } },
    )
    onClose()
  }

  async function handleDelete() {
    if (!(await deleteThought(thought))) return
    onClose()
    onDeleted?.()
  }

  return (
    <Dialog title={isNew ? 'Add a thought' : isNote ? 'Edit note' : 'Edit thought'} onClose={onClose}>
      <form className="form" onSubmit={handleSave}>
        {isNote && (
          <Field label="Title">
            <input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
        )}
        <Field label={isNote ? 'Note' : 'What’s on your mind?'}>
          <textarea
            className="input"
            rows={isNote ? 8 : 4}
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Field>
        <div className="form__actions">
          {!isNew && (
            <button type="button" className="btn btn--danger" onClick={handleDelete}>Delete</button>
          )}
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary">{isNew ? 'Save thought' : 'Save'}</button>
        </div>
      </form>
    </Dialog>
  )
}
