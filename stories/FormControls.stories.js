import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Forms/Form Controls',
  parameters: {
    docs: {
      description: {
        component: 'Form field components including text inputs, selects, and textareas with labels, hint text, and validation error states. Supports input groups with prefix/suffix addons, required field indicators, character counters, and proper ARIA linking via aria-describedby.',
      },
    },
  },
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
    const hintId = 'field-playground-hint';
    const errorId = 'field-playground-error';
    const describedBy = invalid ? errorId : hint ? hintId : '';
    return `
    <div class="ct-field${fieldClass}" style="max-width: 360px;">
      <label class="ct-field__label" for="${inputId}">${label}</label>
      <input class="ct-input${sizeClass}" id="${inputId}" type="${type}" placeholder="${placeholder}"${invalid ? ' aria-invalid="true"' : ''}${describedBy ? ` aria-describedby="${describedBy}"` : ''} />
      ${invalid
        ? `<div class="ct-field__error" id="${errorId}" aria-live="polite">This field is required.</div>`
        : hint ? `<div class="ct-field__hint" id="${hintId}">${hint}</div>` : ''}
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector('.ct-input');
    expect(input).toBeInTheDocument();

    const label = canvasElement.querySelector('.ct-field__label');
    expect(label).toHaveAttribute('for', input.id);
  },
};

export const Fields = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6); max-width: 420px;">
    <div class="ct-field">
      <label class="ct-field__label" for="email">Email</label>
      <input class="ct-input" id="email" type="email" placeholder="name@company.com" aria-describedby="email-hint" />
      <div class="ct-field__hint" id="email-hint">We will not share this.</div>
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
      <textarea class="ct-textarea" id="notes" placeholder="Add context..." aria-describedby="notes-hint"></textarea>
      <div class="ct-field__hint" id="notes-hint">Optional additional context.</div>
    </div>

    <div class="ct-field ct-field--error">
      <label class="ct-field__label" for="name">Name</label>
      <input class="ct-input" id="name" aria-invalid="true" aria-describedby="name-error" />
      <div class="ct-field__error" id="name-error" aria-live="polite">Name is required.</div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Label association via for/id
    const emailInput = canvas.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');

    // aria-describedby links input to hint
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-hint');
    const emailHint = canvasElement.querySelector('#email-hint');
    expect(emailHint).toBeInTheDocument();
    expect(emailHint).toHaveTextContent('We will not share this.');

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

    // Textarea with aria-describedby
    const notesTextarea = canvas.getByLabelText('Notes');
    expect(notesTextarea).toHaveAttribute('aria-describedby', 'notes-hint');
    await userEvent.type(notesTextarea, 'Important context');
    expect(notesTextarea).toHaveValue('Important context');

    // Validation: error field has aria-invalid and aria-describedby
    const nameInput = canvas.getByLabelText('Name');
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');

    // Error message is in aria-live container
    const nameError = canvasElement.querySelector('#name-error');
    expect(nameError).toHaveAttribute('aria-live', 'polite');
    expect(nameError).toHaveTextContent('Name is required.');
  },
};

export const RequiredFields = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6); max-width: 420px;">
    <div class="ct-field">
      <label class="ct-field__label ct-field__label--required" for="req-name">Full Name</label>
      <input class="ct-input" id="req-name" type="text" aria-required="true" aria-describedby="req-name-hint" />
      <div class="ct-field__hint" id="req-name-hint">As it appears on your ID.</div>
    </div>

    <div class="ct-field">
      <label class="ct-field__label ct-field__label--required" for="req-email">Email</label>
      <input class="ct-input" id="req-email" type="email" aria-required="true" placeholder="name@company.com" />
    </div>

    <div class="ct-field">
      <label class="ct-field__label" for="opt-phone">Phone (optional)</label>
      <input class="ct-input" id="opt-phone" type="tel" />
    </div>

    <div class="ct-field ct-field--error">
      <label class="ct-field__label ct-field__label--required" for="req-password">Password</label>
      <input class="ct-input" id="req-password" type="password" aria-required="true" aria-invalid="true" aria-describedby="req-password-error" />
      <div class="ct-field__error" id="req-password-error" aria-live="polite">Password must be at least 8 characters.</div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Required fields have aria-required
    const nameInput = canvas.getByLabelText(/Full Name/);
    expect(nameInput).toHaveAttribute('aria-required', 'true');

    const emailInput = canvas.getByLabelText(/Email/);
    expect(emailInput).toHaveAttribute('aria-required', 'true');

    // Optional field does not have aria-required
    const phoneInput = canvas.getByLabelText(/Phone/);
    expect(phoneInput).not.toHaveAttribute('aria-required');

    // Required labels show visual indicator (CSS ::after)
    const requiredLabels = canvasElement.querySelectorAll('.ct-field__label--required');
    expect(requiredLabels).toHaveLength(3);

    // Required field with error has both aria-required and aria-invalid
    const passwordInput = canvas.getByLabelText(/Password/);
    expect(passwordInput).toHaveAttribute('aria-required', 'true');
    expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    expect(passwordInput).toHaveAttribute('aria-describedby', 'req-password-error');

    // aria-describedby resolves to hint element
    expect(nameInput).toHaveAttribute('aria-describedby', 'req-name-hint');
    const nameHint = canvasElement.querySelector('#req-name-hint');
    expect(nameHint).toBeInTheDocument();
  },
};

export const ErrorStates = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6); max-width: 420px;">
    <div class="ct-field ct-field--error">
      <label class="ct-field__label ct-field__label--required" for="err-email">Email</label>
      <input class="ct-input" id="err-email" type="email" value="invalid-email" aria-invalid="true" aria-required="true" aria-describedby="err-email-error" />
      <div class="ct-field__error" id="err-email-error" aria-live="polite">Please enter a valid email address.</div>
    </div>

    <div class="ct-field ct-field--error">
      <label class="ct-field__label" for="err-select">Department</label>
      <div class="ct-select-wrap">
        <select class="ct-select" id="err-select" aria-invalid="true" aria-describedby="err-select-error">
          <option value="">Select a department...</option>
        </select>
      </div>
      <div class="ct-field__error" id="err-select-error" aria-live="polite">Please select a department.</div>
    </div>

    <div class="ct-field ct-field--error">
      <label class="ct-field__label" for="err-textarea">Bio</label>
      <textarea class="ct-textarea" id="err-textarea" aria-invalid="true" aria-describedby="err-textarea-error">x</textarea>
      <div class="ct-field__error" id="err-textarea-error" aria-live="polite">Bio must be at least 20 characters.</div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // All error fields have aria-invalid
    const emailInput = canvas.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');

    const selectInput = canvas.getByLabelText('Department');
    expect(selectInput).toHaveAttribute('aria-invalid', 'true');

    const textarea = canvas.getByLabelText('Bio');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');

    // All error messages are linked via aria-describedby
    expect(emailInput).toHaveAttribute('aria-describedby', 'err-email-error');
    expect(selectInput).toHaveAttribute('aria-describedby', 'err-select-error');
    expect(textarea).toHaveAttribute('aria-describedby', 'err-textarea-error');

    // Error messages are in aria-live containers
    const errors = canvasElement.querySelectorAll('.ct-field__error');
    for (const error of errors) {
      expect(error).toHaveAttribute('aria-live', 'polite');
    }

    // Each aria-describedby resolves to a unique element
    for (const input of [emailInput, selectInput, textarea]) {
      const descId = input.getAttribute('aria-describedby');
      const descEl = canvasElement.querySelector(`#${descId}`);
      expect(descEl).toBeInTheDocument();
      expect(canvasElement.querySelectorAll(`#${descId}`)).toHaveLength(1);
    }
  },
};

