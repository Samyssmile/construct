import { expect, within, userEvent, waitFor } from 'storybook/test';

/* ── Shared SVG Icons ── */

const icons = {
  logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  docs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  support: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
};

/**
 * Initialize WAI-ARIA Menubar keyboard navigation (roving tabindex).
 * Supports ArrowLeft/Right between items, ArrowDown opens submenu,
 * Escape closes open menus, Home/End navigation.
 * @param {HTMLElement} navEl - The navbar element
 */
function initNavbarKeyboard(navEl) {
  const getLinks = () =>
    [...navEl.querySelectorAll('.ct-navbar__nav > .ct-navbar__item > .ct-navbar__link')]
      .filter(el => el.getAttribute('aria-disabled') !== 'true');

  const links = getLinks();
  if (!links.length) return;

  links.forEach((link, i) => {
    link.setAttribute('tabindex', i === 0 ? '0' : '-1');
  });

  navEl.addEventListener('keydown', (e) => {
    const currentLinks = getLinks();
    const idx = currentLinks.indexOf(document.activeElement);
    if (idx === -1) return;

    let next = -1;
    const currentItem = currentLinks[idx].closest('.ct-navbar__item');
    const hasMenu = currentItem && currentItem.hasAttribute('data-state');

    switch (e.key) {
      case 'ArrowRight':
        next = idx + 1 < currentLinks.length ? idx + 1 : 0;
        break;
      case 'ArrowLeft':
        next = idx - 1 >= 0 ? idx - 1 : currentLinks.length - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = currentLinks.length - 1;
        break;
      case 'ArrowDown':
        if (hasMenu) {
          e.preventDefault();
          openMenu(currentItem);
          const firstMenuItem = currentItem.querySelector('.ct-navbar__menu-item');
          if (firstMenuItem) {
            firstMenuItem.setAttribute('tabindex', '0');
            firstMenuItem.focus();
          }
          return;
        }
        return;
      case 'Escape':
        closeAllMenus(navEl);
        return;
      default:
        return;
    }

    e.preventDefault();
    currentLinks[idx].setAttribute('tabindex', '-1');
    currentLinks[next].setAttribute('tabindex', '0');
    currentLinks[next].focus();

    // Close any open menus when navigating between items
    closeAllMenus(navEl);
  });

  // Submenu keyboard navigation
  navEl.addEventListener('keydown', (e) => {
    const menuItem = e.target.closest('.ct-navbar__menu-item');
    if (!menuItem) return;

    const menu = menuItem.closest('.ct-navbar__menu');
    if (!menu) return;

    const items = [...menu.querySelectorAll('.ct-navbar__menu-item:not([aria-disabled="true"])')];
    const idx = items.indexOf(menuItem);

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const next = idx + 1 < items.length ? idx + 1 : 0;
        items[idx].setAttribute('tabindex', '-1');
        items[next].setAttribute('tabindex', '0');
        items[next].focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = idx - 1 >= 0 ? idx - 1 : items.length - 1;
        items[idx].setAttribute('tabindex', '-1');
        items[prev].setAttribute('tabindex', '0');
        items[prev].focus();
        break;
      }
      case 'Escape': {
        e.preventDefault();
        const navItem = menu.closest('.ct-navbar__item');
        closeAllMenus(navEl);
        if (navItem) {
          const trigger = navItem.querySelector('.ct-navbar__link');
          if (trigger) trigger.focus();
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        items[idx].setAttribute('tabindex', '-1');
        items[0].setAttribute('tabindex', '0');
        items[0].focus();
        break;
      }
      case 'End': {
        e.preventDefault();
        items[idx].setAttribute('tabindex', '-1');
        items[items.length - 1].setAttribute('tabindex', '0');
        items[items.length - 1].focus();
        break;
      }
    }
  });
}

/** Open a dropdown menu on a navbar item. */
function openMenu(item) {
  item.setAttribute('data-state', 'open');
  const trigger = item.querySelector('.ct-navbar__link');
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
}

