import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Navigation/Navigation',
  parameters: {
    docs: {
      description: {
        component: 'Tab-based navigation using ARIA `tablist`, `tab`, and `tabpanel` roles with roving tabindex for keyboard navigation. Also includes breadcrumb and pagination patterns.',
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
    expect(tablist).toBeInTheDocument();
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
