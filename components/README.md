# Construct Components v2

Framework-agnostic component styles built on Construct design tokens. Use these styles directly with HTML or wrap them in Angular, React, or Svelte components. Visual state follows native, ARIA, and documented data attributes; optional typed controllers provide the corresponding keyboard and focus behavior.

## Usage

Import order (recommended):
1. Tokens (automatically included via foundations)
2. Foundations
3. Components

Example:
```css
@import '@neuravision/construct/foundations.css';
@import '@neuravision/construct/components/components.css';
```

## State Conventions

- `data-state="open"` / `data-state="closed"` for popovers, modals, tooltips
- `data-state="active"`, `loading`, `error`, or `disabled` for component state
- `data-status="success"`, `info`, `warning`, `danger`, or connection-specific status text for semantic status
- `aria-busy="true"` while a region is updating; keep a visible loading message
- `data-loading="true"` as the button's visual loading hook; native buttons also require `disabled`
- `aria-invalid="true"` for form errors
- `aria-current="page"` for current pagination page
- `aria-current="true"` for the current table row; `aria-selected="true"`/`data-state="selected"` for selected rows in grid contexts
- `aria-selected="true"` for active tabs and selected datepicker days
- `aria-sort="ascending|descending"` on the actively sorted column header
- `aria-disabled="true"` when disabled but not using native `disabled`

ARIA communicates state but does not block events. Prefer native `disabled` for form controls. For links and custom controls, suppress pointer and keyboard activation in application code when `aria-disabled="true"` is set. Add live-region attributes only to content that changes dynamically; static status labels do not need `aria-live`.

## Keyboard + ARIA Requirements

Use `@neuravision/construct/behaviors` where a controller is available (including Tabs, menu Dropdown,
Modal, and Tooltip), or implement an equivalent tested framework adapter. CSS alone does not provide
these keyboard patterns:

- **Tabs**: Arrow keys move focus between tabs, Home/End jumps to first/last, Enter/Space activates. Use roving tabindex (active tab `tabindex="0"`, others `tabindex="-1"`).
- **Dropdown (Action menu)**: Trigger uses `aria-expanded`, `aria-controls`, and `aria-haspopup="menu"`. The menu uses roving focus; Arrow keys, Home/End, and typeahead navigate, Esc closes and restores trigger focus, and Tab closes without cancelling normal focus movement. Use `createDropdownController` for this complete contract.
- **Generic disclosure**: When popup content contains ordinary links or controls in natural Tab order, use the Popover pattern rather than adding menu roles.
- **Datepicker**: Arrow keys move by day, PageUp/PageDown switches months, Home/End jumps within week, Enter/Space selects, Esc closes.
- **Modal**: Focus trap, initial focus inside dialog, Esc closes, focus returns to trigger.
- **Tooltip**: Opens on hover/focus, closes on blur/Esc, uses `role="tooltip"` with `aria-describedby`.

## Components

### Button

Basic button with variants and sizes:

```html
<button class="ct-button" type="button">Primary</button>
<button class="ct-button ct-button--secondary" type="button">Secondary</button>
<button class="ct-button ct-button--ghost" type="button">Ghost</button>
<button class="ct-button ct-button--outline" type="button">Outline</button>
<button class="ct-button ct-button--danger" type="button">Danger</button>
<button class="ct-button ct-button--accent" type="button">Accent</button>
<button class="ct-button ct-button--link" type="button">Link</button>

<!-- Sizes -->
<button class="ct-button ct-button--sm" type="button">Small</button>
<button class="ct-button" type="button">Medium</button>
<button class="ct-button ct-button--lg" type="button">Large</button>

<!-- With icon -->
<button class="ct-button" type="button">
  <span class="ct-button__icon" aria-hidden="true">+</span>
  Add item
</button>

<!-- Icon only -->
<button class="ct-button ct-button--icon" type="button" aria-label="Settings">
  <span class="ct-button__icon" aria-hidden="true">⚙</span>
</button>

<!-- Loading: stable label, decorative loader, native interaction lock -->
<button class="ct-button" type="button" aria-busy="true" data-loading="true" disabled>
  <span class="ct-button__content">Save changes</span>
  <span class="ct-button__loader" aria-hidden="true"></span>
</button>
```

