import { focusElement, getFocusableElements, isElement } from './dom.js';

const bodyLocks = new WeakMap();
const overlayStates = new WeakMap();
const consumedEvents = new WeakSet();

function getOverlayState(document) {
  let state = overlayStates.get(document);
  if (!state) {
    state = { dismissals: [], modals: [] };
    overlayStates.set(document, state);
  }
  return state;
}

function targetInScopes(target, scopes) {
  return isElement(target) && scopes.some((scope) => scope.contains(target));
}

function findOwningModal(state, trigger) {
  for (let index = state.modals.length - 1; index >= 0; index -= 1) {
    const modal = state.modals[index];
    if (modal.scope.contains(trigger)) return modal.token;
    if (
      state.dismissals.some(
        (entry) => entry.ownerModal === modal.token && targetInScopes(trigger, entry.focusScopes),
      )
    ) {
      return modal.token;
    }
  }
  return null;
}

export function lockBodyScroll(document) {
  const existing = bodyLocks.get(document);
  if (existing) {
    existing.count += 1;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      releaseBodyLock(document);
    };
  }

  const body = document.body;
  const view = document.defaultView;
  const state = {
    body,
    count: 1,
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
  };
  bodyLocks.set(document, state);

  const scrollbarWidth = view ? Math.max(0, view.innerWidth - document.documentElement.clientWidth) : 0;
  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0 && view) {
    const currentPadding = Number.parseFloat(view.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    releaseBodyLock(document);
  };
}

function releaseBodyLock(document) {
  const state = bodyLocks.get(document);
  if (!state) return;

  state.count -= 1;
  if (state.count > 0) return;

  state.body.style.overflow = state.overflow;
  state.body.style.paddingRight = state.paddingRight;
  bodyLocks.delete(document);
}

export function pushOverlay(
  document,
  token,
  {
    focusScopes = [],
    handlesTab = false,
    modal = false,
    onOwnerClose = null,
    onOwnerDestroy = null,
    scope = null,
    trigger = null,
  } = {},
) {
  const state = getOverlayState(document);
  const existingIndex = state.dismissals.findIndex((entry) => entry.token === token);
  if (existingIndex >= 0) state.dismissals.splice(existingIndex, 1);
  const parentModal = trigger || scope ? findOwningModal(state, trigger ?? scope) : null;

  let modalEntry = null;
  if (modal) {
    const existingModalIndex = state.modals.findIndex((entry) => entry.token === token);
    if (existingModalIndex >= 0) state.modals.splice(existingModalIndex, 1);
    modalEntry = { scope, token };
    state.modals.push(modalEntry);
  }

  const entry = {
    focusScopes: [...focusScopes],
    handlesTab,
    modal,
    onOwnerClose,
    onOwnerDestroy,
    ownerModal: modal ? token : trigger ? findOwningModal(state, trigger) : null,
    parentModal,
    token,
  };
  state.dismissals.push(entry);

  let removed = false;
  return () => {
    if (removed) return;
    removed = true;
    const dismissalIndex = state.dismissals.findIndex((candidate) => candidate.token === token);
    if (dismissalIndex >= 0) state.dismissals.splice(dismissalIndex, 1);
    if (modalEntry) {
      const modalIndex = state.modals.findIndex((candidate) => candidate.token === token);
      if (modalIndex >= 0) state.modals.splice(modalIndex, 1);
    }
    if (!state.dismissals.length && !state.modals.length) overlayStates.delete(document);
  };
}

export function isTopOverlay(document, token) {
  const state = overlayStates.get(document);
  return Boolean(state?.dismissals.length && state.dismissals.at(-1).token === token);
}

export function isTopModalOverlay(document, token) {
  const state = overlayStates.get(document);
  return Boolean(state?.modals.length && state.modals.at(-1).token === token);
}

export function consumeTopOverlayEvent(event, document, token) {
  if (consumedEvents.has(event) || !isTopOverlay(document, token)) return false;
  consumedEvents.add(event);
  return true;
}

export function getModalFocusScopes(document, token) {
  const state = overlayStates.get(document);
  const modal = state?.modals.find((entry) => entry.token === token);
  if (!modal) return [];

  return [
    modal.scope,
    ...state.dismissals
      .filter((entry) => entry.ownerModal === token)
      .flatMap((entry) => entry.focusScopes),
  ];
}

export function isInModalFocusScope(document, token, target) {
  return targetInScopes(target, getModalFocusScopes(document, token));
}

export function topOverlayHandlesModalTab(document, token) {
  const top = overlayStates.get(document)?.dismissals.at(-1);
  return Boolean(top && top.ownerModal === token && top.handlesTab);
}

function ownedByModal(entry, token) {
  return entry.parentModal === token || (!entry.modal && entry.ownerModal === token);
}

export function closeOwnedOverlays(document, token) {
  const state = overlayStates.get(document);
  if (!state) return true;

  const owned = state.dismissals.filter((entry) => ownedByModal(entry, token)).reverse();
  for (const entry of owned) {
    if (!state.dismissals.includes(entry)) continue;
    entry.onOwnerClose?.();
    if (state.dismissals.includes(entry)) return false;
  }
  return true;
}

export function destroyOwnedOverlays(document, token) {
  const state = overlayStates.get(document);
  if (!state) return;

  const owned = state.dismissals.filter((entry) => ownedByModal(entry, token)).reverse();
  for (const entry of owned) {
    if (!state.dismissals.includes(entry)) continue;
    entry.onOwnerDestroy?.();
  }
}

export function trapTabKey(event, containers) {
  if (event.key !== 'Tab') return false;

  const scopes = Array.isArray(containers) ? containers : [containers];
  const document = scopes[0].ownerDocument;
  const NodeConstructor = document.defaultView?.Node;
  const focusable = [...new Set(scopes.flatMap((scope) => getFocusableElements(scope)))];
  if (NodeConstructor) {
    focusable.sort((left, right) => {
      const position = left.compareDocumentPosition(right);
      if (position & NodeConstructor.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (position & NodeConstructor.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });
  }
  if (!focusable.length) {
    event.preventDefault();
    focusElement(scopes[0]);
    return true;
  }

  const first = focusable[0];
  const last = focusable.at(-1);
  const active = document.activeElement;
  const activeInside = targetInScopes(active, scopes);

  if (event.shiftKey && (!activeInside || active === first)) {
    event.preventDefault();
    focusElement(last);
    return true;
  }

  if (!event.shiftKey && (!activeInside || active === last)) {
    event.preventDefault();
    focusElement(first);
    return true;
  }

  return false;
}
