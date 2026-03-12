import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Components/Sidebar',
};

export const SideMode = {
  render: () => `
  <div class="ct-sidebar-layout" style="height: 400px; border: var(--border-thin) solid var(--color-border-subtle); border-radius: var(--radius-md); overflow: hidden;">
    <aside class="ct-sidebar ct-sidebar--side" data-state="open" aria-label="Folder navigation">
      <div class="ct-sidebar__header">
        <strong>Folders</strong>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Create folder">
          <span class="ct-icon ct-icon--sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
        </button>
      </div>
      <div class="ct-sidebar__content">
        <ul class="ct-nav-list">
          <li><a class="ct-nav-item ct-nav-item--active" href="#" aria-current="page">
            <span class="ct-nav-item__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span>
            <span class="ct-nav-item__label">Inbox</span>
            <span class="ct-nav-item__badge">12</span>
          </a></li>
          <li><a class="ct-nav-item" href="#">
            <span class="ct-nav-item__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span>
            <span class="ct-nav-item__label">Drafts</span>
            <span class="ct-nav-item__badge">3</span>
          </a></li>
          <li><a class="ct-nav-item" href="#">
            <span class="ct-nav-item__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span>
            <span class="ct-nav-item__label">Archive</span>
          </a></li>
          <li><a class="ct-nav-item" href="#">
            <span class="ct-nav-item__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span>
            <span class="ct-nav-item__label">Shared</span>
            <span class="ct-nav-item__badge">7</span>
          </a></li>
        </ul>
      </div>
    </aside>
    <div class="ct-sidebar-content" style="padding: var(--space-6);">
      <h3 style="margin: 0 0 var(--space-4);">Documents</h3>
      <p style="color: var(--color-text-secondary);">Select a folder to view its contents.</p>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Sidebar is a complementary landmark with accessible label
    const sidebar = canvasElement.querySelector('aside[aria-label]');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveAttribute('aria-label', 'Folder navigation');

    // Sidebar is in open state
    expect(sidebar).toHaveAttribute('data-state', 'open');

    // Navigation list with correct items
    const navItems = canvasElement.querySelectorAll('.ct-nav-item');
    expect(navItems).toHaveLength(4);

    // Active nav item marked with aria-current="page"
    const activeItem = canvasElement.querySelector('.ct-nav-item--active');
    expect(activeItem).toBeInTheDocument();
    expect(activeItem).toHaveAttribute('aria-current', 'page');
    expect(activeItem).toHaveTextContent(/Inbox/);

    // Other nav items must NOT have aria-current
    const inactiveItems = canvasElement.querySelectorAll('.ct-nav-item:not(.ct-nav-item--active)');
    for (const item of inactiveItems) {
      expect(item).not.toHaveAttribute('aria-current');
    }

    // Nav items are links (semantic navigation)
    for (const item of navItems) {
      expect(item.tagName).toBe('A');
      expect(item).toHaveAttribute('href');
    }

    // Badges show counts
    const badges = canvasElement.querySelectorAll('.ct-nav-item__badge');
    expect(badges.length).toBeGreaterThanOrEqual(2);
    expect(badges[0]).toHaveTextContent('12');

    // Header action button has accessible label
    const createBtn = canvas.getByRole('button', { name: 'Create folder' });
    expect(createBtn).toBeInTheDocument();
    await userEvent.click(createBtn);
    expect(createBtn).toHaveFocus();

    // All nav links are focusable
    for (const item of navItems) {
      item.focus();
      expect(item).toHaveFocus();
    }
  },
};

export const OverlayMode = {
  render: () => `
  <div style="position: relative; height: 400px; border: var(--border-thin) solid var(--color-border-subtle); border-radius: var(--radius-md); overflow: hidden;">
    <aside class="ct-sidebar ct-sidebar--over" data-state="open" aria-label="Navigation" style="position: absolute;">
      <div class="ct-sidebar__header">
        <strong>Menu</strong>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Close menu">
          <span class="ct-icon ct-icon--sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
        </button>
      </div>
      <div class="ct-sidebar__content">
        <ul class="ct-nav-list">
          <li><a class="ct-nav-item ct-nav-item--active" href="#" aria-current="page">Dashboard</a></li>
          <li><a class="ct-nav-item" href="#">Documents</a></li>
          <li><a class="ct-nav-item" href="#">Support</a></li>
          <li><a class="ct-nav-item" href="#">Settings</a></li>
        </ul>
      </div>
    </aside>
    <div class="ct-sidebar__backdrop" style="position: absolute;"></div>
    <div style="padding: var(--space-6);">
      <p style="color: var(--color-text-secondary);">Overlay sidebar appears above the content with a backdrop.</p>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Overlay sidebar is a landmark with label
    const sidebar = canvasElement.querySelector('aside[aria-label]');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveAttribute('aria-label', 'Navigation');
    expect(sidebar).toHaveAttribute('data-state', 'open');

    // Close button has accessible label
    const closeBtn = canvas.getByRole('button', { name: 'Close menu' });
    expect(closeBtn).toBeInTheDocument();

    // Active page marked correctly
    const activeLink = canvas.getByRole('link', { name: 'Dashboard' });
    expect(activeLink).toHaveAttribute('aria-current', 'page');

    // Other links must not carry aria-current
    const docsLink = canvas.getByRole('link', { name: 'Documents' });
    expect(docsLink).not.toHaveAttribute('aria-current');
    const supportLink = canvas.getByRole('link', { name: 'Support' });
    expect(supportLink).not.toHaveAttribute('aria-current');
    const settingsLink = canvas.getByRole('link', { name: 'Settings' });
    expect(settingsLink).not.toHaveAttribute('aria-current');

    // All nav items are accessible links
    const allLinks = canvas.getAllByRole('link');
    expect(allLinks).toHaveLength(4);
    for (const link of allLinks) {
      expect(link).toHaveAttribute('href');
    }

    // Backdrop element exists (required for overlay mode)
    const backdrop = canvasElement.querySelector('.ct-sidebar__backdrop');
    expect(backdrop).toBeInTheDocument();

    // Close button is focusable and clickable
    await userEvent.click(closeBtn);
    expect(closeBtn).toHaveFocus();
  },
};
