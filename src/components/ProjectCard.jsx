export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        className={`project-preview ${project.kind.toLowerCase()}`}
        aria-label={`Open ${project.title}`}
      >
        {project.kind === 'JavaScript' ? (
          <div className="coffee-preview" aria-hidden="true">
            <div className="preview-brand">async café.</div>
            <div className="preview-title">
              Good things take
              <br />
              <em>an event loop.</em>
            </div>
            <div className="preview-console">
              <span>
                <i /> Promise.then()
              </span>
              <span>
                <i /> queueMicrotask()
              </span>
              <span>
                <i /> setTimeout()
              </span>
            </div>
            <span className="mini-cup">☕</span>
          </div>
        ) : (
          <div className="portfolio-preview" aria-hidden="true">
            <span className="preview-brand">aslan.</span>
            <span className="preview-portfolio-title">
              Hello, world.
              <br />
              <em>Hello, possibility.</em>
            </span>
            <div className="preview-monogram">
              a<span>.</span>
            </div>
            <span className="preview-bottom">A PERSONAL SPACE ON THE WEB</span>
          </div>
        )}
        <span className="project-open" aria-hidden="true">
          ↗
        </span>
      </a>
      <div className="project-meta">
        <span>{project.category}</span>
        <span>{project.kind}</span>
      </div>
      <h3>
        <a href={project.url} target="_blank" rel="noreferrer">
          {project.title}
        </a>
      </h3>
      <p>{project.description}</p>
      <a
        className="project-source"
        href={project.source}
        target="_blank"
        rel="noreferrer"
      >
        View code <span aria-hidden="true">↗</span>
      </a>
    </article>
  )
}
