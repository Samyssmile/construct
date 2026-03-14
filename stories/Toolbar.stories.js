import { expect, within, userEvent } from 'storybook/test';

/**
 * Initialize WAI-ARIA Toolbar keyboard navigation (roving tabindex).
 * Supports ArrowLeft/Right, Home/End. Skips disabled items.
 * @param {HTMLElement} toolbar - Element with role="toolbar"
 */
function initToolbarKeyboard(toolbar) {
  const getItems = () =>
    [...toolbar.querySelectorAll('button, a, [role="button"]')]
      .filter(el => !el.disabled && el.getAttribute('aria-disabled') !== 'true');

  const items = getItems();
  if (!items.length) return;

  items.forEach((item, i) => {
    item.setAttribute('tabindex', i === 0 ? '0' : '-1');
  });

  toolbar.addEventListener('keydown', (e) => {
    const currentItems = getItems();
    const idx = currentItems.indexOf(document.activeElement);
    if (idx === -1) return;

    let next = -1;

    switch (e.key) {
      case 'ArrowRight':
        next = idx + 1 < currentItems.length ? idx + 1 : 0;
        break;
      case 'ArrowLeft':
        next = idx - 1 >= 0 ? idx - 1 : currentItems.length - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = currentItems.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    currentItems[idx].setAttribute('tabindex', '-1');
    currentItems[next].setAttribute('tabindex', '0');
    currentItems[next].focus();
  });
}

/* ── Shared SVG Icons ── */

const icons = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  docs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  support: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  bold: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>',
  italic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>',
  underline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>',
  alignLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>',
  alignCenter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>',
  alignRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>',
};

/** Helper to build a standard nav toolbar */
function renderNavToolbar({ modifier = '', ariaLabel = 'Main navigation', activeItem = 'Dashboard', showActions = true, showBrand = true, showMobileTrigger = false } = {}) {
  const items = [
    { label: 'Dashboard', icon: icons.dashboard },
    { label: 'Documents', icon: icons.docs },
    { label: 'Support', icon: icons.support },
    { label: 'Settings', icon: icons.settings },
  ];

  const navLinks = items.map(item => {
    const isActive = item.label === activeItem;
    const cls = `ct-toolbar__nav-link${isActive ? ' ct-toolbar__nav-link--active' : ''}`;
    const aria = isActive ? ' aria-current="page"' : '';
    return `<li><a class="${cls}" href="#"${aria}>
        <span class="ct-icon ct-icon--sm">${item.icon}</span>
        ${item.label}
      </a></li>`;
  }).join('\n      ');

  const brand = showBrand
    ? `<a class="ct-toolbar__brand" href="#">
      <span class="ct-icon">${icons.logo}</span>
      Accessful
    </a>`
    : '';

  const mobileTrigger = showMobileTrigger
    ? `<button class="ct-toolbar__mobile-trigger ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Open menu" aria-expanded="false">
      <span class="ct-icon">${icons.menu}</span>
    </button>`
    : '';

  const actions = showActions
    ? `<div class="ct-toolbar__actions">
      <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Profile menu">
        <span class="ct-icon">${icons.profile}</span>
      </button>
    </div>`
    : '';

  return `
  <nav class="ct-toolbar${modifier ? ' ' + modifier : ''}" aria-label="${ariaLabel}">
    ${brand}
    ${mobileTrigger}
    <ul class="ct-toolbar__nav">
      ${navLinks}
    </ul>
    <div class="ct-toolbar__spacer"></div>
    ${actions}
  </nav>`;
}

export default {
  title: 'Navigation/Toolbar',
  parameters: {
    docs: {
      description: {
        component:
          'Application toolbar with brand, navigation, and actions. Supports WAI-ARIA Toolbar keyboard pattern (roving tabindex, arrow key navigation), size variants (sm/md/lg/dense), responsive collapse, sticky positioning, and secondary styling. All values are tokenized — no hardcoded magic values.',
      },
    },
  },
};

/* ── Default ── */

export const Default = {
  render: () => renderNavToolbar(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nav = canvas.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();

    const activeLink = canvas.getByRole('link', { name: /Dashboard/ });
    expect(activeLink).toHaveAttribute('aria-current', 'page');

    expect(canvas.getByRole('link', { name: /Documents/ })).not.toHaveAttribute('aria-current');
    expect(canvas.getByRole('link', { name: /Support/ })).toBeInTheDocument();
    expect(canvas.getByRole('link', { name: /Settings/ })).toBeInTheDocument();
    expect(canvas.getByRole('link', { name: /Accessful/ })).toBeInTheDocument();

    const profileBtn = canvas.getByRole('button', { name: 'Profile menu' });
    expect(profileBtn).toHaveAttribute('aria-label', 'Profile menu');
  },
};

