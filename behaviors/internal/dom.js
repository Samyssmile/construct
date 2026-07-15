const documentCounters = new WeakMap();

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'details > summary:first-of-type',
  'iframe',
  'object',
  'embed',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function isElement(value) {
  return value?.nodeType === 1 && typeof value.matches === 'function';
}

export function assertElement(value, name) {
  if (!isElement(value)) {
    throw new TypeError(`${name} must be a DOM Element.`);
  }

  return value;
}

export function assertElements(value, name) {
  if (value == null) return [];

  const elements = isElement(value) ? [value] : Array.from(value);
  elements.forEach((element, index) => assertElement(element, `${name}[${index}]`));
  return elements;
}

export function assertSameDocument(elements, document, name) {
  elements.forEach((element, index) => {
    if (element.ownerDocument !== document) {
      throw new TypeError(`${name}[${index}] must belong to the same document.`);
    }
  });

  return elements;
}

export function assertDescendants(elements, container, name) {
  elements.forEach((element, index) => {
    if (element === container || !container.contains(element)) {
      throw new TypeError(`${name}[${index}] must be a descendant of its composite container.`);
    }
  });

  return elements;
}

export function assertUniqueElements(elements, name) {
  if (new Set(elements).size !== elements.length) {
    throw new TypeError(`${name} must not contain duplicate Elements.`);
  }

  return elements;
}

export function assertChoice(value, choices, name) {
  if (!choices.includes(value)) {
    throw new TypeError(`${name} must be one of: ${choices.join(', ')}.`);
  }

  return value;
}

export function assertFunction(value, name) {
  if (value != null && typeof value !== 'function') {
    throw new TypeError(`${name} must be a function.`);
  }

  return value;
}

export function isDisabled(element) {
  let nativelyDisabled = false;
  try {
    nativelyDisabled = element.matches(':disabled');
  } catch {
    // Non-HTML DOM implementations may not support the :disabled selector.
  }

  return Boolean(
    nativelyDisabled ||
      element.disabled ||
      element.getAttribute('aria-disabled') === 'true' ||
      element.closest('[inert]'),
  );
}

export function isRendered(element) {
  if (element.hidden || element.closest('[hidden]')) return false;

  const view = element.ownerDocument.defaultView;
  if (!view) return true;

  for (let current = element; isElement(current); current = current.parentElement) {
    const style = view.getComputedStyle(current);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
  }

  return element.getClientRects().length > 0;
}

export function getFocusableElements(container) {
  assertElement(container, 'container');

  const candidates = [];
  if (container.matches(FOCUSABLE_SELECTOR)) candidates.push(container);
  candidates.push(...container.querySelectorAll(FOCUSABLE_SELECTOR));

  return candidates.filter(
    (element) =>
      !isDisabled(element) &&
      element.getAttribute('aria-hidden') !== 'true' &&
      isRendered(element),
  );
}

export function focusElement(element) {
  if (!isElement(element) || !element.isConnected || typeof element.focus !== 'function') {
    return false;
  }

  element.focus({ preventScroll: true });
  return element.ownerDocument.activeElement === element;
}

export function createAttributeStore() {
  const originals = new Map();

  function remember(element, name) {
    let attributes = originals.get(element);
    if (!attributes) {
      attributes = new Map();
      originals.set(element, attributes);
    }

    if (!attributes.has(name)) {
      attributes.set(name, element.hasAttribute(name) ? element.getAttribute(name) : null);
    }
  }

  return {
    set(element, name, value = '') {
      remember(element, name);
      if (value == null || value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : String(value));
      }
    },

    restore() {
      for (const [element, attributes] of originals) {
        for (const [name, value] of attributes) {
          if (value == null) element.removeAttribute(name);
          else element.setAttribute(name, value);
        }
      }
      originals.clear();
    },
  };
}

export function createDisposables() {
  const disposables = [];
  let disposed = false;

  return {
    add(disposable) {
      if (typeof disposable !== 'function') {
        throw new TypeError('A disposable must be a function.');
      }
      if (disposed) disposable();
      else disposables.push(disposable);
      return disposable;
    },

    listen(target, type, listener, options) {
      target.addEventListener(type, listener, options);
      return this.add(() => target.removeEventListener(type, listener, options));
    },

    dispose() {
      if (disposed) return;
      disposed = true;

      const errors = [];
      for (const disposable of disposables.splice(0).reverse()) {
        try {
          disposable();
        } catch (error) {
          errors.push(error);
        }
      }

      if (errors.length === 1) throw errors[0];
      if (errors.length > 1) throw new AggregateError(errors, 'Multiple cleanup operations failed.');
    },
  };
}

