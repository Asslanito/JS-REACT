export const drinks = {
  espresso: { name: 'Espresso', price: 3 },
  latte: { name: 'Latte', price: 5 },
  filter: { name: 'Filter coffee', price: 4 },
}

export function createOrderTracker() {
  let total = 0
  let ready = 0
  let failed = 0

  return {
    next() {
      total += 1
      return total
    },
    complete(success) {
      if (success) ready += 1
      else failed += 1
    },
    snapshot() {
      return { total, ready, failed }
    },
  }
}

function addTax(price, log) {
  log(
    'sync',
    'addTax() enters the stack',
    'A nested function runs immediately.',
  )
  const total = Math.round(price * 1.1 * 100) / 100
  log('sync', 'addTax() returns', 'The innermost call finishes first.')
  return total
}

function getPrice(drink, log) {
  log('sync', 'getPrice() enters the stack', 'placeOrder() calls getPrice().')
  const total = addTax(drink.price, log)
  log('sync', 'getPrice() returns', 'Control goes back to placeOrder().')
  return total
}

function brewCoffee(drink, delay, shouldFail, log) {
  return new Promise((resolve, reject) => {
    log(
      'sync',
      'Promise executor runs',
      'The executor is synchronous; brewing uses a timer.',
    )
    setTimeout(() => {
      log(
        'task',
        'Brewing timer fires',
        `The ${delay} ms timer callback settles the Promise.`,
      )
      if (shouldFail)
        reject(new Error(`${drink.name} is out of stock. Try another order.`))
      else resolve(drink.name)
    }, delay)
  })
}

export async function placeOrder(
  { drinkId, delay, shouldFail },
  tracker,
  onEvent,
) {
  const drink = drinks[drinkId]
  if (!drink || !Number.isFinite(delay) || delay < 0) {
    throw new Error('Choose a valid drink and brewing time.')
  }

  const id = tracker.next()
  const started = performance.now()
  let sequence = 0
  const log = (type, title, detail) => {
    sequence += 1
    onEvent({
      sequence,
      type,
      title,
      detail,
      elapsed: performance.now() - started,
    })
  }

  log(
    'sync',
    `Order #${id}: placeOrder() starts`,
    'The async function runs synchronously up to its first await.',
  )
  const total = getPrice(drink, log)

  setTimeout(() => {
    log(
      'task',
      'Zero-delay timer runs',
      '0 ms means scheduled for later, not executed immediately.',
    )
  }, 0)

  Promise.resolve().then(() => {
    log(
      'microtask',
      'Promise.then() runs',
      'This reaction was queued before queueMicrotask().',
    )
  })

  queueMicrotask(() => {
    log(
      'microtask',
      'queueMicrotask() runs',
      'Microtasks drain before the next timer task.',
    )
  })

  const brewing = brewCoffee(drink, delay, shouldFail, log)
  log(
    'sync',
    'await pauses placeOrder()',
    'Only this function pauses. The JavaScript thread is free.',
  )

  try {
    const coffee = await brewing
    log(
      'microtask',
      'await resumes: coffee is ready',
      'The fulfilled Promise resumes the async function as a microtask.',
    )
    tracker.complete(true)
    return { id, coffee, total, success: true }
  } catch (error) {
    log('microtask', 'catch handles the rejected Promise', error.message)
    tracker.complete(false)
    return { id, total, success: false, error: error.message }
  } finally {
    log(
      'microtask',
      'finally finishes the order',
      'Cleanup runs on both success and failure, in the same continuation.',
    )
  }
}
