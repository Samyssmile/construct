import {
  assertDescendants,
  assertElement,
  assertElements,
  assertFunction,
  assertSameDocument,
  assertUniqueElements,
  boundaryEnabledIndex,
  createAttributeStore,
  createControllerLifecycle,
  createDisposables,
  createTypeahead,
  dispatch,
  focusElement,
  getItemValue,
  isDisabled,
  nextEnabledIndex,
} from './internal/dom.js';
import { createPopupLayer } from './internal/popup-layer.js';

const controllers = new WeakMap();

const MENU_ITEM_SELECTOR = [
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[data-ct-menu-item]',
].join(',');

/**
 * Creates a menu-button controller with roving focus, typeahead, dismissal, and selection events.
 */
export function createDropdownController(options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Dropdown controller options are required.');
  }

  const trigger = assertElement(options.trigger, 'options.trigger');
  const existing = controllers.get(trigger);
  if (existing) return existing;
  const menu = assertElement(options.menu, 'options.menu');
  const root = assertElement(options.root ?? menu.closest('.ct-dropdown') ?? menu, 'options.root');
  const items = options.items == null
    ? [...menu.querySelectorAll(MENU_ITEM_SELECTOR)]
    : assertElements(options.items, 'options.items');
  if (!items.length) throw new TypeError('Dropdown controller requires at least one menu item.');
  if (trigger.ownerDocument !== menu.ownerDocument) {
    throw new TypeError('Dropdown trigger and menu must belong to the same document.');
  }
  assertSameDocument([root], trigger.ownerDocument, 'options.root');
  assertUniqueElements(items, 'options.items');
  assertSameDocument(items, trigger.ownerDocument, 'options.items');
  assertDescendants(items, menu, 'options.items');
  assertFunction(options.onSelect, 'options.onSelect');
  assertFunction(options.onOpen, 'options.onOpen');
  assertFunction(options.onClose, 'options.onClose');

  const attributes = createAttributeStore();
  const lifecycle = createControllerLifecycle('Dropdown');
  const disposables = createDisposables();
  const typeahead = createTypeahead({ timeout: options.typeaheadTimeout });
  let controller;
  let focusIndex = -1;
  let pendingFocus = 'first';

  attributes.set(menu, 'role', 'menu');
  if (trigger.tagName === 'BUTTON' && !trigger.hasAttribute('type')) {
    attributes.set(trigger, 'type', 'button');
  }
  items.forEach((item) => {
    if (!item.hasAttribute('role')) attributes.set(item, 'role', 'menuitem');
    attributes.set(item, 'tabindex', '-1');
  });

  function enabledBoundary(fromEnd = false) {
    return boundaryEnabledIndex(items, fromEnd);
  }

  function setHighlighted(index, { focus = true } = {}) {
    if (index < 0 || index >= items.length || isDisabled(items[index])) return false;
    focusIndex = index;
    items.forEach((item, itemIndex) => {
      attributes.set(item, 'data-highlighted', itemIndex === index ? '' : null);
    });
    if (focus) focusElement(items[index]);
    return true;
  }

  function clearHighlight() {
    focusIndex = -1;
    items.forEach((item) => attributes.set(item, 'data-highlighted', null));
    typeahead.reset();
  }

  const layer = createPopupLayer({
    attributes,
    closeOnEscape: options.closeOnEscape !== false,
    closeOnFocusOutside: true,
    closeOnOutside: options.closeOnOutside !== false,
    disposables,
    getController: () => controller,
    hasPopup: 'menu',
    handlesTab: true,
    idPrefix: 'ct-dropdown-menu',
    initialOpen: !isDisabled(trigger) && (options.open ?? root.getAttribute('data-state') === 'open'),
    popup: menu,
    stateElement: root,
    trigger,
    onOpen(detail, checkpoint) {
      const index = pendingFocus === 'last' ? enabledBoundary(true) : enabledBoundary();
      if (index >= 0) setHighlighted(index);
      checkpoint();
      options.onOpen?.(detail);
    },
    onClose(detail) {
      clearHighlight();
      options.onClose?.(detail);
    },
  });

  function open(reason = 'programmatic', { focus = 'first' } = {}) {
    return lifecycle.run('open', (checkpoint) => {
      if (!['first', 'last'].includes(focus)) {
        throw new TypeError("focus must be 'first' or 'last'.");
      }
      if (isDisabled(trigger)) return false;
      pendingFocus = focus;
      const changed = layer.open(reason);
      checkpoint();
      if (!changed && layer.isOpen) {
        const index = focus === 'last' ? enabledBoundary(true) : enabledBoundary();
        if (index >= 0) setHighlighted(index);
      }
      return changed;
    });
  }

  function selectItem(index, reason) {
    return lifecycle.run('select', (checkpoint) => {
      const item = items[index];
      if (!item || isDisabled(item)) return false;

      const detail = {
        controller,
        index,
        item,
        reason,
        value: getItemValue(item, index),
      };
      const allowed = dispatch(menu, 'ct:beforeselect', detail, true);
      checkpoint();
      if (!allowed) return false;

      const role = item.getAttribute('role');
      if (role === 'menuitemcheckbox') {
        attributes.set(item, 'aria-checked', String(item.getAttribute('aria-checked') !== 'true'));
      } else if (role === 'menuitemradio') {
        const group = item.closest('[role="group"]') ?? menu;
        items.forEach((candidate) => {
          if (
            candidate.getAttribute('role') === 'menuitemradio' &&
            (candidate.closest('[role="group"]') ?? menu) === group
          ) {
            attributes.set(candidate, 'aria-checked', String(candidate === item));
          }
        });
      }

      options.onSelect?.(detail);
      checkpoint();
      dispatch(menu, 'ct:select', detail);
      checkpoint();
      const keepOpen = item.hasAttribute('data-ct-keep-open');
      const defaultClose = role !== 'menuitemcheckbox';
      if (!keepOpen && (options.closeOnSelect ?? defaultClose)) layer.close('select');
      return true;
    });
  }

  function onMenuKeyDown(event) {
    const current = items.indexOf(event.target);
    if (current < 0) return;

    if (event.key === 'Tab') {
      close('tab');
      return;
    }

    let next = -1;
    if (event.key === 'ArrowDown') next = nextEnabledIndex(items, current, 1, true);
    else if (event.key === 'ArrowUp') next = nextEnabledIndex(items, current, -1, true);
    else if (event.key === 'Home' || event.key === 'End') {
      next = enabledBoundary(event.key === 'End');
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectItem(current, 'keyboard');
      return;
    } else {
      next = typeahead.find(event, items, current);
    }

    if (next >= 0) {
      event.preventDefault();
      setHighlighted(next);
    }
  }

  function close(reason = 'programmatic', closeOptions) {
    return lifecycle.run('close', (checkpoint) => {
      const changed = layer.close(reason, closeOptions);
      checkpoint();
      return changed;
    });
  }

  function toggle(reason = 'programmatic') {
    return lifecycle.run('toggle', (checkpoint) => {
      if (isDisabled(trigger)) return false;
      const changed = layer.toggle(reason);
      checkpoint();
      return changed;
    });
  }

  disposables.listen(trigger, 'click', (event) => {
    event.preventDefault();
    if (isDisabled(trigger)) return;
    pendingFocus = 'first';
    toggle('trigger');
  });
  disposables.listen(trigger, 'keydown', (event) => {
    if (isDisabled(trigger)) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) event.preventDefault();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open('keyboard', { focus: event.key === 'ArrowUp' ? 'last' : 'first' });
    } else if ((event.key === 'Enter' || event.key === ' ') && !layer.isOpen) {
      event.preventDefault();
      open('keyboard');
    }
  });
  disposables.listen(menu, 'keydown', onMenuKeyDown);
  items.forEach((item, index) => {
    disposables.listen(item, 'focus', () => setHighlighted(index, { focus: false }));
    disposables.listen(item, 'click', (event) => {
      if (isDisabled(item)) {
        event.preventDefault();
        return;
      }
      selectItem(index, 'pointer');
    });
  });

  controller = Object.freeze({
    get trigger() {
      return trigger;
    },
    get root() {
      return root;
    },
    get menu() {
      return menu;
    },
    get items() {
      return [...items];
    },
    get isOpen() {
      return layer.isOpen;
    },
    open,
    close,
    toggle,
    select(target, reason = 'programmatic') {
      lifecycle.assertAlive();
      const index = typeof target === 'number' ? target : items.indexOf(target);
      if (!Number.isInteger(index) || index < 0 || index >= items.length) {
        throw new RangeError('Menu item is not managed by this controller.');
      }
      return selectItem(index, reason);
    },
    destroy() {
      if (!lifecycle.destroy()) return;
      layer.destroy();
      typeahead.reset();
      disposables.dispose();
      attributes.restore();
      controllers.delete(trigger);
    },
  });

  controllers.set(trigger, controller);
  layer.activateInitialOpen();
  return controller;
}
