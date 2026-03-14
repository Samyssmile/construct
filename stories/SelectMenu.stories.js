import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Forms/Select Menu',
  parameters: {
    docs: {
      description: {
        component:
          'Custom dropdown select component with styled options, groups, separators, checkmark indicators, ' +
          'and keyboard navigation. Uses `role="listbox"` with `aria-expanded`, `aria-activedescendant`, ' +
          'and `aria-selected` for full accessibility. The native `.ct-select` remains available as a fallback.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Control size',
    },
    open: {
      control: 'boolean',
      description: 'Whether the dropdown is open',
    },
    invalid: {
      control: 'boolean',
      description: 'Error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
};

const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

const CHEVRON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

const sizeClass = (size) => {
  if (size === 'sm') return ' ct-select-menu--sm';
  if (size === 'lg') return ' ct-select-menu--lg';
  return '';
};

/**
 * Interactive playground with all controls.
 */
export const Playground = {
  args: {
    size: 'md',
    open: true,
    invalid: false,
    disabled: false,
  },
  parameters: {
    docs: { story: { inline: true, height: 400 } },
  },
  render: ({ size, open, invalid, disabled }) => `
    <div style="min-height: 360px; padding: 24px; max-width: 320px;">
      <div class="ct-field${invalid ? ' ct-field--error' : ''}">
        <label class="ct-field__label" id="pg-select-label">Favorite fruit</label>
        <div class="ct-select-menu${sizeClass(size)}"
             data-state="${open && !disabled ? 'open' : 'closed'}">
          <button class="ct-select-menu__trigger"
                  role="combobox"
                  aria-expanded="${open && !disabled}"
                  aria-haspopup="listbox"
                  aria-controls="pg-select-listbox"
                  aria-labelledby="pg-select-label"
                  ${invalid ? 'aria-invalid="true"' : ''}
                  ${disabled ? 'aria-disabled="true"' : ''}>
            <span class="ct-select-menu__value">Cherry</span>
            <span class="ct-select-menu__icon">${CHEVRON_SVG}</span>
          </button>
          <div class="ct-select-menu__content"
               role="listbox"
               id="pg-select-listbox"
               aria-labelledby="pg-select-label"
               tabindex="-1">
            <div class="ct-select-menu__option" role="option" id="pg-opt-apple" aria-selected="false">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-label">Apple</span>
            </div>
            <div class="ct-select-menu__option" role="option" id="pg-opt-banana" aria-selected="false">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-label">Banana</span>
            </div>
            <div class="ct-select-menu__option" role="option" id="pg-opt-cherry" aria-selected="true" data-highlighted>
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-label">Cherry</span>
            </div>
            <div class="ct-select-menu__option" role="option" id="pg-opt-dragon" aria-selected="false">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-label">Dragon Fruit</span>
            </div>
            <div class="ct-select-menu__option" role="option" id="pg-opt-fig" aria-selected="false" aria-disabled="true">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-label">Fig (out of stock)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.ct-select-menu__trigger');
    expect(trigger).toHaveAttribute('role', 'combobox');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-controls', 'pg-select-listbox');

    const listbox = canvasElement.querySelector('[role="listbox"]');
    expect(listbox).not.toBeNull();

    const options = canvasElement.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThanOrEqual(4);
  },
};

/**
 * Full Select Menu with trigger, content, options, and keyboard navigation.
 */
export const SelectMenu = {
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: true, height: 460 } },
  },
  render: () => `
  <div style="min-height: 460px; padding: 24px; max-width: 320px;">
    <div class="ct-field">
      <label class="ct-field__label" id="sm-label">Country</label>
      <div class="ct-select-menu" data-state="open">
        <button class="ct-select-menu__trigger"
                role="combobox"
                aria-expanded="true"
                aria-haspopup="listbox"
                aria-controls="sm-listbox"
                aria-labelledby="sm-label"
                aria-activedescendant="sm-opt-de">
          <span class="ct-select-menu__value">Germany</span>
          <span class="ct-select-menu__icon">${CHEVRON_SVG}</span>
        </button>
        <div class="ct-select-menu__content"
             role="listbox"
             id="sm-listbox"
             aria-labelledby="sm-label"
             tabindex="-1">
          <div class="ct-select-menu__option" role="option" id="sm-opt-at" aria-selected="false">
            <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
            <span class="ct-select-menu__option-label">Austria</span>
          </div>
          <div class="ct-select-menu__option" role="option" id="sm-opt-de" aria-selected="true" data-highlighted>
            <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
            <span class="ct-select-menu__option-label">Germany</span>
          </div>
          <div class="ct-select-menu__option" role="option" id="sm-opt-ch" aria-selected="false">
            <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
            <span class="ct-select-menu__option-label">Switzerland</span>
          </div>
          <div class="ct-select-menu__separator" role="none"></div>
          <div class="ct-select-menu__option" role="option" id="sm-opt-fr" aria-selected="false">
            <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
            <span class="ct-select-menu__option-label">France</span>
          </div>
          <div class="ct-select-menu__option" role="option" id="sm-opt-nl" aria-selected="false">
            <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
            <span class="ct-select-menu__option-label">Netherlands</span>
          </div>
          <div class="ct-select-menu__option" role="option" id="sm-opt-uk" aria-selected="false">
            <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
            <span class="ct-select-menu__option-label">United Kingdom</span>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Trigger has correct ARIA attributes
    const trigger = canvasElement.querySelector('.ct-select-menu__trigger');
    expect(trigger).toHaveAttribute('role', 'combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-controls', 'sm-listbox');
    expect(trigger).toHaveAttribute('aria-activedescendant', 'sm-opt-de');

    // Trigger displays current value
    const value = trigger.querySelector('.ct-select-menu__value');
    expect(value).toHaveTextContent('Germany');

    // Listbox has role and label
    const listbox = canvasElement.querySelector('[role="listbox"]');
    expect(listbox).not.toBeNull();
    expect(listbox).toHaveAttribute('aria-labelledby', 'sm-label');

    // Options have correct roles and IDs
    const options = canvasElement.querySelectorAll('[role="option"]');
    expect(options.length).toBe(6);
    for (const opt of options) {
      expect(opt.id).toBeTruthy();
      expect(opt).toHaveAttribute('aria-selected');
    }

    // Selected option has checkmark visible
    const selected = canvasElement.querySelector('[aria-selected="true"]');
    expect(selected).toHaveTextContent('Germany');
    const check = selected.querySelector('.ct-select-menu__option-check');
    const checkStyle = window.getComputedStyle(check);
    expect(checkStyle.opacity).toBe('1');

    // Non-selected options have hidden checkmarks
    const unselected = canvasElement.querySelector('[aria-selected="false"] .ct-select-menu__option-check');
    const unselectedStyle = window.getComputedStyle(unselected);
    expect(unselectedStyle.opacity).toBe('0');

    // Highlighted option has visible outline
    const highlighted = canvasElement.querySelector('[data-highlighted]');
    expect(highlighted).not.toBeNull();
    const hlStyle = window.getComputedStyle(highlighted);
    expect(hlStyle.outlineStyle).not.toBe('none');

    // Separator exists between groups
    const separator = canvasElement.querySelector('.ct-select-menu__separator');
    expect(separator).not.toBeNull();
    expect(separator).toHaveAttribute('role', 'none');
  },
};

/**
 * Grouped options with labels.
 */
export const WithGroups = {
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: true, height: 500 } },
  },
  render: () => `
  <div style="min-height: 500px; padding: 24px; max-width: 320px;">
    <div class="ct-field">
      <label class="ct-field__label" id="grp-label">Framework</label>
      <div class="ct-select-menu" data-state="open">
        <button class="ct-select-menu__trigger"
                role="combobox"
                aria-expanded="true"
                aria-haspopup="listbox"
                aria-controls="grp-listbox"
                aria-labelledby="grp-label">
          <span class="ct-select-menu__value" data-placeholder>Select a framework</span>
          <span class="ct-select-menu__icon">${CHEVRON_SVG}</span>
        </button>
        <div class="ct-select-menu__content"
             role="listbox"
             id="grp-listbox"
             aria-labelledby="grp-label"
             tabindex="-1">
          <div class="ct-select-menu__group" role="group" aria-labelledby="grp-frontend-label">
            <div class="ct-select-menu__group-label" id="grp-frontend-label">Frontend</div>
            <div class="ct-select-menu__option" role="option" aria-selected="false">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-label">React</span>
            </div>
            <div class="ct-select-menu__option" role="option" aria-selected="false">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-label">Vue</span>
            </div>
            <div class="ct-select-menu__option" role="option" aria-selected="false">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-label">Angular</span>
            </div>
          </div>
          <div class="ct-select-menu__group" role="group" aria-labelledby="grp-backend-label">
            <div class="ct-select-menu__group-label" id="grp-backend-label">Backend</div>
            <div class="ct-select-menu__option" role="option" aria-selected="false">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-label">Express</span>
            </div>
            <div class="ct-select-menu__option" role="option" aria-selected="false">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-label">Fastify</span>
            </div>
            <div class="ct-select-menu__option" role="option" aria-selected="false">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-label">Hono</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Groups exist with labels
    const groups = canvasElement.querySelectorAll('.ct-select-menu__group');
    expect(groups).toHaveLength(2);

    // Groups have role="group" and aria-labelledby
    for (const group of groups) {
      expect(group).toHaveAttribute('role', 'group');
      expect(group).toHaveAttribute('aria-labelledby');
    }

    // Group labels are visible
    const labels = canvasElement.querySelectorAll('.ct-select-menu__group-label');
    expect(labels).toHaveLength(2);
    expect(labels[0]).toHaveTextContent('Frontend');
    expect(labels[1]).toHaveTextContent('Backend');

    // Groups have visual separator between them (border-top via CSS)
    const secondGroup = groups[1];
    const groupStyle = window.getComputedStyle(secondGroup);
    expect(groupStyle.borderTopStyle).not.toBe('none');

    // Placeholder value styling
    const placeholder = canvasElement.querySelector('[data-placeholder]');
    expect(placeholder).not.toBeNull();
    const phStyle = window.getComputedStyle(placeholder);
    // Placeholder should use muted text color
    expect(phStyle.color).not.toBe(window.getComputedStyle(canvasElement.querySelector('.ct-select-menu__trigger')).color);
  },
};

/**
 * Options with icons.
 */
export const WithIcons = {
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: true, height: 380 } },
  },
  render: () => {
    const globeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
    const mailSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
    const phoneSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

    return `
    <div style="min-height: 340px; padding: 24px; max-width: 320px;">
      <div class="ct-field">
        <label class="ct-field__label" id="icon-label">Contact method</label>
        <div class="ct-select-menu" data-state="open">
          <button class="ct-select-menu__trigger"
                  role="combobox"
                  aria-expanded="true"
                  aria-haspopup="listbox"
                  aria-controls="icon-listbox"
                  aria-labelledby="icon-label">
            <span class="ct-select-menu__value">Email</span>
            <span class="ct-select-menu__icon">${CHEVRON_SVG}</span>
          </button>
          <div class="ct-select-menu__content"
               role="listbox"
               id="icon-listbox"
               aria-labelledby="icon-label"
               tabindex="-1">
            <div class="ct-select-menu__option" role="option" aria-selected="false">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-icon">${globeSvg}</span>
              <span class="ct-select-menu__option-label">Website</span>
            </div>
            <div class="ct-select-menu__option" role="option" aria-selected="true">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-icon">${mailSvg}</span>
              <span class="ct-select-menu__option-label">Email</span>
            </div>
            <div class="ct-select-menu__option" role="option" aria-selected="false">
              <span class="ct-select-menu__option-check">${CHECK_SVG}</span>
              <span class="ct-select-menu__option-icon">${phoneSvg}</span>
              <span class="ct-select-menu__option-label">Phone</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    // Options with icons render correctly
    const icons = canvasElement.querySelectorAll('.ct-select-menu__option-icon');
    expect(icons).toHaveLength(3);

    // Each icon contains an SVG
    for (const icon of icons) {
      expect(icon.querySelector('svg')).not.toBeNull();
    }

    // Selected option checkmark is visible
    const selected = canvasElement.querySelector('[aria-selected="true"]');
    expect(selected).toHaveTextContent('Email');
    const check = selected.querySelector('.ct-select-menu__option-check');
    expect(window.getComputedStyle(check).opacity).toBe('1');
  },
};

