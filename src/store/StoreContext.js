import { createContext } from 'react'

/**
 * @typedef {{
 *   state: import('../lib/model.js').State,
 *   dispatch: import('react').Dispatch<import('./reducer.js').Action>
 * }} StoreValue
 */

/** @type {import('react').Context<StoreValue | null>} */
export const StoreContext = createContext(/** @type {StoreValue | null} */ (null))