/* ── Playground ── */

export const Playground = {
  args: {
    brand: 'Accessful',
    ariaLabel: 'Main navigation',
    activeItem: 'Dashboard',
    size: 'default',
    variant: 'default',
  },
  argTypes: {
    brand: { control: 'text', description: 'Brand / product name' },
    ariaLabel: { control: 'text', description: 'Accessible label for the navigation landmark' },
    activeItem: {
      control: 'select',
      options: ['Dashboard', 'Documents', 'Support', 'Settings'],
      description: 'Currently active navigation item',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'dense'],
      description: 'Size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'borderless'],
      description: 'Visual variant',
    },
  },
  render: ({ brand, ariaLabel, activeItem, size, variant }) => {
    const modifiers = [];
    if (size && size !== 'default') modifiers.push(`ct-toolbar--${size}`);
    if (variant && variant !== 'default') modifiers.push(`ct-toolbar--${variant}`);
    return renderNavToolbar({ modifier: modifiers.join(' '), ariaLabel, activeItem });
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label');
    const activeLink = canvasElement.querySelector('[aria-current="page"]');
    expect(activeLink).toBeInTheDocument();
  },
};

/* ── Size Variants ── */

export const SizeSmall = {
  name: 'Size: Small',
  render: () => renderNavToolbar({ modifier: 'ct-toolbar--sm' }),
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('.ct-toolbar');
    expect(toolbar.classList.contains('ct-toolbar--sm')).toBe(true);
    expect(within(canvasElement).getByRole('navigation')).toBeInTheDocument();
  },
};

export const SizeLarge = {
  name: 'Size: Large',
  render: () => renderNavToolbar({ modifier: 'ct-toolbar--lg' }),
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('.ct-toolbar');
    expect(toolbar.classList.contains('ct-toolbar--lg')).toBe(true);
    expect(within(canvasElement).getByRole('navigation')).toBeInTheDocument();
  },
};

export const Dense = {
  render: () => renderNavToolbar({ modifier: 'ct-toolbar--dense' }),
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('.ct-toolbar');
    expect(toolbar.classList.contains('ct-toolbar--dense')).toBe(true);
    expect(within(canvasElement).getByRole('navigation')).toBeInTheDocument();
  },
};

/* ── All Sizes Comparison ── */

export const SizeComparison = {
  name: 'Size Comparison',
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Small (ct-toolbar--sm)</p>
        ${renderNavToolbar({ modifier: 'ct-toolbar--sm', ariaLabel: 'Small toolbar' })}
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Default (md)</p>
        ${renderNavToolbar({ ariaLabel: 'Default toolbar' })}
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Large (ct-toolbar--lg)</p>
        ${renderNavToolbar({ modifier: 'ct-toolbar--lg', ariaLabel: 'Large toolbar' })}
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Dense (ct-toolbar--dense)</p>
        ${renderNavToolbar({ modifier: 'ct-toolbar--dense', ariaLabel: 'Dense toolbar' })}
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const toolbars = canvasElement.querySelectorAll('.ct-toolbar');
    expect(toolbars.length).toBe(4);
  },
};

/* ── WAI-ARIA Toolbar with Keyboard Navigation ── */

