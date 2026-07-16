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
  focusIntoView,
  isDisabled,
  nextEnabledIndex,
  orientationDelta,
  warnAccessibility,
} from './internal/dom.js';

const controllers = new WeakMap();

function resolvePanels(tablist, tabs, suppliedPanels) {
  if (suppliedPanels != null) return assertElements(suppliedPanels, 'options.panels');

  const document = tablist.ownerDocument;
  const controlledPanels = tabs.map((tab) => {
    const id = tab.getAttribute('aria-controls');
    return id ? document.getElementById(id) : null;
  });
  if (controlledPanels.every(Boolean)) return controlledPanels;

  const scope = tablist.parentElement ?? tablist;
  const positional = [...scope.querySelectorAll('[role="tabpanel"], [data-ct-tab-panel]')];
  if (positional.length > 1) {
    warnAccessibility(
      'Tabs: panels were paired with tabs by DOM position. If panel order differs from ' +
        'tab order, tabs announce the wrong panels — set aria-controls on each tab or ' +
        'pass options.panels explicitly.',
    );
  }
  return positional;
}

/**
 * Creates an ARIA tabs controller with roving focus and automatic or manual activation.
 */
export function createTabsController(options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Tabs controller options are required.');
  }

  const tablist = assertElement(options.tablist, 'options.tablist');
  const existing = controllers.get(tablist);
  if (existing) return existing;

  const tabs = options.tabs == null
    ? [...tablist.querySelectorAll('[role="tab"], [data-ct-tab]')]
    : assertElements(options.tabs, 'options.tabs');
  const panels = resolvePanels(tablist, tabs, options.panels);
  if (!tabs.length) throw new TypeError('Tabs controller requires at least one tab.');
  assertUniqueElements(tabs, 'options.tabs');
  assertDescendants(tabs, tablist, 'options.tabs');
  assertUniqueElements(panels, 'options.panels');
  assertSameDocument(panels, tablist.ownerDocument, 'options.panels');
  if (tabs.length !== panels.length || panels.some((panel) => !panel)) {
    throw new TypeError('Each tab must map to exactly one panel.');
  }

  const orientation = assertChoice(
    options.orientation ?? tablist.getAttribute('aria-orientation') ?? 'horizontal',
    ['horizontal', 'vertical'],
    'options.orientation',
  );
  const activation = assertChoice(
    options.activation ?? 'automatic',
    ['automatic', 'manual'],
    'options.activation',
  );
  assertFunction(options.onSelect, 'options.onSelect');

  const attributes = createAttributeStore();
  const lifecycle = createControllerLifecycle('Tabs');
  const disposables = createDisposables();
  const loop = options.loop !== false;

  const selectedFromMarkup = tabs.findIndex(
    (tab) => tab.getAttribute('aria-selected') === 'true' && !isDisabled(tab),
  );
  let selectedIndex = selectedFromMarkup;
  if (options.selectedIndex != null) {
    if (
      !Number.isInteger(options.selectedIndex) ||
      options.selectedIndex < 0 ||
      options.selectedIndex >= tabs.length ||
      isDisabled(tabs[options.selectedIndex])
    ) {
      throw new RangeError('options.selectedIndex must identify an enabled tab.');
    }
    selectedIndex = options.selectedIndex;
  } else if (selectedIndex < 0) {
    selectedIndex = boundaryEnabledIndex(tabs);
  }
  if (selectedIndex < 0) throw new TypeError('Tabs controller requires at least one enabled tab.');
  let focusIndex = selectedIndex;
  let movingFocus = false;

  attributes.set(tablist, 'role', 'tablist');
  attributes.set(tablist, 'aria-orientation', orientation);

  tabs.forEach((tab, index) => {
    const panel = panels[index];
    const tabId = ensureId(tab, 'ct-tab', attributes);
    const panelId = ensureId(panel, 'ct-tab-panel', attributes);
    attributes.set(tab, 'role', 'tab');
    attributes.set(tab, 'aria-controls', panelId);
    attributes.set(panel, 'role', 'tabpanel');
    attributes.set(panel, 'aria-labelledby', tabId);
    if (!panel.hasAttribute('tabindex')) attributes.set(panel, 'tabindex', '0');
  });

  function sync() {
    tabs.forEach((tab, index) => {
      const selected = index === selectedIndex;
      attributes.set(tab, 'aria-selected', String(selected));
      attributes.set(tab, 'data-state', selected ? 'active' : 'inactive');
      attributes.set(tab, 'tabindex', index === focusIndex && !isDisabled(tab) ? '0' : '-1');
      attributes.set(panels[index], 'data-state', selected ? 'active' : 'inactive');
      attributes.set(panels[index], 'hidden', selected ? null : '');
    });
  }

  function select(target, { focus = false, reason = 'programmatic' } = {}) {
    return lifecycle.run('select', (checkpoint) => {
      const index = typeof target === 'number' ? target : tabs.indexOf(target);
      if (!Number.isInteger(index) || index < 0 || index >= tabs.length) {
        throw new RangeError('Tab target is not managed by this controller.');
      }
      if (isDisabled(tabs[index])) return false;

      focusIndex = index;
      if (index === selectedIndex) {
        sync();
        if (focus) focusElement(tabs[index]);
        return false;
      }

      const detail = { controller, index, panel: panels[index], reason, tab: tabs[index] };
      const allowed = dispatch(tablist, 'ct:beforeselect', detail, true);
      checkpoint();
      if (!allowed) return false;

      selectedIndex = index;
      sync();
      if (focus) {
        focusElement(tabs[index]);
        checkpoint();
      }
      options.onSelect?.(detail);
      checkpoint();
      dispatch(tablist, 'ct:select', detail);
      checkpoint();
      return true;
    });
  }

  function moveFocus(index, reason) {
    focusIndex = index;
    sync();
    movingFocus = true;
    try {
      /* Overflowing tablists scroll; keep the roving focus visible. */
      focusIntoView(tabs[index]);
    } finally {
      movingFocus = false;
    }
    if (activation === 'automatic') select(index, { reason });
  }

  function onKeyDown(event, index) {
    const delta = orientationDelta(event.key, orientation, tablist);
    if (delta) {
      event.preventDefault();
      moveFocus(nextEnabledIndex(tabs, index, delta, loop), 'keyboard');
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      moveFocus(boundaryEnabledIndex(tabs, event.key === 'End'), 'keyboard');
      return;
    }

    if (activation === 'manual' && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      select(index, { focus: true, reason: 'keyboard' });
    }
  }

  tabs.forEach((tab, index) => {
    disposables.listen(tab, 'click', (event) => {
      event.preventDefault();
      if (!isDisabled(tab)) select(index, { reason: 'pointer' });
    });
    disposables.listen(tab, 'focus', () => {
      if (isDisabled(tab)) return;
      focusIndex = index;
      sync();
      if (activation === 'automatic' && !movingFocus) select(index, { reason: 'focus' });
    });
    disposables.listen(tab, 'keydown', (event) => onKeyDown(event, index));
  });

  const controller = Object.freeze({
    get tablist() {
      return tablist;
    },
    get tabs() {
      return [...tabs];
    },
    get panels() {
      return [...panels];
    },
    get selectedIndex() {
      return selectedIndex;
    },
    select,
    destroy() {
      if (!lifecycle.destroy()) return;
      disposables.dispose();
      attributes.restore();
      controllers.delete(tablist);
    },
  });

  controllers.set(tablist, controller);
  sync();
  return controller;
}
