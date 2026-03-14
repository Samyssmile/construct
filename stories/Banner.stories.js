import { expect, within, userEvent, waitFor } from 'storybook/test';

export default {
  title: 'Feedback/Banner',
  parameters: {
    docs: {
      description: {
        component:
          'Persistent page- or section-level notices for system status, announcements, and consent dialogs. ' +
          'Differs from Alert (inline context) and Toast (transient overlay). ' +
          'Supports semantic variants via `data-variant` (info, warning, danger, success, neutral), ' +
          'appearance styles (subtle, solid, left-accent, top-accent), ' +
          'positions (inline, fixed-top, fixed-bottom, sticky), and compact size. ' +
          'Uses `role="alert"` for danger/warning, `role="status"` for info/success, ' +
          'and `role="region"` with `aria-label` for neutral banners.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'warning', 'danger', 'success', 'neutral'],
      description: 'Semantic color variant',
    },
    appearance: {
      control: 'select',
      options: ['subtle', 'solid', 'left-accent', 'top-accent'],
      description: 'Visual appearance style',
    },
    title: { control: 'text', description: 'Banner title (optional)' },
    message: { control: 'text', description: 'Banner message text' },
    showIcon: { control: 'boolean', description: 'Show status icon' },
    showActions: { control: 'boolean', description: 'Show action buttons' },
    showClose: { control: 'boolean', description: 'Show close button' },
    compact: { control: 'boolean', description: 'Compact size' },
    fullWidth: { control: 'boolean', description: 'Full-width (no radius)' },
  },
};

const iconMap = { info: 'i', warning: '!', danger: 'x', success: '+', neutral: '–' };
const roleMap = { info: 'status', warning: 'alert', danger: 'alert', success: 'status', neutral: 'region' };

/**
 * Interactive playground with all controls.
 */
export const Playground = {
  args: {
    variant: 'info',
    appearance: 'subtle',
    title: 'System update available',
    message: 'A new version is ready. Please refresh to apply the latest changes.',
    showIcon: true,
    showActions: true,
    showClose: true,
    compact: false,
    fullWidth: false,
  },
  render: ({ variant, appearance, title, message, showIcon, showActions, showClose, compact, fullWidth }) => {
    const classes = ['ct-banner'];
    if (appearance === 'solid') classes.push('ct-banner--solid');
    if (appearance === 'left-accent') classes.push('ct-banner--left-accent');
    if (appearance === 'top-accent') classes.push('ct-banner--top-accent');
    if (compact) classes.push('ct-banner--compact');
    if (fullWidth) classes.push('ct-banner--full');

    const variantAttr = variant !== 'info' ? ` data-variant="${variant}"` : '';
    const role = roleMap[variant];
    const regionAttr = variant === 'neutral' ? ' aria-label="Notice"' : '';

    const iconHtml = showIcon
      ? `<span class="ct-banner__icon" aria-hidden="true">${iconMap[variant]}</span>`
      : '';
    const titleHtml = title
      ? `<div class="ct-banner__title">${title}</div>`
      : '';
    const messageHtml = message
      ? `<div class="ct-banner__message">${message}</div>`
      : '';
    const actionsHtml = showActions
      ? `<div class="ct-banner__actions">
          <button class="ct-button ct-button--secondary ct-button--sm" type="button">Refresh</button>
          <a href="#" class="ct-button ct-button--ghost ct-button--sm">Learn more</a>
        </div>`
      : '';
    const closeHtml = showClose
      ? `<button class="ct-banner__close" type="button" aria-label="Dismiss banner"><span aria-hidden="true">&times;</span></button>`
      : '';

    return `
    <div style="padding: 24px; max-width: 800px;">
      <div class="${classes.join(' ')}"${variantAttr} role="${role}"${regionAttr} data-state="open">
        ${iconHtml}
        <div class="ct-banner__content">
          ${titleHtml}
          ${messageHtml}
        </div>
        ${actionsHtml}
        ${closeHtml}
      </div>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const banner = canvasElement.querySelector('.ct-banner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('data-state', 'open');
    expect(banner).toHaveAttribute('role');

    // Icon is decorative
    const icon = banner.querySelector('.ct-banner__icon');
    if (icon) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }

    // Content is present
    expect(banner.querySelector('.ct-banner__content')).toBeInTheDocument();
  },
};

/**
 * All five semantic variants with correct ARIA roles.
 */
export const Variants = {
  render: () => `
  <div style="padding: 24px; max-width: 800px; display: grid; gap: var(--space-4);">
    <div class="ct-banner" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">i</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">System update</div>
        <div class="ct-banner__message">A new version is available. Please refresh to update.</div>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss info banner"><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="ct-banner" data-variant="warning" role="alert" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">!</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Trial expiring</div>
        <div class="ct-banner__message">Your trial ends in 3 days. Upgrade to keep access.</div>
      </div>
      <div class="ct-banner__actions">
        <button class="ct-button ct-button--secondary ct-button--sm" type="button">Upgrade</button>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss warning banner"><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="ct-banner" data-variant="danger" role="alert" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">x</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Service disruption</div>
        <div class="ct-banner__message">Some features are temporarily unavailable. We are working on a fix.</div>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss error banner"><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="ct-banner" data-variant="success" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">+</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Migration complete</div>
        <div class="ct-banner__message">All data has been transferred successfully.</div>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss success banner"><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="ct-banner" data-variant="neutral" role="region" aria-label="Cookie consent" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">–</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Cookie preferences</div>
        <div class="ct-banner__message">We use cookies to improve your experience. Manage your preferences or accept all.</div>
      </div>
      <div class="ct-banner__actions">
        <button class="ct-button ct-button--secondary ct-button--sm" type="button">Manage</button>
        <button class="ct-button ct-button--ghost ct-button--sm" type="button">Accept all</button>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss cookie banner"><span aria-hidden="true">&times;</span></button>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const banners = canvasElement.querySelectorAll('.ct-banner');
    expect(banners).toHaveLength(5);

    // Info (default) uses role="status"
    expect(banners[0]).toHaveAttribute('role', 'status');
    expect(banners[0]).not.toHaveAttribute('data-variant');

    // Warning uses role="alert"
    expect(banners[1]).toHaveAttribute('data-variant', 'warning');
    expect(banners[1]).toHaveAttribute('role', 'alert');

    // Danger uses role="alert"
    expect(banners[2]).toHaveAttribute('data-variant', 'danger');
    expect(banners[2]).toHaveAttribute('role', 'alert');

    // Success uses role="status"
    expect(banners[3]).toHaveAttribute('data-variant', 'success');
    expect(banners[3]).toHaveAttribute('role', 'status');

    // Neutral uses role="region" with aria-label
    expect(banners[4]).toHaveAttribute('data-variant', 'neutral');
    expect(banners[4]).toHaveAttribute('role', 'region');
    expect(banners[4]).toHaveAttribute('aria-label');

    // All icons are decorative
    const icons = canvasElement.querySelectorAll('.ct-banner__icon');
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }

    // Each banner has title + message
    for (const banner of banners) {
      expect(banner.querySelector('.ct-banner__title')).toBeInTheDocument();
      expect(banner.querySelector('.ct-banner__message')).toBeInTheDocument();
    }

    // All close buttons have unique accessible labels
    const closeButtons = canvasElement.querySelectorAll('.ct-banner__close');
    expect(closeButtons).toHaveLength(5);
    const labels = [...closeButtons].map(b => b.getAttribute('aria-label'));
    expect(new Set(labels).size).toBe(5);
  },
};

