export default function TaskForm({ task, busy, onSave, onCancel }) {
  const values = task || {
    name: '',
    description: '',
    course: '',
    category: 'Practice',
    priority: 'Medium',
    status: 'To do',
    dueDate: '',
    estimate: 30,
    notes: '',
  }
  function submit(event) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    if (!busy)
      onSave({
        ...data,
        estimate: Number(data.estimate),
        name: data.name.trim(),
        description: data.description.trim(),
        course: data.course.trim(),
        notes: data.notes.trim(),
      })
  }
  return (
    <form onSubmit={submit} className="task-form">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">MAKE ROOM FOR PROGRESS</p>
          <h2>{task ? 'Edit task' : 'A new task'}</h2>
        </div>
      </div>
      <fieldset disabled={busy}>
        <label>
          Title
          <input
            autoFocus
            name="name"
            defaultValue={values.name}
            required
            maxLength={100}
            placeholder="What would you like to work on?"
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            defaultValue={values.description}
            required
            maxLength={2000}
            rows={3}
            placeholder="A little context goes a long way."
          />
        </label>
        <label>
          Course
          <input
            name="course"
            defaultValue={values.course}
            required
            maxLength={100}
            placeholder="e.g. JavaScript & React"
          />
        </label>
        <div className="form-grid">
          <label>
            Category
            <select name="category" defaultValue={values.category}>
              {['Practice', 'Project', 'Revision'].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select name="priority" defaultValue={values.priority}>
              {['Low', 'Medium', 'High'].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Due date
            <input
              type="date"
              name="dueDate"
              defaultValue={values.dueDate}
              required
            />
          </label>
          <label>
            Estimate (minutes)
            <input
              type="number"
              name="estimate"
              defaultValue={values.estimate}
              required
              min={5}
              max={1440}
              step={1}
            />
          </label>
          <label>
            Status
            <select name="status" defaultValue={values.status}>
              {['To do', 'In progress', 'Done'].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Notes
          <textarea
            name="notes"
            defaultValue={values.notes}
            maxLength={2000}
            rows={2}
            placeholder="Anything you want to remember."
          />
        </label>
        <div className="actions">
          <button type="submit" className="primary">
            {busy ? 'Saving…' : 'Save task'}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </fieldset>
    </form>
  )
}
