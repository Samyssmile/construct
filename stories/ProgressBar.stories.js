import { expect, within } from 'storybook/test';

export default {
  title: 'Feedback/Progress Bar',
  parameters: {
    docs: {
      description: {
        component: 'Accessible progress indicator using the native `<progress>` element. Supports color variants (default, info, success, warning, danger) and size options (sm, md, lg).',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress value (0–100)',
    },
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'danger'],
      description: 'Color variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Track height',
    },
    label: { control: 'text', description: 'Accessible label for screen readers' },
  },
};

export const Playground = {
  args: {
    value: 45,
    variant: 'default',
    size: 'md',
    label: 'Upload progress',
  },
  render: ({ value, variant, size, label }) => {
    const variantClass = variant !== 'default' ? ` ct-progress-bar--${variant}` : '';
    const sizeClass = size !== 'md' ? ` ct-progress-bar--${size}` : '';
    return `
    <div style="max-width: 480px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2); font-size: var(--font-size-sm);">
        <span>${label}</span>
        <span>${value}%</span>
      </div>
      <div class="ct-progress-bar${variantClass}${sizeClass}" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100" aria-label="${label}">
        <div class="ct-progress-bar__track" style="width: ${value}%;"></div>
      </div>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const progressbar = canvasElement.querySelector('[role="progressbar"]');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow');
    expect(progressbar).toHaveAttribute('aria-label');
  },
};

export const Determinate = {
  render: () => `
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
`,
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll('[role="progressbar"]');
    expect(bars).toHaveLength(3);

    // Every determinate bar needs the full aria value triple
    for (const bar of bars) {
      expect(bar).toHaveAttribute('aria-valuemin', '0');
      expect(bar).toHaveAttribute('aria-valuemax', '100');
      expect(bar).toHaveAttribute('aria-valuenow');
      expect(bar).toHaveAttribute('aria-label');
    }

    // aria-valuenow must match the displayed percentage text
    const expectedValues = ['25', '60', '100'];
    bars.forEach((bar, i) => {
      expect(bar).toHaveAttribute('aria-valuenow', expectedValues[i]);
    });

    // Track inline width must be consistent with aria-valuenow
    for (const bar of bars) {
      const track = bar.querySelector('.ct-progress-bar__track');
      const value = bar.getAttribute('aria-valuenow');
      expect(track.style.width).toBe(`${value}%`);
    }

    // 100% bar uses success variant
    expect(bars[2].classList.contains('ct-progress-bar--success')).toBe(true);

    // aria-label must be descriptive (not empty or a raw number)
    for (const bar of bars) {
      const label = bar.getAttribute('aria-label');
      expect(label.length).toBeGreaterThan(3);
      expect(label).not.toMatch(/^\d+$/);
    }
  },
};

export const Indeterminate = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5); max-width: 480px;">
    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm);">Loading data...</p>
      <div class="ct-progress-bar ct-progress-bar--indeterminate" role="progressbar" aria-label="Loading">
        <div class="ct-progress-bar__track"></div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('[role="progressbar"]');
    expect(bar).toBeInTheDocument();

    // Indeterminate bars MUST NOT have aria-valuenow (WCAG: omitting
    // the value attribute signals "indeterminate" to assistive tech)
    expect(bar).not.toHaveAttribute('aria-valuenow');

    // Must still have an accessible label
    expect(bar).toHaveAttribute('aria-label');
    expect(bar.getAttribute('aria-label').length).toBeGreaterThan(0);

    // Has the indeterminate modifier class
    expect(bar.classList.contains('ct-progress-bar--indeterminate')).toBe(true);

    // Track should NOT have an explicit width (animation handles it)
    const track = bar.querySelector('.ct-progress-bar__track');
    expect(track).toBeInTheDocument();
    expect(track.style.width).toBe('');
  },
};

export const Sizes = {
  render: () => `
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
`,
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll('[role="progressbar"]');
    expect(bars).toHaveLength(3);

    // Each size variant has correct aria attributes and track width
    const expected = [
      { value: '40', size: 'ct-progress-bar--sm' },
      { value: '60', size: null },
      { value: '80', size: 'ct-progress-bar--lg' },
    ];

    bars.forEach((bar, i) => {
      expect(bar).toHaveAttribute('aria-valuenow', expected[i].value);
      expect(bar).toHaveAttribute('aria-valuemin', '0');
      expect(bar).toHaveAttribute('aria-valuemax', '100');
      expect(bar).toHaveAttribute('aria-label');

      // Track width consistent with value
      const track = bar.querySelector('.ct-progress-bar__track');
      expect(track.style.width).toBe(`${expected[i].value}%`);

      // Size modifier class
      if (expected[i].size) {
        expect(bar.classList.contains(expected[i].size)).toBe(true);
      }
    });
  },
};

export const Variants = {
  render: () => `
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
`,
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll('[role="progressbar"]');
    expect(bars).toHaveLength(5);

    const expectedVariants = [null, 'info', 'success', 'warning', 'danger'];

    bars.forEach((bar, i) => {
      // Every variant must have full aria attribute set
      expect(bar).toHaveAttribute('aria-valuenow', '50');
      expect(bar).toHaveAttribute('aria-valuemin', '0');
      expect(bar).toHaveAttribute('aria-valuemax', '100');
      expect(bar).toHaveAttribute('aria-label');

      // Variant class present (except default)
      if (expectedVariants[i]) {
        expect(bar.classList.contains(`ct-progress-bar--${expectedVariants[i]}`)).toBe(true);
      }

      // Track width matches value
      const track = bar.querySelector('.ct-progress-bar__track');
      expect(track.style.width).toBe('50%');
    });

    // Each bar has a unique aria-label (not all the same generic label)
    const labels = [...bars].map(b => b.getAttribute('aria-label'));
    const uniqueLabels = new Set(labels);
    expect(uniqueLabels.size).toBe(labels.length);
  },
};
