# Construct Design Guidelines

## Goal

A consistent, accessible, professional design system for modern web applications built with Angular, React, Svelte, or vanilla HTML/CSS.

**Accessibility is Priority #1.**

## Do / Don't

### Do

- Use semantic HTML (`button`, `input`, `label`, `table`, `nav`)
- Use design tokens for colors, spacing, typography, and border radius
- Maintain clear state logic (hover, focus, active, disabled, error)
- Use consistent sizes (sm, md, lg) for form controls and buttons
- Establish clear hierarchies (Primary vs. Secondary actions)
- Test all interactive functionality with keyboard navigation (Tab, Shift+Tab, Enter, Space)

### Don't

- Don't rely on color alone for status information without text or icons
- Don't rely on hue alone to distinguish chart series — use direct labels, ordered legends, and the always-present data-table fallback; several series pairs are near-identical in luminance for color-blind users
- Don't create custom controls without ARIA roles and keyboard support
- Don't use fixed pixel layouts for content that can grow
- Don't use low-contrast text or disabled states that are unreadable
- Don't add unnecessary animations for critical actions

## Accessibility Rules (Minimum)

- **Visible Focus**: All interactive elements must have visible focus indication
- **Labels**: Every form input must have a label. Prefer a visible `<label>`; use `aria-label` only when a visible label is impossible, and never let it differ from visible text (2.5.3 Label in Name — note that `aria-label` overrides an associated `<label>` when both are present)
- **Headings**: Keep `h1`–`h6` in order without skipping levels, including inside cards, modals, and shells
- **Landmarks**: Wrap navigation lists in `<nav>` (also inside `<aside>` sidebars), label repeated landmarks (`aria-label`), and provide a skip link to `main` (see `skip-link.css`)
- **Truncation**: `nowrap` + ellipsis on essential text (titles, values, labels) needs a way to reach the full text — a tooltip, a wrapping variant, or full text elsewhere on the page
- **Status colors**: Semantic color (toast, banner, alert, badge) must be paired with an icon or explicit wording; the tinted border alone is decorative and intentionally not contrast-gated
- **Sticky chrome**: Products using `--sticky`/`--fixed` navbar, toolbar, or banner variants must set `--ct-scroll-offset-top`/`--ct-scroll-offset-bottom` on `:root` so focused elements are never scrolled underneath (2.4.11); the app shells set their own scroll padding automatically
- **Keyboard Navigation**: Use the tested headless controller for supported composite widgets; framework adapters must implement the documented pattern for others such as Datepicker and Tree
- **ARIA**: Use ARIA attributes only where semantic HTML isn't sufficient
- **Links**: Links must be distinguishable without color alone (e.g., underline)
- **Contrast**: Text, icons, component boundaries, and focus rings must meet applicable WCAG 2.2 AA requirements
- **Themes**: Support light, dark, and high-contrast modes; respect user preferences
- **Disabled States**: Must be recognizable, but content should remain readable
- **Motion**: Respect `prefers-reduced-motion` for animations
- **Live Regions**: Use a polite live region only when a dynamic update must be announced; do not make static status labels noisy
- **Modal**: Requires `aria-modal`, `role="dialog"`, and focus trap
- **Targets**: Covered compact controls follow Construct's 44×44 CSS-pixel coarse-pointer policy; custom controls require their own checks
- **Forced colors**: Essential focus, boundary, selected, and status meaning must remain perceivable

## Keyboard Patterns for Composite Components

Construct provides typed controllers for Modal, Drawer, Tabs, Toggle Group, Dropdown, Select Menu,
Combobox, Tooltip, and Popover through `@neuravision/construct/behaviors`. Use those controllers or a
framework adapter with equivalent tested semantics; CSS state selectors alone do not implement behavior.

### Tabs
- **Arrow keys**: Move focus between tabs
- **Home/End**: Jump to first/last tab
- **Enter/Space**: Activate tab
- **Implementation**: Use roving tabindex (active tab `tabindex="0"`, others `tabindex="-1"`)

### Generic disclosure / action list (Popover)
- **Use for**: Ordinary links, buttons, form controls, or mixed content that should retain native semantics
- **Trigger**: Uses `aria-expanded` and `aria-controls`
- **Focus**: Content remains in its natural Tab order; optional focus entry and focus return depend on the product flow
- **Behavior**: Use `createPopoverController` or an equivalent adapter for Escape, outside dismissal, and state synchronization
- **Roles**: Do not add `menu` / `menuitem` roles to generic disclosure content

### Dropdown action menu (`role="menu"`)
- **Use for**: A menu button whose popup contains application commands
- **Behavior**: Use `createDropdownController` for first/last focus, Arrow keys, Home/End, typeahead, roving tabindex, Tab dismissal, Escape, and focus return
- **Naming**: Give the menu an accessible name with `aria-label` or `aria-labelledby`

### Datepicker
- **Arrow keys**: Move by day in calendar grid
- **PageUp/PageDown**: Switch months
- **Home/End**: Jump to start/end of week
- **Enter/Space**: Select date
- **Esc**: Close and return focus to trigger

