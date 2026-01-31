# Accessful Components v1

Framework-agnostic component styles built on Accessful tokens. Use this for Angular,
React, or Svelte wrappers. Interactive parts are controlled via data attributes so
JS can be added per framework without changing CSS.

## Usage
Import order (recommended):
1) tokens (already imported by foundations)
2) foundations
3) components

Example:
```css
@import '../design/foundations.css';
@import '../design/components/components.css';
```

## State conventions
- `data-state="open"` / `data-state="closed"` for popovers, modals, tooltips
- `aria-invalid="true"` for form errors
- `aria-current="page"` for pagination
- `aria-selected="true"` for tabs and datepicker days
- `aria-disabled="true"` when disabled but not using native `disabled`

## Components

### Button
```html
<button class="af-button">Primary</button>
<button class="af-button af-button--secondary">Secondary</button>
<button class="af-button af-button--ghost">Ghost</button>
<button class="af-button af-button--outline">Outline</button>
<button class="af-button af-button--danger">Danger</button>
<button class="af-button af-button--accent">Accent</button>
<button class="af-button af-button--sm">Small</button>
<button class="af-button af-button--lg">Large</button>
```

### Field + Input
```html
<div class="af-field">
  <label class="af-field__label" for="email">Email</label>
  <input class="af-input" id="email" type="email" placeholder="name@company.com" />
  <div class="af-field__hint">We will not share this.</div>
</div>

<div class="af-field af-field--error">
  <label class="af-field__label" for="name">Name</label>
  <input class="af-input" id="name" aria-invalid="true" />
  <div class="af-field__error">Name is required.</div>
</div>

<div class="af-field">
  <label class="af-field__label" for="search">Search</label>
  <div class="af-input-wrap">
    <span class="af-input__icon" aria-hidden="true">?</span>
    <input class="af-input af-input--with-icon" id="search" type="search" />
  </div>
</div>
```

### Select
```html
<div class="af-field">
  <label class="af-field__label" for="role">Role</label>
  <select class="af-select" id="role">
    <option>Designer</option>
    <option>Engineer</option>
  </select>
</div>
```

### Textarea
```html
<div class="af-field">
  <label class="af-field__label" for="notes">Notes</label>
  <textarea class="af-textarea" id="notes"></textarea>
</div>
```

### Checkbox / Radio
```html
<label class="af-check">
  <input class="af-check__input" type="checkbox" />
  <span class="af-check__label">Remember me</span>
</label>

<label class="af-radio">
  <input class="af-radio__input" type="radio" name="plan" />
  <span class="af-radio__label">Standard</span>
</label>
```

### Switch
```html
<label class="af-switch">
  <input class="af-switch__input" type="checkbox" role="switch" />
  <span class="af-switch__label">Auto renew</span>
</label>
```

### Card
```html
<section class="af-card af-card--interactive">
  <div class="af-card__header">
    <h3>Team</h3>
    <button class="af-button af-button--ghost">Edit</button>
  </div>
  <div class="af-card__body">
    <p>Team details here.</p>
  </div>
  <div class="af-card__footer">
    <span>Updated 2 days ago</span>
    <button class="af-button af-button--secondary">Open</button>
  </div>
</section>
```

### Table
```html
<div class="af-table-wrap">
  <table class="af-table af-table--striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Alpha</td>
        <td>Active</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Modal
```html
<div class="af-modal" data-state="open" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="af-modal__dialog">
    <div class="af-modal__header">
      <h2 id="modal-title">Invite team</h2>
      <button class="af-button af-button--ghost" aria-label="Close">Close</button>
    </div>
    <div class="af-modal__body">
      <p>Modal content...</p>
    </div>
    <div class="af-modal__footer">
      <button class="af-button af-button--secondary">Cancel</button>
      <button class="af-button">Send</button>
    </div>
  </div>
</div>
```

### Toast
```html
<div class="af-toast-region" aria-live="polite">
  <div class="af-toast" data-variant="success" data-state="open">
    <div class="af-toast__title">Saved</div>
    <div class="af-toast__description">Your changes were saved.</div>
    <button class="af-button af-button--ghost">Undo</button>
  </div>