The `.ct-button__content` remains in layout, so switching to loading does not change the button width. Its text also remains the accessible name. `aria-busy` exposes the state, `data-loading` selects the visual treatment, and native `disabled` prevents both pointer and keyboard activation. The spinner stops animating under `prefers-reduced-motion: reduce`.

### Field + Input

Form field with label, input, hint, and error states:

```html
<div class="ct-field">
  <label class="ct-field__label" for="email">Email</label>
  <input class="ct-input" id="email" type="email" placeholder="name@company.com"
    aria-describedby="email-hint" />
  <div class="ct-field__hint" id="email-hint">We will not share this.</div>
</div>

<!-- Error state -->
<div class="ct-field ct-field--error">
  <label class="ct-field__label" for="name">Name</label>
  <input class="ct-input" id="name" type="text" aria-invalid="true"
    aria-describedby="name-error" />
  <div class="ct-field__error" id="name-error">Name is required.</div>
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

Single checkbox or a labelled checkbox group:

```html
<label class="ct-check">
  <input class="ct-check__input" type="checkbox" />
  <span class="ct-check__label">Remember me</span>
</label>

<fieldset>
  <legend class="ct-field__label">Notifications</legend>
  <label class="ct-check">
    <input class="ct-check__input" type="checkbox" checked />
    <span class="ct-check__label">Send weekly reports</span>
  </label>
  <label class="ct-check">
    <input class="ct-check__input" type="checkbox" />
    <span class="ct-check__label">Send security alerts</span>
  </label>
</fieldset>
```

### Radio

Radio button group:

```html
<fieldset>
  <legend class="ct-field__label">Plan</legend>
  <label class="ct-radio">
    <input class="ct-radio__input" type="radio" name="plan" checked />
    <span class="ct-radio__label">Standard</span>
  </label>

  <label class="ct-radio">
    <input class="ct-radio__input" type="radio" name="plan" />
    <span class="ct-radio__label">Premium</span>
  </label>
</fieldset>
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
    <button class="ct-button ct-button--ghost" type="button">Edit</button>
  </div>
  <div class="ct-card__body">
    <p>Shared ownership and clear permissions.</p>
    <p class="ct-muted">Updated 2 days ago</p>
  </div>
  <div class="ct-card__footer">
    <span class="ct-muted">12 members</span>
    <button class="ct-button ct-button--secondary" type="button">Open</button>
  </div>
</section>
```

### Frame

Owned surface for figures, code samples, media, and callouts. The outer frame owns its border,
radius, background, shadow, and optional datum mark. Put content that must be clipped inside
`ct-frame__content`; never clip the outer frame, because that would cut the mark back to the
padding edge.

```html
<div class="ct-frame ct-frame--datum">
  <figure class="ct-frame__content" aria-labelledby="sample-caption">
    <figcaption id="sample-caption">Code sample</figcaption>
    <pre><code>npm install @neuravision/construct</code></pre>
  </figure>
</div>
```

Use any semantically appropriate outer element (`aside`, `section`, or `div`). When the framed
content is a figure, use the `figure` itself as `ct-frame__content` so its `figcaption` remains a
valid direct child. Customize the owned surface with `--ct-frame-background`, `--ct-frame-border`,
`--ct-frame-border-width`, `--ct-frame-radius`, and `--ct-frame-shadow`.

### Aperture Signature Look

An additional opt-in grammar: split ovals, a proportional offset, cobalt and paper,
and oversized grotesk typography. Import `@neuravision/construct/components/aperture.css`
or use the full component bundle. Wrap the composition in `.ct-aperture`.

```html
<section class="ct-aperture">
  <h2 class="ct-aperture-heading">Room for character.</h2>
  <figure class="ct-aperture-poster">
    <div class="ct-aperture-poster__art">
      <span class="ct-aperture-mark" aria-hidden="true"></span>
    </div>
    <figcaption class="ct-aperture-poster__title">Open by design.</figcaption>
  </figure>
