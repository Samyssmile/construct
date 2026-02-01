# Construct Components v1

Framework-agnostic component styles built on Construct design tokens. Use these styles directly with HTML or wrap them in Angular, React, or Svelte components. Interactive states are controlled via data attributes and ARIA, making them easy to enhance with JavaScript.

## Usage

Import order (recommended):
1. Tokens (automatically included via foundations)
2. Foundations
3. Components

Example:
```css
@import '@construct/design/foundations.css';
@import '@construct/design/components/components.css';
```

## State Conventions

- `data-state="open"` / `data-state="closed"` for popovers, modals, tooltips
- `aria-invalid="true"` for form errors
- `aria-current="page"` for current pagination page
- `aria-selected="true"` for active tabs and selected datepicker days
- `aria-disabled="true"` when disabled but not using native `disabled`

## Keyboard + ARIA Requirements

When building framework wrappers, implement these keyboard patterns:

- **Tabs**: Arrow keys move focus between tabs, Home/End jumps to first/last, Enter/Space activates. Use roving tabindex (active tab `tabindex="0"`, others `tabindex="-1"`).
- **Dropdown (Action-List)**: Trigger uses `aria-expanded` + `aria-controls`. On open, move focus to first item, Esc closes and returns focus to trigger.
- **Dropdown (Role=menu)**: Only use if implementing arrow-key navigation, Home/End, typeahead, and roving tabindex.
- **Datepicker**: Arrow keys move by day, PageUp/PageDown switches months, Home/End jumps within week, Enter/Space selects, Esc closes.
- **Modal**: Focus trap, initial focus inside dialog, Esc closes, focus returns to trigger.
- **Tooltip**: Opens on hover/focus, closes on blur/Esc, uses `role="tooltip"` with `aria-describedby`.

## Components

### Button

Basic button with variants and sizes:

```html
<button class="ct-button">Primary</button>
<button class="ct-button ct-button--secondary">Secondary</button>
<button class="ct-button ct-button--ghost">Ghost</button>
<button class="ct-button ct-button--outline">Outline</button>
<button class="ct-button ct-button--danger">Danger</button>
<button class="ct-button ct-button--accent">Accent</button>
<button class="ct-button ct-button--link">Link</button>

<!-- Sizes -->
<button class="ct-button ct-button--sm">Small</button>
<button class="ct-button">Medium</button>
<button class="ct-button ct-button--lg">Large</button>

<!-- With icon -->
<button class="ct-button">
  <span class="ct-button__icon" aria-hidden="true">+</span>
  Add item
</button>

<!-- Icon only -->
<button class="ct-button ct-button--icon" aria-label="Settings">
  <span class="ct-button__icon" aria-hidden="true">⚙</span>
</button>
```

### Field + Input

Form field with label, input, hint, and error states:

```html
<div class="ct-field">
  <label class="ct-field__label" for="email">Email</label>
  <input class="ct-input" id="email" type="email" placeholder="name@company.com" />
  <div class="ct-field__hint">We will not share this.</div>
</div>

<!-- Error state -->
<div class="ct-field ct-field--error">
  <label class="ct-field__label" for="name">Name</label>
  <input class="ct-input" id="name" aria-invalid="true" />
  <div class="ct-field__error">Name is required.</div>
</div>

<!-- With icon -->
<div class="ct-field">
  <label class="ct-field__label" for="search">Search</label>
  <div class="ct-input-wrap">
    <span class="ct-input__icon" aria-hidden="true">🔍</span>
    <input class="ct-input ct-input--with-icon" id="search" type="search" />
  </div>
</div>
```

### Select

Native select dropdown:

```html
<div class="ct-field">
  <label class="ct-field__label" for="role">Role</label>
  <select class="ct-select" id="role">
    <option>Designer</option>
    <option>Engineer</option>
    <option>Manager</option>
  </select>
</div>
```

### Textarea

Multi-line text input:

```html
<div class="ct-field">
  <label class="ct-field__label" for="notes">Notes</label>
  <textarea class="ct-textarea" id="notes" placeholder="Add context..."></textarea>
</div>
```

