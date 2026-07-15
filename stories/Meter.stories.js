import { expect } from 'storybook/test';

const segments = [
  { label: 'Completed', value: 62, variant: 'success' },
  { label: 'In review', value: 23, variant: 'warning' },
  { label: 'Blocked', value: 15, variant: 'danger' },
];

const renderMeter = ({ id = 'delivery', theme = '', state = '' } = {}) => `
  <section ${theme ? `data-theme="${theme}"` : ''}
    style="padding: var(--space-5); background: var(--color-bg-canvas); color: var(--color-text-primary); border-radius: var(--radius-md);">
    <div class="ct-meter" ${state ? `data-state="${state}"` : ''}
      role="group" aria-labelledby="${id}-label" aria-describedby="${id}-legend">
      <div class="ct-meter__header">
        <span class="ct-meter__label" id="${id}-label">Delivery status</span>
        <span class="ct-meter__summary">100 items</span>
      </div>
      <div class="ct-meter__track" aria-hidden="true">
        ${segments.map(segment => `
          <span class="ct-meter__segment" data-variant="${segment.variant}"
            style="--ct-meter-segment-size: ${segment.value}%;"></span>`).join('')}
      </div>
      <ul class="ct-meter__legend" id="${id}-legend">
        ${segments.map(segment => `
          <li class="ct-meter__legend-item">
            <span class="ct-meter__marker" data-variant="${segment.variant}" aria-hidden="true"></span>
            <span>${segment.label}</span>
            <span class="ct-meter__legend-value">${segment.value}%</span>
          </li>`).join('')}
      </ul>
    </div>
  </section>`;

export default {
  title: 'Components/Data Display/Segmented Meter',
  parameters: {
    docs: {
      description: {
        component:
          'Part-to-whole meter for distributions and stacked progress. The visible legend is required: every segment needs a text label and value so meaning never depends on colour. Use `role="group"` with `aria-labelledby` and `aria-describedby` for multi-value distributions; use the existing progress bar for a single scalar value.',
      },
    },
  },
};

export const Distribution = {
  render: () => `<div style="width: min(640px, 100%);">${renderMeter()}</div>`,
  play: async ({ canvasElement }) => {
    const meter = canvasElement.querySelector('.ct-meter');
    expect(meter).toHaveAttribute('role', 'group');
    expect(meter).toHaveAttribute('aria-labelledby', 'delivery-label');
    expect(meter).toHaveAttribute('aria-describedby', 'delivery-legend');

    const segmentsRendered = meter.querySelectorAll('.ct-meter__segment');
    const legendItems = meter.querySelectorAll('.ct-meter__legend-item');
    expect(segmentsRendered).toHaveLength(3);
    expect(legendItems).toHaveLength(segmentsRendered.length);

    for (const segment of segmentsRendered) {
      expect(segment.parentElement).toHaveAttribute('aria-hidden', 'true');
    }

    for (const item of legendItems) {
      expect(item.querySelector('.ct-meter__marker')).toHaveAttribute('aria-hidden', 'true');
      expect(item.textContent).toMatch(/\S+.*\d+%/);
    }
  },
};

export const StateContracts = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5); width: min(640px, 100%);">
    <div class="ct-meter" data-state="loading" aria-busy="true" aria-labelledby="meter-loading-label">
      <div class="ct-meter__header"><span class="ct-meter__label" id="meter-loading-label">Refreshing distribution</span></div>
      <div class="ct-meter__track" aria-hidden="true"></div>
      <p class="ct-meter__message">Latest values are loading.</p>
    </div>
    <div class="ct-meter" data-state="error" role="alert" aria-labelledby="meter-error-label">
      <div class="ct-meter__header"><span class="ct-meter__label" id="meter-error-label">Distribution unavailable</span></div>
      <div class="ct-meter__track" aria-hidden="true"></div>
      <p class="ct-meter__message">Could not load this metric.</p>
    </div>
    <div class="ct-meter" data-state="disabled" aria-disabled="true" aria-labelledby="meter-disabled-label">
      <div class="ct-meter__header"><span class="ct-meter__label" id="meter-disabled-label">Historical distribution</span></div>
      <div class="ct-meter__track" aria-hidden="true"></div>
      <p class="ct-meter__message">Not available for this period.</p>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const [loading, error, disabled] = canvasElement.querySelectorAll('.ct-meter');
    expect(loading).toHaveAttribute('data-state', 'loading');
    expect(loading).toHaveAttribute('aria-busy', 'true');
    expect(error).toHaveAttribute('data-state', 'error');
    expect(error).toHaveAttribute('role', 'alert');
    expect(disabled).toHaveAttribute('data-state', 'disabled');
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
  },
};

export const ThemeMatrix = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4); width: min(640px, 100%);">
    ${['light', 'dark', 'high-contrast'].map(theme => renderMeter({ id: `delivery-${theme}`, theme })).join('')}
  </div>`,
  play: async ({ canvasElement }) => {
    const sections = canvasElement.querySelectorAll('[data-theme]');
    expect(sections).toHaveLength(3);
    for (const section of sections) {
      const meter = section.querySelector('.ct-meter');
      expect(meter.querySelectorAll('.ct-meter__segment')).toHaveLength(3);
      expect(meter.querySelectorAll('.ct-meter__legend-item')).toHaveLength(3);
    }
  },
};