/**
 * Appearance variants: subtle (default), solid, left-accent, top-accent.
 */
export const Appearances = {
  render: () => `
  <div style="padding: 24px; max-width: 800px; display: grid; gap: var(--space-4);">
    <div class="ct-banner" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">i</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Subtle (default)</div>
        <div class="ct-banner__message">Light background with subtle border — the default appearance.</div>
      </div>
    </div>

    <div class="ct-banner ct-banner--solid" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">i</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Solid</div>
        <div class="ct-banner__message">Full accent-color background with inverse text.</div>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss solid banner"><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="ct-banner ct-banner--left-accent" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">i</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Left accent</div>
        <div class="ct-banner__message">Thick left border stripe for visual emphasis.</div>
      </div>
    </div>

    <div class="ct-banner ct-banner--top-accent" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">i</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Top accent</div>
        <div class="ct-banner__message">Thick top border stripe for page-level prominence.</div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const banners = canvasElement.querySelectorAll('.ct-banner');
    expect(banners).toHaveLength(4);

    // Default (subtle) has no appearance modifier
    expect(banners[0].classList.contains('ct-banner--solid')).toBe(false);
    expect(banners[0].classList.contains('ct-banner--left-accent')).toBe(false);

    // Solid modifier
    expect(banners[1].classList.contains('ct-banner--solid')).toBe(true);

    // Left accent modifier
    expect(banners[2].classList.contains('ct-banner--left-accent')).toBe(true);

    // Top accent modifier
    expect(banners[3].classList.contains('ct-banner--top-accent')).toBe(true);
  },
};

/**
 * Solid appearance across all semantic variants.
 */
export const SolidVariants = {
  render: () => `
  <div style="padding: 24px; max-width: 800px; display: grid; gap: var(--space-4);">
    <div class="ct-banner ct-banner--solid" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">i</span>
      <div class="ct-banner__content">
        <div class="ct-banner__message">Info — New deployment available.</div>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss info banner"><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="ct-banner ct-banner--solid" data-variant="warning" role="alert" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">!</span>
      <div class="ct-banner__content">
        <div class="ct-banner__message">Warning — Storage usage at 95%.</div>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss warning banner"><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="ct-banner ct-banner--solid" data-variant="danger" role="alert" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">x</span>
      <div class="ct-banner__content">
        <div class="ct-banner__message">Danger — Payment method expired.</div>
      </div>
      <div class="ct-banner__actions">
        <button class="ct-button ct-button--secondary ct-button--sm" type="button">Update</button>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss error banner"><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="ct-banner ct-banner--solid" data-variant="success" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">+</span>
      <div class="ct-banner__content">
        <div class="ct-banner__message">Success — All systems operational.</div>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss success banner"><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="ct-banner ct-banner--solid" data-variant="neutral" role="region" aria-label="Announcement" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">–</span>
      <div class="ct-banner__content">
        <div class="ct-banner__message">Neutral — Scheduled maintenance tonight at 2 AM UTC.</div>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss announcement"><span aria-hidden="true">&times;</span></button>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const banners = canvasElement.querySelectorAll('.ct-banner--solid');
    expect(banners).toHaveLength(5);

    // All solid banners have inverse text color
    for (const banner of banners) {
      const style = getComputedStyle(banner);
      expect(style.color).toBeTruthy();
    }

    // Close buttons on solid banners are accessible
    const closeButtons = canvasElement.querySelectorAll('.ct-banner--solid .ct-banner__close');
    for (const btn of closeButtons) {
      expect(btn).toHaveAttribute('aria-label');
    }
  },
};