/** Close a dropdown menu on a navbar item. */
function closeMenu(item) {
  item.setAttribute('data-state', 'closed');
  const trigger = item.querySelector('.ct-navbar__link');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

/** Close all open menus in a navbar. */
function closeAllMenus(navEl) {
  navEl.querySelectorAll('.ct-navbar__item[data-state="open"]').forEach(closeMenu);
}

/**
 * Initialize mobile menu toggle behavior.
 * @param {HTMLElement} navEl - The navbar element
 */
function initMobileToggle(navEl) {
  const toggle = navEl.querySelector('.ct-navbar__toggle');
  const mobileMenu = navEl.querySelector('.ct-navbar__mobile-menu');
  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', () => {
    const isOpen = mobileMenu.getAttribute('data-state') === 'open';
    if (isOpen) {
      mobileMenu.setAttribute('data-state', 'closed');
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenu.setAttribute('data-state', 'open');
      toggle.setAttribute('aria-expanded', 'true');
      // Focus trap: focus first link
      const firstLink = mobileMenu.querySelector('.ct-navbar__link');
      if (firstLink) firstLink.focus();
    }
  });

  // Close on Escape
  mobileMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      mobileMenu.setAttribute('data-state', 'closed');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

/* ── Helper: render standard navbar ── */

function renderNavbar({
  modifier = '',
  ariaLabel = 'Main navigation',
  activeItem = 'Dashboard',
  showActions = true,
  showBrand = true,
  showDropdown = false,
  showMobileToggle = false,
  showSearch = false,
  tag = 'header',
} = {}) {
  const items = [
    { label: 'Dashboard', icon: icons.dashboard },
    { label: 'Documents', icon: icons.docs },
    { label: 'Support', icon: icons.support },
    { label: 'Settings', icon: icons.settings },
  ];

  const navLinks = items.map(item => {
    const isActive = item.label === activeItem;
    const aria = isActive ? ' aria-current="page"' : '';
    return `<li class="ct-navbar__item" role="none">
        <a class="ct-navbar__link" href="#" role="menuitem"${aria}>
          <span class="ct-icon ct-icon--sm">${item.icon}</span>
          ${item.label}
        </a>
      </li>`;
  }).join('\n      ');

  const brand = showBrand
    ? `<a class="ct-navbar__brand" href="#">
      <span class="ct-icon">${icons.logo}</span>
      <span class="ct-navbar__title">Construct</span>
    </a>`
    : '';

  const mobileToggle = showMobileToggle
    ? `<button class="ct-navbar__toggle" type="button"
        aria-label="Open menu" aria-expanded="false"
        aria-controls="mobile-menu">
      <span class="ct-navbar__toggle-icon">
        <span></span><span></span><span></span>
      </span>
    </button>`
    : '';

  const searchSlot = showSearch
    ? `<button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Search">
        <span class="ct-icon">${icons.search}</span>
      </button>`
    : '';

  const actions = showActions
    ? `<div class="ct-navbar__actions">
      ${searchSlot}
      <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Notifications">
        <span class="ct-icon">${icons.bell}</span>
      </button>
      <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Profile menu">
        <span class="ct-icon">${icons.profile}</span>
      </button>
    </div>`
    : '';

  return `
  <${tag} class="ct-navbar${modifier ? ' ' + modifier : ''}">
    ${brand}
    ${mobileToggle}
    <nav aria-label="${ariaLabel}">
      <ul class="ct-navbar__nav" role="menubar">
        ${navLinks}
      </ul>
    </nav>
    <div class="ct-navbar__spacer"></div>
    ${actions}
  </${tag}>`;
}

/* ── Helper: render navbar with dropdown menus ── */

