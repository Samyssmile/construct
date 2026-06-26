# design-sync NOTES — Construct (@neuravision/construct)

## Shape: off-script CSS layout (NOT the standard React converter)

Construct is a **pure CSS/token, framework-agnostic** design system: components are
BEM-style `ct-*` classes on semantic HTML. There is **no JS component bundle / `dist/`**
(the `build` script only generates token files). The standard storybook converter
(`package-build.mjs`) is React-only (`ReactDOM.createRoot`, dist-bundling) and does **not
apply**. This sync uses an **off-script generator**: `.design-sync/build.mjs`.

What it produces in `ds-bundle/`:
- `_ds_bundle.css` — the repo's authored CSS flattened (tokens + foundations + every
  component CSS, via a recursive `@import` inliner; the remote Google-Fonts `@import` is
  hoisted to the top). `styles.css` is `@import "./_ds_bundle.css";`.
- `_ds_bundle.js` — minimal & **honest**: header + `components: []` (no JS API). This is
  what makes `package-validate.mjs` treat it as a tokens/styles bundle and skip the React
  `[BUNDLE_EXPORT]` smoke. Do NOT add fake component exports.
- `components/<Group>/<Name>/<Name>.html` — one preview card per component, built from the
  **true rendered HTML scraped from the reference Storybook** (`#storybook-root` innerHTML),
  wrapped in `<html data-theme="light">`.
- `<Name>.prompt.md` — class vocabulary + real markup example (scraped). No `.d.ts` (no JS API).

Re-run: `node .design-sync/build.mjs` (uses the scrape cache). After DS/story changes:
rebuild `.design-sync/sb-reference` then `node .design-sync/build.mjs --rescrape`.
Grading sheets: `node .design-sync/grade-capture.mjs [--components A,B]`.

## [GENERAL] Theme wrapper is mandatory in cards

tokens.css defines **light on the bare `:root`** (no `[data-theme="light"]` rule);
`[data-theme="dark"]`/`[data-theme="high-contrast"]` override, and
`@media (prefers-color-scheme: dark) :root:not([data-theme])` is a system fallback.
The Storybook decorator sets `data-theme` on the iframe `<html>` — **outside**
`#storybook-root`, so the scraped fragment carries no theme. Every card therefore sets
`data-theme="light"` on its own `<html>` (pins light, disables the dark media fallback).
This is also the agent's wrapping requirement (see conventions.md).

## [GENERAL] Overlay/fixed containment

Stories whose component is `position:fixed` (`ct-modal`, `ct-drawer`, `ct-toast-region`,
`ct-banner--fixed`) would bleed across grid cells. Fix: every `.ds-mount` is a containing
block (`transform: translateZ(0)`), so fixed descendants contain to their own cell; cells
holding those markers also get `min-height:360px; overflow:hidden` (the `ds-overlay`
class). Layout components (app-shell/navbar/sidebar) also use fixed but are tall already —
containment alone handles them. Verified: Overlays, Drawer, Toast, Banner, Sidebar render
contained and match the oracle.

## Fonts

Brand fonts (Sora / Source Sans 3 / JetBrains Mono) load via a **remote Google-Fonts
`@import`** inside `foundations.css` (and thus `_ds_bundle.css`). Validator reports
`[FONT_REMOTE]` (info). Egress to fonts.googleapis worked at sync time and both panels
rendered the brand fonts. If a future environment blocks egress, self-host the woff2 +
`@font-face` via the flattener and inject the same into `sb-reference/iframe.html`.

## Known / accepted

- `[TOKENS_MISSING]` (4): `--color-border-muted`, `--control-height-xl`, `--color-bg-subtle`,
  `--font-size-2xs` are referenced by `divider.css` / `navbar.css` / `list.css` but defined
  **nowhere in the source repo** — a pre-existing upstream gap, faithfully preserved (not a
  conversion bug). Affected components render fine (the unset var falls back). Worth fixing
  upstream in Construct, not here.
- `_ds_sync.json` is **absent by design** (off-script) — no anchor, so every re-sync
  re-verifies everything. Acceptable.
- Tooltip Playground / Focus Activation / Touch Accessibility: graded **close** — the
  tooltip is hover/focus-triggered and not shown in a static card (the oracle caught it
  mid-fade from focus); the trigger button matches and the resting state is the correct
  design reference. Positions/Alignment stories (always-on tooltips) match exactly.

## Re-sync risks (watch-list for the next run)

- **Scrape cache** (`.design-sync/.cache/scraped.json`, gitignored) is reused unless
  `--rescrape`. If the DS source or any story changed, rebuild `sb-reference` AND pass
  `--rescrape`, or cards ship stale HTML.
- **Off-script = full re-verify every sync** (no anchor). Re-run `grade-capture.mjs` and
  re-grade; don't assume carry-forward.
- **Overlay marker list** (`OVERLAY_MARKERS` in build.mjs) is hand-maintained from the CSS
  `position:fixed` classes. If Construct adds a new fixed-position component, add its class
  or it will bleed.
- **STACKED list** (full-width layout/table/banner components) is hand-maintained for card
  presentation. New wide components may need adding.
- Remote font/image egress assumed available (avatars use remote images too).
