import { expect, within, userEvent, waitFor } from 'storybook/test';

export default {
  title: 'Overlays/Toast',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Toast notification component for transient status messages. ' +
          'Supports semantic color variants (default, info, success, warning, danger) via `data-variant`, ' +
          'open/closed state via `data-state`, optional action and close buttons, and stacking via `ct-toast-region`. ' +
          'The region uses `aria-live="polite"` (or `"assertive"` for danger) and `role="status"` (or `role="alert"`) ' +
          'so screen readers announce toasts without requiring focus.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'danger'],
      description: 'Semantic color variant',
    },
    title: { control: 'text', description: 'Toast title' },
    description: { control: 'text', description: 'Toast description text' },
    showAction: { control: 'boolean', description: 'Show action button' },
    showClose: { control: 'boolean', description: 'Show close button' },
  },
};

/**
 * Interactive playground with all controls.
 */
export const Playground = {
  args: {
    variant: 'success',
    title: 'Changes saved',
    description: 'Your profile has been updated.',
    showAction: false,
    showClose: true,
  },
  parameters: {
    docs: { story: { inline: true, height: 200 } },
  },
  render: ({ variant, title, description, showAction, showClose }) => {
    const variantAttr = variant !== 'default' ? ` data-variant="${variant}"` : '';
    const actionHtml = showAction
      ? '<button class="ct-button ct-button--ghost ct-button--sm" aria-label="Undo action">Undo</button>'
      : '';
    const closeHtml = showClose
      ? '<button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss notification"><span aria-hidden="true">&times;</span></button>'
      : '';
    return `
    <div style="min-height: 160px; padding: 24px; display: flex; align-items: flex-start;">
      <div class="ct-toast-region" aria-live="polite" role="status">
        <div class="ct-toast"${variantAttr} data-state="open">
          <div class="ct-toast__title">${title}</div>
          <div class="ct-toast__description">${description}</div>
          <div style="display: flex; gap: var(--space-2); align-items: center;">
            ${actionHtml}${closeHtml}
          </div>
        </div>
      </div>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Toast region is a live region
    const region = canvasElement.querySelector('.ct-toast-region');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('role', 'status');

    // Toast is visible
    const toast = canvasElement.querySelector('.ct-toast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveAttribute('data-state', 'open');

    // Title and description are rendered
    expect(canvas.getByText('Changes saved')).toBeInTheDocument();
    expect(canvas.getByText('Your profile has been updated.')).toBeInTheDocument();
  },
};

/**
 * All five semantic variants side by side.
 */
export const Variants = {
  parameters: {
    docs: { story: { inline: true, height: 640 } },
  },
  render: () => `
  <div style="min-height: 600px; padding: 24px;">
    <div class="ct-toast-region" aria-live="polite" role="status" style="position: static; max-width: 420px;">
      <div class="ct-toast" data-state="open">
        <div class="ct-toast__title">Default</div>
        <div class="ct-toast__description">A neutral notification with brand accent.</div>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss notification"><span aria-hidden="true">&times;</span></button>
      </div>

      <div class="ct-toast" data-variant="info" data-state="open">
        <div class="ct-toast__title">Info</div>
        <div class="ct-toast__description">Deployment to staging has started.</div>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss notification"><span aria-hidden="true">&times;</span></button>
      </div>

      <div class="ct-toast" data-variant="success" data-state="open">
        <div class="ct-toast__title">Success</div>
        <div class="ct-toast__description">Your changes have been saved.</div>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss notification"><span aria-hidden="true">&times;</span></button>
      </div>

      <div class="ct-toast" data-variant="warning" data-state="open">
        <div class="ct-toast__title">Warning</div>
        <div class="ct-toast__description">Your session will expire in 5 minutes.</div>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss notification"><span aria-hidden="true">&times;</span></button>
      </div>

      <div class="ct-toast" data-variant="danger" data-state="open">
        <div class="ct-toast__title">Error</div>
        <div class="ct-toast__description">Failed to save changes. Please try again.</div>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss notification"><span aria-hidden="true">&times;</span></button>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const toasts = canvasElement.querySelectorAll('.ct-toast');
    expect(toasts).toHaveLength(5);

    // Default toast has no data-variant
    expect(toasts[0]).not.toHaveAttribute('data-variant');

    // Semantic variants are applied correctly
    expect(toasts[1]).toHaveAttribute('data-variant', 'info');
    expect(toasts[2]).toHaveAttribute('data-variant', 'success');
    expect(toasts[3]).toHaveAttribute('data-variant', 'warning');
    expect(toasts[4]).toHaveAttribute('data-variant', 'danger');

    // All toasts are in open state
    for (const toast of toasts) {
      expect(toast).toHaveAttribute('data-state', 'open');
    }

    // Each toast has title and description
    for (const toast of toasts) {
      const title = toast.querySelector('.ct-toast__title');
      const desc = toast.querySelector('.ct-toast__description');
      expect(title).toBeInTheDocument();
      expect(title.textContent.trim().length).toBeGreaterThan(0);
      expect(desc).toBeInTheDocument();
      expect(desc.textContent.trim().length).toBeGreaterThan(0);
    }

    // All close buttons have accessible labels
    const closeButtons = canvasElement.querySelectorAll('.ct-toast .ct-button');
    for (const btn of closeButtons) {
      expect(btn).toHaveAttribute('aria-label');
    }

    // Close button icons are decorative
    const icons = canvasElement.querySelectorAll('.ct-toast [aria-hidden="true"]');
    expect(icons).toHaveLength(5);
  },
};

