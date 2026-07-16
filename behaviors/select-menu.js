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
  ensureId,
  focusElement,
  getTextLabel,
  isDisabled,
  nextEnabledIndex,
} from './internal/dom.js';
import { createPopupLayer } from './internal/popup-layer.js';

const controllers = new WeakMap();

/**
 * Creates a single-value, select-only combobox controller backed by a listbox.
 * Keyboard focus remains on the trigger while `aria-activedescendant` identifies
 * the active option.
 */
export function createSelectMenuController(options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Select menu controller options are required.');
  }

  const trigger = assertElement(options.trigger, 'options.trigger');
  const existing = controllers.get(trigger);
  if (existing) return existing;
  const listbox = assertElement(options.listbox, 'options.listbox');
  const root = assertElement(options.root ?? listbox.closest('.ct-select-menu') ?? listbox, 'options.root');
  const optionElements = options.options == null
    ? [...listbox.querySelectorAll('[role="option"], [data-ct-option]')]
    : assertElements(options.options, 'options.options');
  if (!optionElements.length) throw new TypeError('Select menu controller requires at least one option.');
  if (trigger.ownerDocument !== listbox.ownerDocument || trigger.ownerDocument !== root.ownerDocument) {
    throw new TypeError('Select menu elements must belong to the same document.');
  }
  assertUniqueElements(optionElements, 'options.options');
  assertSameDocument(optionElements, trigger.ownerDocument, 'options.options');
  assertDescendants(optionElements, listbox, 'options.options');
  assertFunction(options.getOptionLabel, 'options.getOptionLabel');
  assertFunction(options.getOptionValue, 'options.getOptionValue');
  assertFunction(options.onValueChange, 'options.onValueChange');
  assertFunction(options.onOpen, 'options.onOpen');
  assertFunction(options.onClose, 'options.onClose');

  const attributes = createAttributeStore();
  const lifecycle = createControllerLifecycle('Select menu');
  const disposables = createDisposables();
  const typeahead = createTypeahead({ timeout: options.typeaheadTimeout });
  const getLabel = options.getOptionLabel ?? getTextLabel;
  const getValue = options.getOptionValue ?? ((option, index) =>
    option.getAttribute('data-value') ?? option.getAttribute('value') ?? getLabel(option, index));
  const values = optionElements.map((option, index) => String(getValue(option, index)));
  if (new Set(values).size !== values.length) {
    throw new TypeError('Select menu option values must be unique.');
  }

  let controller;
  let activeIndex = -1;
  let selectedIndex = options.value == null
    ? optionElements.findIndex((option) => option.getAttribute('aria-selected') === 'true')
    : values.indexOf(String(options.value));
  if (options.value != null && selectedIndex < 0) {
    throw new RangeError(`Unknown select menu value: ${options.value}.`);
  }
  if (selectedIndex >= 0 && isDisabled(optionElements[selectedIndex])) selectedIndex = -1;

  attributes.set(trigger, 'role', 'combobox');
  if (trigger.tagName === 'BUTTON' && !trigger.hasAttribute('type')) {
    attributes.set(trigger, 'type', 'button');
  }
  attributes.set(trigger, 'aria-autocomplete', 'none');
  attributes.set(listbox, 'role', 'listbox');
  optionElements.forEach((option) => {
    attributes.set(option, 'role', 'option');
    attributes.set(option, 'tabindex', '-1');
    ensureId(option, 'ct-select-option', attributes);
  });

  const valueElement = options.valueElement == null
    ? null
    : assertElement(options.valueElement, 'options.valueElement');
  if (valueElement) assertSameDocument([valueElement], trigger.ownerDocument, 'options.valueElement');
  const originalValueText = valueElement?.textContent;

  function syncSelection(checkpoint = lifecycle.assertAlive) {
    optionElements.forEach((option, index) => {
      attributes.set(option, 'aria-selected', String(index === selectedIndex));
    });
    if (valueElement && selectedIndex >= 0) {
      const label = getLabel(optionElements[selectedIndex], selectedIndex);
      checkpoint();
      valueElement.textContent = label;
    }
  }

  function setActive(index) {
    if (index < 0 || index >= optionElements.length || isDisabled(optionElements[index])) return false;
    activeIndex = index;
    optionElements.forEach((option, optionIndex) => {
      attributes.set(option, 'data-highlighted', optionIndex === index ? '' : null);
    });
    attributes.set(trigger, 'aria-activedescendant', optionElements[index].id);
    optionElements[index].scrollIntoView?.({ block: 'nearest' });
    return true;
  }

  function clearActive() {
    activeIndex = -1;
    attributes.set(trigger, 'aria-activedescendant', null);
    optionElements.forEach((option) => attributes.set(option, 'data-highlighted', null));
    typeahead.reset();
  }

  const layer = createPopupLayer({
    attributes,
    closeOnEscape: options.closeOnEscape !== false,
    closeOnFocusOutside: true,
    closeOnOutside: options.closeOnOutside !== false,
    disposables,
    getController: () => controller,
    hasPopup: 'listbox',
    handlesTab: true,
    idPrefix: 'ct-select-listbox',
    initialOpen: !isDisabled(trigger) && (options.open ?? root.getAttribute('data-state') === 'open'),
    popup: listbox,
    stateElement: root,
    trigger,
    onOpen(detail, checkpoint) {
      const initial = selectedIndex >= 0 ? selectedIndex : boundaryEnabledIndex(optionElements);
      if (initial >= 0) setActive(initial);
      focusElement(trigger);
      checkpoint();
      options.onOpen?.(detail);
    },
    onClose(detail) {
      clearActive();
      options.onClose?.(detail);
    },
  });

  function open(reason = 'programmatic') {
    return lifecycle.run('open', (checkpoint) => {
      if (isDisabled(trigger)) return false;
      const changed = layer.open(reason);
      checkpoint();
      return changed;
    });
  }

  function select(target, reason = 'programmatic') {
    return lifecycle.run('select', (checkpoint) => {
      const index = typeof target === 'number' ? target : optionElements.indexOf(target);
      if (!Number.isInteger(index) || index < 0 || index >= optionElements.length) {
        throw new RangeError('Select option is not managed by this controller.');
      }
      if (isDisabled(optionElements[index])) return false;
      if (index === selectedIndex) {
        if (layer.isOpen) layer.close('select');
        return false;
      }

      const detail = {
        controller,
        index,
        option: optionElements[index],
        previousValue: selectedIndex >= 0 ? values[selectedIndex] : null,
        reason,
        value: values[index],
      };
      const allowed = dispatch(listbox, 'ct:beforevaluechange', detail, true);
      checkpoint();
      if (!allowed) return false;

      selectedIndex = index;
      syncSelection(checkpoint);
      options.onValueChange?.(detail);
      checkpoint();
      dispatch(listbox, 'ct:valuechange', detail);
      checkpoint();
      if (layer.isOpen) layer.close('select');
      return true;
    });
  }

  function setValue(value, reason = 'programmatic') {
    lifecycle.assertAlive();
    if (value == null) {
      throw new TypeError('Select menu value cannot be null; select an explicit option.');
    }
    const index = values.indexOf(String(value));
    if (index < 0) throw new RangeError(`Unknown select menu value: ${value}.`);
    return select(index, reason);
  }

  function onTriggerKeyDown(event) {
    if (isDisabled(trigger)) {
      if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageUp', 'PageDown', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
      }
      return;
    }

    if (event.key === 'Tab' && layer.isOpen) {
      /* APG select-only combobox: Tab commits the visually focused option
         before the browser moves focus on — otherwise keyboard users
         silently keep the old value where mouse users' click commits. */
      if (activeIndex >= 0 && activeIndex !== selectedIndex) select(activeIndex, 'keyboard');
      if (layer.isOpen) close('tab', { restoreFocus: false });
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!layer.isOpen) open('keyboard');
      else if (activeIndex >= 0) select(activeIndex, 'keyboard');
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!layer.isOpen) {
        open('keyboard');
        return;
      }
      const start = activeIndex >= 0 ? activeIndex : selectedIndex;
      setActive(nextEnabledIndex(optionElements, start, event.key === 'ArrowDown' ? 1 : -1, true));
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (!layer.isOpen) open('keyboard');
      setActive(boundaryEnabledIndex(optionElements, event.key === 'End'));
      return;
    }

    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      if (!layer.isOpen) open('keyboard');
      const direction = event.key === 'PageDown' ? 1 : -1;
      let index = activeIndex >= 0 ? activeIndex : selectedIndex;
      for (let step = 0; step < 10; step += 1) {
        const next = nextEnabledIndex(optionElements, index, direction, false);
        if (next < 0) break;
        index = next;
      }
      if (index >= 0) setActive(index);
      return;
    }

    const match = typeahead.find(event, optionElements, activeIndex >= 0 ? activeIndex : selectedIndex);
    if (match >= 0) {
      event.preventDefault();
      if (layer.isOpen) setActive(match);
      else select(match, 'typeahead');
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
    if (!isDisabled(trigger)) toggle('trigger');
  });
  disposables.listen(trigger, 'keydown', onTriggerKeyDown);
  optionElements.forEach((option, index) => {
    disposables.listen(option, 'pointermove', (event) => {
      if (event.pointerType !== 'touch') setActive(index);
    });
    disposables.listen(option, 'click', (event) => {
      event.preventDefault();
      if (!isDisabled(option)) select(index, 'pointer');
    });
  });

  controller = Object.freeze({
    get root() {
      return root;
    },
    get trigger() {
      return trigger;
    },
    get listbox() {
      return listbox;
    },
    get options() {
      return [...optionElements];
    },
    get isOpen() {
      return layer.isOpen;
    },
    get value() {
      return selectedIndex >= 0 ? values[selectedIndex] : null;
    },
    open,
    close,
    toggle,
    select,
    setValue,
    destroy() {
      if (!lifecycle.destroy()) return;
      layer.destroy();
      typeahead.reset();
      disposables.dispose();
      attributes.restore();
      if (valueElement) valueElement.textContent = originalValueText;
      controllers.delete(trigger);
    },
  });

  controllers.set(trigger, controller);
  syncSelection();
  layer.activateInitialOpen();
  if (layer.isOpen) {
    const initial = selectedIndex >= 0 ? selectedIndex : boundaryEnabledIndex(optionElements);
    if (initial >= 0) setActive(initial);
  }
  return controller;
}
