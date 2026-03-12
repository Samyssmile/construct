export default {
  title: 'Forms/Toggle Group'
};

export const SingleSelect = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">View mode</p>
      <div class="ct-toggle-group" role="group" aria-label="View mode">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true">List</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Grid</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Board</button>
      </div>
    </div>
  </div>
`;

export const MultipleSelect = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Filter by status</p>
      <div class="ct-toggle-group" role="group" aria-label="Status filter">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true">Open</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="true">Pending</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Resolved</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Rejected</button>
      </div>
    </div>
  </div>
`;

export const Sizes = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Small</p>
      <div class="ct-toggle-group ct-toggle-group--sm" role="group" aria-label="Size small">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true">Day</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Week</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Month</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Default</p>
      <div class="ct-toggle-group" role="group" aria-label="Size default">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true">Day</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Week</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Month</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Large</p>
      <div class="ct-toggle-group ct-toggle-group--lg" role="group" aria-label="Size large">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true">Day</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Week</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Month</button>
      </div>
    </div>
  </div>
`;

export const Disabled = () => `
  <div class="ct-toggle-group" role="group" aria-label="Disabled example">
    <button class="ct-toggle-group__item" type="button" aria-pressed="true">Active</button>
    <button class="ct-toggle-group__item" type="button" aria-pressed="false" disabled>Disabled</button>
    <button class="ct-toggle-group__item" type="button" aria-pressed="false">Available</button>
  </div>
`;
