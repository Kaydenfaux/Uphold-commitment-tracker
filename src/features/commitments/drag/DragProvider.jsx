import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../../store/useStore.js'
import { DragContext } from './DragContext.js'
import { dropSpotAt, edgeScrollSpeed, measureZones, scrollPage, setPageDragging, spotOf, suppressNextClick } from './dom.js'

/** @typedef {import('./DragContext.js').DragState} DragState */

// Mouse drags start after a small move; touch needs a press-and-hold so
// ordinary swipes still scroll the page.
const MOVE_THRESHOLD = 6
const LONG_PRESS_MS = 350

/**
 * Pointer-based dragging, so the real box follows the pointer instead of the
 * browser's faded drag image, and it works with touch too.
 * @param {{ className?: string, children: (dragging: boolean) => import('react').ReactNode }} props
 */
export function DragProvider({ className, children }) {
  const { dispatch } = useStore()
  const [drag, setDrag] = useState(/** @type {DragState | null} */ (null))
  const session = useRef(
    /** @type {(DragState & { startX: number, startY: number, touch: boolean, active: boolean, timer: number, frame: number, stop: () => void }) | null} */ (null),
  )

  // Leaving the page mid-drag must not leave listeners behind.
  useEffect(() => () => session.current?.stop(), [])

  /** @type {import('./DragContext.js').DragValue['startDrag']} */
  function startDrag(e, id) {
    if (e.button !== 0 || session.current) return
    const item = e.currentTarget.closest('[data-commitment-id]') ?? e.currentTarget
    const rect = item.getBoundingClientRect()
    const origin = spotOf(item)

    const publish = () => {
      const s = session.current
      if (!s) return
      s.target = dropSpotAt(s.x, s.y)
      const { x, y, offsetX, offsetY, width, height, target, heights } = s
      setDrag({ id, x, y, offsetX, offsetY, width, height, origin, target, heights })
    }

    const tick = () => {
      const s = session.current
      if (!s?.active) return
      const dy = edgeScrollSpeed(s.y)
      if (dy) {
        scrollPage(dy)
        publish()
      }
      s.frame = requestAnimationFrame(tick)
    }

    const activate = () => {
      const s = session.current
      if (!s || s.active) return
      s.active = true
      // Measured before the box lifts out of its grid, so the floors are the resting heights.
      s.heights = measureZones()
      setPageDragging(true)
      publish()
      s.frame = requestAnimationFrame(tick)
    }

    /** @param {PointerEvent} ev */
    const onMove = (ev) => {
      const s = session.current
      if (!s) return
      s.x = ev.clientX
      s.y = ev.clientY
      if (s.active) return publish()
      if (Math.hypot(s.x - s.startX, s.y - s.startY) < MOVE_THRESHOLD) return
      // A touch that moves before the hold completes is a scroll, not a drag.
      if (s.touch) stop()
      else activate()
    }

    const onUp = () => {
      const s = session.current
      if (s?.active) {
        suppressNextClick()
        if (s.target) dispatch({ type: 'moveCommitment', id, ...s.target })
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
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', stop)
      window.removeEventListener('touchmove', blockWhileActive)
      window.removeEventListener('contextmenu', blockMenu)
      setPageDragging(false)
      session.current = null
      setDrag(null)
    }

    session.current = {
      id,
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      origin,
      target: null,
      heights: {},
      touch: e.pointerType === 'touch',
      active: false,
      timer: 0,
      frame: 0,
      stop,
    }
    if (session.current.touch) session.current.timer = window.setTimeout(activate, LONG_PRESS_MS)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', stop)
    // Non-passive so an active touch drag can stop the page from scrolling.
    window.addEventListener('touchmove', blockWhileActive, { passive: false })
    // Long-pressing a link opens a menu on touch devices.
    window.addEventListener('contextmenu', blockMenu)
  }

  return (
    <DragContext value={{ drag, startDrag }}>
      <div className={[className, drag ? 'is-dragging' : ''].filter(Boolean).join(' ')}>{children(drag !== null)}</div>
    </DragContext>
  )
}
