export default {
  title: 'Components/Status & Feedback'
};

export const Badges = () => `
  <div class="ct-cluster" style="--ct-cluster-gap: var(--space-3);">
    <span class="ct-badge ct-badge--icon"><span class="ct-badge__dot" aria-hidden="true"></span>Draft</span>
    <span class="ct-badge ct-badge--info ct-badge--icon"><span class="ct-badge__icon" aria-hidden="true">i</span>Info</span>
    <span class="ct-badge ct-badge--success ct-badge--icon"><span class="ct-badge__icon" aria-hidden="true">+</span>Approved</span>
    <span class="ct-badge ct-badge--warning ct-badge--icon"><span class="ct-badge__icon" aria-hidden="true">!</span>Review</span>
    <span class="ct-badge ct-badge--danger ct-badge--icon"><span class="ct-badge__icon" aria-hidden="true">x</span>Blocked</span>
  </div>
`;

export const Alerts = () => `
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
`;

export const Chips = () => `
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
`;

export const Skeletons = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-3); max-width: 360px;">
    <span class="ct-skeleton ct-skeleton--title"></span>
    <span class="ct-skeleton ct-skeleton--text"></span>
    <span class="ct-skeleton ct-skeleton--text" style="--ct-skeleton-width: 70%;"></span>
    <span class="ct-skeleton ct-skeleton--rect"></span>
  </div>
`;

export const Loading = () => `
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
`;