### Checkbox

Single checkbox or checkbox group:

```html
<label class="ct-check">
  <input class="ct-check__input" type="checkbox" />
  <span class="ct-check__label">Remember me</span>
</label>

<label class="ct-check">
  <input class="ct-check__input" type="checkbox" checked />
  <span class="ct-check__label">Send weekly reports</span>
</label>
```

### Radio

Radio button group:

```html
<label class="ct-radio">
  <input class="ct-radio__input" type="radio" name="plan" checked />
  <span class="ct-radio__label">Standard</span>
</label>

<label class="ct-radio">
  <input class="ct-radio__input" type="radio" name="plan" />
  <span class="ct-radio__label">Premium</span>
</label>
```

### Switch

Toggle switch control:

```html
<label class="ct-switch">
  <input class="ct-switch__input" type="checkbox" role="switch" checked />
  <span class="ct-switch__label">Auto renew</span>
</label>
```

### Card

Content card with header, body, and footer:

```html
<section class="ct-card">
  <div class="ct-card__header">
    <h3>Team</h3>
    <button class="ct-button ct-button--ghost">Edit</button>
  </div>
  <div class="ct-card__body">
    <p>Shared ownership and clear permissions.</p>
    <p class="ct-muted">Updated 2 days ago</p>
  </div>
  <div class="ct-card__footer">
    <span class="ct-muted">12 members</span>
    <button class="ct-button ct-button--secondary">Open</button>
  </div>
</section>
```

### Table

Basic data table with variants:

```html
<div class="ct-table-wrap">
  <table class="ct-table ct-table--striped">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Status</th>
        <th scope="col">Owner</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Alpha</td>
        <td>Active</td>
        <td>J. Chen</td>
      </tr>
      <tr>
        <td>Beta</td>
        <td>Paused</td>
        <td>L. Hart</td>
      </tr>
    </tbody>
  </table>
</div>
```

Variants:
- `ct-table--striped` - Alternating row backgrounds
- `ct-table--compact` - Reduced padding
- `ct-table--hover` - Row hover effect

### Data Table

Complex data table with header, toolbar, filters, and actions:

```html
<div class="ct-data-table">
  <div class="ct-data-table__header">
    <div class="ct-data-table__title">
      <h3>Projects</h3>
      <span class="ct-data-table__meta">24 total</span>
    </div>
    <div class="ct-data-table__actions">
      <button class="ct-button ct-button--secondary ct-button--sm">Export</button>
      <button class="ct-button ct-button--sm">New project</button>
    </div>
  </div>

  <div class="ct-data-table__toolbar">
    <div class="ct-data-table__filters">
      <input class="ct-input ct-control--sm" placeholder="Search..." aria-label="Search" />
      <select class="ct-select ct-control--sm" aria-label="Filter by status">
        <option>All Status</option>
        <option>Active</option>
        <option>Paused</option>
      </select>
    </div>
  </div>

  <div class="ct-data-table__table">
    <table class="ct-table ct-table--striped">
      <!-- table content -->
    </table>
  </div>

  <div class="ct-data-table__footer">
    <span class="ct-muted">Showing 1-10 of 24</span>
    <!-- pagination component -->
  </div>
</div>
```

### Modal

Dialog with backdrop:

```html
<div class="ct-modal" data-state="open" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="ct-modal__dialog">
    <div class="ct-modal__header">
      <h2 id="modal-title">Invite team</h2>
      <button class="ct-button ct-button--ghost" aria-label="Close">×</button>
    </div>
    <div class="ct-modal__body">
      <p>Send an invite to a new team member.</p>
      <!-- form content -->
    </div>
    <div class="ct-modal__footer">
      <button class="ct-button ct-button--secondary">Cancel</button>
      <button class="ct-button">Send</button>
    </div>
  </div>
</div>
```

### Toast

Notification with variants:

```html
<div class="ct-toast-region" aria-live="polite">
  <div class="ct-toast" data-variant="success" data-state="open">
    <div class="ct-toast__title">Saved</div>
    <div class="ct-toast__description">Your changes were saved.</div>
    <button class="ct-button ct-button--ghost">Undo</button>
  </div>
</div>
```

