# Repository Guidelines

## Project Structure & Module Organization
- `tokens/` holds design tokens (`primitives.json`, `semantic.light.json`) plus generated outputs (`tokens.css`, `tokens.json`, `tokens.ts`).
- `foundations.css` provides the global reset, typography defaults, layout utilities, and baseline a11y rules.
- `components/` contains framework-agnostic component styles (`components.css`) and usage notes.
- `stories/` and `.storybook/` drive Storybook documentation and demos.
- `docs/` contains design and accessibility guidelines.

## Build, Test, and Development Commands
- `npm run build` — generate token outputs from JSON (writes `tokens/tokens.*`).
- `npm run check` — verify generated token outputs are up to date (CI-friendly).
- `npm run storybook` — run Storybook locally at `http://localhost:6006`.
- `npm run storybook:build` — create a static Storybook build.

## Coding Style & Naming Conventions
- Indentation: 2 spaces in JSON and CSS (match existing files).
- Tokens: edit only `tokens/primitives.json` or `tokens/semantic.light.json`; never hand-edit generated outputs.
- CSS class naming uses the `af-` prefix with BEM-style patterns: `af-card__header`, `af-button--secondary`.
- State is expressed via attributes where applicable (e.g., `data-state="open"`, `aria-selected="true"`).

## Testing Guidelines
- No automated test suite yet; validation is currently visual and accessibility-focused.
- Use Storybook for manual QA and verify keyboard navigation, focus visibility, and contrast (see `docs/guidelines.md`).
- Run `npm run check` before PRs to ensure token outputs are current.

## Commit & Pull Request Guidelines
- This repository has no commit history yet, so no established commit message convention.
- Until a convention is agreed, use short, imperative messages (e.g., "Add data table styles") or adopt Conventional Commits (`feat:`, `fix:`, `chore:`) consistently.
- PRs should describe intent, list any affected components/tokens, and include Storybook screenshots for visual changes.

## Accessibility & Quality Bar
- Accessibility is the top priority for Accessful. Follow `docs/guidelines.md` for semantic HTML, ARIA usage, and keyboard support.
- New components should include tokens usage, state handling, and Storybook examples.
