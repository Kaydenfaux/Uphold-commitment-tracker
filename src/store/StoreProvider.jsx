import { useEffect, useMemo, useReducer } from 'react'
import { loadState, saveState } from '../lib/storage.js'
import { StoreContext } from './StoreContext.js'
import { reducer } from './reducer.js'

/** @returns {import('../lib/model.js').State} */
const createEmptyState = () => ({ categories: [], commitments: [], thoughts: [] })

/** @param {{ children: import('react').ReactNode }} props */
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => loadState() ?? createEmptyState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext value={value}>{children}</StoreContext>
}
