import { expect, within, userEvent, waitFor } from 'storybook/test';

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
    <span class="ct-tooltip" data-side="top">
      <button class="ct-button ct-button--secondary" aria-describedby="tip-1">Hover me</button>
      <span class="ct-tooltip__content" role="tooltip" id="tip-1">Short hint</span>
    </span>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('button', { name: 'Hover me' });
    const tooltipEl = canvasElement.querySelector('.ct-tooltip__content');

    // Trigger references tooltip via aria-describedby
    expect(trigger).toHaveAttribute('aria-describedby', 'tip-1');
    expect(tooltipEl).toHaveAttribute('role', 'tooltip');
    expect(tooltipEl).toHaveTextContent('Short hint');

    // aria-describedby ID is unique and resolves to the tooltip
    const describedId = trigger.getAttribute('aria-describedby');
    expect(canvasElement.querySelectorAll(`#${describedId}`)).toHaveLength(1);
    expect(canvasElement.querySelector(`#${describedId}`)).toBe(tooltipEl);

    // Tooltip is hidden by default (visibility: hidden)
    const style = getComputedStyle(tooltipEl);
    expect(style.visibility).toBe('hidden');
    expect(style.opacity).toBe('0');

    // Tooltip becomes visible on focus via :focus-within
    trigger.focus();
    expect(trigger).toHaveFocus();

    // visibility snaps immediately, opacity transitions
    expect(getComputedStyle(tooltipEl).visibility).toBe('visible');
    await waitFor(() => {
      expect(getComputedStyle(tooltipEl).opacity).toBe('1');
    });
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
    <div class="ct-dropdown" id="story-dd">
      <button class="ct-button ct-button--secondary ct-dropdown__trigger"
              id="story-dd-trigger"
              aria-expanded="false"
              aria-controls="story-dd-menu">Actions</button>
      <div class="ct-dropdown__menu" id="story-dd-menu" role="group" aria-label="Actions" inert>
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

    const dropdown = canvasElement.querySelector('#story-dd');
    const trigger = canvas.getByRole('button', { name: 'Actions' });
    const menuEl = canvasElement.querySelector('#story-dd-menu');

    // Wire up Action-List keyboard behaviour.
    // inert is removed/added synchronously so focus() works immediately
    // without waiting for CSS opacity transition to complete.
    function openDropdown() {
      dropdown.dataset.state = 'open';
      trigger.setAttribute('aria-expanded', 'true');
      menuEl.removeAttribute('inert');
      const first = menuEl.querySelector('.ct-dropdown__item:not([aria-disabled="true"])');
      if (first) first.focus();
    }

    function closeDropdown() {
      menuEl.setAttribute('inert', '');
      delete dropdown.dataset.state;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    }

    trigger.addEventListener('click', () => {
      if (dropdown.dataset.state === 'open') closeDropdown();
      else openDropdown();
    });

    menuEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDropdown();
      }
    });

    // Trigger has correct ARIA attributes
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls', 'story-dd-menu');

    // Menu container has a group role and accessible label
    expect(menuEl).toHaveAttribute('role', 'group');
    expect(menuEl).toHaveAttribute('aria-label');

    // Open: click trigger → menu opens, focus moves to first item
    trigger.click();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(dropdown).toHaveAttribute('data-state', 'open');

    const editBtn = menuEl.querySelector('.ct-dropdown__item');
    expect(editBtn).toHaveFocus();

    // Menu items are buttons
    const menuScope = within(menuEl);
    expect(menuScope.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(menuScope.getByRole('button', { name: 'Duplicate' })).toBeInTheDocument();
    expect(menuScope.getByRole('button', { name: 'Archive' })).toBeInTheDocument();

    // Visual separator between groups
    expect(menuScope.getByRole('separator')).toBeInTheDocument();

    // Items are clickable and receive focus on click
    const dupBtn = menuScope.getByRole('button', { name: 'Duplicate' });
    await userEvent.click(dupBtn);
    expect(dupBtn).toHaveFocus();

    // Keyboard: Enter activates a focused item
    dupBtn.focus();
    let dupClicked = false;
    dupBtn.addEventListener('click', () => { dupClicked = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(dupClicked).toBe(true);

    // Escape: closes dropdown and returns focus to trigger
    const archiveBtn = menuScope.getByRole('button', { name: 'Archive' });
    archiveBtn.focus();
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(dropdown).not.toHaveAttribute('data-state', 'open');

    // Re-open: click trigger → first item focused again
    trigger.click();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(editBtn).toHaveFocus();
  },
};
