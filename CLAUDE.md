# CLAUDE.md

This file provides repository guidance for work on Construct.

## Project overview

`@neuravision/construct` is a framework-agnostic design system. It publishes validated design tokens, portable component CSS, and optional typed headless behavior controllers.

## Commands

```bash
npm run build              # Generate token outputs and standalone CSS entries
npm run check              # Verify all non-mutating package contracts
npm test                   # Behavior, Storybook, touch, forced-colors browser suites
npm run tokens:validate    # Schemas, references, theme shape, contrast
npm run storybook          # Dev server at http://localhost:6006
npm run storybook:build    # Static Storybook build
```

## Architecture

### Tokens

The dependency direction is primitive → semantic → component:

```text
tokens/primitives.json
  + tokens/semantic.{light,dark,high-contrast}.json
  + tokens/components.json
    → tokens/tokens.css
    → tokens/tokens.json
    → tokens/tokens.js
    → tokens/tokens.ts
```

Never hand-edit generated `tokens/tokens.*` outputs. Source and custom-theme shapes are governed by `schemas/`. Explicit theme scopes contain the complete semantic/component contract so arbitrary nested themes remain deterministic. Product themes compile through `construct-theme`.

### CSS components

Authored component files live in `components/` and are imported by `components/index.css`; `components/components.css` is the compatibility bundle entry. Selective package imports resolve to generated `standalone/` wrappers that add tokens and shared contracts. Never edit `standalone/` directly.

- Use the `ct-` prefix and BEM-style elements/modifiers.
- Use `--sm`, default, and `--lg` sizes where they apply.
- Drive visible state from native, ARIA, or documented `data-*` attributes.
- Component CSS owns appearance, not keyboard or focus state machines.

### Headless behaviors

`behaviors/` provides the public `@neuravision/construct/behaviors` ESM entry for modal, drawer, tabs, toggle group, dropdown, select menu, combobox, tooltip, and popover controllers. Controllers own keyboard, focus, dismissal, and ARIA synchronization; the application owns rendering and product data. Every initialization needs matching `destroy()` cleanup and isolated browser tests.

### Fonts

`foundations.css` is network-free. `fonts.css` is an explicit hosted-font opt-in. Products with privacy, CSP, offline, or performance constraints should use the fallback stacks or self-host as documented in `docs/fonts.md`.

## Testing

- Stories in `stories/*.stories.js` run through Storybook, Vitest, Playwright, and the a11y addon in error mode.
- Behavior tests live in `behaviors/__tests__/`.
- Real media-feature tests live in `tests/` with dedicated touch and forced-colors browser contexts.
- `npm run check` also validates generated output, schemas/contrast, CSS-variable closure, exports, and release version consistency.

## Code style

- 2-space indentation for JavaScript and CSS; JavaScript uses single quotes.
- CSS custom properties use kebab-case.
- Commit prefixes are `feat:`, `fix:`, `perf:`, `chore:`, or `chore(deps):`.

## Accessibility

Use semantic HTML, meet applicable WCAG 2.2 AA requirements, preserve visible focus and forced-colors state, respect reduced motion, and follow Construct's 44×44 coarse-pointer policy where applicable. Composite widgets use the tested behavior layer or an equivalent adapter. See `docs/guidelines.md`, `docs/behaviors.md`, and `docs/governance.md`.
