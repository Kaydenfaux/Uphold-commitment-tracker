import { use } from 'react'
import { DragContext } from './DragContext.js'

export function useCommitmentDrag() {
  return use(DragContext)
}
