<div align="center">

[![Construct — token-based, framework-agnostic, accessible UI](.github/assets/banner.png)](https://samyssmile.github.io/construct/)

# Construct

**A token-based, framework-agnostic design system for accessible, modern web UI.**

[![npm version](https://img.shields.io/npm/v/@neuravision/construct?color=F4581C&label=npm&logo=npm)](https://www.npmjs.com/package/@neuravision/construct)
[![npm downloads](https://img.shields.io/npm/dm/@neuravision/construct?color=F4581C)](https://www.npmjs.com/package/@neuravision/construct)
[![Storybook](https://img.shields.io/badge/Storybook-live-FF4785?logo=storybook&logoColor=white)](https://samyssmile.github.io/construct/)
[![Deploy](https://img.shields.io/github/actions/workflow/status/Samyssmile/construct/deploy-storybook.yml?branch=main&label=storybook%20build)](https://github.com/Samyssmile/construct/actions/workflows/deploy-storybook.yml)
[![WCAG 2.2 AA target](https://img.shields.io/badge/WCAG_2.2-AA_target-2ea44f)](docs/guidelines.md)
[![License: MIT](https://img.shields.io/npm/l/@neuravision/construct?color=2ea44f)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-2ea44f)](CONTRIBUTING.md)

[**Live Storybook**](https://samyssmile.github.io/construct/) · [Components](#-components) · [Design Tokens](#-design-tokens) · [Accessibility](#-accessibility) · [Contributing](CONTRIBUTING.md)

</div>

---

## Why Construct?

Construct is a **single source of design truth** that ships portable CSS, validated design tokens, and opt-in headless behaviors — without framework lock-in. Style values live once as JSON tokens and compile to CSS custom properties, JSON, and typed TypeScript exports. Components use `ct-` classes and ARIA/data state, so they work anywhere that renders DOM.

- 🎯 **Three token layers** — primitive, semantic, and component contracts with schema and contrast validation
- 🧩 **Framework-agnostic** — 49 standalone component style entries and a full CSS bundle
- ♿ **Accessibility first** — WCAG 2.2 AA targets, tested ARIA/keyboard controllers, focus and forced-colors contracts
- ⚙️ **Optional behavior** — nine typed, dependency-free ESM controllers; importing CSS never starts JavaScript
- 🎨 **Three themes** — `light`, `dark`, `high-contrast`, with system-preference fallback
- 📐 **The "datum" grammar** — a signature orange reference line for focus / active / current state
- 🛠️ **Typed tokens** — autocomplete-friendly TypeScript exports
- 📖 **Interactive docs** — every component documented & a11y-tested in [Storybook](https://samyssmile.github.io/construct/)

## 📦 Installation

```bash
npm install @neuravision/construct
```

Using Angular? Reach for the official wrapper [**@neuravision/ng-construct**](https://github.com/Samyssmile/ng-construct) — typed, signal-based components built on top of these styles.

## 🚀 Quick Start

Import the foundation styles and the component bundle once (e.g. in your global stylesheet):

```css
@import "@neuravision/construct/foundations.css";
@import "@neuravision/construct/components/components.css";
```

Then use the classes in your markup:

```html
<button class="ct-button" type="button">Primary</button>
<button class="ct-button ct-button--secondary" type="button">Secondary</button>

<div class="ct-field">
  <label class="ct-field__label" for="email">Email</label>
  <input class="ct-input" id="email" type="email" placeholder="name@company.com" />
</div>
```

Or build custom UI directly on the tokens:

```css
.custom-card {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-control);
}
```

> 💡 Need a smaller bundle? Import a generated standalone style entry such as
> `@import "@neuravision/construct/components/button.css";`. Related public patterns can share an
> entry: Radio is included in `checkbox.css`, and Metric is included in `datum.css`.

Composite widgets can use the optional behavior entry instead of reimplementing keyboard and focus state machines:

```js
import { createModalController } from '@neuravision/construct/behaviors';
```

Foundations make no network request. Import `@neuravision/construct/fonts.css` before foundations only when the product explicitly accepts the hosted-font privacy and CSP tradeoff; self-hosting is documented in [docs/fonts.md](docs/fonts.md).

## 🎨 Theming

Set `data-theme` on the root element (or any container) to switch modes:

```html
<html data-theme="dark"> … </html>
```

| Value | Description |
|-------|-------------|
| `light` | Default theme |
| `dark` | Dark theme |
| `high-contrast` | Maximum-contrast theme |

With **no** `data-theme` set, Construct respects system preferences automatically:
`prefers-color-scheme: dark` → dark, `prefers-contrast: more` → high-contrast.

Validated product themes can extend a built-in theme without copying generated CSS:

```bash
npx construct-theme --theme ./brand.theme.json --out-dir ./src/generated/construct
```

Load the generated token stylesheet after all Construct style entries, because foundations and component entries include the built-in token sheet themselves:

```css
@import '@neuravision/construct/foundations.css';
@import '@neuravision/construct/components/components.css';
@import './generated/construct/tokens.css';
```

Application-specific overrides may follow it. Keeping the generated theme last among Construct imports ensures its root and scoped values win deterministically.

### Preset themes

The package ships validated preset themes in [`themes/`](themes/README.md) — brand skins that
compile through the same CLI instead of being baked into `tokens.css`:

```bash
npx construct-theme --theme node_modules/@neuravision/construct/themes/walnut.theme.json --out-dir ./src/generated/construct
```

| Preset | Character |
|--------|-----------|
| `walnut` | Warm ivory light theme with walnut-brown brand color; AAA body-text contrast enforced by built-in gates |

## 🧩 Components

49 standalone component style entries, documented and accessibility-tested in [Storybook](https://samyssmile.github.io/construct/).

| Category | Components |
|----------|-----------|
| **Actions** | Button · Toggle Group · Toolbar |
| **Forms & Inputs** | Field · Input · Textarea · Select · Select Menu · Checkbox · Radio · Switch · Slider · Combobox · Chip · File Upload · Datepicker |
| **Data Display** | Table · Data Table · List · Tree · Avatar · Badge · Icon · Tooltip · Chart · Metric · Meter |
| **Feedback** | Alert · Banner · Toast · Spinner · Skeleton · Progress Bar · Status · Empty State |
| **Navigation** | Navbar · Breadcrumbs · Tabs · Pagination · Sidebar · Skip Link |
| **Overlays** | Modal · Drawer · Popover · Dropdown |
| **Layout** | Card · Divider · Accordion · App Shell (V1 compatibility + V2 recommended) |

→ [**Explore every component in the live Storybook**](https://samyssmile.github.io/construct/)

## 🎨 Design Tokens

Construct uses a **three-layer token system**: raw *primitives*, theme-aware *semantic* aliases, and stable *component* decisions.

```jsonc
// primitives — raw values
{ "color": { "orange": { "500": "#F4581C" }, "stone": { "950": "#16130F" } }, "space": { "4": 8 } }

// semantic — contextual aliases that reference primitives
{ "color": { "brand": { "primary": "{color.stone.950}", "accent": "{color.orange.500}" } } }

// component — reusable component decisions
{ "button": { "height": "{size.controlHeight.md}", "radius": "{radius.control}" } }
```

The build pipeline (`npm run build`) compiles `tokens/*.json` into:

- **`tokens.css`** — CSS custom properties (`--color-brand-accent`)
- **`tokens.json`** — resolved values for tooling
- **`tokens.ts` / `tokens.js`** — typed exports

> ⚠️ Never hand-edit generated files (`tokens/tokens.*`). Edit the source JSON and run `npm run build`.

## ♿ Accessibility

Accessibility is a first-class requirement, not an afterthought:

- ✅ Semantic HTML and explicit ARIA/data-state markup contracts
- ✅ Optional tested keyboard behavior (roving tabindex, focus traps, arrows, typeahead, focus return)
- ✅ Visible focus indicators (the orange "datum")
- ✅ Automated WCAG contrast pairs across built-in and custom themes
- ✅ Screen-reader semantics and documented live-region patterns for dynamic content
- ✅ Respects `prefers-reduced-motion`

The Storybook a11y addon is configured to **fail the build on violations**. See [docs/guidelines.md](docs/guidelines.md) for the detailed patterns.

## 🧰 Tech & Tooling

| | |
|---|---|
| **Distribution** | Plain CSS + design tokens + optional dependency-free ESM behaviors |
| **Docs & tests** | Storybook 10 · Vitest 4 · Playwright (story-driven) |
| **a11y testing** | `@storybook/addon-a11y` (fails on violations) |
| **Token build** | Custom pipeline (`scripts/build-tokens.mjs`) |

## 🛠️ Local Development

```bash
npm install              # install dependencies
npm run storybook        # dev server → http://localhost:6006
npm run audit            # reject high/critical dependency advisories
npm run build            # build token and standalone CSS outputs
npm run check            # verify generated, schema, contrast, CSS, export & version contracts
npm test                 # run behavior, Storybook, touch & forced-colors browser tests
```

## 🎯 Framework Support

| Framework | Status |
|-----------|--------|
| **Vanilla HTML / CSS** | ✅ Available — use the `ct-` classes directly |
| **Angular** | ✅ Available — [`@neuravision/ng-construct`](https://github.com/Samyssmile/ng-construct) |
| **React** | ✅ CSS + headless controllers; [lifecycle example](examples/react/README.md) |
| **Svelte** | ✅ CSS + headless controllers |

## 📖 Documentation

- [Design Guidelines](docs/guidelines.md) — do's, don'ts & accessibility patterns
- [Component Usage](components/README.md) — HTML patterns and examples
- [Token Reference](tokens/README.md) — token structure & naming
- [Architecture](docs/architecture.md) — package layers and ownership boundaries
- [Headless Behaviors](docs/behaviors.md) — typed controllers and lifecycle
- [Fonts](docs/fonts.md) — network-free defaults, hosted opt-in, self-hosting
- [Governance](docs/governance.md) — Definition of Done and release gates
- [Changelog](CHANGELOG.md) — release history

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) and our
[Code of Conduct](CODE_OF_CONDUCT.md) before opening a PR. Found a security issue? See [SECURITY.md](SECURITY.md).

## 📄 License

[MIT](LICENSE) © Construct contributors

---

<div align="center">
<sub>Built with accessibility and modern design principles in mind · <a href="https://samyssmile.github.io/construct/">Live Storybook</a></sub>
</div>
