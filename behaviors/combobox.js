import {
  assertChoice,
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
  dispatch,
  ensureId,
  focusElement,
  getTextLabel,
  isDisabled,
  nextEnabledIndex,
} from './internal/dom.js';
import { createPopupLayer } from './internal/popup-layer.js';

const controllers = new WeakMap();

function isAvailable(option) {
  if (isDisabled(option) || option.hidden || option.getAttribute('aria-hidden') === 'true') return false;
  const view = option.ownerDocument.defaultView;
  if (!view) return true;
  const style = view.getComputedStyle(option);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.visibility !== 'collapse';
}

/**
 * Creates an editable ARIA combobox with virtual listbox focus, optional local
 * filtering, selection, status announcements, and a separately operable toggle.
 */
export function createComboboxController(options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Combobox controller options are required.');
  }

  const input = assertElement(options.input, 'options.input');
  const existing = controllers.get(input);
  if (existing) return existing;
  if (input.tagName !== 'INPUT' && input.tagName !== 'TEXTAREA') {
    throw new TypeError('options.input must be an input or textarea element.');
  }

  const listbox = assertElement(options.listbox, 'options.listbox');
  const root = assertElement(options.root ?? listbox.closest('.ct-combobox') ?? listbox, 'options.root');
  const toggleButton = options.toggleButton == null
    ? null
    : assertElement(options.toggleButton, 'options.toggleButton');
  const optionElements = options.options == null
    ? [...listbox.querySelectorAll('[role="option"], [data-ct-option]')]
    : assertElements(options.options, 'options.options');
  if (!optionElements.length) throw new TypeError('Combobox controller requires at least one option.');
  if ([root, listbox, toggleButton].filter(Boolean).some((element) => element.ownerDocument !== input.ownerDocument)) {
    throw new TypeError('Combobox elements must belong to the same document.');
  }
  assertUniqueElements(optionElements, 'options.options');
  assertSameDocument(optionElements, input.ownerDocument, 'options.options');
  assertDescendants(optionElements, listbox, 'options.options');

  const autocomplete = assertChoice(
    options.autocomplete ?? 'list',
    ['list', 'none'],
    'options.autocomplete',
  );
  const callbacks = [
    'filter',
    'formatStatus',
    'getOptionLabel',
    'getOptionValue',
    'onClose',
    'onOpen',
    'onQueryChange',
    'onValueChange',
  ];
  callbacks.forEach((name) => {
    if (name === 'filter' && typeof options.filter === 'boolean') return;
    assertFunction(options[name], `options.${name}`);
  });

  const attributes = createAttributeStore();
  const lifecycle = createControllerLifecycle('Combobox');
  const disposables = createDisposables();
  const getLabel = options.getOptionLabel ?? getTextLabel;
  const getValue = options.getOptionValue ?? ((option, index) =>
    option.getAttribute('data-value') ?? option.getAttribute('value') ?? getLabel(option, index));
  const values = optionElements.map((option, index) => String(getValue(option, index)));
  if (new Set(values).size !== values.length) {
    throw new TypeError('Combobox option values must be unique.');
  }

  const status = options.status == null ? null : assertElement(options.status, 'options.status');
  if (status) assertSameDocument([status], input.ownerDocument, 'options.status');
  const originalStatusText = status?.textContent;
  const originalInputValue = input.value;
  const filter = options.filter === true
    ? (option, query, index) => getLabel(option, index).toLocaleLowerCase().includes(query.toLocaleLowerCase())
    : options.filter;
  let controller;
  let activeIndex = -1;
  let selectedIndex = options.value == null
    ? optionElements.findIndex((option) => option.getAttribute('aria-selected') === 'true')
    : values.indexOf(String(options.value));
  if (options.value != null && selectedIndex < 0) {
    throw new RangeError(`Unknown combobox value: ${options.value}.`);
  }
  if (selectedIndex >= 0 && isDisabled(optionElements[selectedIndex])) selectedIndex = -1;

  attributes.set(input, 'role', 'combobox');
  attributes.set(input, 'aria-autocomplete', autocomplete);
  attributes.set(listbox, 'role', 'listbox');
  optionElements.forEach((option) => {
    attributes.set(option, 'role', 'option');
    attributes.set(option, 'tabindex', '-1');
    ensureId(option, 'ct-combobox-option', attributes);
  });
  if (toggleButton && !toggleButton.hasAttribute('type') && toggleButton.tagName === 'BUTTON') {
    attributes.set(toggleButton, 'type', 'button');
  }
  if (status) {
    attributes.set(status, 'role', status.getAttribute('role') ?? 'status');
    attributes.set(status, 'aria-live', status.getAttribute('aria-live') ?? 'polite');
    attributes.set(status, 'aria-atomic', status.getAttribute('aria-atomic') ?? 'true');
  }

  function availableOptions() {
    return optionElements.filter(isAvailable);
  }

  function isInteractive() {
    return !isDisabled(input) && !input.readOnly;
  }

  function availableIndex(index, delta) {
    const available = availableOptions();
    if (!available.length) return -1;
    const currentOption = optionElements[index];
    const currentAvailableIndex = available.indexOf(currentOption);
    const next = nextEnabledIndex(
      available,
      currentAvailableIndex < 0 ? (delta > 0 ? -1 : 0) : currentAvailableIndex,
      delta,
      true,
    );
    return optionElements.indexOf(available[next]);
  }

  function setActive(index) {
    if (index < 0 || index >= optionElements.length || !isAvailable(optionElements[index])) return false;
    activeIndex = index;
    optionElements.forEach((option, optionIndex) => {
      attributes.set(option, 'data-highlighted', optionIndex === index ? '' : null);
    });
    attributes.set(input, 'aria-activedescendant', optionElements[index].id);
    optionElements[index].scrollIntoView?.({ block: 'nearest' });
    return true;
  }

  function clearActive() {
    activeIndex = -1;
    attributes.set(input, 'aria-activedescendant', null);
    optionElements.forEach((option) => attributes.set(option, 'data-highlighted', null));
  }

  function syncSelection() {
    optionElements.forEach((option, index) => {
      attributes.set(option, 'aria-selected', String(index === selectedIndex));
    });
  }

  function updateStatus(checkpoint = lifecycle.assertAlive) {
    if (!status) return;
    const count = availableOptions().length;
    const message = options.formatStatus?.(count, input.value);
    checkpoint();
    status.textContent = message ?? `${count} result${count === 1 ? '' : 's'} available`;
  }

  function applyFilterRaw(checkpoint = lifecycle.assertAlive) {
    if (filter) {
      optionElements.forEach((option, index) => {
        const visible = Boolean(filter(option, input.value, index));
        checkpoint();
        attributes.set(option, 'hidden', visible ? null : '');
      });
    }
    updateStatus(checkpoint);

    if (activeIndex >= 0 && !isAvailable(optionElements[activeIndex])) clearActive();
    return availableOptions();
  }

  function refresh() {
    const result = lifecycle.run('refresh', (checkpoint) => applyFilterRaw(checkpoint));
    return result === false ? availableOptions() : result;
  }

  const layer = createPopupLayer({
    additionalControls: toggleButton ? [toggleButton] : [],
    attributes,
    closeOnEscape: options.closeOnEscape !== false,
    closeOnFocusOutside: true,
    closeOnOutside: options.closeOnOutside !== false,
    disposables,
    getController: () => controller,
    hasPopup: 'listbox',
    handlesTab: true,
    idPrefix: 'ct-combobox-listbox',
    initialOpen: isInteractive() && (options.open ?? root.getAttribute('data-state') === 'open'),
    popup: listbox,
    returnFocus: false,
    stateElement: root,
    trigger: input,
    onOpen(detail, checkpoint) {
      const available = applyFilterRaw();
      const selected = selectedIndex >= 0 && isAvailable(optionElements[selectedIndex])
        ? selectedIndex
        : optionElements.indexOf(available[0]);
      if (selected >= 0) setActive(selected);
      focusElement(input);
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
      if (!isInteractive()) return false;
      const changed = layer.open(reason);
      checkpoint();
      return changed;
    });
  }

  function commitSelectionRaw(
    index,
    reason,
    { close = true, updateInput = true } = {},
    checkpoint = lifecycle.assertAlive,
  ) {
    if (index < -1 || index >= optionElements.length) {
      throw new RangeError('Combobox option is not managed by this controller.');
    }
    if (index >= 0 && isDisabled(optionElements[index])) return false;
    if (index === selectedIndex) {
      if (close && layer.isOpen) layer.close('select', { restoreFocus: false });
      return false;
    }

    const detail = {
      controller,
      index,
      option: index >= 0 ? optionElements[index] : null,
      previousValue: selectedIndex >= 0 ? values[selectedIndex] : null,
      reason,
      value: index >= 0 ? values[index] : null,
    };
    const allowed = dispatch(listbox, 'ct:beforevaluechange', detail, true);
    checkpoint();
    if (!allowed) return false;

    selectedIndex = index;
    syncSelection();
    if (index >= 0 && updateInput && options.setInputValue !== false) {
      const label = getLabel(optionElements[index], index);
      checkpoint();
      input.value = label;
    }
    options.onValueChange?.(detail);
    checkpoint();
    dispatch(listbox, 'ct:valuechange', detail);
    checkpoint();
    if (close && layer.isOpen) layer.close('select', { restoreFocus: false });
    return true;
  }

  function select(target, reason = 'programmatic') {
    return lifecycle.run('select', (checkpoint) => {
      const index = typeof target === 'number' ? target : optionElements.indexOf(target);
      if (!Number.isInteger(index) || index < 0 || index >= optionElements.length) {
        throw new RangeError('Combobox option is not managed by this controller.');
      }
      const changed = commitSelectionRaw(index, reason, undefined, checkpoint);
      checkpoint();
      focusElement(input);
      return changed;
    });
  }

  function setValue(value, reason = 'programmatic') {
    return lifecycle.run('set value', (checkpoint) => {
      const index = value == null ? -1 : values.indexOf(String(value));
      if (value != null && index < 0) throw new RangeError(`Unknown combobox value: ${value}.`);
      return commitSelectionRaw(index, reason, { close: false }, checkpoint);
    });
  }

  function onInput() {
    if (!isInteractive()) return;
    lifecycle.run('input', (checkpoint) => {
      let selectionChanged = false;
      if (options.clearSelectionOnInput !== false && selectedIndex >= 0) {
        const selectedLabel = getLabel(optionElements[selectedIndex], selectedIndex);
        checkpoint();
        selectionChanged = input.value !== selectedLabel;
      }
      if (selectionChanged) {
        commitSelectionRaw(-1, 'input', { close: false, updateInput: false }, checkpoint);
      }

      const available = applyFilterRaw(checkpoint);
      const detail = { controller, query: input.value, results: [...available] };
      options.onQueryChange?.(detail);
      checkpoint();
      dispatch(input, 'ct:querychange', detail);
      checkpoint();
      if (options.openOnInput !== false) layer.open('input');
      checkpoint();
      if (layer.isOpen && available.length) setActive(optionElements.indexOf(available[0]));
      return true;
    });
  }

  function onInputKeyDown(event) {
    if (!isInteractive()) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!layer.isOpen) {
        open('keyboard');
        return;
      }
      const next = availableIndex(activeIndex, event.key === 'ArrowDown' ? 1 : -1);
      if (next >= 0) setActive(next);
      return;
    }

    if (event.key === 'Enter' && layer.isOpen && activeIndex >= 0) {
      event.preventDefault();
      select(activeIndex, 'keyboard');
    } else if (event.key === 'Tab' && layer.isOpen) {
      close('tab', { restoreFocus: false });
    }
  }

  disposables.listen(input, 'input', onInput);
  disposables.listen(input, 'keydown', onInputKeyDown);
  if (options.openOnFocus !== false) {
    disposables.listen(input, 'focus', () => open('focus'));
  }
  if (toggleButton) {
    disposables.listen(toggleButton, 'mousedown', (event) => event.preventDefault());
    disposables.listen(toggleButton, 'click', (event) => {
      event.preventDefault();
      if (!isInteractive()) return;
      toggle('toggle');
      focusElement(input);
    });
  }
  optionElements.forEach((option, index) => {
    disposables.listen(option, 'pointerdown', (event) => {
      if (event.pointerType !== 'touch') event.preventDefault();
    });
    disposables.listen(option, 'pointermove', (event) => {
      if (event.pointerType !== 'touch' && isInteractive()) setActive(index);
    });
    disposables.listen(option, 'click', (event) => {
      event.preventDefault();
      if (isInteractive() && !isDisabled(option)) select(index, 'pointer');
    });
  });

  function close(reason = 'programmatic', closeOptions) {
    return lifecycle.run('close', (checkpoint) => {
      const changed = layer.close(reason, closeOptions);
      checkpoint();
      return changed;
    });
  }

  function toggle(reason = 'programmatic') {
    return lifecycle.run('toggle', (checkpoint) => {
      if (!isInteractive()) return false;
      const changed = layer.toggle(reason);
      checkpoint();
      return changed;
    });
  }

  controller = Object.freeze({
    get root() {
      return root;
    },
    get input() {
      return input;
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
    get query() {
      return input.value;
    },
    get value() {
      return selectedIndex >= 0 ? values[selectedIndex] : null;
    },
    open,
    close,
    toggle,
    select,
    setValue,
    refresh,
    destroy() {
      if (!lifecycle.destroy()) return;
      layer.destroy();
      disposables.dispose();
      attributes.restore();
      input.value = originalInputValue;
      if (status) status.textContent = originalStatusText;
      controllers.delete(input);
    },
  });

  controllers.set(input, controller);
  syncSelection();
  refresh();
  layer.activateInitialOpen();
  if (layer.isOpen) {
    const available = availableOptions();
    const initial = selectedIndex >= 0 && isAvailable(optionElements[selectedIndex])
      ? selectedIndex
      : optionElements.indexOf(available[0]);
    if (initial >= 0) setActive(initial);
  }
  return controller;
}
