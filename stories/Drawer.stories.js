import { expect, within, userEvent, waitFor } from 'storybook/test';

export default {
  title: 'Overlays/Drawer',
  parameters: {
    docs: {
      description: {
        component: 'Slide-in panel overlay for navigation, detail views, settings, and multi-step forms. Uses `role="dialog"` and `aria-modal="true"` with focus trap and Escape to close.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Drawer title' },
    description: { control: 'text', description: 'Drawer body text' },
  },
};

export const Playground = {
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Settings',
    description: 'Manage your account preferences.',
  },
  render: ({ title, description }) => `
  <div class="ct-drawer" data-state="open">
    <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="pg-drawer-title">
      <div class="ct-drawer__header">
        <h2 id="pg-drawer-title">${title}</h2>
        <button class="ct-button ct-button--ghost" aria-label="Close">Close</button>
      </div>
      <div class="ct-drawer__body">
        <p>${description}</p>
      </div>
      <div class="ct-drawer__footer">
        <button class="ct-button ct-button--secondary">Cancel</button>
        <button class="ct-button">Save</button>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(canvas.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  },
};

export const Drawer = {
  parameters: { layout: 'fullscreen' },
  render: () => `
  <div class="ct-drawer" data-state="open">
    <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div class="ct-drawer__header">
        <h2 id="drawer-title">Edit profile</h2>
        <button class="ct-button ct-button--ghost" aria-label="Close">Close</button>
      </div>
      <div class="ct-drawer__body">
        <p>Update your personal information.</p>
        <div class="ct-field">
          <label class="ct-field__label" for="drawer-name">Full name</label>
          <input class="ct-input" id="drawer-name" type="text" placeholder="Jane Doe" />
        </div>
        <div class="ct-field">
          <label class="ct-field__label" for="drawer-email">Email</label>
          <input class="ct-input" id="drawer-email" type="email" placeholder="jane@company.com" />
        </div>
      </div>
      <div class="ct-drawer__footer">
        <button class="ct-button ct-button--secondary">Cancel</button>
        <button class="ct-button">Save changes</button>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog');

    // Dialog semantics
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Title is linked via aria-labelledby
    const titleId = dialog.getAttribute('aria-labelledby');
    const title = canvasElement.querySelector(`#${titleId}`);
    expect(title).toHaveTextContent('Edit profile');
    expect(canvasElement.querySelectorAll(`#${titleId}`)).toHaveLength(1);

    // Close button has accessible name
    const closeBtn = canvas.getByRole('button', { name: 'Close' });
    expect(closeBtn).toBeInTheDocument();
    await userEvent.click(closeBtn);
    expect(closeBtn).toHaveFocus();

    // Form fields have label association and accept input
    const nameInput = canvas.getByLabelText('Full name');
    expect(nameInput).toHaveAttribute('type', 'text');
    await userEvent.type(nameInput, 'Jane Doe');
    expect(nameInput).toHaveValue('Jane Doe');

    const emailInput = canvas.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
    await userEvent.type(emailInput, 'jane@company.com');
    expect(emailInput).toHaveValue('jane@company.com');

    // Action buttons are reachable and focusable
    const cancelBtn = canvas.getByRole('button', { name: 'Cancel' });
    const saveBtn = canvas.getByRole('button', { name: 'Save changes' });

    await userEvent.click(cancelBtn);
    expect(cancelBtn).toHaveFocus();

    await userEvent.click(saveBtn);
    expect(saveBtn).toHaveFocus();

    // Keyboard: Enter activates the focused button
    cancelBtn.focus();
    let cancelClicked = false;
    cancelBtn.addEventListener('click', () => { cancelClicked = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(cancelClicked).toBe(true);
  },
};

export const Sides = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Drawer slides from all 4 sides. Default is right. Use `ct-drawer--left`, `ct-drawer--bottom`, or `ct-drawer--top` modifiers.',
      },
    },
  },
  render: () => `
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 24px;">
    <div style="position: relative; height: 260px; border: 1px dashed var(--color-border-default); border-radius: 8px; overflow: hidden;">
      <div class="ct-drawer" data-state="open" style="position: absolute; z-index: auto; --ct-drawer-size: 200px;">
        <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-label="Right drawer">
          <div class="ct-drawer__header">
            <h3>Right (default)</h3>
          </div>
          <div class="ct-drawer__body" tabindex="0"><p>Slides from the right edge.</p></div>
        </div>
      </div>
    </div>

    <div style="position: relative; height: 260px; border: 1px dashed var(--color-border-default); border-radius: 8px; overflow: hidden;">
      <div class="ct-drawer ct-drawer--left" data-state="open" style="position: absolute; z-index: auto; --ct-drawer-size: 200px;">
        <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-label="Left drawer">
          <div class="ct-drawer__header">
            <h3>Left</h3>
          </div>
          <div class="ct-drawer__body" tabindex="0"><p>Slides from the left edge.</p></div>
        </div>
      </div>
    </div>

    <div style="position: relative; height: 260px; border: 1px dashed var(--color-border-default); border-radius: 8px; overflow: hidden;">
      <div class="ct-drawer ct-drawer--bottom" data-state="open" style="position: absolute; z-index: auto; --ct-drawer-size: 140px;">
        <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-label="Bottom drawer">
          <div class="ct-drawer__header">
            <h3>Bottom</h3>
          </div>
          <div class="ct-drawer__body" tabindex="0"><p>Slides from the bottom edge.</p></div>
        </div>
      </div>
    </div>

    <div style="position: relative; height: 260px; border: 1px dashed var(--color-border-default); border-radius: 8px; overflow: hidden;">
      <div class="ct-drawer ct-drawer--top" data-state="open" style="position: absolute; z-index: auto; --ct-drawer-size: 140px;">
        <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-label="Top drawer">
          <div class="ct-drawer__header">
            <h3>Top</h3>
          </div>
          <div class="ct-drawer__body" tabindex="0"><p>Slides from the top edge.</p></div>
        </div>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const drawers = canvasElement.querySelectorAll('.ct-drawer');
    const panels = canvasElement.querySelectorAll('.ct-drawer__panel');

    // All 4 drawers present and open
    expect(drawers).toHaveLength(4);
    for (const drawer of drawers) {
      expect(drawer).toHaveAttribute('data-state', 'open');
    }

    // All panels have correct dialog role and labelling
    for (const panel of panels) {
      expect(panel).toHaveAttribute('role', 'dialog');
      expect(panel).toHaveAttribute('aria-modal', 'true');
      expect(
        panel.getAttribute('aria-label') || panel.getAttribute('aria-labelledby')
      ).toBeTruthy();
    }

    // Verify side modifiers
    expect(drawers[0]).not.toHaveClass('ct-drawer--left');
    expect(drawers[1]).toHaveClass('ct-drawer--left');
    expect(drawers[2]).toHaveClass('ct-drawer--bottom');
    expect(drawers[3]).toHaveClass('ct-drawer--top');

    // All panels are visible when open
    for (const panel of panels) {
      expect(getComputedStyle(panel).visibility).toBe('visible');
    }
  },
};

export const Sizes = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Size variants: `ct-drawer--sm` (320px), default md (400px), `ct-drawer--lg` (560px), and `ct-drawer--full` (100%).',
      },
    },
  },
  render: () => `
  <div style="display: grid; gap: 16px; padding: 24px;">
    <div style="position: relative; height: 140px; border: 1px dashed var(--color-border-default); border-radius: 8px; overflow: hidden;">
      <div class="ct-drawer ct-drawer--sm" data-state="open" style="position: absolute; z-index: auto;">
        <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-label="Small drawer">
          <div class="ct-drawer__header"><h3>Small (320px)</h3></div>
          <div class="ct-drawer__body" tabindex="0"><p>ct-drawer--sm</p></div>
        </div>
      </div>
    </div>

    <div style="position: relative; height: 140px; border: 1px dashed var(--color-border-default); border-radius: 8px; overflow: hidden;">
      <div class="ct-drawer" data-state="open" style="position: absolute; z-index: auto;">
        <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-label="Medium drawer">
          <div class="ct-drawer__header"><h3>Medium (400px, default)</h3></div>
          <div class="ct-drawer__body" tabindex="0"><p>No size modifier</p></div>
        </div>
      </div>
    </div>

    <div style="position: relative; height: 140px; border: 1px dashed var(--color-border-default); border-radius: 8px; overflow: hidden;">
      <div class="ct-drawer ct-drawer--lg" data-state="open" style="position: absolute; z-index: auto;">
        <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-label="Large drawer">
          <div class="ct-drawer__header"><h3>Large (560px)</h3></div>
          <div class="ct-drawer__body" tabindex="0"><p>ct-drawer--lg</p></div>
        </div>
      </div>
    </div>

    <div style="position: relative; height: 140px; border: 1px dashed var(--color-border-default); border-radius: 8px; overflow: hidden;">
      <div class="ct-drawer ct-drawer--full" data-state="open" style="position: absolute; z-index: auto;">
        <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-label="Full drawer">
          <div class="ct-drawer__header"><h3>Full width</h3></div>
          <div class="ct-drawer__body" tabindex="0"><p>ct-drawer--full</p></div>
        </div>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const panels = canvasElement.querySelectorAll('.ct-drawer__panel');

    // All panels visible
    for (const panel of panels) {
      expect(getComputedStyle(panel).visibility).toBe('visible');
    }

    // Size classes are correct
    const drawers = canvasElement.querySelectorAll('.ct-drawer');
    expect(drawers[0]).toHaveClass('ct-drawer--sm');
    expect(drawers[1]).not.toHaveClass('ct-drawer--sm');
    expect(drawers[1]).not.toHaveClass('ct-drawer--lg');
    expect(drawers[2]).toHaveClass('ct-drawer--lg');
    expect(drawers[3]).toHaveClass('ct-drawer--full');

    // Full variant has no border-radius
    expect(getComputedStyle(panels[3]).borderRadius).toBe('0px');
  },
};

