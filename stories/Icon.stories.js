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
};

export const InContext = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
    <button class="ct-button">
      <span class="ct-icon ct-icon--sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      Add Item
    </button>

    <div class="ct-alert" data-variant="info" role="status">
      <span class="ct-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span>
      <div class="ct-alert__content">
        <div class="ct-alert__title">Info with SVG icon</div>
        <div class="ct-alert__description">Icons work seamlessly with all components.</div>
      </div>
    </div>

    <span class="ct-badge ct-badge--success ct-badge--icon">
      <span class="ct-icon ct-icon--sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></span>
      Approved
    </span>
  </div>
`,
};
