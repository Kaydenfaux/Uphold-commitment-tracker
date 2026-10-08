// Page-level side effects of a drag, kept out of components.

/** @param {boolean} on */
export function setPageDragging(on) {
  document.body.classList.toggle('is-dragging-box', on)
}

const ITEM = '[data-commitment-id]:not([data-lifted="true"])'

/**
 * Where a box dropped at this point would land. The lifted box ignores the
 * pointer, so this sees what's beneath it. Boxes fill rows left to right, so
 * the spot is before the first box that's on a later row, or on this row and
 * right of the pointer.
 * @param {number} x @param {number} y
 * @returns {import('./DragContext.js').DropSpot | null}
 */
export function dropSpotAt(x, y) {
  const category = document.elementFromPoint(x, y)?.closest('[data-drop-category]')
  if (!category) return null
  const categoryId = category.getAttribute('data-drop-category') ?? ''
  for (const item of category.querySelectorAll(ITEM)) {
    const r = item.getBoundingClientRect()
    if (y < r.top || (y <= r.bottom && x < r.left + r.width / 2)) {
      return { categoryId, beforeId: item.getAttribute('data-commitment-id') }
    }
  }
  return { categoryId, beforeId: null }
}

/**
 * Where a box currently sits, so it can go back there.
 * @param {Element} el any element inside the box
 * @returns {import('./DragContext.js').DropSpot}
 */
export function spotOf(el) {
  const item = el.closest('[data-commitment-id]')
  let next = item?.nextElementSibling
  while (next && !next.matches(ITEM)) next = next.nextElementSibling
  return {
    categoryId: el.closest('[data-drop-category]')?.getAttribute('data-drop-category') ?? '',
    beforeId: next?.getAttribute('data-commitment-id') ?? null,
  }
}

/**
 * Each drop zone's current height, keyed by category id.
 * @returns {Record<string, number>}
 */
export function measureZones() {
  return Object.fromEntries(
    [...document.querySelectorAll('[data-drop-category]')].map((el) => [
      el.getAttribute('data-drop-category') ?? '',
      el.getBoundingClientRect().height,
    ]),
  )
}

/** Swallows the click the browser fires when the pointer is released after a drag. */
export function suppressNextClick() {
  /** @param {MouseEvent} e */
  const stop = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  window.addEventListener('click', stop, { capture: true, once: true })
  setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 0)
}

const EDGE = 80
const MAX_SPEED = 18

/** Scroll speed when the pointer is near the top or bottom edge. @param {number} y */
export function edgeScrollSpeed(y) {
  const h = window.innerHeight
  if (y < EDGE) return -MAX_SPEED * (1 - Math.max(y, 0) / EDGE)
  if (y > h - EDGE) return MAX_SPEED * (1 - Math.max(h - y, 0) / EDGE)
  return 0
}

/** @param {number} dy */
export function scrollPage(dy) {
  window.scrollBy(0, dy)
}
