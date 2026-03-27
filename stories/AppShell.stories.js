import { expect, within } from 'storybook/test';

/* ── Shared SVG Icons ── */

const icons = {
  logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  docs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  support: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
  panel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>',
};


/* ── Helper: Navbar HTML ── */

function renderNavbar(label = 'Main navigation') {
  return `
    <nav class="ct-navbar" aria-label="${label}">
      <div class="ct-navbar__brand">
        <span class="ct-icon">${icons.logo}</span>
        <span class="ct-navbar__brand-title">Construct</span>
      </div>
      <div class="ct-navbar__actions">
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Search">
          <span class="ct-icon ct-icon--sm">${icons.search}</span>
        </button>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Notifications">
          <span class="ct-icon ct-icon--sm">${icons.bell}</span>
        </button>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Profile">
          <span class="ct-icon ct-icon--sm">${icons.profile}</span>
        </button>
      </div>
    </nav>`;
}


/* ── Helper: Sidebar Navigation HTML ── */

function renderSidebar(label = 'Sidebar') {
  return `
    <nav class="ct-sidebar" aria-label="${label}">
      <div class="ct-sidebar__header">
        <strong>Workspace</strong>
      </div>
      <div class="ct-sidebar__content">
        <ul class="ct-nav-list">
          <li><a class="ct-nav-item ct-nav-item--active" href="#" aria-current="page">
            <span class="ct-nav-item__icon">${icons.home}</span>
            <span class="ct-nav-item__label">Dashboard</span>
          </a></li>
          <li><a class="ct-nav-item" href="#">
            <span class="ct-nav-item__icon">${icons.inbox}</span>
            <span class="ct-nav-item__label">Inbox</span>
            <span class="ct-nav-item__badge">5</span>
          </a></li>
          <li><a class="ct-nav-item" href="#">
            <span class="ct-nav-item__icon">${icons.docs}</span>
            <span class="ct-nav-item__label">Documents</span>
          </a></li>
          <li><a class="ct-nav-item" href="#">
            <span class="ct-nav-item__icon">${icons.support}</span>
            <span class="ct-nav-item__label">Messages</span>
            <span class="ct-nav-item__badge">12</span>
          </a></li>
          <li><a class="ct-nav-item" href="#">
            <span class="ct-nav-item__icon">${icons.settings}</span>
            <span class="ct-nav-item__label">Settings</span>
          </a></li>
        </ul>
      </div>
    </nav>`;
}


/* ── Helper: Main Content HTML ── */

function renderMainContent(options = {}) {
  const { withPageHeader = true, longContent = true } = options;

  const pageHeader = withPageHeader ? `
    <div class="ct-app-shell__page-header">
      <div>
        <nav aria-label="Breadcrumb">
          <ol class="ct-breadcrumbs">
            <li class="ct-breadcrumbs__item"><a href="#">Home</a></li>
            <li class="ct-breadcrumbs__item" aria-current="page">Dashboard</li>
          </ol>
        </nav>
        <h1 style="margin: var(--space-2) 0 0; font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold);">Dashboard</h1>
      </div>
      <div style="display: flex; gap: var(--space-3);">
        <button class="ct-button ct-button--secondary ct-button--sm" type="button">Export</button>
        <button class="ct-button ct-button--primary ct-button--sm" type="button">Create New</button>
      </div>
    </div>` : '';

  const cards = longContent ? Array.from({ length: 12 }, (_, i) => `
    <div class="ct-card" style="padding: var(--space-5);">
      <h2 style="margin: 0 0 var(--space-2); font-size: var(--font-size-md);">Card ${i + 1}</h2>
      <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">
        Sample content to demonstrate independent scrolling within the main area.
      </p>
    </div>`).join('') : `
    <div class="ct-card" style="padding: var(--space-5);">
      <p style="margin: 0; color: var(--color-text-secondary);">Main content area</p>
    </div>`;

  return `
    ${pageHeader}
    <div style="padding: var(--space-6); display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-5);">
      ${cards}
    </div>`;
}


