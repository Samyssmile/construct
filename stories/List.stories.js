import { expect, within, userEvent } from 'storybook/test';

// ── SVG Icons (Lucide, stroke-based) ──

const userSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const mailSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
const settingsSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
const bellSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;
const chevronRightSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`;
const starSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const homeSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`;
const fileSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`;
const gripVerticalSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>`;
const trashSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;

/**
 * Initializes roving tabindex keyboard navigation for a selectable list (listbox).
 * Supports ArrowUp/Down, Home/End. Disabled items are skipped. Focus wraps.
 *
 * @param {HTMLElement} listbox - The listbox container element
 */
function initListboxKeyboard(listbox) {
  function getItems() {
    return [...listbox.querySelectorAll(
      '[role="option"]:not([aria-disabled="true"])'
    )];
  }

  const items = getItems();
  const selected = items.find((el) => el.getAttribute('aria-selected') === 'true');
  items.forEach((item) => { item.tabIndex = -1; });
  if (selected) {
    selected.tabIndex = 0;
  } else if (items.length > 0) {
    items[0].tabIndex = 0;
  }

  listbox.addEventListener('keydown', (e) => {
    const currentItems = getItems();
    const current = document.activeElement;
    const idx = currentItems.indexOf(current);
    if (idx === -1) return;

    let newIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = (idx + 1) % currentItems.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = (idx - 1 + currentItems.length) % currentItems.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = currentItems.length - 1;
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        current.click();
        return;
      default:
        return;
    }

    currentItems.forEach((item) => { item.tabIndex = -1; });
    currentItems[newIndex].tabIndex = 0;
    currentItems[newIndex].focus();
  });
}

/**
 * Initializes single or multi-select behavior for a listbox.
 *
 * @param {HTMLElement} listbox - The listbox container element
 */
function initListboxSelect(listbox) {
  const isMulti = listbox.getAttribute('aria-multiselectable') === 'true';

  listbox.addEventListener('click', (e) => {
    const item = e.target.closest('[role="option"]');
    if (!item || item.getAttribute('aria-disabled') === 'true') return;

    if (isMulti) {
      const selected = item.getAttribute('aria-selected') === 'true';
      item.setAttribute('aria-selected', String(!selected));
    } else {
      const items = [...listbox.querySelectorAll('[role="option"]')];
      items.forEach((el) => {
        el.setAttribute('aria-selected', 'false');
        el.tabIndex = -1;
      });
      item.setAttribute('aria-selected', 'true');
      item.tabIndex = 0;
    }
  });
}

// ── Helper: avatar placeholder ──

function avatar(initials, color = 'var(--color-brand-primary)') {
  return `<span class="ct-avatar ct-avatar--sm" style="background: ${color}; color: #fff;" aria-hidden="true">
    <span class="ct-avatar__initials">${initials}</span>
  </span>`;
}

// ── Story config ──

export default {
  title: 'Data Display/List',
  parameters: {
    docs: {
      description: {
        component:
          'Accessible list component for structured data display. ' +
          'Supports leading/trailing slots, multi-line content, dividers, selection (single/multi), ' +
          'navigation lists, density variants, and full keyboard navigation. ' +
          'Uses semantic HTML (`<ul>/<ol>`) or `role="listbox"` for selectable lists.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'List size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'flush', 'striped'],
      description: 'Visual variant',
    },
    dense: {
      control: 'boolean',
      description: 'Dense mode (compact spacing)',
    },
  },
};

// ── Playground ──

export const Playground = {
  args: {
    size: 'md',
    variant: 'default',
    dense: false,
  },
  render: ({ size, variant, dense }) => {
    const classes = ['ct-list'];
    if (size !== 'md') classes.push(`ct-list--${size}`);
    if (variant !== 'default') classes.push(`ct-list--${variant}`);
    if (dense) classes.push('ct-list--dense');

    return `
    <ul class="${classes.join(' ')}" aria-label="Team members">
      <li class="ct-list__item ct-list__item--interactive">
        <span class="ct-list__item-leading">${avatar('AW', 'var(--color-ocean-600)')}</span>
        <span class="ct-list__item-content">
          <span class="ct-list__item-title">Alex Walker</span>
          <span class="ct-list__item-description">Lead Developer</span>
        </span>
        <span class="ct-list__item-trailing">${chevronRightSvg}</span>
      </li>
      <li class="ct-list__item ct-list__item--interactive">
        <span class="ct-list__item-leading">${avatar('MJ', 'var(--color-teal-600)')}</span>
        <span class="ct-list__item-content">
          <span class="ct-list__item-title">Maria Johnson</span>
          <span class="ct-list__item-description">UX Designer</span>
        </span>
        <span class="ct-list__item-trailing">${chevronRightSvg}</span>
      </li>
      <li class="ct-list__item ct-list__item--interactive">
        <span class="ct-list__item-leading">${avatar('SK', 'var(--color-slate-600)')}</span>
        <span class="ct-list__item-content">
          <span class="ct-list__item-title">Sam Kim</span>
          <span class="ct-list__item-description">Product Manager</span>
        </span>
        <span class="ct-list__item-trailing">${chevronRightSvg}</span>
      </li>
    </ul>`;
  },
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('.ct-list');
    expect(list).toBeInTheDocument();
    expect(list.tagName).toBe('UL');
    expect(list).toHaveAttribute('aria-label', 'Team members');

    const items = list.querySelectorAll('.ct-list__item');
    expect(items).toHaveLength(3);

    for (const item of items) {
      expect(item.querySelector('.ct-list__item-leading')).not.toBeNull();
      expect(item.querySelector('.ct-list__item-content')).not.toBeNull();
      expect(item.querySelector('.ct-list__item-trailing')).not.toBeNull();
    }
  },
};

