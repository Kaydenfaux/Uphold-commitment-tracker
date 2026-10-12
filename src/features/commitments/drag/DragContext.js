import { createContext } from 'react'

/**
 * Where a dropped box would land: a category id ('' for "No category") and the
 * box it would sit before (null for the end).
 * @typedef {{ categoryId: string, beforeId: string | null }} DropSpot
 *
 * `target` is null when the pointer isn't over any category, in which case
 * the box would go back to `origin`. `heights` are each category's height
 * when the drag began, used as a floor so none shrinks until it's over.
 * @typedef {{
 *   id: string, x: number, y: number, offsetX: number, offsetY: number,
 *   width: number, height: number, origin: DropSpot, target: DropSpot | null,
 *   heights: Record<string, number>
 * }} DragState
 *
 * A category being dragged by its heading. Categories stack vertically, so
 * there's always a spot: before `beforeId`, or at the end when it's null.
 * @typedef {{
 *   id: string, x: number, y: number, offsetX: number, offsetY: number,
 *   width: number, beforeId: string | null
 * }} CategoryDragState
 *
 * @typedef {(e: import('react').PointerEvent<HTMLElement>, id: string) => void} StartDrag
 *
 * @typedef {{
 *   drag: DragState | null,
 *   categoryDrag: CategoryDragState | null,
 *   startDrag: StartDrag,
 *   startCategoryDrag: StartDrag
 * }} DragValue
 */

/** Only the Commitments page provides this; elsewhere boxes aren't draggable. */
export const DragContext = createContext(/** @type {DragValue | null} */ (null))
