# Construct Architecture

Construct separates reusable design decisions, visual component contracts, interaction behavior, and product integration. That separation lets a vanilla page and a framework application share the same public contract without coupling Construct to either runtime.

```text
primitive tokens
      │
      ▼
semantic tokens ─── built-in/custom theme scopes
      │
      ▼
component tokens ── stable component decisions
      │
      ├──────────────► component CSS ──► DOM + ARIA/data state
      │                                      ▲
      └──────────────► JS/TS token exports   │
                                             │
optional headless behaviors ─────────────────┘
                                             │
framework adapter / application data ───────┘
```

## Token layers

1. **Primitives** are raw, context-free scales such as palette steps, spacing, type sizes, and motion durations.
2. **Semantic tokens** express intent such as canvas, primary text, danger surface, or focus ring. Themes override this layer.
3. **Component tokens** express stable component decisions such as button height or control border. They reference semantic or primitive tokens and are re-declared in theme scopes so nested container themes resolve correctly.

Source files live in `tokens/*.json`; `tokens/tokens.css`, `.json`, `.js`, and `.ts` are generated. Schemas in `schemas/` define the accepted source and product-theme contracts.

## CSS layers and entry points

| Entry point | Purpose |
| --- | --- |
| `@neuravision/construct/tokens/tokens.css` | Tokens only |
| `@neuravision/construct/foundations.css` | Network-free reset, typography, and layout utilities |
| `@neuravision/construct/fonts.css` | Optional hosted-font request; import only with explicit privacy/CSP approval |
| `@neuravision/construct/components/components.css` | Complete component bundle |
| `@neuravision/construct/components/<name>.css` | Generated standalone component entry with tokens and shared component contracts |
| `@neuravision/construct/components/core.css` | Tokens and shared component contracts without a concrete component |

Files under `standalone/` are generated package adapters. Authored component CSS remains in `components/`; it is never copied into a second implementation. This keeps full-bundle and selective-import behavior on one source.

## Behavior layer

Construct CSS styles ARIA and `data-*` state; it cannot implement a focus trap, roving tabindex, typeahead, Escape handling, or focus restoration. The optional `@neuravision/construct/behaviors` ESM entry provides dependency-free controllers for those state machines.

Controllers enhance caller-owned DOM. They synchronize semantics, emit cancellable `ct:before*` and post-change `ct:*` events where relevant, expose programmatic methods, and return a `destroy()` lifecycle. Rendering and product data stay in the application or framework adapter.

Importing the behavior entry has no side effect. A controller starts only when its factory is called, and destroying it restores the attributes it owned.

## Product themes

A product theme is a validated override, not a copy of the generated stylesheet. It names a built-in base, supplies known semantic and/or component paths, and declares any product-specific contrast pairs.

```bash
npx construct-theme \
  --theme ./brand.theme.json \
  --out-dir ./src/generated/construct
```

The compiler validates schemas, unknown paths, references, complete resolved shapes, selector/value safety, duplicate selectors, typed CSS values, and contrast before writing the same CSS/JSON/JS/TS formats as the built-in build. Keep the theme input under product source control and treat its output as generated.

The consuming stylesheet must load the generated `tokens.css` after foundations and all full or standalone Construct component entries. Those entries include the built-in token sheet; putting the generated theme last gives its root and scoped declarations deterministic precedence. Product-specific overrides may follow it.

## Framework boundary

Framework adapters own references, mount/unmount lifecycle, controlled application state, and rendering. They should initialize a controller after the relevant DOM exists and call `destroy()` during cleanup. They must not reproduce the controller's keyboard or focus logic in parallel.

Construct does not own routing, remote data, authorization, analytics, localization, or product-specific responsive decisions. Components expose explicit slots, attributes, tokens, and controller callbacks so those concerns can remain at the product layer.

## Generated and compatibility files

- Edit token source JSON and run the build; never hand-edit `tokens/tokens.*`.
- Edit `components/index.css` and authored component files; regenerate `standalone/`.
- A compatibility entry may import a canonical implementation, but duplicated component implementations are not maintained.
- Public exports are checked against real files before packaging.

See [Governance and Definition of Done](governance.md) for change ownership, review requirements, and release gates.