</section>
```

Primitives: `ct-aperture-mark`, `ct-aperture-wordmark`, `ct-aperture-label`,
`ct-aperture-display`, `ct-aperture-heading`, `ct-aperture-line`,
decorative `ct-aperture-rule`, `ct-aperture-poster`,
`ct-aperture-action` (and `--quiet`), `ct-aperture-panel`, native radio
`ct-aperture-choices` / `ct-aperture-choice`, and native `ct-aperture-disclosure`.

Action text and its displaced arrow disc remain inside one native link or button;
the visual seam is part of the same hit area. Put `ct-aperture-line` on spans inside
one heading to offset later lines, and hide decorative rules with `aria-hidden="true"`.

All colors use `--component-aperture-*` tokens. Mark size can be overridden with
`--ct-aperture-mark-size`. See [the design and integration guide](../docs/aperture.md)
and **Patterns → Aperture Grammar** in Storybook.

### Datum Primitives

The reference-line grammar from `components/datum.css` — Construct's orange signature as reusable
structural vocabulary. All dimensions are component tokens (`--component-datum-*`).

```html
<div class="ct-eyebrow-set">
  <p class="ct-eyebrow ct-eyebrow--numbered">Foundations</p>
</div>

<div class="ct-datum-scale" role="presentation"></div>

<div class="ct-datum-scale ct-datum-scale--progress" role="progressbar"
  aria-label="Upload" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"
  style="--ct-datum-scale-progress: 60%;"></div>

<div class="ct-frame ct-frame--datum">
  <figure class="ct-frame__content">…</figure>
</div>
```

- `ct-eyebrow` - Mono kicker with a leading datum tick; `--numbered` adds drawing-set sheet numbers
  (scope with `ct-eyebrow-set`)
- `ct-datum-scale` - Measured ruler line; decorative, mark it `role="presentation"`
- `ct-datum-scale--progress` - The origin segment reports progress via `--ct-datum-scale-progress`;
  pair with `role="progressbar"` and `aria-value*`
- `ct-frame--datum` - Preferred owned frame for bordered or clipped figures, code samples, and media
- `ct-datum-frame` - Low-level corner decorator for custom surfaces that do not clip the decorated element
- `ct-card--datum`, active leading edges, the tab indicator, sorted table columns, and
  `ct-chart__datum-line` speak the same grammar

Orange is never text; edges use `brand-accent`, meaning-bearing fills use `brand-accent-strong`.
One datum per surface — see `docs/guidelines.md`.

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

Rows receive a visual hover affordance automatically on hover-capable pointers; no hover modifier exists.

States (the datum grammar):
- `tr[aria-current="true"]`, `tr[aria-selected="true"]`, or `tr[data-state="selected"]` marks the
  current/selected row with a muted background and the orange leading edge. Use `aria-current` on
  native tables; `aria-selected` is only valid on rows inside `role="grid"`/`role="treegrid"`.
- `th[aria-sort="ascending|descending"]` underlines the actively sorted column header with the datum;
  sort direction stays shape-encoded via the `ct-table__sort-indicator` arrows.

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
      <button class="ct-button ct-button--secondary ct-button--sm" type="button">Export</button>
      <button class="ct-button ct-button--sm" type="button">New project</button>
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

### Metric / Stat

Use `ct-metric` for product metrics. It is the semantic successor to `ct-spec`; the existing `ct-spec` classes remain supported for compatibility. Values use tabular numerals, and every semantic status includes visible text.

```html
<dl class="ct-metrics" aria-label="Service metrics">
  <div class="ct-metric" data-status="success">
    <dt class="ct-metric__label">Availability</dt>
    <dd class="ct-metric__value">99.98<small>%</small>
      <span class="ct-metric__meta">
        <span>Last 30 days</span>
        <span class="ct-metric__status">Healthy</span>
      </span>
    </dd>
  </div>
