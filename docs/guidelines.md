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
- Test all components with keyboard navigation (Tab, Shift+Tab, Enter, Space)

### Don't

- Don't rely on color alone for status information without text or icons
- Don't create custom controls without ARIA roles and keyboard support
- Don't use fixed pixel layouts for content that can grow
- Don't use low-contrast text or disabled states that are unreadable
- Don't add unnecessary animations for critical actions

## Accessibility Rules (Minimum)

- **Visible Focus**: All interactive elements must have visible focus indication
- **Labels**: Every form input must have a label (explicit `<label>` or `aria-label`)
- **Keyboard Navigation**: Full support for dropdowns, tabs, modals, tooltips, datepickers
- **ARIA**: Use ARIA attributes only where semantic HTML isn't sufficient
- **Links**: Links must be distinguishable without color alone (e.g., underline)
- **Contrast**: Text, icons, and focus rings must meet WCAG AA standards
- **Themes**: Support light, dark, and high-contrast modes; respect user preferences
- **Disabled States**: Must be recognizable, but content should remain readable
- **Motion**: Respect `prefers-reduced-motion` for animations
- **Live Regions**: Use `aria-live` for toasts and status messages
- **Modal**: Requires `aria-modal`, `role="dialog"`, and focus trap

## Keyboard Patterns for Composite Components

### Tabs
- **Arrow keys**: Move focus between tabs
- **Home/End**: Jump to first/last tab
- **Enter/Space**: Activate tab
- **Implementation**: Use roving tabindex (active tab `tabindex="0"`, others `tabindex="-1"`)

### Dropdown (Action-List)
- **Trigger**: Uses `aria-expanded` and `aria-controls`
- **Open**: Focus moves to first item
- **Esc**: Closes and returns focus to trigger
- **Items**: Normal buttons/links in tab order

### Dropdown (Role=menu)
- **Only use if implementing**: Arrow-key navigation, Home/End, typeahead, and roving tabindex
- Most dropdowns should use Action-List pattern instead

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
- **Open**: On hover and focus
- **Close**: On blur and Esc
- **Role**: `role="tooltip"` with `aria-describedby`

### Tree (`ct-tree`)

Hierarchical disclosure following the [WAI-ARIA Tree View pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/). Use it for n-level nested data such as file explorers, organisation hierarchies, or category trees.

**Roles**
- Container: `<ul role="tree">` with an `aria-label` or `aria-labelledby` reference
- Node: `<li role="treeitem">` with `aria-level` (1-based), `aria-setsize`, `aria-posinset`
- Children container: `<ul role="group">`
- Expandable nodes carry `aria-expanded="true|false"`. Leaf nodes omit the attribute.

**Indent**
Set `--ct-level` inline on each `.ct-tree__row` (matches the node's `aria-level`). The bundled JS controller used in Storybook fills it in automatically; framework wrappers should generate it during render.

**Keyboard**
- `↑` / `↓`: focus previous / next visible row
- `→`: if collapsed, expand. If expanded, focus first child. Leaf: nothing.
- `←`: if expanded, collapse. Otherwise, focus parent row.
- `Home` / `End`: focus first / last visible row
- `Enter`: activate (consumer-defined; emit `ct-tree:activate`)
- `Space`: toggle selection (multi/single) or activate (no selection)
- `*`: expand all siblings on the same level
- Type-ahead (`A`–`Z`): focus next row whose label starts with the typed prefix; buffer resets after 500 ms

**Roving tabindex**
Exactly one `<li role="treeitem">` carries `tabindex="0"`. All others carry `tabindex="-1"`. Arrow keys move focus — and the `tabindex` — along with them. The `tabindex` lives on the element with the `treeitem` role, never on the inner `.ct-tree__row` `<div>`: a focused `<div>` without a role would orphan the screen-reader announcement of level, posinset, expanded and selected state.

**Toggle / chevron**
The `.ct-tree__toggle` is a non-focusable `<span aria-hidden="true">`. Expand/collapse is reachable via keyboard through `←`/`→` on the row and via mouse through clicking the chevron. We deliberately avoid making the toggle a `<button>`: a focusable button inside a focusable row violates `aria-hidden-focus` / `nested-interactive`, and the row already provides the keyboard affordance.

**Row actions**
Buttons in the `.ct-tree__actions` slot live inside the focusable treeitem. Give them `tabindex="-1"` so the tree exposes a single Tab stop, as required by the WAI-ARIA Tree View pattern. Reach them via mouse, or expose a row-level action hotkey from the consuming framework.

**Selection**
- `aria-selected="true|false"` on the `<li role="treeitem">` (only when selection is active).
- For multi-selection, the container needs `aria-multiselectable="true"`. The Storybook controller (`attachTree`) sets and tears this down automatically when invoked with `selection: 'multi'`.
- Construct only styles selection — the consumer decides whether to clear other rows (`single`) or keep them (`multi`).

**Async children**
Set `aria-busy="true"` on the `<li role="treeitem">` while its children are loading. The chevron switches to a spinner via the existing `ct-spin` keyframe and the toggle becomes non-interactive while busy.

**Disabled nodes**
Use `aria-disabled="true"` on the `<li>`. Do **not** use the HTML `disabled` attribute — `treeitem` is not a form control. The Storybook controller skips activation, selection and toggle for disabled nodes; arrow-key navigation still passes through them so screen readers can announce them.

**Orphan state**
For sub-nodes whose parent reference is missing in the data set, render them on the root level with the `.ct-tree__node--orphan` modifier. They get a warning-tinted surface and a dashed border so the data inconsistency is visible without breaking the tree.

**Custom events**
The Storybook controller emits four bubbling `CustomEvent`s on the focused treeitem so consumers can wire up application logic without re-implementing the keyboard model:

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
- Current components use two breakpoints: `< sm` (599px) and `< md` (899px)

## Fonts

- **Default**: Fonts are loaded via Google Fonts in `foundations.css` (Manrope for display + body, JetBrains Mono for code/data)
- **Self-hosting**: For CSP or privacy requirements, replace Google Fonts import with local `@font-face` rules
- **Weights**: Ensure 400, 500, 600, 700, and 800 are available

## Governance

- **New components require**: Design tokens, state definitions, accessibility notes, Storybook story
- **Before merge**: Visual QA + keyboard testing + contrast check
- **Review process**: At least one accessibility review for new interactive components

---

**Construct** - Build accessible design constructs
