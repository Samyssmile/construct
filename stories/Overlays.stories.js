import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Overlays/Overlays',
  parameters: {
    docs: {
      description: {
        component: 'Overlay components including modal dialogs, drawers, and toast notifications. Modals use `role="dialog"` and `aria-modal="true"`. Toasts use `role="status"` or `role="alert"` for live region announcements.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Modal title' },
    description: { control: 'text', description: 'Modal body text' },
  },
};

export const Playground = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'Invite team',
    description: 'Send an invite to a new team member.',
  },
  render: ({ title, description }) => `
  <div class="ct-modal" data-state="open" role="dialog" aria-modal="true" aria-labelledby="pg-modal-title">
    <div class="ct-modal__dialog">
      <div class="ct-modal__header">
        <h2 id="pg-modal-title">${title}</h2>
        <button class="ct-button ct-button--ghost" aria-label="Close">Close</button>
      </div>
      <div class="ct-modal__body">
        <p>${description}</p>
      </div>
      <div class="ct-modal__footer">
        <button class="ct-button ct-button--secondary">Cancel</button>
        <button class="ct-button">Confirm</button>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const closeBtn = canvas.getByRole('button', { name: 'Close' });
    expect(closeBtn).toBeInTheDocument();
  },
};

export const Modal = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => `
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
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog');

    // Dialog semantics
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Title is linked via aria-labelledby
    const titleId = dialog.getAttribute('aria-labelledby');
    const title = canvasElement.querySelector(`#${titleId}`);
    expect(title).toHaveTextContent('Invite team');

    // Close button has accessible name
    const closeBtn = canvas.getByRole('button', { name: 'Close' });
    expect(closeBtn).toBeInTheDocument();
    await userEvent.click(closeBtn);
    expect(closeBtn).toHaveFocus();

    // Form field has label association and accepts input
    const emailInput = canvas.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
    await userEvent.type(emailInput, 'colleague@company.com');
    expect(emailInput).toHaveValue('colleague@company.com');

    // Action buttons are reachable and focusable
    const cancelBtn = canvas.getByRole('button', { name: 'Cancel' });
    const sendBtn = canvas.getByRole('button', { name: 'Send' });

    await userEvent.click(cancelBtn);
    expect(cancelBtn).toHaveFocus();

    await userEvent.click(sendBtn);
    expect(sendBtn).toHaveFocus();

    // Keyboard: Enter activates the focused button
    cancelBtn.focus();
    let cancelClicked = false;
    cancelBtn.addEventListener('click', () => { cancelClicked = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(cancelClicked).toBe(true);
  },
};

export const ConfirmationDialog = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => `
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
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog');

    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Title linked via aria-labelledby
    const titleId = dialog.getAttribute('aria-labelledby');
    expect(canvasElement.querySelector(`#${titleId}`)).toHaveTextContent('Delete file?');

    // Description linked via aria-describedby
    const descId = dialog.getAttribute('aria-describedby');
    expect(canvasElement.querySelector(`#${descId}`)).toHaveTextContent('This action cannot be undone.');

    // Both referenced IDs are unique and resolve to actual elements
    expect(canvasElement.querySelectorAll(`#${titleId}`)).toHaveLength(1);
    expect(canvasElement.querySelectorAll(`#${descId}`)).toHaveLength(1);

    // Decorative icon is hidden from assistive tech
    expect(canvasElement.querySelector('.ct-confirmation__icon')).toHaveAttribute('aria-hidden', 'true');

    // Destructive action button uses danger variant
    const deleteBtn = canvas.getByRole('button', { name: 'Delete' });
    expect(deleteBtn).toBeEnabled();
    await userEvent.click(deleteBtn);
    expect(deleteBtn).toHaveFocus();

    // Cancel button is reachable and focusable
    const cancelBtn = canvas.getByRole('button', { name: 'Cancel' });
    await userEvent.click(cancelBtn);
    expect(cancelBtn).toHaveFocus();

    // Keyboard: Space activates the delete button
    deleteBtn.focus();
    let deleteClicked = false;
    deleteBtn.addEventListener('click', () => { deleteClicked = true; }, { once: true });
    await userEvent.keyboard(' ');
    expect(deleteClicked).toBe(true);
  },
};

