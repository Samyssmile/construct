# Construct Governance and Definition of Done

Construct is a reusable product contract, not a collection of project-specific styles. Changes must keep the token, CSS, behavior, accessibility, documentation, and package surfaces aligned.

## Ownership boundaries

| Layer | Owns | Must not own |
| --- | --- | --- |
| Primitive tokens | Raw scales and values | Product meaning or component selectors |
| Semantic tokens | Theme-aware intent | Component anatomy |
| Component tokens | Stable component decisions | DOM event handling |
| Component CSS | Appearance and attribute-driven states | Focus management or keyboard state machines |
| Headless behaviors | ARIA synchronization, keyboard interaction, focus, open/close state | Product data or visual styling |
| Framework adapters | Rendering, lifecycle integration, application data | Private forks of Construct behavior |

Product-specific rules belong in the consuming application. A pattern that is useful across products should first be expressed as a general Construct contract and covered by the quality gates below.

## Definition of Done

A change is complete only when every applicable item is satisfied.

### Tokens and themes

- Source JSON is changed instead of generated `tokens/tokens.*` files.
- Primitive, semantic, and component-token responsibilities remain distinct.
- References resolve without cycles or missing targets.
- Built-in theme structures stay compatible with the light-theme contract.
- Custom-theme input is schema-valid, only overrides known tokens, and passes its declared contrast checks.
- Generated CSS, JSON, JavaScript, and TypeScript outputs are rebuilt together before checks and packaging. They are intentionally ignored in this repository and produced in clean CI/prepack runs; source JSON and schemas are the reviewed files.
- Token additions, removals, or value changes follow the documented versioning policy.

### Components and CSS

- The public anatomy, modifiers, sizes, and supported ARIA/data attributes are documented.
- Default, hover, focus-visible, active, selected/open, disabled, invalid, loading, and empty states are handled where they apply.
- Covered compact controls follow Construct's 44×44 CSS-pixel coarse-pointer policy; custom controls are tested separately.
- Motion has a `prefers-reduced-motion` path and essential meaning does not depend on animation.
- Essential controls and states remain perceivable with `forced-colors: active`.
- CSS uses Construct tokens, logical properties where direction matters, and no unresolved custom properties.
- The component works through both the full bundle and its standalone package import.
- A Storybook story covers representative states and the accessibility addon reports no serious violation.

### Interactive behavior

- Native HTML is preferred where it already provides the required semantics.
- ARIA state and visible state share one source of truth.
- Keyboard behavior follows the relevant WAI-ARIA Authoring Practices pattern.
- Focus entry, containment where required, Escape behavior, outside interaction, and focus restoration are explicit.
- Disabled items are not activated, and composite widgets maintain a valid focus model.
- Initialization is safe, teardown removes every listener and temporary attribute, and repeated initialization does not leak state.
- Behavior modules have no framework dependency and expose a documented controller contract.
- Unit tests cover the keyboard and lifecycle invariants; Storybook verifies the integrated markup and styles.

### Documentation and release

- README, component usage, token guidance, and Storybook prose do not overstate what CSS alone provides.
- A framework example is updated when a public behavior or markup contract changes.
- The changelog explains consumer-visible additions, migrations, and accessibility implications.
- `package.json`, its lockfile, examples, issue templates, and visible version labels agree on the release version.
- Package exports and the packed file list are verified before release.

## Required quality gates

Run these from the Construct package root:

```bash
npm run audit
npm run build
npm run check
npm test
npm run storybook:build
npm pack --dry-run
```

The audit gate includes development tooling and rejects high or critical dependency advisories. Run `npm run build` before the non-mutating `npm run check`, including in a clean checkout where ignored token outputs do not exist. The check verifies generated token and standalone outputs, token/theme validity, contrast declarations, CSS-variable closure, and package export targets. `npm test` verifies headless behavior, Storybook interactions/accessibility, and the real coarse-pointer browser contract.

Manual review is still required for visual hierarchy, zoom and reflow, screen-reader announcements, keyboard order, and product-context language. Automated checks support that review; they do not replace it.

## Versioning

- **Major:** remove or rename a public token, selector, behavior export, or required markup/attribute contract.
- **Minor:** add a token, component, variant, optional behavior, theme capability, or backward-compatible state.
- **Patch:** fix an implementation without changing the documented consumer contract.

Deprecations must identify the replacement and removal release. Compatibility files may forward to a canonical implementation, but must not maintain a second divergent copy.
