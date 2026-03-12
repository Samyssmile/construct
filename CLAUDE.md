# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Construct** is a token-based, framework-agnostic design system (`@construct/design`). It provides CSS component styles, design tokens, and accessibility-first UI patterns for use with any framework or vanilla HTML.

## Commands

```bash
npm run build              # Generate token outputs (tokens.css, tokens.json, tokens.ts)
npm run check              # Verify token outputs are up-to-date (CI-friendly)
npm run storybook          # Dev server at http://localhost:6006
npm run storybook:build    # Static Storybook build to storybook-static/
npx vitest --run           # Run tests headless (Playwright/Chromium)
npx vitest                 # Run tests in watch mode
```

## Architecture

### Token Pipeline (Two-Tier)

Source tokens in `tokens/*.json` are built into outputs via `scripts/build-tokens.mjs`:

```
primitives.json + semantic.{light,dark,high-contrast}.json
  → tokens.css   (CSS custom properties)
  → tokens.json  (resolved values with units)
  → tokens.ts    (TypeScript exports)
```

**Never hand-edit generated files** (`tokens/tokens.css`, `tokens/tokens.json`, `tokens/tokens.ts`). Edit the source JSON files and run `npm run build`.

### Themes

Three modes controlled via `data-theme` attribute: `light` (default), `dark`, `high-contrast`. Falls back to `prefers-color-scheme` and `prefers-contrast` system preferences.

### Components

All component styles live in `components/components.css`. Components are pure CSS (no JS framework dependency).

- **Naming:** `ct-` prefix with BEM modifiers (e.g., `ct-button`, `ct-button__icon`, `ct-button--secondary`)
- **Sizes:** `--sm`, default (md), `--lg`
- **State:** Managed via data attributes (`data-state="open"`) and ARIA attributes (`aria-invalid`, `aria-selected`, `aria-disabled`)

### Storybook & Testing

- Stories in `stories/*.stories.js` using `@storybook/html-vite`
- Tests are story-driven via `@storybook/addon-vitest` (Vitest + Playwright)
- Add test coverage by creating/updating stories
- Accessibility addon (`@storybook/addon-a11y`) is configured to **fail on violations**

## Code Style

- 2-space indentation for JS and CSS
- Single quotes in JS
- CSS custom properties use kebab-case: `--color-brand-primary`
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`)

## Accessibility Requirements

All components must use semantic HTML, support full keyboard navigation, meet WCAG 2.1 AA contrast, include proper ARIA attributes, and have visible focus indicators. See `docs/guidelines.md` for detailed patterns (roving tabindex, focus traps, arrow key navigation, etc.).
