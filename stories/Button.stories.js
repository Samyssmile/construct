import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Forms/Button',
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
