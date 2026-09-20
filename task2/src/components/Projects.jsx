import { useState } from 'react'
import ProjectCard from './ProjectCard.jsx'

const projects = [
  {
    title: 'Async Café',
    kind: 'JavaScript',
    category: 'INTERACTIVE EXPERIMENT',
    description:
      'A coffee order that makes closures, promises, and the event loop a little easier to understand.',
    url: 'https://asslanito.github.io/aslan-react-portfolio/task1/',
    source:
      'https://github.com/Asslanito/aslan-react-portfolio/tree/main/task1',
  },
  {
    title: 'My little corner of the web',
    kind: 'React',
    category: 'PERSONAL WEBSITE',
    description:
      'The page you are on. A responsive introduction built with React components and a bit of personality.',
    url: 'https://asslanito.github.io/aslan-react-portfolio/task2/',
    source:
      'https://github.com/Asslanito/aslan-react-portfolio/tree/main/task2',
  },
]

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const visibleProjects = projects.filter(
    (project) => filter === 'All' || project.kind === filter,
  )

  return (
    <section
      id="projects"
      className="projects-section container"
      aria-labelledby="projects-title"
    >
      <div className="section-label">
        <span>02 / LEARNING BY MAKING</span>
        <span className="section-line" />
      </div>
      <div className="projects-heading">
        <div>
          <h2 id="projects-title">
            Small projects.
            <br />
            <em>Big learning moments.</em>
          </h2>
          <p>A few things I've been working on.</p>
        </div>
        <div
          className="project-filters"
          role="group"
          aria-label="Filter projects"
        >
          {['All', 'JavaScript', 'React'].map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        Showing {visibleProjects.length} {filter === 'All' ? '' : filter}{' '}
        projects.
      </p>
      <div className="project-grid">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  )
}