export const NavigationDrawer = {
  parameters: { layout: 'fullscreen' },
  render: () => `
  <div class="ct-drawer ct-drawer--left" data-state="open">
    <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="nav-drawer-title">
      <div class="ct-drawer__header">
        <h2 id="nav-drawer-title">Navigation</h2>
        <button class="ct-button ct-button--ghost" aria-label="Close menu">Close</button>
      </div>
      <div class="ct-drawer__body" style="padding: 0;">
        <nav aria-label="Main navigation">
          <ul class="ct-nav-list" style="padding: var(--space-4);">
            <li><a class="ct-nav-item ct-nav-item--active" href="#" aria-current="page">
              <span class="ct-nav-item__label">Dashboard</span>
            </a></li>
            <li><a class="ct-nav-item" href="#">
              <span class="ct-nav-item__label">Projects</span>
              <span class="ct-nav-item__badge">12</span>
            </a></li>
            <li><a class="ct-nav-item" href="#">
              <span class="ct-nav-item__label">Team</span>
            </a></li>
            <li><a class="ct-nav-item" href="#">
              <span class="ct-nav-item__label">Settings</span>
            </a></li>
          </ul>
        </nav>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog');

    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Title linked
    const titleId = dialog.getAttribute('aria-labelledby');
    expect(canvasElement.querySelector(`#${titleId}`)).toHaveTextContent('Navigation');

    // Navigation landmark present
    const nav = canvasElement.querySelector('nav');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');

    // Active item marked with aria-current
    const activeLink = canvasElement.querySelector('[aria-current="page"]');
    expect(activeLink).toHaveTextContent('Dashboard');

    // Non-active items do NOT have aria-current
    const allLinks = canvasElement.querySelectorAll('.ct-nav-item');
    for (const link of allLinks) {
      if (link !== activeLink) {
        expect(link).not.toHaveAttribute('aria-current');
      }
    }

    // Close button has accessible name
    const closeBtn = canvas.getByRole('button', { name: 'Close menu' });
    expect(closeBtn).toBeInTheDocument();

    // All nav links are focusable
    for (const link of allLinks) {
      link.focus();
      expect(link).toHaveFocus();
    }
  },
};

