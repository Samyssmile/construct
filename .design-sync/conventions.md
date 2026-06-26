# Building with Construct

Construct is a **framework-agnostic CSS design system**. There is **no JS component library** — components are BEM-style CSS classes applied to your own semantic HTML (or JSX). You build markup and add classes; `styles.css` supplies the look. This works in any framework and in plain HTML.

## Setup & theming (read this first)

1. Load the stylesheet once: `<link rel="stylesheet" href="styles.css">` (its `@import` closure pulls in tokens, the brand fonts, and every component style).
2. **Theme** is controlled by a `data-theme` attribute on a root element:
   - `light` is the default — it is the bare `:root`, so **no wrapper is needed for light**.
   - For dark / high-contrast, set it explicitly: `<html data-theme="dark">` or `data-theme="high-contrast"`. With no attribute the system follows `prefers-color-scheme` / `prefers-contrast`.
   - There is **no `[data-theme="light"]` rule** — pin light (e.g. inside a dark host) with `data-theme="light"` on the root so the dark fallback can't apply.

No provider, no JS, no build step. Brand fonts (Sora / Source Sans 3 / JetBrains Mono) load via a remote `@import` inside `styles.css`.

## The styling idiom — BEM classes + design tokens

**Class naming:** `ct-` prefix · `ct-block__element` · `ct-block--modifier`. Sizes are `--sm` / `--lg` (medium is the default, unstyled). State is expressed with **ARIA / data attributes**, not classes — `aria-invalid`, `aria-selected`, `aria-disabled`, `data-state="open"`, `disabled`.

```
ct-button  ct-button--secondary ct-button--outline ct-button--ghost
           ct-button--accent ct-button--danger ct-button--link
           ct-button--sm ct-button--lg ct-button--icon · ct-button__icon
```

**Component class families** (one per component; each has its own `components/<Group>/<Name>/<Name>.prompt.md` with real markup): `ct-button` · `ct-card` · `ct-field` (`ct-field__label` `ct-field__hint` `ct-field__error`) `ct-input` `ct-textarea` `ct-select` `ct-select-menu` `ct-check` `ct-radio` `ct-switch` `ct-slider` `ct-toggle-group` `ct-combobox` `ct-file-upload` · `ct-table` `ct-data-table` `ct-list` `ct-tree` `ct-avatar` `ct-badge` `ct-chip` `ct-accordion` `ct-card` `ct-chart` · `ct-modal` `ct-drawer` `ct-toast` `ct-tooltip` `ct-popover` `ct-dropdown` `ct-confirmation` · `ct-alert` `ct-banner` `ct-progress-bar` `ct-spinner` `ct-skeleton` `ct-empty-state` · `ct-navbar` `ct-sidebar` `ct-breadcrumbs` `ct-pagination` `ct-tabs` `ct-toolbar` `ct-app-shell` · `ct-icon` `ct-divider` `ct-skip-link` `ct-visually-hidden`.

**Layout utilities** (for your own composition glue — prefer these over ad-hoc CSS): `ct-stack` (vertical rhythm, set `--ct-stack-space`) · `ct-cluster` (horizontal wrap group, set `--ct-cluster-gap`) · `ct-sidebar-layout` · `ct-container` · `ct-visually-hidden` / `ct-sr-only`.

**Design tokens** — style your own layout glue with `var(--token)`, never hard-coded values, so it stays themed:
- Color: `--color-bg-canvas|surface|muted|elevated` · `--color-text-primary|secondary|muted|inverse` · `--color-brand-primary|accent` · `--color-border-subtle|default|strong` · `--color-state-{success|warning|danger|info}` (each also `-surface|-text|-border`) · `--color-focus-ring`.
- Space: `--space-0` … `--space-13`. Radius: `--radius-sm|md|lg|xl|2xl` + semantic `--radius-card|control|modal|pill`. Shadow: `--shadow-xs|sm|md|lg|xl` + `--shadow-card|dropdown|modal`.
- Type: `--font-family-text` (body) · `--font-family-heading` / `--font-family-brand` (Sora) · `--font-family-mono` · `--font-size-xs…6xl` · `--type-display|h1…|body|label|caption` presets.

## Where the truth lives

- `styles.css` (and the `_ds_bundle.css` it imports) — the authoritative compiled styles. Read it for exact selectors before inventing a class.
- `components/<Group>/<Name>/<Name>.prompt.md` — per-component class list + **real, copyable markup** scraped from the component's own examples. This is the most reliable source for how to compose a given component.
- `tokens/tokens.css` — every design token.

Do not invent class names — if a class isn't in `styles.css`, it won't style. For one-off layout, compose with the layout utilities + tokens above.

## One idiomatic example

```html
<div data-theme="light">
  <article class="ct-card">
    <div class="ct-stack" style="--ct-stack-space: var(--space-4)">
      <h3 style="font-family: var(--font-family-heading); color: var(--color-text-primary)">Invite teammates</h3>
      <p style="color: var(--color-text-secondary)">They'll get access to this workspace.</p>
      <div class="ct-field">
        <label class="ct-field__label" for="email">Email</label>
        <input id="email" class="ct-input" type="email" placeholder="name@company.com">
      </div>
      <div class="ct-cluster" style="--ct-cluster-gap: var(--space-3)">
        <button class="ct-button">Send invite</button>
        <button class="ct-button ct-button--ghost">Cancel</button>
      </div>
    </div>
  </article>
</div>
```