// ── Simple List (title only) ──

export const SimpleList = {
  render: () => `
  <ul class="ct-list" aria-label="Fruits">
    <li class="ct-list__item">
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Apples</span>
      </span>
    </li>
    <li class="ct-list__item">
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Bananas</span>
      </span>
    </li>
    <li class="ct-list__item">
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Cherries</span>
      </span>
    </li>
    <li class="ct-list__item">
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Dates</span>
      </span>
    </li>
  </ul>`,
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('.ct-list');
    expect(list.tagName).toBe('UL');

    const items = list.querySelectorAll('.ct-list__item');
    expect(items).toHaveLength(4);

    for (const item of items) {
      const title = item.querySelector('.ct-list__item-title');
      expect(title).not.toBeNull();
      expect(title.textContent.trim().length).toBeGreaterThan(0);
    }
  },
};

// ── Rich List (Avatar + Title + Description + Meta + Trailing) ──

export const RichList = {
  render: () => `
  <ul class="ct-list" aria-label="Recent conversations">
    <li class="ct-list__header">
      <span class="ct-list__title">Messages</span>
      <a href="#" class="ct-list__header-action">See all</a>
    </li>
    <li class="ct-list__item ct-list__item--interactive">
      <span class="ct-list__item-leading">${avatar('AW', 'var(--color-ocean-600)')}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Alex Walker</span>
        <span class="ct-list__item-description">Hey, can you review the latest PR? I've made some changes to the authentication flow that need a second pair of eyes.</span>
        <span class="ct-list__item-meta">2 min ago</span>
      </span>
      <span class="ct-list__item-trailing">
        <span class="ct-badge ct-badge--sm">3</span>
      </span>
    </li>
    <li class="ct-list__divider ct-list__divider--inset" role="separator" aria-hidden="true"></li>
    <li class="ct-list__item ct-list__item--interactive">
      <span class="ct-list__item-leading">${avatar('MJ', 'var(--color-teal-600)')}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Maria Johnson</span>
        <span class="ct-list__item-description">The new design mockups are ready for your feedback.</span>
        <span class="ct-list__item-meta">15 min ago</span>
      </span>
      <span class="ct-list__item-trailing">${chevronRightSvg}</span>
    </li>
    <li class="ct-list__divider ct-list__divider--inset" role="separator" aria-hidden="true"></li>
    <li class="ct-list__item ct-list__item--interactive">
      <span class="ct-list__item-leading">${avatar('SK', 'var(--color-slate-600)')}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Sam Kim</span>
        <span class="ct-list__item-description">Sprint planning meeting moved to 3 PM tomorrow.</span>
        <span class="ct-list__item-meta">1 hour ago</span>
      </span>
      <span class="ct-list__item-trailing">${chevronRightSvg}</span>
    </li>
  </ul>`,
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('.ct-list');
    expect(list).toHaveAttribute('aria-label', 'Recent conversations');

    // Header
    const header = list.querySelector('.ct-list__header');
    expect(header).not.toBeNull();
    expect(header.querySelector('.ct-list__title').textContent).toBe('Messages');
    expect(header.querySelector('.ct-list__header-action').textContent).toBe('See all');

    // Items with full content structure
    const items = list.querySelectorAll('.ct-list__item');
    expect(items).toHaveLength(3);

    for (const item of items) {
      expect(item.querySelector('.ct-list__item-leading')).not.toBeNull();
      expect(item.querySelector('.ct-list__item-title')).not.toBeNull();
      expect(item.querySelector('.ct-list__item-description')).not.toBeNull();
      expect(item.querySelector('.ct-list__item-meta')).not.toBeNull();
      expect(item.querySelector('.ct-list__item-trailing')).not.toBeNull();
    }

    // Dividers
    const dividers = list.querySelectorAll('.ct-list__divider');
    expect(dividers).toHaveLength(2);
  },
};

// ── Interactive / Clickable Items ──

export const InteractiveItems = {
  render: () => `
  <ul class="ct-list" aria-label="Settings">
    <li class="ct-list__item ct-list__item--clickable">
      <span class="ct-list__item-leading">${userSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title"><a href="#profile">Profile</a></span>
        <span class="ct-list__item-description">Manage your account settings</span>
      </span>
      <span class="ct-list__item-trailing">${chevronRightSvg}</span>
    </li>
    <li class="ct-list__item ct-list__item--clickable">
      <span class="ct-list__item-leading">${bellSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title"><a href="#notifications">Notifications</a></span>
        <span class="ct-list__item-description">Configure notification preferences</span>
      </span>
      <span class="ct-list__item-trailing">${chevronRightSvg}</span>
    </li>
    <li class="ct-list__item ct-list__item--clickable">
      <span class="ct-list__item-leading">${settingsSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title"><a href="#preferences">Preferences</a></span>
        <span class="ct-list__item-description">Customize your experience</span>
      </span>
      <span class="ct-list__item-trailing">${chevronRightSvg}</span>
    </li>
  </ul>`,
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('.ct-list__item--clickable');
    expect(items).toHaveLength(3);

    for (const item of items) {
      const link = item.querySelector('a');
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute('href');
    }

    // Focus first link via stretched-link pattern
    const firstLink = items[0].querySelector('a');
    firstLink.focus();
    expect(firstLink).toHaveFocus();
  },
};

