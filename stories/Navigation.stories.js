import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Navigation/Navigation',
  parameters: {
    docs: {
      description: {
        component: 'Tab-based navigation using ARIA `tablist`, `tab`, and `tabpanel` roles with roving tabindex and full keyboard navigation (Arrow keys, Home/End). Also includes breadcrumb and pagination patterns.',
      },
    },
  },
  argTypes: {
    activeTab: {
      control: 'select',
      options: ['Overview', 'Settings', 'Members'],
      description: 'Currently active tab',
    },
  },
};

/**
 * Initializes WAI-ARIA-compliant keyboard navigation on a tablist.
 * Supports ArrowLeft/Right (horizontal), ArrowUp/Down (vertical), Home, End.
 * Activates tabs automatically on focus (automatic activation pattern).
 */
function initTabsKeyboard(tablistEl) {
  const isVertical = tablistEl.getAttribute('aria-orientation') === 'vertical';

  tablistEl.addEventListener('keydown', (e) => {
    const tabs = [...tablistEl.querySelectorAll('[role="tab"]:not([aria-disabled="true"]):not(:disabled)')];
    const index = tabs.indexOf(e.target);
    if (index === -1) return;

    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
    let newIndex;

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        newIndex = (index + 1) % tabs.length;
        break;
      case prevKey:
        e.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    activateTab(tabs[newIndex], tablistEl);
  });

  tablistEl.querySelectorAll('[role="tab"]').forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.disabled || tab.getAttribute('aria-disabled') === 'true') return;
      activateTab(tab, tablistEl);
    });
  });
}

function activateTab(tab, tablistEl) {
  const allTabs = [...tablistEl.querySelectorAll('[role="tab"]')];
  const container = tablistEl.closest('.ct-tabs');

  allTabs.forEach((t) => {
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
    const panelId = t.getAttribute('aria-controls');
    if (panelId) {
      const panel = container.querySelector(`#${panelId}`);
      if (panel) panel.hidden = true;
    }
  });

  tab.setAttribute('aria-selected', 'true');
  tab.setAttribute('tabindex', '0');
  tab.focus();

  const panelId = tab.getAttribute('aria-controls');
  if (panelId) {
    const panel = container.querySelector(`#${panelId}`);
    if (panel) panel.hidden = false;
  }
}