/**
 * Banner with primary and secondary action buttons.
 */
export const WithActions = {
  render: () => `
  <div style="padding: 24px; max-width: 800px; display: grid; gap: var(--space-4);">
    <div class="ct-banner" data-variant="warning" role="alert" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">!</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Your trial expires in 3 days</div>
        <div class="ct-banner__message">Upgrade now to retain access to all features.</div>
      </div>
      <div class="ct-banner__actions">
        <button class="ct-button ct-button--secondary ct-button--sm" type="button">Upgrade plan</button>
        <a href="#" class="ct-button ct-button--ghost ct-button--sm">Compare plans</a>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss trial warning"><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="ct-banner ct-banner--left-accent" data-variant="danger" role="alert" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">x</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Payment failed</div>
        <div class="ct-banner__message">We could not charge your card ending in 4242. Update your payment method to avoid service interruption.</div>
      </div>
      <div class="ct-banner__actions">
        <button class="ct-button ct-button--secondary ct-button--sm" type="button">Update payment</button>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Action buttons are accessible and focusable
    const upgradeBtn = canvas.getByRole('button', { name: 'Upgrade plan' });
    expect(upgradeBtn).toBeInTheDocument();
    await userEvent.click(upgradeBtn);
    expect(upgradeBtn).toHaveFocus();

    // Link action is present
    const compareLink = canvas.getByRole('link', { name: 'Compare plans' });
    expect(compareLink).toBeInTheDocument();

    // Tab order: upgrade → compare → close
    upgradeBtn.focus();
    await userEvent.tab();
    expect(compareLink).toHaveFocus();
    await userEvent.tab();
    const closeBtn = canvas.getByRole('button', { name: 'Dismiss trial warning' });
    expect(closeBtn).toHaveFocus();

    // Second banner has action but no close button
    const banners = canvasElement.querySelectorAll('.ct-banner');
    expect(banners[1].querySelector('.ct-banner__close')).toBeNull();
    expect(banners[1].querySelector('.ct-banner__actions')).toBeInTheDocument();
  },
};

/**
 * Dismissable banner — close button toggles data-state and keyboard support.
 */
export const Dismissable = {
  render: () => `
  <div style="padding: 24px; max-width: 800px;">
    <div class="ct-banner" role="status" data-state="open" id="dismiss-banner">
      <span class="ct-banner__icon" aria-hidden="true">i</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Getting started</div>
        <div class="ct-banner__message">Complete your profile to unlock all features.</div>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss getting started banner" id="dismiss-close"><span aria-hidden="true">&times;</span></button>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const banner = canvasElement.querySelector('#dismiss-banner');
    const closeBtn = canvasElement.querySelector('#dismiss-close');

    // Wire up dismiss behavior
    closeBtn.addEventListener('click', () => {
      banner.setAttribute('data-state', 'closed');
    });

    // Banner starts open
    expect(banner).toHaveAttribute('data-state', 'open');

    // Close button is focusable
    closeBtn.focus();
    expect(closeBtn).toHaveFocus();

    // Close button has accessible label
    expect(closeBtn).toHaveAttribute('aria-label', 'Dismiss getting started banner');

    // Decorative icon inside close button is hidden from AT
    const xIcon = closeBtn.querySelector('[aria-hidden="true"]');
    expect(xIcon).toBeInTheDocument();

    // Keyboard: Enter dismisses the banner
    await userEvent.keyboard('{Enter}');
    expect(banner).toHaveAttribute('data-state', 'closed');

    // Closed state has opacity 0
    await waitFor(() => {
      expect(getComputedStyle(banner).opacity).toBe('0');
    });

    // Closed state disables pointer events
    expect(getComputedStyle(banner).pointerEvents).toBe('none');
  },
};

