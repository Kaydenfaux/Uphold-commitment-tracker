import { useState } from 'react'
import { createCommitment } from '../../lib/model.js'
import { CommitmentDialog } from './CommitmentDialog.jsx'

/**
 * `tile` is the large dashed box used as the empty state; `button` sits in a heading.
 * @param {{ variant?: 'button' | 'tile', categoryId?: string, label?: string }} props
 */
export function AddCommitmentButton({ variant = 'button', categoryId = '', label }) {
  const [creating, setCreating] = useState(/** @type {import('../../lib/model.js').Commitment | null} */ (null))
  const open = () => setCreating(createCommitment({ categoryId }))

  return (
    <>
      {variant === 'tile' ? (
        <button type="button" className="add-tile" onClick={open}>
          <span className="add-tile__plus" aria-hidden="true">+</span>
          {label ?? 'Make a commitment'}
        </button>
      ) : (
        <button type="button" className="btn btn--sm" onClick={open}>
          <span aria-hidden="true">+</span> {label ?? 'Add commitment'}
        </button>
      )}
      {creating && <CommitmentDialog key={creating.id} commitment={creating} onClose={() => setCreating(null)} />}
    </>
  )
}
