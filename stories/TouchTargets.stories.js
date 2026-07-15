import { expect } from 'storybook/test';

export default {
  title: 'Components/Accessibility/Touch Targets',
  parameters: {
    docs: {
      description: {
        component:
          'Construct applies a 44×44px policy to covered compact controls when ' +
          '`pointer: coarse` matches. This exceeds the WCAG 2.2 AA size threshold in SC 2.5.8; ' +
          'SC 2.5.5 is the AAA enhanced target criterion. The checks cover default and small ' +
          'buttons, checkbox and radio inputs, default and small switches, sliders, pagination ' +
          'links, and interactive chips. Construct uses control tokens and invisible pseudo-element ' +
          'hit areas so fine-pointer visual sizes remain unchanged.',
      },
    },
  },
};

export const Overview = {
  parameters: {
    docs: {
      description: {
        story:
          'The controls covered by Construct\'s automated target contract, side-by-side. When ' +
          '`@media (pointer: coarse)` matches, every listed interaction area measures at least 44×44px.',
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
      <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin: 0 0 var(--space-3);">Button (default and small)</h3>
      <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
        <button class="ct-button">Default primary</button>
        <button class="ct-button ct-button--secondary">Default secondary</button>
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
    const effectiveTargetSize = (element, pseudo = null) => {
      const rect = element.getBoundingClientRect();
      if (!pseudo) return { width: rect.width, height: rect.height };

      const style = getComputedStyle(element, pseudo);
      const inset = side => Number.parseFloat(style[side]) || 0;
      return {
        width: rect.width - inset('left') - inset('right'),
        height: rect.height - inset('top') - inset('bottom'),
      };
    };

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

    const defaultButtons = [...canvasElement.querySelectorAll('.ct-button:not(.ct-button--sm)')];
    expect(defaultButtons).toHaveLength(2);

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

    // The dedicated Playwright touch project activates this branch with
    // `hasTouch: true`; fine-pointer Storybook runs still verify structure.
    if (matchMedia('(pointer: coarse)').matches) {
      const targets = [
        ...defaultButtons.map(element => ({ element })),
        ...[...smallButtons].map(element => ({ element })),
        ...[...paginationLinks].map(element => ({ element })),
        ...[...chips].map(element => ({ element })),
        { element: slider },
        { element: checkbox, pseudo: '::after' },
        ...[...radios].map(element => ({ element, pseudo: '::after' })),
        ...[...switches].map(element => ({ element, pseudo: '::before' })),
      ];

      for (const target of targets) {
        const size = effectiveTargetSize(target.element, target.pseudo);
        expect(size.width).toBeGreaterThanOrEqual(44);
        expect(size.height).toBeGreaterThanOrEqual(44);
      }

      canvasElement.dataset.coarseTargetsVerified = 'true';
    }
  },
};
