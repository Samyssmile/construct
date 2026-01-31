# Accessful Design Implementation Workspace

Dies ist ein Angular Multi-Projekt-Workspace für das Accessful Design System.

## Projektstruktur

- **projects/angular** - Die Accessful Angular Component Library
- **projects/demo** - Eine Demo-Anwendung zur Demonstration der Components

## Installation

```bash
npm install
```

## Development server

Um die Demo-Anwendung zu starten:

```bash
npm start
# oder
npm run start:demo
```

Die Anwendung läuft dann auf `http://localhost:4200/` und aktualisiert sich automatisch bei Änderungen.

## Building

### Beide Projekte bauen

```bash
npm run build
```

### Nur die Angular Library bauen

```bash
npm run build:angular
```

Die Library wird nach `dist/angular/` gebaut.

### Nur die Demo-App bauen

```bash
npm run build:demo
```

Die Demo-App wird nach `dist/demo/` gebaut.

## Storybook

Um Storybook zu starten:

```bash
npm run storybook
```

Storybook läuft dann auf `http://localhost:6006/`.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
