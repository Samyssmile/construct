# Changelog

All notable changes to `@neuravision/construct` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.5] - 2026-04-03

### Changed

## [1.1.4] - 2026-03-27

### Changed

## [1.1.3] - 2026-03-27

### Changed

## [1.1.2] - 2026-03-21

### Changed

## [1.1.1] - 2026-03-21

### Changed

## [1.1.0] - 2026-03-21

### Added

-

## [0.2.0] - 2026-03-12

### Added

- Toolbar component (`ct-toolbar`) with brand, navigation, and action slots
- Sidebar component (`ct-sidebar`) with side, over, and push modes
- Progress bar component (`ct-progress-bar`) with determinate, indeterminate, and size/variant modifiers
- Toggle group component (`ct-toggle-group`) with single/multiple selection and size variants
- Nav list component (`ct-nav-list`, `ct-nav-item`) for sidebar navigation
- Icon component (`ct-icon`) with sm, md, lg, xl sizes
- `prefers-reduced-motion` support in components layer for self-contained usage
- Explicit `:focus-visible` styles for all interactive components (button, form controls, checkbox, radio, switch, tabs, dropdown items, pagination, datepicker, table sort, nav items, toolbar links)

### Fixed

- Inconsistent focus indicators across components (standardized to `outline: 2px solid` with appropriate offsets)
- Missing focus styles on `.ct-button`, `.ct-check__input`, `.ct-radio__input`, `.ct-switch__input`, `.ct-tabs__trigger`
- Form controls now show both border-color change and outline ring on focus for WCAG 2.1 AA compliance

## [0.1.1] - 2026-03-12

### Changed

- Updated `.gitignore` to exclude internal documentation and mock data
- Project configuration and metadata cleanup

## [0.1.0] - 2026-01-31

### Added

- Initial release of the Construct Design System
- Two-tier token pipeline (primitives + semantic) with CSS, JSON, and TypeScript outputs
- Three theme modes: light (default), dark, high-contrast
- System preference fallback via `prefers-color-scheme` and `prefers-contrast`
- Foundation styles: CSS reset, typography scale, layout utilities
- Component library with `ct-` prefix and BEM naming:
  - Button (primary, secondary, outline, ghost, accent, danger, link variants; sm/md/lg sizes)
  - Form controls: input, select, textarea with field wrapper, hints, and error states
  - Selection controls: checkbox, radio, switch
  - Card with header, body, footer, and interactive variant
  - Table with striped, compact, sortable, and numeric cell variants
  - Data table with header, toolbar, filters, search, pagination, and footer
  - Modal and confirmation dialog
  - Toast notifications with info, success, warning, danger variants
  - Tooltip with top, bottom, left, right positioning
  - Tabs with trigger and panel
  - Dropdown menu with items, labels, separators
  - Pagination with navigation links
  - Breadcrumbs
  - Datepicker with calendar grid
  - Badge and chip with variant and interactive modifiers
  - File upload with drag-and-drop dropzone and file list
  - Spinner, skeleton loader, and loading overlay
- Accessibility: ARIA attribute-driven states, semantic HTML patterns
- Storybook with HTML Vite, a11y addon (error-level), theme switching, autodocs
- Story-driven testing via Vitest + Playwright
- GitHub Actions workflow for Storybook deployment to GitHub Pages
- Token build script with `--check` mode for CI validation

[1.1.5]: https://github.com/Samyssmile/construct/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/Samyssmile/construct/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/Samyssmile/construct/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/Samyssmile/construct/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/Samyssmile/construct/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Samyssmile/construct/compare/v1.0.0...v1.1.0
[0.2.0]: https://github.com/Samyssmile/construct/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/Samyssmile/construct/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Samyssmile/construct/releases/tag/v0.1.0
