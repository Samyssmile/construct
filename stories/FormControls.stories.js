import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Forms/Form Controls',
  argTypes: {
    label: { control: 'text', description: 'Field label' },
    placeholder: { control: 'text', description: 'Input placeholder text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'search', 'password', 'tel'],
      description: 'Input type',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Control size',
    },
    invalid: { control: 'boolean', description: 'Shows error/invalid state' },
    hint: { control: 'text', description: 'Helper text below the field' },
  },
};

export const Playground = {
  args: {
    label: 'Email',
    placeholder: 'name@company.com',
    type: 'email',
    size: 'md',
    invalid: false,
    hint: 'We will not share this.',
  },
  render: ({ label, placeholder, type, size, invalid, hint }) => {
    const sizeClass = size !== 'md' ? ` ct-control--${size}` : '';
    const fieldClass = invalid ? ' ct-field--error' : '';
    const inputId = 'field-playground';
    return `
    <div class="ct-field${fieldClass}" style="max-width: 360px;">
      <label class="ct-field__label" for="${inputId}">${label}</label>
      <input class="ct-input${sizeClass}" id="${inputId}" type="${type}" placeholder="${placeholder}"${invalid ? ' aria-invalid="true"' : ''} />
      ${invalid
        ? '<div class="ct-field__error">This field is required.</div>'
        : hint ? `<div class="ct-field__hint">${hint}</div>` : ''}
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector('.ct-input');
    expect(input).toBeInTheDocument();
  },
};

export const Fields = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6); max-width: 420px;">
    <div class="ct-field">
      <label class="ct-field__label" for="email">Email</label>
      <input class="ct-input" id="email" type="email" placeholder="name@company.com" />
      <div class="ct-field__hint">We will not share this.</div>
    </div>

    <div class="ct-field">
      <label class="ct-field__label" for="search">Search</label>
      <div class="ct-input-wrap">
        <span class="ct-input__icon" aria-hidden="true">?</span>
        <input class="ct-input ct-input--with-icon" id="search" type="search" />
      </div>
    </div>

    <div class="ct-field">
      <label class="ct-field__label" for="role">Role</label>
      <div class="ct-select-wrap">
        <select class="ct-select" id="role">
          <option>Designer</option>
          <option>Engineer</option>
          <option>Manager</option>
        </select>
      </div>
    </div>

    <div class="ct-field">
      <label class="ct-field__label" for="notes">Notes</label>
      <textarea class="ct-textarea" id="notes" placeholder="Add context..."></textarea>
    </div>

    <div class="ct-field ct-field--error">
      <label class="ct-field__label" for="name">Name</label>
      <input class="ct-input" id="name" aria-invalid="true" />
      <div class="ct-field__error">Name is required.</div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Label association via for/id
    const emailInput = canvas.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');

    // Type in email input
    await userEvent.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');

    // Search input with icon hidden from AT
    const searchInput = canvas.getByLabelText('Search');
    await userEvent.type(searchInput, 'query');
    expect(searchInput).toHaveValue('query');
    expect(canvasElement.querySelector('.ct-input__icon[aria-hidden="true"]')).toBeInTheDocument();

    // Select interaction
    const roleSelect = canvas.getByLabelText('Role');
    await userEvent.selectOptions(roleSelect, 'Engineer');
    expect(roleSelect).toHaveValue('Engineer');

    // Textarea
    const notesTextarea = canvas.getByLabelText('Notes');
    await userEvent.type(notesTextarea, 'Important context');
    expect(notesTextarea).toHaveValue('Important context');

    // Validation: error field has aria-invalid
    const nameInput = canvas.getByLabelText('Name');
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');

    // Error and hint messages are visible
    expect(canvas.getByText('Name is required.')).toBeInTheDocument();
    expect(canvas.getByText('We will not share this.')).toBeInTheDocument();
  },
};

export const Sizes = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4); max-width: 360px;">
    <input class="ct-input ct-control--sm" placeholder="Small" />
    <input class="ct-input" placeholder="Medium" />
    <input class="ct-input ct-control--lg" placeholder="Large" />
  </div>
`,
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('.ct-input');
    expect(inputs).toHaveLength(3);

    // Type in each sized input and verify value
    await userEvent.type(inputs[0], 'small');
    expect(inputs[0]).toHaveValue('small');

    await userEvent.type(inputs[1], 'medium');
    expect(inputs[1]).toHaveValue('medium');

    await userEvent.type(inputs[2], 'large');
    expect(inputs[2]).toHaveValue('large');
  },
};