</dl>
```

Use `data-state="active"`, `loading`, `error`, or `disabled` for structural state and `data-status` for `success`, `info`, `warning`, `danger`, or `error` semantics. Pair `data-state="loading"` with `aria-busy="true"`; pair disabled content with `aria-disabled="true"`.

### Segmented Meter

The segmented meter represents a part-to-whole distribution. Its visible legend is required: colour is decorative reinforcement, never the only way a segment is identified. Use the scalar progress bar instead when one `aria-valuenow` value describes the whole component.

```html
<div class="ct-meter" role="group"
  aria-labelledby="delivery-label" aria-describedby="delivery-legend">
  <div class="ct-meter__header">
    <span class="ct-meter__label" id="delivery-label">Delivery status</span>
    <span class="ct-meter__summary">100 items</span>
  </div>
  <div class="ct-meter__track" aria-hidden="true">
    <span class="ct-meter__segment" data-variant="success"
      style="--ct-meter-segment-size: 62%;"></span>
    <span class="ct-meter__segment" data-variant="warning"
      style="--ct-meter-segment-size: 23%;"></span>
    <span class="ct-meter__segment" data-variant="danger"
      style="--ct-meter-segment-size: 15%;"></span>
  </div>
  <ul class="ct-meter__legend" id="delivery-legend">
    <li class="ct-meter__legend-item">
      <span class="ct-meter__marker" data-variant="success" aria-hidden="true"></span>
      <span>Completed</span><span class="ct-meter__legend-value">62%</span>
    </li>
    <li class="ct-meter__legend-item">
      <span class="ct-meter__marker" data-variant="warning" aria-hidden="true"></span>
      <span>In review</span><span class="ct-meter__legend-value">23%</span>
    </li>
    <li class="ct-meter__legend-item">
      <span class="ct-meter__marker" data-variant="danger" aria-hidden="true"></span>
      <span>Blocked</span><span class="ct-meter__legend-value">15%</span>
    </li>
  </ul>
</div>
```

### Modal

Dialog with backdrop:

```html
<div class="ct-modal" data-state="closed" hidden>
  <div class="ct-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="ct-modal__header">
      <h2 id="modal-title">Invite team</h2>
      <button class="ct-button ct-button--ghost" type="button"
        aria-label="Close" data-ct-dismiss>×</button>
    </div>
    <div class="ct-modal__body">
      <p>Send an invite to a new team member.</p>
      <!-- form content -->
    </div>
    <div class="ct-modal__footer">
      <button class="ct-button ct-button--secondary" type="button" data-ct-dismiss>Cancel</button>
      <button class="ct-button" type="button">Send</button>
    </div>
  </div>
</div>
```

Attach `createModalController({ container, dialog, trigger })` to synchronize state, trap focus,
handle Escape/backdrop dismissal, and restore focus. See [Headless behaviors](../docs/behaviors.md).

### Toast

Notification with variants:

```html
<div class="ct-toast-region" aria-live="polite">
  <div class="ct-toast" data-variant="success" data-state="open">
    <div class="ct-toast__title">Saved</div>
    <div class="ct-toast__description">Your changes were saved.</div>
    <button class="ct-button ct-button--ghost" type="button">Undo</button>
  </div>
</div>
```

Variants: `success`, `danger`, `info`, `warning`

### Alert / Banner

Inline feedback message with variants:

```html
<div class="ct-alert" data-variant="warning" role="alert">
  <span class="ct-alert__icon" aria-hidden="true">!</span>
  <div class="ct-alert__content">
    <div class="ct-alert__title">Action required</div>
    <div class="ct-alert__description">Please review the pending changes.</div>
    <div class="ct-alert__actions">
      <button class="ct-button ct-button--secondary ct-button--sm" type="button">Review</button>
    </div>
  </div>
</div>
```

Variants: `info`, `success`, `warning`, `danger`

### Badge / Status Badge

Small status indicators with optional icon or dot:

```html
<span class="ct-badge ct-badge--icon"><span class="ct-badge__dot" aria-hidden="true"></span>Draft</span>
<span class="ct-badge ct-badge--success ct-badge--icon">
  <span class="ct-badge__icon" aria-hidden="true">+</span>
  Approved
</span>
```

### Live / Connection Status

Status text is mandatory; the indicator is decorative. Static statuses need no live-region role. For a connection label that changes in place, use a polite atomic status region.

```html
<span class="ct-status" data-status="connecting" data-state="loading"
  role="status" aria-live="polite" aria-atomic="true" aria-busy="true">
  <span class="ct-status__indicator" aria-hidden="true"></span>
  <span class="ct-status__label">Connecting</span>
  <span class="ct-status__detail">Retrying</span>
