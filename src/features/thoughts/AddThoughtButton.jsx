import { useState } from 'react'
import { createThought } from '../../lib/model.js'
import { ThoughtDialog } from './ThoughtDialog.jsx'

/**
 * `tile` is the large dashed box used as the empty state; `button` sits in a heading.
 * @param {{ variant?: 'button' | 'tile' }} props
 */
export function AddThoughtButton({ variant = 'button' }) {
  const [creating, setCreating] = useState(/** @type {import('../../lib/model.js').Thought | null} */ (null))
  const open = () => setCreating(createThought())

  return (
    <>
      {variant === 'tile' ? (
        <button type="button" className="add-tile" onClick={open}>
          <span className="add-tile__plus" aria-hidden="true">+</span>
          Write down a thought
        </button>
      ) : (
        <button type="button" className="btn btn--sm" onClick={open} title="Add thought (T)">
          <span aria-hidden="true">+</span> Add thought
        </button>
      )}
      {creating && <ThoughtDialog key={creating.id} thought={creating} onClose={() => setCreating(null)} />}
    </>
  )
}