/**
 * Size variants side by side.
 */
export const Sizes = {
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: true, height: 200 } },
  },
  render: () => `
  <div style="padding: 24px; display: flex; align-items: flex-start; gap: 24px; flex-wrap: wrap;">
    <div style="min-width: 200px;">
      <div class="ct-field">
        <label class="ct-field__label" id="sm-size-label">Small</label>
        <div class="ct-select-menu ct-select-menu--sm" data-state="closed">
          <button class="ct-select-menu__trigger"
                  role="combobox"
                  aria-expanded="false"
                  aria-haspopup="listbox"
                  aria-labelledby="sm-size-label">
            <span class="ct-select-menu__value">Option A</span>
            <span class="ct-select-menu__icon">${CHEVRON_SVG}</span>
          </button>
        </div>
      </div>
    </div>
    <div style="min-width: 200px;">
      <div class="ct-field">
        <label class="ct-field__label" id="md-size-label">Medium (default)</label>
        <div class="ct-select-menu" data-state="closed">
          <button class="ct-select-menu__trigger"
                  role="combobox"
                  aria-expanded="false"
                  aria-haspopup="listbox"
                  aria-labelledby="md-size-label">
            <span class="ct-select-menu__value">Option B</span>
            <span class="ct-select-menu__icon">${CHEVRON_SVG}</span>
          </button>
        </div>
      </div>
    </div>
    <div style="min-width: 200px;">
      <div class="ct-field">
        <label class="ct-field__label" id="lg-size-label">Large</label>
        <div class="ct-select-menu ct-select-menu--lg" data-state="closed">
          <button class="ct-select-menu__trigger"
                  role="combobox"
                  aria-expanded="false"
                  aria-haspopup="listbox"
                  aria-labelledby="lg-size-label">
            <span class="ct-select-menu__value">Option C</span>
            <span class="ct-select-menu__icon">${CHEVRON_SVG}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const triggers = canvasElement.querySelectorAll('.ct-select-menu__trigger');
    expect(triggers).toHaveLength(3);

    // Heights differ between sizes
    const smHeight = triggers[0].getBoundingClientRect().height;
    const mdHeight = triggers[1].getBoundingClientRect().height;
    const lgHeight = triggers[2].getBoundingClientRect().height;

    expect(smHeight).toBeLessThan(mdHeight);
    expect(mdHeight).toBeLessThan(lgHeight);
  },
};