export const KeyboardNavigation = {
  name: 'WAI-ARIA Toolbar (Keyboard)',
  render: () => `
  <div role="toolbar" class="ct-toolbar" aria-label="Text formatting" aria-orientation="horizontal">
    <div class="ct-toolbar__group" role="group" aria-label="Text style">
      <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Bold" aria-pressed="false">
        <span class="ct-icon">${icons.bold}</span>
      </button>
      <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Italic" aria-pressed="false">
        <span class="ct-icon">${icons.italic}</span>
      </button>
      <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Underline" aria-pressed="false">
        <span class="ct-icon">${icons.underline}</span>
      </button>
    </div>
    <div class="ct-toolbar__separator" role="separator"></div>
    <div class="ct-toolbar__group" role="group" aria-label="Alignment">
      <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Align left" aria-pressed="true">
        <span class="ct-icon">${icons.alignLeft}</span>
      </button>
      <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Align center" aria-pressed="false">
        <span class="ct-icon">${icons.alignCenter}</span>
      </button>
      <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Align right" aria-pressed="false">
        <span class="ct-icon">${icons.alignRight}</span>
      </button>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('[role="toolbar"]');
    expect(toolbar).toBeInTheDocument();
    expect(toolbar).toHaveAttribute('aria-label', 'Text formatting');
    expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal');

    // Groups are present with labels
    const groups = canvasElement.querySelectorAll('[role="group"]');
    expect(groups.length).toBe(2);
    expect(groups[0]).toHaveAttribute('aria-label', 'Text style');
    expect(groups[1]).toHaveAttribute('aria-label', 'Alignment');

    // Separator between groups
    expect(canvasElement.querySelector('[role="separator"]')).toBeInTheDocument();

    // Initialize keyboard navigation
    initToolbarKeyboard(toolbar);

    const buttons = [...toolbar.querySelectorAll('button')];

    // Only the first item should be in tab order
    expect(buttons[0]).toHaveAttribute('tabindex', '0');
    expect(buttons[1]).toHaveAttribute('tabindex', '-1');
    expect(buttons[5]).toHaveAttribute('tabindex', '-1');

    // Focus first item and navigate with ArrowRight
    buttons[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(buttons[1]).toHaveAttribute('tabindex', '0');
    expect(buttons[0]).toHaveAttribute('tabindex', '-1');
    expect(document.activeElement).toBe(buttons[1]);

    // ArrowLeft wraps to last item
    buttons[1].focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(buttons[0]);

    // Home jumps to first item
    buttons[3].setAttribute('tabindex', '0');
    buttons[3].focus();
    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(buttons[0]);

    // End jumps to last item
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);
  },
};

/* ── Toolbar with Disabled Items ── */

export const WithDisabledItems = {
  name: 'Keyboard: Disabled Items Skipped',
  render: () => `
  <div role="toolbar" class="ct-toolbar" aria-label="Actions" aria-orientation="horizontal">
    <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Copy">
      <span class="ct-icon">${icons.docs}</span>
    </button>
    <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Paste" disabled>
      <span class="ct-icon">${icons.docs}</span>
    </button>
    <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Delete">
      <span class="ct-icon">${icons.docs}</span>
    </button>
  </div>`,
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('[role="toolbar"]');
    initToolbarKeyboard(toolbar);

    const enabledButtons = [...toolbar.querySelectorAll('button:not([disabled])')];
    expect(enabledButtons.length).toBe(2);

    // First enabled item in tab order
    expect(enabledButtons[0]).toHaveAttribute('tabindex', '0');

    // ArrowRight skips disabled, goes to Delete
    enabledButtons[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(enabledButtons[1]);
    expect(document.activeElement).toHaveAttribute('aria-label', 'Delete');
  },
};

/* ── Sticky Toolbar ── */

export const Sticky = {
  render: () => `
    <div style="height: 300px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
      ${renderNavToolbar({ modifier: 'ct-toolbar--sticky', ariaLabel: 'Sticky toolbar' })}
      <div style="padding: 16px;">
        ${Array.from({ length: 20 }, (_, i) => `<p>Scroll content paragraph ${i + 1}. The toolbar stays pinned to the top.</p>`).join('\n')}
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('.ct-toolbar');
    expect(toolbar.classList.contains('ct-toolbar--sticky')).toBe(true);
    expect(within(canvasElement).getByRole('navigation', { name: 'Sticky toolbar' })).toBeInTheDocument();
  },
};

/* ── Secondary Toolbar ── */

export const Secondary = {
  render: () => `
    <div style="display: flex; flex-direction: column;">
      ${renderNavToolbar({ ariaLabel: 'Primary toolbar' })}
      ${renderNavToolbar({ modifier: 'ct-toolbar--secondary ct-toolbar--sm', ariaLabel: 'Secondary toolbar', activeItem: 'Documents', showBrand: false, showActions: false })}
    </div>`,
  play: async ({ canvasElement }) => {
    const toolbars = canvasElement.querySelectorAll('.ct-toolbar');
    expect(toolbars.length).toBe(2);
    expect(toolbars[1].classList.contains('ct-toolbar--secondary')).toBe(true);
    expect(within(canvasElement).getByRole('navigation', { name: 'Primary toolbar' })).toBeInTheDocument();
    expect(within(canvasElement).getByRole('navigation', { name: 'Secondary toolbar' })).toBeInTheDocument();
  },
};

/* ── Borderless ── */

export const Borderless = {
  render: () => renderNavToolbar({ modifier: 'ct-toolbar--borderless' }),
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('.ct-toolbar');
    expect(toolbar.classList.contains('ct-toolbar--borderless')).toBe(true);
  },
};

/* ── Responsive Collapse ── */

export const ResponsiveCollapse = {
  name: 'Responsive Collapse',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story: 'On viewports below 900px the nav links collapse into a dropdown controlled by the mobile trigger button. Toggle via `data-mobile-nav="open"` on the toolbar.',
      },
    },
  },
  render: () => {
    const html = renderNavToolbar({
      showMobileTrigger: true,
      ariaLabel: 'Responsive toolbar',
    });
    return html;
  },
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('.ct-toolbar');
    const trigger = canvasElement.querySelector('.ct-toolbar__mobile-trigger');
    expect(toolbar).toBeInTheDocument();

    // Trigger exists in markup (visible only below 900px via CSS)
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-label', 'Open menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