export const Toast = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: true,
        height: 320,
      },
    },
  },
  render: () => `
  <div style="min-height: 320px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-toast-region" aria-live="polite" role="status">
      <div class="ct-toast" data-variant="success" data-state="open">
        <div class="ct-toast__title">Saved</div>
        <div class="ct-toast__description">Your changes were saved.</div>
        <button class="ct-button ct-button--ghost" aria-label="Undo save">Undo</button>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Live region has both aria-live and role for maximum AT compatibility
    const liveRegion = canvasElement.querySelector('.ct-toast-region');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('role', 'status');

    // Toast content is visible
    expect(canvas.getByText('Saved')).toBeInTheDocument();
    expect(canvas.getByText('Your changes were saved.')).toBeInTheDocument();

    // Undo button has a descriptive aria-label (not just "Undo")
    const undoBtn = canvas.getByRole('button', { name: /Undo/ });
    expect(undoBtn).toHaveAttribute('aria-label');
    const undoLabel = undoBtn.getAttribute('aria-label');
    expect(undoLabel.length).toBeGreaterThan(4);

    // Undo button is focusable and clickable
    await userEvent.click(undoBtn);
    expect(undoBtn).toHaveFocus();

    // Keyboard: Enter activates undo
    let undoClicked = false;
    undoBtn.addEventListener('click', () => { undoClicked = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(undoClicked).toBe(true);
  },
};

export const Tooltip = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: true,
        height: 320,
      },
    },
  },
  render: () => `
  <div style="min-height: 320px; padding: 24px; display: flex; align-items: center; justify-content: center;">
    <span class="ct-tooltip" data-state="open" data-side="top">
      <button class="ct-button ct-button--secondary" aria-describedby="tip-1">Hover me</button>
      <span class="ct-tooltip__content" role="tooltip" id="tip-1">Short hint</span>
    </span>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('button', { name: 'Hover me' });
    const tooltip = canvas.getByRole('tooltip');

    // Trigger references tooltip via aria-describedby
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
    expect(tooltip).toHaveTextContent('Short hint');

    // Tooltip has role="tooltip"
    expect(tooltip).toHaveAttribute('role', 'tooltip');

    // The aria-describedby ID is unique and resolves to the tooltip
    const describedId = trigger.getAttribute('aria-describedby');
    expect(canvasElement.querySelectorAll(`#${describedId}`)).toHaveLength(1);
    expect(canvasElement.querySelector(`#${describedId}`)).toBe(tooltip);

    // Trigger is focusable (tooltip should show on focus too)
    trigger.focus();
    expect(trigger).toHaveFocus();
  },
};

export const Dropdown = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: true,
        height: 320,
      },
    },
  },
  render: () => `
  <div style="min-height: 320px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-dropdown" data-state="open">
      <button class="ct-button ct-button--secondary ct-dropdown__trigger" aria-expanded="true" aria-controls="actions-menu">Actions</button>
      <div class="ct-dropdown__menu" id="actions-menu" role="group" aria-label="Actions">
        <button class="ct-dropdown__item" type="button">Edit</button>
        <button class="ct-dropdown__item" type="button">Duplicate</button>
        <div class="ct-dropdown__separator" role="separator"></div>
        <button class="ct-dropdown__item" type="button">Archive</button>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Trigger declares expanded state and controls the menu
    const trigger = canvas.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const menuId = trigger.getAttribute('aria-controls');
    const menu = canvasElement.querySelector(`#${menuId}`);
    expect(menu).toBeInTheDocument();

    // Menu container has a role and accessible label
    expect(menu).toHaveAttribute('role');
    expect(menu).toHaveAttribute('aria-label');

    // Menu items are buttons
    const menuScope = within(menu);
    const editBtn = menuScope.getByRole('button', { name: 'Edit' });
    const dupBtn = menuScope.getByRole('button', { name: 'Duplicate' });
    const archiveBtn = menuScope.getByRole('button', { name: 'Archive' });

    expect(editBtn).toBeInTheDocument();
    expect(dupBtn).toBeInTheDocument();
    expect(archiveBtn).toBeInTheDocument();

    // Visual separator between groups
    expect(menuScope.getByRole('separator')).toBeInTheDocument();

    // Menu items are focusable and clickable
    await userEvent.click(editBtn);
    expect(editBtn).toHaveFocus();

    await userEvent.click(archiveBtn);
    expect(archiveBtn).toHaveFocus();

    // Keyboard: Enter activates a focused menu item
    dupBtn.focus();
    let dupClicked = false;
    dupBtn.addEventListener('click', () => { dupClicked = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(dupClicked).toBe(true);

    // Trigger is also focusable
    await userEvent.click(trigger);
    expect(trigger).toHaveFocus();
  },
};
