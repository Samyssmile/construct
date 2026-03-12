import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Forms/Selection Controls',
  parameters: {
    docs: {
      description: {
        component: 'Checkbox, radio button, and switch components with support for checked, unchecked, indeterminate, and disabled states. All controls use native `<input>` elements for built-in accessibility.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['checkbox', 'radio', 'switch'],
      description: 'Control type',
    },
    label: { control: 'text', description: 'Label text' },
    checked: { control: 'boolean', description: 'Checked/on state' },
    disabled: { control: 'boolean', description: 'Disabled state' },
  },
};

export const Playground = {
  args: {
    type: 'checkbox',
    label: 'Remember me',
    checked: false,
    disabled: false,
  },
  render: ({ type, label, checked, disabled }) => {
    const checkedAttr = checked ? ' checked' : '';
    const disabledAttr = disabled ? ' disabled' : '';
    if (type === 'radio') {
      return `
      <label class="ct-radio">
        <input class="ct-radio__input" type="radio" name="playground-group"${checkedAttr}${disabledAttr} />
        <span class="ct-radio__label">${label}</span>
      </label>`;
    }
    if (type === 'switch') {
      return `
      <label class="ct-switch">
        <input class="ct-switch__input" type="checkbox" role="switch"${checkedAttr}${disabledAttr} />
        <span class="ct-switch__label">${label}</span>
      </label>`;
    }
    return `
    <label class="ct-check">
      <input class="ct-check__input" type="checkbox"${checkedAttr}${disabledAttr} />
      <span class="ct-check__label">${label}</span>
    </label>`;
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    expect(input).toBeInTheDocument();
  },
};

export const Checkbox = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-3);">
    <label class="ct-check">
      <input class="ct-check__input" type="checkbox" checked />
      <span class="ct-check__label">Remember me</span>
    </label>
    <label class="ct-check">
      <input class="ct-check__input" type="checkbox" />
      <span class="ct-check__label">Send weekly reports</span>
    </label>
    <label class="ct-check">
      <input class="ct-check__input" type="checkbox" disabled />
      <span class="ct-check__label">Disabled</span>
    </label>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByRole('checkbox');

    expect(checkboxes).toHaveLength(3);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeDisabled();

    // Labels are properly associated via wrapping <label>
    expect(canvas.getByLabelText('Remember me')).toBe(checkboxes[0]);
    expect(canvas.getByLabelText('Send weekly reports')).toBe(checkboxes[1]);
    expect(canvas.getByLabelText('Disabled')).toBe(checkboxes[2]);

    // Toggle unchecked → checked
    await userEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();

    // Toggle checked → unchecked
    await userEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  },
};

export const Radio = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-3);">
    <label class="ct-radio">
      <input class="ct-radio__input" type="radio" name="plan" checked />
      <span class="ct-radio__label">Standard</span>
    </label>
    <label class="ct-radio">
      <input class="ct-radio__input" type="radio" name="plan" />
      <span class="ct-radio__label">Premium</span>
    </label>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole('radio');

    expect(radios).toHaveLength(2);
    expect(canvas.getByLabelText('Standard')).toBeChecked();
    expect(canvas.getByLabelText('Premium')).not.toBeChecked();

    // Selecting another radio deselects the first (mutual exclusivity)
    await userEvent.click(radios[1]);
    expect(radios[1]).toBeChecked();
    expect(radios[0]).not.toBeChecked();
  },
};

export const Switch = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-3);">
    <label class="ct-switch">
      <input class="ct-switch__input" type="checkbox" role="switch" checked />
      <span class="ct-switch__label">Auto renew</span>
    </label>
    <label class="ct-switch">
      <input class="ct-switch__input" type="checkbox" role="switch" />
      <span class="ct-switch__label">Weekly summary</span>
    </label>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switches = canvas.getAllByRole('switch');

    expect(switches).toHaveLength(2);
    expect(canvas.getByLabelText('Auto renew')).toBeChecked();
    expect(canvas.getByLabelText('Weekly summary')).not.toBeChecked();

    // Toggle switch off
    await userEvent.click(switches[0]);
    expect(switches[0]).not.toBeChecked();

    // Toggle switch on
    await userEvent.click(switches[1]);
    expect(switches[1]).toBeChecked();
  },
};
