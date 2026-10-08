import { isConsolidated } from '../../lib/model.js'
import { useStore } from '../../store/useStore.js'
import { useConfirm } from '../../ui/confirm/useConfirm.js'

/** Asks first, then deletes a loose thought or a consolidated note. Resolves true if it was deleted. */
export function useDeleteThought() {
  const { dispatch } = useStore()
  const confirm = useConfirm()
  return async (/** @type {import('../../lib/model.js').Thought} */ thought) => {
    const count = thought.sources.length
    const ok = await confirm(
      isConsolidated(thought)
        ? {
            title: `Delete “${thought.title}”?`,
            message: `The ${count} thought${count === 1 ? '' : 's'} it was made from go too. This can’t be undone.`,
            confirmLabel: 'Delete',
            danger: true,
          }
        : { title: 'Delete this thought?', message: 'This can’t be undone.', confirmLabel: 'Delete', danger: true },
    )
    if (ok) dispatch({ type: 'remove', collection: 'thoughts', id: thought.id })
    return ok
  }
}
