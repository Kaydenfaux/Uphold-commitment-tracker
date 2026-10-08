import { useState } from 'react'
import { ThoughtDialog } from '../thoughts/ThoughtDialog.jsx'
import { SearchDialog } from './SearchDialog.jsx'

/** @typedef {import('../../lib/model.js').Thought} Thought */

export function SearchButton() {
  const [open, setOpen] = useState(false)
  // Loose thoughts have no page of their own, so a result opens them for editing.
  const [editing, setEditing] = useState(/** @type {Thought | null} */ (null))

  return (
    <>
      <button type="button" className="btn btn--sm search-btn" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m10.5 10.5 3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Search
      </button>
      {open && (
        <SearchDialog
          onClose={() => setOpen(false)}
          onOpenThought={(thought) => {
            setOpen(false)
            setEditing(thought)
          }}
        />
      )}
      {editing && <ThoughtDialog key={editing.id} thought={editing} onClose={() => setEditing(null)} />}
    </>
  )
}
