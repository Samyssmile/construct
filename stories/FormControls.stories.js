export default {
  title: 'Forms/Form Controls'
};

export const Fields = () => `
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
      <select class="ct-select" id="role">
        <option>Designer</option>
        <option>Engineer</option>
        <option>Manager</option>
      </select>
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
`;

export const Sizes = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4); max-width: 360px;">
    <input class="ct-input ct-control--sm" placeholder="Small" />
    <input class="ct-input" placeholder="Medium" />
    <input class="ct-input ct-control--lg" placeholder="Large" />
  </div>
`;
