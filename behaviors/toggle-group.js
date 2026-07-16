import {
  assertChoice,
  assertDescendants,
  assertElement,
  assertElements,
  assertFunction,
  assertUniqueElements,
  boundaryEnabledIndex,
  createAttributeStore,
  createControllerLifecycle,
  createDisposables,
  dispatch,
  focusIntoView,
  getItemValue,
  isDisabled,
  nextEnabledIndex,
  orientationDelta,
  warnAccessibility,
} from './internal/dom.js';

const controllers = new WeakMap();

function isNativeButton(element) {
  return element.tagName === 'BUTTON' || (element.tagName === 'INPUT' && ['button', 'submit', 'reset'].includes(element.type));
}

function normalizeMultipleValue(value, name) {
  if (value == null) return [];
  if (typeof value === 'string' || typeof value[Symbol.iterator] !== 'function') {
    throw new TypeError(`${name} must be a non-string iterable for a multiple toggle group.`);
  }
  return Array.from(value, String);
}

/**
 * Creates a single- or multiple-value toggle group with roving tabindex.
 */
export function createToggleGroupController(options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Toggle group controller options are required.');
  }

  const root = assertElement(options.root, 'options.root');
  const existing = controllers.get(root);
  if (existing) return existing;

  const items = options.items == null
    ? [...root.querySelectorAll('[data-ct-toggle], .ct-toggle-group__item')]
    : assertElements(options.items, 'options.items');
  if (!items.length) throw new TypeError('Toggle group controller requires at least one item.');
  assertUniqueElements(items, 'options.items');
  assertDescendants(items, root, 'options.items');

  const type = assertChoice(options.type ?? 'single', ['single', 'multiple'], 'options.type');
  const orientation = assertChoice(
    options.orientation ?? root.getAttribute('aria-orientation') ?? 'horizontal',
    ['horizontal', 'vertical'],
    'options.orientation',
  );
  assertFunction(options.onValueChange, 'options.onValueChange');

  const attributes = createAttributeStore();
  const lifecycle = createControllerLifecycle('Toggle group');
  const disposables = createDisposables();
  const values = items.map(getItemValue);
  if (new Set(values).size !== values.length) {
    throw new TypeError('Toggle group item values must be unique.');
  }

  const loop = options.loop !== false;
  const allowEmpty = options.allowEmpty !== false;
  let selected = new Set();

  if (options.value != null) {
    const requested = type === 'multiple'
      ? new Set(normalizeMultipleValue(options.value, 'options.value'))
      : new Set([String(options.value)]);
    requested.forEach((value) => {
      if (!values.includes(value)) throw new RangeError(`Unknown toggle group value: ${value}.`);
      selected.add(value);
    });
  } else {
    items.forEach((item, index) => {
      if (item.getAttribute('aria-pressed') === 'true' || item.getAttribute('aria-checked') === 'true') {
        if (type === 'multiple' || selected.size === 0) selected.add(values[index]);
      }
    });
  }

  let focusIndex = items.findIndex((item, index) => selected.has(values[index]) && !isDisabled(item));
  if (focusIndex < 0) focusIndex = boundaryEnabledIndex(items);
  if (focusIndex < 0) throw new TypeError('Toggle group controller requires at least one enabled item.');
  if (!allowEmpty && selected.size === 0) selected.add(values[focusIndex]);

  /* Two supported state models:
     - button model (default): aria-pressed toggle buttons in a group/toolbar
     - radio model: role="radiogroup"/role="radio" markup with aria-checked,
       selection following focus per the APG radio-group pattern.
     Radio markup used to be silently rewritten to buttons while its stale
     aria-checked kept announcing the original selection — now it is honored. */
  const radioSemantics =
    type === 'single' &&
    (root.getAttribute('role') === 'radiogroup' ||
      items.some((item) => item.getAttribute('role') === 'radio'));
  if (type === 'multiple' && items.some((item) => item.getAttribute('role') === 'radio')) {
    warnAccessibility(
      'Toggle group: role="radio" items require type "single"; falling back to aria-pressed buttons.',
    );
  }

  const rootRole = root.getAttribute('role') ?? (radioSemantics ? 'radiogroup' : 'group');
  attributes.set(root, 'role', rootRole);
  attributes.set(root, 'data-orientation', orientation);
  if (rootRole === 'toolbar') attributes.set(root, 'aria-orientation', orientation);
  if (!root.hasAttribute('aria-label') && !root.hasAttribute('aria-labelledby')) {
    warnAccessibility(
      `Toggle group: the ${rootRole} element has neither aria-labelledby nor aria-label. ` +
        'Grouping roles must expose an accessible name (WCAG 4.1.2).',
    );
  }
  items.forEach((item) => {
    if (radioSemantics) attributes.set(item, 'role', 'radio');
    else if (!isNativeButton(item)) attributes.set(item, 'role', 'button');
  });

  function currentValue() {
    if (type === 'multiple') return values.filter((value) => selected.has(value));
    return values.find((value) => selected.has(value)) ?? null;
  }

  function sync() {
    /* An item disabled after init would otherwise strand the roving
       tabindex and drop the whole group from the tab order. */
    if (isDisabled(items[focusIndex])) {
      const fallback = boundaryEnabledIndex(items);
      if (fallback >= 0) focusIndex = fallback;
    }
    items.forEach((item, index) => {
      const pressed = selected.has(values[index]);
      attributes.set(item, radioSemantics ? 'aria-checked' : 'aria-pressed', String(pressed));
      attributes.set(item, 'data-state', pressed ? 'on' : 'off');
      attributes.set(item, 'tabindex', index === focusIndex && !isDisabled(item) ? '0' : '-1');
    });
  }

  function commit(nextSelected, reason, item = null) {
    return lifecycle.run('value change', (checkpoint) => {
      const previous = currentValue();
      const next = type === 'multiple'
        ? values.filter((value) => nextSelected.has(value))
        : values.find((value) => nextSelected.has(value)) ?? null;
      if (JSON.stringify(previous) === JSON.stringify(next)) return false;

      const detail = { controller, item, previousValue: previous, reason, value: next };
      const allowed = dispatch(root, 'ct:beforevaluechange', detail, true);
      checkpoint();
      if (!allowed) return false;

      selected = nextSelected;
      sync();
      options.onValueChange?.(detail);
      checkpoint();
      dispatch(root, 'ct:valuechange', detail);
      checkpoint();
      return true;
    });
  }

  function toggle(target, reason = 'programmatic') {
    lifecycle.assertAlive();
    const index = typeof target === 'number' ? target : items.indexOf(target);
    if (!Number.isInteger(index) || index < 0 || index >= items.length) {
      throw new RangeError('Toggle target is not managed by this controller.');
    }
    const item = items[index];
    if (isDisabled(item)) return false;

    const value = values[index];
    const next = new Set(selected);
    if (type === 'multiple') {
      if (next.has(value)) next.delete(value);
      else next.add(value);
    } else if (next.has(value)) {
      if (!allowEmpty) return false;
      next.clear();
    } else {
      next.clear();
      next.add(value);
    }

    return commit(next, reason, item);
  }

  function setValue(value, reason = 'programmatic') {
    lifecycle.assertAlive();
    const requested = type === 'multiple'
      ? new Set(normalizeMultipleValue(value, 'value'))
      : new Set(value == null ? [] : [String(value)]);
    requested.forEach((entry) => {
      if (!values.includes(entry)) throw new RangeError(`Unknown toggle group value: ${entry}.`);
    });
    if (!allowEmpty && requested.size === 0) return false;
    return commit(requested, reason);
  }

  function onKeyDown(event, index) {
    const delta = orientationDelta(event.key, orientation, root);
    let nextIndex = -1;
    if (delta) nextIndex = nextEnabledIndex(items, index, delta, loop);
    else if (event.key === 'Home' || event.key === 'End') {
      nextIndex = boundaryEnabledIndex(items, event.key === 'End');
    }

    if (nextIndex >= 0) {
      event.preventDefault();
      focusIndex = nextIndex;
      sync();
      focusIntoView(items[nextIndex]);
      /* APG radio group: selection follows focus. */
      if (radioSemantics && !selected.has(values[nextIndex])) toggle(nextIndex, 'keyboard');
      return;
    }

    if (!isNativeButton(items[index]) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      toggle(index, 'keyboard');
    }
  }

  items.forEach((item, index) => {
    disposables.listen(item, 'click', (event) => {
      event.preventDefault();
      if (!isDisabled(item)) toggle(index, 'pointer');
    });
    disposables.listen(item, 'focus', () => {
      if (isDisabled(item)) return;
      focusIndex = index;
      sync();
    });
    disposables.listen(item, 'keydown', (event) => onKeyDown(event, index));
  });

  const controller = Object.freeze({
    get root() {
      return root;
    },
    get items() {
      return [...items];
    },
    get value() {
      return currentValue();
    },
    toggle,
    setValue,
    destroy() {
      if (!lifecycle.destroy()) return;
      disposables.dispose();
      attributes.restore();
      controllers.delete(root);
    },
  });

  controllers.set(root, controller);
  sync();
  return controller;
}
