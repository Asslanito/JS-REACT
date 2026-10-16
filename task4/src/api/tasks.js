import { seed } from './seed.js'

const storageKey = 'study-flow-task4-v1'
export const networkModes = {
  normal: { min: 500, max: 1800, failureRate: 0.05 },
  slow: { min: 2000, max: 5000, failureRate: 0.05 },
  offline: { min: 500, max: 900, failureRate: 1 },
}

function readTasks() {
  const saved = localStorage.getItem(storageKey)
  if (saved !== null) {
    const tasks = JSON.parse(saved)
    if (!Array.isArray(tasks))
      throw new Error('Stored tasks could not be read.')
    return tasks
  }
  localStorage.setItem(storageKey, JSON.stringify(seed))
  return structuredClone(seed)
}

function request(operation, { signal, mode = 'normal' } = {}) {
  const config = networkModes[mode] || networkModes.normal
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      reject(new DOMException('Request cancelled', 'AbortError'))
    }
    const timer = setTimeout(
      () => {
        signal?.removeEventListener('abort', abort)
        if (Math.random() < config.failureRate) {
          reject(new Error('The request failed. Please try again.'))
          return
        }
        try {
          resolve(operation())
        } catch (error) {
          reject(error)
        }
      },
      config.min + Math.floor(Math.random() * (config.max - config.min + 1)),
    )
    if (signal?.aborted) abort()
    else signal?.addEventListener('abort', abort, { once: true })
  })
}

function validate(task) {
  if (!task.name?.trim() || !task.description?.trim() || !task.course?.trim())
    throw new Error('Title, description and course are required.')
  if (!['Practice', 'Project', 'Revision'].includes(task.category))
    throw new Error('Choose a valid category.')
  if (!['Low', 'Medium', 'High'].includes(task.priority))
    throw new Error('Choose a valid priority.')
  if (!['To do', 'In progress', 'Done'].includes(task.status))
    throw new Error('Choose a valid status.')
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) ||
    Number.isNaN(Date.parse(task.dueDate))
  )
    throw new Error('Choose a valid due date.')
  if (
    !Number.isInteger(task.estimate) ||
    task.estimate < 5 ||
    task.estimate > 1440
  )
    throw new Error('Estimate must be between 5 and 1440 minutes.')
  return task
}

export function getTasks(options) {
  return request(
    () =>
      readTasks().map(({ id, name, course, priority, status, dueDate }) => ({
        id,
        name,
        course,
        priority,
        status,
        dueDate,
      })),
    options,
  )
}

export function getTask(id, options) {
  return request(() => {
    const task = readTasks().find((item) => item.id === id)
    if (!task) throw new Error('This task no longer exists. Reload the list.')
    return task
  }, options)
}

export function saveTask(id, values, options) {
  return request(() => {
    const tasks = readTasks()
    const existing = id ? tasks.find((task) => task.id === id) : null
    if (id && !existing)
      throw new Error('This task no longer exists. Reload the list.')
    const task = validate({
      ...existing,
      ...values,
      id: id || crypto.randomUUID(),
      createdAt: existing?.createdAt || new Date().toISOString(),
    })
    localStorage.setItem(
      storageKey,
      JSON.stringify(
        id
          ? tasks.map((item) => (item.id === id ? task : item))
          : [...tasks, task],
      ),
    )
    return task
  }, options)
}

export function removeTask(id, options) {
  return request(() => {
    const tasks = readTasks()
    if (!tasks.some((task) => task.id === id))
      throw new Error('This task no longer exists. Reload the list.')
    localStorage.setItem(
      storageKey,
      JSON.stringify(tasks.filter((task) => task.id !== id)),
    )
    return { id }
  }, options)
}
