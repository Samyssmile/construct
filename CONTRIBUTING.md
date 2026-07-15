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
components/    Authored component style contracts (ct- prefix, BEM modifiers)
behaviors/     Optional typed, dependency-free DOM controllers
schemas/       Published token and custom-theme JSON Schemas
standalone/    Generated selective component package entries
foundations.css  Reset, typography & layout utilities
stories/       Storybook stories (also drive the tests)
tests/         Real browser media-feature contracts
docs/          Guidelines & best practices
scripts/       Build and validation tools
```

## The Token Pipeline

Tokens are the single source of truth. **Never hand-edit generated files**
(`tokens/tokens.css`, `tokens/tokens.json`, `tokens/tokens.ts`, `tokens/tokens.js`).

1. Edit the owning source layer: `tokens/primitives.json`, `tokens/semantic.*.json`, or `tokens/components.json`
2. Run `npm run build` to regenerate outputs
3. Run `npm run tokens:validate` for schema, references, complete theme shape, and contrast
4. `npm run check` verifies every generated and package contract (also runs in CI)

Keep the dependency direction primitive → semantic → component. Product themes use the published
theme schema and `construct-theme` compiler; they must not copy or patch generated token CSS.

## Component Conventions

- **Naming:** `ct-` prefix with BEM modifiers — `ct-button`, `ct-button__icon`, `ct-button--secondary`
- **Sizes:** `--sm`, default (md), `--lg`
- **State:** data attributes (`data-state="open"`) and ARIA (`aria-invalid`, `aria-selected`, `aria-disabled`)
- Keep each authored style contract cohesive in `components/` and import it through `components/index.css`; closely related public patterns may share a source file
- Selective public entries in `standalone/` are generated; never edit them directly
- 2-space indentation; CSS custom properties in kebab-case (`--color-brand-primary`)

## Accessibility Is Required

Every component **must**:

- Use semantic HTML and correct ARIA attributes where applicable
- Make every interactive function keyboard operable with visible focus
- Meet applicable WCAG 2.2 AA criteria in light, dark, high-contrast, and forced-colors modes
- Follow Construct's 44×44 coarse-pointer target policy where applicable

The Storybook a11y addon **fails the build on violations** — please add/update a story so your
component is covered. See [docs/guidelines.md](docs/guidelines.md).

## Testing

Tests combine Storybook, isolated behavior, touch, and forced-colors browser contracts:

```bash
npm run audit
npm run check
npm test
npm run storybook:build
```

Add or update a `*.stories.js` file for visual/component behavior. Headless controller changes also
need an isolated test under `behaviors/__tests__/`. See [Governance and Definition of Done](docs/governance.md)
for the complete review and release contract.

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add tree component
fix: correct button focus ring offset in high-contrast
perf: reduce generated theme CSS
chore: clarify token build steps
```

Allowed prefixes: `feat:`, `fix:`, `perf:`, `chore:`, and `chore(deps):`.

## Pull Requests

1. Fork & branch from `main`
2. Make your change (generated outputs rebuilt, stories/tests added, accessibility passing)
3. Run `npm run check`, `npm test`, and `npm run storybook:build`
4. Open a PR using the template and describe the change & motivation

Thank you for contributing! 🧡