### Modal
- **Focus trap**: Focus stays within modal
- **Initial focus**: Set to first focusable element or designated element
- **Esc**: Close modal
- **Close**: Return focus to trigger element

### Drawer
- **Focus trap**: Focus stays within drawer panel
- **Initial focus**: First focusable element or designated element
- **Esc**: Close drawer
- **Close**: Return focus to trigger element
- **Backdrop**: Click closes drawer

### Tooltip
- **Open**: On hover and keyboard focus (the trigger must be focusable)
- **Close**: On blur and Esc
- **Role**: `role="tooltip"` with `aria-describedby`
- **Implementation**: The CSS `:hover`/`:focus-within` styles alone do not satisfy WCAG 1.4.13 — Esc dismissal and hover persistence require `createTooltipController` or an equivalent adapter

### Tree (`ct-tree`)

Hierarchical disclosure following the [WAI-ARIA Tree View pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/). Use it for n-level nested data such as file explorers, organisation hierarchies, or category trees.

**Roles**
- Container: `<ul role="tree">` with an `aria-label` or `aria-labelledby` reference
- Node: `<li role="treeitem">` with `aria-level` (1-based), `aria-setsize`, `aria-posinset`
- Children container: `<ul role="group">`
- Expandable nodes carry `aria-expanded="true|false"`. Leaf nodes omit the attribute.