/**
 * Toast with an action button (e.g. Undo) alongside a close button.
 */
export const WithAction = {
  parameters: {
    docs: { story: { inline: true, height: 200 } },
  },
  render: () => `
  <div style="min-height: 160px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-toast-region" aria-live="polite" role="status" style="position: static; max-width: 420px;">
      <div class="ct-toast" data-variant="success" data-state="open">
        <div class="ct-toast__title">File deleted</div>
        <div class="ct-toast__description">report-2026.pdf was moved to trash.</div>
        <div style="display: flex; gap: var(--space-2); align-items: center;">
          <button class="ct-button ct-button--ghost ct-button--sm" type="button" aria-label="Undo file deletion">Undo</button>
          <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss notification"><span aria-hidden="true">&times;</span></button>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Action button has a descriptive accessible name
    const undoBtn = canvas.getByRole('button', { name: /Undo file deletion/ });
    expect(undoBtn).toBeInTheDocument();
    const undoLabel = undoBtn.getAttribute('aria-label');
    expect(undoLabel.length).toBeGreaterThan(4);

    // Close button exists alongside action
    const dismissBtn = canvas.getByRole('button', { name: /Dismiss/ });
    expect(dismissBtn).toBeInTheDocument();

    // Both buttons are focusable and clickable
    await userEvent.click(undoBtn);
    expect(undoBtn).toHaveFocus();

    await userEvent.click(dismissBtn);
    expect(dismissBtn).toHaveFocus();

    // Keyboard: Enter activates the action button
    undoBtn.focus();
    let undoClicked = false;
    undoBtn.addEventListener('click', () => { undoClicked = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(undoClicked).toBe(true);

    // Tab order: action → close
    undoBtn.focus();
    await userEvent.tab();
    expect(dismissBtn).toHaveFocus();
  },
};

/**
 * Multiple toasts stacked in a region — newest on top.
 */
export const Stacked = {
  parameters: {
    docs: { story: { inline: true, height: 400 } },
  },
  render: () => `
  <div style="min-height: 360px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-toast-region" aria-live="polite" role="status" style="position: static; max-width: 420px;">
      <div class="ct-toast" data-variant="danger" data-state="open">
        <div class="ct-toast__title">Upload failed</div>
        <div class="ct-toast__description">archive.zip exceeds the 10 MB limit.</div>
        <div style="display: flex; gap: var(--space-2); align-items: center;">
          <button class="ct-button ct-button--ghost ct-button--sm" type="button" aria-label="Retry upload">Retry</button>
          <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss upload error"><span aria-hidden="true">&times;</span></button>
        </div>
      </div>
      <div class="ct-toast" data-variant="success" data-state="open">
        <div class="ct-toast__title">Saved</div>
        <div class="ct-toast__description">Your changes were saved.</div>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss save notification"><span aria-hidden="true">&times;</span></button>
      </div>
      <div class="ct-toast" data-variant="info" data-state="open">
        <div class="ct-toast__title">New version available</div>
        <div class="ct-toast__description">Construct v2.3.0 is ready to install.</div>
        <div style="display: flex; gap: var(--space-2); align-items: center;">
          <button class="ct-button ct-button--ghost ct-button--sm" type="button" aria-label="Update now">Update</button>
          <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss update notification"><span aria-hidden="true">&times;</span></button>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Region contains multiple toasts
    const region = canvasElement.querySelector('.ct-toast-region');
    const toasts = region.querySelectorAll('.ct-toast');
    expect(toasts).toHaveLength(3);

    // All toasts are visible
    for (const toast of toasts) {
      expect(toast).toHaveAttribute('data-state', 'open');
    }

    // Each toast has a unique title
    const titles = [...toasts].map(t => t.querySelector('.ct-toast__title').textContent.trim());
    expect(new Set(titles).size).toBe(3);

    // Each close/dismiss button has a unique accessible label
    const dismissButtons = canvasElement.querySelectorAll('[aria-label*="Dismiss"]');
    expect(dismissButtons.length).toBeGreaterThanOrEqual(3);
    const labels = [...dismissButtons].map(b => b.getAttribute('aria-label'));
    expect(new Set(labels).size).toBe(labels.length);

    // Different variants are stacked
    expect(toasts[0]).toHaveAttribute('data-variant', 'danger');
    expect(toasts[1]).toHaveAttribute('data-variant', 'success');
    expect(toasts[2]).toHaveAttribute('data-variant', 'info');

    // Tab order moves through all interactive elements in stack
    const allButtons = canvas.getAllByRole('button');
    expect(allButtons.length).toBeGreaterThanOrEqual(4);
    allButtons[0].focus();
    expect(allButtons[0]).toHaveFocus();
    await userEvent.tab();
    expect(allButtons[1]).toHaveFocus();
  },
};