/* ── Mobile Nav Open State ── */

export const MobileNavOpen = {
  name: 'Mobile Nav (Open)',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => `
  <nav class="ct-toolbar" aria-label="Mobile toolbar" data-mobile-nav="open" style="position: relative;">
    <a class="ct-toolbar__brand" href="#">
      <span class="ct-icon">${icons.logo}</span>
      Accessful
    </a>
    <button class="ct-toolbar__mobile-trigger ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Close menu" aria-expanded="true">
      <span class="ct-icon">${icons.menu}</span>
    </button>
    <div class="ct-toolbar__spacer"></div>
    <ul class="ct-toolbar__nav">
      <li><a class="ct-toolbar__nav-link ct-toolbar__nav-link--active" href="#" aria-current="page">
        <span class="ct-icon ct-icon--sm">${icons.dashboard}</span> Dashboard
      </a></li>
      <li><a class="ct-toolbar__nav-link" href="#">
        <span class="ct-icon ct-icon--sm">${icons.docs}</span> Documents
      </a></li>
      <li><a class="ct-toolbar__nav-link" href="#">
        <span class="ct-icon ct-icon--sm">${icons.support}</span> Support
      </a></li>
      <li><a class="ct-toolbar__nav-link" href="#">
        <span class="ct-icon ct-icon--sm">${icons.settings}</span> Settings
      </a></li>
    </ul>
  </nav>`,
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('.ct-toolbar');
    expect(toolbar).toHaveAttribute('data-mobile-nav', 'open');

    const trigger = canvasElement.querySelector('.ct-toolbar__mobile-trigger');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-label', 'Close menu');
  },
};

/* ── Minimal (brand + action only) ── */

export const Minimal = {
  render: () => `
  <nav class="ct-toolbar" aria-label="Main navigation">
    <a class="ct-toolbar__brand" href="#">My App</a>
    <div class="ct-toolbar__spacer"></div>
    <div class="ct-toolbar__actions">
      <button class="ct-button ct-button--sm">Sign In</button>
    </div>
  </nav>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(canvas.getByRole('link', { name: 'My App' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Sign In' })).toBeEnabled();
  },
};

/* ── With Groups (Separator between groups) ── */

export const WithGroups = {
  name: 'Toolbar with Groups',
  render: () => `
  <div role="toolbar" class="ct-toolbar" aria-label="Document actions" aria-orientation="horizontal">
    <div class="ct-toolbar__group" role="group" aria-label="File">
      <button class="ct-button ct-button--ghost ct-button--sm" type="button">New</button>
      <button class="ct-button ct-button--ghost ct-button--sm" type="button">Open</button>
      <button class="ct-button ct-button--ghost ct-button--sm" type="button">Save</button>
    </div>
    <div class="ct-toolbar__separator" role="separator"></div>
    <div class="ct-toolbar__group" role="group" aria-label="Edit">
      <button class="ct-button ct-button--ghost ct-button--sm" type="button">Undo</button>
      <button class="ct-button ct-button--ghost ct-button--sm" type="button">Redo</button>
    </div>
    <div class="ct-toolbar__separator" role="separator"></div>
    <div class="ct-toolbar__group" role="group" aria-label="View">
      <button class="ct-button ct-button--ghost ct-button--sm" type="button">Zoom In</button>
      <button class="ct-button ct-button--ghost ct-button--sm" type="button">Zoom Out</button>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector('[role="toolbar"]');
    expect(toolbar).toHaveAttribute('aria-label', 'Document actions');

    const groups = canvasElement.querySelectorAll('[role="group"]');
    expect(groups.length).toBe(3);

    const separators = canvasElement.querySelectorAll('[role="separator"]');
    expect(separators.length).toBe(2);

    // Init keyboard and verify roving tabindex
    initToolbarKeyboard(toolbar);
    const buttons = [...toolbar.querySelectorAll('button')];
    expect(buttons[0]).toHaveAttribute('tabindex', '0');
    expect(buttons[1]).toHaveAttribute('tabindex', '-1');
  },
};

/* ── Reduced Motion ── */

export const ReducedMotion = {
  name: 'Reduced Motion',
  parameters: {
    docs: {
      description: {
        story: 'When `prefers-reduced-motion: reduce` is active, all toolbar transitions are disabled. This story renders normally — enable reduced motion in your OS or browser DevTools to verify.',
      },
    },
  },
  render: () => renderNavToolbar({ ariaLabel: 'Reduced motion toolbar' }),
  play: async ({ canvasElement }) => {
    const navLink = canvasElement.querySelector('.ct-toolbar__nav-link');
    expect(navLink).toBeInTheDocument();
    // Visual verification: transitions should be disabled with prefers-reduced-motion
  },
};
