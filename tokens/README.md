# Accessful Design Tokens

## Design direction
- Enterprise, clean, high-trust, low-noise
- Deep ocean primary for authority
- Teal accent for clarity and modernity
- Neutral slate for typography and surfaces

## Files
- `primitives.json`: palette, typography scale, spacing, radius, shadows, layout, sizes
- `semantic.light.json`: semantic mapping for light theme + typography styles
- `tokens.css`: generated CSS Variables for direct usage
- `tokens.json`: generated, resolved token values (with units)
- `tokens.ts`: generated exports for JS/TS usage

## Usage (CSS)
```css
@import "../design/tokens/tokens.css";

body {
  font-family: var(--font-family-text);
  color: var(--color-text-primary);
background: var(--color-bg-canvas);
}
```

## Build tokens
Edit only `primitives.json` or `semantic.light.json`, then generate outputs.

From repo root:
```bash
node design/scripts/build-tokens.mjs
```

From `design/`:
```bash
npm run build
```

Check if outputs are up-to-date (CI-friendly):
```bash
node design/scripts/build-tokens.mjs --check
```

From `design/`:
```bash
npm run check
```

## Brand guidance
- Use primary for key actions and navigation
- Use accent sparingly for highlights and emphasis
- Prefer `surface` and `muted` backgrounds for large sections
