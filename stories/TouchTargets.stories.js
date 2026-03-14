import { expect } from 'storybook/test';

export default {
  title: 'Accessibility/Touch Targets',
  parameters: {
    docs: {
      description: {
        component:
          'WCAG 2.5.8 requires interactive elements to have at least 44×44px touch targets. ' +
          'On touch devices (`pointer: coarse`), Construct automatically enlarges targets via ' +
          'token overrides (`--control-height-sm`, `--control-height-calendar-day`) and invisible ' +
          'hit-area expansion (`::after`/`::before` pseudo-elements). ' +
          'On pointer devices, visual sizes remain unchanged.',
      },
    },
  },
};

export const Overview = {
  parameters: {
    docs: {
      description: {
        story:
          'All previously affected components side-by-side. On touch devices ' +
          '(`@media (pointer: coarse)`), each element meets the 44×44px minimum.',
      },
    },
  },
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6); padding: var(--space-6);">
    <section>
      <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin: 0 0 var(--space-3);">Checkbox & Radio</h3>
      <div style="display: flex; gap: var(--space-6); flex-wrap: wrap;">
        <label class="ct-check">
          <input class="ct-check__input" type="checkbox" checked />
          <span>Checkbox</span>
        </label>
        <label class="ct-radio">
          <input class="ct-radio__input" type="radio" name="tt-radio" checked />
          <span>Radio A</span>
        </label>
        <label class="ct-radio">
          <input class="ct-radio__input" type="radio" name="tt-radio" />
          <span>Radio B</span>
        </label>
      </div>
    </section>

    <section>
      <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin: 0 0 var(--space-3);">Switch</h3>
      <div style="display: flex; gap: var(--space-6); flex-wrap: wrap; align-items: center;">
        <label class="ct-switch">
          <input class="ct-switch__input" type="checkbox" role="switch" checked />
          <span>Default</span>
        </label>
        <label class="ct-switch ct-switch--sm">
          <input class="ct-switch__input" type="checkbox" role="switch" />
          <span>Small</span>
        </label>
      </div>
    </section>

    <section>
      <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin: 0 0 var(--space-3);">Slider</h3>
      <div style="max-width: 320px;">
        <div class="ct-slider">
          <input class="ct-slider__input" type="range" min="0" max="100" value="50" aria-label="Volume" />
        </div>
      </div>
    </section>

    <section>
      <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin: 0 0 var(--space-3);">Button (small)</h3>
      <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
        <button class="ct-button ct-button--sm">Small primary</button>
        <button class="ct-button ct-button--secondary ct-button--sm">Small secondary</button>
      </div>
    </section>

    <section>
      <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin: 0 0 var(--space-3);">Pagination</h3>
      <nav class="ct-pagination" aria-label="Touch target pagination">
        <ul class="ct-pagination__list">
          <li><a class="ct-pagination__link" href="#" aria-label="Previous">&laquo;</a></li>
          <li><a class="ct-pagination__link" href="#" aria-current="page">1</a></li>
          <li><a class="ct-pagination__link" href="#">2</a></li>
          <li><a class="ct-pagination__link" href="#">3</a></li>
          <li><a class="ct-pagination__link" href="#" aria-label="Next">&raquo;</a></li>
        </ul>
      </nav>
    </section>

    <section>
      <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin: 0 0 var(--space-3);">Chip</h3>
      <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
        <button class="ct-chip ct-chip--interactive ct-chip--info" type="button" aria-pressed="false">
          <span class="ct-chip__label">Info</span>
        </button>
        <button class="ct-chip ct-chip--interactive ct-chip--success" type="button" aria-pressed="true">
          <span class="ct-chip__label">Active</span>
        </button>
        <button class="ct-chip ct-chip--interactive" type="button">
          <span class="ct-chip__label">Default</span>
        </button>
      </div>
    </section>
  </div>`,
  play: async ({ canvasElement }) => {
    // Verify all interactive elements exist
    const checkbox = canvasElement.querySelector('.ct-check__input');
    expect(checkbox).toBeInTheDocument();

    const radios = canvasElement.querySelectorAll('.ct-radio__input');
    expect(radios).toHaveLength(2);

    const switches = canvasElement.querySelectorAll('.ct-switch__input');
    expect(switches).toHaveLength(2);

    const slider = canvasElement.querySelector('.ct-slider__input');
    expect(slider).toBeInTheDocument();

    const smallButtons = canvasElement.querySelectorAll('.ct-button--sm');
    expect(smallButtons).toHaveLength(2);

    const paginationLinks = canvasElement.querySelectorAll('.ct-pagination__link');
    expect(paginationLinks.length).toBeGreaterThanOrEqual(5);

    const chips = canvasElement.querySelectorAll('.ct-chip--interactive');
    expect(chips).toHaveLength(3);

    // Checkbox and radio have position: relative (needed for ::after touch area)
    expect(getComputedStyle(checkbox).position).toBe('relative');
    for (const radio of radios) {
      expect(getComputedStyle(radio).position).toBe('relative');
    }

    // Switch has position: relative (needed for ::before touch area)
    for (const sw of switches) {
      expect(getComputedStyle(sw).position).toBe('relative');
    }
  },
};