Variants: `success`, `error`, `info`, `warning`

### Tabs

Tab navigation with panels:

```html
<div class="ct-tabs">
  <div class="ct-tabs__list" role="tablist">
    <button class="ct-tabs__trigger" role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1" tabindex="0">Overview</button>
    <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">Settings</button>
  </div>
  <div class="ct-tabs__panel" role="tabpanel" id="panel-1" aria-labelledby="tab-1">
    <p>Panel content</p>
  </div>
</div>
```

### Dropdown

Action menu:

```html
<div class="ct-dropdown" data-state="open">
  <button class="ct-button ct-button--secondary ct-dropdown__trigger" aria-expanded="true" aria-controls="menu">Actions</button>
  <div class="ct-dropdown__menu" id="menu">
    <button class="ct-dropdown__item" type="button">Edit</button>
    <button class="ct-dropdown__item" type="button">Duplicate</button>
    <div class="ct-dropdown__separator" role="separator"></div>
    <button class="ct-dropdown__item" type="button">Delete</button>
  </div>
</div>
```

### Pagination

Page navigation:

```html
<nav class="ct-pagination" aria-label="Pagination">
  <ul class="ct-pagination__list">
    <li><button class="ct-pagination__link" type="button">1</button></li>
    <li><button class="ct-pagination__link" aria-current="page" type="button">2</button></li>
    <li><button class="ct-pagination__link" type="button">3</button></li>
  </ul>
</nav>
```

### Breadcrumbs

Path navigation:

```html
<nav class="ct-breadcrumbs" aria-label="Breadcrumb">
  <ol class="ct-breadcrumbs__list">
    <li class="ct-breadcrumbs__item">
      <a class="ct-breadcrumbs__link" href="/">Home</a>
      <span class="ct-breadcrumbs__separator">/</span>
    </li>
    <li class="ct-breadcrumbs__item">
      <a class="ct-breadcrumbs__link" href="/projects">Projects</a>
      <span class="ct-breadcrumbs__separator">/</span>
    </li>
    <li class="ct-breadcrumbs__item">
      <span class="ct-breadcrumbs__current">Alpha</span>
    </li>
  </ol>
</nav>
```

### Datepicker

Calendar popup for date selection:

```html
<div class="ct-field">
  <label class="ct-field__label" for="date">Date</label>
  <div class="ct-datepicker" data-state="open">
    <input class="ct-input" id="date" type="text" placeholder="Select date" />
    <div class="ct-datepicker__popover" role="dialog" aria-label="Choose date">
      <div class="ct-datepicker__header">
        <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Previous month">‹</button>
        <div class="ct-datepicker__title">March 2026</div>
        <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Next month">›</button>
      </div>
      <div class="ct-datepicker__grid">
        <div class="ct-datepicker__weekday">Mo</div>
        <!-- ... weekdays ... -->
        <button class="ct-datepicker__day">1</button>
        <button class="ct-datepicker__day" aria-selected="true">15</button>
        <!-- ... days ... -->
      </div>
    </div>
  </div>
</div>
```

### Tooltip

Hint on hover/focus:

```html
<span class="ct-tooltip" data-state="open" data-side="top">
  <button class="ct-button" aria-describedby="tip-1">Hover me</button>
  <span class="ct-tooltip__content" role="tooltip" id="tip-1">Short hint</span>
</span>
```

## Layout Utilities

### Stack

Vertical spacing between children:

```html
<div class="ct-stack" style="--ct-stack-space: var(--space-4);">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Cluster

Horizontal spacing with wrapping:

```html
<div class="ct-cluster" style="--ct-cluster-space: var(--space-3);">
  <button>Button 1</button>
  <button>Button 2</button>
</div>
```

## Text Utilities

- `ct-muted` - Muted text color
- `ct-truncate` - Truncate with ellipsis
- `ct-sr-only` - Screen reader only (visually hidden)

---

**Construct** - Build accessible design constructs