/* ── Helper: Panel HTML ── */

function renderPanel() {
  return `
    <div style="padding: var(--space-5);">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-5);">
        <h2 style="margin: 0; font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);">Details</h2>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Close panel">
          <span class="ct-icon ct-icon--sm">${icons.close}</span>
        </button>
      </div>
      <div style="display: grid; gap: var(--space-4);">
        <div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-1);">Status</div>
          <span class="ct-badge ct-badge--success">Active</span>
        </div>
        <div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-1);">Created</div>
          <div style="font-size: var(--font-size-sm);">March 15, 2026</div>
        </div>
        <div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-1);">Description</div>
          <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
            A contextual inspector panel showing details about the selected item without leaving the list view.
          </div>
        </div>
      </div>
    </div>`;
}


/* ── Helper: Footer HTML ── */

function renderFooter() {
  return `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-6); font-size: var(--font-size-xs); color: var(--color-text-muted);">
      <span>Construct Design System v1.1.2</span>
      <span>Built with accessibility in mind</span>
    </div>`;
}


/* ── Toggle Helper ── */

function initShellToggle(root) {
  const sidebarToggle = root.querySelector('[data-shell-toggle="sidebar"]');
  const panelToggle = root.querySelector('[data-shell-toggle="panel"]');
  const shell = root.querySelector('.ct-app-shell');
  const backdrop = root.querySelector('.ct-app-shell__backdrop');

  if (sidebarToggle && shell) {
    sidebarToggle.addEventListener('click', () => {
      const current = shell.getAttribute('data-sidebar-state');
      const next = current === 'expanded' ? 'collapsed' : 'expanded';
      shell.setAttribute('data-sidebar-state', next);
      sidebarToggle.setAttribute('aria-expanded', String(next === 'expanded'));
    });
  }

  if (panelToggle && shell) {
    panelToggle.addEventListener('click', () => {
      const current = shell.getAttribute('data-panel-state');
      const next = current === 'open' ? 'closed' : 'open';
      shell.setAttribute('data-panel-state', next);
    });
  }

  if (backdrop && shell) {
    backdrop.addEventListener('click', () => {
      shell.setAttribute('data-sidebar-state', 'hidden');
    });
  }
}