**Indent**
Set `--ct-level` inline on each `.ct-tree__row` (matches the node's `aria-level`). The Storybook reference implementation fills it in automatically; framework wrappers should generate it during render.

**Keyboard**
- `↑` / `↓`: focus previous / next visible row
- `→`: if collapsed, expand. If expanded, focus first child. Leaf: nothing.
- `←`: if expanded, collapse. Otherwise, focus parent row.
- `Home` / `End`: focus first / last visible row
- `Enter`: activate (consumer-defined; emit `ct-tree:activate`)
- `Space`: toggle selection (multi/single) or activate (no selection)
- `*`: expand all siblings on the same level
- `F2`: move focus into the current row's action buttons; Arrow keys move between actions and `Escape` returns to the treeitem
- Type-ahead (`A`–`Z`): focus next row whose label starts with the typed prefix; buffer resets after 500 ms

**Roving tabindex**
Exactly one `<li role="treeitem">` carries `tabindex="0"`. All others carry `tabindex="-1"`. Arrow keys move focus — and the `tabindex` — along with them. The `tabindex` lives on the element with the `treeitem` role, never on the inner `.ct-tree__row` `<div>`: a focused `<div>` without a role would orphan the screen-reader announcement of level, posinset, expanded and selected state.

**Toggle / chevron**
The `.ct-tree__toggle` is a non-focusable `<span aria-hidden="true">`. Expand/collapse is reachable via keyboard through `←`/`→` on the row and via mouse through clicking the chevron. We deliberately avoid making the toggle a `<button>`: a focusable button inside a focusable row violates `aria-hidden-focus` / `nested-interactive`, and the row already provides the keyboard affordance.

**Row actions**
Buttons in the `.ct-tree__actions` slot live inside the focusable treeitem. Give them `tabindex="-1"` so the tree exposes a single Tab stop, as required by the WAI-ARIA Tree View pattern. Storybook's reference controller uses `F2` to focus the first enabled action, Arrow keys to traverse the action set, and `Escape` to restore focus to the treeitem. Consumer implementations that expose row actions must provide the same reachable keyboard path or an explicitly documented equivalent.

**Selection**
- `aria-selected="true|false"` on the `<li role="treeitem">` (only when selection is active).
- For multi-selection, the container needs `aria-multiselectable="true"`. Storybook's `attachTree` reference implementation sets and tears this down when invoked with `selection: 'multi'`; it is not exported from `@neuravision/construct/behaviors`.
- Construct only styles selection — the consumer decides whether to clear other rows (`single`) or keep them (`multi`).

**Async children**
Set `aria-busy="true"` on the `<li role="treeitem">` while its children are loading. The chevron switches to a spinner via the existing `ct-spin` keyframe and the toggle becomes non-interactive while busy.

**Disabled nodes**
Use `aria-disabled="true"` on the `<li>`. Do **not** use the HTML `disabled` attribute — `treeitem` is not a form control. Storybook's reference implementation skips activation, selection and toggle for disabled nodes; arrow-key navigation still passes through them so screen readers can announce them.

**Orphan state**
For sub-nodes whose parent reference is missing in the data set, render them on the root level with the `.ct-tree__node--orphan` modifier. They get a warning-tinted surface and a dashed border so the data inconsistency is visible without breaking the tree.

**Reference events**
Storybook's non-public `attachTree` reference implementation emits four bubbling `CustomEvent`s on the focused treeitem. Consumer wrappers may adopt the same event shape, but these events and `attachTree` are examples rather than a published behavior API:

| Event | Detail | Fires on |
|---|---|---|
| `ct-tree:expand` | `{ node }` | Node opened (click on toggle, `→`, `*`) |
| `ct-tree:collapse` | `{ node }` | Node closed (click on toggle, `←`) |
| `ct-tree:select` | `{ node, mode: 'click'\|'enter'\|'space' }` | Selection changed (only when `selection !== 'none'`) |
| `ct-tree:activate` | `{ node }` | Row primary-action (click, `Enter`, or `Space` when no selection) |

**What's not in Phase 1**
Drag & drop reparenting, virtual scrolling, and tristate parent-derived checkboxes are out of scope and tracked separately.

## Component States

Use these attributes for state management:

- **error**: `aria-invalid="true"` + visible error text
- **disabled**: `disabled` or `aria-disabled="true"`
- **selected**: `aria-selected="true"`
- **current**: `aria-current="page"`
- **expanded**: `aria-expanded="true|false"`
- **loading**: `aria-busy="true"`; loading buttons also use `data-loading="true"` and native `disabled`

Never use `aria-disabled="true"` alone to block a native button: it announces state but does not suppress
activation. Use the native `disabled` attribute whenever the HTML element supports it.

## The Datum

Construct's signature is one orange reference line — "the datum" — that marks what is focused, active,
current, or the reference value. The grammar lives in `components/datum.css` (eyebrow, scale,
metrics), in the owned `ct-frame--datum` surface, in active leading edges (list, sidebar, card, table
rows), in the tab indicator and sorted column, and in the chart reference line. Its dimensions are
component tokens (`--component-datum-*`).

Rules that keep the signature strong and accessible:

- **One datum per surface.** Orange marks exactly one thing per view region — the current, active, or
  reference element. Never let two orange edges compete; if everything is highlighted, nothing is.
- **The component that owns the border owns the datum.** Use `ct-frame ct-frame--datum` for framed
  exhibits and put clipping on `ct-frame__content`. Do not attach overflow clipping to the outer frame
  or rebuild the corner in product CSS. The registration mark absorbs the owner's hairline — it is
  painted one border width further out — so the corner reads as one orange arc on strong borders as
  well as subtle ones.
- **Orange is never text.** Labels and values stay on `--color-text-*` neutrals; orange is carried by
  non-text ticks, edges, rules, and lines.
- **Edges are `--color-brand-accent`; meaning-bearing fills are `--color-brand-accent-strong`**
  (validated ≥3:1 against muted/canvas/surface tracks per theme). A decorative rule may use plain
  accent; anything that encodes a value (progress, chart reference) uses strong.
- **The datum enters, it never pops.** State changes draw the edge in from its origin
  (`--duration-fast` / `--easing-standard`); `prefers-reduced-motion` disables this globally.
- **Forced colors re-encode edges as borders.** Inset box-shadow edges are dropped by forced colors —
  every new edge needs a `SelectedItem` border fallback.

## Breakpoints & Media Queries

Construct defines breakpoint tokens in `tokens/primitives.json`:

| Token | Value | Typical use |
|-------|-------|-------------|
| `xs`  | 360px | Small phones |
| `sm`  | 600px | Large phones / small tablets |
| `md`  | 900px | Tablets / small laptops |
| `lg`  | 1200px | Desktops |
| `xl`  | 1536px | Large screens |

### Convention

CSS custom properties cannot be used inside `@media` queries. Use the raw pixel values with a reference comment:

```css
@media (max-width: 599px) { /* < sm breakpoint (600px) */
  /* Mobile styles */
}

@media (max-width: 899px) { /* < md breakpoint (900px) */
  /* Tablet styles */
}
```

**Rules:**
- Always use `max-width: <token - 1>px` to target viewports *below* a breakpoint
- Always add a reference comment noting the breakpoint name and token value
- Only use values derived from the token system — never arbitrary pixel values
- Current components use the `sm`, `md`, and `lg` contracts (599px, 899px, and 1199px maximums). App Shell V1 and V2 use `< md` for compact overlay navigation and `< lg` for rail/panel behavior.

## Fonts

- **Default**: `foundations.css` makes no network request and uses resilient local/system fallback stacks.
- **Hosted opt-in**: Import `fonts.css` before foundations only when Google-hosted requests satisfy product privacy and CSP policy.
- **Self-hosting**: Host licensed files in the application; Construct intentionally does not publish third-party binaries.
- **Lato weights**: Provide 400, 700, and 900. JetBrains Mono uses 400, 500, 600, and 700.

See [Fonts](fonts.md) for complete hosted, self-hosted, and product-family examples.

## Governance

- **New components require**: owning token layer, state definitions, accessibility notes, Storybook coverage, and public import verification
- **Interactive changes require**: keyboard/focus lifecycle tests and complete controller cleanup
- **Before merge**: `npm run check`, `npm test`, Storybook build, visual/keyboard/screen-reader review
- **Review process**: At least one accessibility review for new interactive components

The normative checklist is [Governance and Definition of Done](governance.md).

---

**Construct** - Build accessible design constructs
