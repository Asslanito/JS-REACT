import { useState } from 'react'

export default function CourseForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Development')
  const [goal, setGoal] = useState(8)

  function submit(event) {
    event.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), category, goal: Number(goal) })
  }

  return (
    <form className="course-form" onSubmit={submit} aria-label="New course">
      <label className="title-field">
        Course name
        <input
          autoFocus
          required
          maxLength={70}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What would you like to learn?"
        />
      </label>
      <label>
        Category
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {['Development', 'Design', 'Languages', 'Business'].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <label>
        Session goal
        <input
          type="number"
          min="1"
          max="100"
          required
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
        />
      </label>
      <div className="form-actions">
        <button className="primary" type="submit" disabled={!title.trim()}>
          Add course
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
