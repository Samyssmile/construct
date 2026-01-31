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

## Keyboard + ARIA (required in wrappers)
- Tabs: Arrow keys move focus between tabs, Home/End jumps to first/last, Enter/Space activates. Use roving tabindex (active tab `tabindex="0"`, others `tabindex="-1"`).
- Dropdown (Action-List): Trigger uses `aria-expanded` + `aria-controls`. On open, move focus to first item, Esc closes and returns focus to trigger. Items are normal buttons/links in tab order.
- Dropdown (Role=menu, optional): Only use if you implement arrow-key navigation, Home/End, typeahead, and roving tabindex.
- Datepicker: Arrow keys move by day, PageUp/PageDown switches months, Home/End jumps within week, Enter/Space selects. Esc closes and returns focus to trigger.
- Modal: Focus trap, initial focus inside dialog, Esc closes, focus returns to trigger.
- Tooltip: Opens on hover/focus, closes on blur/Esc, `role="tooltip"` with `aria-describedby`.

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
        <th scope="col">Name</th>
        <th scope="col">Status</th>
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
    <button class="af-tabs__trigger" role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1" tabindex="0">Overview</button>
    <button class="af-tabs__trigger" role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">Settings</button>
  </div>
  <div class="af-tabs__panel" role="tabpanel" id="panel-1" aria-labelledby="tab-1">...</div>
</div>
```

### Dropdown
```html
<div class="af-dropdown" data-state="open">
  <button class="af-button af-button--secondary af-dropdown__trigger" aria-expanded="true" aria-controls="actions-menu">Actions</button>
  <div class="af-dropdown__menu" id="actions-menu">
    <button class="af-dropdown__item" type="button">Edit</button>
    <button class="af-dropdown__item" type="button">Duplicate</button>
    <div class="af-dropdown__separator" role="separator"></div>
    <button class="af-dropdown__item" type="button">Archive</button>
  </div>
</div>
```

### Pagination
```html
<nav class="af-pagination" aria-label="Pagination">
  <ul class="af-pagination__list">
    <li><button class="af-pagination__link" type="button">1</button></li>
    <li><button class="af-pagination__link" aria-current="page" type="button">2</button></li>
    <li><button class="af-pagination__link" type="button">3</button></li>
  </ul>
</nav>
```

### Breadcrumbs
```html
<nav class="af-breadcrumbs" aria-label="Breadcrumb">
  <ol class="af-breadcrumbs__list">
    <li class="af-breadcrumbs__item">
      <a class="af-breadcrumbs__link" href="/">Home</a>
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
  <div class="af-data-table__header">
    <div class="af-data-table__title">
      <h3>Projects</h3>
      <span class="af-data-table__meta">24 total · Updated 2 days ago</span>
    </div>
    <div class="af-data-table__actions">
      <button class="af-button af-button--secondary af-button--sm">Export</button>
      <button class="af-button af-button--sm">New project</button>
    </div>
  </div>
  <div class="af-data-table__toolbar">
    <div class="af-data-table__filters">
      <input class="af-input af-control--sm af-data-table__search" placeholder="Search projects" aria-label="Search projects" />
      <select class="af-select af-control--sm" aria-label="Filter by status">
        <option>Status</option>
      </select>
      <select class="af-select af-control--sm" aria-label="Filter by owner">
        <option>Owner</option>
      </select>
    </div>
    <div class="af-data-table__actions">
      <button class="af-button af-button--ghost af-button--sm">Reset</button>
      <button class="af-button af-button--secondary af-button--sm">Filters</button>
    </div>
  </div>
  <div class="af-data-table__table">
    <table class="af-table af-table--striped af-table--compact">
      <thead>
        <tr>
          <th scope="col" class="af-table__cell--checkbox">
            <input class="af-check__input" type="checkbox" aria-label="Select all rows" />
          </th>
          <th scope="col">Project</th>
          <th scope="col">Status</th>
          <th scope="col" class="af-table__cell--actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="af-table__cell--checkbox">
            <input class="af-check__input" type="checkbox" aria-label="Select Alpha" checked />
          </td>
          <td>
            <span class="af-table__title">Alpha</span>
            <span class="af-table__meta">Enterprise rollout</span>
          </td>
          <td>Active</td>
          <td class="af-table__cell--actions">
            <button class="af-button af-button--ghost af-button--sm">Open</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="af-data-table__footer">
    <span>Showing 1-10 of 24</span>
    <div class="af-data-table__footer-actions">
      <div class="af-data-table__page-size">
        <span>Rows</span>
        <select class="af-select af-control--sm" aria-label="Rows per page">
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
      </div>
        <nav class="af-pagination" aria-label="Data table pagination">
          <ul class="af-pagination__list">
            <li><button class="af-pagination__link" aria-disabled="true" disabled type="button">Prev</button></li>
            <li><button class="af-pagination__link" aria-current="page" type="button">1</button></li>
            <li><button class="af-pagination__link" type="button">2</button></li>
            <li><button class="af-pagination__link" type="button">3</button></li>
            <li><button class="af-pagination__link" type="button">Next</button></li>
          </ul>
        </nav>
    </div>
  </div>