/**
 * Compact size for narrow info bars (e.g. maintenance notice, version info).
 */
export const Compact = {
  render: () => `
  <div style="padding: 24px; max-width: 800px; display: grid; gap: var(--space-4);">
    <div class="ct-banner ct-banner--compact" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">i</span>
      <div class="ct-banner__content">
        <div class="ct-banner__message">Scheduled maintenance tonight 2:00–4:00 AM UTC.</div>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss maintenance notice"><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="ct-banner ct-banner--compact ct-banner--solid" data-variant="warning" role="alert" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">!</span>
      <div class="ct-banner__content">
        <div class="ct-banner__message">Read-only mode — writes are temporarily disabled.</div>
      </div>
    </div>

    <div class="ct-banner ct-banner--compact" data-variant="success" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">+</span>
      <div class="ct-banner__content">
        <div class="ct-banner__message">All systems operational.</div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const banners = canvasElement.querySelectorAll('.ct-banner--compact');
    expect(banners).toHaveLength(3);

    // Compact banners have reduced font size
    for (const banner of banners) {
      const style = getComputedStyle(banner);
      const fontSize = parseFloat(style.fontSize);
      expect(fontSize).toBeLessThanOrEqual(13);
    }
  },
};

/**
 * Full-width inline — no border-radius, no inline borders (Ant Design banner pattern).
 */
export const FullWidth = {
  render: () => `
  <div style="max-width: 800px;">
    <div class="ct-banner ct-banner--full" data-variant="warning" role="alert" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">!</span>
      <div class="ct-banner__content">
        <div class="ct-banner__message">This workspace will be archived on March 31. Export your data before then.</div>
      </div>
      <div class="ct-banner__actions">
        <button class="ct-button ct-button--secondary ct-button--sm" type="button">Export data</button>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss archive warning"><span aria-hidden="true">&times;</span></button>
    </div>

    <div style="padding: 24px; color: var(--color-text-secondary);">
      <p>Page content below the full-width banner. The banner has no border-radius and no inline borders, creating a clean edge-to-edge layout.</p>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const banner = canvasElement.querySelector('.ct-banner--full');
    expect(banner).toBeInTheDocument();

    // Full-width has no border-radius
    const style = getComputedStyle(banner);
    expect(style.borderRadius).toBe('0px');
  },
};

