export default {
  title: 'Components/Overlays'
};

export const Modal = () => `
  <div class="af-modal" data-state="open" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="af-modal__dialog">
      <div class="af-modal__header">
        <h2 id="modal-title">Invite team</h2>
        <button class="af-button af-button--ghost" aria-label="Close">Close</button>
      </div>
      <div class="af-modal__body">
        <p>Send an invite to a new team member.</p>
        <input class="af-input" placeholder="name@company.com" />
      </div>
      <div class="af-modal__footer">
        <button class="af-button af-button--secondary">Cancel</button>
        <button class="af-button">Send</button>
      </div>
    </div>
  </div>
`;

Modal.parameters = {
  layout: 'fullscreen'
};

export const Toast = () => `
  <div style="min-height: 320px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="af-toast-region" aria-live="polite">
      <div class="af-toast" data-variant="success" data-state="open">
        <div class="af-toast__title">Saved</div>
        <div class="af-toast__description">Your changes were saved.</div>
        <button class="af-button af-button--ghost">Undo</button>
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
    <span class="af-tooltip" data-state="open" data-side="top">
      <button class="af-button af-button--secondary" aria-describedby="tip-1">Hover me</button>
      <span class="af-tooltip__content" role="tooltip" id="tip-1">Short hint</span>
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
    <div class="af-dropdown" data-state="open">
      <button class="af-button af-button--secondary af-dropdown__trigger" aria-expanded="true" aria-controls="actions-menu">Actions</button>
      <div class="af-dropdown__menu" id="actions-menu">
        <button class="af-dropdown__item" type="button">Edit</button>
        <button class="af-dropdown__item" type="button">Duplicate</button>
        <div class="af-dropdown__separator" role="separator"></div>
        <button class="af-dropdown__item" type="button">Archive</button>
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
