import { expect, within } from 'storybook/test';

export default {
  title: 'Forms/Slider',
  parameters: {
    docs: {
      description: {
        component: 'Range slider component wrapping native `<input type="range">` with cross-browser styling. Supports single value, dual-thumb range, tick marks, and three sizes.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current value (0–100)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Slider size',
    },
    disabled: { control: 'boolean', description: 'Disabled state' },
    invalid: { control: 'boolean', description: 'Invalid state' },
    label: { control: 'text', description: 'Accessible label' },
  },
};

export const Playground = {
  args: {
    value: 50,
    size: 'md',
    disabled: false,
    invalid: false,
    label: 'Volume',
  },
  render: ({ value, size, disabled, invalid, label }) => {
    const sizeClass = size !== 'md' ? ` ct-slider--${size}` : '';
    const disabledAttr = disabled ? ' disabled' : '';
    const invalidAttr = invalid ? ' aria-invalid="true"' : '';
    return `
    <div style="max-width: 400px;">
      <div class="ct-field">
        <label class="ct-field__label" for="pg-slider">${label}</label>
        <div class="ct-slider${sizeClass}">
          <input class="ct-slider__input" id="pg-slider" type="range"
            min="0" max="100" value="${value}" style="--_value: ${value}"
            aria-label="${label}"${disabledAttr}${invalidAttr}
            oninput="this.style.setProperty('--_value', this.value); this.closest('.ct-field').querySelector('.ct-slider__value').textContent = this.value" />
          <span class="ct-slider__value">${value}</span>
        </div>
      </div>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const slider = canvasElement.querySelector('input[type="range"]');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-label');
  },
};

export const Default = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6); max-width: 400px;">
    <div class="ct-field">
      <label class="ct-field__label" for="volume">Volume</label>
      <div class="ct-slider">
        <input class="ct-slider__input" id="volume" type="range"
          min="0" max="100" value="60" style="--_value: 60"
          oninput="this.style.setProperty('--_value', this.value)" />
      </div>
    </div>

    <div class="ct-field">
      <label class="ct-field__label" for="brightness">Brightness</label>
      <div class="ct-slider">
        <span class="ct-slider__min">0</span>
        <input class="ct-slider__input" id="brightness" type="range"
          min="0" max="100" value="40" style="--_value: 40"
          oninput="this.style.setProperty('--_value', this.value); document.getElementById('brightness-val').textContent = this.value" />
        <span class="ct-slider__max">100</span>
      </div>
      <output class="ct-slider__value" id="brightness-val" for="brightness">40</output>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const sliders = canvasElement.querySelectorAll('input[type="range"]');
    expect(sliders).toHaveLength(2);

    for (const slider of sliders) {
      expect(slider).toHaveAttribute('min');
      expect(slider).toHaveAttribute('max');
      expect(slider).toHaveAttribute('value');
      expect(slider.id).toBeTruthy();
    }

    // Labels are associated via for/id
    const volumeLabel = canvasElement.querySelector('label[for="volume"]');
    expect(volumeLabel).toBeInTheDocument();
    expect(volumeLabel.textContent).toBe('Volume');

    // Min/max labels present on second slider
    const min = canvasElement.querySelector('.ct-slider__min');
    const max = canvasElement.querySelector('.ct-slider__max');
    expect(min).toBeInTheDocument();
    expect(max).toBeInTheDocument();
  },
};

export const Range = {
  render: () => `
  <div style="max-width: 400px;">
    <div class="ct-field">
      <span class="ct-field__label" id="price-label">Price range</span>
      <div class="ct-slider ct-slider--range" role="group" aria-labelledby="price-label" style="--_low: 25; --_high: 75;">
        <span class="ct-slider__min">$0</span>
        <div class="ct-slider__track">
          <input class="ct-slider__input" type="range"
            min="0" max="100" value="25"
            aria-label="Minimum price"
            oninput="this.closest('.ct-slider').style.setProperty('--_low', this.value)" />
          <input class="ct-slider__input" type="range"
            min="0" max="100" value="75"
            aria-label="Maximum price"
            oninput="this.closest('.ct-slider').style.setProperty('--_high', this.value)" />
        </div>
        <span class="ct-slider__max">$100</span>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvasElement.querySelector('[role="group"]');
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute('aria-labelledby', 'price-label');

    const sliders = canvas.getAllByRole('slider');
    expect(sliders).toHaveLength(2);

    // Each thumb has a distinct label
    expect(sliders[0]).toHaveAttribute('aria-label', 'Minimum price');
    expect(sliders[1]).toHaveAttribute('aria-label', 'Maximum price');

    // Range modifier class present
    expect(group.classList.contains('ct-slider--range')).toBe(true);

    // Min/max endpoint labels
    const min = canvasElement.querySelector('.ct-slider__min');
    const max = canvasElement.querySelector('.ct-slider__max');
    expect(min.textContent).toBe('$0');
    expect(max.textContent).toBe('$100');
  },
};

export const WithTicks = {
  render: () => `
  <div style="max-width: 400px;">
    <div class="ct-field">
      <label class="ct-field__label" for="rating">Rating</label>
      <div class="ct-slider ct-slider--ticks">
        <input class="ct-slider__input" id="rating" type="range"
          min="1" max="5" step="1" value="3" style="--_value: 50"
          aria-label="Rating"
          oninput="this.style.setProperty('--_value', ((this.value - this.min) / (this.max - this.min)) * 100)" />
        <div class="ct-slider__ticks">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('step', '1');
    expect(slider).toHaveAttribute('min', '1');
    expect(slider).toHaveAttribute('max', '5');

    // Ticks modifier class
    const wrapper = canvasElement.querySelector('.ct-slider--ticks');
    expect(wrapper).toBeInTheDocument();

    // Tick labels rendered
    const ticks = canvasElement.querySelectorAll('.ct-slider__ticks span');
    expect(ticks).toHaveLength(5);
  },
};

export const Sizes = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6); max-width: 400px;">
    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Small</p>
      <div class="ct-slider ct-slider--sm">
        <input class="ct-slider__input" type="range"
          min="0" max="100" value="40" style="--_value: 40"
          aria-label="Small slider" />
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Default (md)</p>
      <div class="ct-slider">
        <input class="ct-slider__input" type="range"
          min="0" max="100" value="60" style="--_value: 60"
          aria-label="Default slider" />
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Large</p>
      <div class="ct-slider ct-slider--lg">
        <input class="ct-slider__input" type="range"
          min="0" max="100" value="80" style="--_value: 80"
          aria-label="Large slider" />
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const sliders = canvasElement.querySelectorAll('input[type="range"]');
    expect(sliders).toHaveLength(3);

    // Each has unique aria-label
    const labels = [...sliders].map(s => s.getAttribute('aria-label'));
    expect(new Set(labels).size).toBe(3);

    // Size modifier classes
    expect(canvasElement.querySelector('.ct-slider--sm')).toBeInTheDocument();
    expect(canvasElement.querySelector('.ct-slider--lg')).toBeInTheDocument();

    // Each slider has required attributes
    for (const slider of sliders) {
      expect(slider).toHaveAttribute('min', '0');
      expect(slider).toHaveAttribute('max', '100');
    }
  },
};

export const States = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6); max-width: 400px;">
    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Default</p>
      <div class="ct-slider">
        <input class="ct-slider__input" type="range"
          min="0" max="100" value="50" style="--_value: 50"
          aria-label="Default state" />
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Disabled</p>
      <div class="ct-slider">
        <input class="ct-slider__input" type="range"
          min="0" max="100" value="30" style="--_value: 30"
          aria-label="Disabled slider" disabled />
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Invalid</p>
      <div class="ct-slider">
        <input class="ct-slider__input" type="range"
          min="0" max="100" value="90" style="--_value: 90"
          aria-label="Invalid slider" aria-invalid="true" />
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const sliders = canvasElement.querySelectorAll('input[type="range"]');
    expect(sliders).toHaveLength(3);

    // Default: enabled, valid
    expect(sliders[0]).not.toBeDisabled();
    expect(sliders[0]).not.toHaveAttribute('aria-invalid');

    // Disabled
    expect(sliders[1]).toBeDisabled();

    // Invalid
    expect(sliders[2]).toHaveAttribute('aria-invalid', 'true');

    // All have labels
    for (const slider of sliders) {
      expect(slider).toHaveAttribute('aria-label');
      expect(slider.getAttribute('aria-label').length).toBeGreaterThan(3);
    }
  },
};
