# Construct Design Tokens

Construct tokens are the source of truth for reusable visual decisions. The pipeline validates and resolves three layers into CSS custom properties plus JSON, JavaScript, and TypeScript exports.

## Three-layer architecture

| Layer | Source | Responsibility | Example |
| --- | --- | --- | --- |
| Primitive | `primitives.json` | Raw, context-free scales | `space.4`, `color.orange.500` |
| Semantic | `semantic.*.json` | Theme-aware purpose | `color.background.canvas`, `color.focus.ring` |
| Component | `components.json` | Stable component decisions | `button.height`, `control.borderFocus` |

References flow down the architecture: semantic tokens can reference primitives; component tokens can reference semantic tokens or primitives. A lower layer must never reference a higher layer.

```jsonc
// Primitive
{ "space": { "4": 8 } }

// Semantic
{ "color": { "background": { "canvas": "{color.stone.50}" } } }

// Component
{ "button": { "height": "{size.controlHeight.md}" } }
```

The generated CSS names follow the same distinction:

```css
--space-4: 8px;
--color-bg-canvas: var(--color-stone-50);
--component-button-height: var(--control-height-md);
```

## Files

### Authored sources

- `primitives.json`
- `semantic.light.json`
- `semantic.dark.json`
- `semantic.high-contrast.json`
- `components.json`

### Generated outputs

- `tokens.css` — primitive, semantic, component, built-in theme, and system-preference custom properties
- `tokens.json` — resolved values and metadata for tooling
- `tokens.js` — runtime ESM exports
- `tokens.ts` — typed, literal-preserving TypeScript exports

Never hand-edit generated outputs. Change source JSON and run `npm run build`.

### Schemas

The published `schemas/` directory contains JSON Schema contracts for primitives, semantics, components, and product themes. `schemas/examples/theme.example.json` is a neutral custom-theme input suitable for editor validation and CI examples.

## CSS usage

```css
@import '@neuravision/construct/tokens/tokens.css';

.product-panel {
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
  padding: var(--space-6);
  border-radius: var(--radius-card);
}
```

Use semantic tokens in product CSS. Use component tokens when adapting the documented contract of that component. Primitive tokens are appropriate for scale-based values without product meaning, not as a shortcut around semantic intent.

## JavaScript and TypeScript

```ts
import {
  componentThemes,
  components,
  cssVars,
  semantic,
  semanticThemes,
  tokenMetadata,
  tokens,
} from '@neuravision/construct/tokens';

console.log(tokenMetadata.layers); // ['primitives', 'semantic', 'components']
console.log(semantic.color.brand.primary); // resolved light-theme value
console.log(components.button.height); // resolved component value
console.log(cssVars.components.button.height); // var(--component-button-height)
console.log(semanticThemes.dark.color.background.canvas);
console.log(componentThemes.highContrast.metric.background);
console.log(tokens.metadata.themes);
```

`tokens` contains `metadata`, `primitives`, `semantic`, `components`, `semanticThemes`, `componentThemes`, and `cssVars`. Named exports provide the same maps for tree-shakeable tooling.

## Built-in themes

Construct ships `light`, `dark`, `high-contrast`, and `high-contrast-dark` scopes:

```html
<html data-theme="dark">…</html>
```

Themes can also be nested on containers. Every explicit theme scope declares the complete semantic and component contract, so light inside dark, high-contrast inside light, and custom themes inside any parent do not leak inherited values.

With no explicit `data-theme`, root-level `prefers-color-scheme: dark` and `prefers-contrast: more` preferences apply automatically — including the combination: dark-scheme users who request more contrast get `high-contrast-dark`, not a light UI. Note that pinning any `data-theme` on the root opts the page out of these automatic preference hookups; products that pin a theme should offer their own contrast/scheme switch (for example by pinning `high-contrast`/`high-contrast-dark` when the user asks for it).

### Type scale units

Font-size and line-height tokens are emitted in `rem` (authored in px, divided by 16) so user browser font-size preferences scale the entire system. Control heights, spacing, and the 44px coarse-pointer targets intentionally stay in px.

### Accent roles

`--color-brand-accent` is the decorative datum orange for edges and rules on canvas/surface. `--color-brand-accent-strong` is the validated fill orange — gated at ≥3:1 against `bg.canvas`, `bg.surface`, and `bg.muted` in every theme — for progress fills, meters, and any indicator drawn against the muted track color. Orange is never a text color; text uses the neutral `--color-text-*` roles.

## Custom product themes

A custom theme extends one built-in theme and overrides only known semantic and/or component paths.

```json
{
  "$schema": "./node_modules/@neuravision/construct/schemas/theme.schema.json",
  "name": "acme",
  "extends": "light",
  "semantic": {
    "color": {
      "brand": {
        "primary": "{color.ocean.700}",
        "primaryHover": "{color.ocean.800}",
        "primaryActive": "{color.ocean.900}"
      }
    }
  },
  "components": {
    "button": {
      "radius": "{radius.pill}"
    }
  },
  "contrast": [
    {
      "name": "button label",
      "foreground": "components.button.color",
      "background": "components.button.background",
      "minRatio": 4.5
    }
  ]
}
```

Compile it from the consuming project:

```bash
npx construct-theme \
  --theme ./acme.theme.json \
  --out-dir ./src/generated/construct-theme
```

Import the generated token sheet after every Construct style entry. Foundations, the full component bundle, and standalone component entries each pull in the built-in tokens; loading the generated file last prevents those imports from overriding a custom root scope:

```css
@import '@neuravision/construct/foundations.css';
@import '@neuravision/construct/components/button.css';
@import './generated/construct-theme/tokens.css';
```

Product CSS that intentionally overrides Construct tokens belongs after the generated sheet.

Repeat `--theme` to include multiple product themes. Without `--out-dir`, the public CLI writes to `./construct-theme`. Use `--validate-only` in fast checks, `--check` to compare an existing output directory, and `--report-contrast` for a ratio report.

The compiler rejects invalid schemas, unknown or missing paths, circular/missing references, duplicate names/selectors, unsafe or invalid scope selectors, structurally unsafe CSS literals, invalid typed color/length/weight/shadow values, and failing built-in or declared contrast pairs before it writes output. Custom selectors intentionally support one simple scope (`:root`, a class/id, or a `data-*` attribute selector) rather than arbitrary selector programs.

## Repository commands

```bash
npm run build            # generate tokens and standalone component entries
npm run tokens:validate  # schema, references, theme shape, contrast
npm run tokens:test      # positive and negative pipeline contracts
npm run check            # all non-mutating package contracts
```

## Font families

Token output includes resilient local/system fallback stacks. Foundations make no network request. See [Font loading and self-hosting](../docs/fonts.md) for the optional hosted preset and self-hosting pattern.

## Versioning

- **Major:** remove/rename a token or change a public token's meaning.
- **Minor:** add a token, layer capability, or backward-compatible theme feature.
- **Patch:** fix generation or validation without changing the documented output contract.

Value changes are evaluated by consumer impact. A contrast correction may require a minor release even when names remain stable because it changes rendered product color.
