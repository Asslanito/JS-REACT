import {
  createTask,
  expectedOutput,
  runEventLoopDemo,
  runTasks,
} from './tasks.js'

const tasks = ['Brew espresso', 'Brew latte', 'Brew filter coffee'].map(
  (name) => createTask(name),
)
const taskList = document.querySelector('#task-list')
const taskStatus = document.querySelector('#batch-status')
const batchButtons = [...document.querySelectorAll('[data-run-mode]')]
let busy = false

function renderTasks() {
  taskList.replaceChildren()
  for (const task of tasks) {
    const { name, status, count, loadingTime, elapsed } = task.snapshot()
    const card = document.createElement('article')
    card.className = 'batch-card'
    const title = document.createElement('h3')
    title.textContent = name
    const state = document.createElement('p')
    state.textContent = `${status} · Runs: ${count}`
    state.dataset.status = status
    const timing = document.createElement('p')
    timing.textContent = loadingTime
      ? `Delay: ${loadingTime} ms · Elapsed: ${status === 'Running' ? '…' : `${Math.round(elapsed)} ms`}`
      : 'Delay: 500–2000 ms per run'
    const actions = document.createElement('div')
    actions.className = 'batch-actions'
    const runButton = document.createElement('button')
    runButton.textContent = 'Run task'
    runButton.disabled = busy
    runButton.addEventListener('click', () => start([task], 'concurrent'))
    const resetButton = document.createElement('button')
    resetButton.textContent = 'Reset counter'
    resetButton.disabled = busy
    resetButton.addEventListener('click', () => {
      task.reset()
      renderTasks()
    })
    actions.append(runButton, resetButton)
    card.append(title, state, timing, actions)
    taskList.append(card)
  }
}

async function start(selectedTasks, mode) {
  if (busy) return
  busy = true
  for (const button of batchButtons) button.disabled = true
  taskStatus.textContent = `Running ${selectedTasks.length} task(s) ${mode === 'sequential' ? 'one after another' : 'together'}…`
  renderTasks()
  try {
    const { results, elapsed } = await runTasks(
      selectedTasks,
      mode,
      renderTasks,
    )
    const completed = results.filter(
      (result) => result.status === 'fulfilled',
    ).length
    taskStatus.textContent = `${selectedTasks.length === tasks.length ? 'All tasks finished' : 'Task finished'} · ${completed} completed, ${results.length - completed} failed · ${Math.round(elapsed)} ms`
    if (selectedTasks.length === tasks.length) {
      document.querySelector(`#${mode}-time`).textContent =
        `${Math.round(elapsed)} ms`
    }
  } catch (error) {
    taskStatus.textContent = error.message
  } finally {
    busy = false
    for (const button of batchButtons) button.disabled = false
    renderTasks()
  }
}

for (const button of batchButtons) {
  button.addEventListener('click', () => start(tasks, button.dataset.runMode))
}

const expectedList = document.querySelector('#expected-output')
const actualList = document.querySelector('#actual-output')
for (const message of expectedOutput) {
  const item = document.createElement('li')
  item.textContent = message
  expectedList.append(item)
}
const demoButton = document.querySelector('#run-event-loop')
demoButton.addEventListener('click', async () => {
  demoButton.disabled = true
  actualList.replaceChildren()
  try {
    await runEventLoopDemo((message) => {
      const item = document.createElement('li')
      item.textContent = message
      actualList.append(item)
    })
  } finally {
    demoButton.disabled = false
  }
})

renderTasks()