// ── Clickable Items (stretched link pattern) ──

export const ClickableItems = {
  render: () => `
  <ul class="ct-list" aria-label="Recent files">
    <li class="ct-list__item ct-list__item--clickable">
      <span class="ct-list__item-leading">${fileSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title"><a href="#design-spec">Design Specification.pdf</a></span>
        <span class="ct-list__item-description">Updated 2 hours ago</span>
      </span>
      <span class="ct-list__item-trailing">2.4 MB</span>
    </li>
    <li class="ct-list__item ct-list__item--clickable">
      <span class="ct-list__item-leading">${fileSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title"><a href="#api-docs">API Documentation.md</a></span>
        <span class="ct-list__item-description">Updated yesterday</span>
      </span>
      <span class="ct-list__item-trailing">156 KB</span>
    </li>
    <li class="ct-list__item ct-list__item--clickable">
      <span class="ct-list__item-leading">${fileSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title"><a href="#meeting-notes">Meeting Notes.docx</a></span>
        <span class="ct-list__item-description">Updated 3 days ago</span>
      </span>
      <span class="ct-list__item-trailing">89 KB</span>
    </li>
  </ul>`,
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('.ct-list__item--clickable');
    expect(items).toHaveLength(3);

    for (const item of items) {
      const link = item.querySelector('.ct-list__item-title a');
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute('href');
    }

    // Stretched link: the first link is keyboard focusable
    const firstLink = items[0].querySelector('a');
    firstLink.focus();
    expect(firstLink).toHaveFocus();
  },
};

// ── Selection: Single Select ──

export const SingleSelect = {
  render: () => `
  <div>
    <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Choose a theme (single select)</p>
    <div class="ct-list ct-list--selectable" role="listbox" aria-label="Theme selection">
      <div class="ct-list__item" role="option" aria-selected="true" tabindex="0">
        <span class="ct-list__item-leading">${starSvg}</span>
        <span class="ct-list__item-content">
          <span class="ct-list__item-title">Light</span>
          <span class="ct-list__item-description">Clean, bright interface</span>
        </span>
      </div>
      <div class="ct-list__item" role="option" aria-selected="false" tabindex="-1">
        <span class="ct-list__item-leading">${starSvg}</span>
        <span class="ct-list__item-content">
          <span class="ct-list__item-title">Dark</span>
          <span class="ct-list__item-description">Easy on the eyes</span>
        </span>
      </div>
      <div class="ct-list__item" role="option" aria-selected="false" tabindex="-1">
        <span class="ct-list__item-leading">${starSvg}</span>
        <span class="ct-list__item-content">
          <span class="ct-list__item-title">High Contrast</span>
          <span class="ct-list__item-description">Maximum readability</span>
        </span>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const listbox = canvasElement.querySelector('[role="listbox"]');
    initListboxKeyboard(listbox);
    initListboxSelect(listbox);

    const options = [...listbox.querySelectorAll('[role="option"]')];
    expect(options).toHaveLength(3);

    // Initial: first selected
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
    expect(options[2]).toHaveAttribute('aria-selected', 'false');

    // Roving tabindex
    expect(options[0].tabIndex).toBe(0);
    expect(options[1].tabIndex).toBe(-1);

    // Click selects
    await userEvent.click(options[2]);
    expect(options[2]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
    expect(options[2].tabIndex).toBe(0);

    // Keyboard: ArrowDown
    options[2].focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(options[0]).toHaveFocus(); // wraps

    // Home / End
    await userEvent.keyboard('{End}');
    expect(options[2]).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(options[0]).toHaveFocus();
  },
};

// ── Selection: Multi Select ──

export const MultiSelect = {
  render: () => `
  <div>
    <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Select notifications (multi select)</p>
    <div class="ct-list ct-list--selectable" role="listbox" aria-label="Notification channels" aria-multiselectable="true">
      <div class="ct-list__item" role="option" aria-selected="true" tabindex="0">
        <span class="ct-list__item-leading">${mailSvg}</span>
        <span class="ct-list__item-content">
          <span class="ct-list__item-title">Email</span>
        </span>
      </div>
      <div class="ct-list__item" role="option" aria-selected="true" tabindex="-1">
        <span class="ct-list__item-leading">${bellSvg}</span>
        <span class="ct-list__item-content">
          <span class="ct-list__item-title">Push Notifications</span>
        </span>
      </div>
      <div class="ct-list__item" role="option" aria-selected="false" tabindex="-1">
        <span class="ct-list__item-leading">${settingsSvg}</span>
        <span class="ct-list__item-content">
          <span class="ct-list__item-title">SMS</span>
        </span>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const listbox = canvasElement.querySelector('[role="listbox"]');
    initListboxKeyboard(listbox);
    initListboxSelect(listbox);

    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');

    const options = [...listbox.querySelectorAll('[role="option"]')];
    expect(options).toHaveLength(3);

    // Multiple selected
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    expect(options[2]).toHaveAttribute('aria-selected', 'false');

    // Toggle individual
    await userEvent.click(options[2]);
    expect(options[2]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('aria-selected', 'true'); // unchanged

    // Toggle off
    await userEvent.click(options[0]);
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
  },
};

