import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createTask,
  expectedOutput,
  runEventLoopDemo,
  runTasks,
} from '../src/tasks.js'

const tick = () => new Promise((resolve) => setImmediate(resolve))

test('tasks keep independent counters, protect running state, and reset', async () => {
  let finish
  const first = createTask('Espresso', {
    random: () => 0.5,
    pause: () =>
      new Promise((resolve) => {
        finish = resolve
      }),
  })
  const second = createTask('Latte')
  const pending = first.run()
  assert.equal(first.getCount(), 1)
  assert.equal(second.getCount(), 0)
  assert.equal(first.snapshot().status, 'Running')
  assert.equal(first.snapshot().loadingTime, 1250)
  assert.throws(() => first.reset(), /Wait/)
  await assert.rejects(first.run(), /already running/)
  assert.equal(first.getCount(), 1)
  finish()
  await pending
  const snapshot = first.snapshot()
  snapshot.count = 100
  assert.equal(first.getCount(), 1)
  assert.equal(first.snapshot().status, 'Completed')
  first.reset()
  assert.deepEqual(first.snapshot(), {
    name: 'Espresso',
    status: 'Idle',
    count: 0,
    loadingTime: 0,
    elapsed: 0,
  })
})

test('concurrent batch starts every task and waits even after a rejection', async () => {
  const releases = []
  const tasks = [0, 0.5].map((randomValue, index) =>
    createTask(`Coffee ${index}`, {
      random: () => randomValue,
      pause: () =>
        new Promise((resolve) => {
          releases[index] = resolve
        }),
    }),
  )
  let finished = false
  const pending = runTasks(tasks, 'concurrent').then((result) => {
    finished = true
    return result
  })
  assert.equal(releases.length, 2)
  assert.ok(tasks.every((task) => task.snapshot().status === 'Running'))
  releases[0]()
  await tick()
  assert.equal(tasks[0].snapshot().status, 'Failed')
  assert.equal(finished, false)
  releases[1]()
  const batch = await pending
  assert.deepEqual(
    batch.results.map((result) => result.status),
    ['rejected', 'fulfilled'],
  )
  assert.equal(finished, true)
  assert.ok(batch.elapsed >= 0)
})

test('sequential batch starts the next task only after settlement and continues after failure', async () => {
  const releases = []
  const tasks = [0, 0.5].map((randomValue, index) =>
    createTask(`Coffee ${index}`, {
      random: () => randomValue,
      pause: () =>
        new Promise((resolve) => {
          releases[index] = resolve
        }),
    }),
  )
  const pending = runTasks(tasks, 'sequential')
  assert.equal(tasks[0].getCount(), 1)
  assert.equal(tasks[1].getCount(), 0)
  releases[0]()
  await tick()
  assert.equal(tasks[0].snapshot().status, 'Failed')
  assert.equal(tasks[1].snapshot().status, 'Running')
  releases[1]()
  const batch = await pending
  assert.deepEqual(
    batch.results.map((result) => result.status),
    ['rejected', 'fulfilled'],
  )
})

test('event loop demo matches the prediction with two Promise callbacks and two timers', async () => {
  const actual = []
  const pending = runEventLoopDemo((message) => actual.push(message))
  assert.deepEqual(actual, ['Script start', 'Async start', 'Script end'])
  await pending
  assert.deepEqual(actual, expectedOutput)
})