function renderNavbarWithDropdowns({
  modifier = '',
  ariaLabel = 'Main navigation',
  activeItem = 'Dashboard',
  openMenu: openMenuId = null,
} = {}) {
  const productsMenu = `
    <div class="ct-navbar__menu" role="menu" aria-label="Products" id="menu-products">
      <a class="ct-navbar__menu-item" href="#" role="menuitem">
        <span class="ct-navbar__menu-item-icon">${icons.code}</span>
        <span class="ct-navbar__menu-item-label">API Platform</span>
      </a>
      <a class="ct-navbar__menu-item" href="#" role="menuitem">
        <span class="ct-navbar__menu-item-icon">${icons.shield}</span>
        <span class="ct-navbar__menu-item-label">Security Suite</span>
      </a>
      <a class="ct-navbar__menu-item" href="#" role="menuitem">
        <span class="ct-navbar__menu-item-icon">${icons.dashboard}</span>
        <span class="ct-navbar__menu-item-label">Analytics</span>
      </a>
    </div>`;

  const resourcesMenu = `
    <div class="ct-navbar__menu" role="menu" aria-label="Resources" id="menu-resources">
      <a class="ct-navbar__menu-item" href="#" role="menuitem">
        <span class="ct-navbar__menu-item-icon">${icons.book}</span>
        <span class="ct-navbar__menu-item-label">Documentation</span>
      </a>
      <a class="ct-navbar__menu-item" href="#" role="menuitem">
        <span class="ct-navbar__menu-item-icon">${icons.users}</span>
        <span class="ct-navbar__menu-item-label">Community</span>
      </a>
      <div class="ct-navbar__menu-separator" role="separator"></div>
      <a class="ct-navbar__menu-item" href="#" role="menuitem">
        <span class="ct-navbar__menu-item-icon">${icons.support}</span>
        <span class="ct-navbar__menu-item-label">Support Center</span>
      </a>
    </div>`;

  const productsState = openMenuId === 'products' ? 'open' : 'closed';
  const resourcesState = openMenuId === 'resources' ? 'open' : 'closed';

  return `
  <header class="ct-navbar${modifier ? ' ' + modifier : ''}">
    <a class="ct-navbar__brand" href="#">
      <span class="ct-icon">${icons.logo}</span>
      <span class="ct-navbar__title">Construct</span>
    </a>
    <nav aria-label="${ariaLabel}">
      <ul class="ct-navbar__nav" role="menubar">
        <li class="ct-navbar__item" role="none">
          <a class="ct-navbar__link" href="#" role="menuitem" aria-current="page">
            <span class="ct-icon ct-icon--sm">${icons.dashboard}</span>
            Dashboard
          </a>
        </li>
        <li class="ct-navbar__item" role="none" data-state="${productsState}">
          <button class="ct-navbar__link" type="button" role="menuitem"
            aria-haspopup="true" aria-expanded="${productsState === 'open'}" aria-controls="menu-products">
            Products
            <span class="ct-navbar__link-chevron">${icons.chevronDown}</span>
          </button>
          ${productsMenu}
        </li>
        <li class="ct-navbar__item" role="none" data-state="${resourcesState}">
          <button class="ct-navbar__link" type="button" role="menuitem"
            aria-haspopup="true" aria-expanded="${resourcesState === 'open'}" aria-controls="menu-resources">
            Resources
            <span class="ct-navbar__link-chevron">${icons.chevronDown}</span>
          </button>
          ${resourcesMenu}
        </li>
        <li class="ct-navbar__item" role="none">
          <a class="ct-navbar__link" href="#" role="menuitem">Pricing</a>
        </li>
      </ul>
    </nav>
    <div class="ct-navbar__spacer"></div>
    <div class="ct-navbar__actions">
      <button class="ct-button ct-button--ghost ct-button--sm" type="button">Sign In</button>
      <button class="ct-button ct-button--primary ct-button--sm" type="button">Get Started</button>
    </div>
  </header>`;
}

/* ── Helper: render navbar with mobile menu ── */

