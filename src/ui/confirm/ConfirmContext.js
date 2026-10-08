import { createContext } from 'react'

/**
 * @typedef {{
 *   title: string, message?: string, confirmLabel?: string, danger?: boolean
 * }} ConfirmOptions
 *
 * Resolves true if the user confirmed, false if they cancelled.
 * @typedef {(options: ConfirmOptions) => Promise<boolean>} Confirm
 */

export const ConfirmContext = createContext(/** @type {Confirm | null} */ (null))
