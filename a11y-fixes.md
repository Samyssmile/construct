# A11y-Fixes — Umsetzung des Reviews vom 2026-07-16

Alle Findings aus [`a11y-review.md`](a11y-review.md) wurden nach Best Practice umgesetzt. Referenz: Finding-IDs aus dem Review.

## Kritisch & Schwerwiegend

| ID | Fix |
|---|---|
| K1 | `skip-link.css` + `datepicker.css`: `--color-text-inverse` → `--color-text-on-primary` (validiertes Paar in allen Themes). Skip-Link-Fokusring zusätzlich auf `on-primary` umgestellt (der orange Ring hatte 2.50:1 auf dem hellen Dark-Theme-Primary). |
| S1 | `behaviors/internal/dom.js`: neuer `isComposingEvent()`-Helper; Guard in `combobox.js` (`onInputKeyDown`). |
| S2 | `combobox.css`: `:focus-within`-Ring für `--inline` (Muster der `--multi`-Variante). |
| S3 | `sidebar.css`: `--over` bekommt `visibility: hidden` geschlossen / `visible` offen (Drawer-Muster). |
| S4–S6 | Forced-Colors-Blöcke für Switch (ButtonText-Borders, SelectedItem-Track), Radio-Punkt (SelectedItem + `forced-color-adjust: none`), Progress-Bar (Border + SelectedItem-Füllung, Meter-Muster). |
| S7 | Danger-**Text**-Rollen nutzen `--color-state-danger-text` (field, dropdown inkl. Outline, file-upload); dark `stateText.danger` auf red.100 angehoben (4.28 → 5.6+ auf elevated). Neue Gate-Paare: stateText × canvas/surface/elevated. |
| S8 | `progress-bar.css`: Füllung = neues Token `--color-brand-accent-strong` (light orange.600 = 3.20:1 auf muted), Track mit Border; Gate-Paare accentStrong × canvas/surface/muted. |
| S9 | Alle 7 Modal-Story-Renders: `role="dialog"`/`aria-modal`/`aria-labelledby` auf `.ct-modal__dialog` verschoben. |
| S10 | Combobox-Story: `PG_HIGHLIGHTED_INDEX` als Single Source of Truth; Play-Assertion prüft strukturell `activedescendant === highlighted.id`. |

## Systematische Muster

