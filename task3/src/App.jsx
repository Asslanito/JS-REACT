import { useState } from 'react'
import CourseCard from './components/CourseCard'
import CourseForm from './components/CourseForm'

const initialCourses = [
  {
    id: 'react',
    title: 'React fundamentals',
    category: 'Development',
    status: 'In progress',
    goal: 12,
    version: 0,
  },
  {
    id: 'interfaces',
    title: 'Designing better interfaces',
    category: 'Design',
    status: 'In progress',
    goal: 8,
    version: 0,
  },
  {
    id: 'chinese',
    title: 'Everyday Mandarin',
    category: 'Languages',
    status: 'Planned',
    goal: 10,
    version: 0,
  },
  {
    id: 'javascript',
    title: 'Modern JavaScript',
    category: 'Development',
    status: 'Completed',
    goal: 16,
    version: 0,
  },
  {
    id: 'product',
    title: 'Product thinking',
    category: 'Business',
    status: 'Planned',
    goal: 6,
    version: 0,
  },
  {
    id: 'type',
    title: 'The art of typography',
    category: 'Design',
    status: 'In progress',
    goal: 8,
    version: 0,
  },
]
const filters = ['All courses', 'In progress', 'Planned', 'Completed']

export default function App() {
  const [courses, setCourses] = useState(initialCourses)
  const [filter, setFilter] = useState('All courses')
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const completed = courses.filter(
    (course) => course.status === 'Completed',
  ).length
  const active = courses.filter(
    (course) => course.status === 'In progress',
  ).length
  const query = search.trim().toLowerCase()
  const matches = (course) =>
    (filter === 'All courses' || course.status === filter) &&
    `${course.title} ${course.category}`.toLowerCase().includes(query)
  const visibleCount = courses.filter(matches).length

  console.log('App render', {
    filter,
    search,
    order: courses.map((course) => course.id),
  })

  function updateCourse(id, changes) {
    setCourses((previous) =>
      previous.map((course) =>
        course.id === id ? { ...course, ...changes } : course,
      ),
    )
  }

  function addCourse(values) {
    setCourses((previous) => [
      { ...values, id: crypto.randomUUID(), status: 'Planned', version: 0 },
      ...previous,
    ])
    setAdding(false)
    setFilter('All courses')
    setSearch('')
    setAnnouncement(`${values.title} added.`)
  }

  function removeCourse(id) {
    setCourses((previous) => previous.filter((course) => course.id !== id))
    setAnnouncement('Course removed.')
  }

  function resetCourse(id) {
    setCourses((previous) =>
      previous.map((course) =>
        course.id === id ? { ...course, version: course.version + 1 } : course,
      ),
    )
    setAnnouncement('Study sessions and notes cleared.')
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#main">
          <span className="brand-mark" aria-hidden="true">
            sd.
          </span>
          study desk<span className="brand-dot">.</span>
        </a>
        <span className="header-label">A little progress, every day.</span>
      </header>
      <main id="main">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">YOUR LEARNING SPACE</p>
            <h1 id="page-title">
              Make room for <em>growth.</em>
            </h1>
            <p className="intro-copy">
              Your courses, your pace. Keep the next step in sight.
            </p>
          </div>
          <button
            className="primary add-button"
            aria-expanded={adding}
            aria-controls="add-course-panel"
            onClick={() => setAdding((value) => !value)}
          >
            <span aria-hidden="true">+</span> New course
          </button>
        </section>
        <div id="add-course-panel">
          {adding && (
            <CourseForm onAdd={addCourse} onCancel={() => setAdding(false)} />
          )}
        </div>
        <section className="overview" aria-label="Learning overview">
          <div>
            <span className="stat-label">On your desk</span>
            <strong>{String(courses.length).padStart(2, '0')}</strong>
            <span>courses to explore</span>
          </div>
          <div>
            <span className="stat-label">In motion</span>
            <strong>
              {String(active).padStart(2, '0')}
              <span className="stat-dot" />
            </strong>
            <span>courses in progress</span>
          </div>
          <div>
            <span className="stat-label">Made it happen</span>
            <strong>{String(completed).padStart(2, '0')}</strong>
            <span>courses completed</span>
          </div>
          <div className="overview-message">
            <span className="small-star" aria-hidden="true">
              ✳
            </span>
            <p>
              Small steps.
              <br />
              <em>Lasting knowledge.</em>
            </p>
          </div>
        </section>
        <section aria-labelledby="courses-heading">
          <div className="section-heading">
            <h2 id="courses-heading">
              My courses <span>{courses.length}</span>
            </h2>
            <label className="search">
              <span className="sr-only">Search courses</span>
              <input
                type="search"
                placeholder="Search courses…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <span aria-hidden="true">⌕</span>
            </label>
          </div>
          <div className="toolbar">
            <div className="filters" role="group" aria-label="Filter by status">
              {filters.map((value) => (
                <button
                  key={value}
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="sort-actions">
              <button
                onClick={() =>
                  setCourses((previous) =>
                    [...previous].sort((a, b) =>
                      a.title.localeCompare(b.title),
                    ),
                  )
                }
              >
                Sort A–Z
              </button>
              <button
                onClick={() =>
                  setCourses((previous) => [...previous].reverse())
                }
              >
                <span aria-hidden="true">↕ </span>Reverse
              </button>
            </div>
          </div>
          <p className="result-count" aria-live="polite">
            Showing {visibleCount} of {courses.length} courses
          </p>
          <ul className="course-grid">
            {courses.map((course) => (
              <li key={course.id} hidden={!matches(course)}>
                <CourseCard
                  key={`${course.id}:${course.version}`}
                  course={course}
                  onUpdate={updateCourse}
                  onRemove={removeCourse}
                  onReset={resetCourse}
                />
              </li>
            ))}
          </ul>
          {visibleCount === 0 && (
            <div className="empty-state">
              <h3>
                {courses.length
                  ? 'No courses match this view.'
                  : 'Your next chapter starts here.'}
              </h3>
              <p>
                {courses.length
                  ? 'Try another search or show all your courses.'
                  : 'Add a course and make your first small step.'}
              </p>
              <button
                className="primary"
                onClick={() => {
                  setSearch('')
                  setFilter('All courses')
                  if (!courses.length) setAdding(true)
                }}
              >
                {courses.length ? 'Clear filters' : 'Add your first course'}
              </button>
            </div>
          )}
        </section>
        <p className="sr-only" role="status">
          {announcement}
        </p>
        <footer className="site-footer">
          <span>study desk.</span>
          <span>Stay curious. Keep going.</span>
        </footer>
      </main>
    </>
  )
}