export const Playground = {
  args: {
    activeTab: 'Overview',
  },
  render: ({ activeTab }) => {
    const tabs = ['Overview', 'Settings', 'Members'];
    const tabItems = tabs.map((tab, i) => {
      const isActive = tab === activeTab;
      const panelId = `pg-panel-${i + 1}`;
      const tabId = `pg-tab-${i + 1}`;
      return `<button class="ct-tabs__trigger" role="tab" aria-selected="${isActive}" aria-controls="${panelId}" id="${tabId}" tabindex="${isActive ? '0' : '-1'}">${tab}</button>`;
    }).join('\n      ');
    const panels = tabs.map((tab, i) => {
      const isActive = tab === activeTab;
      const panelId = `pg-panel-${i + 1}`;
      const tabId = `pg-tab-${i + 1}`;
      return `<div class="ct-tabs__panel" role="tabpanel" id="${panelId}" aria-labelledby="${tabId}" tabindex="0"${isActive ? '' : ' hidden'}><p class="ct-muted">${tab} content</p></div>`;
    }).join('\n    ');
    return `
    <div class="ct-tabs" style="max-width: 560px;">
      <div class="ct-tabs__list" role="tablist">
        ${tabItems}
      </div>
      ${panels}
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tablist = canvas.getByRole('tablist');
    initTabsKeyboard(tablist);

    const activeTabEl = canvas.getByRole('tab', { selected: true });
    expect(activeTabEl).toBeInTheDocument();
  },
};

export const Tabs = {
  render: () => `
  <div class="ct-tabs" style="max-width: 560px;">
    <div class="ct-tabs__list" role="tablist">
      <button class="ct-tabs__trigger" role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1" tabindex="0">Overview</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">Settings</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="panel-3" id="tab-3" tabindex="-1">Members</button>
    </div>
    <div class="ct-tabs__panel" role="tabpanel" id="panel-1" aria-labelledby="tab-1" tabindex="0">
      <p class="ct-muted">Panel content</p>
    </div>
    <div class="ct-tabs__panel" role="tabpanel" id="panel-2" aria-labelledby="tab-2" tabindex="0" hidden>
      <p class="ct-muted">Settings content</p>
    </div>
    <div class="ct-tabs__panel" role="tabpanel" id="panel-3" aria-labelledby="tab-3" tabindex="0" hidden>
      <p class="ct-muted">Members content</p>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tablist = canvas.getByRole('tablist');
    const tabs = within(tablist).getAllByRole('tab');

    expect(tabs).toHaveLength(3);

    // Active tab: aria-selected + roving tabindex
    const activeTab = canvas.getByRole('tab', { selected: true });
    expect(activeTab).toHaveTextContent('Overview');
    expect(activeTab).toHaveAttribute('tabindex', '0');

    // Inactive tabs: not selected, tabindex -1 (roving tabindex)
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[2]).toHaveAttribute('tabindex', '-1');

    // Bidirectional tab ↔ panel association
    const visiblePanel = canvas.getByRole('tabpanel');
    expect(activeTab).toHaveAttribute('aria-controls', visiblePanel.id);
    expect(visiblePanel).toHaveAttribute('aria-labelledby', activeTab.id);

    // Panel is focusable for keyboard users (tabindex="0")
    expect(visiblePanel).toHaveAttribute('tabindex', '0');

    // Each tab has a corresponding panel via aria-controls
    for (const tab of tabs) {
      const panelId = tab.getAttribute('aria-controls');
      const panel = canvasElement.querySelector(`#${panelId}`);
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveAttribute('role', 'tabpanel');
      expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    }

    // Inactive panels are hidden from AT
    const hiddenPanels = canvasElement.querySelectorAll('[role="tabpanel"][hidden]');
    expect(hiddenPanels).toHaveLength(2);

    // Active tab receives focus on click
    await userEvent.click(tabs[1]);
    expect(tabs[1]).toHaveFocus();

    // Keyboard: Enter activates a focused tab
    tabs[2].focus();
    let clicked = false;
    tabs[2].addEventListener('click', () => { clicked = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(clicked).toBe(true);
  },
};

export const TabsKeyboard = {
  render: () => `
  <div class="ct-tabs" style="max-width: 560px;">
    <div class="ct-tabs__list" role="tablist" aria-label="Keyboard navigation demo">
      <button class="ct-tabs__trigger" role="tab" aria-selected="true" aria-controls="kb-panel-1" id="kb-tab-1" tabindex="0">First</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="kb-panel-2" id="kb-tab-2" tabindex="-1">Second</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="kb-panel-3" id="kb-tab-3" tabindex="-1">Third</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="kb-panel-4" id="kb-tab-4" tabindex="-1">Fourth</button>
    </div>
    <div class="ct-tabs__panel" role="tabpanel" id="kb-panel-1" aria-labelledby="kb-tab-1" tabindex="0"><p class="ct-muted">First panel</p></div>
    <div class="ct-tabs__panel" role="tabpanel" id="kb-panel-2" aria-labelledby="kb-tab-2" tabindex="0" hidden><p class="ct-muted">Second panel</p></div>
    <div class="ct-tabs__panel" role="tabpanel" id="kb-panel-3" aria-labelledby="kb-tab-3" tabindex="0" hidden><p class="ct-muted">Third panel</p></div>
    <div class="ct-tabs__panel" role="tabpanel" id="kb-panel-4" aria-labelledby="kb-tab-4" tabindex="0" hidden><p class="ct-muted">Fourth panel</p></div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tablist = canvas.getByRole('tablist');
    const tabs = within(tablist).getAllByRole('tab');

    // Initialize keyboard navigation
    initTabsKeyboard(tablist);

    // Focus first tab
    tabs[0].focus();
    expect(tabs[0]).toHaveFocus();

    // ArrowRight → second tab
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');

    // Verify panel switched
    expect(canvasElement.querySelector('#kb-panel-2').hidden).toBe(false);
    expect(canvasElement.querySelector('#kb-panel-1').hidden).toBe(true);

    // ArrowRight → third tab
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[2]).toHaveFocus();
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');

    // ArrowRight → fourth tab
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[3]).toHaveFocus();

    // ArrowRight wraps → first tab
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[0]).toHaveFocus();
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // ArrowLeft wraps → fourth tab
    await userEvent.keyboard('{ArrowLeft}');
    expect(tabs[3]).toHaveFocus();
    expect(tabs[3]).toHaveAttribute('aria-selected', 'true');

    // Home → first tab
    await userEvent.keyboard('{Home}');
    expect(tabs[0]).toHaveFocus();
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // End → last tab
    await userEvent.keyboard('{End}');
    expect(tabs[3]).toHaveFocus();
    expect(tabs[3]).toHaveAttribute('aria-selected', 'true');

    // Tab key moves to panel (not next tab — roving tabindex)
    await userEvent.keyboard('{Home}');
    expect(tabs[0]).toHaveFocus();
    await userEvent.tab();
    const activePanel = canvasElement.querySelector('[role="tabpanel"]:not([hidden])');
    expect(activePanel).toHaveFocus();
  },
};

export const TabsVertical = {
  render: () => `
  <div class="ct-tabs ct-tabs--vertical" style="max-width: 560px; min-height: 200px;">
    <div class="ct-tabs__list" role="tablist" aria-label="Vertical tabs" aria-orientation="vertical">
      <button class="ct-tabs__trigger" role="tab" aria-selected="true" aria-controls="vt-panel-1" id="vt-tab-1" tabindex="0">Profile</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="vt-panel-2" id="vt-tab-2" tabindex="-1">Security</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="vt-panel-3" id="vt-tab-3" tabindex="-1">Notifications</button>
    </div>
    <div class="ct-tabs__panel" role="tabpanel" id="vt-panel-1" aria-labelledby="vt-tab-1" tabindex="0"><p class="ct-muted">Profile settings content</p></div>
    <div class="ct-tabs__panel" role="tabpanel" id="vt-panel-2" aria-labelledby="vt-tab-2" tabindex="0" hidden><p class="ct-muted">Security settings content</p></div>
    <div class="ct-tabs__panel" role="tabpanel" id="vt-panel-3" aria-labelledby="vt-tab-3" tabindex="0" hidden><p class="ct-muted">Notification settings content</p></div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tablist = canvas.getByRole('tablist');
    const tabs = within(tablist).getAllByRole('tab');

    // Initialize with vertical orientation
    initTabsKeyboard(tablist);

    // aria-orientation is set
    expect(tablist).toHaveAttribute('aria-orientation', 'vertical');

    // Focus first tab
    tabs[0].focus();
    expect(tabs[0]).toHaveFocus();

    // ArrowDown → second tab (vertical orientation)
    await userEvent.keyboard('{ArrowDown}');
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    // ArrowDown → third tab
    await userEvent.keyboard('{ArrowDown}');
    expect(tabs[2]).toHaveFocus();

    // ArrowDown wraps → first tab
    await userEvent.keyboard('{ArrowDown}');
    expect(tabs[0]).toHaveFocus();

    // ArrowUp wraps → last tab
    await userEvent.keyboard('{ArrowUp}');
    expect(tabs[2]).toHaveFocus();

    // Home/End work in vertical mode too
    await userEvent.keyboard('{Home}');
    expect(tabs[0]).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(tabs[2]).toHaveFocus();
  },
};

