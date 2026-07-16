import {
  assertChoice,
  assertElement,
  assertElements,
  assertFunction,
  assertSameDocument,
  createAttributeStore,
  createControllerLifecycle,
  createDisposables,
  dispatch,
  ensureId,
  focusElement,
  focusIntoView,
  getFocusableElements,
  isComposingEvent,
  isElement,
  isDisabled,
  warnAccessibility,
} from './dom.js';
import {
  closeOwnedOverlays,
  consumeTopOverlayEvent,
  destroyOwnedOverlays,
  getModalFocusScopes,
  isInModalFocusScope,
  isTopModalOverlay,
  lockBodyScroll,
  pushOverlay,
  topOverlayHandlesModalTab,
  trapTabKey,
} from './overlay.js';

function resolveInitialFocus(initialFocus, dialog) {
  let target = initialFocus;
  if (typeof target === 'function') target = target();
  if (typeof target === 'string') {
    target = dialog.querySelector(target);
    if (!target) throw new TypeError('initialFocus selector did not match an Element inside dialog.');
  }
  if (target == null) target = dialog.querySelector('[autofocus]');
  if (target == null) target = getFocusableElements(dialog)[0];

  if (target != null && (!isElement(target) || !dialog.contains(target))) {
    throw new TypeError('initialFocus must resolve to an Element inside dialog.');
  }

  return target;
}

function validateInitialFocus(initialFocus, dialog) {
  if (initialFocus == null || typeof initialFocus === 'function') return;
  if (typeof initialFocus === 'string') {
    if (!dialog.querySelector(initialFocus)) {
      throw new TypeError('initialFocus selector did not match an Element inside dialog.');
    }
    return;
  }
  if (!isElement(initialFocus) || !dialog.contains(initialFocus)) {
    throw new TypeError('initialFocus must be an Element inside dialog, a selector, or a function.');
  }
}

