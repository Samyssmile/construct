import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Components/Actions/Button',
  parameters: {
    docs: {
      description: {
        component: 'Accessible button component supporting primary, secondary, outline, ghost, accent, danger, and link variants. Supports icon-only buttons, size variants (sm, md, lg), and full keyboard navigation.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Button text content' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'accent', 'danger', 'link'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    disabled: { control: 'boolean', description: 'Disabled state' },
  },
};

export const Playground = {
  args: {
    label: 'Click me',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
  render: ({ label, variant, size, disabled }) => {
    const variantClass = variant !== 'primary' ? ` ct-button--${variant}` : '';
    const sizeClass = size !== 'md' ? ` ct-button--${size}` : '';
    return `<button class="ct-button${variantClass}${sizeClass}"${disabled ? ' disabled' : ''}>${label}</button>`;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    expect(button).toBeInTheDocument();
  },
};

export const Variants = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
    <div class="ct-cluster">
      <button class="ct-button">Primary</button>
      <button class="ct-button ct-button--secondary">Secondary</button>
      <button class="ct-button ct-button--outline">Outline</button>
      <button class="ct-button ct-button--ghost">Ghost</button>
      <button class="ct-button ct-button--accent">Accent</button>
      <button class="ct-button ct-button--danger">Danger</button>
      <button class="ct-button ct-button--link">Link</button>
    </div>
    <div class="ct-cluster">
      <button class="ct-button ct-button--sm">Small</button>
      <button class="ct-button">Medium</button>
      <button class="ct-button ct-button--lg">Large</button>
      <button class="ct-button" disabled>Disabled</button>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const allButtons = canvas.getAllByRole('button');
    expect(allButtons).toHaveLength(11);

    // Disabled button is not interactive
    const disabledBtn = canvas.getByRole('button', { name: 'Disabled' });
    expect(disabledBtn).toBeDisabled();
    expect(disabledBtn).toHaveAttribute('disabled');

    // Enabled button receives focus on click
    const primaryBtn = canvas.getByRole('button', { name: 'Primary' });
    await userEvent.click(primaryBtn);
    expect(primaryBtn).toHaveFocus();

    // Keyboard activation: Enter triggers click on focused button
    const secondaryBtn = canvas.getByRole('button', { name: 'Secondary' });
    secondaryBtn.focus();
    let clicked = false;
    secondaryBtn.addEventListener('click', () => { clicked = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(clicked).toBe(true);
  },
};

export const WithIcons = {
  render: () => `
  <div class="ct-cluster">
    <button class="ct-button">
      <span class="ct-button__icon" aria-hidden="true">+</span>
      Add item
    </button>
    <button class="ct-button ct-button--secondary">
      <span class="ct-button__icon" aria-hidden="true">?</span>
      Help
    </button>
    <button class="ct-button ct-button--icon" aria-label="Settings">
      <span class="ct-button__icon" aria-hidden="true">*</span>
    </button>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Icon-only button has accessible name via aria-label
    const iconBtn = canvas.getByRole('button', { name: 'Settings' });
    expect(iconBtn).toHaveAttribute('aria-label', 'Settings');

    // Decorative icons are hidden from assistive technology
    const hiddenIcons = canvasElement.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenIcons).toHaveLength(3);

    // Buttons with visible text have correct accessible names
    expect(canvas.getByRole('button', { name: /Add item/ })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: /Help/ })).toBeInTheDocument();

    // Icon button is focusable
    await userEvent.click(iconBtn);
    expect(iconBtn).toHaveFocus();
  },
};

export const ComposedCustomIcon = {
  parameters: {
    docs: {
      description: {
        story: 'Custom icons composed into the `.ct-button__icon` slot — as a `.ct-icon` (possibly wrapped by a framework component host) or a bare `<svg>` — adopt the slot’s size via `--ct-button-icon-size` instead of overflowing. Context overrides like `.ct-modal__header` flow through to the composed content.',
      },
    },
  },
  render: () => `
  <div class="ct-cluster" style="align-items: center;">
    <button class="ct-button ct-button--secondary">
      <span class="ct-button__icon" aria-hidden="true">
        <span style="display: inline-flex; align-items: center; justify-content: center;">
          <span class="ct-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </span>
        </span>
      </span>
      Copy ID
    </button>
    <button class="ct-button ct-button--ghost">
      <span class="ct-button__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </span>
      Search
    </button>
    <div class="ct-modal__header" style="border: none; padding: 0;">
      <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Close">
        <span class="ct-button__icon" aria-hidden="true">
          <span class="ct-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </span>
        </span>
      </button>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const slots = canvasElement.querySelectorAll('.ct-button__icon');
    expect(slots).toHaveLength(3);

    for (const slot of slots) {
      const composed = slot.querySelector('.ct-icon, svg');
      const slotBox = slot.getBoundingClientRect();
      const composedBox = composed.getBoundingClientRect();

      // The composed icon adopts the slot box instead of keeping --icon-md.
      expect(composedBox.width).toBeLessThanOrEqual(slotBox.width + 0.5);
      expect(composedBox.height).toBeLessThanOrEqual(slotBox.height + 0.5);

      // Fully contained: nothing bleeds toward the button label.
      expect(composedBox.right).toBeLessThanOrEqual(slotBox.right + 0.5);
      expect(composedBox.left).toBeGreaterThanOrEqual(slotBox.left - 0.5);
    }

    // Default slot is --icon-sm (16px)…
    const defaultSlot = slots[0].getBoundingClientRect();
    expect(defaultSlot.width).toBeCloseTo(16, 0);

    // …while the modal-header context override (--icon-lg, 24px) flows
    // through to the composed icon via --ct-button-icon-size.
    const modalIcon = slots[2].querySelector('.ct-icon').getBoundingClientRect();
    expect(modalIcon.width).toBeCloseTo(24, 0);
  },
};

export const Loading = {
  parameters: {
    docs: {
      description: {
        story:
          'A loading button keeps its label in layout for stable width and retains that label as its accessible name. Use `aria-busy="true"`, `data-loading="true"`, and native `disabled` together. The loader is decorative.',
      },
    },
  },
  render: () => `
  <div class="ct-cluster">
    <button class="ct-button" type="button">
      <span class="ct-button__content">Save changes</span>
    </button>
    <button class="ct-button" type="button" aria-busy="true" data-loading="true" disabled>
      <span class="ct-button__content">Save changes</span>
      <span class="ct-button__loader" aria-hidden="true"></span>
    </button>
  </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [readyButton, loadingButton] = canvas.getAllByRole('button', { name: 'Save changes' });

    expect(loadingButton).toHaveAttribute('aria-busy', 'true');
    expect(loadingButton).toHaveAttribute('data-loading', 'true');
    expect(loadingButton).toBeDisabled();
    expect(loadingButton.querySelector('.ct-button__loader')).toHaveAttribute('aria-hidden', 'true');
    expect(getComputedStyle(loadingButton.querySelector('.ct-button__content')).opacity).toBe('0');
    expect(getComputedStyle(loadingButton.querySelector('.ct-button__loader')).opacity).toBe('1');
    expect(Math.abs(loadingButton.getBoundingClientRect().width - readyButton.getBoundingClientRect().width)).toBeLessThan(1);

    let activations = 0;
    loadingButton.addEventListener('click', () => { activations += 1; });
    loadingButton.click();
    expect(activations).toBe(0);
  },
};

export const StateThemeMatrix = {
  name: 'States Across Themes',
  parameters: {
    docs: {
      description: {
        story: 'Ready, busy, disabled, and danger states rendered against every built-in theme.',
      },
    },
  },
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
    ${['light', 'dark', 'high-contrast'].map(theme => `
      <section data-theme="${theme}" style="padding: var(--space-5); background: var(--color-bg-canvas); color: var(--color-text-primary); border: var(--border-thin) solid var(--color-border-default); border-radius: var(--radius-md);">
        <h3 style="margin: 0 0 var(--space-4); font-size: var(--font-size-sm);">${theme}</h3>
        <div class="ct-cluster">
          <button class="ct-button" type="button">Ready</button>
          <button class="ct-button" type="button" aria-busy="true" data-loading="true" disabled>
            <span class="ct-button__content">Saving</span>
            <span class="ct-button__loader" aria-hidden="true"></span>
          </button>
          <button class="ct-button ct-button--secondary" type="button" disabled>Disabled</button>
          <button class="ct-button ct-button--danger" type="button">Danger</button>
        </div>
      </section>`).join('')}
  </div>`,
  play: async ({ canvasElement }) => {
    const themedSections = canvasElement.querySelectorAll('[data-theme]');
    expect(themedSections).toHaveLength(3);

    for (const section of themedSections) {
      const buttons = section.querySelectorAll('.ct-button');
      expect(buttons).toHaveLength(4);
      expect(getComputedStyle(buttons[0]).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(buttons[1]).toHaveAttribute('aria-busy', 'true');
      expect(buttons[2]).toBeDisabled();
    }
  },
};
