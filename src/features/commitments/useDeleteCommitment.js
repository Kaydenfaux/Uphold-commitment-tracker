import { useStore } from '../../store/useStore.js'
import { useConfirm } from '../../ui/confirm/useConfirm.js'

/** Asks first, then deletes. Resolves true if it was deleted. */
export function useDeleteCommitment() {
  const { dispatch } = useStore()
  const confirm = useConfirm()
  return async (/** @type {import('../../lib/model.js').Commitment} */ commitment) => {
    const ok = await confirm({
      title: `Delete “${commitment.title}”?`,
      message: 'This can’t be undone.',
      confirmLabel: 'Delete',
      danger: true,
    })
    if (ok) dispatch({ type: 'remove', collection: 'commitments', id: commitment.id })
    return ok
  }
}
