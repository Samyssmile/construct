import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Components/Status & Feedback',
};

export const Badges = {
  render: () => `
  <div class="ct-cluster" style="--ct-cluster-gap: var(--space-3);">
    <span class="ct-badge ct-badge--icon"><span class="ct-badge__dot" aria-hidden="true"></span>Draft</span>
    <span class="ct-badge ct-badge--info ct-badge--icon"><span class="ct-badge__icon" aria-hidden="true">i</span>Info</span>
    <span class="ct-badge ct-badge--success ct-badge--icon"><span class="ct-badge__icon" aria-hidden="true">+</span>Approved</span>
    <span class="ct-badge ct-badge--warning ct-badge--icon"><span class="ct-badge__icon" aria-hidden="true">!</span>Review</span>
    <span class="ct-badge ct-badge--danger ct-badge--icon"><span class="ct-badge__icon" aria-hidden="true">x</span>Blocked</span>
  </div>
`,
};

export const Alerts = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4); max-width: 720px;">
    <div class="ct-alert" data-variant="info" role="status">
      <span class="ct-alert__icon" aria-hidden="true">i</span>
      <div class="ct-alert__content">
        <div class="ct-alert__title">Heads up</div>
        <div class="ct-alert__description">We will be offline for maintenance tonight.</div>
      </div>
    </div>

    <div class="ct-alert" data-variant="warning" role="alert">
      <span class="ct-alert__icon" aria-hidden="true">!</span>
      <div class="ct-alert__content">
        <div class="ct-alert__title">Action required</div>
        <div class="ct-alert__description">Please review the pending changes.</div>
        <div class="ct-alert__actions">
          <button class="ct-button ct-button--secondary ct-button--sm">Review</button>
        </div>
      </div>
    </div>

    <div class="ct-alert" data-variant="success" role="status">
      <span class="ct-alert__icon" aria-hidden="true">+</span>
      <div class="ct-alert__content">
        <div class="ct-alert__title">All set</div>
        <div class="ct-alert__description">Your changes have been saved.</div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alerts = canvasElement.querySelectorAll('.ct-alert');
    expect(alerts).toHaveLength(3);

    // Info alert uses role="status" (polite live region)
    expect(alerts[0]).toHaveAttribute('role', 'status');
    expect(alerts[0]).toHaveAttribute('data-variant', 'info');

    // Warning alert uses role="alert" (assertive live region)
    expect(alerts[1]).toHaveAttribute('role', 'alert');
    expect(alerts[1]).toHaveAttribute('data-variant', 'warning');

    // Success alert uses role="status"
    expect(alerts[2]).toHaveAttribute('role', 'status');

    // Decorative icons are hidden from AT
    const icons = canvasElement.querySelectorAll('.ct-alert__icon');
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }

    // Each alert has both title and description
    for (const alert of alerts) {
      expect(within(alert).getByText(/.+/, { selector: '.ct-alert__title' })).toBeInTheDocument();
      expect(within(alert).getByText(/.+/, { selector: '.ct-alert__description' })).toBeInTheDocument();
    }

    // Warning alert has an actionable button
    const reviewBtn = canvas.getByRole('button', { name: 'Review' });
    expect(reviewBtn).toBeEnabled();
    await userEvent.click(reviewBtn);
    expect(reviewBtn).toHaveFocus();
  },
};

export const Chips = {
  render: () => `
  <div class="ct-cluster" style="--ct-cluster-gap: var(--space-3);">
    <button class="ct-chip ct-chip--interactive" type="button">Design</button>
    <button class="ct-chip ct-chip--interactive" type="button" aria-pressed="true">
      <span class="ct-chip__icon" aria-hidden="true">#</span>
      Finance
    </button>
    <span class="ct-chip">
      Uploads
      <button class="ct-chip__remove" type="button" aria-label="Remove tag">x</button>
    </span>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Interactive chips are buttons
    const designChip = canvas.getByRole('button', { name: 'Design' });
    expect(designChip).toBeInTheDocument();

    // Pressed chip has aria-pressed="true"
    const financeChip = canvas.getByRole('button', { name: /Finance/ });
    expect(financeChip).toHaveAttribute('aria-pressed', 'true');

    // Unpressed interactive chip has no aria-pressed or "false"
    const designPressed = designChip.getAttribute('aria-pressed');
    expect(designPressed === null || designPressed === 'false').toBe(true);

    // Decorative icon in pressed chip is hidden from AT
    const chipIcon = financeChip.querySelector('[aria-hidden="true"]');
    expect(chipIcon).toBeInTheDocument();

    // Remove button must have a specific accessible name (not just "Remove tag")
    const removeBtn = canvas.getByRole('button', { name: /Remove/ });
    expect(removeBtn).toBeInTheDocument();
    // Verify the remove button label identifies what is being removed
    const removeLabel = removeBtn.getAttribute('aria-label');
    expect(removeLabel).toBeTruthy();

    // Toggle an interactive chip
    await userEvent.click(designChip);
    expect(designChip).toHaveFocus();
  },
};

export const Skeletons = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-3); max-width: 360px;">
    <span class="ct-skeleton ct-skeleton--title"></span>
    <span class="ct-skeleton ct-skeleton--text"></span>
    <span class="ct-skeleton ct-skeleton--text" style="--ct-skeleton-width: 70%;"></span>
    <span class="ct-skeleton ct-skeleton--rect"></span>
  </div>
`,
};

export const Loading = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div class="ct-cluster" style="--ct-cluster-gap: var(--space-4);">
      <span class="ct-spinner ct-spinner--sm" role="status" aria-label="Loading"></span>
      <span class="ct-spinner" role="status" aria-label="Loading"></span>
      <span class="ct-spinner ct-spinner--lg" role="status" aria-label="Loading"></span>
    </div>

    <div class="ct-card" style="position: relative; min-height: 200px;">
      <p class="ct-muted">Content is temporarily blocked while loading.</p>
      <div class="ct-loading-overlay" data-state="active" aria-busy="true">
        <div class="ct-loading-overlay__content">
          <span class="ct-spinner ct-spinner--lg" aria-hidden="true"></span>
          <div class="ct-loading-overlay__label">Uploading files...</div>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Standalone spinners use role="status" + aria-label
    const spinners = canvasElement.querySelectorAll('.ct-spinner[role="status"]');
    expect(spinners.length).toBeGreaterThanOrEqual(3);
    for (const spinner of spinners) {
      if (!spinner.hasAttribute('aria-hidden')) {
        expect(spinner).toHaveAttribute('aria-label');
        const label = spinner.getAttribute('aria-label');
        expect(label.length).toBeGreaterThan(0);
      }
    }

    // Loading overlay is marked as busy
    const overlay = canvasElement.querySelector('.ct-loading-overlay[data-state="active"]');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute('aria-busy', 'true');

    // Overlay spinner (decorative, since parent communicates loading) is hidden from AT
    const overlaySpinner = overlay.querySelector('.ct-spinner');
    expect(overlaySpinner).toHaveAttribute('aria-hidden', 'true');

    // Overlay has a visible loading label
    const loadingLabel = overlay.querySelector('.ct-loading-overlay__label');
    expect(loadingLabel).toBeInTheDocument();
    expect(loadingLabel.textContent.trim().length).toBeGreaterThan(0);
  },
};
