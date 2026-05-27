# Deverse

[React](https://react.dev/) · [Vite](https://vite.dev/) · [MUI](https://mui.com/) · [![GitHub license](https://img.shields.io/github/license/LvsalnNarayana/devverse)](https://github.com/LvsalnNarayana/devverse/blob/main/LICENSE) [![CI](https://github.com/LvsalnNarayana/devverse/actions/workflows/ci.yml/badge.svg)](https://github.com/LvsalnNarayana/devverse/actions/workflows/ci.yml) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/LvsalnNarayana/devverse/pulls)

**Deverse** is an open-source learning platform for computer science and backend engineering. Explore interactive data structures and algorithms, production-style case studies, reference docs, full-stack project breakdowns, reusable microservice modules, and curated developer tools — all in one static React application.

* **Interactive learning:** Step through DSA topics with animated visualizations, algorithm steps, complexity tables, and multi-language code snippets side by side.
* **Declarative content:** Case studies, references, projects, and modules render from JSON block schemas — add pages without new React layouts.
* **Registry-driven:** Catalog metadata in `src/data`, path resolution in registries, page bodies in `public/configs` — a clear split between listing cards and detail content.
* **Learn once, extend anywhere:** Shared listing layout, filters, and detail shells mean new modules follow the same patterns as case studies and references.

[Get started with Deverse in your browser](#installation) · [Read the architecture docs](architecture/architecture.md)

---

## Installation

Deverse is a **Vite + React** SPA. You can run it locally for development or deploy the production build to any static host (Vercel is preconfigured).

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer  
- npm 10 or newer  

### Quick start

```bash
git clone https://github.com/LvsalnNarayana/devverse.git
cd devverse
npm install
npm run dev
```

Open **http://localhost:5173** (default Vite port).

### Production build

```bash
npm run build    # output → dist/
npm run preview  # serve dist/ locally
```

### Deploy

Import the repository on [Vercel](https://vercel.com/) (or similar):

| Setting | Value |
|---------|--------|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |

Client-side routes are handled via [`vercel.json`](vercel.json). Static JSON under `/configs` is served from `public/configs/`.

---

## Documentation

| Resource | Description |
|----------|-------------|
| [Architecture reference](architecture/architecture.md) | Registries, public JSON, hooks, layouts, DSA visualizations, routing |
| [System design notes](architecture/Devverse_System_Design.md) | Broader platform design context |
| [Migration strategy](architecture/Devverse_migration_strategy.md) | Content and structure migration notes |
| [Diagram sources](architecture/diagrams/) | Mermaid `.mmd` files; run `npm run docs:diagrams` to regenerate SVGs |

### Platform modules

| Module | Routes | Detail pages |
|--------|--------|----------------|
| DSA Visualizer | `/dsa` | `/dsa/:id` — interactive viz + topic JSON |
| Case Studies | `/case-studies` | `/case-studies/:id` |
| Reference Library | `/references` | `/references/:id` |
| Projects | `/projects` | `/projects/:id` — architecture + GitHub |
| Prebuilt Modules | `/modules` | `/modules/:id` — microservice building blocks |
| Developer Tools | `/tools` | External links only (new tab) |
| Components Showcase | `/components` | Internal UI gallery |

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| **UI** | React 19, MUI 9, Emotion, MUI Icons |
| **Routing** | React Router 7 |
| **Build** | Vite 8, `@vitejs/plugin-react` |
| **Content** | Public JSON (`fetch`), Vite glob (page structure outlines) |
| **Diagrams & code** | Mermaid, Prism.js |
| **Carousel** | Embla Carousel |
| **Quality** | ESLint 9 (flat config), Prettier |
| **Backend** | None — static SPA only |

---

## Project structure

```
deverse/
├── public/configs/       # Page JSON, DSA topics, listing layout config
├── pageStructures/       # Markdown outlines (authoring)
├── architecture/         # Docs + Mermaid diagrams
├── .github/workflows/    # CI (lint + build)
└── src/
    ├── data/             # Catalogs + registries/
    ├── hooks/            # useFilters, usePageContent, useDsaTopicPage, …
    ├── layouts/          # ModuleListingLayout, DSATopicLayout, …
    ├── pages/            # Route wrappers
    └── components/       # shared/, visualizations/, renderer/
```

---

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server with HMR |
| `npm run build` | Production bundle → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier (write) |
| `npm run format:check` | Prettier (check) |
| `npm run docs:diagrams` | Regenerate architecture SVGs from `.mmd` |

---

## Adding content

1. **Declarative module** (case study, reference, project, prebuilt module) — Add a catalog row in `src/data/*.js` (`active: true`, `content`, `pageStructure`), add JSON under `public/configs/`, optional outline in `pageStructures/`.
2. **DSA topic with visualization** — Register in `public/configs/dsa/topic-pages.json`, add page JSON, wire `visualizationRegistry.js`.
3. **Developer tool** — Add a row in `developerTools.js` with an external `href` (no detail route).

See [architecture/architecture.md § Adding new content](architecture/architecture.md#13-adding-new-content).

---

## Contributing

Contributions are welcome. Please open an issue or pull request on [GitHub](https://github.com/LvsalnNarayana/devverse). For larger changes, read [architecture/architecture.md](architecture/architecture.md) first so new content follows existing registry and JSON patterns.

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/my-change`)  
3. Commit your changes (`git commit -m 'feat: describe change'`)  
4. Push to the branch (`git push origin feature/my-change`)  
5. Open a Pull Request  

CI must pass the production `build` workflow on pull requests.

---

## License

Deverse is [MIT licensed](LICENSE).
