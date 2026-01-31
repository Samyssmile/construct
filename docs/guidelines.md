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
- Kontrast: Text, Icons, Fokus-Ring muessen gut sichtbar sein.
- Disabled-States sind erkennbar, aber Inhalt bleibt lesbar.
- Bewegelemente respektieren prefers-reduced-motion.
- Live-Regions fuer Toasts/Statusmeldungen (aria-live).
- Modal: aria-modal, role="dialog", Focus trap im Framework-Wrapper.

## Component States
- error: aria-invalid="true" + Textfeedback
- disabled: disabled oder aria-disabled="true"
- selected: aria-selected="true"
- current: aria-current="page"

## Governance
- Neue Komponenten nur mit: Tokens, States, A11y-Notizen, Storybook-Story.
- Vor Merge: visuelle QA + Tastaturtest + Kontrast-Check.