function renderNavbarMobile({
  modifier = '',
  ariaLabel = 'Main navigation',
  activeItem = 'Dashboard',
  mobileOpen = false,
} = {}) {
  const items = [
    { label: 'Dashboard', icon: icons.dashboard },
    { label: 'Documents', icon: icons.docs },
    { label: 'Support', icon: icons.support },
    { label: 'Settings', icon: icons.settings },
  ];

  const mobileLinks = items.map(item => {
    const isActive = item.label === activeItem;
    const aria = isActive ? ' aria-current="page"' : '';
    return `<a class="ct-navbar__link" href="#" role="menuitem"${aria}>
        <span class="ct-icon ct-icon--sm">${item.icon}</span>
        ${item.label}
      </a>`;
  }).join('\n      ');

  return `
  <header class="ct-navbar${modifier ? ' ' + modifier : ''}" style="position: relative;">
    <a class="ct-navbar__brand" href="#">
      <span class="ct-icon">${icons.logo}</span>
      <span class="ct-navbar__title">Construct</span>
    </a>
    <button class="ct-navbar__toggle" type="button"
      style="display: inline-flex;"
      aria-label="${mobileOpen ? 'Close menu' : 'Open menu'}"
      aria-expanded="${mobileOpen}"
      aria-controls="mobile-menu">
      <span class="ct-navbar__toggle-icon">
        <span></span><span></span><span></span>
      </span>
    </button>
    <nav aria-label="${ariaLabel}">
      <ul class="ct-navbar__nav" role="menubar">
        ${items.map(item => {
          const isActive = item.label === activeItem;
          const aria = isActive ? ' aria-current="page"' : '';
          return `<li class="ct-navbar__item" role="none">
            <a class="ct-navbar__link" href="#" role="menuitem"${aria}>
              <span class="ct-icon ct-icon--sm">${item.icon}</span>
              ${item.label}
            </a>
          </li>`;
        }).join('\n')}
      </ul>
    </nav>
    <div class="ct-navbar__spacer"></div>
    <div class="ct-navbar__actions">
      <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Profile menu">
        <span class="ct-icon">${icons.profile}</span>
      </button>
    </div>
    <div class="ct-navbar__mobile-menu" id="mobile-menu"
      data-state="${mobileOpen ? 'open' : 'closed'}" role="menu" aria-label="Mobile navigation">
      ${mobileLinks}
      <div class="ct-navbar__mobile-separator" role="separator"></div>
      <a class="ct-navbar__link" href="#" role="menuitem">Sign In</a>
    </div>
  </header>`;
}

/* ── Meta ── */

export default {
  title: 'Navigation/Navbar',
  parameters: {
    docs: {
      description: {
        component:
          'Application navigation bar / app header. Provides brand, navigation links, dropdown menus, actions, and a responsive mobile menu. Supports WAI-ARIA Menubar keyboard pattern (roving tabindex, ArrowLeft/Right between items, ArrowDown opens submenus, Escape closes), size variants (sm/md/lg), positioning (sticky/fixed), visual variants (transparent, dark, elevated, bordered, center), and animated mobile hamburger toggle with focus trap. All values are tokenized.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'bordered', 'dark', 'transparent'],
      description: 'Visual variant',
    },
    activeItem: {
      control: 'select',
      options: ['Dashboard', 'Documents', 'Support', 'Settings'],
      description: 'Currently active navigation item',
    },
  },
};

/* ── Default ── */

export const Default = {
  render: () => renderNavbar(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nav = canvas.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();

    const menubar = canvas.getByRole('menubar');
    expect(menubar).toBeInTheDocument();

    const activeLink = canvas.getByRole('menuitem', { name: /Dashboard/ });
    expect(activeLink).toHaveAttribute('aria-current', 'page');

    expect(canvas.getByRole('menuitem', { name: /Documents/ })).not.toHaveAttribute('aria-current');
    expect(canvas.getByRole('menuitem', { name: /Support/ })).toBeInTheDocument();
    expect(canvas.getByRole('menuitem', { name: /Settings/ })).toBeInTheDocument();

    // Header landmark
    const header = canvasElement.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header.classList.contains('ct-navbar')).toBe(true);

    // Brand
    expect(canvas.getByRole('link', { name: /Construct/ })).toBeInTheDocument();

    // Actions
    expect(canvas.getByRole('button', { name: 'Profile menu' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
  },
};

/* ── Playground ── */

export const Playground = {
  args: {
    size: 'default',
    variant: 'default',
    activeItem: 'Dashboard',
  },
  render: ({ size, variant, activeItem }) => {
    const modifiers = [];
    if (size && size !== 'default') modifiers.push(`ct-navbar--${size}`);
    if (variant && variant !== 'default') modifiers.push(`ct-navbar--${variant}`);
    return renderNavbar({ modifier: modifiers.join(' '), activeItem });
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    const activeLink = canvasElement.querySelector('[aria-current="page"]');
    expect(activeLink).toBeInTheDocument();
  },
};

/* ── Size: Small ── */

export const SizeSmall = {
  name: 'Size: Small',
  render: () => renderNavbar({ modifier: 'ct-navbar--sm' }),
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');
    expect(navbar.classList.contains('ct-navbar--sm')).toBe(true);
    expect(within(canvasElement).getByRole('navigation')).toBeInTheDocument();
  },
};

/* ── Size: Large ── */

export const SizeLarge = {
  name: 'Size: Large',
  render: () => renderNavbar({ modifier: 'ct-navbar--lg' }),
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');
    expect(navbar.classList.contains('ct-navbar--lg')).toBe(true);
    expect(within(canvasElement).getByRole('navigation')).toBeInTheDocument();
  },
};

/* ── All Sizes Comparison ── */

export const SizeComparison = {
  name: 'Size Comparison',
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Small (ct-navbar--sm)</p>
        ${renderNavbar({ modifier: 'ct-navbar--sm', ariaLabel: 'Small navbar', tag: 'div' })}
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Default (md)</p>
        ${renderNavbar({ ariaLabel: 'Default navbar', tag: 'div' })}
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Large (ct-navbar--lg)</p>
        ${renderNavbar({ modifier: 'ct-navbar--lg', ariaLabel: 'Large navbar', tag: 'div' })}
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const navbars = canvasElement.querySelectorAll('.ct-navbar');
    expect(navbars.length).toBe(3);
  },
};

