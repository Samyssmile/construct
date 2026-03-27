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
  analytics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
};


/* ── Helper: Sidebar (V2 — brand at top, nav, user at bottom) ── */

function renderSidebar(label = 'Sidebar') {
  return `
    <nav class="ct-sidebar" aria-label="${label}">
      <div class="ct-sidebar__header">
        <span class="ct-icon" style="color: var(--color-brand-primary);">${icons.logo}</span>
        <strong>Construct</strong>
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
            <span class="ct-nav-item__icon">${icons.analytics}</span>
            <span class="ct-nav-item__label">Analytics</span>
          </a></li>
          <li><a class="ct-nav-item" href="#">
            <span class="ct-nav-item__icon">${icons.docs}</span>
            <span class="ct-nav-item__label">Documents</span>
          </a></li>
          <li><a class="ct-nav-item" href="#">
            <span class="ct-nav-item__icon">${icons.users}</span>
            <span class="ct-nav-item__label">Team</span>
            <span class="ct-nav-item__badge">3</span>
          </a></li>
          <li><a class="ct-nav-item" href="#">
            <span class="ct-nav-item__icon">${icons.settings}</span>
            <span class="ct-nav-item__label">Settings</span>
          </a></li>
        </ul>
      </div>
    </nav>`;
}


/* ── Helper: Navbar (for --with-header variant) ── */

function renderNavbar(label = 'Main navigation') {
  return `
    <nav class="ct-navbar" aria-label="${label}">
      <div class="ct-navbar__brand">
        <span class="ct-icon" style="color: var(--color-brand-primary);">${icons.logo}</span>
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


/* ── Helper: Toolbar (inside main area) ── */

function renderToolbar() {
  return `
    <div class="ct-app-shell-v2__toolbar ct-app-shell-v2__toolbar--sticky">
      <div style="display: flex; align-items: center; gap: var(--space-3);">
        <nav aria-label="Breadcrumb">
          <ol class="ct-breadcrumbs">
            <li class="ct-breadcrumbs__item"><a href="#">Home</a></li>
            <li class="ct-breadcrumbs__item" aria-current="page">Dashboard</li>
          </ol>
        </nav>
      </div>
      <div style="display: flex; gap: var(--space-3);">
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Search">
          <span class="ct-icon ct-icon--sm">${icons.search}</span>
        </button>
        <button class="ct-button ct-button--secondary ct-button--sm" type="button">Export</button>
        <button class="ct-button ct-button--primary ct-button--sm" type="button">Create New</button>
      </div>
    </div>`;
}


/* ── Helper: Main Content ── */

function renderMainContent(options = {}) {
  const { withToolbar = true, cardCount = 12 } = options;

  const toolbar = withToolbar ? renderToolbar() : '';

  const cards = Array.from({ length: cardCount }, (_, i) => `
    <div class="ct-card" style="padding: var(--space-5);">
      <h2 style="margin: 0 0 var(--space-2); font-size: var(--font-size-md);">Card ${i + 1}</h2>
      <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">
        Sample content demonstrating independent scrolling within the main area.
      </p>
    </div>`).join('');

  return `
    ${toolbar}
    <div style="padding: var(--space-6); display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-5);">
      ${cards}
    </div>`;
}


/* ── Helper: Panel ── */

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
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-1);">Assigned to</div>
          <div style="font-size: var(--font-size-sm);">Jane Cooper</div>
        </div>
        <div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-1);">Description</div>
          <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
            Contextual inspector panel showing detail-on-demand without losing the list context.
          </div>
        </div>
      </div>
    </div>`;
}


/* ── Helper: Footer ── */

function renderFooter() {
  return `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-6); font-size: var(--font-size-xs); color: var(--color-text-muted);">
      <span>Construct v1.1.2</span>
      <span>Floating Canvas Shell</span>
    </div>`;
}


/* ── Toggle Helper ── */

