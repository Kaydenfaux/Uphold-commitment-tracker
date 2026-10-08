import { useStore } from '../../store/useStore.js'
import { useConfirm } from '../../ui/confirm/useConfirm.js'

/** Marks it completed, asking first if that would tick off open steps. Resolves true if it was completed. */
export function useCompleteCommitment() {
  const { dispatch } = useStore()
  const confirm = useConfirm()
  return async (/** @type {import('../../lib/model.js').Commitment} */ commitment) => {
    const open = commitment.steps.filter((s) => !s.done).length
    if (open > 0) {
      const ok = await confirm({
        title: `Mark “${commitment.title}” as completed?`,
        message: `Its ${open} open step${open === 1 ? '' : 's'} will be ticked off too.`,
        confirmLabel: 'Mark as completed',
      })
      if (!ok) return false
    }
    dispatch({ type: 'setCommitmentDone', id: commitment.id, done: true })
    return true
  }
}