export const BottomSheet = {
  parameters: { layout: 'fullscreen' },
  render: () => `
  <div class="ct-drawer ct-drawer--bottom ct-drawer--sm" data-state="open">
    <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div class="ct-drawer__header">
        <h2 id="sheet-title">Share document</h2>
        <button class="ct-button ct-button--ghost" aria-label="Close">Close</button>
      </div>
      <div class="ct-drawer__body">
        <div class="ct-field">
          <label class="ct-field__label" for="share-email">Invite by email</label>
          <input class="ct-input" id="share-email" type="email" placeholder="colleague@company.com" />
        </div>
        <div class="ct-field__row">
          <button class="ct-button ct-button--secondary ct-button--sm">Copy link</button>
          <button class="ct-button ct-button--secondary ct-button--sm">Share to Slack</button>
        </div>
      </div>
      <div class="ct-drawer__footer">
        <button class="ct-button ct-button--secondary">Cancel</button>
        <button class="ct-button">Send invite</button>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog');
    const drawer = canvasElement.querySelector('.ct-drawer');

    // Bottom sheet semantics
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(drawer).toHaveClass('ct-drawer--bottom');

    // Title linked
    const titleId = dialog.getAttribute('aria-labelledby');
    expect(canvasElement.querySelector(`#${titleId}`)).toHaveTextContent('Share document');

    // Form field works
    const emailInput = canvas.getByLabelText('Invite by email');
    await userEvent.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');

    // Action buttons are reachable
    const sendBtn = canvas.getByRole('button', { name: 'Send invite' });
    await userEvent.click(sendBtn);
    expect(sendBtn).toHaveFocus();
  },
};