/* ── Dropdown Menus ── */

export const WithDropdowns = {
  name: 'Dropdown Menus',
  render: () => {
    const html = renderNavbarWithDropdowns({ openMenu: 'products' });
    return html;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Menubar present
    expect(canvas.getByRole('menubar')).toBeInTheDocument();

    // Dropdown triggers
    const productsBtn = canvas.getByRole('menuitem', { name: /Products/ });
    expect(productsBtn).toHaveAttribute('aria-haspopup', 'true');
    expect(productsBtn).toHaveAttribute('aria-expanded', 'true');

    const resourcesBtn = canvas.getByRole('menuitem', { name: /Resources/ });
    expect(resourcesBtn).toHaveAttribute('aria-haspopup', 'true');
    expect(resourcesBtn).toHaveAttribute('aria-expanded', 'false');

    // Products menu is open
    const productsItem = productsBtn.closest('.ct-navbar__item');
    expect(productsItem).toHaveAttribute('data-state', 'open');

    // Menu items visible
    const menu = canvasElement.querySelector('#menu-products');
    expect(menu).toBeInTheDocument();
  },
};

/* ── Dropdown Menus (Interactive) ── */

export const DropdownsInteractive = {
  name: 'Dropdown Menus (Interactive)',
  render: () => renderNavbarWithDropdowns(),
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');

    // Wire up dropdown toggle behavior
    navbar.querySelectorAll('.ct-navbar__item[data-state]').forEach(item => {
      const trigger = item.querySelector('.ct-navbar__link');
      if (!trigger) return;
      trigger.addEventListener('click', () => {
        const isOpen = item.getAttribute('data-state') === 'open';
        closeAllMenus(navbar);
        if (!isOpen) openMenu(item);
      });
    });

    initNavbarKeyboard(navbar);

    // Click Products to open
    const productsBtn = canvasElement.querySelector('[aria-controls="menu-products"]');
    await userEvent.click(productsBtn);
    expect(productsBtn).toHaveAttribute('aria-expanded', 'true');
    expect(productsBtn.closest('.ct-navbar__item')).toHaveAttribute('data-state', 'open');

    // Escape closes
    await userEvent.keyboard('{Escape}');
    expect(productsBtn).toHaveAttribute('aria-expanded', 'false');
  },
};

/* ── Sticky ── */

