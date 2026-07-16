# Preset themes

Preset themes are validated, ready-to-use theme inputs shipped with the package. Unlike the
built-in themes (`light`, `dark`, `high-contrast`), presets are **not** compiled into
`tokens/tokens.css` — they are brand skins rather than modes, have no system-preference
mapping, and add no CSS payload for consumers that do not use them. A product opts in by
compiling the preset through the `construct-theme` CLI:

```bash
npx construct-theme \
  --theme node_modules/@neuravision/construct/themes/walnut.theme.json \
  --out-dir ./src/generated/construct
```

Then activate it like any theme scope:

```html
<html data-theme="walnut"> … </html>
```

Products may also copy a preset as the starting point for their own theme and adjust
individual tokens; the CLI re-validates every override, including the contrast gates.

## Available presets

| Preset | Extends | Character |
|--------|---------|-----------|
| `walnut` | `light` | Warm ivory surfaces, walnut-brown brand color, wood-toned accents. Body text meets WCAG AAA (≥ 7:1) on all surfaces, enforced by `contrast` gates in the theme file. |

## Bar for adding a preset

- Must validate against `schemas/theme.schema.json` and pass every default contrast pair
  (`npm run themes:validate` wires this into `npm run check`).
- Must declare its own `contrast` entries for any token the preset repurposes
  (e.g. brand color used as text) and for stricter targets it claims (e.g. AAA body text).
- Palette, radius, and shadow decisions only — no font-family or type-scale overrides, so
  presets compose with any product typography.