/**
 * Danger toast with `role="alert"` and `aria-live="assertive"` for critical errors.
 */
export const DangerAlert = {
  parameters: {
    docs: {
      description: {
        story:
          'Critical errors should use `role="alert"` and `aria-live="assertive"` on the region so screen readers interrupt immediately.',
      },
      story: { inline: true, height: 200 },
    },
  },
  render: () => `
  <div style="min-height: 160px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-toast-region" aria-live="assertive" role="alert" style="position: static; max-width: 420px;">
      <div class="ct-toast" data-variant="danger" data-state="open">
        <div class="ct-toast__title">Connection lost</div>
        <div class="ct-toast__description">Unable to reach the server. Check your network and try again.</div>
        <div style="display: flex; gap: var(--space-2); align-items: center;">
          <button class="ct-button ct-button--ghost ct-button--sm" type="button" aria-label="Retry connection">Retry</button>
          <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss error"><span aria-hidden="true">&times;</span></button>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Critical errors use assertive live region
    const region = canvasElement.querySelector('.ct-toast-region');
    expect(region).toHaveAttribute('aria-live', 'assertive');
    expect(region).toHaveAttribute('role', 'alert');

    // Toast uses danger variant
    const toast = canvasElement.querySelector('.ct-toast');
    expect(toast).toHaveAttribute('data-variant', 'danger');

    // Content is present
    expect(canvas.getByText('Connection lost')).toBeInTheDocument();
    expect(canvas.getByText(/Unable to reach the server/)).toBeInTheDocument();

    // Retry button is accessible
    const retryBtn = canvas.getByRole('button', { name: /Retry connection/ });
    expect(retryBtn).toBeInTheDocument();
    await userEvent.click(retryBtn);
    expect(retryBtn).toHaveFocus();
  },
};

/**
 * Closed state — toast is dismissed and visually hidden.
 */
export const ClosedState = {
  parameters: {
    docs: { story: { inline: true, height: 160 } },
  },
  render: () => `
  <div style="min-height: 120px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-toast-region" aria-live="polite" role="status" style="position: static; max-width: 420px;">
      <div class="ct-toast" data-variant="success" data-state="closed">
        <div class="ct-toast__title">Saved</div>
        <div class="ct-toast__description">Your changes were saved.</div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const toast = canvasElement.querySelector('.ct-toast');

    // Closed toast has data-state="closed"
    expect(toast).toHaveAttribute('data-state', 'closed');

    // Closed toast has opacity 0 (visually hidden via CSS transition)
    const style = getComputedStyle(toast);
    expect(style.opacity).toBe('0');
  },
};

