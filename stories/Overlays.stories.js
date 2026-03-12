export default {
  title: 'Overlays/Overlays'
};

export const Modal = () => `
  <div class="ct-modal" data-state="open" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="ct-modal__dialog">
      <div class="ct-modal__header">
        <h2 id="modal-title">Invite team</h2>
        <button class="ct-button ct-button--ghost" aria-label="Close">Close</button>
      </div>
      <div class="ct-modal__body">
        <p>Send an invite to a new team member.</p>
        <div class="ct-field">
          <label class="ct-field__label" for="invite-email">Email</label>
          <input class="ct-input" id="invite-email" type="email" placeholder="name@company.com" />
        </div>
      </div>
      <div class="ct-modal__footer">
        <button class="ct-button ct-button--secondary">Cancel</button>
        <button class="ct-button">Send</button>
      </div>
    </div>
  </div>
`;

Modal.parameters = {
  layout: 'fullscreen'
};

export const ConfirmationDialog = () => `
  <div class="ct-modal ct-modal--confirmation" data-state="open" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description">
    <div class="ct-modal__dialog">
      <div class="ct-modal__body">
        <div class="ct-confirmation" data-variant="danger">
          <div class="ct-confirmation__icon" aria-hidden="true">!</div>
          <div class="ct-confirmation__content">
            <h2 class="ct-confirmation__title" id="confirm-title">Delete file?</h2>
            <p class="ct-confirmation__description" id="confirm-description">This action cannot be undone.</p>
          </div>
        </div>
      </div>
      <div class="ct-modal__footer">
        <button class="ct-button ct-button--secondary">Cancel</button>
        <button class="ct-button ct-button--danger">Delete</button>
      </div>
    </div>
  </div>
`;

ConfirmationDialog.parameters = {
  layout: 'fullscreen'
};

export const Toast = () => `
  <div style="min-height: 320px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-toast-region" aria-live="polite">
      <div class="ct-toast" data-variant="success" data-state="open">
        <div class="ct-toast__title">Saved</div>
        <div class="ct-toast__description">Your changes were saved.</div>
        <button class="ct-button ct-button--ghost">Undo</button>
      </div>
    </div>
  </div>
`;

Toast.parameters = {
  layout: 'fullscreen',
  docs: {
    story: {
      inline: true,
      height: 320
    }
  }
};

export const Tooltip = () => `
  <div style="min-height: 320px; padding: 24px; display: flex; align-items: center; justify-content: center;">
    <span class="ct-tooltip" data-state="open" data-side="top">
      <button class="ct-button ct-button--secondary" aria-describedby="tip-1">Hover me</button>
      <span class="ct-tooltip__content" role="tooltip" id="tip-1">Short hint</span>
    </span>
  </div>
`;

Tooltip.parameters = {
  layout: 'fullscreen',
  docs: {
    story: {
      inline: true,
      height: 320
    }
  }
};

export const Dropdown = () => `
  <div style="min-height: 320px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-dropdown" data-state="open">
      <button class="ct-button ct-button--secondary ct-dropdown__trigger" aria-expanded="true" aria-controls="actions-menu">Actions</button>
      <div class="ct-dropdown__menu" id="actions-menu">
        <button class="ct-dropdown__item" type="button">Edit</button>
        <button class="ct-dropdown__item" type="button">Duplicate</button>
        <div class="ct-dropdown__separator" role="separator"></div>
        <button class="ct-dropdown__item" type="button">Archive</button>
      </div>
    </div>
  </div>
`;

Dropdown.parameters = {
  layout: 'fullscreen',
  docs: {
    story: {
      inline: true,
      height: 320
    }
  }
};