</span>
```

Connection values are `online`, `connecting`, `degraded`, `offline`, and `error`. Generic semantic aliases `success`, `info`, `warning`, `neutral`, and `danger` are also supported. Update the existing label in place so screen readers announce the change once.

### Chip / Tag

Compact tags for filters or metadata:

```html
<button class="ct-chip ct-chip--interactive" type="button" aria-pressed="true">
  <span class="ct-chip__icon" aria-hidden="true">#</span>
  Finance
</button>

<span class="ct-chip">
  Uploads
  <button class="ct-chip__remove" type="button" aria-label="Remove tag">x</button>
</span>
```

### File Upload / Drag & Drop

Drag area + file list pattern. Use `data-state="dragover"` while dragging. For validation, put
`aria-invalid="true"` on both the styled dropzone and the native file input, then connect visible
error text to the input with `aria-describedby`.

```html
<div class="ct-file-upload">
  <label class="ct-file-upload__dropzone" for="files">
    <input class="ct-file-upload__input" id="files" type="file" multiple />
    <div class="ct-file-upload__title">Drop files here or browse</div>
    <div class="ct-file-upload__hint">PDF, DOCX up to 10MB</div>
    <span class="ct-button ct-button--secondary ct-button--sm">Browse files</span>
  </label>

  <ul class="ct-file-upload__list">
    <li class="ct-file-upload__item" data-status="success">
      <div class="ct-file-upload__file">
        <div class="ct-file-upload__name">report.pdf</div>
        <div class="ct-file-upload__meta">820 KB</div>
      </div>
      <span class="ct-badge ct-badge--success">Uploaded</span>
    </li>
  </ul>
</div>

<!-- Invalid state -->
<div class="ct-file-upload">
  <label class="ct-file-upload__dropzone" for="files-invalid" aria-invalid="true">
    <input class="ct-file-upload__input" id="files-invalid" type="file"
      aria-invalid="true" aria-describedby="files-error" />
    <div class="ct-file-upload__title">Choose another file</div>
    <div class="ct-file-upload__hint">PDF, DOCX up to 10MB</div>
    <span class="ct-button ct-button--secondary ct-button--sm">Browse files</span>
  </label>
  <div class="ct-file-upload__error" id="files-error">File is too large.</div>
</div>
```

### Loading Spinner + Overlay

Spinner for inline loading and overlay for blocking states:

```html
<div class="ct-spinner ct-spinner--sm" role="status" aria-live="polite">
  <span class="ct-sr-only">Loading…</span>
</div>

<div class="ct-card" style="position: relative; min-height: 180px;">
  <div class="ct-loading-overlay" data-state="active" aria-busy="true">
    <div class="ct-loading-overlay__content">
      <div class="ct-spinner ct-spinner--lg" aria-hidden="true"></div>
      <div class="ct-loading-overlay__label">Uploading files...</div>
    </div>
  </div>
</div>
```

### Confirmation Dialog

Use the modal base with a confirmation layout:

```html
<div class="ct-modal ct-modal--confirmation" data-state="open">
  <div class="ct-modal__dialog" role="dialog" aria-modal="true"
    aria-labelledby="confirm-title" aria-describedby="confirm-desc">
    <div class="ct-modal__body">
      <div class="ct-confirmation" data-variant="danger">
        <div class="ct-confirmation__icon" aria-hidden="true">!</div>
        <div class="ct-confirmation__content">
          <h2 class="ct-confirmation__title" id="confirm-title">Delete file?</h2>
          <p class="ct-confirmation__description" id="confirm-desc">This action cannot be undone.</p>
        </div>
      </div>
    </div>
    <div class="ct-modal__footer">
      <button class="ct-button ct-button--secondary" type="button" data-ct-dismiss>Cancel</button>
      <button class="ct-button ct-button--danger" type="button">Delete</button>
    </div>
  </div>
</div>
```

### Skeleton / Placeholder

Use for loading placeholders:

```html
<div class="ct-stack" style="--ct-stack-space: var(--space-3); max-width: 320px;">
  <span class="ct-skeleton ct-skeleton--title"></span>
  <span class="ct-skeleton ct-skeleton--text"></span>
  <span class="ct-skeleton ct-skeleton--text" style="--ct-skeleton-width: 70%;"></span>
