import { expect } from 'storybook/test';

export default {
  title: 'Foundations/Icon',
};

export const Sizes = {
  render: () => `
  <div class="ct-cluster" style="--ct-cluster-gap: var(--space-6); align-items: flex-end;">
    <div style="text-align: center;">
      <span class="ct-icon ct-icon--sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">sm (16px)</div>
    </div>

    <div style="text-align: center;">
      <span class="ct-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">md (20px)</div>
    </div>

    <div style="text-align: center;">
      <span class="ct-icon ct-icon--lg">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">lg (24px)</div>
    </div>

    <div style="text-align: center;">
      <span class="ct-icon ct-icon--xl">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">xl (32px)</div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const icons = canvasElement.querySelectorAll('.ct-icon');
    expect(icons).toHaveLength(4);

    // Every icon wrapper contains an SVG
    for (const icon of icons) {
      expect(icon.querySelector('svg')).toBeInTheDocument();
    }

    // Size modifier classes are applied in order: sm, default, lg, xl
    expect(icons[0].classList.contains('ct-icon--sm')).toBe(true);
    expect(icons[1].classList.contains('ct-icon--sm')).toBe(false);
    expect(icons[1].classList.contains('ct-icon--lg')).toBe(false);
    expect(icons[1].classList.contains('ct-icon--xl')).toBe(false);
    expect(icons[2].classList.contains('ct-icon--lg')).toBe(true);
    expect(icons[3].classList.contains('ct-icon--xl')).toBe(true);
  },
};

export const InContext = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
    <button class="ct-button">
      <span class="ct-icon ct-icon--sm"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      Add Item
    </button>

    <div class="ct-alert" data-variant="info" role="status">
      <span class="ct-icon"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span>
      <div class="ct-alert__content">
        <div class="ct-alert__title">Info with SVG icon</div>
        <div class="ct-alert__description">Icons work seamlessly with all components.</div>
      </div>
    </div>

    <span class="ct-badge ct-badge--success ct-badge--icon">
      <span class="ct-icon ct-icon--sm"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></span>
      Approved
    </span>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Button with icon: icon is decorative (button text provides the label)
    const button = canvasElement.querySelector('button.ct-button');
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    // Alert has the correct role for live-region announcement
    const alert = canvasElement.querySelector('[role="status"]');
    expect(alert).toBeInTheDocument();
    expect(alert.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    // Badge is present and its decorative icon is hidden from AT
    const badge = canvasElement.querySelector('.ct-badge');
    expect(badge).toBeInTheDocument();
    expect(badge.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};