// ── Navigation List ──

export const NavigationList = {
  render: () => `
  <nav aria-label="Main navigation">
    <ul class="ct-list ct-list--nav">
      <li class="ct-list__item" aria-current="page">
        <a href="#home" style="display: contents; text-decoration: none; color: inherit;">
          <span class="ct-list__item-leading">${homeSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Home</span>
          </span>
        </a>
      </li>
      <li class="ct-list__item">
        <a href="#messages" style="display: contents; text-decoration: none; color: inherit;">
          <span class="ct-list__item-leading">${mailSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Messages</span>
          </span>
          <span class="ct-list__item-trailing">
            <span class="ct-badge ct-badge--sm">12</span>
          </span>
        </a>
      </li>
      <li class="ct-list__item">
        <a href="#notifications" style="display: contents; text-decoration: none; color: inherit;">
          <span class="ct-list__item-leading">${bellSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Notifications</span>
          </span>
        </a>
      </li>
      <li class="ct-list__item">
        <a href="#settings" style="display: contents; text-decoration: none; color: inherit;">
          <span class="ct-list__item-leading">${settingsSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Settings</span>
          </span>
        </a>
      </li>
    </ul>
  </nav>`,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('nav');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');

    const list = nav.querySelector('.ct-list--nav');
    expect(list).not.toBeNull();

    const items = list.querySelectorAll('.ct-list__item');
    expect(items).toHaveLength(4);

    // Current page
    expect(items[0]).toHaveAttribute('aria-current', 'page');

    // Links
    for (const item of items) {
      expect(item.querySelector('a')).not.toBeNull();
    }
  },
};

// ── Dense Variant ──

