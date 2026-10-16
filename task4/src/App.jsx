import { useEffect, useState } from 'react'
import { getTasks, getTask, saveTask, removeTask } from './api/tasks.js'
import TaskForm from './TaskForm.jsx'

function dateLabel(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function Status({ children }) {
  return (
    <span
      className={`status ${children === 'Done' ? 'done' : children === 'In progress' ? 'progress' : ''}`}
    >
      {children}
    </span>
  )
}

export default function App() {
  const [revision, setRevision] = useState(0)
  const [list, setList] = useState({ key: null, items: [], error: '' })
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState({ key: null, task: null, error: '' })
  const [detailRetry, setDetailRetry] = useState(0)
  const [mode, setMode] = useState('normal')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All tasks')
  const [editor, setEditor] = useState(null)
  const [command, setCommand] = useState(null)
  const [notice, setNotice] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const listKey = `${revision}:${mode}`
  const detailKey = `${selectedId}:${revision}:${mode}:${detailRetry}`
  const loading = list.key !== listKey
  const task = detail.key === detailKey ? detail.task : null
  const busy = command !== null

  useEffect(() => {
    const controller = new AbortController()
    getTasks({ signal: controller.signal, mode }).then(
      (items) => {
        if (!controller.signal.aborted) {
          setList({ key: listKey, items, error: '' })
          setSelectedId((id) =>
            items.some((item) => item.id === id) ? id : items[0]?.id || null,
          )
        }
      },
      (error) => {
        if (!controller.signal.aborted)
          setList({ key: listKey, items: [], error: error.message })
      },
    )
    return () => controller.abort()
  }, [listKey, mode])

  useEffect(() => {
    if (!selectedId) return
    const controller = new AbortController()
    getTask(selectedId, { signal: controller.signal, mode }).then(
      (result) => {
        if (!controller.signal.aborted)
          setDetail({ key: detailKey, task: result, error: '' })
      },
      (error) => {
        if (!controller.signal.aborted)
          setDetail({ key: detailKey, task: null, error: error.message })
      },
    )
    return () => controller.abort()
  }, [selectedId, detailKey, mode])

  useEffect(() => {
    if (!command) return
    const controller = new AbortController()
    const options = { signal: controller.signal, mode: command.mode }
    const operation =
      command.type === 'remove'
        ? removeTask(command.id, options)
        : saveTask(command.id, command.values, options)
    operation.then(
      (result) => {
        if (controller.signal.aborted) return
        setNotice({
          type: 'success',
          text:
            command.type === 'remove'
              ? `“${command.name}” removed.`
              : `“${result.name}” ${command.type === 'complete' ? (result.status === 'Done' ? 'completed' : 'reopened') : 'saved'}.`,
        })
        if (command.type === 'remove')
          setSelectedId((id) => (id === command.id ? null : id))
        if (command.type === 'save' && !command.id) setSelectedId(result.id)
        if (command.type === 'save') setEditor(null)
        setConfirmDelete(null)
        setRevision((value) => value + 1)
        setCommand(null)
      },
      (error) => {
        if (controller.signal.aborted) return
        setNotice({
          type: 'error',
          text: `Could not ${command.type === 'remove' ? 'remove' : 'save'} “${command.name}”. ${error.message}`,
        })
        setCommand(null)
      },
    )
    return () => controller.abort()
  }, [command])

  function startAction(type, id, values, name) {
    if (busy) return
    setNotice(null)
    setCommand({ type, id, values, name, mode })
  }

  function selectTask(id) {
    setSelectedId(id)
    setConfirmDelete(null)
    if (!busy) setEditor(null)
  }

  const items = list.items
  const done = items.filter((item) => item.status === 'Done').length
  const visible = items.filter(
    (item) =>
      (filter === 'All tasks' || item.status === filter) &&
      `${item.name} ${item.course}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  )

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="./">
          <span className="brand-mark">
            s<span>f</span>
          </span>
          study flow<span className="brand-dot">.</span>
        </a>
        <span className="header-note">A LITTLE FOCUS. EVERY DAY.</span>
        <span className="avatar" aria-label="Personal workspace">
          SF
        </span>
      </header>
      <main>
        <section className="intro">
          <div>
            <p className="eyebrow">YOUR PERSONAL STUDY SPACE</p>
            <h1>
              Small steps.
              <br />
              <span>Meaningful progress.</span>
            </h1>
            <p className="intro-copy">
              A clear mind starts with a clear plan. Make space for what’s next.
            </p>
          </div>
          <div className="progress-card">
            <span className="sparkle" aria-hidden="true">
              ✳
            </span>
            <p>ONE TASK AT A TIME</p>
            <strong>
              {loading || list.error ? '—' : `${done} / ${items.length}`}
            </strong>
            <span>tasks completed</span>
            <div className="progress-track">
              <div
                style={{
                  width: `${items.length ? (done / items.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </section>
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">A PLACE FOR YOUR PRIORITIES</p>
            <h2>
              Your workspace{' '}
              <span className="count">{loading ? '…' : items.length}</span>
            </h2>
          </div>
          <div className="actions">
            <button
              disabled={busy}
              onClick={() => {
                setRevision((value) => value + 1)
                setNotice(null)
              }}
            >
              ↻ <span>Reload</span>
            </button>
            <button
              className="primary"
              disabled={busy}
              onClick={() => {
                setEditor({ task: null })
                setNotice(null)
                setConfirmDelete(null)
              }}
            >
              + New task
            </button>
          </div>
        </div>
        {notice && (
          <div
            role={notice.type === 'error' ? 'alert' : 'status'}
            className={`notice ${notice.type}`}
          >
            <span>{notice.text}</span>
            <button
              aria-label="Dismiss notification"
              onClick={() => setNotice(null)}
            >
              ×
            </button>
          </div>
        )}
        {busy && (
          <div className="notice" role="status">
            <span className="spinner" />
            {command.type === 'remove' ? 'Removing' : 'Saving'} “{command.name}
            ”… You can browse other tasks while we work.
          </div>
        )}
        <div className="workspace">
          <section className="list-panel" aria-label="Task list">
            <label className="search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                aria-label="Search tasks"
                value={search}
                placeholder="Search your tasks…"
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <div className="tabs" aria-label="Filter tasks">
              {['All tasks', 'To do', 'In progress', 'Done'].map((value) => (
                <button
                  key={value}
                  className={filter === value ? 'active' : ''}
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="task-list" aria-busy={loading}>
              {loading ? (
                <div className="empty" role="status">
                  <span className="spinner" />
                  <h3>Gathering your tasks</h3>
                  <p>A little moment to get everything ready.</p>
                </div>
              ) : list.error ? (
                <div className="empty error-text" role="alert">
                  <h3>Couldn’t load your tasks</h3>
                  <p>{list.error}</p>
                  <button
                    onClick={() => setRevision((value) => value + 1)}
                    disabled={busy}
                  >
                    Try again
                  </button>
                </div>
              ) : !visible.length ? (
                <div className="empty">
                  <span className="empty-symbol">✓</span>
                  <h3>
                    {items.length ? 'No matching tasks' : 'A fresh start'}
                  </h3>
                  <p>
                    {items.length
                      ? 'Try a different search or filter.'
                      : 'Create your first task and take the next small step.'}
                  </p>
                  {items.length > 0 && (
                    <button
                      onClick={() => {
                        setSearch('')
                        setFilter('All tasks')
                      }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                visible.map((item, index) => (
                  <button
                    key={item.id}
                    className={`task-card ${selectedId === item.id ? 'selected' : ''}`}
                    aria-pressed={selectedId === item.id}
                    onClick={() => selectTask(item.id)}
                  >
                    <div className="task-top">
                      <span className="task-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="course">{item.course}</span>
                      <span
                        className={`priority-dot ${item.priority.toLowerCase()}`}
                        title={`${item.priority} priority`}
                      />
                    </div>
                    <h3>{item.name}</h3>
                    <div className="task-bottom">
                      <Status>{item.status}</Status>
                      <span>
                        {dateLabel(item.dueDate).replace(' 2026', '')}{' '}
                        <span className="arrow">↗</span>
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="list-footer">
              <span className="live-dot" />
              Your changes stay saved in this browser.
            </div>
          </section>
          <section
            className="detail-panel"
            aria-label="Task details"
            aria-busy={!editor && !!selectedId && detail.key !== detailKey}
          >
            {editor ? (
              <TaskForm
                key={editor.task?.id || 'new'}
                task={editor.task}
                busy={busy}
                onCancel={() => setEditor(null)}
                onSave={(values) =>
                  startAction(
                    'save',
                    editor.task?.id || null,
                    values,
                    values.name,
                  )
                }
              />
            ) : !selectedId ? (
              <div className="empty detail-empty">
                <span className="empty-symbol">↖</span>
                <h3>A little more detail</h3>
                <p>Select a task to see the full picture.</p>
              </div>
            ) : detail.key !== detailKey ? (
              <div className="empty detail-empty" role="status">
                <span className="spinner" />
                <h3>Opening your task</h3>
                <p>Loading the details…</p>
              </div>
            ) : detail.error ? (
              <div className="empty detail-empty error-text" role="alert">
                <h3>Details couldn’t be loaded</h3>
                <p>{detail.error}</p>
                <button onClick={() => setDetailRetry((value) => value + 1)}>
                  Retry details
                </button>
              </div>
            ) : (
              task && (
                <>
                  <div className="panel-heading">
                    <p className="eyebrow">THE DETAILS</p>
                    <span className="detail-icon" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                  <div className="detail-badges">
                    <Status>{task.status}</Status>
                    <span className="category">{task.category}</span>
                  </div>
                  <h2 className="detail-title">{task.name}</h2>
                  <p className="description">{task.description}</p>
                  <dl className="metadata">
                    <div>
                      <dt>Course</dt>
                      <dd>{task.course}</dd>
                    </div>
                    <div>
                      <dt>Priority</dt>
                      <dd>
                        <span
                          className={`priority-dot ${task.priority.toLowerCase()}`}
                        />
                        {task.priority}
                      </dd>
                    </div>
                    <div>
                      <dt>Due date</dt>
                      <dd>{dateLabel(task.dueDate)}</dd>
                    </div>
                    <div>
                      <dt>Time to focus</dt>
                      <dd>{task.estimate} minutes</dd>
                    </div>
                    <div>
                      <dt>Created</dt>
                      <dd>{dateLabel(task.createdAt.slice(0, 10))}</dd>
                    </div>
                    <div>
                      <dt>Category</dt>
                      <dd>{task.category}</dd>
                    </div>
                  </dl>
                  <div className="notes">
                    <h3>A note to yourself</h3>
                    <p>
                      {task.notes ||
                        'No notes yet. Add one when you edit this task.'}
                    </p>
                  </div>
                  <div className="detail-actions">
                    <button
                      className="primary"
                      disabled={busy}
                      onClick={() =>
                        startAction(
                          'complete',
                          task.id,
                          { status: task.status === 'Done' ? 'To do' : 'Done' },
                          task.name,
                        )
                      }
                    >
                      {task.status === 'Done'
                        ? '↶ Reopen task'
                        : '✓ Mark as complete'}
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => {
                        setEditor({ task })
                        setNotice(null)
                      }}
                    >
                      Edit task
                    </button>
                    <button
                      className="delete-button"
                      disabled={busy}
                      onClick={() => setConfirmDelete(task.id)}
                    >
                      Remove
                    </button>
                  </div>
                  {confirmDelete === task.id && (
                    <div className="delete-confirm" role="alert">
                      <p>Remove “{task.name}”? This cannot be undone.</p>
                      <div className="actions">
                        <button
                          className="danger"
                          disabled={busy}
                          onClick={() =>
                            startAction('remove', task.id, null, task.name)
                          }
                        >
                          Confirm remove
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => setConfirmDelete(null)}
                        >
                          Keep task
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )
            )}
          </section>
        </div>
        <footer>
          <span>Less overwhelm. More forward.</span>
          <label>
            Connection simulator
            <select
              aria-label="Connection simulator"
              value={mode}
              disabled={busy}
              onChange={(event) => setMode(event.target.value)}
            >
              <option value="normal">Normal · occasional errors</option>
              <option value="slow">Slow · 2–5 second delay</option>
              <option value="offline">Offline · requests fail</option>
            </select>
          </label>
        </footer>
      </main>
    </div>
  )
}