export const Sticky = {
  render: () => `
    <div style="height: 300px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
      ${renderNavbar({ modifier: 'ct-navbar--sticky', ariaLabel: 'Sticky navbar' })}
      <div style="padding: 16px;">
        ${Array.from({ length: 20 }, (_, i) => `<p>Scroll content paragraph ${i + 1}. The navbar stays pinned to the top.</p>`).join('\n')}
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');
    expect(navbar.classList.contains('ct-navbar--sticky')).toBe(true);
    expect(within(canvasElement).getByRole('navigation', { name: 'Sticky navbar' })).toBeInTheDocument();
  },
};

/* ── Fixed ── */

export const Fixed = {
  parameters: {
    docs: {
      description: {
        story: '`ct-navbar--fixed` uses `position: fixed` and spans the full viewport width. In production, add matching `padding-top` to your body to prevent content from hiding behind the navbar.',
      },
    },
  },
  render: () => `
    <div style="position: relative; height: 300px; overflow: hidden; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="position: relative; height: 100%; overflow-y: auto;">
        ${renderNavbar({ modifier: 'ct-navbar--fixed', ariaLabel: 'Fixed navbar' }).replace('position: fixed', 'position: absolute')}
        <div style="padding: 80px 16px 16px;">
          ${Array.from({ length: 15 }, (_, i) => `<p>Content paragraph ${i + 1}.</p>`).join('\n')}
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');
    expect(navbar.classList.contains('ct-navbar--fixed')).toBe(true);
  },
};

/* ── Elevated ── */

export const Elevated = {
  render: () => renderNavbar({ modifier: 'ct-navbar--elevated', ariaLabel: 'Elevated navbar' }),
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');
    expect(navbar.classList.contains('ct-navbar--elevated')).toBe(true);
  },
};

/* ── Dark ── */

export const Dark = {
  render: () => renderNavbar({ modifier: 'ct-navbar--dark', ariaLabel: 'Dark navbar' }),
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');
    expect(navbar.classList.contains('ct-navbar--dark')).toBe(true);
    expect(within(canvasElement).getByRole('navigation', { name: 'Dark navbar' })).toBeInTheDocument();
  },
};

/* ── Transparent (Hero Overlay) ── */

