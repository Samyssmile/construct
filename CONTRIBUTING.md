# Contributing to Construct

Thanks for your interest in improving Construct! This guide explains how to get set up and what we expect from contributions.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Getting Started

```bash
git clone https://github.com/Samyssmile/construct.git
cd construct
npm install
npm run storybook   # dev server at http://localhost:6006
```

## Project Structure

```
tokens/        Source design tokens (JSON) + build pipeline
components/    One CSS file per component (ct- prefix, BEM modifiers)
foundations.css  Reset, typography & layout utilities
stories/       Storybook stories (also drive the tests)
docs/          Guidelines & best practices
scripts/       Token build script (build-tokens.mjs)
```

## The Token Pipeline

Tokens are the single source of truth. **Never hand-edit generated files**
(`tokens/tokens.css`, `tokens/tokens.json`, `tokens/tokens.ts`, `tokens/tokens.js`).

1. Edit the source JSON: `tokens/primitives.json` or `tokens/semantic.*.json`
2. Run `npm run build` to regenerate outputs
3. `npm run check` verifies outputs are in sync (also runs in CI)

## Component Conventions

- **Naming:** `ct-` prefix with BEM modifiers — `ct-button`, `ct-button__icon`, `ct-button--secondary`
- **Sizes:** `--sm`, default (md), `--lg`
- **State:** data attributes (`data-state="open"`) and ARIA (`aria-invalid`, `aria-selected`, `aria-disabled`)
- One CSS file per component in `components/`, imported via `components/index.css`
- 2-space indentation; CSS custom properties in kebab-case (`--color-brand-primary`)

## Accessibility Is Required

Every component **must**:

- Use semantic HTML and correct ARIA attributes
- Support full keyboard navigation with visible focus
- Meet WCAG 2.1 AA contrast in light, dark, and high-contrast themes

The Storybook a11y addon **fails the build on violations** — please add/update a story so your
component is covered. See [docs/guidelines.md](docs/guidelines.md).

## Testing

Tests are story-driven (Vitest + Playwright via `@storybook/addon-vitest`):

```bash
npx vitest --run
```

Add coverage by creating or updating a `*.stories.js` file.

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add tree component
fix(button): correct focus ring offset in high-contrast
docs: clarify token build steps
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.

## Pull Requests

1. Fork & branch from `main`
2. Make your change (tokens rebuilt, stories added, a11y passing)
3. Run `npm run check` and `npx vitest --run`
4. Open a PR using the template and describe the change & motivation

Thank you for contributing! 🧡