</div>
```

### Tabs

Tab navigation with panels:

```html
<div class="ct-tabs">
  <div class="ct-tabs__list" role="tablist">
    <button class="ct-tabs__trigger" type="button" role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1" tabindex="0">Overview</button>
    <button class="ct-tabs__trigger" type="button" role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">Settings</button>
  </div>
  <div class="ct-tabs__panel" role="tabpanel" id="panel-1" aria-labelledby="tab-1">
    <p>Panel content</p>
  </div>
  <div class="ct-tabs__panel" role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
    <p>Settings content</p>
  </div>
</div>
```

Attach `createTabsController({ tablist })` unless the consuming framework already owns the equivalent roving-focus and selection state machine.

### Dropdown

Action menu:

```html
<div class="ct-dropdown" data-state="closed">
  <button class="ct-button ct-button--secondary ct-dropdown__trigger" type="button"
    id="actions-trigger" aria-expanded="false" aria-haspopup="menu"
    aria-controls="actions-menu">Actions</button>
  <div class="ct-dropdown__menu" id="actions-menu" role="menu"
    aria-labelledby="actions-trigger" hidden>
    <button class="ct-dropdown__item" type="button" role="menuitem" tabindex="-1">Edit</button>
    <button class="ct-dropdown__item" type="button" role="menuitem" tabindex="-1">Duplicate</button>
    <div class="ct-dropdown__separator" role="separator"></div>
    <button class="ct-dropdown__item" type="button" role="menuitem" tabindex="-1">Delete</button>
  </div>
</div>
```

Attach `createDropdownController({ root, trigger, menu })` to own `hidden`, `data-state`, ARIA, keyboard navigation, selection, outside interaction, and focus return. The caller still gives the menu an accessible name with `aria-label` or `aria-labelledby`.

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
      <span class="ct-breadcrumbs__separator" aria-hidden="true">/</span>
    </li>
    <li class="ct-breadcrumbs__item">
      <a class="ct-breadcrumbs__link" href="/projects">Projects</a>
      <span class="ct-breadcrumbs__separator" aria-hidden="true">/</span>
    </li>
    <li class="ct-breadcrumbs__item">
      <span class="ct-breadcrumbs__current" aria-current="page">Alpha</span>
    </li>
  </ol>
</nav>
```

### Datepicker

Calendar popup for date selection. The application or framework adapter owns the calendar's
roving-tabindex keyboard behavior, month changes, selection, and open/close state described in the
accessibility guidelines.

```html
<div class="ct-field">
  <label class="ct-field__label" for="date">Date</label>
  <div class="ct-datepicker" data-state="open">
    <input class="ct-input" id="date" type="text" placeholder="Select date"
      role="combobox" aria-haspopup="dialog" aria-expanded="true"
      aria-controls="date-popover" />
    <div class="ct-datepicker__popover" id="date-popover"
      role="dialog" aria-modal="true" aria-label="Choose date">
      <div class="ct-datepicker__header">
        <button class="ct-button ct-button--ghost ct-button--icon" type="button"
          aria-label="Previous month">‹</button>
        <div class="ct-datepicker__title" aria-live="polite">March 2026</div>
        <button class="ct-button ct-button--ghost ct-button--icon" type="button"
          aria-label="Next month">›</button>
      </div>
      <div class="ct-datepicker__grid" role="grid" aria-label="March 2026">
        <div class="ct-datepicker__row" role="row">
          <abbr class="ct-datepicker__weekday" role="columnheader" title="Monday">Mo</abbr>
          <abbr class="ct-datepicker__weekday" role="columnheader" title="Tuesday">Tu</abbr>
          <abbr class="ct-datepicker__weekday" role="columnheader" title="Wednesday">We</abbr>
          <abbr class="ct-datepicker__weekday" role="columnheader" title="Thursday">Th</abbr>
          <abbr class="ct-datepicker__weekday" role="columnheader" title="Friday">Fr</abbr>
          <abbr class="ct-datepicker__weekday" role="columnheader" title="Saturday">Sa</abbr>
          <abbr class="ct-datepicker__weekday" role="columnheader" title="Sunday">Su</abbr>
        </div>
        <div class="ct-datepicker__row" role="row">
          <button class="ct-datepicker__day" type="button" role="gridcell" tabindex="-1" aria-label="9 March 2026">9</button>
          <button class="ct-datepicker__day" type="button" role="gridcell" tabindex="-1" aria-label="10 March 2026">10</button>
          <button class="ct-datepicker__day" type="button" role="gridcell" tabindex="-1" aria-label="11 March 2026">11</button>
          <button class="ct-datepicker__day" type="button" role="gridcell" tabindex="0" aria-selected="true" aria-label="12 March 2026">12</button>
          <button class="ct-datepicker__day" type="button" role="gridcell" tabindex="-1" aria-label="13 March 2026">13</button>
          <button class="ct-datepicker__day" type="button" role="gridcell" tabindex="-1" aria-label="14 March 2026">14</button>
          <button class="ct-datepicker__day" type="button" role="gridcell" tabindex="-1" aria-label="15 March 2026">15</button>
        </div>
        <!-- Render the remaining weeks with the same row/gridcell contract. -->
      </div>
    </div>
  </div>
</div>
```