export const InputGroup = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6); max-width: 420px;">
    <div class="ct-field">
      <label class="ct-field__label" for="ig-url">Website</label>
      <div class="ct-input-group">
        <span class="ct-input-group__addon">https://</span>
        <input class="ct-input" id="ig-url" type="text" placeholder="example.com" />
      </div>
    </div>

    <div class="ct-field">
      <label class="ct-field__label" for="ig-price">Price</label>
      <div class="ct-input-group">
        <span class="ct-input-group__addon">$</span>
        <input class="ct-input" id="ig-price" type="text" placeholder="0.00" />
        <span class="ct-input-group__addon">USD</span>
      </div>
    </div>

    <div class="ct-field">
      <label class="ct-field__label" for="ig-email">Email</label>
      <div class="ct-input-group">
        <input class="ct-input" id="ig-email" type="text" placeholder="username" />
        <span class="ct-input-group__addon">@company.com</span>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // All inputs have labels
    const urlInput = canvas.getByLabelText('Website');
    expect(urlInput).toBeInTheDocument();

    const priceInput = canvas.getByLabelText('Price');
    expect(priceInput).toBeInTheDocument();

    const emailInput = canvas.getByLabelText('Email');
    expect(emailInput).toBeInTheDocument();

    // Input groups contain addons
    const groups = canvasElement.querySelectorAll('.ct-input-group');
    expect(groups).toHaveLength(3);

    // Addons are visible
    expect(canvas.getByText('https://')).toBeInTheDocument();
    expect(canvas.getByText('$')).toBeInTheDocument();
    expect(canvas.getByText('USD')).toBeInTheDocument();
    expect(canvas.getByText('@company.com')).toBeInTheDocument();

    // Inputs accept typed values
    await userEvent.type(urlInput, 'example.com');
    expect(urlInput).toHaveValue('example.com');

    await userEvent.type(priceInput, '42.99');
    expect(priceInput).toHaveValue('42.99');
  },
};

