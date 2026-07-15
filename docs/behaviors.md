# Headless Behaviors

Construct's optional behavior package enhances existing DOM with accessible state machines. It has no framework or runtime dependency and does not render markup or styles.

```js
import {
  createModalController,
  createTabsController,
} from '@neuravision/construct/behaviors';
```

Every factory validates its DOM contract, returns the existing controller when initialized twice for the same root/trigger, and exposes an idempotent `destroy()` method. Call `destroy()` before the owning view unmounts.

## Controllers

| Factory | Behavior contract |
| --- | --- |
| `createModalController` | Dialog semantics, initial focus, focus trap, Escape/backdrop dismissal, nested overlay ordering, scroll lock, focus return |
| `createDrawerController` | Modal drawer behavior with the same focus/dismissal invariants and toggle trigger support |
| `createTabsController` | Roving tabindex, horizontal/vertical arrows, Home/End, automatic or manual activation |
| `createToggleGroupController` | Single/multiple pressed state, roving tabindex, orientation-aware arrows, controlled programmatic value |
| `createDropdownController` | ARIA menu button, first/last focus, arrows, Home/End, typeahead, outside/Escape dismissal, menu item selection |
| `createSelectMenuController` | Button/listbox selection, active option, typeahead, keyboard opening and dismissal, value synchronization |
| `createComboboxController` | Editable combobox, virtual listbox focus, optional local filtering, active descendant, announcements, selection |
| `createTooltipController` | Focus and hover timing, touch toggle, Escape/outside dismissal, described-by wiring |
| `createPopoverController` | Non-modal popup disclosure, optional focus entry, hover/focus modes, outside/Escape dismissal, focus return |

The package includes TypeScript declarations for options, callbacks, controller methods, and event-detail types.

## Modal example

```html
<button id="open-settings" class="ct-button" type="button">Settings</button>

<div id="settings-modal" class="ct-modal" data-state="closed" hidden>
  <section class="ct-modal__dialog" aria-labelledby="settings-title">
    <header class="ct-modal__header">
      <h2 id="settings-title">Settings</h2>
      <button class="ct-button ct-button--ghost" type="button" data-ct-dismiss>Close</button>
    </header>
    <div class="ct-modal__body">
      <label class="ct-field">
        <span class="ct-field__label">Display name</span>
        <input class="ct-input" type="text" autofocus />
      </label>
    </div>
  </section>
</div>
```

```js
import { createModalController } from '@neuravision/construct/behaviors';

const modal = document.querySelector('#settings-modal');
const controller = createModalController({
  container: modal,
  dialog: modal.querySelector('.ct-modal__dialog'),
  trigger: document.querySelector('#open-settings'),
});

// When the owning view is removed:
controller.destroy();
```

Buttons with `data-ct-dismiss` are discovered automatically. The caller still owns the accessible name through `aria-labelledby` or `aria-label` and owns the action performed after confirmation.

## Tabs example

```js
import { createTabsController } from '@neuravision/construct/behaviors';

const tablist = document.querySelector('[role="tablist"]');
const tabs = createTabsController({
  tablist,
  activation: 'automatic',
  onSelect({ index }) {
    analytics.track('settings_tab_selected', { index });
  },
});
```

The controller can discover tabs from `[role="tab"]` or `[data-ct-tab]`. Panels can be linked with `aria-controls` or passed explicitly. Disabled tabs use native `disabled` or `aria-disabled="true"` and are skipped by keyboard movement.

## State and events

Controllers synchronize the attributes consumed by Construct CSS, including `data-state`, `aria-expanded`, `aria-selected`, `aria-pressed`, `aria-activedescendant`, `tabindex`, and `hidden` as applicable.

State changes dispatch cancellable `ct:beforeopen`, `ct:beforeclose`, `ct:beforeselect`, or `ct:beforevaluechange` events where relevant. Preventing the event prevents the transition. Successful transitions dispatch the corresponding `ct:open`, `ct:close`, `ct:select`, or `ct:valuechange` event and invoke the typed callback option.

Programmatic methods accept a `reason` string. Use stable product-specific reasons when analytics or application policy needs to distinguish pointer, keyboard, routing, and remote-data transitions.

## Lifecycle rules

- Initialize after all managed elements exist.
- Keep one controller per mounted widget; repeated factory calls for the same owner return it.
- Do not update controller-owned ARIA attributes from a second state machine.
- Call `destroy()` during framework cleanup. It removes listeners, overlay registrations, timers, scroll locks, and owned temporary attributes.
- Recreate the controller when the managed item collection changes. `ComboboxController.refresh()` is the exception for filter/result refresh within its fixed managed collection.
- Prefer native `<details>`, `<select>`, and `<dialog>` where their platform behavior fully meets the product requirement.

See the [React example](../examples/react/README.md) for framework lifecycle integration and [Component usage](../components/README.md) for the corresponding markup and CSS classes.
