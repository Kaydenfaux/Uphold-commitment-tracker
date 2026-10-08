import { use } from 'react'
import { StoreContext } from './StoreContext.js'

export function useStore() {
  const store = use(StoreContext)
  if (!store) throw new Error('useStore must be used inside <StoreProvider>')
  return store
}
