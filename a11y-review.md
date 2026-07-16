# Web-Accessibility-Review — Construct Design System

> **STATUS: BEHOBEN (2026-07-16).** Alle unten dokumentierten Findings wurden am selben Tag nach Best Practice umgesetzt — Details in [`a11y-fixes.md`](a11y-fixes.md). Kritische/schwerwiegende Fixes einzeln, systematische Muster flächendeckend (Forced-Colors-Blöcke, Coarse-Pointer-Bumps, scrollIntoView-Policy, 88 statt 57 Kontrast-Gate-Paare, neues `high-contrast-dark`-Theme, rem-Type-Scale). Die rem-Migration und die Border-Token-Anpassungen sind **Breaking Changes** → nächstes Release sollte ein Major sein.

**Datum:** 2026-07-16 · **Stand:** v2.1.1, Branch `main` · **Maßstab:** WCAG 2.2 AA + WAI-ARIA APG + Construct-eigene Policies (44×44 Coarse Pointer, Forced Colors, Reduced Motion)

**Methodik:** Vier unabhängige Tiefen-Audits (Behaviors/ARIA, Komponenten-CSS, Tokens/Kontrast/Themes, Stories/Doku/Testkonfiguration) über den kompletten Quellcode. Alle als kritisch/schwerwiegend eingestuften Funde wurden anschließend unabhängig am Code verifiziert; Kontrast-Ratios wurden mit eigener WCAG-Luminanz-Berechnung auf den aufgelösten Hex-Werten nachgerechnet. Zusätzlich liefen alle Projekt-Gates: `npm run check` ✅ (57 Kontrastpaare × 3 Themes), `npm test` ✅ (43 Behavior-, 358 Storybook-Tests mit axe im Error-Modus, Touch- und Forced-Colors-Suiten).

---

## Gesamturteil

Construct ist **deutlich über dem Durchschnitt** dessen, was Design Systeme an Accessibility liefern: Kontrast ist ein harter Build-Gate mit korrekter Mathematik, der Tooltip-Controller erfüllt WCAG 1.4.13 vollständig (selten), axe läuft im Error-Modus über alle 358 Stories ohne eine einzige deaktivierte Regel, und die 44×44-Policy ist strukturell im Token-Layer verankert und browser-getestet.

Trotzdem fand das Review **1 kritischen und 10 schwerwiegende Funde** plus vier systematische Lücken — alle in Bereichen, die die automatischen Gates prinzipbedingt nicht sehen (Forced-Colors-Rendering, Kontrast-Paarungen außerhalb des Validators, Tastatur-Scroll-Verhalten, IME-Eingabe). Kein Befund ist architektonisch; alles ist mit vorhandenen Mustern aus dem eigenen Repo behebbar.

**Fundübersicht:** 1 kritisch · 10 schwerwiegend · ~30 moderat · ~35 geringfügig

---

## Kritisch

### K1 — Dark Theme: Skip-Link und Datepicker-Auswahl sind unlesbar (1.14 : 1)

`components/skip-link.css:14-15` und `components/datepicker.css:120, 161, 167, 210, 259` setzen `color: var(--color-text-inverse)` auf `background: var(--color-brand-primary)`. Im Dark Theme ist `brand.primary` = `stone.100` (`#F1F0EB`, fast weiß) und `text.inverse` = `stone.0` (`#FFFFFF`) → **Kontrast 1.14 : 1** (selbst nachgerechnet, verifiziert). Der Skip-Link — selbst ein Accessibility-Feature — und die ausgewählten Tage/Monate/Jahre im Datepicker sind im Dark Theme praktisch weiß auf weiß.

Der Validator prüft `text.onPrimary` auf `brand.primary` (bestanden), aber diese Komponenten benutzen das falsche Token `text.inverse`, das am Gate vorbeiläuft.

**Fix (trivial):** In beiden Dateien `--color-text-inverse` → `--color-text-on-primary` tauschen. Das Paar ist in allen drei Themes bereits validiert. — *WCAG 1.4.3*

---

## Schwerwiegend

