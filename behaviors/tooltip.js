import {
  assertElement,
  assertFunction,
  createAttributeStore,
  createControllerLifecycle,
  createDisposables,
  dispatch,
  ensureId,
  eventTargetsOutside,
} from './internal/dom.js';
import { consumeTopOverlayEvent, pushOverlay } from './internal/overlay.js';

const controllers = new WeakMap();

/**
 * Creates a tooltip controller that works with keyboard focus, hover-capable
 * pointers, Escape, and touch without depending on sticky hover state.
 */
export function createTooltipController(options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Tooltip controller options are required.');
  }

  const trigger = assertElement(options.trigger, 'options.trigger');
  const existing = controllers.get(trigger);
  if (existing) return existing;
  const tooltip = assertElement(options.tooltip, 'options.tooltip');
  const root = assertElement(options.root ?? tooltip.closest('.ct-tooltip') ?? tooltip, 'options.root');
  if (trigger.ownerDocument !== tooltip.ownerDocument || trigger.ownerDocument !== root.ownerDocument) {
    throw new TypeError('Tooltip elements must belong to the same document.');
  }
  assertFunction(options.onOpen, 'options.onOpen');
  assertFunction(options.onClose, 'options.onClose');

  const attributes = createAttributeStore();
  const lifecycle = createControllerLifecycle('Tooltip');
  const disposables = createDisposables();
  const document = trigger.ownerDocument;
  const token = {};
  const openDelay = options.openDelay ?? 400;
  const closeDelay = options.closeDelay ?? 100;
  if (!Number.isFinite(openDelay) || openDelay < 0 || !Number.isFinite(closeDelay) || closeDelay < 0) {
    throw new RangeError('Tooltip delays must be non-negative finite numbers.');
  }

  let controller;
  let open = options.open ?? root.getAttribute('data-state') === 'open';
  let timer;
  let removeFromStack = null;
  let tooltipHovered = false;
  let triggerHovered = false;
  let focused = false;
  let touchOpened = false;

  const tooltipId = ensureId(tooltip, 'ct-tooltip', attributes);
  const describedBy = new Set((trigger.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean));
  describedBy.add(tooltipId);
  attributes.set(trigger, 'aria-describedby', [...describedBy].join(' '));
  attributes.set(tooltip, 'role', 'tooltip');

  function sync() {
    attributes.set(root, 'data-state', open ? 'open' : 'closed');
    attributes.set(tooltip, 'hidden', open ? null : '');
  }

  function clearTimer() {
    if (timer) clearTimeout(timer);
    timer = undefined;
  }

  function registerOverlay() {
    return pushOverlay(document, token, {
      focusScopes: [tooltip],
      onOwnerClose: () => closeTooltip('owner-close'),
      onOwnerDestroy: () => controller.destroy(),
      trigger,
    });
  }

  function openTooltip(reason = 'programmatic') {
    return lifecycle.run('open', (checkpoint) => {
      clearTimer();
      if (open) return false;
      const detail = { controller, reason };
      const allowed = dispatch(tooltip, 'ct:beforeopen', detail, true);
      checkpoint();
      if (!allowed) return false;

      open = true;
      sync();
      removeFromStack = registerOverlay();
      try {
        options.onOpen?.(detail);
        checkpoint();
      } catch (error) {
        if (lifecycle.isAlive) {
          open = false;
          sync();
          removeFromStack?.();
          removeFromStack = null;
        }
        throw error;
      }
      dispatch(tooltip, 'ct:open', detail);
      checkpoint();
      return true;
    });
  }

  function closeTooltip(reason = 'programmatic') {
    return lifecycle.run('close', (checkpoint) => {
      clearTimer();
      if (!open) return false;
      const detail = { controller, reason };
      const allowed = dispatch(tooltip, 'ct:beforeclose', detail, true);
      checkpoint();
      if (!allowed) return false;

      open = false;
      touchOpened = false;
      sync();
      removeFromStack?.();
      removeFromStack = null;
      options.onClose?.(detail);
      checkpoint();
      dispatch(tooltip, 'ct:close', detail);
      checkpoint();
      return true;
    });
  }

  function scheduleOpen(reason, delay = openDelay) {
    clearTimer();
    timer = setTimeout(() => openTooltip(reason), delay);
  }

  function scheduleClose(reason, delay = closeDelay) {
    clearTimer();
    timer = setTimeout(() => closeTooltip(reason), delay);
  }

  disposables.listen(trigger, 'pointerenter', (event) => {
    if (event.pointerType !== 'touch') {
      triggerHovered = true;
      scheduleOpen('hover');
    }
  });
  disposables.listen(trigger, 'pointerleave', (event) => {
    if (event.pointerType !== 'touch') {
      triggerHovered = false;
      if (!tooltipHovered && !focused && !touchOpened) scheduleClose('hover');
    }
  });
  disposables.listen(tooltip, 'pointerenter', (event) => {
    if (event.pointerType !== 'touch') {
      tooltipHovered = true;
      clearTimer();
    }
  });
  disposables.listen(tooltip, 'pointerleave', (event) => {
    if (event.pointerType !== 'touch') {
      tooltipHovered = false;
      if (!triggerHovered && !focused && !touchOpened) scheduleClose('hover');
    }
  });
  disposables.listen(trigger, 'focus', () => {
    focused = true;
    scheduleOpen('focus', 0);
  });
  disposables.listen(trigger, 'blur', () => {
    focused = false;
    if (!triggerHovered && !tooltipHovered && !touchOpened) scheduleClose('blur', 0);
  });
  disposables.listen(trigger, 'pointerdown', (event) => {
    if (event.pointerType === 'touch') {
      if (touchOpened || open) {
        touchOpened = false;
        closeTooltip('touch');
      } else {
        touchOpened = openTooltip('touch') || open;
      }
    }
  });
  disposables.listen(document, 'keydown', (event) => {
    if (open && event.key === 'Escape' && consumeTopOverlayEvent(event, document, token)) {
      event.preventDefault();
      event.stopPropagation();
      closeTooltip('escape');
    }
  }, true);
  disposables.listen(document, 'pointerdown', (event) => {
    if (
      open &&
      eventTargetsOutside(event, [trigger, tooltip]) &&
      consumeTopOverlayEvent(event, document, token)
    ) {
      touchOpened = false;
      closeTooltip('outside');
    }
  }, true);

  controller = Object.freeze({
    get root() {
      return root;
    },
    get trigger() {
      return trigger;
    },
    get tooltip() {
      return tooltip;
    },
    get isOpen() {
      return open;
    },
    open: openTooltip,
    close: closeTooltip,
    destroy() {
      if (!lifecycle.destroy()) return;
      open = false;
      clearTimer();
      removeFromStack?.();
      removeFromStack = null;
      disposables.dispose();
      attributes.restore();
      controllers.delete(trigger);
    },
  });

  controllers.set(trigger, controller);
  sync();
  if (open) removeFromStack = registerOverlay();
  return controller;
}
