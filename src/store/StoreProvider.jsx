import { useEffect, useMemo, useReducer } from 'react'
import { loadState, saveState } from '../lib/storage.js'
import { StoreContext } from './StoreContext.js'
import { reducer } from './reducer.js'
import { createSeedState } from './seed.js'

/** @param {{ children: import('react').ReactNode }} props */
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => loadState() ?? createSeedState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext value={value}>{children}</StoreContext>
}