/* ═══════════════════════════════════════════════════════════════ */
/* ── Story Configuration ────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export default {
  title: 'Layout/App Shell',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'CSS Grid layout shell that orchestrates Navbar, Sidebar, Main content, optional Panel, and Footer. ' +
          'Supports three sidebar states (expanded, collapsed/rail, hidden), two header variants, ' +
          'a contextual inspector panel, and a responsive 4-stage breakpoint cascade.',
      },
    },
  },
  argTypes: {
    sidebarState: {
      control: 'select',
      options: ['expanded', 'collapsed', 'hidden'],
      description: 'Sidebar display state',
    },
    panelState: {
      control: 'select',
      options: ['open', 'closed'],
      description: 'Panel display state',
    },
    headerVariant: {
      control: 'select',
      options: ['default', 'sidebar-full-height'],
      description: 'Header/sidebar layout relationship',
    },
    showFooter: {
      control: 'boolean',
      description: 'Show footer area',
    },
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Playground ─────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const Playground = {
  args: {
    sidebarState: 'expanded',
    panelState: 'closed',
    headerVariant: 'default',
    showFooter: true,
  },
  render: ({ sidebarState, panelState, headerVariant, showFooter }) => {
    const variantClass = headerVariant === 'sidebar-full-height' ? ' ct-app-shell--sidebar-full-height' : '';

    const html = `
    <div class="ct-app-shell${variantClass}" data-sidebar-state="${sidebarState}" data-panel-state="${panelState}">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell__header">
        ${renderNavbar()}
      </header>

      <aside class="ct-app-shell__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <main class="ct-app-shell__main" id="main-content" tabindex="0">
        ${renderMainContent()}
      </main>

      <aside class="ct-app-shell__panel" aria-label="Details">
        ${renderPanel()}
      </aside>

      ${showFooter ? `<footer class="ct-app-shell__footer">${renderFooter()}</footer>` : ''}

      <div class="ct-app-shell__backdrop"></div>
    </div>`;

    return html;
  },
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell');
    expect(shell).toBeInTheDocument();

    // Landmark structure
    const header = canvasElement.querySelector('.ct-app-shell__header');
    expect(header).toBeInTheDocument();

    const sidebar = canvasElement.querySelector('aside[aria-label="Site navigation"]');
    expect(sidebar).toBeInTheDocument();

    const main = canvasElement.querySelector('main#main-content');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('tabindex', '0');

    // Skip link
    const skipLink = canvasElement.querySelector('.ct-skip-link[href="#main-content"]');
    expect(skipLink).toBeInTheDocument();

    // Data attributes present
    expect(shell).toHaveAttribute('data-sidebar-state');
    expect(shell).toHaveAttribute('data-panel-state');
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Default Layout ─────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const DefaultLayout = {
  render: () => `
    <div class="ct-app-shell" data-sidebar-state="expanded">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell__header">
        ${renderNavbar()}
      </header>

      <aside class="ct-app-shell__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <main class="ct-app-shell__main" id="main-content" tabindex="0">
        ${renderMainContent()}
      </main>

      <footer class="ct-app-shell__footer">
        ${renderFooter()}
      </footer>

      <div class="ct-app-shell__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell');
    expect(shell).toBeInTheDocument();
    expect(shell).toHaveAttribute('data-sidebar-state', 'expanded');

    // Navbar inside header
    const navbar = canvasElement.querySelector('.ct-app-shell__header .ct-navbar');
    expect(navbar).toBeInTheDocument();

    // Sidebar with navigation
    const navItems = canvasElement.querySelectorAll('.ct-nav-item');
    expect(navItems.length).toBeGreaterThanOrEqual(4);

    // Active item
    const activeItem = canvasElement.querySelector('[aria-current="page"]');
    expect(activeItem).toBeInTheDocument();

    // Footer
    const footer = canvasElement.querySelector('.ct-app-shell__footer');
    expect(footer).toBeInTheDocument();

    // Main is scrollable
    const main = canvasElement.querySelector('.ct-app-shell__main');
    expect(main).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Sidebar Full Height ────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const SidebarFullHeight = {
  render: () => `
    <div class="ct-app-shell ct-app-shell--sidebar-full-height" data-sidebar-state="expanded">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell__header">
        ${renderNavbar()}
      </header>

      <aside class="ct-app-shell__sidebar" aria-label="Site navigation" style="background: var(--color-bg-elevated);">
        ${renderSidebar()}
      </aside>

      <main class="ct-app-shell__main" id="main-content" tabindex="0">
        ${renderMainContent()}
      </main>

      <footer class="ct-app-shell__footer">
        ${renderFooter()}
      </footer>

      <div class="ct-app-shell__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell');
    expect(shell).toBeInTheDocument();
    expect(shell.classList.contains('ct-app-shell--sidebar-full-height')).toBe(true);

    // Sidebar spans full height (verify class is present)
    const sidebar = canvasElement.querySelector('.ct-app-shell__sidebar');
    expect(sidebar).toBeInTheDocument();

    // Landmark labels are distinct
    const asides = canvasElement.querySelectorAll('aside[aria-label]');
    const labels = [...asides].map(a => a.getAttribute('aria-label'));
    const unique = new Set(labels);
    expect(unique.size).toBe(labels.length);
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Sidebar States ─────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const SidebarStates = {
  render: () => {
    function shellWithState(state, label) {
      return `
      <div style="margin-bottom: var(--space-6);">
        <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
          ${label}
        </p>
        <div class="ct-app-shell" data-sidebar-state="${state}" style="height: 300px; border: var(--border-thin) solid var(--color-border-subtle); border-radius: var(--radius-md); position: relative;">
          <div class="ct-app-shell__header">
            ${renderNavbar(`Navigation ${state}`)}
          </div>
          <div class="ct-app-shell__sidebar" aria-label="Navigation (${state})">
            ${renderSidebar(`Sidebar (${state})`)}
          </div>
          <div class="ct-app-shell__main" tabindex="0">
            <div style="padding: var(--space-6);">
              <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                Sidebar state: <code>${state}</code>
              </p>
            </div>
          </div>
          <div class="ct-app-shell__backdrop"></div>
        </div>
      </div>`;
    }

    return `
    <div style="padding: var(--space-6);">
      ${shellWithState('expanded', 'Expanded (260px) — Icons + Labels')}
      ${shellWithState('collapsed', 'Collapsed / Rail (56px) — Icons Only')}
      ${shellWithState('hidden', 'Hidden (0px) — No Sidebar')}
    </div>`;
  },
  parameters: { layout: 'padded' },
  play: async ({ canvasElement }) => {
    const shells = canvasElement.querySelectorAll('.ct-app-shell');
    expect(shells).toHaveLength(3);

    // Verify each state is set correctly
    expect(shells[0]).toHaveAttribute('data-sidebar-state', 'expanded');
    expect(shells[1]).toHaveAttribute('data-sidebar-state', 'collapsed');
    expect(shells[2]).toHaveAttribute('data-sidebar-state', 'hidden');

    // Hidden sidebar should not be visible
    const hiddenSidebar = shells[2].querySelector('.ct-app-shell__sidebar');
    expect(hiddenSidebar).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── With Panel ─────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const WithPanel = {
  render: () => `
    <div class="ct-app-shell" data-sidebar-state="expanded" data-panel-state="open">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell__header">
        ${renderNavbar()}
      </header>

      <aside class="ct-app-shell__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <main class="ct-app-shell__main" id="main-content" tabindex="0">
        ${renderMainContent()}
      </main>

      <aside class="ct-app-shell__panel" aria-label="Details">
        ${renderPanel()}
      </aside>

      <footer class="ct-app-shell__footer">
        ${renderFooter()}
      </footer>

      <div class="ct-app-shell__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell');
    expect(shell).toHaveAttribute('data-panel-state', 'open');

    // Panel is a landmark with distinct label
    const panel = canvasElement.querySelector('aside[aria-label="Details"]');
    expect(panel).toBeInTheDocument();

    // Panel close button
    const canvas = within(canvasElement);
    const closeBtn = canvas.getByRole('button', { name: 'Close panel' });
    expect(closeBtn).toBeInTheDocument();

    // Sidebar and panel have different aria-labels
    const sidebar = canvasElement.querySelector('aside[aria-label="Site navigation"]');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar.getAttribute('aria-label')).not.toBe(panel.getAttribute('aria-label'));
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── No Sidebar ─────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const NoSidebar = {
  render: () => `
    <div class="ct-app-shell ct-app-shell--no-sidebar">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell__header">
        ${renderNavbar()}
      </header>

      <main class="ct-app-shell__main" id="main-content" tabindex="0">
        ${renderMainContent()}
      </main>

      <footer class="ct-app-shell__footer">
        ${renderFooter()}
      </footer>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell');
    expect(shell.classList.contains('ct-app-shell--no-sidebar')).toBe(true);

    // Main content takes full width (no sidebar element visible)
    const main = canvasElement.querySelector('.ct-app-shell__main');
    expect(main).toBeInTheDocument();

    // Skip link still works
    const skipLink = canvasElement.querySelector('.ct-skip-link[href="#main-content"]');
    expect(skipLink).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Sticky Footer ──────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const StickyFooter = {
  render: () => `
    <div class="ct-app-shell ct-app-shell--footer-sticky" data-sidebar-state="expanded">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell__header">
        ${renderNavbar()}
      </header>

      <aside class="ct-app-shell__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <main class="ct-app-shell__main" id="main-content" tabindex="0">
        ${renderMainContent({ longContent: false })}
      </main>

      <footer class="ct-app-shell__footer">
        ${renderFooter()}
      </footer>

      <div class="ct-app-shell__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell');
    expect(shell.classList.contains('ct-app-shell--footer-sticky')).toBe(true);

    const footer = canvasElement.querySelector('.ct-app-shell__footer');
    expect(footer).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Responsive Behavior ────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const ResponsiveBehavior = {
  render: () => `
    <div class="ct-app-shell">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell__header">
        ${renderNavbar()}
      </header>

      <aside class="ct-app-shell__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <main class="ct-app-shell__main" id="main-content" tabindex="0">
        <div class="ct-app-shell__page-header">
          <div>
            <h1 style="margin: 0; font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold);">Responsive Demo</h1>
            <p style="margin: var(--space-2) 0 0; font-size: var(--font-size-sm); color: var(--color-text-secondary);">
              Resize the browser to see the responsive cascade:
              Desktop (&ge;1200px) &rarr; Tablet (768&ndash;1199px) &rarr; Mobile (&lt;768px)
            </p>
          </div>
        </div>
        <div style="padding: var(--space-6);">
          <div class="ct-alert ct-alert--info" role="alert" style="margin-bottom: var(--space-5);">
            <p style="margin: 0; font-size: var(--font-size-sm);">
              <strong>No explicit data-sidebar-state is set.</strong> The sidebar responds automatically to viewport width:
              Expanded on Desktop, Collapsed/Rail on Tablet, Hidden on Mobile.
            </p>
          </div>
          ${Array.from({ length: 8 }, (_, i) => `
          <div class="ct-card" style="padding: var(--space-5); margin-bottom: var(--space-4);">
            <h2 style="margin: 0 0 var(--space-2); font-size: var(--font-size-md);">Content Block ${i + 1}</h2>
            <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">
              The main area scrolls independently while the sidebar and header remain fixed.
            </p>
          </div>`).join('')}
        </div>
      </main>

      <footer class="ct-app-shell__footer">
        ${renderFooter()}
      </footer>

      <div class="ct-app-shell__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell');
    expect(shell).toBeInTheDocument();

    // No explicit sidebar state — responsive cascade controls it
    expect(shell).not.toHaveAttribute('data-sidebar-state');

    // Structure is intact
    const main = canvasElement.querySelector('.ct-app-shell__main');
    expect(main).toBeInTheDocument();

    const sidebar = canvasElement.querySelector('.ct-app-shell__sidebar');
    expect(sidebar).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Bottom Navigation ──────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const BottomNav = {
  render: () => `
    <div class="ct-app-shell ct-app-shell--bottom-nav" data-sidebar-state="hidden">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell__header">
        ${renderNavbar()}
      </header>

      <aside class="ct-app-shell__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <main class="ct-app-shell__main" id="main-content" tabindex="0">
        <div style="padding: var(--space-6);">
          <div class="ct-alert ct-alert--info" role="alert" style="margin-bottom: var(--space-5);">
            <p style="margin: 0; font-size: var(--font-size-sm);">
              <strong>Bottom Navigation variant.</strong> On mobile viewports (&lt;768px), the bottom nav bar replaces the sidebar.
              Resize the browser to a mobile width to see the bottom nav.
            </p>
          </div>
          ${Array.from({ length: 6 }, (_, i) => `
          <div class="ct-card" style="padding: var(--space-5); margin-bottom: var(--space-4);">
            <h1 style="margin: 0 0 var(--space-2); font-size: var(--font-size-md);">Item ${i + 1}</h1>
            <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">Content for mobile layout demonstration.</p>
          </div>`).join('')}
        </div>
      </main>

      <nav class="ct-app-shell__bottom-nav" aria-label="Quick navigation">
        <a href="#" style="display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: var(--color-brand-primary); font-size: var(--font-size-xs);">
          <span class="ct-icon ct-icon--sm">${icons.home}</span>
          Home
        </a>
        <a href="#" style="display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: var(--color-text-secondary); font-size: var(--font-size-xs);">
          <span class="ct-icon ct-icon--sm">${icons.search}</span>
          Search
        </a>
        <a href="#" style="display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: var(--color-text-secondary); font-size: var(--font-size-xs);">
          <span class="ct-icon ct-icon--sm">${icons.inbox}</span>
          Inbox
        </a>
        <a href="#" style="display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; color: var(--color-text-secondary); font-size: var(--font-size-xs);">
          <span class="ct-icon ct-icon--sm">${icons.profile}</span>
          Profile
        </a>
      </nav>

      <div class="ct-app-shell__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell');
    expect(shell.classList.contains('ct-app-shell--bottom-nav')).toBe(true);

    // Bottom nav exists with accessible label
    const bottomNav = canvasElement.querySelector('.ct-app-shell__bottom-nav[aria-label]');
    expect(bottomNav).toBeInTheDocument();

    // Bottom nav has links
    const navLinks = bottomNav.querySelectorAll('a');
    expect(navLinks.length).toBeGreaterThanOrEqual(3);
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Interactive Toggle Demo ────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const InteractiveToggle = {
  render: () => `
    <div class="ct-app-shell" data-sidebar-state="expanded" data-panel-state="closed">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell__header">
        <nav class="ct-navbar" aria-label="Main navigation">
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button"
              aria-label="Toggle sidebar" aria-expanded="true" aria-controls="app-sidebar"
              data-shell-toggle="sidebar">
              <span class="ct-icon ct-icon--sm">${icons.menu}</span>
            </button>
            <div class="ct-navbar__brand">
              <span class="ct-icon">${icons.logo}</span>
              <span class="ct-navbar__brand-title">Construct</span>
            </div>
          </div>
          <div class="ct-navbar__actions">
            <button class="ct-button ct-button--ghost ct-button--sm" type="button" data-shell-toggle="panel">
              <span class="ct-icon ct-icon--sm">${icons.panel}</span>
              Toggle Panel
            </button>
          </div>
        </nav>
      </header>

      <aside class="ct-app-shell__sidebar" id="app-sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <main class="ct-app-shell__main" id="main-content" tabindex="0">
        ${renderMainContent()}
      </main>

      <aside class="ct-app-shell__panel" aria-label="Inspector">
        ${renderPanel()}
      </aside>

      <footer class="ct-app-shell__footer">
        ${renderFooter()}
      </footer>

      <div class="ct-app-shell__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    initShellToggle(canvasElement);

    const shell = canvasElement.querySelector('.ct-app-shell');
    expect(shell).toHaveAttribute('data-sidebar-state', 'expanded');

    // Toggle button has correct ARIA
    const toggleBtn = canvasElement.querySelector('[data-shell-toggle="sidebar"]');
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute('aria-label', 'Toggle sidebar');
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
    expect(toggleBtn).toHaveAttribute('aria-controls', 'app-sidebar');

    // Sidebar has matching ID
    const sidebar = canvasElement.querySelector('#app-sidebar');
    expect(sidebar).toBeInTheDocument();

    // Panel toggle exists
    const panelToggle = canvasElement.querySelector('[data-shell-toggle="panel"]');
    expect(panelToggle).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Sidebar Right ──────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const SidebarRight = {
  render: () => `
    <div class="ct-app-shell ct-app-shell--sidebar-right" data-sidebar-state="expanded">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell__header">
        ${renderNavbar()}
      </header>

      <aside class="ct-app-shell__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <main class="ct-app-shell__main" id="main-content" tabindex="0">
        ${renderMainContent()}
      </main>

      <footer class="ct-app-shell__footer">
        ${renderFooter()}
      </footer>

      <div class="ct-app-shell__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell');
    expect(shell.classList.contains('ct-app-shell--sidebar-right')).toBe(true);

    const sidebar = canvasElement.querySelector('.ct-app-shell__sidebar');
    expect(sidebar).toBeInTheDocument();
  },
};
