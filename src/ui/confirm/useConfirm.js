import { use } from 'react'
import { ConfirmContext } from './ConfirmContext.js'

/** A styled replacement for window.confirm: `if (!(await confirm({ title }))) return` */
export function useConfirm() {
  const confirm = use(ConfirmContext)
  if (!confirm) throw new Error('useConfirm must be used inside <ConfirmProvider>')
  return confirm
}
