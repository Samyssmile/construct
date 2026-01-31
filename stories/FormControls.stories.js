export default {
  title: 'Components/Form Controls'
};

export const Fields = () => `
  <div class="af-stack" style="--af-stack-space: var(--space-6); max-width: 420px;">
    <div class="af-field">
      <label class="af-field__label" for="email">Email</label>
      <input class="af-input" id="email" type="email" placeholder="name@company.com" />
      <div class="af-field__hint">We will not share this.</div>
    </div>

    <div class="af-field">
      <label class="af-field__label" for="search">Search</label>
      <div class="af-input-wrap">
        <span class="af-input__icon" aria-hidden="true">?</span>
        <input class="af-input af-input--with-icon" id="search" type="search" />
      </div>
    </div>

    <div class="af-field">
      <label class="af-field__label" for="role">Role</label>
      <select class="af-select" id="role">
        <option>Designer</option>
        <option>Engineer</option>
        <option>Manager</option>
      </select>
    </div>

    <div class="af-field">
      <label class="af-field__label" for="notes">Notes</label>
      <textarea class="af-textarea" id="notes" placeholder="Add context..."></textarea>
    </div>

    <div class="af-field af-field--error">
      <label class="af-field__label" for="name">Name</label>
      <input class="af-input" id="name" aria-invalid="true" />
      <div class="af-field__error">Name is required.</div>
    </div>
  </div>
`;

export const Sizes = () => `
  <div class="af-stack" style="--af-stack-space: var(--space-4); max-width: 360px;">
    <input class="af-input af-control--sm" placeholder="Small" />
    <input class="af-input" placeholder="Medium" />
    <input class="af-input af-control--lg" placeholder="Large" />
  </div>
`;
