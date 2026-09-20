import { createOrderTracker, drinks, placeOrder } from './cafe.js'

const form = document.querySelector('#order-form')
const delayInput = document.querySelector('#delay')
const delayValue = document.querySelector('#delay-value')
const orderButton = document.querySelector('#order-button')
const clearButton = document.querySelector('#clear-trace')
const traceList = document.querySelector('#trace-list')
const emptyTrace = document.querySelector('#trace-empty')
const traceStatus = document.querySelector('#trace-status')
const orderStatus = document.querySelector('#order-status')
const orderDetail = document.querySelector('#order-detail')
const filterButtons = [...document.querySelectorAll('[data-filter]')]
const tracker = createOrderTracker()
let activeFilter = 'all'
let isBrewing = false

function updateStats() {
  const { total, ready, failed } = tracker.snapshot()
  document.querySelector('#total-orders').textContent = total
  document.querySelector('#ready-orders').textContent = ready
  document.querySelector('#failed-orders').textContent = failed
}

function applyFilter() {
  for (const row of traceList.children) {
    row.hidden = activeFilter !== 'all' && row.dataset.type !== activeFilter
  }
  for (const button of filterButtons) {
    button.setAttribute('aria-pressed', button.dataset.filter === activeFilter)
  }
}

function addEvent(event) {
  const row = document.createElement('li')
  row.className = `trace-row ${event.type}`
  row.dataset.type = event.type
  const number = document.createElement('span')
  number.className = 'trace-number'
  number.textContent = String(event.sequence).padStart(2, '0')
  const content = document.createElement('div')
  content.className = 'trace-content'
  const heading = document.createElement('strong')
  heading.textContent = event.title
  const detail = document.createElement('p')
  detail.textContent = event.detail
  const type = document.createElement('span')
  type.className = 'event-type'
  type.textContent = event.type
  const time = document.createElement('span')
  time.className = 'trace-time'
  time.textContent = `${Math.round(event.elapsed)} ms`
  content.append(heading, detail, type)
  row.append(number, content, time)
  traceList.append(row)
  emptyTrace.hidden = true
  applyFilter()
}

function setBusy(busy) {
  isBrewing = busy
  for (const input of form.querySelectorAll('input, button'))
    input.disabled = busy
  clearButton.disabled = busy
  orderButton.textContent = busy ? 'Brewing your coffee…' : 'Place order ↗'
  traceStatus.textContent = busy ? 'BREWING' : 'COMPLETE'
  traceStatus.classList.toggle('is-running', busy)
}

delayInput.addEventListener('input', () => {
  delayValue.textContent = `${(Number(delayInput.value) / 1000).toFixed(1)} s`
})

for (const button of filterButtons) {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter
    applyFilter()
  })
}

clearButton.addEventListener('click', () => {
  if (isBrewing) return
  traceList.replaceChildren()
  emptyTrace.hidden = false
  traceStatus.textContent = 'READY'
})

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (isBrewing) return
  const drinkId = new FormData(form).get('drink')
  const shouldFail = document.querySelector('#fail-order').checked
  traceList.replaceChildren()
  activeFilter = 'all'
  setBusy(true)
  orderStatus.textContent = `Brewing your ${drinks[drinkId].name.toLowerCase()}…`
  orderDetail.textContent =
    'The page is still responsive. Try the trace filters.'

  try {
    const pendingOrder = placeOrder(
      { drinkId, delay: Number(delayInput.value), shouldFail },
      tracker,
      addEvent,
    )
    updateStats()
    const result = await pendingOrder
    orderStatus.textContent = result.success
      ? `Order #${result.id} is ready. Enjoy!`
      : `Order #${result.id} couldn't be completed.`
    orderDetail.textContent = result.success
      ? `${result.coffee} · $${result.total.toFixed(2)} including 10% tax`
      : result.error
  } catch (error) {
    orderStatus.textContent = 'Something went wrong.'
    orderDetail.textContent = error.message
  } finally {
    updateStats()
    setBusy(false)
  }
})
