import {
  assertElement,
  assertElements,
  assertFunction,
  assertSameDocument,
  createAttributeStore,
  createControllerLifecycle,
  createDisposables,
  focusElement,
  getFocusableElements,
  isDisabled,
  isElement,
} from './internal/dom.js';
import { createPopupLayer } from './internal/popup-layer.js';

const controllers = new WeakMap();

function resolveFocusTarget(initialFocus, popover) {
  let target = initialFocus;
  if (typeof target === 'function') target = target();
  if (typeof target === 'string') {
    target = popover.querySelector(target);
    if (!target) throw new TypeError('initialFocus selector did not match an Element inside popover.');
  }
  if (target == null) target = popover.querySelector('[autofocus]');
  if (target == null) target = getFocusableElements(popover)[0];
  if (target != null && (!isElement(target) || !popover.contains(target))) {
    throw new TypeError('initialFocus must resolve to an Element inside popover.');
  }
  return target;
}

function validateInitialFocus(initialFocus, popover) {
  if (initialFocus == null || typeof initialFocus === 'function') return;
  if (typeof initialFocus === 'string') {
    if (!popover.querySelector(initialFocus)) {
      throw new TypeError('initialFocus selector did not match an Element inside popover.');
    }
    return;
  }
  if (!isElement(initialFocus) || !popover.contains(initialFocus)) {
    throw new TypeError('initialFocus must be an Element inside popover, a selector, or a function.');
  }
}

/**
 * Creates a non-modal popover controller. Click/touch activation is always
 * available; focus and hover activation can be enabled independently.
 */
