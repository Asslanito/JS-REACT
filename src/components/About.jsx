const skills = [
  {
    number: '01',
    name: 'HTML & CSS',
    detail:
      'Structure, layout, and the little details that make a page feel right.',
    tag: 'THE FOUNDATION',
  },
  {
    number: '02',
    name: 'JavaScript',
    detail:
      'Making things happen. From a button click to promises and the event loop.',
    tag: 'THE LOGIC',
  },
  {
    number: '03',
    name: 'React',
    detail: 'Breaking an interface into components and bringing them together.',
    tag: 'THE NEXT CHAPTER',
  },
]

export default function About() {
  return (
    <section
      id="about"
      className="about-section container"
      aria-labelledby="about-title"
    >
      <div className="section-label">
        <span>01 / A LITTLE ABOUT ME</span>
        <span className="section-line" />
      </div>
      <div className="about-intro">
        <h2 id="about-title">
          Curiosity first.
          <br />
          <em>Code follows.</em>
        </h2>
        <div>
          <p>
            I'm a student exploring how the web works. I like taking an idea,
            breaking it into smaller pieces, and figuring out how to bring it to
            life.
          </p>
          <p>
            Right now, I'm focusing on the fundamentals: writing clear
            JavaScript, understanding asynchronous code, and building my first
            React apps. This page is part of that journey.
          </p>
        </div>
      </div>
      <div className="skill-grid">
        {skills.map((skill) => (
          <article className="skill-card" key={skill.name}>
            <div className="skill-top">
              <span>{skill.number}</span>
              <span aria-hidden="true">↗</span>
            </div>
            <h3>{skill.name}</h3>
            <p>{skill.detail}</p>
            <span className="skill-tag">{skill.tag}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