/**
 * Toast without description — title-only pattern for brief confirmations.
 */
export const TitleOnly = {
  parameters: {
    docs: { story: { inline: true, height: 160 } },
  },
  render: () => `
  <div style="min-height: 120px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-toast-region" aria-live="polite" role="status" style="position: static; max-width: 420px;">
      <div class="ct-toast" data-variant="success" data-state="open">
        <div class="ct-toast__title">Copied to clipboard</div>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss notification"><span aria-hidden="true">&times;</span></button>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const toast = canvasElement.querySelector('.ct-toast');

    // Title is present
    const title = toast.querySelector('.ct-toast__title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Copied to clipboard');

    // No description — flexible composition
    const desc = toast.querySelector('.ct-toast__description');
    expect(desc).toBeNull();

    // Close button still present
    const closeBtn = canvasElement.querySelector('[aria-label="Dismiss notification"]');
    expect(closeBtn).toBeInTheDocument();
  },
};

/**
 * Warning toast with a longer description text to test text wrapping behavior.
 */
export const LongContent = {
  parameters: {
    docs: { story: { inline: true, height: 200 } },
  },
  render: () => `
  <div style="min-height: 160px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-toast-region" aria-live="polite" role="status" style="position: static; max-width: 420px;">
      <div class="ct-toast" data-variant="warning" data-state="open">
        <div class="ct-toast__title">Storage quota warning</div>
        <div class="ct-toast__description">You have used 95% of your available storage (9.5 GB of 10 GB). Consider deleting unused files or upgrading your plan to avoid disruptions.</div>
        <div style="display: flex; gap: var(--space-2); align-items: center;">
          <button class="ct-button ct-button--ghost ct-button--sm" type="button" aria-label="Manage storage">Manage</button>
          <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss storage warning"><span aria-hidden="true">&times;</span></button>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Warning variant
    const toast = canvasElement.querySelector('.ct-toast');
    expect(toast).toHaveAttribute('data-variant', 'warning');

    // Long description wraps within the toast
    const desc = toast.querySelector('.ct-toast__description');
    expect(desc.textContent.length).toBeGreaterThan(100);

    // Action button is still accessible
    const manageBtn = canvas.getByRole('button', { name: /Manage storage/ });
    expect(manageBtn).toBeInTheDocument();
    await userEvent.click(manageBtn);
    expect(manageBtn).toHaveFocus();
  },
};

/**
 * Keyboard dismiss pattern — verifies close button interaction.
 */
export const KeyboardDismiss = {
  parameters: {
    docs: {
      description: {
        story: 'Verifies that toasts can be dismissed via keyboard (Tab to close button, then Enter or Space).',
      },
      story: { inline: true, height: 200 },
    },
  },
  render: () => `
  <div style="min-height: 160px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-toast-region" aria-live="polite" role="status" style="position: static; max-width: 420px;">
      <div class="ct-toast" data-variant="info" data-state="open" id="kb-toast">
        <div class="ct-toast__title">Tip</div>
        <div class="ct-toast__description">You can use keyboard shortcuts to navigate faster.</div>
        <button class="ct-button ct-button--ghost ct-button--icon ct-button--sm" type="button" aria-label="Dismiss tip" id="kb-toast-close"><span aria-hidden="true">&times;</span></button>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvasElement.querySelector('#kb-toast');
    const closeBtn = canvasElement.querySelector('#kb-toast-close');

    // Wire up dismiss behavior
    closeBtn.addEventListener('click', () => {
      toast.setAttribute('data-state', 'closed');
    });

    // Toast starts open
    expect(toast).toHaveAttribute('data-state', 'open');

    // Close button is focusable
    closeBtn.focus();
    expect(closeBtn).toHaveFocus();

    // Close button has accessible label
    expect(closeBtn).toHaveAttribute('aria-label', 'Dismiss tip');

    // Decorative icon is hidden from AT
    const icon = closeBtn.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();

    // Keyboard: Enter dismisses the toast
    await userEvent.keyboard('{Enter}');
    expect(toast).toHaveAttribute('data-state', 'closed');

    // Verify closed state is visually hidden
    await waitFor(() => {
      expect(getComputedStyle(toast).opacity).toBe('0');
    });
  },
};