export const Dense = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Default density</p>
      <ul class="ct-list" aria-label="Default density list">
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${mailSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Inbox</span>
            <span class="ct-list__item-description">12 unread messages</span>
          </span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${starSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Starred</span>
            <span class="ct-list__item-description">3 starred items</span>
          </span>
        </li>
      </ul>
    </div>
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Dense</p>
      <ul class="ct-list ct-list--dense" aria-label="Dense list">
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${mailSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Inbox</span>
            <span class="ct-list__item-description">12 unread messages</span>
          </span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${starSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Starred</span>
            <span class="ct-list__item-description">3 starred items</span>
          </span>
        </li>
      </ul>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const lists = canvasElement.querySelectorAll('.ct-list');
    expect(lists).toHaveLength(2);

    const defaultList = canvasElement.querySelector('[aria-label="Default density list"]');
    const denseList = canvasElement.querySelector('[aria-label="Dense list"]');
    expect(denseList.classList.contains('ct-list--dense')).toBe(true);

    // Dense items have smaller padding
    const defaultItem = defaultList.querySelector('.ct-list__item');
    const denseItem = denseList.querySelector('.ct-list__item');
    const defaultPadding = parseFloat(window.getComputedStyle(defaultItem).paddingTop);
    const densePadding = parseFloat(window.getComputedStyle(denseItem).paddingTop);
    expect(densePadding).toBeLessThan(defaultPadding);
  },
};

// ── Bordered / Flush / Striped ──

export const Variants = {
  parameters: {
    docs: {
      description: {
        story: 'Visual variants: bordered (card-style borders per item), flush (no outer padding, for embedding in cards), striped (alternating backgrounds).',
      },
    },
  },
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Bordered</p>
      <ul class="ct-list ct-list--bordered" aria-label="Bordered list" data-testid="bordered">
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${userSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Profile Settings</span>
            <span class="ct-list__item-description">Manage your personal information</span>
          </span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${bellSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Notification Preferences</span>
            <span class="ct-list__item-description">Configure alerts and notifications</span>
          </span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${settingsSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Security</span>
            <span class="ct-list__item-description">Password, 2FA, and sessions</span>
          </span>
        </li>
      </ul>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Flush (embedded in card)</p>
      <div class="ct-card">
        <div class="ct-card__header">
          <h3 style="margin: 0; font-size: var(--font-size-md); font-weight: var(--font-weight-semibold);">Team Members</h3>
        </div>
        <ul class="ct-list ct-list--flush" aria-label="Flush list" data-testid="flush">
          <li class="ct-list__item">
            <span class="ct-list__item-leading">${avatar('AW', 'var(--color-ocean-600)')}</span>
            <span class="ct-list__item-content">
              <span class="ct-list__item-title">Alex Walker</span>
            </span>
          </li>
          <li class="ct-list__divider" role="separator" aria-hidden="true"></li>
          <li class="ct-list__item">
            <span class="ct-list__item-leading">${avatar('MJ', 'var(--color-teal-600)')}</span>
            <span class="ct-list__item-content">
              <span class="ct-list__item-title">Maria Johnson</span>
            </span>
          </li>
          <li class="ct-list__divider" role="separator" aria-hidden="true"></li>
          <li class="ct-list__item">
            <span class="ct-list__item-leading">${avatar('SK', 'var(--color-slate-600)')}</span>
            <span class="ct-list__item-content">
              <span class="ct-list__item-title">Sam Kim</span>
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Striped</p>
      <ul class="ct-list ct-list--striped" aria-label="Striped list" data-testid="striped">
        <li class="ct-list__item">
          <span class="ct-list__item-content"><span class="ct-list__item-title">Row 1</span></span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-content"><span class="ct-list__item-title">Row 2</span></span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-content"><span class="ct-list__item-title">Row 3</span></span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-content"><span class="ct-list__item-title">Row 4</span></span>
        </li>
      </ul>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    // Bordered
    const bordered = canvasElement.querySelector('[data-testid="bordered"]');
    expect(bordered.classList.contains('ct-list--bordered')).toBe(true);
    const borderedItem = bordered.querySelector('.ct-list__item');
    const borderedStyle = window.getComputedStyle(borderedItem);
    expect(borderedStyle.borderStyle).not.toBe('none');

    // Flush
    const flush = canvasElement.querySelector('[data-testid="flush"]');
    expect(flush.classList.contains('ct-list--flush')).toBe(true);
    const flushStyle = window.getComputedStyle(flush);
    expect(flushStyle.padding).toBe('0px');
    expect(flushStyle.borderRadius).toBe('0px');

    // Striped
    const striped = canvasElement.querySelector('[data-testid="striped"]');
    expect(striped.classList.contains('ct-list--striped')).toBe(true);
    expect(striped.querySelectorAll('.ct-list__item')).toHaveLength(4);
  },
};

// ── With Dividers ──

export const Dividers = {
  parameters: {
    docs: {
      description: {
        story: 'Full-width and inset dividers. Inset dividers align with the content area, respecting the leading slot width.',
      },
    },
  },
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Full-width dividers</p>
      <ul class="ct-list" aria-label="Full-width dividers" data-testid="full-dividers">
        <li class="ct-list__item">
          <span class="ct-list__item-content"><span class="ct-list__item-title">Item One</span></span>
        </li>
        <li class="ct-list__divider" role="separator" aria-hidden="true"></li>
        <li class="ct-list__item">
          <span class="ct-list__item-content"><span class="ct-list__item-title">Item Two</span></span>
        </li>
        <li class="ct-list__divider" role="separator" aria-hidden="true"></li>
        <li class="ct-list__item">
          <span class="ct-list__item-content"><span class="ct-list__item-title">Item Three</span></span>
        </li>
      </ul>
    </div>
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Inset dividers</p>
      <ul class="ct-list" aria-label="Inset dividers" data-testid="inset-dividers">
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${userSvg}</span>
          <span class="ct-list__item-content"><span class="ct-list__item-title">Alice</span></span>
        </li>
        <li class="ct-list__divider ct-list__divider--inset" role="separator" aria-hidden="true"></li>
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${userSvg}</span>
          <span class="ct-list__item-content"><span class="ct-list__item-title">Bob</span></span>
        </li>
        <li class="ct-list__divider ct-list__divider--inset" role="separator" aria-hidden="true"></li>
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${userSvg}</span>
          <span class="ct-list__item-content"><span class="ct-list__item-title">Charlie</span></span>
        </li>
      </ul>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const fullList = canvasElement.querySelector('[data-testid="full-dividers"]');
    const fullDividers = fullList.querySelectorAll('.ct-list__divider');
    expect(fullDividers).toHaveLength(2);

    const insetList = canvasElement.querySelector('[data-testid="inset-dividers"]');
    const insetDividers = insetList.querySelectorAll('.ct-list__divider--inset');
    expect(insetDividers).toHaveLength(2);
  },
};

// ── Disabled Items ──

export const DisabledItems = {
  render: () => `
  <div class="ct-list ct-list--selectable" role="listbox" aria-label="Options with disabled">
    <div class="ct-list__item" role="option" aria-selected="false" tabindex="0">
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Available Option</span>
        <span class="ct-list__item-description">This option can be selected</span>
      </span>
    </div>
    <div class="ct-list__item" role="option" aria-selected="false" aria-disabled="true">
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Disabled Option</span>
        <span class="ct-list__item-description">This option is not available</span>
      </span>
    </div>
    <div class="ct-list__item" role="option" aria-selected="false" tabindex="-1">
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Another Available</span>
        <span class="ct-list__item-description">This one works too</span>
      </span>
    </div>
    <div class="ct-list__item" role="option" aria-selected="false" aria-disabled="true">
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Also Disabled</span>
        <span class="ct-list__item-description">Not clickable or focusable</span>
      </span>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const listbox = canvasElement.querySelector('[role="listbox"]');
    initListboxKeyboard(listbox);
    initListboxSelect(listbox);

    const options = [...listbox.querySelectorAll('[role="option"]')];
    expect(options).toHaveLength(4);

    const disabled = options.filter((o) => o.getAttribute('aria-disabled') === 'true');
    expect(disabled).toHaveLength(2);

    // Disabled items have reduced opacity
    for (const item of disabled) {
      const style = window.getComputedStyle(item);
      expect(parseFloat(style.opacity)).toBeLessThan(1);
    }

    // Keyboard skips disabled items
    const enabled = options.filter((o) => o.getAttribute('aria-disabled') !== 'true');
    enabled[0].focus();
    expect(enabled[0]).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(enabled[1]).toHaveFocus(); // skipped disabled

    // Disabled items retain their state (pointer-events: none prevents clicks)
    expect(disabled[0]).toHaveAttribute('aria-selected', 'false');
  },
};

// ── Empty State ──

export const EmptyState = {
  render: () => `
  <ul class="ct-list" aria-label="Search results">
    <li class="ct-list__empty">
      <div class="ct-empty-state ct-empty-state--sm">
        <div class="ct-empty-state__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <p class="ct-empty-state__title">No results found</p>
        <p class="ct-empty-state__description">Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    </li>
  </ul>`,
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('.ct-list');
    expect(list).toHaveAttribute('aria-label', 'Search results');

    const emptyState = list.querySelector('.ct-list__empty');
    expect(emptyState).not.toBeNull();

    expect(list.querySelectorAll('.ct-list__item')).toHaveLength(0);

    const title = emptyState.querySelector('.ct-empty-state__title');
    expect(title.textContent).toBe('No results found');
  },
};

// ── Sizes ──

export const Sizes = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Small</p>
      <ul class="ct-list ct-list--sm" aria-label="Small list" data-testid="sm-list">
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${mailSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Inbox</span>
            <span class="ct-list__item-description">12 unread</span>
          </span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${starSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Starred</span>
            <span class="ct-list__item-description">3 items</span>
          </span>
        </li>
      </ul>
    </div>
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Default (md)</p>
      <ul class="ct-list" aria-label="Default list" data-testid="md-list">
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${mailSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Inbox</span>
            <span class="ct-list__item-description">12 unread</span>
          </span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${starSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Starred</span>
            <span class="ct-list__item-description">3 items</span>
          </span>
        </li>
      </ul>
    </div>
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Large</p>
      <ul class="ct-list ct-list--lg" aria-label="Large list" data-testid="lg-list">
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${mailSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Inbox</span>
            <span class="ct-list__item-description">12 unread</span>
          </span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${starSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Starred</span>
            <span class="ct-list__item-description">3 items</span>
          </span>
        </li>
      </ul>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const smList = canvasElement.querySelector('[data-testid="sm-list"]');
    const mdList = canvasElement.querySelector('[data-testid="md-list"]');
    const lgList = canvasElement.querySelector('[data-testid="lg-list"]');

    expect(smList.classList.contains('ct-list--sm')).toBe(true);
    expect(lgList.classList.contains('ct-list--lg')).toBe(true);

    // Font size grows across variants
    const smTitle = smList.querySelector('.ct-list__item-title');
    const mdTitle = mdList.querySelector('.ct-list__item-title');
    const lgTitle = lgList.querySelector('.ct-list__item-title');

    const smFontSize = parseFloat(window.getComputedStyle(smTitle).fontSize);
    const mdFontSize = parseFloat(window.getComputedStyle(mdTitle).fontSize);
    const lgFontSize = parseFloat(window.getComputedStyle(lgTitle).fontSize);

    expect(smFontSize).toBeLessThan(mdFontSize);
    expect(mdFontSize).toBeLessThan(lgFontSize);
  },
};

// ── Ordered List ──

export const OrderedList = {
  render: () => `
  <ol class="ct-list" aria-label="Top priorities" style="counter-reset: list-counter;">
    <li class="ct-list__item" style="counter-increment: list-counter;">
      <span class="ct-list__item-leading" style="font-weight: var(--font-weight-semibold); color: var(--color-text-primary); font-size: var(--font-size-sm);" aria-hidden="true">1.</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Fix authentication bug</span>
        <span class="ct-list__item-description">Users are getting logged out after 5 minutes</span>
      </span>
    </li>
    <li class="ct-list__item" style="counter-increment: list-counter;">
      <span class="ct-list__item-leading" style="font-weight: var(--font-weight-semibold); color: var(--color-text-primary); font-size: var(--font-size-sm);" aria-hidden="true">2.</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Deploy API v2</span>
        <span class="ct-list__item-description">New endpoints for the mobile team</span>
      </span>
    </li>
    <li class="ct-list__item" style="counter-increment: list-counter;">
      <span class="ct-list__item-leading" style="font-weight: var(--font-weight-semibold); color: var(--color-text-primary); font-size: var(--font-size-sm);" aria-hidden="true">3.</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Update documentation</span>
        <span class="ct-list__item-description">API changes need to be reflected</span>
      </span>
    </li>
  </ol>`,
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('.ct-list');
    expect(list.tagName).toBe('OL');
    expect(list).toHaveAttribute('aria-label', 'Top priorities');
    expect(list.querySelectorAll('.ct-list__item')).toHaveLength(3);
  },
};

// ── Integration: Avatar, Badge, Switch ──

export const IntegrationExamples = {
  parameters: {
    docs: {
      description: {
        story: 'Integration with Construct components: Avatar for leading slots, Badge for counts, and Switch for trailing actions.',
      },
    },
  },
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">With Avatars + Badges</p>
      <ul class="ct-list" aria-label="Contacts">
        <li class="ct-list__item ct-list__item--interactive">
          <span class="ct-list__item-leading">${avatar('AW', 'var(--color-ocean-600)')}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Alex Walker</span>
            <span class="ct-list__item-description">alex@example.com</span>
          </span>
          <span class="ct-list__item-trailing">
            <span class="ct-badge ct-badge--success ct-badge--sm">Online</span>
          </span>
        </li>
        <li class="ct-list__item ct-list__item--interactive">
          <span class="ct-list__item-leading">${avatar('MJ', 'var(--color-teal-600)')}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Maria Johnson</span>
            <span class="ct-list__item-description">maria@example.com</span>
          </span>
          <span class="ct-list__item-trailing">
            <span class="ct-badge ct-badge--sm">Offline</span>
          </span>
        </li>
      </ul>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">With Switches</p>
      <ul class="ct-list" aria-label="Notification settings">
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${mailSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Email notifications</span>
            <span class="ct-list__item-description">Receive email for important updates</span>
          </span>
          <span class="ct-list__item-trailing">
            <label class="ct-switch">
              <input type="checkbox" aria-label="Email notifications" checked />
              <span class="ct-switch__track"></span>
            </label>
          </span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-leading">${bellSvg}</span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Push notifications</span>
            <span class="ct-list__item-description">Get notified on your device</span>
          </span>
          <span class="ct-list__item-trailing">
            <label class="ct-switch">
              <input type="checkbox" aria-label="Push notifications" />
              <span class="ct-switch__track"></span>
            </label>
          </span>
        </li>
      </ul>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">With Checkboxes</p>
      <ul class="ct-list" aria-label="Task list">
        <li class="ct-list__item">
          <span class="ct-list__item-leading">
            <label class="ct-check">
              <input type="checkbox" aria-label="Review pull request" checked />
              <span class="ct-check__indicator"></span>
            </label>
          </span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Review pull request</span>
          </span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-leading">
            <label class="ct-check">
              <input type="checkbox" aria-label="Update documentation" />
              <span class="ct-check__indicator"></span>
            </label>
          </span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Update documentation</span>
          </span>
        </li>
        <li class="ct-list__item">
          <span class="ct-list__item-leading">
            <label class="ct-check">
              <input type="checkbox" aria-label="Deploy to staging" />
              <span class="ct-check__indicator"></span>
            </label>
          </span>
          <span class="ct-list__item-content">
            <span class="ct-list__item-title">Deploy to staging</span>
          </span>
        </li>
      </ul>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    // Contacts list with badges
    const contacts = canvasElement.querySelector('[aria-label="Contacts"]');
    expect(contacts.querySelectorAll('.ct-badge')).toHaveLength(2);

    // Notification settings with switches
    const notifications = canvasElement.querySelector('[aria-label="Notification settings"]');
    const switches = notifications.querySelectorAll('.ct-switch input');
    expect(switches).toHaveLength(2);
    expect(switches[0].checked).toBe(true);
    expect(switches[1].checked).toBe(false);

    // Task list with checkboxes
    const tasks = canvasElement.querySelector('[aria-label="Task list"]');
    const checkboxes = tasks.querySelectorAll('.ct-check input');
    expect(checkboxes).toHaveLength(3);
    expect(checkboxes[0].checked).toBe(true);
  },
};

// ── Keyboard Navigation (Listbox) ──

export const KeyboardNavigation = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates listbox keyboard navigation: ArrowUp/Down to move focus, Home/End to jump, Enter/Space to select, disabled items are skipped, focus wraps.',
      },
    },
  },
  render: () => `
  <div>
    <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Select a color – use Arrow keys, Home, End, Enter/Space</p>
    <div class="ct-list ct-list--selectable" role="listbox" aria-label="Color picker" data-testid="keyboard-listbox">
      <div class="ct-list__item" role="option" aria-selected="true" tabindex="0">
        <span class="ct-list__item-content"><span class="ct-list__item-title">Red</span></span>
      </div>
      <div class="ct-list__item" role="option" aria-selected="false" tabindex="-1">
        <span class="ct-list__item-content"><span class="ct-list__item-title">Green</span></span>
      </div>
      <div class="ct-list__item" role="option" aria-selected="false" aria-disabled="true">
        <span class="ct-list__item-content"><span class="ct-list__item-title">Blue (unavailable)</span></span>
      </div>
      <div class="ct-list__item" role="option" aria-selected="false" tabindex="-1">
        <span class="ct-list__item-content"><span class="ct-list__item-title">Yellow</span></span>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const listbox = canvasElement.querySelector('[data-testid="keyboard-listbox"]');
    initListboxKeyboard(listbox);
    initListboxSelect(listbox);

    const enabledOptions = [...listbox.querySelectorAll(
      '[role="option"]:not([aria-disabled="true"])'
    )];
    expect(enabledOptions).toHaveLength(3);

    // Focus first (selected) item
    enabledOptions[0].focus();
    expect(enabledOptions[0]).toHaveFocus();

    // ArrowDown → Green (skips disabled Blue)
    await userEvent.keyboard('{ArrowDown}');
    expect(enabledOptions[1]).toHaveFocus();

    // ArrowDown → Yellow
    await userEvent.keyboard('{ArrowDown}');
    expect(enabledOptions[2]).toHaveFocus();

    // ArrowDown wraps → Red
    await userEvent.keyboard('{ArrowDown}');
    expect(enabledOptions[0]).toHaveFocus();

    // ArrowUp wraps → Yellow
    await userEvent.keyboard('{ArrowUp}');
    expect(enabledOptions[2]).toHaveFocus();

    // Home → Red
    await userEvent.keyboard('{Home}');
    expect(enabledOptions[0]).toHaveFocus();

    // End → Yellow
    await userEvent.keyboard('{End}');
    expect(enabledOptions[2]).toHaveFocus();

    // Tabindex management
    expect(enabledOptions[2].tabIndex).toBe(0);
    expect(enabledOptions[0].tabIndex).toBe(-1);
    expect(enabledOptions[1].tabIndex).toBe(-1);

    // Enter selects
    await userEvent.keyboard('{Enter}');
    expect(enabledOptions[2]).toHaveAttribute('aria-selected', 'true');
    expect(enabledOptions[0]).toHaveAttribute('aria-selected', 'false');
  },
};

// ── Drag Handle (P2) ──

export const DragHandle = {
  parameters: {
    docs: {
      description: {
        story: 'Drag handle slot for sortable lists. CSS-only preparation – actual drag logic requires JavaScript.',
      },
    },
  },
  render: () => `
  <ul class="ct-list" aria-label="Sortable items">
    <li class="ct-list__item">
      <span class="ct-list__item-drag" aria-hidden="true">${gripVerticalSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">First item</span>
      </span>
      <span class="ct-list__item-trailing">
        <button class="ct-button ct-button--ghost ct-button--sm ct-button--icon" aria-label="Delete first item">${trashSvg}</button>
      </span>
    </li>
    <li class="ct-list__item">
      <span class="ct-list__item-drag" aria-hidden="true">${gripVerticalSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Second item</span>
      </span>
      <span class="ct-list__item-trailing">
        <button class="ct-button ct-button--ghost ct-button--sm ct-button--icon" aria-label="Delete second item">${trashSvg}</button>
      </span>
    </li>
    <li class="ct-list__item">
      <span class="ct-list__item-drag" aria-hidden="true">${gripVerticalSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Third item</span>
      </span>
      <span class="ct-list__item-trailing">
        <button class="ct-button ct-button--ghost ct-button--sm ct-button--icon" aria-label="Delete third item">${trashSvg}</button>
      </span>
    </li>
  </ul>`,
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('.ct-list__item');
    expect(items).toHaveLength(3);

    for (const item of items) {
      const drag = item.querySelector('.ct-list__item-drag');
      expect(drag).not.toBeNull();
      expect(drag).toHaveAttribute('aria-hidden', 'true');

      const style = window.getComputedStyle(drag);
      expect(style.cursor).toBe('grab');
    }

    // Delete buttons are accessible
    const deleteButtons = canvasElement.querySelectorAll('.ct-button');
    expect(deleteButtons).toHaveLength(3);
    for (const btn of deleteButtons) {
      expect(btn).toHaveAttribute('aria-label');
    }
  },
};

// ── Skeleton Loading (P2) ──

export const SkeletonLoading = {
  parameters: {
    docs: {
      description: {
        story: 'Skeleton placeholder items while data is loading. Uses `ct-skeleton` keyframe animation.',
      },
    },
  },
  render: () => `
  <ul class="ct-list" aria-label="Loading content" aria-busy="true">
    ${[1, 2, 3].map(() => `
    <li class="ct-list__item ct-list__item--skeleton" aria-hidden="true">
      <span class="ct-list__item-leading"></span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">&nbsp;</span>
        <span class="ct-list__item-description">&nbsp;</span>
      </span>
      <span class="ct-list__item-trailing" style="width: 40px; height: 1em;">&nbsp;</span>
    </li>`).join('')}
  </ul>`,
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('.ct-list');
    expect(list).toHaveAttribute('aria-busy', 'true');

    const skeletonItems = list.querySelectorAll('.ct-list__item--skeleton');
    expect(skeletonItems).toHaveLength(3);

    for (const item of skeletonItems) {
      expect(item).toHaveAttribute('aria-hidden', 'true');
    }
  },
};