export const Transparent = {
  name: 'Transparent (Hero Overlay)',
  render: () => `
    <div style="position: relative; min-height: 400px; background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460); border-radius: 8px; overflow: hidden;">
      ${renderNavbar({ modifier: 'ct-navbar--transparent', ariaLabel: 'Transparent navbar' })}
      <div style="padding: 80px 32px; text-align: center; color: white;">
        <h1 style="font-size: 2.5rem; margin: 0 0 16px;">Welcome to Construct</h1>
        <p style="font-size: 1.125rem; opacity: 0.8; margin: 0;">A token-based, accessible design system</p>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');
    expect(navbar.classList.contains('ct-navbar--transparent')).toBe(true);
  },
};

/* ── Center Nav ── */

export const CenterNav = {
  name: 'Center Navigation',
  render: () => renderNavbar({ modifier: 'ct-navbar--center', ariaLabel: 'Centered navbar' }),
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');
    expect(navbar.classList.contains('ct-navbar--center')).toBe(true);
  },
};

/* ── Mobile Menu (Closed) ── */

export const MobileMenuClosed = {
  name: 'Mobile Menu (Closed)',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => renderNavbarMobile(),
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector('.ct-navbar__toggle');
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-label', 'Open menu');
    expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu');

    const mobileMenu = canvasElement.querySelector('.ct-navbar__mobile-menu');
    expect(mobileMenu).toHaveAttribute('data-state', 'closed');
  },
};

/* ── Mobile Menu (Open) ── */

export const MobileMenuOpen = {
  name: 'Mobile Menu (Open)',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => renderNavbarMobile({ mobileOpen: true }),
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector('.ct-navbar__toggle');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAttribute('aria-label', 'Close menu');

    const mobileMenu = canvasElement.querySelector('.ct-navbar__mobile-menu');
    expect(mobileMenu).toHaveAttribute('data-state', 'open');

    // Active item is marked
    const activeLink = mobileMenu.querySelector('[aria-current="page"]');
    expect(activeLink).toBeInTheDocument();
  },
};

/* ── Mobile Menu (Interactive) ── */

export const MobileMenuInteractive = {
  name: 'Mobile Menu (Interactive Toggle)',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => renderNavbarMobile(),
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');
    initMobileToggle(navbar);

    const toggle = navbar.querySelector('.ct-navbar__toggle');
    const mobileMenu = navbar.querySelector('.ct-navbar__mobile-menu');

    // Open
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(mobileMenu).toHaveAttribute('data-state', 'open');

    // Close via toggle
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(mobileMenu).toHaveAttribute('data-state', 'closed');

    // Open again and close via Escape
    await userEvent.click(toggle);
    expect(mobileMenu).toHaveAttribute('data-state', 'open');

    // Focus a link inside mobile menu, then press Escape
    const firstLink = mobileMenu.querySelector('.ct-navbar__link');
    firstLink.focus();
    await userEvent.keyboard('{Escape}');
    expect(mobileMenu).toHaveAttribute('data-state', 'closed');
    expect(toggle).toHaveFocus();
  },
};

/* ── Keyboard Navigation ── */

export const KeyboardNavigation = {
  name: 'WAI-ARIA Menubar (Keyboard)',
  render: () => renderNavbar(),
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');
    initNavbarKeyboard(navbar);

    const links = [...navbar.querySelectorAll('.ct-navbar__nav > .ct-navbar__item > .ct-navbar__link')];
    expect(links.length).toBe(4);

    // Only first item in tab order
    expect(links[0]).toHaveAttribute('tabindex', '0');
    expect(links[1]).toHaveAttribute('tabindex', '-1');
    expect(links[3]).toHaveAttribute('tabindex', '-1');

    // Focus first, ArrowRight moves to second
    links[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(links[1]);
    expect(links[1]).toHaveAttribute('tabindex', '0');
    expect(links[0]).toHaveAttribute('tabindex', '-1');

    // ArrowRight wraps around from last to first
    links[3].setAttribute('tabindex', '0');
    links[1].setAttribute('tabindex', '-1');
    links[3].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(links[0]);

    // Home goes to first
    links[2].setAttribute('tabindex', '0');
    links[0].setAttribute('tabindex', '-1');
    links[2].focus();
    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(links[0]);

    // End goes to last
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(links[links.length - 1]);
  },
};

/* ── Keyboard Navigation with Dropdowns ── */

export const KeyboardWithDropdowns = {
  name: 'Keyboard: Dropdown Menus',
  render: () => renderNavbarWithDropdowns(),
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');

    // Wire up dropdown toggle behavior
    navbar.querySelectorAll('.ct-navbar__item[data-state]').forEach(item => {
      const trigger = item.querySelector('.ct-navbar__link');
      if (!trigger) return;
      trigger.addEventListener('click', () => {
        const isOpen = item.getAttribute('data-state') === 'open';
        closeAllMenus(navbar);
        if (!isOpen) openMenu(item);
      });
    });

    initNavbarKeyboard(navbar);

    const links = [...navbar.querySelectorAll('.ct-navbar__nav > .ct-navbar__item > .ct-navbar__link')];

    // Navigate to Products (has dropdown)
    links[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(links[1]);

    // ArrowDown opens the menu
    await userEvent.keyboard('{ArrowDown}');
    const productsItem = links[1].closest('.ct-navbar__item');
    expect(productsItem).toHaveAttribute('data-state', 'open');

    // First menu item is focused
    const menuItems = [...productsItem.querySelectorAll('.ct-navbar__menu-item')];
    expect(document.activeElement).toBe(menuItems[0]);

    // ArrowDown navigates in menu
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(menuItems[1]);

    // Escape closes menu, focus returns to trigger
    await userEvent.keyboard('{Escape}');
    expect(productsItem).toHaveAttribute('data-state', 'closed');
    expect(document.activeElement).toBe(links[1]);
  },
};

/* ── Active/Current States ── */

export const ActiveStates = {
  name: 'Active / Current States',
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Dashboard active</p>
        ${renderNavbar({ activeItem: 'Dashboard', ariaLabel: 'Nav 1', tag: 'div' })}
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Documents active</p>
        ${renderNavbar({ activeItem: 'Documents', ariaLabel: 'Nav 2', tag: 'div' })}
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Support active</p>
        ${renderNavbar({ activeItem: 'Support', ariaLabel: 'Nav 3', tag: 'div' })}
      </div>
      <div>
        <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Settings active</p>
        ${renderNavbar({ activeItem: 'Settings', ariaLabel: 'Nav 4', tag: 'div' })}
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const navbars = canvasElement.querySelectorAll('.ct-navbar');
    expect(navbars.length).toBe(4);

    // Each navbar has exactly one active item
    navbars.forEach(navbar => {
      const activeLinks = navbar.querySelectorAll('[aria-current="page"]');
      expect(activeLinks.length).toBe(1);
    });
  },
};

/* ── Minimal (Brand + Action only) ── */

export const Minimal = {
  render: () => `
  <header class="ct-navbar">
    <a class="ct-navbar__brand" href="#">
      <span class="ct-icon">${icons.logo}</span>
      <span class="ct-navbar__title">My App</span>
    </a>
    <div class="ct-navbar__spacer"></div>
    <div class="ct-navbar__actions">
      <button class="ct-button ct-button--sm">Sign In</button>
    </div>
  </header>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('link', { name: /My App/ })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Sign In' })).toBeEnabled();
  },
};

