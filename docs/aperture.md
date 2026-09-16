# Aperture

Aperture is Construct's additional signature look. Its identifying shape is an oval
split into two halves, separated by an eight-percent seam and shifted vertically.
That silhouette repeats at wordmark and poster scale. Oversized, tightly set grotesk
type and a displaced second line give the composition its rhythm. Paper, dark ink
and one cobalt field keep the hierarchy clear. The seam also separates action labels
from their lowered arrow discs and interrupts the composition's horizontal rules.
The identity should remain legible in monochrome.

Datum uses measured lines, technical annotations and orange registration marks.
Aperture uses a bold silhouette, editorial scale and open space. Choose a grammar
for a composition; avoid stacking both signatures on the same surface.

## Preview

Run `npm run storybook` and open **Patterns → Aperture Grammar → Aperture / The Full Look**.
Stories also cover dark, high contrast, a compact container, native theme switching,
individual primitives, all four theme scopes, right-to-left layout, a monochrome
composition and long action labels. See the [polish review](aperture-review.md)
for the visual findings and before/after comparison.

For the standalone specimen, run `npx vite --host 127.0.0.1 --port 4173` from the
repository and open `http://127.0.0.1:4173/aperture.demo.html`.
Run `npm run build` first after a fresh checkout. Serve the page over HTTP so its
shared ES module can load. The page needs no hosted fonts or image services.

## Integration

```css
@import '@neuravision/construct/foundations.css';
@import '@neuravision/construct/components/aperture.css';
```

```html
<section class="ct-aperture" data-theme="light">
  <p class="ct-aperture-label">A new perspective</p>
  <h2 class="ct-aperture-heading">Room for character.</h2>
  <a class="ct-aperture-action" href="/work">
    Explore the work
    <span class="ct-aperture-action__icon" aria-hidden="true">↗</span>
  </a>
</section>
```

The full component bundle includes Aperture too. Classes opt in explicitly;
existing Datum components keep their styles. Theme scopes inherit normally:
omit `data-theme` to follow the parent or the system preference.

The composition in `examples/aperture/showcase.css` is example page layout.
The reusable component contract lives in `components/aperture.css`. The native
radio handler in `examples/aperture/showcase.js` only changes the preview's theme;
the signature primitives themselves require no JavaScript.

## Vocabulary

| Primitive | Use |
| --- | --- |
| `ct-aperture` | Scoped typography, palette, selection, focus and query container |
| `ct-aperture-mark` | Decorative split oval; set `aria-hidden="true"` |
| `ct-aperture-wordmark` | Mark and name on a shared baseline |
| `ct-aperture-label` | Small section label with restrained spacing |
| `ct-aperture-display` / `ct-aperture-heading` | Fluid display and section typography |
| `ct-aperture-line` | Block line within a heading; subsequent lines step out by 0.24em |
| `ct-aperture-rule` | Decorative split rule with a 46 / 8 / 46 rhythm; set `aria-hidden="true"` |
| `ct-aperture-poster` | A strong field for one mark and a caption |
| `ct-aperture-action` / `--quiet` | Native action with detached circular arrow |
| `ct-aperture-panel` | A quiet supporting surface |
| `ct-aperture-choices` / `ct-aperture-choice` | Fieldset and labels around native radios |
| `ct-aperture-disclosure` | Native `details` and `summary` content |

Put `ct-aperture-poster__art` around the mark and
`ct-aperture-poster__caption` on the caption. Set
`--ct-aperture-mark-size` to a CSS length or percentage to resize a mark.
Use a link for navigation and a button for an action; disable buttons with the
native `disabled` attribute. Supply actual destinations and product behavior.

Action text and `ct-aperture-action__icon` belong inside the same native control.
The six-pixel visual seam is part of its clickable area; the disc is lowered eight
pixels and aligns with the label on hover. Keep the icon decorative, never a second
button. Inline SVG provides a consistent arrow shape; a text arrow also works.

Use `ct-aperture-line` on spans inside a single heading, with whitespace between
the spans. The offset follows the reading direction and allows wrapping. Split
rules are decorative composition breaks, not semantic `hr` replacements.

## Design constraints

- Use one dominant mark per composition. Smaller repetitions establish continuity.
- Keep the seam and offset proportional. Do not stretch the individual halves.
- Use typography and space for hierarchy. Reserve cobalt for the main focal area.
- Keep content text out of decorative cutouts. Let long labels and translated copy wrap.
- Keep the giant display for short headlines. Use the heading scale for longer text.
- Repeat the seam and offset in a few purposeful places. Avoid turning every edge into a motif.
- Keep supporting panels restrained; the default four-pixel radius leaves the oval as the dominant curve.

Colors resolve from cobalt/graphite primitives through `color.aperture.*` semantic
roles to `aperture.*` component tokens. The heading family uses the local Arial /
Helvetica / sans-serif stack, independent of Construct's optional Lato font import.
Customize token sources and regenerate outputs with `npm run build`.

## Accessibility and verification

The token pipeline gates ink and secondary text against paper and surface, and
poster text against its accent, at 4.5:1 in each theme. Keyboard focus uses a visible
outline; selected radios also change border and weight. Actions and theme labels
have at least 44-pixel targets. Radio groups and disclosures use browser-native
keyboard behavior. Hover motion is disabled for reduced-motion preferences.
Forced colors preserves the silhouette with system colors, control borders and
an underlined selected radio label.

Storybook includes interaction and automated accessibility checks. Touch and
forced-colors suites cover the new controls. These are bounded automated checks,
not a claim that any consuming page is completely WCAG conformant.
