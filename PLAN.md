Wir müssen bei Accessful GmbH bald mehrere neue Webanwendungen schreiben, das Problem ist das wir kein einheitliches Design
    haben. Wir nuitzen Angular, React und Svelte.  Aber optisch sollen die Anwenungen gleich aussehen und eine Art
    wiedererkennung bieten. Wie kann man dieses Problem angehen? Was sind best practrice und way to go im Jahr 2026. Dafür
  habe ich den ordner "design" erstellt. Und den plan.md geschrieben. Schau den order design genau an, lies den plan. Was wäre
  der nächste schritt?
# Accessful Design System – Umsetzungsplan

## High Priority
Absolute top, nr1, highes priority is. The accessibilty of the ui. We are Accessful GmbH and we convert PDF to PDF/UA. So our Webapps must be accessful.

## Status
- Erledigt: Design-Tokens Basis + Semantik + CSS Variables (`frontend/design/tokens/*`)
- Erledigt: Foundations-Stylesheet (`frontend/design/foundations.css`)
- Erledigt: Token-Pipeline (JSON -> CSS/TS, Versionierung, Release-Workflow)
- Erledigt: Komponenten-Set v1 (CSS + Usage-Notes in `frontend/design/components/*`)
- Erledigt: Storybook + Doku + Do/Don'ts + A11y-Regeln (`frontend/design/.storybook`, `frontend/design/stories`, `frontend/design/docs`)

## Plan (kurz)
Next step: Visuelle QA (Regression-Tests, A11y-Checks, Review-Prozess)

1) Foundations-Stylesheet (Reset, Typo-Defaults, Layout-Raster, Utility-Basics) [done]
2) Token-Pipeline (JSON -> CSS/TS, Versionierung, Release-Workflow) [done]
3) Komponenten-Set v1 (Button, Input, Select, Textarea, Checkbox, Radio, Switch, Card, Table, Modal, Toast, Tooltip, Tabs, Dropdown, Pagination, Breadcrumbs, Data‑Table, Datepicker) [done]
4) Dokumentation (Storybook/Doku, Usage, Do/Don'ts, A11y-Regeln) [done]
5) Visuelle QA (Regression-Tests, A11y-Checks, Review-Prozess)
6) Rollout in Apps (Angular/React/Svelte) + Feedback-Iteration
