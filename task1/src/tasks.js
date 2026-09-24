const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

export function createTask(name, { random = Math.random, pause = wait } = {}) {
  let count = 0
  let status = 'Idle'
  let loadingTime = 0
  let elapsed = 0

  return {
    async run() {
      if (status === 'Running') throw new Error(`${name} is already running.`)
      count += 1
      status = 'Running'
      loadingTime = 500 + Math.floor(random() * 1501)
      const shouldFail = random() < 0.25
      const started = performance.now()
      try {
        await pause(loadingTime)
        if (shouldFail) throw new Error(`${name}: out of stock.`)
        status = 'Completed'
        return name
      } catch (error) {
        status = 'Failed'
        throw error
      } finally {
        elapsed = performance.now() - started
      }
    },
    getCount() {
      return count
    },
    reset() {
      if (status === 'Running') throw new Error('Wait for the task to finish.')
      count = 0
      status = 'Idle'
      loadingTime = 0
      elapsed = 0
    },
    snapshot() {
      return { name, status, count, loadingTime, elapsed }
    },
  }
}

export async function runTasks(tasks, mode, onChange = () => {}) {
  const started = performance.now()
  async function run(task) {
    const pending = task.run()
    onChange()
    try {
      return await pending
    } finally {
      onChange()
    }
  }
  let results
  if (mode === 'sequential') {
    results = []
    for (const task of tasks) {
      try {
        results.push({ status: 'fulfilled', value: await run(task) })
      } catch (reason) {
        results.push({ status: 'rejected', reason })
      }
    }
  } else {
    results = await Promise.allSettled(tasks.map(run))
  }
  return { results, elapsed: performance.now() - started }
}

export const expectedOutput = [
  'Script start',
  'Async start',
  'Script end',
  'Promise 1',
  'Promise 2',
  'After await',
  'Timer 1',
  'Timer 2',
]

export function runEventLoopDemo(onEvent) {
  const log = (message) => {
    console.log(message)
    onEvent(message)
  }
  log('Script start')
  setTimeout(() => log('Timer 1'), 0)
  Promise.resolve().then(() => log('Promise 1'))
  Promise.resolve().then(() => log('Promise 2'))
  async function example() {
    log('Async start')
    await Promise.resolve()
    log('After await')
  }
  example()
  return new Promise((resolve) => {
    setTimeout(() => {
      log('Timer 2')
      resolve()
    }, 0)
    log('Script end')
  })
}