export const CharacterCounter = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6); max-width: 420px;">
    <div class="ct-field">
      <label class="ct-field__label" for="cc-bio">Bio</label>
      <textarea class="ct-textarea" id="cc-bio" maxlength="200" aria-describedby="cc-bio-counter cc-bio-hint"></textarea>
      <div class="ct-field__hint" id="cc-bio-hint">Tell us about yourself.</div>
      <div class="ct-field__counter" id="cc-bio-counter" aria-live="polite"><span class="cc-bio-count">0</span> / 200</div>
    </div>

    <div class="ct-field ct-field--error">
      <label class="ct-field__label" for="cc-desc">Description</label>
      <textarea class="ct-textarea" id="cc-desc" maxlength="100" aria-invalid="true" aria-describedby="cc-desc-counter cc-desc-error">This text is already at the limit and the counter shows a warning state to indicate the user has reached the maximum allowed characters.</textarea>
      <div class="ct-field__error" id="cc-desc-error" aria-live="polite">Description is too long.</div>
      <div class="ct-field__counter ct-field__counter--limit" id="cc-desc-counter" aria-live="polite">100 / 100</div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Bio textarea has aria-describedby linking to counter and hint
    const bioTextarea = canvas.getByLabelText('Bio');
    expect(bioTextarea).toHaveAttribute('aria-describedby', 'cc-bio-counter cc-bio-hint');
    expect(bioTextarea).toHaveAttribute('maxlength', '200');

    // Counter element exists and is aria-live
    const bioCounter = canvasElement.querySelector('#cc-bio-counter');
    expect(bioCounter).toBeInTheDocument();
    expect(bioCounter).toHaveAttribute('aria-live', 'polite');

    // Hint element exists
    const bioHint = canvasElement.querySelector('#cc-bio-hint');
    expect(bioHint).toBeInTheDocument();

    // Limit counter uses danger styling class
    const descCounter = canvasElement.querySelector('#cc-desc-counter');
    expect(descCounter).toHaveClass('ct-field__counter--limit');

    // Description textarea is invalid
    const descTextarea = canvas.getByLabelText('Description');
    expect(descTextarea).toHaveAttribute('aria-invalid', 'true');
    expect(descTextarea).toHaveAttribute('aria-describedby', 'cc-desc-counter cc-desc-error');
  },
};

