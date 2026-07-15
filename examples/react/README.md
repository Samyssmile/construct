# React integration example

This example keeps React responsible for rendering and lifecycle while Construct owns visual and interaction contracts.

1. Install `@neuravision/construct` alongside the application's existing React dependencies.
2. Import `construct.css` once from the application entry.
3. Render `SettingsModal`.

The effect creates the controller after the DOM refs exist and returns `controller.destroy` through its cleanup. This is safe with React Strict Mode's development setup/cleanup cycle and prevents listeners, focus state, or scroll locks from surviving an unmount.

The controller owns open/closed state, dialog semantics, focus trapping, Escape/backdrop dismissal, and focus return. React still owns form values, validation, persistence, routing, and product feedback. Wire the Save action to application state; do not create a second open/close state machine around the same DOM.

For a full component bundle, replace the selective component imports with:

```css
@import '@neuravision/construct/foundations.css';
@import '@neuravision/construct/components/components.css';
```

See [Headless behaviors](../../docs/behaviors.md) for the complete controller API and lifecycle rules.
