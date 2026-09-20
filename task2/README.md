# Aslan — Personal React SPA

A personal introduction for a student learning JavaScript and React. A warm, responsive single-page layout with an original SVG monogram, an About Me section, project filtering, and safe public contact information.

[Live application](https://asslanito.github.io/aslan-react-portfolio/task2/) · [Repository](https://github.com/Asslanito/aslan-react-portfolio)

## Run locally

```sh
npm ci
npm run dev
```

Use Node.js 24 LTS or a compatible version supported by Vite. Open the address printed in the terminal.

```sh
npm run lint
npm run format:check
npm run build
npm run preview
```

## Assignment criteria

| Requirement           | Where to find it                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| React SPA             | `src/main.jsx` mounts `App` with React; section links navigate within one page.                              |
| Name and image        | `Hero` introduces Aslan and renders the original `public/profile.svg` image with alternative text.           |
| About Me              | `About` describes the student's learning focus and skills.                                                   |
| Safe contact details  | `Contact` includes only the public GitHub profile, “Planet Earth”, and learning status.                      |
| At least 3 components | `Header`, `Hero`, `About`, `Projects`, `ProjectCard`, `Contact`, and `Footer`, composed by `App`.            |
| CSS styling           | Responsive layouts, typography, color palette, focus states, and reduced-motion support in `src/styles.css`. |
| GitHub Pages          | `../.github/workflows/deploy.yml` builds and deploys the app.                                                |

`Projects` uses `useState` to filter the displayed cards. `ProjectCard` receives its content through props. Skill and project lists use stable keys.

## Structure

```text
public/
  favicon.svg
  profile.svg
src/
  components/
    Header.jsx
    Hero.jsx
    About.jsx
    Projects.jsx
    ProjectCard.jsx
    Contact.jsx
    Footer.jsx
  App.jsx
  main.jsx
  styles.css
```

## Deployment

The Pages publishing source is GitHub Actions. The shared workflow in the repository root checks and builds both tasks, then publishes this app at `/task2/`. The original root URL remains available as well. Vite's relative base keeps assets working under the repository URL.

No private contact information, phone numbers, addresses, or API keys are included. The contact link is a public GitHub profile. The artwork is a monogram, not a photograph of a person. Typography uses DM Sans and DM Serif Display from Google Fonts with system fallbacks.

## Submission

Attach the repository URL, live GitHub Pages URL, and [the browser screenshot](docs/screenshot.png). Press Turn In before the deadline shown by the course platform: September 24, 2026 at 3:00 PM. Check the platform's timezone if it differs from your device.

See `DEFENSE-RU.md` for an explanation of the components, props, state, and deployment.

## References

- [React: Your first component](https://react.dev/learn/your-first-component)
- [React: State](https://react.dev/learn/state-a-components-memory)
- [Vite: GitHub Pages deployment](https://vite.dev/guide/static-deploy.html#github-pages)
- [GitHub: Creating a Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

The layout and SVG artwork are original. The instructor's CodePen collection was treated as an optional inspiration resource, not a template dependency.