- **M-A Forced Colors**: FC-Blöcke zusätzlich für Tabs (aktiver Indikator), Toggle-Group (SelectedItem), Pagination (`aria-current`-Outline), Datepicker (Auswahl/Range inkl. Monat/Jahr), Select-Chevron/Sortierpfeile/Chip-Icons (Mask + Systemfarbe), Datum-Kante in Sidebar/List/Card (Border statt Box-Shadow), Dropdown-Radio-Punkt, List-Skeleton.
- **M-B Touch**: Coarse-Bumps (44px) für Pagination `--sm`, Chip-Remove (fine ≥24px + Coarse-Hit-Area), Dropdown-Items, Select-Menu-/Combobox-Optionen, Tabs, Accordion, Tree-Rows (inkl. dense), Toolbar-/Navbar-Links, Combobox-Trigger, Banner-`--compact`-Close, Tree-Chevron, Datepicker-Tage; Switch/Slider fine ≥24px. Touch-Testsuite von 4 auf 6 Tests erweitert.
- **M-C Fokus sichtbar**: `focusIntoView()`-Helper (Fokus + `scrollIntoView nearest`) in Focus-Trap, Dialog-Initial-/Recovery-Fokus, Dropdown-Highlight, Tabs-Roving, Toggle-Group; `html { scroll-padding-block: var(--ct-scroll-offset-*) }`-Vertrag in foundations + Shell-Scroll-Padding; dokumentiert in guidelines.md.
- **M-D Dialog-Dismissal**: Backdrop schließt nur noch bei Pointer-Down **und** -Up auf dem Backdrop (Click-Retargeting-/Text-Selektions-Problem behoben); Pointer-Down läuft durch den Overlay-Stack (eine Geste schließt nicht mehr Popup + Modal); `isComposingEvent`-Guards in Dialog-, Popup- und Tooltip-Escape.
- **M-E Kontrast-Governance**: Gate von 57 auf **88 Paare/Theme** erweitert (stateText×bg, text×stateSurface, Fills×muted, accentStrong×bg, border.strong×bg, placeholder×control-bg). Dark `border.subtle` ≠ `bg.elevated` (stone.600), dark `border.strong` auf stone.300 (Hierarchie war invertiert), light `border.strong` stone.600; `datum.css`-Kontrastvertrag korrigiert.
- **M-F Themes/Typo**: Neues Built-in-Theme **`high-contrast-dark`** (voller 160-Token-Kontrakt, alle 88 Paare bestanden) mit automatischem Hookup `(prefers-contrast: more) and (prefers-color-scheme: dark)`; HC-light: `border.subtle` → stone.500, `bg.muted` → stone.200. **Type-Scale in rem** (Breaking; letter-spacing bleibt px); 44px-Coarse-Targets bleiben bewusst px.
- **M-G Stories**: disabled = natives `disabled` (+aria-disabled), Radio/Checkbox-Gruppen in fieldset/legend, Sidebar mit `<nav>`-Landmark, FileUpload-Fehler via `aria-invalid`+`aria-describedby` (Assertion jetzt scharf), Datepicker auf APG-Gridcell-Wrapper (Button behält Button-Rolle; CSS-Support via `.ct-datepicker__cell`), Tooltip-Doku-Hinweis auf Controller-Pflicht, Toast-Icons, kontextuelle Remove-Labels, Captions/Region-Labels, `aria-keyshortcuts` statt kbd-im-Namen, `lang="de"` auf Chart-Roots, MeaningfulIcon-Story, redundante Close-Labels entfernt.
- **M-H Behaviors**: Toggle-Group unterstützt echte Radio-Semantik (`radiogroup`/`radio`/`aria-checked`, Selection-follows-Focus) und repariert gestrandeten Roving-Tabindex; Select-Menu: Tab committet aktive Option, PageUp/Down; Combobox: ArrowUp-Open → letzte Option, Alt+ArrowDown/Up; Dropdown: Printable-Char-Open, Hover bewegt Fokus; Popover: `toggle()` respektiert `initialFocus`, Hover-Open ohne Wrapper-Root funktioniert; Modal/Drawer: `inertBackground`-Option, `destroy()` stellt Fokus wieder her, `tabindex="-2"`-Fix; Dev-Warnungen für fehlende Namen (Dialog, Gruppe), fehlendes Combobox-Status-Element, nicht fokussierbare Tooltip-Trigger; Tooltip Focus-Open `:focus-visible`-gegated. Deviations (Arrow-Wrap, Closed-Typeahead-Commit) in behaviors.md dokumentiert. 13 neue Behavior-Tests (`a11y-hardening.test.js`).
- **M-I Motion**: Reduce-Blöcke in checkbox/switch/_shared (selektive Imports abgedeckt); Indeterminate-Progress unter Reduce = volle Breite gedimmt statt „hängt bei 30 %"; Disabled-Double-Dimming behoben (`opacity: 1` bei eigenen Disabled-Farben).

## Breaking Changes (Major-Release nötig)

1. **Type-Scale px → rem** (`--font-size-*`, `--line-height-*`): identisch bei Root 16px, skaliert jetzt mit Browser-Schriftgröße.
2. **Border-Token-Werte**: light/dark `border.strong`, dark `border.subtle`, HC `border.subtle`/`bg.muted` geändert.
3. **`brand.accentStrong`** ist neuer Pflicht-Token im Semantic-Schema (Custom Themes, die das komplette Schema validieren, brauchen ihn; Override-Themes erben ihn).
4. **Dialog-Backdrop** schließt auf pointerdown+up statt click (Verhaltensänderung, absichtlich).
5. Neues Theme `high-contrast-dark` in `metadata.themes` und als `highContrastDark`-Export.

## Bewusst NICHT geändert (dokumentierte Entscheidungen)

- `stateBorder.*` unter 3:1: Border ist dekorativ-redundant (Fill + Icon + Text tragen den State) — in guidelines.md als Anforderung dokumentiert (Icon-oder-Wording-Pflicht).
- Select-Menu Arrow-Wrap + Sofort-Commit bei geschlossenem Typeahead: dokumentierte, absichtliche Deviations (native-Select-Verhalten).
- Chart-Serienfarben: strukturelle Mitigationen (Stroke-Separation, Daten-Tabelle) + neue Doku-Regel „nicht nur Farbton"; Palette unverändert.
- `aria-disabled`+`pointer-events` in CSS: Guidelines verlangen weiterhin natives `disabled` (CSS kann es nicht erzwingen).