export const TabsDisabled = {
  render: () => `
  <div class="ct-tabs" style="max-width: 560px;">
    <div class="ct-tabs__list" role="tablist" aria-label="Tabs with disabled items">
      <button class="ct-tabs__trigger" role="tab" aria-selected="true" aria-controls="dis-panel-1" id="dis-tab-1" tabindex="0">Active</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="dis-panel-2" id="dis-tab-2" tabindex="-1" aria-disabled="true">Disabled</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="dis-panel-3" id="dis-tab-3" tabindex="-1">Enabled</button>
    </div>
    <div class="ct-tabs__panel" role="tabpanel" id="dis-panel-1" aria-labelledby="dis-tab-1" tabindex="0"><p class="ct-muted">Active tab content</p></div>
    <div class="ct-tabs__panel" role="tabpanel" id="dis-panel-2" aria-labelledby="dis-tab-2" tabindex="0" hidden><p class="ct-muted">Disabled tab content</p></div>
    <div class="ct-tabs__panel" role="tabpanel" id="dis-panel-3" aria-labelledby="dis-tab-3" tabindex="0" hidden><p class="ct-muted">Enabled tab content</p></div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tablist = canvas.getByRole('tablist');
    const tabs = within(tablist).getAllByRole('tab');

    initTabsKeyboard(tablist);

    // Disabled tab has aria-disabled
    expect(tabs[1]).toHaveAttribute('aria-disabled', 'true');

    // Focus first tab
    tabs[0].focus();
    expect(tabs[0]).toHaveFocus();

    // ArrowRight skips disabled tab → lands on third tab
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[2]).toHaveFocus();
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');

    // ArrowLeft wraps and skips disabled → lands on first tab
    await userEvent.keyboard('{ArrowLeft}');
    expect(tabs[0]).toHaveFocus();
  },
};

export const TabsSizes = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-8); max-width: 560px;">
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Small</p>
      <div class="ct-tabs ct-tabs--sm">
        <div class="ct-tabs__list" role="tablist" aria-label="Small tabs">
          <button class="ct-tabs__trigger" role="tab" aria-selected="true" aria-controls="sm-panel-1" id="sm-tab-1" tabindex="0">Tab A</button>
          <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="sm-panel-2" id="sm-tab-2" tabindex="-1">Tab B</button>
        </div>
        <div class="ct-tabs__panel" role="tabpanel" id="sm-panel-1" aria-labelledby="sm-tab-1" tabindex="0"><p class="ct-muted">Small panel</p></div>
        <div class="ct-tabs__panel" role="tabpanel" id="sm-panel-2" aria-labelledby="sm-tab-2" tabindex="0" hidden><p class="ct-muted">Small panel B</p></div>
      </div>
    </div>

    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Medium (default)</p>
      <div class="ct-tabs">
        <div class="ct-tabs__list" role="tablist" aria-label="Medium tabs">
          <button class="ct-tabs__trigger" role="tab" aria-selected="true" aria-controls="md-panel-1" id="md-tab-1" tabindex="0">Tab A</button>
          <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="md-panel-2" id="md-tab-2" tabindex="-1">Tab B</button>
        </div>
        <div class="ct-tabs__panel" role="tabpanel" id="md-panel-1" aria-labelledby="md-tab-1" tabindex="0"><p class="ct-muted">Medium panel</p></div>
        <div class="ct-tabs__panel" role="tabpanel" id="md-panel-2" aria-labelledby="md-tab-2" tabindex="0" hidden><p class="ct-muted">Medium panel B</p></div>
      </div>
    </div>

    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Large</p>
      <div class="ct-tabs ct-tabs--lg">
        <div class="ct-tabs__list" role="tablist" aria-label="Large tabs">
          <button class="ct-tabs__trigger" role="tab" aria-selected="true" aria-controls="lg-panel-1" id="lg-tab-1" tabindex="0">Tab A</button>
          <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="lg-panel-2" id="lg-tab-2" tabindex="-1">Tab B</button>
        </div>
        <div class="ct-tabs__panel" role="tabpanel" id="lg-panel-1" aria-labelledby="lg-tab-1" tabindex="0"><p class="ct-muted">Large panel</p></div>
        <div class="ct-tabs__panel" role="tabpanel" id="lg-panel-2" aria-labelledby="lg-tab-2" tabindex="0" hidden><p class="ct-muted">Large panel B</p></div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const smTabs = canvasElement.querySelector('.ct-tabs--sm');
    const lgTabs = canvasElement.querySelector('.ct-tabs--lg');

    expect(smTabs).toBeInTheDocument();
    expect(lgTabs).toBeInTheDocument();

    // All tablists have accessible labels
    const tablists = canvasElement.querySelectorAll('[role="tablist"]');
    for (const tl of tablists) {
      expect(tl).toHaveAttribute('aria-label');
    }

    // All tabs have proper ARIA
    const allTabs = canvasElement.querySelectorAll('[role="tab"]');
    for (const tab of allTabs) {
      expect(tab).toHaveAttribute('aria-selected');
      expect(tab).toHaveAttribute('aria-controls');
    }
  },
};

export const TabsPill = {
  render: () => `
  <div class="ct-tabs ct-tabs--pill" style="max-width: 560px;">
    <div class="ct-tabs__list" role="tablist" aria-label="Pill variant tabs">
      <button class="ct-tabs__trigger" role="tab" aria-selected="true" aria-controls="pill-panel-1" id="pill-tab-1" tabindex="0">All</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="pill-panel-2" id="pill-tab-2" tabindex="-1">Active</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="pill-panel-3" id="pill-tab-3" tabindex="-1">Archived</button>
    </div>
    <div class="ct-tabs__panel" role="tabpanel" id="pill-panel-1" aria-labelledby="pill-tab-1" tabindex="0"><p class="ct-muted">All items</p></div>
    <div class="ct-tabs__panel" role="tabpanel" id="pill-panel-2" aria-labelledby="pill-tab-2" tabindex="0" hidden><p class="ct-muted">Active items</p></div>
    <div class="ct-tabs__panel" role="tabpanel" id="pill-panel-3" aria-labelledby="pill-tab-3" tabindex="0" hidden><p class="ct-muted">Archived items</p></div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tabsContainer = canvasElement.querySelector('.ct-tabs');
    const tablist = canvas.getByRole('tablist');
    const tabs = within(tablist).getAllByRole('tab');

    // Pill variant class is applied
    expect(tabsContainer).toHaveClass('ct-tabs--pill');

    initTabsKeyboard(tablist);

    // Keyboard navigation works with pill variant
    tabs[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    // Click navigation works
    await userEvent.click(tabs[2]);
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(canvasElement.querySelector('#pill-panel-3').hidden).toBe(false);
  },
};

