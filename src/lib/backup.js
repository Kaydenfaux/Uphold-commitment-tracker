import { isoDateFromToday } from './dates.js'
import { normalizeState } from './storage.js'

/** @typedef {import('./model.js').State} State */

// Bump when the backup shape changes, so older files can still be read.
const BACKUP_VERSION = 1
const LAST_EXPORT_KEY = 'uphold:lastExport'

/** @param {State} state */
export function downloadBackup(state) {
  const backup = { app: 'uphold', version: BACKUP_VERSION, exportedAt: Date.now(), data: state }
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `uphold-backup-${isoDateFromToday()}.json`
  link.click()
  URL.revokeObjectURL(url)
  setLastExport(backup.exportedAt)
}

/**
 * Accepts a backup file, or a bare state (e.g. copied out of localStorage),
 * and runs it through the same validation as saved data.
 * @param {File} file
 * @returns {Promise<State | null>}
 */
export async function readBackup(file) {
  try {
    const parsed = JSON.parse(await file.text())
    return normalizeState(parsed?.data ?? parsed)
  } catch {
    return null
  }
}

/** @returns {number | null} */
export function getLastExport() {
  try {
    const value = Number(localStorage.getItem(LAST_EXPORT_KEY))
    return value > 0 ? value : null
  } catch {
    return null
  }
}

/** @param {number} timestamp */
function setLastExport(timestamp) {
  try {
    localStorage.setItem(LAST_EXPORT_KEY, String(timestamp))
  } catch {
    // Storage can be full or disabled; the reminder just won't remember.
  }
}

/** @param {number | null} timestamp */
export function formatLastExport(timestamp) {
  if (timestamp === null) return 'Never exported'
  const days = Math.floor((Date.now() - timestamp) / 86_400_000)
  if (days <= 0) return 'Last exported today'
  return `Last exported ${days} day${days === 1 ? '' : 's'} ago`
}