</div>
</div>
```

### Data table (simple)
```html
<div class="af-data-table af-data-table--simple">
  <div class="af-data-table__table">
    <table class="af-table af-table--striped af-table--compact">
      <thead>
        <tr>
          <th scope="col" class="af-table__cell--checkbox">
            <input class="af-check__input" type="checkbox" aria-label="Select all rows" />
          </th>
          <th scope="col" aria-sort="ascending">
            <button class="af-table__sort" type="button">
              Project
              <span class="af-table__sort-indicator" aria-hidden="true"></span>
            </button>
          </th>
          <th scope="col" aria-sort="none">
            <button class="af-table__sort" type="button">
              Status
              <span class="af-table__sort-indicator" aria-hidden="true"></span>
            </button>
          </th>
          <th scope="col" aria-sort="descending">
            <button class="af-table__sort" type="button">
              Updated
              <span class="af-table__sort-indicator" aria-hidden="true"></span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="af-table__cell--checkbox">
            <input class="af-check__input" type="checkbox" aria-label="Select Alpha" checked />
          </td>
          <td>Alpha</td>
          <td>Active</td>
          <td>Jan 24, 2026</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="af-data-table__footer">
    <span>Showing 1-10 of 24</span>
    <nav class="af-pagination" aria-label="Data table pagination">
      <ul class="af-pagination__list">
        <li><button class="af-pagination__link" aria-disabled="true" disabled type="button">Prev</button></li>
        <li><button class="af-pagination__link" aria-current="page" type="button">1</button></li>
        <li><button class="af-pagination__link" type="button">2</button></li>
        <li><button class="af-pagination__link" type="button">3</button></li>
        <li><button class="af-pagination__link" type="button">Next</button></li>
      </ul>
    </nav>
  </div>
</div>
```

### Datepicker
```html
<div class="af-field">
  <label class="af-field__label" for="datepicker-docs">Date</label>
  <div class="af-datepicker" data-state="open">
    <input class="af-input" id="datepicker-docs" type="text" placeholder="Select date" />
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
      <button class="af-datepicker__day" data-outside="true">23</button>
      <button class="af-datepicker__day" data-outside="true">24</button>
      <button class="af-datepicker__day" data-outside="true">25</button>
      <button class="af-datepicker__day" data-outside="true">26</button>
      <button class="af-datepicker__day" data-outside="true">27</button>
      <button class="af-datepicker__day" data-outside="true">28</button>
      <button class="af-datepicker__day">1</button>
      <button class="af-datepicker__day">2</button>
      <button class="af-datepicker__day">3</button>
      <button class="af-datepicker__day">4</button>
      <button class="af-datepicker__day">5</button>
      <button class="af-datepicker__day">6</button>
      <button class="af-datepicker__day">7</button>
      <button class="af-datepicker__day">8</button>
      <button class="af-datepicker__day">9</button>
      <button class="af-datepicker__day">10</button>
      <button class="af-datepicker__day">11</button>
      <button class="af-datepicker__day">12</button>
      <button class="af-datepicker__day">13</button>
      <button class="af-datepicker__day">14</button>
      <button class="af-datepicker__day">15</button>
      <button class="af-datepicker__day">16</button>
      <button class="af-datepicker__day">17</button>
      <button class="af-datepicker__day">18</button>
      <button class="af-datepicker__day">19</button>
      <button class="af-datepicker__day">20</button>
      <button class="af-datepicker__day">21</button>
      <button class="af-datepicker__day">22</button>
      <button class="af-datepicker__day">23</button>
      <button class="af-datepicker__day">24</button>
      <button class="af-datepicker__day" data-today="true">25</button>
      <button class="af-datepicker__day" aria-selected="true">26</button>
      <button class="af-datepicker__day">27</button>
      <button class="af-datepicker__day">28</button>
      <button class="af-datepicker__day">29</button>
      <button class="af-datepicker__day">30</button>
      <button class="af-datepicker__day">31</button>
      <button class="af-datepicker__day" data-outside="true">1</button>
      <button class="af-datepicker__day" data-outside="true">2</button>
      <button class="af-datepicker__day" data-outside="true">3</button>
      <button class="af-datepicker__day" data-outside="true">4</button>
      <button class="af-datepicker__day" data-outside="true">5</button>
    </div>
  </div>
</div>
</div>
```
