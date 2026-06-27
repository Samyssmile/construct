# Changelog

All notable changes to `@neuravision/construct` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [2.0.1] - 2026-06-27

### Fixed

- **Navbar height token.** The navbar referenced a non-existent `--control-height-xl` primitive (the control-height scale ends at `lg`), so the navbar fell back to an undefined height. Introduced a dedicated `layout.navbar.height` primitive (`--navbar-height`, 56px) and pointed `.ct-navbar` at it. The control-height scale stays reserved for form controls.


## [2.0.0] - 2026-06-27

A new visual identity — *"engineered for everyone."* Construct moves from a generic tech-blue/slate look to a distinctive system: warm concrete neutrals, an ink-steel primary, and a safety-orange accent that acts as a single recurring **"datum"** marking what is focused / active / selected / current. Verified WCAG AA across light, dark, and high-contrast themes.

**BREAKING CHANGES:**

- **Neutral primitive ramp renamed `slate` → `stone`.** Consumers referencing `color.slate.*` or `--color-slate-*` must migrate to `stone.*`. The neutral palette is now warm concrete/graphite instead of cool blue-grey.
- **Default typefaces changed** from Sora + Source Sans 3 to **Manrope** (display + body). The Google Fonts import in `foundations.css` was updated accordingly; self-hosting consumers must update their font files.

### Added

- **The "datum" signature** — the orange accent now marks focus rings, active tab underlines, checked selection controls, slider fills, selected chips, the current pagination page, and active navigation (leading edge) across all components.
- New semantic tokens: `color.brand.onAccent`, `color.text.onPrimary`, `color.state.onSolid` (theme-aware foregrounds for solid fills), and the `font.weight.extrabold` (800) display weight.
- New `orange` primitive ramp (structural safety orange).

### Changed

- State ramps retuned to widen hue separation from the brand orange: `ocean` → blueprint blue (info), `amber` → gold (warning), `red` → crimson (danger).
- Shadows warmed (warm-ink instead of cool blue); display headings now use weight 800.
- Solid chips and solid banners now use a theme-aware foreground (`state.onSolid`) so their labels meet AA contrast in dark and high-contrast themes.


## [1.4.0] - 2026-06-27

### Added

- **Tooling — design-sync for [claude.ai/design](https://claude.ai/design):** Construct can now be synced to a Claude Design project so Claude's design agent builds with the real Construct components. Because Construct is a pure CSS/token system, an off-script generator (`.design-sync/build.mjs`) flattens the authored CSS into one bundle and builds one preview card per component from the true Storybook-rendered HTML, plus per-component usage docs and a class-vocabulary README header. Sync state lives under `.design-sync/`; no change to the published package surface.


## [1.3.1] - 2026-06-17

### Fixed

- **a11y / focus:** Raised the `--color-focus-ring` contrast so the focus indicator meets the WCAG 2.2 ≥ 3:1 non-text-contrast minimum against the canvas and surface backgrounds. The `light` ring (`teal.400`, 2.59:1 on canvas) → `teal.600` (5.09:1) and the `high-contrast` ring (`amber.400`, 2.07:1) → `amber.700` (6.68:1); the `dark` ring already passed and is unchanged. Affects every component that uses the shared focus token (24 files).


## [1.3.0] - 2026-06-17

### Added

- Chart styling skin (`ct-chart`) — a framework-agnostic theme layer for SVG data-visualisation primitives (line/area, bar, donut, sparkline, gauge). Provides series colour mapping (`.ct-chart__series--{1..8}` via `currentColor`), grid/axis, legend, donut/gauge text, and a visually-hidden **accessible data-table fallback** (`.ct-chart__table`, revealed with `.ct-chart--show-table`). Geometry is supplied by the consuming layer; this file only themes the result. `prefers-reduced-motion` and `forced-colors` supported.
- New categorical chart palette tokens `--color-chart-series-{1..8}`, defined for `light`, `dark`, and `high-contrast` themes. Every series colour meets the WCAG 1.4.11 non-text contrast minimum (≥ 3:1) against both the canvas and surface backgrounds.
- Storybook coverage for `ct-chart` (`Chart.stories.js`): line/area, bar, donut, gauge, sparkline, empty state, the interactive data-table toggle (documenting the `aria-expanded`/`aria-controls` contract), and an optional keyboard-focusable-marks example. All stories pass the a11y addon in `error` mode.

### Fixed

- `ct-chart`: interactive marks (`.ct-chart__bar`, `.ct-chart__slice`, `.ct-chart__dot`) now have `:focus-visible` parity with their `:hover` affordance, so consumer-focusable data points show a visible focus ring.
- `ct-chart`: hoisted `--ct-chart-gauge-width` into the `.ct-chart` config block (was an inline `var()` fallback duplicated across two rules), making it discoverable and overridable like the other `--ct-chart-*` properties.
- `ct-chart`: consistent `forced-colors` behaviour — data marks (line, area, dots, bars, slices, legend marker, gauge) now uniformly preserve their series/state colour via `forced-color-adjust: none`, so a coloured legend no longer describes monochrome lines in Windows High Contrast. Grid and axes still follow the user's forced palette, and the data-table fallback remains the fully compliant path.

## [1.2.0] - 2026-05-07

### Added

- Tree component (`ct-tree`) implementing the WAI-ARIA Tree View pattern: n-level nesting, roving tabindex, full keyboard navigation (↑/↓/→/←/Home/End/`*`/type-ahead), single & multi selection, async loading state (`aria-busy`), and an orphan-node modifier (`.ct-tree__node--orphan`) for hierarchies with missing parents. Modifiers: `--guides`, `--dense`, `--bordered`. Forced-colors and `prefers-reduced-motion` supported. (#86)

## [1.1.6] - 2026-04-09

### Changed

### Added

- Avatar seeded color palette: `.ct-avatar[data-seed-color="N"]` (N = 1–8) selects a deterministic background/foreground pair from the palette, letting consumers give each user a stable color. Avatars without the attribute keep the existing default — fully backwards compatible. (#85)
- New semantic tokens `--color-avatar-seed-{1..8}-{bg,fg}` and component-level `--ct-avatar-seed-{1..8}-{bg,fg}` aliases, defined for `light`, `dark`, and `high-contrast` themes. Every pair meets WCAG AA (≥ 4.5:1, lowest measured 6.48:1).
- New color primitives `purple` and `pink` (50–900 scales) feeding the seed palette.
- Storybook story `Data Display/Avatar/Seeded Colors` showcasing the palette and confirming the unseeded fallback.

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

[2.0.1]: https://github.com/Samyssmile/construct/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/Samyssmile/construct/compare/v1.4.0...v2.0.0
[1.4.0]: https://github.com/Samyssmile/construct/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/Samyssmile/construct/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/Samyssmile/construct/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/Samyssmile/construct/compare/v1.1.6...v1.2.0
[1.1.6]: https://github.com/Samyssmile/construct/compare/v1.1.5...v1.1.6
[1.1.5]: https://github.com/Samyssmile/construct/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/Samyssmile/construct/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/Samyssmile/construct/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/Samyssmile/construct/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/Samyssmile/construct/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Samyssmile/construct/compare/v1.0.0...v1.1.0
[0.2.0]: https://github.com/Samyssmile/construct/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/Samyssmile/construct/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Samyssmile/construct/releases/tag/v0.1.0