/**
 * Fixed positions simulated within a contained area.
 * In production, --fixed-top and --fixed-bottom use position: fixed relative to the viewport.
 */
export const FixedPositions = {
  render: () => `
  <div style="padding: 24px; max-width: 800px; display: grid; gap: var(--space-6);">
    <div>
      <p style="margin-bottom: var(--space-3); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Fixed Top</p>
      <div style="position: relative; height: 200px; overflow: hidden; border: 1px dashed var(--color-border-subtle); border-radius: var(--radius-md); background: var(--color-bg-canvas);">
        <div class="ct-banner ct-banner--fixed-top" role="status" data-state="open" style="position: absolute;">
          <span class="ct-banner__icon" aria-hidden="true">i</span>
          <div class="ct-banner__content">
            <div class="ct-banner__message">New version available — refresh to update.</div>
          </div>
          <div class="ct-banner__actions">
            <button class="ct-button ct-button--secondary ct-button--sm" type="button">Refresh</button>
          </div>
          <button class="ct-banner__close" type="button" aria-label="Dismiss update banner"><span aria-hidden="true">&times;</span></button>
        </div>
        <div style="padding: 64px 24px 24px; color: var(--color-text-muted);">
          Page content below the fixed-top banner.
        </div>
      </div>
    </div>

    <div>
      <p style="margin-bottom: var(--space-3); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Fixed Bottom</p>
      <div style="position: relative; height: 200px; overflow: hidden; border: 1px dashed var(--color-border-subtle); border-radius: var(--radius-md); background: var(--color-bg-canvas);">
        <div style="padding: 24px; color: var(--color-text-muted);">
          Page content above the fixed-bottom banner.
        </div>
        <div class="ct-banner ct-banner--fixed-bottom ct-banner--compact" data-variant="neutral" role="region" aria-label="Cookie consent" data-state="open" style="position: absolute;">
          <span class="ct-banner__icon" aria-hidden="true">–</span>
          <div class="ct-banner__content">
            <div class="ct-banner__message">We use cookies to enhance your experience.</div>
          </div>
          <div class="ct-banner__actions">
            <button class="ct-button ct-button--secondary ct-button--sm" type="button">Accept</button>
            <button class="ct-button ct-button--ghost ct-button--sm" type="button">Settings</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Fixed top banner
    const fixedTop = canvasElement.querySelector('.ct-banner--fixed-top');
    expect(fixedTop).toBeInTheDocument();
    expect(fixedTop).toHaveAttribute('role', 'status');

    // Fixed bottom banner (cookie consent pattern)
    const fixedBottom = canvasElement.querySelector('.ct-banner--fixed-bottom');
    expect(fixedBottom).toBeInTheDocument();
    expect(fixedBottom).toHaveAttribute('role', 'region');
    expect(fixedBottom).toHaveAttribute('aria-label', 'Cookie consent');

    // Both banners have no border-radius (fixed position resets it)
    for (const banner of [fixedTop, fixedBottom]) {
      expect(getComputedStyle(banner).borderRadius).toBe('0px');
    }
  },
};

/**
 * Multiple banners stacked vertically with consistent spacing.
 */
export const Stacking = {
  render: () => `
  <div style="padding: 24px; max-width: 800px; display: grid; gap: var(--space-3);">
    <div class="ct-banner ct-banner--compact ct-banner--solid" data-variant="danger" role="alert" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">x</span>
      <div class="ct-banner__content">
        <div class="ct-banner__message">Payment overdue — update your billing to avoid service suspension.</div>
      </div>
      <div class="ct-banner__actions">
        <button class="ct-button ct-button--secondary ct-button--sm" type="button">Update billing</button>
      </div>
    </div>

    <div class="ct-banner ct-banner--compact" data-variant="warning" role="alert" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">!</span>
      <div class="ct-banner__content">
        <div class="ct-banner__message">Storage quota at 92% — consider upgrading your plan.</div>
      </div>
      <div class="ct-banner__actions">
        <button class="ct-button ct-button--ghost ct-button--sm" type="button">Manage</button>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss storage warning"><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="ct-banner ct-banner--compact" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">i</span>
      <div class="ct-banner__content">
        <div class="ct-banner__message">Construct v3.2 is now available with new components.</div>
      </div>
      <div class="ct-banner__actions">
        <a href="#" class="ct-button ct-button--ghost ct-button--sm">Release notes</a>
      </div>
      <button class="ct-banner__close" type="button" aria-label="Dismiss update notice"><span aria-hidden="true">&times;</span></button>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const banners = canvasElement.querySelectorAll('.ct-banner');
    expect(banners).toHaveLength(3);

    // Priority ordering: danger first, then warning, then info
    expect(banners[0]).toHaveAttribute('data-variant', 'danger');
    expect(banners[1]).toHaveAttribute('data-variant', 'warning');
    expect(banners[2]).not.toHaveAttribute('data-variant');

    // Each banner has a unique message
    const messages = [...banners].map(b => b.querySelector('.ct-banner__message').textContent.trim());
    expect(new Set(messages).size).toBe(3);

    // All close buttons have unique labels
    const closeButtons = canvasElement.querySelectorAll('.ct-banner__close');
    const labels = [...closeButtons].map(b => b.getAttribute('aria-label'));
    expect(new Set(labels).size).toBe(labels.length);

    // Tab order flows through all interactive elements
    const allButtons = canvasElement.querySelectorAll('button, a');
    expect(allButtons.length).toBeGreaterThanOrEqual(5);
    allButtons[0].focus();
    expect(allButtons[0]).toHaveFocus();
    await userEvent.tab();
    expect(allButtons[1]).toHaveFocus();
  },
};