export const Pagination = {
  render: () => `
  <nav class="ct-pagination" aria-label="Pagination">
    <ul class="ct-pagination__list">
      <li><button class="ct-pagination__link" type="button" aria-label="Page 1">1</button></li>
      <li><button class="ct-pagination__link" aria-current="page" type="button" aria-label="Page 2, current page">2</button></li>
      <li><button class="ct-pagination__link" type="button" aria-label="Page 3">3</button></li>
      <li><button class="ct-pagination__link" type="button" aria-label="Page 4">4</button></li>
    </ul>
  </nav>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Pagination' });
    const buttons = within(nav).getAllByRole('button');

    expect(buttons).toHaveLength(4);

    // Current page is marked with aria-current
    const currentBtn = buttons[1];
    expect(currentBtn).toHaveAttribute('aria-current', 'page');
    expect(currentBtn).toHaveTextContent('2');

    // Other pages must not carry aria-current
    expect(buttons[0]).not.toHaveAttribute('aria-current');
    expect(buttons[2]).not.toHaveAttribute('aria-current');
    expect(buttons[3]).not.toHaveAttribute('aria-current');

    // Every pagination button has a descriptive aria-label (not just "1", "2")
    for (const btn of buttons) {
      const label = btn.getAttribute('aria-label');
      expect(label).toBeTruthy();
      expect(label).toMatch(/Page \d/);
    }

    // Current page label identifies it as current
    expect(currentBtn.getAttribute('aria-label')).toMatch(/current/i);

    // Buttons are focusable via click
    await userEvent.click(buttons[0]);
    expect(buttons[0]).toHaveFocus();

    // Keyboard: Enter activates a page button
    buttons[2].focus();
    let activated = false;
    buttons[2].addEventListener('click', () => { activated = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(activated).toBe(true);
  },
};

export const Breadcrumbs = {
  render: () => `
  <nav class="ct-breadcrumbs" aria-label="Breadcrumb">
    <ol class="ct-breadcrumbs__list">
      <li class="ct-breadcrumbs__item">
        <a class="ct-breadcrumbs__link" href="/">Home</a>
        <span class="ct-breadcrumbs__separator" aria-hidden="true">/</span>
      </li>
      <li class="ct-breadcrumbs__item">
        <a class="ct-breadcrumbs__link" href="/projects">Projects</a>
        <span class="ct-breadcrumbs__separator" aria-hidden="true">/</span>
      </li>
      <li class="ct-breadcrumbs__item">
        <span class="ct-breadcrumbs__current" aria-current="page">Alpha</span>
      </li>
    </ol>
  </nav>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' });

    // Uses ordered list for semantic trail
    const list = nav.querySelector('ol');
    expect(list).toBeInTheDocument();

    // Ancestor items are links
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('Home');
    expect(links[1]).toHaveTextContent('Projects');

    // Current page is plain text, not a link
    const current = canvas.getByText('Alpha');
    expect(current.tagName).toBe('SPAN');
    expect(current.closest('a')).toBeNull();

    // Current page is marked with aria-current="page"
    expect(current).toHaveAttribute('aria-current', 'page');

    // Separators are hidden from assistive technology
    const separators = canvasElement.querySelectorAll('.ct-breadcrumbs__separator');
    for (const sep of separators) {
      expect(sep).toHaveAttribute('aria-hidden', 'true');
    }

    // Links are keyboard focusable
    links[0].focus();
    expect(links[0]).toHaveFocus();
    await userEvent.tab();
    expect(links[1]).toHaveFocus();
  },
};