export function createPopoverController(options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Popover controller options are required.');
  }

  const trigger = assertElement(options.trigger, 'options.trigger');
  const existing = controllers.get(trigger);
  if (existing) return existing;
  const popover = assertElement(options.popover, 'options.popover');
  const root = assertElement(options.root ?? popover.closest('.ct-popover') ?? popover, 'options.root');
  const closeButtons = options.closeButtons == null
    ? [...popover.querySelectorAll('[data-ct-dismiss]')]
    : assertElements(options.closeButtons, 'options.closeButtons');
  if (trigger.ownerDocument !== popover.ownerDocument || trigger.ownerDocument !== root.ownerDocument) {
    throw new TypeError('Popover elements must belong to the same document.');
  }
  assertSameDocument(closeButtons, trigger.ownerDocument, 'options.closeButtons');
  assertFunction(options.onOpen, 'options.onOpen');
  assertFunction(options.onClose, 'options.onClose');
  validateInitialFocus(options.initialFocus, popover);

  const attributes = createAttributeStore();
  const lifecycle = createControllerLifecycle('Popover');
  const disposables = createDisposables();
  const document = trigger.ownerDocument;
  const openDelay = options.openDelay ?? 150;
  const closeDelay = options.closeDelay ?? 100;
  if (!Number.isFinite(openDelay) || openDelay < 0 || !Number.isFinite(closeDelay) || closeDelay < 0) {
    throw new RangeError('Popover delays must be non-negative finite numbers.');
  }

  let controller;
  let timer;
  let pendingFocus = false;
  let pointerDownOnTrigger = false;
  let ignoreNextClick = false;
  let hovered = false;

  const existingRole = popover.getAttribute('role');
  const popupRole = ['dialog', 'grid', 'listbox', 'menu', 'tree'].includes(existingRole)
    ? existingRole
    : 'dialog';
  attributes.set(popover, 'role', popupRole);
  if (trigger.tagName === 'BUTTON' && !trigger.hasAttribute('type')) {
    attributes.set(trigger, 'type', 'button');
  }

  function clearTimer() {
    if (timer) clearTimeout(timer);
    timer = undefined;
  }

  function focusInside(checkpoint = lifecycle.assertAlive) {
    const target = resolveFocusTarget(options.initialFocus, popover);
    checkpoint();
    if (target) {
      focusElement(target);
      checkpoint();
    }
  }

  const layer = createPopupLayer({
    attributes,
    closeOnEscape: options.closeOnEscape !== false,
    closeOnFocusOutside: options.closeOnFocusOutside !== false,
    closeOnOutside: options.closeOnOutside !== false,
    disposables,
    getController: () => controller,
    hasPopup: popupRole,
    idPrefix: 'ct-popover-content',
    initialOpen: !isDisabled(trigger) && (options.open ?? root.getAttribute('data-state') === 'open'),
    popup: popover,
    shouldCloseOnFocusOutside: () => !hovered,
    stateElement: root,
    trigger,
    onOpen(detail, checkpoint) {
      clearTimer();
      if (pendingFocus) focusInside(checkpoint);
      else checkpoint();
      options.onOpen?.(detail);
    },
    onClose(detail) {
      clearTimer();
      options.onClose?.(detail);
    },
  });

  function open(
    reason = 'programmatic',
    { focus = Boolean(options.initialFocus || options.focusOnOpen) } = {},
  ) {
    return lifecycle.run('open', (checkpoint) => {
      if (isDisabled(trigger)) return false;
      pendingFocus = focus;
      try {
        const changed = layer.open(reason);
        checkpoint();
        return changed;
      } finally {
        pendingFocus = false;
      }
    });
  }

  function scheduleOpen(reason) {
    clearTimer();
    timer = setTimeout(() => open(reason, { focus: false }), openDelay);
  }

  function scheduleClose(reason) {
    clearTimer();
    timer = setTimeout(() => {
      const active = document.activeElement;
      if (hovered || trigger.contains(active) || popover.contains(active)) return;
      close(reason, { restoreFocus: false });
    }, closeDelay);
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
      /* Same focus-entry default as open(): configuring initialFocus means
         trigger activation must move focus in too, or keyboard users may
         never reach popover content rendered elsewhere in the DOM. */
      pendingFocus = Boolean(options.initialFocus || options.focusOnOpen);
      try {
        const changed = layer.toggle(reason);
        checkpoint();
        return changed;
      } finally {
        pendingFocus = false;
      }
    });
  }

  disposables.listen(trigger, 'pointerdown', () => {
    pointerDownOnTrigger = true;
  });
  disposables.listen(trigger, 'click', (event) => {
    event.preventDefault();
    pointerDownOnTrigger = false;
    if (isDisabled(trigger)) return;
    if (ignoreNextClick) {
      ignoreNextClick = false;
      return;
    }
    toggle('trigger');
  });
  disposables.listen(trigger, 'pointercancel', () => {
    pointerDownOnTrigger = false;
    ignoreNextClick = false;
  });
  disposables.listen(trigger, 'pointerup', () => {
    pointerDownOnTrigger = false;
  });

  if (options.openOnFocus) {
    disposables.listen(trigger, 'focus', () => {
      if (pointerDownOnTrigger) ignoreNextClick = true;
      open('focus', { focus: false });
    });
  }

  if (options.openOnHover) {
    /* When no wrapper root exists, root falls back to the (hidden) popover,
       which can never receive pointerenter — hover must then be driven by
       the trigger as well. */
    const hoverTargets = root.contains(trigger) ? [root] : [root, trigger];
    hoverTargets.forEach((target) => {
      disposables.listen(target, 'pointerenter', (event) => {
        if (event.pointerType !== 'touch') {
          hovered = true;
          scheduleOpen('hover');
        }
      });
      disposables.listen(target, 'pointerleave', (event) => {
        if (event.pointerType !== 'touch') {
          hovered = false;
          scheduleClose('hover');
        }
      });
    });
  }

  closeButtons.forEach((button) => {
    disposables.listen(button, 'click', (event) => {
      event.preventDefault();
      if (!isDisabled(button)) close('dismiss');
    });
  });

  controller = Object.freeze({
    get root() {
      return root;
    },
    get trigger() {
      return trigger;
    },
    get popover() {
      return popover;
    },
    get isOpen() {
      return layer.isOpen;
    },
    open,
    close,
    toggle,
    destroy() {
      if (!lifecycle.destroy()) return;
      clearTimer();
      layer.destroy();
      disposables.dispose();
      attributes.restore();
      controllers.delete(trigger);
    },
  });

  controllers.set(trigger, controller);
  layer.activateInitialOpen();
  return controller;
}