</div>
```

### Tooltip
```html
<span class="af-tooltip" data-state="open" data-side="top">
  <button class="af-button af-button--ghost" aria-describedby="tip-1">Help</button>
  <span class="af-tooltip__content" role="tooltip" id="tip-1">Short hint</span>
</span>
```

### Tabs
```html
<div class="af-tabs">
  <div class="af-tabs__list" role="tablist">
    <button class="af-tabs__trigger" role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">Overview</button>
    <button class="af-tabs__trigger" role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">Settings</button>
  </div>
  <div class="af-tabs__panel" role="tabpanel" id="panel-1" aria-labelledby="tab-1">...</div>
</div>
```

### Dropdown
```html
<div class="af-dropdown" data-state="open">
  <button class="af-button af-button--secondary af-dropdown__trigger" aria-haspopup="menu">Actions</button>
  <div class="af-dropdown__menu" role="menu">
    <button class="af-dropdown__item" role="menuitem">Edit</button>
    <button class="af-dropdown__item" role="menuitem">Duplicate</button>
    <div class="af-dropdown__separator" role="separator"></div>
    <button class="af-dropdown__item" role="menuitem">Archive</button>
  </div>
</div>
```

### Pagination
```html
<nav class="af-pagination" aria-label="Pagination">
  <ul class="af-pagination__list">
    <li><a class="af-pagination__link" href="#">1</a></li>
    <li><a class="af-pagination__link" aria-current="page" href="#">2</a></li>
    <li><a class="af-pagination__link" href="#">3</a></li>
  </ul>
</nav>
```

### Breadcrumbs
```html
<nav class="af-breadcrumbs" aria-label="Breadcrumb">
  <ol class="af-breadcrumbs__list">
    <li class="af-breadcrumbs__item">
      <a class="af-breadcrumbs__link" href="#">Home</a>
      <span class="af-breadcrumbs__separator">/</span>
    </li>
    <li class="af-breadcrumbs__item">
      <span class="af-breadcrumbs__current">Projects</span>
    </li>
  </ol>
</nav>
```

### Data table
```html
<div class="af-data-table">
  <div class="af-data-table__toolbar">
    <div class="af-data-table__filters">
      <input class="af-input af-control--sm" placeholder="Search" />
      <select class="af-select af-control--sm">
        <option>Status</option>
      </select>
    </div>
    <div class="af-data-table__actions">
      <button class="af-button af-button--secondary af-button--sm">Export</button>
      <button class="af-button af-button--sm">New</button>
    </div>
  </div>
  <div class="af-table-wrap">
    <table class="af-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alpha</td>
          <td>Active</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="af-data-table__footer">
    <span>Showing 1-10</span>
    <nav class="af-pagination" aria-label="Data table pagination">
      <ul class="af-pagination__list">
        <li><a class="af-pagination__link" aria-current="page" href="#">1</a></li>
        <li><a class="af-pagination__link" href="#">2</a></li>
      </ul>
    </nav>
  </div>
</div>
```

### Datepicker
```html
<div class="af-datepicker" data-state="open">
  <input class="af-input" type="text" placeholder="Select date" />
  <div class="af-datepicker__popover" role="dialog" aria-label="Choose date">
    <div class="af-datepicker__header">
      <button class="af-button af-button--ghost af-button--icon" aria-label="Previous month">Prev</button>
      <div class="af-datepicker__title">March 2026</div>
      <button class="af-button af-button--ghost af-button--icon" aria-label="Next month">Next</button>
    </div>
    <div class="af-datepicker__grid">
      <div class="af-datepicker__weekday">Mo</div>
      <div class="af-datepicker__weekday">Tu</div>
      <div class="af-datepicker__weekday">We</div>
      <div class="af-datepicker__weekday">Th</div>
      <div class="af-datepicker__weekday">Fr</div>
      <div class="af-datepicker__weekday">Sa</div>
      <div class="af-datepicker__weekday">Su</div>
      <button class="af-datepicker__day" data-outside="true">24</button>
      <button class="af-datepicker__day" data-today="true">25</button>
      <button class="af-datepicker__day" aria-selected="true">26</button>
    </div>
  </div>
</div>
```