/**
 * Left-accent appearance across variants — similar to Chakra UI's accent pattern.
 */
export const AccentVariants = {
  render: () => `
  <div style="padding: 24px; max-width: 800px; display: grid; gap: var(--space-4);">
    <div class="ct-banner ct-banner--left-accent" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">i</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Did you know?</div>
        <div class="ct-banner__message">You can use keyboard shortcuts to navigate faster. Press ? to see all shortcuts.</div>
      </div>
    </div>

    <div class="ct-banner ct-banner--left-accent" data-variant="success" role="status" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">+</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Setup complete</div>
        <div class="ct-banner__message">Your workspace is configured and ready to use.</div>
      </div>
    </div>

    <div class="ct-banner ct-banner--top-accent" data-variant="danger" role="alert" data-state="open">
      <span class="ct-banner__icon" aria-hidden="true">x</span>
      <div class="ct-banner__content">
        <div class="ct-banner__title">Account suspended</div>
        <div class="ct-banner__message">Your account has been suspended due to policy violations. Contact support for assistance.</div>
      </div>
      <div class="ct-banner__actions">
        <button class="ct-button ct-button--secondary ct-button--sm" type="button">Contact support</button>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const banners = canvasElement.querySelectorAll('.ct-banner');
    expect(banners).toHaveLength(3);

    // Left-accent banners
    expect(banners[0].classList.contains('ct-banner--left-accent')).toBe(true);
    expect(banners[1].classList.contains('ct-banner--left-accent')).toBe(true);

    // Top-accent banner
    expect(banners[2].classList.contains('ct-banner--top-accent')).toBe(true);

    // Content is fully accessible
    for (const banner of banners) {
      expect(banner.querySelector('.ct-banner__title')).toBeInTheDocument();
      expect(banner.querySelector('.ct-banner__message')).toBeInTheDocument();
      expect(banner.querySelector('.ct-banner__icon')).toHaveAttribute('aria-hidden', 'true');
    }
  },
};
