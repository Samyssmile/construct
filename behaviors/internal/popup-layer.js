import {
  createControllerLifecycle,
  dispatch,
  ensureId,
  eventTargetsOutside,
  focusElement,
  isComposingEvent,
  isElement,
} from './dom.js';
import { consumeTopOverlayEvent, pushOverlay } from './overlay.js';

export function createPopupLayer({
  additionalControls = [],
  attributes,
  closeOnEscape = true,
  closeOnFocusOutside = false,
  closeOnOutside = true,
  disposables,
  getController,
  hasPopup,
  handlesTab = false,
  idPrefix,
  initialOpen,
  insideElements = [],
  onClose,
  onOpen,
  popup,
  returnFocus = true,
  shouldCloseOnFocusOutside = () => true,
  stateElement = popup,
  trigger,
}) {
  const document = trigger.ownerDocument;
  const token = {};
  const lifecycle = createControllerLifecycle('Popup');
  let open = Boolean(initialOpen);
  let removeFromStack = null;

  const popupId = ensureId(popup, idPrefix, attributes);
  const controls = [trigger, ...additionalControls];
  controls.forEach((control) => {
    attributes.set(control, 'aria-haspopup', hasPopup);
    attributes.set(control, 'aria-controls', popupId);
  });

  function sync() {
    controls.forEach((control) => attributes.set(control, 'aria-expanded', String(open)));
    attributes.set(stateElement, 'data-state', open ? 'open' : 'closed');
    attributes.set(popup, 'hidden', open ? null : '');
  }

  function restorePopupFocus() {
    if (focusElement(trigger)) return true;

    const active = document.activeElement;
    if (isElement(active) && popup.contains(active) && typeof active.blur === 'function') {
      active.blur();
    }
    return false;
  }

  function registerOverlay() {
    return pushOverlay(document, token, {
      focusScopes: [popup],
      handlesTab,
      onOwnerClose: () => closePopup('owner-close', { restoreFocus: false }),
      onOwnerDestroy: () => getController().destroy(),
      trigger,
    });
  }

  function openPopup(reason = 'programmatic') {
    return lifecycle.run('open', (checkpoint) => {
      if (open) return false;

      const detail = { controller: getController(), reason };
      const allowed = dispatch(popup, 'ct:beforeopen', detail, true);
      checkpoint();
      if (!allowed) return false;

      open = true;
      sync();
      removeFromStack = registerOverlay();
      try {
        onOpen?.(detail, checkpoint);
        checkpoint();
      } catch (error) {
        if (lifecycle.isAlive) {
          open = false;
          sync();
          removeFromStack?.();
          removeFromStack = null;
          if (returnFocus) restorePopupFocus();
        }
        throw error;
      }
      dispatch(popup, 'ct:open', detail);
      checkpoint();
      return true;
    });
  }

  function closePopup(reason = 'programmatic', { restoreFocus = returnFocus } = {}) {
    return lifecycle.run('close', (checkpoint) => {
      if (!open) return false;

      const detail = { controller: getController(), reason };
      const allowed = dispatch(popup, 'ct:beforeclose', detail, true);
      checkpoint();
      if (!allowed) return false;

      open = false;
      sync();
      removeFromStack?.();
      removeFromStack = null;
      if (restoreFocus) {
        restorePopupFocus();
        checkpoint();
      }
      onClose?.(detail, checkpoint);
      checkpoint();
      dispatch(popup, 'ct:close', detail);
      checkpoint();
      return true;
    });
  }

  function togglePopup(reason = 'programmatic') {
    lifecycle.assertAlive();
    return open ? closePopup(reason) : openPopup(reason);
  }

  disposables.listen(document, 'keydown', (event) => {
    if (
      !open ||
      !closeOnEscape ||
      event.key !== 'Escape' ||
      isComposingEvent(event) ||
      !consumeTopOverlayEvent(event, document, token)
    ) return;
    event.preventDefault();
    event.stopPropagation();
    closePopup('escape');
  }, true);

  disposables.listen(document, 'pointerdown', (event) => {
    if (
      open &&
      closeOnOutside &&
      eventTargetsOutside(event, [trigger, popup, ...additionalControls, ...insideElements]) &&
      consumeTopOverlayEvent(event, document, token)
    ) {
      closePopup('outside', { restoreFocus: false });
    }
  }, true);

  disposables.listen(document, 'focusin', (event) => {
    if (
      open &&
      closeOnFocusOutside &&
      shouldCloseOnFocusOutside(event) &&
      eventTargetsOutside(event, [trigger, popup, ...additionalControls, ...insideElements]) &&
      consumeTopOverlayEvent(event, document, token)
    ) {
      closePopup('focus-outside', { restoreFocus: false });
    }
  }, true);

  sync();

  return {
    get isOpen() {
      return open;
    },
    open: openPopup,
    close: closePopup,
    toggle: togglePopup,
    activateInitialOpen() {
      lifecycle.assertAlive();
      if (!open || removeFromStack) return;
      removeFromStack = registerOverlay();
    },
    destroy() {
      if (!lifecycle.destroy()) return;
      open = false;
      removeFromStack?.();
      removeFromStack = null;
    },
  };
}
