import { useState } from 'react'
import { formatMoment } from '../../lib/dates.js'
import { createThought, isConsolidated } from '../../lib/model.js'
import { useStore } from '../../store/useStore.js'
import { Dialog } from '../../ui/Dialog.jsx'
import { Field } from '../../ui/Field.jsx'

/** @typedef {import('../../lib/model.js').Thought} Thought */

/**
 * Turns a loose thought (plus any others the user adds) into a note they
 * write themselves: a new note, or added to one they already have. The
 * thoughts are shown for reference only; nothing is copied into the note.
 * @param {{ thought: Thought, onClose: () => void }} props
 */
export function ConsolidateDialog({ thought, onClose }) {
  const { state, dispatch } = useStore()
  const notes = state.thoughts.filter(isConsolidated).sort((a, b) => b.updatedAt - a.updatedAt)
  const others = state.thoughts
    .filter((t) => !isConsolidated(t) && t.id !== thought.id)
    .sort((a, b) => b.createdAt - a.createdAt)

  const [targetId, setTargetId] = useState('')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [extraIds, setExtraIds] = useState(/** @type {string[]} */ ([]))

  const included = [thought, ...others.filter((t) => extraIds.includes(t.id))].sort((a, b) => a.createdAt - b.createdAt)

  /** Adding to an existing note starts from what that note already says. @param {string} id */
  function chooseTarget(id) {
    const target = notes.find((n) => n.id === id)
    setTargetId(id)
    setTitle(target?.title ?? '')
    setText(target?.text ?? '')
  }

  /** @param {string} id */
  function toggleExtra(id) {
    setExtraIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  function handleSave(e) {
    e.preventDefault()
    if (!title.trim() || !text.trim()) return
    const target = notes.find((n) => n.id === targetId)
    const sources = [...(target?.sources ?? []), ...included.map((t) => ({ text: t.text, createdAt: t.createdAt }))]
    const fields = { title: title.trim(), text: text.trim(), sources }
    dispatch({
      type: 'consolidate',
      ids: included.map((t) => t.id),
      note: target ? { ...target, ...fields } : createThought(fields),
    })
    onClose()
  }

  return (
    <Dialog title="Consolidate" onClose={onClose}>
      <form className="form" onSubmit={handleSave}>
        <div className="consolidate__thoughts">
          <span className="field__label">
            {included.length === 1 ? 'Your thought' : `Your ${included.length} thoughts`}
          </span>
          <ul className="sources">
            {included.map((t) => (
              <li key={t.id}>
                <span className="sources__text">{t.text}</span>
                <span className="sources__when">{formatMoment(t.createdAt)}</span>
              </li>
            ))}
          </ul>
          {others.length > 0 && (
            <details className="consolidate__more">
              <summary>Include other loose thoughts ({others.length})</summary>
              <ul>
                {others.map((t) => (
                  <li key={t.id}>
                    <label className="consolidate__option">
                      <input type="checkbox" checked={extraIds.includes(t.id)} onChange={() => toggleExtra(t.id)} />
                      <span>{t.text}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>

        {notes.length > 0 && (
          <Field label="Into">
            <select className="input" value={targetId} onChange={(e) => chooseTarget(e.target.value)}>
              <option value="">A new note</option>
              {notes.map((n) => (
                <option key={n.id} value={n.id}>{n.title}</option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Title">
          <input
            className="input"
            required
            placeholder="Sum up the thought in a few words."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field label="Consolidated note">
          <textarea
            className="input"
            rows={7}
            required
            placeholder="Go into depth on the thought."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Field>
        <p className="form__hint">The original thoughts are kept inside the note.</p>
        <div className="form__actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary">Consolidate</button>
        </div>
      </form>
    </Dialog>
  )
}
