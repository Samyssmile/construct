export default {
  title: 'Components/Progress Bar'
};

export const Determinate = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5); max-width: 480px;">
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2); font-size: var(--font-size-sm);">
        <span>Uploading...</span>
        <span>25%</span>
      </div>
      <div class="ct-progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" aria-label="Upload progress">
        <div class="ct-progress-bar__track" style="width: 25%;"></div>
      </div>
    </div>

    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2); font-size: var(--font-size-sm);">
        <span>Processing...</span>
        <span>60%</span>
      </div>
      <div class="ct-progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" aria-label="Processing progress">
        <div class="ct-progress-bar__track" style="width: 60%;"></div>
      </div>
    </div>

    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2); font-size: var(--font-size-sm);">
        <span>Complete</span>
        <span>100%</span>
      </div>
      <div class="ct-progress-bar ct-progress-bar--success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" aria-label="Complete">
        <div class="ct-progress-bar__track" style="width: 100%;"></div>
      </div>
    </div>
  </div>
`;

export const Indeterminate = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5); max-width: 480px;">
    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm);">Loading data...</p>
      <div class="ct-progress-bar ct-progress-bar--indeterminate" role="progressbar" aria-label="Loading">
        <div class="ct-progress-bar__track"></div>
      </div>
    </div>
  </div>
`;

export const Sizes = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5); max-width: 480px;">
    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Small (4px)</p>
      <div class="ct-progress-bar ct-progress-bar--sm" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" aria-label="Small progress">
        <div class="ct-progress-bar__track" style="width: 40%;"></div>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Default (8px)</p>
      <div class="ct-progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" aria-label="Default progress">
        <div class="ct-progress-bar__track" style="width: 60%;"></div>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Large (12px)</p>
      <div class="ct-progress-bar ct-progress-bar--lg" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" aria-label="Large progress">
        <div class="ct-progress-bar__track" style="width: 80%;"></div>
      </div>
    </div>
  </div>
`;

export const Variants = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5); max-width: 480px;">
    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Default (brand)</p>
      <div class="ct-progress-bar" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-label="Default variant">
        <div class="ct-progress-bar__track" style="width: 50%;"></div>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Info</p>
      <div class="ct-progress-bar ct-progress-bar--info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-label="Info variant">
        <div class="ct-progress-bar__track" style="width: 50%;"></div>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Success</p>
      <div class="ct-progress-bar ct-progress-bar--success" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-label="Success variant">
        <div class="ct-progress-bar__track" style="width: 50%;"></div>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Warning</p>
      <div class="ct-progress-bar ct-progress-bar--warning" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-label="Warning variant">
        <div class="ct-progress-bar__track" style="width: 50%;"></div>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Danger</p>
      <div class="ct-progress-bar ct-progress-bar--danger" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-label="Danger variant">
        <div class="ct-progress-bar__track" style="width: 50%;"></div>
      </div>
    </div>
  </div>
`;
