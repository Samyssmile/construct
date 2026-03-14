# Construct Design Tokens

Design tokens are the single source of truth for all design decisions in the Construct Design System. They provide consistent values for colors, typography, spacing, and more across all applications.

## Design Direction

- **Enterprise-grade**: Clean, professional, high-trust aesthetic
- **Ocean primary**: Deep, authoritative blue for key actions
- **Teal accent**: Modern, clear accent for highlights
- **Slate neutrals**: Versatile grays for typography and surfaces

## Files

- **`primitives.json`**: Raw values (color palettes, typography scale, spacing, radius, shadows, layout)
- **`semantic.light.json`**: Semantic mappings for light theme (brand, text, background, state colors)
- **`semantic.dark.json`**: Dark theme overrides (color + theme metadata)
- **`semantic.high-contrast.json`**: High-contrast theme overrides (color + theme metadata)
- **`tokens.css`**: Generated CSS Custom Properties (ready for import)
- **`tokens.json`**: Generated, resolved token values with units (for tooling)
- **`tokens.js`**: Generated JavaScript module for runtime imports
- **`tokens.ts`**: Generated TypeScript definitions and typed exports

## Two-Tier Token System

### Primitives
Raw design values that form the foundation:

```json
{
  "color": {
    "ocean": {
      "700": "#174C5D"
    }
  },
  "space": {
    "4": 8
  }
}
```

### Semantic
Contextual tokens that reference primitives:

```json
{
  "color": {
    "brand": {
      "primary": "{color.ocean.700}"
    }
  }
}
```

This approach means:
- **Primitives** rarely change (your color palette)
- **Semantic** tokens can be remapped for themes without touching primitives
- Consistency is enforced automatically

## Usage

### CSS

Import the generated CSS file:

```css
@import "@neuravision/construct/tokens/tokens.css";

body {
  font-family: var(--font-family-body);
  color: var(--color-text-primary);
  background: var(--color-bg-canvas);
}

.button {
  background: var(--color-brand-primary);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-control);
}
```

### Themes

Construct ships with light (default), dark, and high-contrast themes. The generated CSS includes theme overrides and system preference fallbacks.

```html
<html data-theme="dark">
  ...
</html>
```

Available values:
- `light` (default)
- `dark`
- `high-contrast`

If no `data-theme` is set, the system preferences are respected:
- `prefers-color-scheme: dark` → dark theme
- `prefers-contrast: more` → high-contrast theme

### TypeScript/JavaScript

Import the generated token module:

```typescript
import { tokens, cssVars } from '@neuravision/construct/tokens/tokens';

// Use resolved values
console.log(tokens.semantic.color.brand.primary); // "#174C5D"

// Or use CSS variable references
console.log(cssVars.semantic.color.brand.primary); // "var(--color-brand-primary)"

// Access full theme maps
console.log(tokens.semanticThemes.dark.color.background.canvas);
```

## Building Tokens

The build script generates CSS, JSON, JavaScript, and TypeScript outputs from the source token files.

### Run Build

From repository root:
```bash
node design/scripts/build-tokens.mjs
```

From `design/` directory:
```bash
npm run build
```

### Check if Up-to-Date (CI)

Verify outputs match sources without rebuilding:

```bash
npm run check
```

This command exits with a non-zero code if outputs are outdated, making it perfect for CI/CD pipelines.

## Token Naming Conventions

### CSS Variables

Tokens are converted to kebab-case CSS variables:

- Primitives: `--color-ocean-700`, `--space-4`, `--radius-md`
- Semantic: `--color-brand-primary`, `--color-text-primary`, `--color-bg-canvas`

### TypeScript

Tokens are available as nested objects with camelCase properties:

```typescript
tokens.primitives.color.ocean[700]
tokens.semantic.color.brand.primary
cssVars.semantic.color.brand.primary
```

## Brand Guidance

- **Primary**: Use for key actions, primary buttons, and main navigation
- **Accent**: Use sparingly for highlights, special emphasis, and interactive elements
- **Backgrounds**: Prefer `surface` and `muted` for large content areas
- **Text**: Use `primary` for body text, `secondary` for less important text, `muted` for hints

## Versioning

Tokens follow Semantic Versioning:

- **MAJOR**: Removing/renaming tokens or changing existing token values
- **MINOR**: Adding new tokens, scales, or semantic aliases
- **PATCH**: Documentation, build scripts, internal changes (no token value changes)

---

**Construct** - Build accessible design constructs