/* ── With Search ── */

export const WithSearch = {
  name: 'With Search',
  render: () => renderNavbar({ showSearch: true }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Profile menu' })).toBeInTheDocument();
  },
};

/* ── With Badge on Items ── */

export const WithBadge = {
  name: 'With Notification Badge',
  render: () => `
  <header class="ct-navbar">
    <a class="ct-navbar__brand" href="#">
      <span class="ct-icon">${icons.logo}</span>
      <span class="ct-navbar__title">Construct</span>
    </a>
    <nav aria-label="Main navigation">
      <ul class="ct-navbar__nav" role="menubar">
        <li class="ct-navbar__item" role="none">
          <a class="ct-navbar__link" href="#" role="menuitem" aria-current="page">Dashboard</a>
        </li>
        <li class="ct-navbar__item" role="none">
          <a class="ct-navbar__link" href="#" role="menuitem" style="position: relative;">
            Support
            <span class="ct-badge ct-badge--sm ct-badge--danger" style="position: absolute; top: 0; inset-inline-end: 0; transform: translate(50%, -25%);">3</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="ct-navbar__spacer"></div>
    <div class="ct-navbar__actions">
      <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Notifications" style="position: relative;">
        <span class="ct-icon">${icons.bell}</span>
        <span class="ct-badge ct-badge--sm ct-badge--danger" style="position: absolute; top: 2px; inset-inline-end: 2px; min-width: 0; width: 8px; height: 8px; padding: 0;"></span>
      </button>
      <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Profile menu">
        <span class="ct-icon">${icons.profile}</span>
      </button>
    </div>
  </header>`,
  play: async ({ canvasElement }) => {
    const badges = canvasElement.querySelectorAll('.ct-badge');
    expect(badges.length).toBe(2);
  },
};

/* ── Reduced Motion ── */

export const ReducedMotion = {
  name: 'Reduced Motion',
  parameters: {
    docs: {
      description: {
        story: 'When `prefers-reduced-motion: reduce` is active, all navbar transitions are disabled — including the hamburger animation, dropdown menus, and mobile menu transitions. Enable reduced motion in your OS or browser DevTools to verify.',
      },
    },
  },
  render: () => renderNavbar({ ariaLabel: 'Reduced motion navbar' }),
  play: async ({ canvasElement }) => {
    const navLink = canvasElement.querySelector('.ct-navbar__link');
    expect(navLink).toBeInTheDocument();
  },
};

/* ── Dark with Dropdowns ── */

export const DarkWithDropdowns = {
  name: 'Dark + Dropdowns',
  render: () => renderNavbarWithDropdowns({ modifier: 'ct-navbar--dark', openMenu: 'products' }),
  play: async ({ canvasElement }) => {
    const navbar = canvasElement.querySelector('.ct-navbar');
    expect(navbar.classList.contains('ct-navbar--dark')).toBe(true);
    const openItem = canvasElement.querySelector('.ct-navbar__item[data-state="open"]');
    expect(openItem).toBeInTheDocument();
  },
};

/* ── With Skip Navigation ── */

export const WithSkipLink = {
  name: 'With Skip Navigation',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => `
    <a class="ct-skip-link" href="#main-content">Skip to main content</a>
    ${renderNavbar({ ariaLabel: 'Main navigation' })}
    <main id="main-content" style="padding: 24px;">
      <h1>Main Content</h1>
      <p>Tab from the address bar to reveal the skip link above the navbar.</p>
    </main>`,
  play: async ({ canvasElement }) => {
    const skipLink = canvasElement.querySelector('.ct-skip-link');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');

    const main = canvasElement.querySelector('#main-content');
    expect(main).toBeInTheDocument();
  },
};
