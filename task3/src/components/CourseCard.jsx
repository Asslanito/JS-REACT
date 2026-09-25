import { useState } from 'react'

const symbols = {
  Development: '</>',
  Design: 'Aa',
  Languages: '文',
  Business: '↗',
}

export default function CourseCard({ course, onUpdate, onRemove, onReset }) {
  const [sessions, setSessions] = useState(0)
  const [notes, setNotes] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(course.title)
  const percentage = Math.round((sessions / course.goal) * 100)

  console.log('CourseCard render', {
    id: course.id,
    resetKey: course.version,
    sessions,
    notes,
  })

  function saveTitle(event) {
    event.preventDefault()
    if (!draft.trim()) return
    onUpdate(course.id, { title: draft.trim() })
    setEditing(false)
  }

  return (
    <article className="course-card" aria-label={course.title}>
      <div className="card-top">
        <span
          className={`course-symbol ${course.category.toLowerCase()}`}
          aria-hidden="true"
        >
          {symbols[course.category]}
        </span>
        <label
          className={`status-select ${course.status.replace(' ', '-').toLowerCase()}`}
        >
          <span className="sr-only">Status for {course.title}</span>
          <select
            value={course.status}
            onChange={(event) =>
              onUpdate(course.id, { status: event.target.value })
            }
          >
            <option>Planned</option>
            <option>In progress</option>
            <option>Completed</option>
          </select>
        </label>
      </div>
      <p className="category">{course.category}</p>
      {editing ? (
        <form className="edit-form" onSubmit={saveTitle}>
          <input
            aria-label="Edit course name"
            autoFocus
            required
            maxLength={70}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit" disabled={!draft.trim()}>
            Save
          </button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <h3>{course.title}</h3>
      )}
      <div className="progress-label">
        <span>Study sessions</span>
        <strong>
          {sessions}
          <span> / {course.goal}</span>
        </strong>
      </div>
      <progress
        value={sessions}
        max={course.goal}
        aria-label={`${course.title} session progress`}
      >
        {percentage}%
      </progress>
      <div className="session-actions">
        <button
          className="session-add"
          onClick={() =>
            setSessions((value) => Math.min(value + 1, course.goal))
          }
          disabled={sessions === course.goal}
        >
          {sessions === course.goal ? '✓ Goal reached' : '+ Log a session'}
        </button>
        <button
          className="undo"
          aria-label={`Undo session for ${course.title}`}
          disabled={sessions === 0}
          onClick={() => setSessions((value) => Math.max(0, value - 1))}
        >
          ↶
        </button>
      </div>
      <label className="notes-label">
        My notes
        <textarea
          rows="2"
          maxLength={500}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="A takeaway, an idea, a next step…"
        />
      </label>
      <div className="card-footer">
        <button
          onClick={() => {
            setDraft(course.title)
            setEditing(true)
          }}
        >
          Edit
        </button>
        <button
          title="Clear sessions and notes"
          onClick={() => onReset(course.id)}
        >
          Reset progress
        </button>
        <button
          className="remove"
          aria-label={`Remove ${course.title}`}
          onClick={() => onRemove(course.id)}
        >
          Remove
        </button>
      </div>
    </article>
  )
}