### S1 — Combobox: kein IME-Guard, Enter zerstört komponierten Text
`behaviors/combobox.js:331-350` — `onInputKeyDown` prüft nicht `event.isComposing`/keyCode 229. Ablauf für CJK/IME-Nutzer: Tippen öffnet die Listbox und aktiviert die erste Option → **Enter zum Bestätigen der IME-Komposition** wird abgefangen (`preventDefault` + `select`) und `input.value` mit dem Options-Label überschrieben; Pfeiltasten während der Kandidaten-Navigation werden ebenfalls gekapert. Die geteilte Typeahead-Logik hat den Guard bereits (`behaviors/internal/dom.js:284-291`) — nur dieser Handler wurde vergessen. **Fix:** `if (event.isComposing || event.keyCode === 229) return;` als erste Zeile. — *WCAG 2.1.1* ✔ verifiziert

### S2 — Inline-Combobox (Command-Palette): Fokus unsichtbar
`components/combobox.css:372-375` entfernt `outline` und Border-Farbe bei `:focus-visible` — **ohne Ersatz**. Die `--multi`-Variante ersetzt korrekt über `:focus-within` auf dem Wrapper (Zeile 314), `--inline` hat keinerlei `:focus-within`-Regel (per Grep über die ganze Datei bestätigt). **Fix:** `:focus-within`-Ring auf `.ct-combobox--inline`. — *WCAG 2.4.7* ✔ verifiziert

### S3 — Overlay-Sidebar: unsichtbar, aber fokussierbar
`components/sidebar.css:35-52` — die `--over`-Variante wird geschlossen nur per `translate: -100%` aus dem Viewport geschoben; `--side` (Z. 31) und `--push` (Z. 57) setzen `visibility: hidden`, `--over` nicht. Geschlossene Overlay-Sidebar-Inhalte bleiben in der Tab-Reihenfolge und im Accessibility-Tree; Tastaturfokus wandert in unsichtbaren Off-Screen-Inhalt. **Fix:** `visibility: hidden` mit Transition-Delay wie in `drawer.css:40-56`. — *WCAG 2.4.3/2.4.7* ✔ verifiziert

### S4–S6 — Forced Colors: Switch, Radio und Progress-Bar verschwinden komplett
Kein `forced-colors`-Block in diesen Dateien (per Grep bestätigt):
- **Switch** (`components/switch.css`): Track = Background + transparente Border, Knopf = Background + Schatten → in Forced Colors wird alles auf Canvas gezwungen, Schatten entfallen → **der ganze Schalter ist unsichtbar, An/Aus nicht unterscheidbar**.
- **Radio** (`components/checkbox.css:57-76`): Der Checked-Punkt ist ein Background-`::before` → **ausgewählte Radios sehen unausgewählt aus** (die Checkbox-Häkchen sind border-gezeichnet und überleben).
- **Progress-Bar** (`components/progress-bar.css:3-21`): Track und Füllung sind Background-only ohne Border → **der Balken ist komplett unsichtbar** (Meter macht es in `meter.css:173-182` vor: Border + `SelectedItem`).

**Fix:** FC-Blöcke nach den vorhandenen Vorbildern (meter, navbar, status, chart). — *WCAG 1.4.1/1.4.11 in FC-Kontext*

### S7 — Dark Theme: Danger-Text auf Karten fällt durch
`state.danger` (`#E4647C`) wird als Textfarbe genutzt: destruktive Dropdown-Items (`dropdown.css:149`; Panel liegt auf `bg-elevated`), Feldfehler (`field.css:19`), File-Upload (`file-upload.css:109`). Auf `bg.elevated` (`#4B473E`) = **2.82 : 1**, auf `bg.surface` = **3.96 : 1** (nachgerechnet). Das dafür gedachte Token `stateText.danger` (6.0 : 1) existiert, wird hier aber nicht verwendet. **Fix:** für Text-Rollen `--color-state-danger-text` verwenden; Paar „state.* als Text auf elevated" in den Validator aufnehmen. — *WCAG 1.4.3* ✔ verifiziert

### S8 — Light Theme: Progress-Füllung vs. Track 2.59 : 1
`progress-bar.css:6-19` — Accent-Füllung (`#F4581C`) auf `bg.muted`-Track (`#E4E2DB`) = **2.59 : 1** (nachgerechnet), Track ohne Border → der Fortschrittsstand ist als UI-Komponente unter 3 : 1. **Fix:** Track-Border ergänzen und/oder Paar `brand.accent vs bg.muted` @3:1 in den Gate aufnehmen. — *WCAG 1.4.11*