export const FocusTrap = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Focus trap keeps Tab/Shift+Tab cycling within the drawer. Escape closes the drawer.',
      },
    },
  },
  render: () => `
  <div class="ct-drawer" data-state="open" id="ft-drawer">
    <div class="ct-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="ft-title">
      <div class="ct-drawer__header">
        <h2 id="ft-title">Focus trap demo</h2>
        <button class="ct-button ct-button--ghost" aria-label="Close" data-close>Close</button>
      </div>
      <div class="ct-drawer__body">
        <div class="ct-field">
          <label class="ct-field__label" for="ft-input">Name</label>
          <input class="ct-input" id="ft-input" type="text" />
        </div>
      </div>
      <div class="ct-drawer__footer">
        <button class="ct-button ct-button--secondary" data-close>Cancel</button>
        <button class="ct-button">Confirm</button>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const drawer = canvasElement.querySelector('#ft-drawer');
    const panel = canvasElement.querySelector('.ct-drawer__panel');

    // Collect focusable elements inside the panel
    const focusableSelector =
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
    const focusableEls = [...panel.querySelectorAll(focusableSelector)];
    const firstFocusable = focusableEls[0];
    const lastFocusable = focusableEls[focusableEls.length - 1];

    // Wire up focus trap and Escape handler
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        drawer.dataset.state = 'closed';
        return;
      }
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });

    // Wire up close buttons
    panel.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        drawer.dataset.state = 'closed';
      });
    });

    // Initial focus on first focusable element
    firstFocusable.focus();
    expect(firstFocusable).toHaveFocus();

    // Tab forward through all elements
    for (let i = 1; i < focusableEls.length; i++) {
      await userEvent.tab();
      expect(focusableEls[i]).toHaveFocus();
    }

    // Tab from last wraps to first
    await userEvent.tab();
    expect(firstFocusable).toHaveFocus();

    // Shift+Tab from first wraps to last
    await userEvent.tab({ shift: true });
    expect(lastFocusable).toHaveFocus();

    // Escape closes the drawer
    await userEvent.keyboard('{Escape}');
    expect(drawer).toHaveAttribute('data-state', 'closed');

    // Panel becomes hidden after close
    await waitFor(() => {
      expect(getComputedStyle(panel).visibility).toBe('hidden');
    });
  },
};