function initV2Toggle(root) {
  const sidebarToggle = root.querySelector('[data-v2-toggle="sidebar"]');
  const panelToggle = root.querySelector('[data-v2-toggle="panel"]');
  const shell = root.querySelector('.ct-app-shell-v2');
  const backdrop = root.querySelector('.ct-app-shell-v2__backdrop');

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
  title: 'Layout/App Shell V2',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Floating Canvas shell — a radically different layout from App Shell V1. ' +
          'All chrome floats as elevated surfaces on a tinted canvas, separated by space and shadow. ' +
          'Uses a 2-column grid (sidebar + body) with the panel inside the body via flexbox. ' +
          'Supports branded (dark) sidebar, glass effect, and optional floating header.',
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
    variant: {
      control: 'select',
      options: ['default', 'branded', 'with-header', 'glass'],
      description: 'Shell visual variant',
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
    variant: 'default',
  },
  render: ({ sidebarState, panelState, variant }) => {
    const classes = ['ct-app-shell-v2'];
    if (variant === 'branded') classes.push('ct-app-shell-v2--sidebar-branded');
    if (variant === 'with-header') classes.push('ct-app-shell-v2--with-header');
    if (variant === 'glass') classes.push('ct-app-shell-v2--glass');

    const header = variant === 'with-header' ? `
      <header class="ct-app-shell-v2__header">
        ${renderNavbar()}
      </header>` : '';

    return `
    <div class="${classes.join(' ')}" data-sidebar-state="${sidebarState}" data-panel-state="${panelState}">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      ${header}

      <aside class="ct-app-shell-v2__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <div class="ct-app-shell-v2__body">
        <main class="ct-app-shell-v2__main" id="main-content" tabindex="0">
          ${renderMainContent()}
        </main>

        <aside class="ct-app-shell-v2__panel" aria-label="Details">
          ${renderPanel()}
        </aside>
      </div>

      <div class="ct-app-shell-v2__backdrop"></div>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell-v2');
    expect(shell).toBeInTheDocument();
    expect(shell).toHaveAttribute('data-sidebar-state');
    expect(shell).toHaveAttribute('data-panel-state');

    const sidebar = canvasElement.querySelector('aside[aria-label="Site navigation"]');
    expect(sidebar).toBeInTheDocument();

    const main = canvasElement.querySelector('main#main-content');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('tabindex', '0');

    const skipLink = canvasElement.querySelector('.ct-skip-link[href="#main-content"]');
    expect(skipLink).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Default: Floating Canvas ──────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const FloatingCanvas = {
  render: () => `
    <div class="ct-app-shell-v2" data-sidebar-state="expanded">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <aside class="ct-app-shell-v2__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <div class="ct-app-shell-v2__body">
        <main class="ct-app-shell-v2__main" id="main-content" tabindex="0">
          ${renderMainContent()}
        </main>
      </div>

      <div class="ct-app-shell-v2__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell-v2');
    expect(shell).toBeInTheDocument();
    expect(shell).toHaveAttribute('data-sidebar-state', 'expanded');

    const sidebar = canvasElement.querySelector('.ct-app-shell-v2__sidebar');
    expect(sidebar).toBeInTheDocument();

    const body = canvasElement.querySelector('.ct-app-shell-v2__body');
    expect(body).toBeInTheDocument();

    const navItems = canvasElement.querySelectorAll('.ct-nav-item');
    expect(navItems.length).toBeGreaterThanOrEqual(4);

    const activeItem = canvasElement.querySelector('[aria-current="page"]');
    expect(activeItem).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Sidebar Branded (Dark Sidebar) ────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const SidebarBranded = {
  render: () => `
    <div class="ct-app-shell-v2 ct-app-shell-v2--sidebar-branded" data-sidebar-state="expanded">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <aside class="ct-app-shell-v2__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <div class="ct-app-shell-v2__body">
        <main class="ct-app-shell-v2__main" id="main-content" tabindex="0">
          ${renderMainContent()}
        </main>
      </div>

      <div class="ct-app-shell-v2__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell-v2');
    expect(shell.classList.contains('ct-app-shell-v2--sidebar-branded')).toBe(true);

    const sidebar = canvasElement.querySelector('.ct-app-shell-v2__sidebar');
    expect(sidebar).toBeInTheDocument();
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
        <div class="ct-app-shell-v2" data-sidebar-state="${state}" style="height: 320px; border-radius: var(--radius-lg); position: relative;">
          <div class="ct-app-shell-v2__sidebar" aria-label="Navigation (${state})">
            ${renderSidebar(`Sidebar (${state})`)}
          </div>
          <div class="ct-app-shell-v2__body">
            <div class="ct-app-shell-v2__main" tabindex="0">
              <div style="padding: var(--space-6);">
                <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                  Sidebar state: <code style="background: var(--color-bg-muted); padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm);">${state}</code>
                </p>
              </div>
            </div>
          </div>
          <div class="ct-app-shell-v2__backdrop"></div>
        </div>
      </div>`;
    }

    return `
    <div style="padding: var(--space-6);">
      ${shellWithState('expanded', 'Expanded (260px) \u2014 Floating sidebar with icons + labels')}
      ${shellWithState('collapsed', 'Collapsed / Rail (64px) \u2014 Floating dock with icons only')}
      ${shellWithState('hidden', 'Hidden (0px) \u2014 Body takes full width')}
    </div>`;
  },
  parameters: { layout: 'padded' },
  play: async ({ canvasElement }) => {
    const shells = canvasElement.querySelectorAll('.ct-app-shell-v2');
    expect(shells).toHaveLength(3);

    expect(shells[0]).toHaveAttribute('data-sidebar-state', 'expanded');
    expect(shells[1]).toHaveAttribute('data-sidebar-state', 'collapsed');
    expect(shells[2]).toHaveAttribute('data-sidebar-state', 'hidden');
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── With Panel ─────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const WithPanel = {
  render: () => `
    <div class="ct-app-shell-v2" data-sidebar-state="expanded" data-panel-state="open">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <aside class="ct-app-shell-v2__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <div class="ct-app-shell-v2__body">
        <main class="ct-app-shell-v2__main" id="main-content" tabindex="0">
          ${renderMainContent()}
        </main>

        <aside class="ct-app-shell-v2__panel" aria-label="Details">
          ${renderPanel()}
        </aside>
      </div>

      <div class="ct-app-shell-v2__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell-v2');
    expect(shell).toHaveAttribute('data-panel-state', 'open');

    const panel = canvasElement.querySelector('aside[aria-label="Details"]');
    expect(panel).toBeInTheDocument();

    const canvas = within(canvasElement);
    const closeBtn = canvas.getByRole('button', { name: 'Close panel' });
    expect(closeBtn).toBeInTheDocument();

    // Panel and sidebar have distinct labels
    const sidebar = canvasElement.querySelector('aside[aria-label="Site navigation"]');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar.getAttribute('aria-label')).not.toBe(panel.getAttribute('aria-label'));
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── With Floating Header ───────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const WithFloatingHeader = {
  render: () => `
    <div class="ct-app-shell-v2 ct-app-shell-v2--with-header" data-sidebar-state="expanded">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell-v2__header">
        ${renderNavbar()}
      </header>

      <aside class="ct-app-shell-v2__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <div class="ct-app-shell-v2__body">
        <main class="ct-app-shell-v2__main" id="main-content" tabindex="0">
          ${renderMainContent({ withToolbar: false })}
        </main>
      </div>

      <div class="ct-app-shell-v2__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell-v2');
    expect(shell.classList.contains('ct-app-shell-v2--with-header')).toBe(true);

    const header = canvasElement.querySelector('.ct-app-shell-v2__header');
    expect(header).toBeInTheDocument();

    const navbar = canvasElement.querySelector('.ct-app-shell-v2__header .ct-navbar');
    expect(navbar).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Sidebar Full Height + Header ───────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const SidebarFullHeight = {
  render: () => `
    <div class="ct-app-shell-v2 ct-app-shell-v2--with-header ct-app-shell-v2--sidebar-full-height ct-app-shell-v2--sidebar-branded" data-sidebar-state="expanded">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell-v2__header">
        ${renderNavbar()}
      </header>

      <aside class="ct-app-shell-v2__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <div class="ct-app-shell-v2__body">
        <main class="ct-app-shell-v2__main" id="main-content" tabindex="0">
          ${renderMainContent({ withToolbar: false })}
        </main>
      </div>

      <div class="ct-app-shell-v2__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell-v2');
    expect(shell.classList.contains('ct-app-shell-v2--sidebar-full-height')).toBe(true);
    expect(shell.classList.contains('ct-app-shell-v2--with-header')).toBe(true);
    expect(shell.classList.contains('ct-app-shell-v2--sidebar-branded')).toBe(true);

    const asides = canvasElement.querySelectorAll('aside[aria-label]');
    const labels = [...asides].map(a => a.getAttribute('aria-label'));
    const unique = new Set(labels);
    expect(unique.size).toBe(labels.length);
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Glass Effect ───────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const GlassEffect = {
  render: () => `
    <div class="ct-app-shell-v2 ct-app-shell-v2--glass" data-sidebar-state="expanded"
         style="--ct-v2-canvas-bg: linear-gradient(135deg, var(--color-ocean-100), var(--color-teal-50), var(--color-ocean-50));">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <aside class="ct-app-shell-v2__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <div class="ct-app-shell-v2__body">
        <main class="ct-app-shell-v2__main" id="main-content" tabindex="0">
          ${renderMainContent()}
        </main>
      </div>

      <div class="ct-app-shell-v2__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell-v2');
    expect(shell.classList.contains('ct-app-shell-v2--glass')).toBe(true);
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Sidebar Right ──────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const SidebarRight = {
  render: () => `
    <div class="ct-app-shell-v2 ct-app-shell-v2--sidebar-right" data-sidebar-state="expanded">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <aside class="ct-app-shell-v2__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <div class="ct-app-shell-v2__body">
        <main class="ct-app-shell-v2__main" id="main-content" tabindex="0">
          ${renderMainContent()}
        </main>
      </div>

      <div class="ct-app-shell-v2__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell-v2');
    expect(shell.classList.contains('ct-app-shell-v2--sidebar-right')).toBe(true);

    const sidebar = canvasElement.querySelector('.ct-app-shell-v2__sidebar');
    expect(sidebar).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── No Sidebar ─────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const NoSidebar = {
  render: () => `
    <div class="ct-app-shell-v2 ct-app-shell-v2--no-sidebar">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <div class="ct-app-shell-v2__body">
        <main class="ct-app-shell-v2__main" id="main-content" tabindex="0">
          ${renderMainContent()}
        </main>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell-v2');
    expect(shell.classList.contains('ct-app-shell-v2--no-sidebar')).toBe(true);

    const main = canvasElement.querySelector('.ct-app-shell-v2__main');
    expect(main).toBeInTheDocument();

    const skipLink = canvasElement.querySelector('.ct-skip-link[href="#main-content"]');
    expect(skipLink).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Interactive Toggle Demo ──────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const InteractiveToggle = {
  render: () => `
    <div class="ct-app-shell-v2 ct-app-shell-v2--sidebar-branded" data-sidebar-state="expanded" data-panel-state="closed">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <aside class="ct-app-shell-v2__sidebar" id="v2-sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <div class="ct-app-shell-v2__body">
        <main class="ct-app-shell-v2__main" id="main-content" tabindex="0">
          <div class="ct-app-shell-v2__toolbar ct-app-shell-v2__toolbar--sticky">
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button"
                aria-label="Toggle sidebar" aria-expanded="true" aria-controls="v2-sidebar"
                data-v2-toggle="sidebar">
                <span class="ct-icon ct-icon--sm">${icons.menu}</span>
              </button>
              <nav aria-label="Breadcrumb">
                <ol class="ct-breadcrumbs">
                  <li class="ct-breadcrumbs__item"><a href="#">Home</a></li>
                  <li class="ct-breadcrumbs__item" aria-current="page">Dashboard</li>
                </ol>
              </nav>
            </div>
            <div style="display: flex; gap: var(--space-3);">
              <button class="ct-button ct-button--ghost ct-button--sm" type="button" data-v2-toggle="panel">
                <span class="ct-icon ct-icon--sm">${icons.panel}</span>
                Toggle Panel
              </button>
              <button class="ct-button ct-button--primary ct-button--sm" type="button">Create New</button>
            </div>
          </div>

          <div style="padding: var(--space-6); display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-5);">
            ${Array.from({ length: 12 }, (_, i) => `
            <div class="ct-card" style="padding: var(--space-5);">
              <h2 style="margin: 0 0 var(--space-2); font-size: var(--font-size-md);">Card ${i + 1}</h2>
              <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                Click the sidebar toggle to switch between expanded and collapsed (rail) state.
              </p>
            </div>`).join('')}
          </div>
        </main>

        <aside class="ct-app-shell-v2__panel" aria-label="Inspector">
          ${renderPanel()}
        </aside>
      </div>

      <div class="ct-app-shell-v2__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    initV2Toggle(canvasElement);

    const shell = canvasElement.querySelector('.ct-app-shell-v2');
    expect(shell).toHaveAttribute('data-sidebar-state', 'expanded');

    const toggleBtn = canvasElement.querySelector('[data-v2-toggle="sidebar"]');
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute('aria-label', 'Toggle sidebar');
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
    expect(toggleBtn).toHaveAttribute('aria-controls', 'v2-sidebar');

    const sidebar = canvasElement.querySelector('#v2-sidebar');
    expect(sidebar).toBeInTheDocument();

    const panelToggle = canvasElement.querySelector('[data-v2-toggle="panel"]');
    expect(panelToggle).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── Branded + Panel + Full Height (Full Feature Showcase) ─── */
/* ═══════════════════════════════════════════════════════════════ */

export const FullFeatureShowcase = {
  render: () => `
    <div class="ct-app-shell-v2 ct-app-shell-v2--with-header ct-app-shell-v2--sidebar-full-height ct-app-shell-v2--sidebar-branded"
         data-sidebar-state="expanded" data-panel-state="open">
      <a class="ct-skip-link" href="#main-content">Skip to content</a>

      <header class="ct-app-shell-v2__header">
        ${renderNavbar()}
      </header>

      <aside class="ct-app-shell-v2__sidebar" aria-label="Site navigation">
        ${renderSidebar()}
      </aside>

      <div class="ct-app-shell-v2__body">
        <main class="ct-app-shell-v2__main" id="main-content" tabindex="0">
          ${renderMainContent({ withToolbar: false })}

          <footer class="ct-app-shell-v2__footer">
            ${renderFooter()}
          </footer>
        </main>

        <aside class="ct-app-shell-v2__panel" aria-label="Inspector">
          ${renderPanel()}
        </aside>
      </div>

      <div class="ct-app-shell-v2__backdrop"></div>
    </div>`,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ct-app-shell-v2');
    expect(shell).toHaveAttribute('data-sidebar-state', 'expanded');
    expect(shell).toHaveAttribute('data-panel-state', 'open');
    expect(shell.classList.contains('ct-app-shell-v2--with-header')).toBe(true);
    expect(shell.classList.contains('ct-app-shell-v2--sidebar-full-height')).toBe(true);
    expect(shell.classList.contains('ct-app-shell-v2--sidebar-branded')).toBe(true);

    const header = canvasElement.querySelector('.ct-app-shell-v2__header');
    expect(header).toBeInTheDocument();

    const panel = canvasElement.querySelector('.ct-app-shell-v2__panel');
    expect(panel).toBeInTheDocument();

    const footer = canvasElement.querySelector('.ct-app-shell-v2__footer');
    expect(footer).toBeInTheDocument();
  },
};


/* ═══════════════════════════════════════════════════════════════ */
/* ── V1 vs V2 Side by Side ──────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

export const V1vsV2Comparison = {
  render: () => `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); padding: var(--space-6); height: 100vh; background: var(--color-bg-muted);">
      <div>
        <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
          V1 \u2014 Edge-to-Edge Grid
        </p>
        <div class="ct-app-shell" data-sidebar-state="expanded" style="height: calc(100% - 32px); border: var(--border-thin) solid var(--color-border-subtle); border-radius: var(--radius-md);">
          <div class="ct-app-shell__header">
            <nav class="ct-navbar" aria-label="V1 Navigation">
              <div class="ct-navbar__brand">
                <span class="ct-icon" style="color: var(--color-brand-primary);">${icons.logo}</span>
                <span class="ct-navbar__brand-title">V1</span>
              </div>
            </nav>
          </div>
          <div class="ct-app-shell__sidebar" aria-label="V1 sidebar">
            ${renderSidebar('V1 Nav')}
          </div>
          <div class="ct-app-shell__main" tabindex="0">
            <div style="padding: var(--space-5); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
              Borders separate regions. Content goes edge-to-edge.
            </div>
          </div>
          <div class="ct-app-shell__backdrop"></div>
        </div>
      </div>

      <div>
        <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
          V2 \u2014 Floating Canvas
        </p>
        <div class="ct-app-shell-v2 ct-app-shell-v2--sidebar-branded" data-sidebar-state="expanded" style="height: calc(100% - 32px);">
          <div class="ct-app-shell-v2__sidebar" aria-label="V2 sidebar">
            ${renderSidebar('V2 Nav')}
          </div>
          <div class="ct-app-shell-v2__body">
            <div class="ct-app-shell-v2__main" tabindex="0">
              <div style="padding: var(--space-5); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                Floating surfaces on canvas. Space separates regions. Rounded corners + shadow.
              </div>
            </div>
          </div>
          <div class="ct-app-shell-v2__backdrop"></div>
        </div>
      </div>
    </div>`,
  parameters: { layout: 'fullscreen' },
  play: async ({ canvasElement }) => {
    const v1 = canvasElement.querySelector('.ct-app-shell');
    const v2 = canvasElement.querySelector('.ct-app-shell-v2');
    expect(v1).toBeInTheDocument();
    expect(v2).toBeInTheDocument();
  },
};
