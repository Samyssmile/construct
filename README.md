# Accessful Design System (v0)

## Zielbild
Ein konsistentes, professionelles Enterprise-Design, das in Angular, React und Svelte identisch wirkt.

## Umsetzungsplan (Start bei 0)
1) Design-Tokens definieren (Farben, Typografie, Spacing, Radius, Shadow, Motion, Z-Index, Breakpoints).
2) Tokens in allen Apps nutzbar machen (CSS Variables, optional Build-Step fuer TS/JSON).
3) Foundations dokumentieren (Typo-Regeln, Layout-Raster, Accessibility-Regeln).
4) Basis-Komponenten bauen (Button, Input, Select, Table, Card, Modal, Toast).
5) Storybook/Doku aufsetzen pro Framework (oder zentral mit Package-Links).


## Ordner
- `tokens/`: Design Tokens (primitiv + semantisch + CSS Variables)
- `foundations.css`: Reset, Typografie-Defaults, Layout-Utilities, A11y-Grundlagen
- `components/`: Framework-unabhaengige Komponenten-Styles + Usage-Notes

## Usage (Foundations)
Import once per app as a global stylesheet:
```css
@import "../design/foundations.css";
```

## Usage (Components)
Import after foundations:
```css
@import "../design/foundations.css";
@import "../design/components/components.css";
```

## Storybook (Components)
From `design/`:
```bash
npm run storybook
```

Build static Storybook:
```bash
npm run storybook:build
```

## Doku
- Guidelines (Do/Don'ts + A11y): `docs/guidelines.md`

## Token build (JSON -> CSS/TS/JSON)
From repo root:
```bash
node scripts/build-tokens.mjs
```

From `design/`:

```bash
npm run build
```

Check if outputs are up to date:
```bash
node scripts/build-tokens.mjs --check
```

From `design/`:
```bash
npm run check
```

## Token-Versionierung (SemVer)
- MAJOR: Entfernen/Renamen von Tokens oder Aenderungen an bestehenden Token-Werten (Farben, Typo, Spacing, Radius, etc.).
- MINOR: Neue Tokens, neue Skalen oder neue semantische Aliase, ohne bestehende Werte zu aendern.
- PATCH: Keine Token-Value-Aenderungen (nur Build, Doku, Storybook, interne Pflege).

## Versionierung & Release (intern)
1) Version in `design/package.json` hochziehen.
2) `npm run build` in `design/` ausführen.
3) Änderungen committen und taggen.
4) Optional: Paket veröffentlichen (falls gewünscht, `private` entfernen).