export function createDialogController(options, registry, defaults) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Dialog controller options are required.');
  }

  const container = assertElement(options.container, 'options.container');
  const existing = registry.get(container);
  if (existing) return existing;

  const dialog = assertElement(options.dialog ?? container, 'options.dialog');
  if (dialog !== container && !container.contains(dialog)) {
    throw new TypeError('options.dialog must be options.container or a descendant of it.');
  }

  const trigger = options.trigger == null ? null : assertElement(options.trigger, 'options.trigger');
  const backdrop = options.backdrop === false
    ? null
    : assertElement(options.backdrop ?? container, 'options.backdrop');
  const closeButtons = options.closeButtons == null
    ? [...dialog.querySelectorAll('[data-ct-dismiss]')]
    : assertElements(options.closeButtons, 'options.closeButtons');
  assertSameDocument(closeButtons, container.ownerDocument, 'options.closeButtons');
  if (trigger) assertSameDocument([trigger], container.ownerDocument, 'options.trigger');
  if (backdrop) assertSameDocument([backdrop], container.ownerDocument, 'options.backdrop');
  const triggerAction = assertChoice(
    options.triggerAction ?? defaults.triggerAction,
    ['open', 'toggle'],
    'options.triggerAction',
  );

  assertFunction(options.onOpen, 'options.onOpen');
  assertFunction(options.onClose, 'options.onClose');
  validateInitialFocus(options.initialFocus, dialog);

  const attributes = createAttributeStore();
  const lifecycle = createControllerLifecycle(defaults.name);
  const disposables = createDisposables();
  const document = container.ownerDocument;
  const token = {};
  const closeOnEscape = options.closeOnEscape !== false;
  const closeOnBackdrop = options.closeOnBackdrop !== false;
  const trapFocus = options.trapFocus !== false;
  const returnFocus = options.returnFocus !== false;
  const lockScroll = options.lockScroll !== false;
  const inertBackground = options.inertBackground === true;
  let open = options.open ?? container.getAttribute('data-state') === 'open';
  let previouslyFocused = null;
  let releaseBodyLock = null;
  let removeFromStack = null;
  let inertedElements = null;
  let warnedMissingName = false;

  const dialogId = ensureId(dialog, `${defaults.idPrefix}-dialog`, attributes);
  attributes.set(dialog, 'role', dialog.getAttribute('role') ?? 'dialog');
  attributes.set(dialog, 'aria-modal', 'true');
  if (trigger) {
    attributes.set(trigger, 'aria-haspopup', 'dialog');
    attributes.set(trigger, 'aria-controls', dialogId);
  }

  function syncState() {
    attributes.set(container, 'data-state', open ? 'open' : 'closed');
    attributes.set(container, 'hidden', open ? null : '');
    if (trigger) attributes.set(trigger, 'aria-expanded', String(open));
  }

  function releaseOpenResources() {
    removeFromStack?.();
    removeFromStack = null;
    releaseBodyLock?.();
    releaseBodyLock = null;
    releaseBackgroundInert();
  }

  /* aria-modal hides background content from modern AT, but legacy virtual
     cursors can still wander behind the dialog. Opt-in `inertBackground`
     additionally inerts the container's DOM siblings up to <body>. Nodes
     appended after opening (e.g. portaled popups) are unaffected. */
  function applyBackgroundInert() {
    if (!inertBackground || inertedElements) return;
    inertedElements = [];
    for (let node = container; node.parentElement && node !== document.body; node = node.parentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling === node || sibling.inert) continue;
        const tag = sibling.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'TEMPLATE') continue;
        sibling.inert = true;
        inertedElements.push(sibling);
      }
    }
  }

  function releaseBackgroundInert() {
    if (!inertedElements) return;
    for (const element of inertedElements) element.inert = false;
    inertedElements = null;
  }

  function warnWhenUnnamed() {
    if (warnedMissingName) return;
    warnedMissingName = true;
    if (!dialog.hasAttribute('aria-label') && !dialog.hasAttribute('aria-labelledby')) {
      warnAccessibility(
        `${defaults.name}: the dialog element has neither aria-labelledby nor aria-label. ` +
          'Dialogs must expose an accessible name (WCAG 4.1.2).',
      );
    }
  }

  function registerDialogOverlay() {
    return pushOverlay(document, token, {
      modal: true,
      onOwnerClose: () => closeDialog('owner-close', { restoreFocus: false }),
      onOwnerDestroy: () => controller.destroy(),
      scope: dialog,
      trigger,
    });
  }

  function focusInside(checkpoint = lifecycle.assertAlive) {
    const target = resolveInitialFocus(options.initialFocus, dialog);
    checkpoint();
    if (target && focusIntoView(target)) {
      checkpoint();
      return;
    }

    if (!dialog.hasAttribute('tabindex')) attributes.set(dialog, 'tabindex', '-1');
    focusElement(dialog);
    checkpoint();
  }

  function restoreDialogFocus(target) {
    if (focusIntoView(target)) return true;
    if (target !== trigger && focusIntoView(trigger)) return true;

    const active = document.activeElement;
    if (isElement(active) && dialog.contains(active) && typeof active.blur === 'function') {
      active.blur();
    }
    return false;
  }

  function openDialog(reason = 'programmatic') {
    return lifecycle.run('open', (checkpoint) => {
      if (open) return false;

      const detail = { controller, reason };
      const allowed = dispatch(container, 'ct:beforeopen', detail, true);
      checkpoint();
      if (!allowed) return false;

      previouslyFocused = isElement(document.activeElement) ? document.activeElement : null;
      open = true;
      syncState();
      warnWhenUnnamed();
      removeFromStack = registerDialogOverlay();
      if (lockScroll) releaseBodyLock = lockBodyScroll(document);
      applyBackgroundInert();
      try {
        focusInside(checkpoint);
        options.onOpen?.(detail);
        checkpoint();
      } catch (error) {
        if (lifecycle.isAlive) {
          open = false;
          syncState();
          releaseOpenResources();
          const focusTarget = previouslyFocused?.isConnected ? previouslyFocused : trigger;
          restoreDialogFocus(focusTarget);
          previouslyFocused = null;
        }
        throw error;
      }
      dispatch(container, 'ct:open', detail);
      checkpoint();
      return true;
    });
  }

  function closeDialog(reason = 'programmatic', { restoreFocus = returnFocus } = {}) {
    return lifecycle.run('close', (checkpoint) => {
      if (!open) return false;

      const detail = { controller, reason };
      const allowed = dispatch(container, 'ct:beforeclose', detail, true);
      checkpoint();
      if (!allowed) return false;
      if (!closeOwnedOverlays(document, token)) return false;
      checkpoint();

      open = false;
      syncState();
      releaseOpenResources();

      const focusTarget = previouslyFocused?.isConnected ? previouslyFocused : trigger;
      previouslyFocused = null;
      if (restoreFocus) {
        restoreDialogFocus(focusTarget);
        checkpoint();
      }
      options.onClose?.(detail);
      checkpoint();
      dispatch(container, 'ct:close', detail);
      checkpoint();
      return true;
    });
  }

  function toggleDialog(reason = 'programmatic') {
    lifecycle.assertAlive();
    return open ? closeDialog(reason) : openDialog(reason);
  }

  function onDocumentKeyDown(event) {
    if (!open) return;
    /* Never treat keys as dialog shortcuts while an IME composition is
       active — Escape/Tab are cancelling or committing composed text. */
    if (isComposingEvent(event)) return;

    if (
      event.key === 'Escape' &&
      closeOnEscape &&
      consumeTopOverlayEvent(event, document, token)
    ) {
      event.preventDefault();
      event.stopPropagation();
      closeDialog('escape');
      return;
    }

    if (
      trapFocus &&
      isTopModalOverlay(document, token) &&
      !topOverlayHandlesModalTab(document, token)
    ) {
      trapTabKey(event, getModalFocusScopes(document, token));
    }
  }

  function onDocumentFocusIn(event) {
    if (
      !open ||
      !trapFocus ||
      !isTopModalOverlay(document, token) ||
      isInModalFocusScope(document, token, event.target)
    ) {
      return;
    }

    focusInside();
  }

  if (trigger) {
    disposables.listen(trigger, 'click', (event) => {
      event.preventDefault();
      if (isDisabled(trigger)) return;
      if (triggerAction === 'toggle') toggleDialog('trigger');
      else openDialog('trigger');
    });
  }

  closeButtons.forEach((button) => {
    disposables.listen(button, 'click', (event) => {
      event.preventDefault();
      if (!isDisabled(button)) closeDialog('dismiss');
    });
  });

  if (backdrop) {
    /* Close only when the pointer both went down AND came up on the backdrop
       itself. A plain click listener also fires when a drag (e.g. selecting
       text in a form field) starts inside the dialog and is released over
       the backdrop — the click retargets to their common ancestor, which is
       the backdrop — and would discard the user's in-progress work. Routing
       the pointerdown through the overlay stack also keeps a single gesture
       from dismissing a popup and this dialog together. */
    let pointerDownOnBackdrop = false;
    disposables.listen(backdrop, 'pointerdown', (event) => {
      pointerDownOnBackdrop =
        open &&
        closeOnBackdrop &&
        event.target === backdrop &&
        consumeTopOverlayEvent(event, document, token);
    });
    disposables.listen(backdrop, 'pointercancel', () => {
      pointerDownOnBackdrop = false;
    });
    disposables.listen(backdrop, 'pointerup', (event) => {
      const shouldClose = pointerDownOnBackdrop && event.target === backdrop;
      pointerDownOnBackdrop = false;
      if (shouldClose && open) closeDialog('backdrop');
    });
  }

  disposables.listen(document, 'keydown', onDocumentKeyDown, true);
  disposables.listen(document, 'focusin', onDocumentFocusIn, true);

  const controller = Object.freeze({
    get container() {
      return container;
    },
    get dialog() {
      return dialog;
    },
    get trigger() {
      return trigger;
    },
    get isOpen() {
      return open;
    },
    open: openDialog,
    close: closeDialog,
    toggle: toggleDialog,
    destroy() {
      if (!lifecycle.isAlive) return;
      destroyOwnedOverlays(document, token);
      if (!lifecycle.destroy()) return;
      if (open) {
        open = false;
        /* Frameworks often unmount an open dialog without closing it first;
           without a hand-off the browser drops focus to <body> and silently
           teleports keyboard/AT users to the top of the page. */
        const active = document.activeElement;
        if (isElement(active) && dialog.contains(active)) {
          restoreDialogFocus(previouslyFocused?.isConnected ? previouslyFocused : trigger);
        }
        previouslyFocused = null;
        releaseOpenResources();
      }
      disposables.dispose();
      attributes.restore();
      registry.delete(container);
    },
  });

  registry.set(container, controller);
  syncState();
  if (open) {
    previouslyFocused = isElement(document.activeElement) ? document.activeElement : null;
    warnWhenUnnamed();
    removeFromStack = registerDialogOverlay();
    if (lockScroll) releaseBodyLock = lockBodyScroll(document);
    applyBackgroundInert();
    try {
      focusInside();
    } catch (error) {
      open = false;
      releaseOpenResources();
      lifecycle.destroy();
      disposables.dispose();
      attributes.restore();
      registry.delete(container);
      throw error;
    }
  }

  return controller;
}
