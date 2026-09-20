import test from 'node:test'
import assert from 'node:assert/strict'
import { createOrderTracker, placeOrder } from '../src/cafe.js'

test('closures keep independent private state and return snapshots', () => {
  const first = createOrderTracker()
  const second = createOrderTracker()
  assert.equal(first.next(), 1)
  assert.equal(first.next(), 2)
  first.complete(true)
  first.complete(false)
  const snapshot = first.snapshot()
  snapshot.total = 99
  assert.deepEqual(first.snapshot(), { total: 2, ready: 1, failed: 1 })
  assert.deepEqual(second.snapshot(), { total: 0, ready: 0, failed: 0 })
})

test('synchronous calls finish before microtasks, which precede timers', async () => {
  const events = []
  const tracker = createOrderTracker()
  const pending = placeOrder(
    { drinkId: 'latte', delay: 20, shouldFail: false },
    tracker,
    (event) => events.push(event),
  )
  assert.equal(events.length, 7)
  assert.ok(events.every((event) => event.type === 'sync'))
  const result = await pending
  assert.equal(result.total, 5.5)
  assert.equal(result.success, true)
  assert.deepEqual(
    events.map((event) => event.type),
    [
      'sync',
      'sync',
      'sync',
      'sync',
      'sync',
      'sync',
      'sync',
      'microtask',
      'microtask',
      'task',
      'task',
      'microtask',
      'microtask',
    ],
  )
  assert.equal(events[2].title, 'addTax() enters the stack')
  assert.equal(events[3].title, 'addTax() returns')
  assert.equal(events[4].title, 'getPrice() returns')
  assert.equal(events[7].title, 'Promise.then() runs')
  assert.equal(events[8].title, 'queueMicrotask() runs')
  assert.deepEqual(tracker.snapshot(), { total: 1, ready: 1, failed: 0 })
})

test('rejection is handled and finally runs without losing closure state', async () => {
  const tracker = createOrderTracker()
  const events = []
  const failed = await placeOrder(
    { drinkId: 'espresso', delay: 10, shouldFail: true },
    tracker,
    (event) => events.push(event),
  )
  assert.equal(failed.success, false)
  assert.match(failed.error, /out of stock/)
  assert.equal(events.at(-2).title, 'catch handles the rejected Promise')
  assert.equal(events.at(-1).title, 'finally finishes the order')
  const next = await placeOrder(
    { drinkId: 'filter', delay: 10, shouldFail: false },
    tracker,
    () => {},
  )
  assert.equal(next.id, 2)
  assert.deepEqual(tracker.snapshot(), { total: 2, ready: 1, failed: 1 })
})

test('invalid input does not increment the order counter', async () => {
  const tracker = createOrderTracker()
  await assert.rejects(
    placeOrder({ drinkId: 'unknown', delay: 10 }, tracker, () => {}),
    /valid drink/,
  )
  await assert.rejects(
    placeOrder({ drinkId: 'latte', delay: -1 }, tracker, () => {}),
    /valid drink/,
  )
  assert.equal(tracker.snapshot().total, 0)
})