### Tooltip

Hint on hover/focus:

```html
<span class="ct-tooltip" data-state="closed" data-side="top">
  <button class="ct-button" type="button" aria-describedby="tip-1">Hover me</button>
  <span class="ct-tooltip__content" role="tooltip" id="tip-1" hidden>Short hint</span>
</span>
```

Attach `createTooltipController({ root, trigger, tooltip })` for hover-capable pointers, keyboard focus, touch dismissal, Escape, delays, and cleanup. The tooltip supplements the trigger's accessible name; it must not contain interactive content.

### Navbar

Use `ct-navbar--compact` for dense product headers. Mark expendable actions with `data-priority="secondary"`; they hide below the 600px small breakpoint while the menu toggle and primary action remain available. If no mobile toggle exists, primary navigation remains reachable as a horizontal scroll row instead of disappearing.

```html
<header class="ct-navbar ct-navbar--compact">
  <a class="ct-navbar__brand" href="/">
    <span class="ct-navbar__title">Workspace</span>
  </a>
  <button class="ct-navbar__toggle" type="button"
    aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-nav">
    <span class="ct-navbar__toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span>
  </button>
  <div class="ct-navbar__spacer"></div>
  <div class="ct-navbar__actions">
    <button class="ct-button ct-button--ghost ct-button--icon"
      type="button" aria-label="Search" data-priority="secondary">…</button>
    <button class="ct-button ct-button--ghost ct-button--icon"
      type="button" aria-label="Profile">…</button>
  </div>
  <nav class="ct-navbar__mobile-menu" id="mobile-nav" data-state="closed"
    aria-label="Mobile navigation">…</nav>
</header>
```

The CSS controls presentation only. Application code must keep `aria-expanded`, `data-state`, focus movement, Escape handling, and focus return in sync.

### App Shell

App Shell V2 is the recommended layout for new applications. The original `.ct-app-shell` remains a supported compatibility layout and is not being rewritten, so existing DOM and selectors keep working. Both variants now share these public override hooks:

- `--ct-shell-sidebar-width`
- `--ct-shell-sidebar-rail-width`
- `--ct-shell-panel-width`
- `--ct-shell-motion-duration`
- `--ct-shell-motion-easing`

The historical V1 (`--ct-sidebar-*`) and V2 (`--ct-v2-*`) variables remain compatibility aliases. Prefer the shared hooks in new integrations.

## Touch Target Policy

On coarse pointers Construct exposes at least a 44×44 CSS-pixel interaction area for the covered compact controls: default and small buttons, checkbox and radio inputs, default and small switches, sliders, pagination links, and interactive chips. Automated browser contracts verify those targets. This exceeds the WCAG 2.2 AA size threshold in SC 2.5.8 and meets Construct's enhanced target policy; SC 2.5.5 itself is AAA. Visual sizes remain compact on fine pointers. Products remain responsible for custom controls and applicable spacing exceptions.

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
<div class="ct-cluster" style="--ct-cluster-gap: var(--space-3);">
  <button type="button">Button 1</button>
  <button type="button">Button 2</button>
</div>
```

## Text Utilities

- `ct-muted` - Muted text color
- `ct-truncate` - Truncate with ellipsis
- `ct-sr-only` - Screen reader only (visually hidden)

---

**Construct** - Build accessible design constructs
