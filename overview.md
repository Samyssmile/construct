# Design System Overview

## Was ist das hier?
Dies ist das **Accessful Design System** - ein zentrales Design-Token- und Komponenten-Repository für alle Accessful Web-Anwendungen (Angular, React, Svelte).

**Hauptziel**: Einheitliches, barrierefreies Enterprise-Design über alle Frameworks hinweg.

---

## Ordnerstruktur

```
design/
├── tokens/                     # Design Tokens (Farben, Spacing, Typografie, etc.)
│   ├── primitives.json         # Basis-Werte (Palette, Größen)
│   ├── semantic.light.json     # Semantische Mappings (primary, danger, etc.)
│   ├── tokens.css              # [GENERIERT] CSS Custom Properties
│   ├── tokens.json             # [GENERIERT] Resolved JSON
│   └── tokens.ts               # [GENERIERT] TypeScript Exports
│
├── components/                 # Framework-agnostische Komponenten-Styles
│   ├── components.css          # Alle Component-Styles (27KB)
│   └── README.md               # Usage-Dokumentation mit HTML-Beispielen
│
├── stories/                    # Storybook Stories für Komponenten-Demo
│   ├── Button.stories.js
│   ├── FormControls.stories.js
│   ├── SelectionControls.stories.js
│   ├── CardAndTable.stories.js
│   ├── DataTable.stories.js
│   ├── DataTableSimple.stories.js
│   ├── Datepicker.stories.js
│   ├── Navigation.stories.js
│   └── Overlays.stories.js
│
├── .storybook/                 # Storybook Konfiguration
│   ├── main.js                 # Config (HTML-Vite, A11y Addon)
│   ├── preview.js              # Global Styles & Decorators
│   └── vitest.setup.js         # Test Setup
│
├── scripts/                    # Build Scripts
│   └── build-tokens.mjs        # Token-Generator (JSON → CSS/TS/JSON)
│
├── docs/                       # Design Guidelines
│   └── guidelines.md           # Do/Don'ts, A11y-Regeln, Keyboard-Patterns
│
├── foundations.css             # Global Reset, Typo, Layout-Utilities
├── package.json                # NPM Scripts & Dependencies
├── README.md                   # Hauptdokumentation
├── PLAN.md                     # Umsetzungsplan & Status
└── AGENTS.md                   # Agent-Guidelines für AI-Assistenten
```

---

## Verfügbare Komponenten

### Basis-Komponenten
- **Button** (6 Varianten: Primary, Secondary, Ghost, Outline, Danger, Accent + 3 Größen)
- **Input** (Text, Email, Password, Search mit Icon-Support)
- **Select** (Native Dropdown)
- **Textarea** (Mehrzeiliges Textfeld)
- **Checkbox** (Einzelne Checkbox)
- **Radio** (Radio Button Group)
- **Switch** (Toggle Switch)

### Komplexe Komponenten
- **Card** (Header, Body, Footer + Interactive Variant)
- **Table** (Standard, Striped, Compact)
- **Data Table** (mit Header, Toolbar, Filters, Footer, Pagination, Sorting)
- **Modal** (Dialog mit Backdrop)
- **Toast** (Notifications mit Variants: success, error, info, warning)
- **Tabs** (Tab-Navigation mit Panels)
- **Dropdown** (Action Menu)
- **Pagination** (Seitennavigation)
- **Breadcrumbs** (Pfadnavigation)
- **Datepicker** (Kalender-Popup mit Datum-Auswahl)

---

## Wichtige NPM Scripts

```bash
npm run build              # Tokens generieren (JSON → CSS/TS/JSON)
npm run check              # Prüfen ob Token-Outputs aktuell sind (für CI)
npm run storybook          # Storybook Dev Server starten (Port 6006)
npm run storybook:build    # Statisches Storybook bauen
```

---

## Wie funktioniert das System?

### 1. Design Tokens (Single Source of Truth)
- **Source**: `tokens/primitives.json` + `tokens/semantic.light.json`
- **Build**: Script generiert daraus CSS Variables, JSON und TypeScript
- **Nutzung**: Apps importieren `tokens/tokens.css` für CSS Variables

### 2. Foundations
- Globales Stylesheet mit Reset, Typografie, Layout-Utilities
- Import: `@import '../design/foundations.css'`

### 3. Components
- Framework-agnostische CSS-Klassen mit BEM-Naming (`af-button`, `af-card__header`)
- State-Management über Data-Attributes (`data-state="open"`) und ARIA
- Import: `@import '../design/components/components.css'`

### 4. Framework-Implementierungen
- **CSS/HTML**: Direkt nutzbar (siehe `components/README.md`)
- **Angular**: Noch nicht implementiert
- **React**: Noch nicht implementiert
- **Svelte**: Noch nicht implementiert

---

## Accessibility First

Das Design System hat höchste Priorität auf Barrierefreiheit:
- Semantisches HTML
- ARIA-Attribute wo nötig
- Volle Tastatursteuerung
- Fokus-Management
- Kontrast-Standards
- Screen-Reader Support
- Live-Regions für Notifications
- Respektiert `prefers-reduced-motion`

Details siehe: `docs/guidelines.md`

---

## Aktueller Status (laut PLAN.md)

**Fertig:**
- Design Tokens + Build-Pipeline
- Foundations Stylesheet
- 16 Komponenten (CSS + HTML Patterns)
- Storybook Dokumentation

**Nächste Schritte:**
- Framework Libraries (Angular, React, Svelte)
- Visuelle QA & Regression Tests
- Fehlende Components (Badge, FileUpload, Alert, LoadingSpinner, etc.)

---

## Weitere Infos

- **Hauptdoku**: `README.md`
- **Umsetzungsplan**: `PLAN.md`
- **Guidelines**: `docs/guidelines.md`
- **Component Usage**: `components/README.md`
- **Token Details**: `tokens/README.md`
- **Storybook**: `npm run storybook` → http://localhost:6006