### S9 — Alle Modal-Stories setzen `role="dialog"` auf den Backdrop
`stories/Overlays.stories.js:93, 123, 193, 277-353` (7 Renders) — `role="dialog" aria-modal="true" aria-labelledby` sitzt auf dem äußeren `.ct-modal` (dem Backdrop-Container) statt auf `.ct-modal__dialog`. Das widerspricht der eigenen Doku (`stories/docs/Accessibility.mdx:138`: „…on the inner dialog element, **not its backdrop**"), dem README, dem React-Beispiel und dem Controller (der die Rolle auf das `dialog`-Element setzt). Stories sind das meistkopierte Artefakt; wer Story-Markup + Controller kombiniert, bekommt zwei verschachtelte Dialoge, der innere unbenannt. **Fix:** Attribute in allen 7 Renders auf `.ct-modal__dialog` verschieben (Drawer-Stories machen es korrekt). — *WCAG 1.3.1/4.1.2* ✔ verifiziert

### S10 — Combobox-Story: `aria-activedescendant` zeigt auf die falsche Option — und der Test fixiert den Bug
`stories/Combobox.stories.js:79` — hartkodiert `pg-combo-opt-3` (Dragon Fruit), während Option Index 2 (Cherry) selektiert und `data-highlighted` ist; die Play-Function (Z. 121) assertet den falschen Wert. Screenreader melden eine andere Option als visuell markiert. **Fix:** `pg-combo-opt-2` (Markup + Assertion), besser: ID aus demselben Index ableiten. — *WCAG 4.1.2* ✔ verifiziert

---

## Systematische Muster (moderat)

### M-A — Forced-Colors-Abdeckung endet genau dort, wo custom-gezeichneter State lebt
Nur 8 von ~50 Komponentendateien haben FC-Blöcke. Über S4–S6 hinaus gehen in Forced Colors verloren: aktiver Tab (`tabs.css:66-69, 136-140`), gedrückte Toggle-Group-Segmente (`toggle-group.css:68-72`), `aria-current`-Seite in der Pagination (`pagination.css:74-79`), selektierte Datepicker-Tage/Ranges (`datepicker.css:118-169`), die „Datum"-Kante als `box-shadow` in Sidebar/List/Card, sowie **alle Mask-Icons** (Select-Chevron `select.css:6-21` — der native Pfeil ist per `appearance:none` entfernt —, Tabellen-Sortierpfeile `table.css:74-98`, Chip-Icons). Mask-Technik ist FC-kompatibel, wenn die Füllfarbe eine Systemfarbe ist (`background-color: ButtonText`). Vorbilder im Repo: `navbar.css:695-698`, `meter.css:173-182`, `chart.css:349-369`, `status.css:99-107`.

### M-B — 44×44-Coarse-Policy: Lücken bei Menüs, Tabs, Rows und Sub-Buttons
Die Token-Ebene bumpt `control-height-sm/md/calendar-day` (`_shared.css:111-117`) — Formcontrols, Buttons, Chips sind sauber. Durchs Raster fallen: Dropdown-Items (≈32 px, `--sm` 24 px), Select-Menu-/Combobox-Optionen (≈36/28 px), Tabs (≈36/28 px), Accordion-Header (≈36 px), Tree-Rows (32/24 px), Toolbar-/Navbar-Links (≈32/28 px), Pagination `--sm` (28 px, nutzt das nicht gebumpte `control-height-xs`), Combobox-Trigger (24 px) und **Chip-Remove: 24 px, in `--sm` nur 16 px** — Letzteres verletzt sogar WCAG 2.5.8 (24-px-Minimum) auf Fine-Pointer. Fix-Muster existiert: Pseudo-Element-Hit-Area wie `checkbox.css:29-36`.

### M-C — Fokus kann unsichtbar aus dem Viewport laufen (2.4.11)
Zwei Ursachen, ein Thema:
1. **CSS:** Sticky/Fixed-Chrome existiert (Navbar, Toolbar, Banner, App-Shell-Header), aber im gesamten Layer gibt es **kein einziges `scroll-margin`/`scroll-padding`** (per Grep bestätigt) — fokussierte Elemente scrollen unter fixe Leisten.
2. **Behaviors:** `focusElement` erzwingt `preventScroll: true` (`dom.js:132`) ohne kompensierendes `scrollIntoView` beim Focus-Trap-Wraparound im Modal (das Standard-Modal ist mit `max-height: 85vh; overflow: auto` ein Scroll-Container), beim Dropdown-Highlight (`dropdown.js:79-87`) und beim Roving Focus in überlaufenden Tablists. Select-Menu/Combobox machen es richtig (`scrollIntoView({block:'nearest'})`) — dieselbe Policy auf die übrigen Call-Sites ausdehnen.

### M-D — Dialog-Dismissal-Robustheit
1. Backdrop schließt auf `click`: Text-Selektion, die im Modal beginnt und auf dem Backdrop endet, schließt den Dialog (Click-Retargeting auf den gemeinsamen Ancestor = Container = Backdrop) → Datenverlust-Risiko, trifft besonders motorisch eingeschränkte Nutzer (`dialog-controller.js:285-296`). **Fix:** auf `pointerdown`+Ziel-Tracking umstellen.
2. Eine Geste schließt zwei Ebenen: Popups schließen auf `pointerdown`, der Modal-Backdrop auf `click` — Backdrop-Klick bei offenem Dropdown im Modal schließt beide.
3. Escape ohne `isComposing`-Guard in Dialog, Popup-Layer und Tooltip: Esc zum Abbrechen einer IME-Komposition schließt stattdessen das Modal (gleiches Muster wie S1).

### M-E — Kontrast-Governance: sehr guter Gate, definierte Lücken
Der Validator (57 Paare/Theme, harter Build-Fail, korrektes Alpha-Compositing) deckt nicht ab: state-Farben als Text auf elevated/surface (→ S7), Text auf `stateSurface` (heute alles bestanden, aber ungepinnt für Custom Themes), Füllungen vs. Tracks (→ S8), `stateBorder.*` (fällt breit unter 3 : 1: 1.40–2.51 — vertretbar, da Fill+Icon+Text redundant, aber unvalidiert) und `border.subtle`. Letzteres ist im Dark Theme **hex-identisch mit `bg.elevated`** (1.00 : 1) — Card-Borders auf erhöhten Flächen sind unsichtbar. Zudem dokumentiert der `datum.css`-Header (Z. 9-11) `accent-active` fälschlich als „orange.700, ≥4.5:1 als Text" — im Light Theme ist es orange.300 (2.08 : 1); der Code vermeidet die Falle, der Kommentar lädt zu ihr ein.

### M-F — High Contrast & Typografie
- HC aktiviert sich automatisch via `prefers-contrast: more` (gut, dokumentiert), **aber**: jedes gepinnte `data-theme` deaktiviert die Automatik still; es gibt **kein dunkles HC** — Dark-Nutzer mit Kontrastwunsch bekommen ein helles UI; `border.subtle` bleibt in HC bei 2.19 : 1 und `bg.muted` vs. Canvas bei 1.05 : 1 (Code-Blöcke/Tracks verschwinden fast).
- Die komplette Type-Scale ist in **px** (`build-tokens.mjs:533-546`): Seiten-Zoom funktioniert (1.4.4 erfüllbar), aber Browser-Schriftgrößen-Präferenzen der Nutzer werden systemweit ignoriert; rem-Tokens wären die nachhaltige Lösung. `--font-size-2xs` = 10 px wird für Badge-`--sm` und Dense-List-Text real verwendet.

### M-G — Stories widersprechen den eigenen Guidelines (Kopiervorlagen-Risiko)
- `aria-disabled="true"` **allein** auf nativen Buttons in Pagination/Chip/Card-Stories — `docs/guidelines.md:164-165` verbietet genau das („Use the native `disabled` attribute"); die Disabled-Link-Card behält sogar ihr `href` und navigiert weiter.
- Radio-/Checkbox-Gruppen ohne `fieldset/legend` bzw. `radiogroup`-Label (`SelectionControls.stories.js:61-112` und `components/README.md:171-178`) — Nutzer hören „Premium", aber nie, worum es geht.
- Sidebar-Stories: Navigation ohne `<nav>`-Landmark (nur Liste in `aside`).
- Tooltip-Stories dokumentieren das CSS-only-Pattern ohne Hinweis, dass für WCAG 1.4.13 (Esc-Dismiss) der Controller nötig ist — der Controller kann es längst.
- FileUpload-Story: Fehlertext ohne `aria-describedby`/`aria-invalid`/Live-Region; der zugehörige „Bug check" im Test prüft effektiv nichts (`if (describedBy && errorEl.id)` — beide fehlen).
- Datepicker-Story: `role="gridcell"` direkt auf `<button>` überschreibt die Button-Rolle („23, gridcell" ohne Aktions-Affordance).
- Dropdown-Positions-Demo: vier unbenannte Menüs ohne `aria-label`/`aria-controls` (Haupt-Stories sind korrekt).

### M-H — Behaviors: APG-Abweichungen mit Nutzerwirkung
- **Toggle-Group verstümmelt Radio-Markup:** `aria-checked` wird beim Init gelesen, aber nie geschrieben; Items werden zwangsweise `role="button"`, ein `radiogroup`-Root bleibt stehen → invalides Pattern + veralteter State (`toggle-group.js:83-114`).
- **Select-Menu:** Tab schließt ohne die markierte Option zu committen (APG Select-Only Combobox verlangt Commit) — Tastatur- und Mausnutzer bekommen unterschiedliche Ergebnisse (`select-menu.js:213-216`).
- **Popover:** Trigger-Aktivierung (`toggle()`) ignoriert `initialFocus` — Tastaturnutzer bekommen keinen Fokus-Einstieg, obwohl konfiguriert (`popover.js:137-140` vs. `176-188`).
- Modal: kein `inert`/`aria-hidden` auf Hintergrund (nur `aria-modal` — heute APG-üblich, Alt-SR-Risiko); `destroy()` bei offenem Dialog stellt den Fokus nicht wieder her.

### M-I — Reduced Motion: Lücke bei selektiven Imports
Global-Kill-Switch (`foundations.css:297-306`) + Blöcke in ~30 Dateien — aber `standalone/core.css` importiert `foundations.css` **nicht**: Wer nur checkbox/switch selektiv importiert, bekommt deren Transitions trotz `prefers-reduced-motion` (die Dateien haben keine eigenen Reduce-Blöcke). Außerdem: Indeterminate-Progress wird unter Reduce zum statischen 30-%-Balken — liest sich als „hängt bei 30 %".

---

## Geringfügig (Auswahl, ~35 gesamt)

Vollständige Listen mit file:line stehen in den Teilbericht-Tabellen; die wichtigsten Kategorien:

| Bereich | Beispiele |
|---|---|
| Namen/Labels | Generische „Remove"-Labels in FileUpload/Chip-Playground; 2 unbenannte Tablists; `aria-label` auf generischen `div`/`span` (App-Shell-State-Demos, Chart-Empty-Sparkline); „current page" doppelt annonciert |
| ARIA-Details | `<kbd>`-Shortcuts fließen in Menuitem-Namen (→ `aria-keyshortcuts`); Tree-Badge-Counts `aria-hidden` (Info geht AT verloren); Hint-ID fällt bei `aria-invalid` aus `aria-describedby`; `display:contents`-Links (List-Story) |
| Behaviors-Polish | Kein Printable-Char-Open am Dropdown-Trigger; Select-Menu-Wrap + Sofort-Commit bei Typeahead im geschlossenen Zustand; Combobox ArrowUp-Open markiert erste statt letzte Option; Tooltip akzeptiert nicht-fokussierbare Trigger stumm; Dialog-Name (aria-labelledby) wird nicht erzwungen/gewarnt |
| CSS-Polish | Toast/Banner `data-state="closed"` nur Opacity (bleibt fokussierbar); Tree-Row-Actions auf Touch unsichtbar, aber hit-testbar; Toggle-Group versteckt Scrollbars komplett; CSS `content: ' *'` als Pflichtfeld-Marker; Navbar/Toolbar mit fixem `height` statt `min-height` (Clipping bei Textvergrößerung) |
| Charts/Sonstiges | Serienfarben paarweise bis 1.00 : 1 Luminanz (pink.500/red.500 auch farbton-nah — CVD); deutsche Chart-Texte ohne `lang="de"`; Chart-Tabellen-Toggle 24 px ohne Coarse-Bump; tokens-only-Konsumenten bekommen kein `color-scheme` |

---

## Was richtig gut ist

1. **Kontrast als harter Build-Gate** — korrekte WCAG-Mathematik inkl. Alpha-Compositing, Ablehnung nicht-opaker Hintergründe, 57 Paare × Themes; Custom Themes laufen durch denselben Gate und können eigene Paare deklarieren.
2. **Paar-First-Token-Design** (`onPrimary`/`onAccent`/`stateText`-Triaden) macht sichere Kombinationen zum Default; Theme-Scopes deklarieren nachweislich den kompletten 160-Token-Kontrakt neu — leak-freie Theme-Inseln.
3. **Tooltip-Controller vollständig WCAG-1.4.13-konform** (Esc ohne Fokusverschiebung auch bei Hover-only, Hoverable, Persistent) **mit funktionierendem Touch-Pfad** — das haben die wenigsten Systeme.
4. **Overlay-Stack mit Event-Konsum**: Esc/Outside-Click trifft exakt die oberste Ebene, portal-fähige Focus-Traps, Transaktions-Rollback bei werfenden Callbacks, idempotentes `destroy()`.
5. **Combobox-Live-Region** (role=status, Count-Messages, `formatStatus`-Hook) — echtes WCAG 4.1.3, kein Feigenblatt.
6. **Testkonfiguration vorbildlich**: axe im Error-Modus über alle 358 Stories, **null deaktivierte Regeln, null Opt-outs**, plus echte Touch- und Forced-Colors-Browser-Kontexte (wenn auch mit nur 4 bzw. 3 Tests ausbaufähig schmal).
7. **44×44-Policy strukturell** im Token-Layer + Pseudo-Hit-Areas + Browser-Test; jedes `:hover` hinter `@media (hover: hover)`.
8. **Charts mit vollem A11y-Vertrag**: `role="img"` + `<title>/<desc>`, immer präsente Daten-Tabellen-Alternative, dokumentierte Forced-Colors-Strategie.
9. **Native-first-Haltung**: `<details>/<summary>`-Accordion, dokumentierte, begründete Entscheidungen als Code-Kommentare (Status-Wording-Vertrag, AA-nachgedunkeltes Banner-Grün, Datum-Kontrastvertrag).
10. **RTL- und Logical-Properties-Disziplin** durchgängig; IME-sichere Typeahead-Utility; SSR-Guards; akkurate TypeScript-Definitionen ohne Drift.

---

## Empfohlene Fix-Reihenfolge

**Sofort (je < 30 min, hohe Wirkung):**
1. K1: `text-inverse` → `text-on-primary` in `skip-link.css` + `datepicker.css`
2. S1 + M-D.3: `isComposing`-Guard in `combobox.js:331` sowie in den drei Esc-Handlern (dialog-controller, popup-layer, tooltip)
3. S10: `pg-combo-opt-2` in Story + Assertion
4. S2: `:focus-within`-Ring für `.ct-combobox--inline`
5. S3: `visibility: hidden` für `.ct-sidebar--over` (Muster aus drawer.css)
6. S9: Modal-Rolle in 7 Story-Renders auf `.ct-modal__dialog` verschieben

**Kurzfristig:**
7. S4–S6 + M-A: Forced-Colors-Blöcke (Switch, Radio, Progress, Tabs, Toggle-Group, Pagination, Datepicker, Mask-Icons, Datum-Kante) — Vorbilder: meter/navbar/status/chart
8. S7/S8 + M-E: `stateText.*` für Text-Rollen; Validator-Paare ergänzen (state-as-text auf elevated, fill-vs-track, border.subtle); dark `border.subtle` von `bg.elevated` trennen; datum.css-Kommentar korrigieren
9. M-C: gemeinsame `scrollIntoView({block:'nearest'})`-Policy für Trap/Highlight/Roving + `scroll-margin` für Sticky-Chrome
10. M-B: Coarse-Bumps für Menü-Optionen, Tabs, Tree-Rows, Accordion, Chip-Remove (16 px!), Pagination `--sm`
11. M-D.1/2: Backdrop-Dismissal auf `pointerdown` mit Ziel-Tracking

**Mittelfristig:**
12. M-G: Story-Sweep (disabled-Semantik, fieldset/legend, nav-Landmark, FileUpload-Fehlerverknüpfung, Datepicker-Gridcell, Tooltip-Hinweis)
13. M-H: Toggle-Group-Radio-Semantik, Select-Menu-Tab-Commit, Popover-initialFocus
14. M-F: dunkles High-Contrast-Theme; rem-Migration der Type-Scale (Breaking → Major)
15. M-I: Reduce-Blöcke für checkbox/switch/_shared (selektive Imports); Touch-/FC-Testsuiten ausbauen

---

*Erstellt durch vier parallele Tiefen-Audits mit anschließender unabhängiger Verifikation der kritischen Funde (Code-Inspektion + eigene Kontrastberechnung). Mit ✔ verifiziert markierte Funde wurden direkt am Quellcode bestätigt.*