export function ensureId(element, prefix, attributes) {
  if (element.id) return element.id;

  const document = element.ownerDocument;
  let next = documentCounters.get(document) ?? 0;
  let id;
  do {
    next += 1;
    id = `${prefix}-${next}`;
  } while (document.getElementById(id));
  documentCounters.set(document, next);
  attributes.set(element, 'id', id);
  return id;
}

export function getItemValue(element, index) {
  return element.getAttribute('data-value') ?? element.getAttribute('value') ?? (element.id || String(index));
}

export function getTextLabel(element) {
  return (element.getAttribute('aria-label') ?? element.textContent ?? '').trim().replace(/\s+/g, ' ');
}

export function nextEnabledIndex(items, currentIndex, delta, loop = true) {
  if (!items.length) return -1;

  let index = currentIndex;
  for (let attempts = 0; attempts < items.length; attempts += 1) {
    index += delta;
    if (loop) index = (index + items.length) % items.length;
    if (!loop && (index < 0 || index >= items.length)) return currentIndex;
    if (!isDisabled(items[index])) return index;
  }

  return currentIndex;
}

export function boundaryEnabledIndex(items, fromEnd = false) {
  const indices = fromEnd
    ? Array.from({ length: items.length }, (_, index) => items.length - index - 1)
    : Array.from(items.keys());
  return indices.find((index) => !isDisabled(items[index])) ?? -1;
}

export function orientationDelta(key, orientation, element) {
  if (orientation === 'vertical') {
    if (key === 'ArrowDown') return 1;
    if (key === 'ArrowUp') return -1;
    return 0;
  }

  const direction = element.ownerDocument.defaultView?.getComputedStyle(element).direction;
  const rtlMultiplier = direction === 'rtl' ? -1 : 1;
  if (key === 'ArrowRight') return rtlMultiplier;
  if (key === 'ArrowLeft') return -rtlMultiplier;
  return 0;
}

export function createTypeahead({ timeout = 500 } = {}) {
  if (!Number.isFinite(timeout) || timeout < 0) {
    throw new RangeError('Typeahead timeout must be a non-negative finite number.');
  }

  let query = '';
  let timer;

  function reset() {
    query = '';
    if (timer) clearTimeout(timer);
    timer = undefined;
  }

  return {
    find(event, items, currentIndex = -1) {
      if (
        event.key.length !== 1 ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.isComposing
      ) {
        return -1;
      }

      const character = event.key.toLocaleLowerCase();
      query = query.length === 1 && query === character ? character : query + character;
      if (timer) clearTimeout(timer);
      timer = setTimeout(reset, timeout);

      const ordered = [
        ...items.slice(currentIndex + 1),
        ...items.slice(0, currentIndex + 1),
      ];
      const match = ordered.find(
        (item) => !isDisabled(item) && getTextLabel(item).toLocaleLowerCase().startsWith(query),
      );
      return match ? items.indexOf(match) : -1;
    },
    reset,
  };
}

export function createControllerLifecycle(name) {
  let destroyed = false;
  let activeTransaction = null;

  function assertAlive() {
    if (destroyed) throw new Error(`${name} controller has been destroyed.`);
  }

  return Object.freeze({
    get isAlive() {
      return !destroyed;
    },

    assertAlive,

    run(operation, callback) {
      assertAlive();
      if (activeTransaction) return false;

      const token = {};
      activeTransaction = { operation, token };
      const checkpoint = () => {
        assertAlive();
        if (activeTransaction?.token !== token) {
          throw new Error(`${name} controller transaction is no longer active.`);
        }
      };

      try {
        const result = callback(checkpoint);
        checkpoint();
        return result;
      } finally {
        if (activeTransaction?.token === token) activeTransaction = null;
      }
    },

    destroy() {
      if (destroyed) return false;
      destroyed = true;
      activeTransaction = null;
      return true;
    },
  });
}

export function dispatch(element, type, detail, cancelable = false) {
  const EventConstructor = element.ownerDocument.defaultView?.CustomEvent;
  if (!EventConstructor) return true;

  return element.dispatchEvent(
    new EventConstructor(type, {
      bubbles: true,
      cancelable,
      detail,
    }),
  );
}

export function eventTargetsOutside(event, elements) {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
  return elements.every(
    (element) => !path.includes(element) && !element.contains(event.target),
  );
}