// ── Active / Highlighted Item ──

export const ActiveItem = {
  render: () => `
  <ul class="ct-list" aria-label="Navigation with active item">
    <li class="ct-list__item ct-list__item--interactive">
      <span class="ct-list__item-leading">${homeSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Dashboard</span>
      </span>
    </li>
    <li class="ct-list__item ct-list__item--interactive ct-list__item--active">
      <span class="ct-list__item-leading">${mailSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Messages</span>
      </span>
    </li>
    <li class="ct-list__item ct-list__item--interactive">
      <span class="ct-list__item-leading">${settingsSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">Settings</span>
      </span>
    </li>
  </ul>`,
  play: async ({ canvasElement }) => {
    const activeItem = canvasElement.querySelector('.ct-list__item--active');
    expect(activeItem).not.toBeNull();

    const title = activeItem.querySelector('.ct-list__item-title');
    expect(title.textContent).toBe('Messages');

    // Active item has brand-primary color on title
    const style = window.getComputedStyle(title);
    const nonActiveTitle = canvasElement.querySelector(
      '.ct-list__item:not(.ct-list__item--active) .ct-list__item-title'
    );
    const nonActiveStyle = window.getComputedStyle(nonActiveTitle);
    expect(style.color).not.toBe(nonActiveStyle.color);
  },
};

// ── Grid Layout (P2) ──

export const GridLayout = {
  parameters: {
    docs: {
      description: {
        story: 'Grid layout variant for card-like list items. Uses CSS grid with `auto-fill` for responsive columns.',
      },
    },
  },
  render: () => `
  <ul class="ct-list ct-list--grid ct-list--bordered" aria-label="Project files">
    ${['Design System', 'API Docs', 'User Guide', 'Release Notes', 'Changelog', 'Contributing'].map((name) => `
    <li class="ct-list__item ct-list__item--interactive">
      <span class="ct-list__item-leading">${fileSvg}</span>
      <span class="ct-list__item-content">
        <span class="ct-list__item-title">${name}</span>
        <span class="ct-list__item-description">Updated recently</span>
      </span>
    </li>`).join('')}
  </ul>`,
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('.ct-list--grid');
    expect(list).not.toBeNull();

    const style = window.getComputedStyle(list);
    expect(style.display).toBe('grid');

    expect(list.querySelectorAll('.ct-list__item')).toHaveLength(6);
  },
};