export const Sizes = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6); max-width: 360px;">
    <div class="ct-field">
      <label class="ct-field__label" for="size-sm">Small</label>
      <input class="ct-input ct-input--sm" id="size-sm" type="text" placeholder="Small input" />
    </div>
    <div class="ct-field">
      <label class="ct-field__label" for="size-md">Medium (default)</label>
      <input class="ct-input" id="size-md" type="text" placeholder="Medium input" />
    </div>
    <div class="ct-field">
      <label class="ct-field__label" for="size-lg">Large</label>
      <input class="ct-input ct-input--lg" id="size-lg" type="text" placeholder="Large input" />
    </div>

    <div class="ct-field">
      <label class="ct-field__label" for="size-select-sm">Small Select</label>
      <div class="ct-select-wrap">
        <select class="ct-select ct-select--sm" id="size-select-sm">
          <option>Option A</option>
          <option>Option B</option>
        </select>
      </div>
    </div>

    <div class="ct-field">
      <label class="ct-field__label" for="size-ta-sm">Small Textarea</label>
      <textarea class="ct-textarea ct-textarea--sm" id="size-ta-sm" placeholder="Small textarea"></textarea>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // All inputs have associated labels
    const smInput = canvas.getByLabelText('Small');
    const mdInput = canvas.getByLabelText('Medium (default)');
    const lgInput = canvas.getByLabelText('Large');

    expect(smInput).toBeInTheDocument();
    expect(mdInput).toBeInTheDocument();
    expect(lgInput).toBeInTheDocument();

    // Size classes are applied correctly
    expect(smInput).toHaveClass('ct-input--sm');
    expect(lgInput).toHaveClass('ct-input--lg');

    // Select has size class
    const smSelect = canvas.getByLabelText('Small Select');
    expect(smSelect).toHaveClass('ct-select--sm');

    // Textarea has size class
    const smTextarea = canvas.getByLabelText('Small Textarea');
    expect(smTextarea).toHaveClass('ct-textarea--sm');

    // Inputs accept typed values
    await userEvent.type(smInput, 'small');
    expect(smInput).toHaveValue('small');

    await userEvent.type(mdInput, 'medium');
    expect(mdInput).toHaveValue('medium');

    await userEvent.type(lgInput, 'large');
    expect(lgInput).toHaveValue('large');
  },
};

export const FocusRing = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6); max-width: 420px;">
    <p class="ct-muted">Tab through the fields to see the focus ring.</p>
    <div class="ct-field">
      <label class="ct-field__label" for="fr-text">Text Input</label>
      <input class="ct-input" id="fr-text" type="text" />
    </div>

    <div class="ct-field">
      <label class="ct-field__label" for="fr-select">Select</label>
      <div class="ct-select-wrap">
        <select class="ct-select" id="fr-select">
          <option>Option A</option>
          <option>Option B</option>
        </select>
      </div>
    </div>

    <div class="ct-field">
      <label class="ct-field__label" for="fr-textarea">Textarea</label>
      <textarea class="ct-textarea" id="fr-textarea"></textarea>
    </div>

    <div class="ct-field ct-field--error">
      <label class="ct-field__label" for="fr-error">Error State (focus ring + error border)</label>
      <input class="ct-input" id="fr-error" type="text" aria-invalid="true" aria-describedby="fr-error-msg" />
      <div class="ct-field__error" id="fr-error-msg" aria-live="polite">This field has an error.</div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textInput = canvas.getByLabelText('Text Input');
    const selectEl = canvas.getByLabelText('Select');
    const textareaEl = canvas.getByLabelText('Textarea');
    const errorInput = canvas.getByLabelText(/Error State/);

    // Focus the text input and verify outline
    textInput.focus();
    expect(textInput).toHaveFocus();
    const textStyle = getComputedStyle(textInput);
    expect(textStyle.outlineColor).not.toBe('');

    // Tab to select
    await userEvent.tab();
    expect(selectEl).toHaveFocus();

    // Tab to textarea
    await userEvent.tab();
    expect(textareaEl).toHaveFocus();

    // Tab to error input — has both focus ring and error state
    await userEvent.tab();
    expect(errorInput).toHaveFocus();
    expect(errorInput).toHaveAttribute('aria-invalid', 'true');
  },
};
