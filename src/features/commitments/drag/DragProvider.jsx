import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../../store/useStore.js'
import { DragContext } from './DragContext.js'
import {
  categorySpotAt,
  dropSpotAt,
  edgeScrollSpeed,
  measureZones,
  scrollPage,
  setPageDragging,
  spotOf,
  suppressNextClick,
} from './dom.js'

/**
 * @typedef {import('./DragContext.js').DragState} DragState
 * @typedef {import('./DragContext.js').CategoryDragState} CategoryDragState
 * @typedef {{ x: number, y: number }} Pointer
 * @typedef {{ onActivate?: () => void, onMove: (p: Pointer) => void, onDrop: () => void, onEnd: () => void }} DragHandlers
 */

// Mouse drags start after a small move; touch needs a press-and-hold so
// ordinary swipes still scroll the page.
const MOVE_THRESHOLD = 6
const LONG_PRESS_MS = 350

/**
 * Pointer-based dragging, so the real box follows the pointer instead of the
 * browser's faded drag image, and it works with touch too. Commitment boxes
 * and category headings share the pointer handling; only what's measured,
 * shown and dispatched differs.
 * @param {{ className?: string, children: (dragging: boolean) => import('react').ReactNode }} props
 */
export function DragProvider({ className, children }) {
  const { dispatch } = useStore()
  const [drag, setDrag] = useState(/** @type {DragState | null} */ (null))
  const [categoryDrag, setCategoryDrag] = useState(/** @type {CategoryDragState | null} */ (null))
  const session = useRef(
    /** @type {{ x: number, y: number, startX: number, startY: number, touch: boolean, active: boolean, timer: number, frame: number, stop: () => void } | null} */ (null),
  )

  // Leaving the page mid-drag must not leave listeners behind.
  useEffect(() => () => session.current?.stop(), [])

  /**
   * @param {import('react').PointerEvent<HTMLElement>} e
   * @param {DragHandlers} handlers
   */
  function track(e, { onActivate, onMove, onDrop, onEnd }) {
    const tick = () => {
      const s = session.current
      if (!s?.active) return
      const dy = edgeScrollSpeed(s.y)
      if (dy) {
        scrollPage(dy)
        onMove(s)
      }
      s.frame = requestAnimationFrame(tick)
    }

    const activate = () => {
      const s = session.current
      if (!s || s.active) return
      s.active = true
      onActivate?.()
      setPageDragging(true)
      onMove(s)
      s.frame = requestAnimationFrame(tick)
    }

    /** @param {PointerEvent} ev */
    const handleMove = (ev) => {
      const s = session.current
      if (!s) return
      s.x = ev.clientX
      s.y = ev.clientY
      if (s.active) return onMove(s)
      if (Math.hypot(s.x - s.startX, s.y - s.startY) < MOVE_THRESHOLD) return
      // A touch that moves before the hold completes is a scroll, not a drag.
      if (s.touch) stop()
      else activate()
    }

    const handleUp = () => {
      if (session.current?.active) {
        suppressNextClick()
        onDrop()
      }
      stop()
    }

    /** @param {Event} ev */
    const blockWhileActive = (ev) => {
      if (session.current?.active) ev.preventDefault()
    }

    /** @param {Event} ev */
    const blockMenu = (ev) => ev.preventDefault()

    function stop() {
      const s = session.current
      if (!s) return
      clearTimeout(s.timer)
      cancelAnimationFrame(s.frame)
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', stop)
      window.removeEventListener('touchmove', blockWhileActive)
      window.removeEventListener('contextmenu', blockMenu)
      setPageDragging(false)
      session.current = null
      onEnd()
    }

    session.current = {
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
      touch: e.pointerType === 'touch',
      active: false,
      timer: 0,
      frame: 0,
      stop,
    }
    if (session.current.touch) session.current.timer = window.setTimeout(activate, LONG_PRESS_MS)

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', stop)
    // Non-passive so an active touch drag can stop the page from scrolling.
    window.addEventListener('touchmove', blockWhileActive, { passive: false })
    // Long-pressing a link opens a menu on touch devices.
    window.addEventListener('contextmenu', blockMenu)
  }

  /** @type {import('./DragContext.js').StartDrag} */
  function startDrag(e, id) {
    if (e.button !== 0 || session.current) return
    const item = e.currentTarget.closest('[data-commitment-id]') ?? e.currentTarget
    const { left, top, width, height } = item.getBoundingClientRect()
    const origin = spotOf(item)
    const offsetX = e.clientX - left
    const offsetY = e.clientY - top
    /** @type {Record<string, number>} */
    let heights = {}
    /** @type {import('./DragContext.js').DropSpot | null} */
    let target = null

    track(e, {
      // Measured before the box lifts out of its grid, so the floors are the resting heights.
      onActivate: () => {
        heights = measureZones()
      },
      onMove: ({ x, y }) => {
        target = dropSpotAt(x, y)
        setDrag({ id, x, y, offsetX, offsetY, width, height, origin, target, heights })
      },
      onDrop: () => {
        if (target) dispatch({ type: 'moveCommitment', id, ...target })
      },
      onEnd: () => setDrag(null),
    })
  }

  /** @type {import('./DragContext.js').StartDrag} */
  function startCategoryDrag(e, id) {
    if (e.button !== 0 || session.current) return
    const { left, top, width } = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - left
    const offsetY = e.clientY - top
    /** @type {string | null} */
    let beforeId = null

    track(e, {
      onMove: ({ x, y }) => {
        beforeId = categorySpotAt(y, id)
        setCategoryDrag({ id, x, y, offsetX, offsetY, width, beforeId })
      },
      onDrop: () => dispatch({ type: 'moveCategory', id, beforeId }),
      onEnd: () => setCategoryDrag(null),
    })
  }

  const classes = [className, drag && 'is-dragging', categoryDrag && 'is-dragging-category']
  return (
    <DragContext value={{ drag, categoryDrag, startDrag, startCategoryDrag }}>
      <div className={classes.filter(Boolean).join(' ')}>{children(drag !== null)}</div>
    </DragContext>
  )
}
