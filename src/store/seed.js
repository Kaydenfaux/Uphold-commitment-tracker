import { isoDateFromToday } from '../lib/dates.js'
import { createCommitment, createCategory, createStep, createThought } from '../lib/model.js'

const HOUR = 3_600_000

/**
 * Example content shown on first visit so every screen has something to
 * look at. It is ordinary data: edit or delete it like anything else.
 * @returns {import('../lib/model.js').State}
 */
export function createSeedState() {
  const now = Date.now()
  const steps = (/** @type {Array<[string, boolean?]>} */ list) =>
    list.map(([title, done = false]) => createStep({ title, done }))
  const thought = (/** @type {string} */ text, /** @type {number} */ hoursAgo) =>
    createThought({ text, createdAt: now - hoursAgo * HOUR, updatedAt: now - hoursAgo * HOUR })

  const career = createCategory({ name: 'Career' })
  const code = createCategory({ name: 'Code' })
  const blender = createCategory({ name: 'Blender' })

  // Made in the same millisecond, so give them an explicit order.
  const inOrder = (/** @type {import('../lib/model.js').Commitment[]} */ list) => list.map((c, i) => ({ ...c, order: i }))

  return {
    categories: [career, code, blender],
    commitments: inOrder([
      createCommitment({
        title: 'Find a job',
        note: 'Junior roles in web or 3D. Apply to a few every week.',
        priority: 'urgent',
        categoryId: career.id,
        steps: steps([['Update my CV'], ['Apply to 5 jobs this week'], ['Ask friends about openings', true]]),
      }),
      createCommitment({
        title: 'Finish this website',
        note: 'Get it good enough to use every day, then put it online.',
        priority: 'high',
        due: isoDateFromToday(14),
        categoryId: code.id,
        steps: steps([['Commitments page', true], ['Thoughts page', true], ['Put it online']]),
      }),
      createCommitment({
        title: 'Start freelancing',
        note: 'Pick a service, make a portfolio page and land a first client.',
        priority: 'medium',
        categoryId: career.id,
      }),
      createCommitment({
        title: 'Finish the Blender scene',
        note: 'Lighting, materials, then the final render.',
        priority: 'low',
        categoryId: blender.id,
      }),
    ]),
    thoughts: [
      thought('Maybe freelancing could start with small 3D product renders for local shops?', 50),
      thought('Portfolio should show the process, not just the final render.', 26),
      thought('I work best in the mornings. Protect that time for the job hunt.', 3),
      createThought({
        title: 'How I want to work',
        text: 'Mornings are for the hardest thing. One big thing a day beats five half-done ones.',
        sources: [
          { text: 'Mornings are when I actually get stuff done.', createdAt: now - 120 * HOUR },
          { text: 'Doing one thing properly feels better than juggling five.', createdAt: now - 96 * HOUR },
        ],
        createdAt: now - 72 * HOUR,
        updatedAt: now - 72 * HOUR,
      }),
    ],
  }
}
