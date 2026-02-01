# Accessful Design Guidelines

## Ziel
Ein konsistentes, barrierefreies UI fuer alle Accessful Apps (Angular, React, Svelte).
Accessibility hat Prioritaet 1.

## Do / Don'ts

### Do
- Verwende semantisches HTML (button, input, label, table, nav).
- Nutze Tokens fuer Farben, Abstaende, Typo und Radius.
- Halte Zustandslogik klar (hover, focus, active, disabled, error).
- Verwende konsistente Groessen (sm, md, lg) in Formularfeldern und Buttons.
- Nutze klare Hierarchien (Primary vs. Secondary Aktionen).
- Teste alle Komponenten mit Tastatur (Tab, Shift+Tab, Enter, Space).

### Don't
- Keine rein farbliche Status-Information ohne Text oder Icon.
- Keine Custom-Controls ohne ARIA-Rollen und Tastatursteuerung.
- Keine feste Pixel-Layouts fuer Inhalte, die wachsen koennen.
- Keine kontrastarmen Texte oder Disabled-Zustaende, die unlesbar sind.
- Keine unnoetigen Animationen fuer kritische Aktionen.

## A11y Regeln (Minimum)
- Sichtbarer Focus fuer alle interaktiven Elemente.
- Labels fuer jede Form-Input-Instanz (explizit oder aria-label).
- Tastaturbedienung fuer Dropdowns, Tabs, Modal, Tooltip, Datepicker.
- ARIA-Attribute nur dort, wo semantisches HTML nicht reicht.
- Links muessen auch ohne Farbe als Links erkennbar sein (z.B. Unterstreichung).
- Kontrast: Text, Icons, Fokus-Ring muessen gut sichtbar sein.
- Disabled-States sind erkennbar, aber Inhalt bleibt lesbar.
- Bewegelemente respektieren prefers-reduced-motion.
- Live-Regions fuer Toasts/Statusmeldungen (aria-live).
- Modal: aria-modal, role="dialog", Focus trap im Framework-Wrapper.

## Composite Komponenten: Tastatur-Muster (Minimum)
- Tabs: Pfeiltasten wechseln den Fokus zwischen Tabs, Home/End springt zum ersten/letzten Tab, Enter/Space aktiviert. Nur der aktive Tab hat tabindex="0" (roving tabindex).
- Dropdown (Action-List): Trigger-Button mit aria-expanded und aria-controls. Beim Oeffnen Fokus auf das erste Item, Esc schliesst und gibt Fokus zum Trigger zurueck. Items sind normale Buttons/Links in Tab-Reihenfolge.
- Dropdown (Role=menu, optional): Nur verwenden, wenn Pfeiltasten-Navigation, Home/End, typeahead und roving tabindex umgesetzt sind.
- Datepicker: Pfeiltasten bewegen den Fokus im Grid, PageUp/PageDown wechselt Monate, Home/End springt zur Wochenkante, Enter/Space waehlt aus. Esc schliesst und gibt Fokus zum Trigger zurueck.
- Modal: Fokus-Trap, initialer Fokus im Dialog, Esc schliesst, Fokus geht zum Ausloeser zurueck.
- Tooltip: Oeffnet bei Hover und Fokus, schliesst bei Blur und Esc, role="tooltip" mit aria-describedby.

## Component States
- error: aria-invalid="true" + Textfeedback
- disabled: disabled oder aria-disabled="true"
- selected: aria-selected="true"
- current: aria-current="page"

## Fonts
- Standard: Fonts werden in `foundations.css` per Google Fonts geladen (Sora, Source Sans 3, JetBrains Mono).
- Falls eine App lokal hosten muss (CSP/Privacy), ersetze den Google-Import durch eigene @font-face Regeln.
- Stelle sicher, dass Gewichte 400/500/600/700 verfuegbar sind.

## Governance
- Neue Komponenten nur mit: Tokens, States, A11y-Notizen, Storybook-Story.
- Vor Merge: visuelle QA + Tastaturtest + Kontrast-Check.
