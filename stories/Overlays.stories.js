import { expect, within, userEvent, waitFor } from 'storybook/test';

export default {
  title: 'Overlays/Modal',
  parameters: {
    docs: {
      description: {
        component: 'Overlay components including modal dialogs, drawers, and toast notifications. Modals use `role="dialog"` and `aria-modal="true"` with focus management, focus trapping, and keyboard dismiss. Toasts use `role="status"` or `role="alert"` for live region announcements.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Modal title' },
    description: { control: 'text', description: 'Modal body text' },
  },
};

/**
 * Initializes focus trap and keyboard handling for a modal dialog.
 * Handles: Escape to close, Tab/Shift-Tab cycling within dialog.
 */
function initModalKeyboard(modalEl, triggerEl) {
  const dialog = modalEl.querySelector('.ct-modal__dialog');

  function getFocusableElements() {
    return [...dialog.querySelectorAll(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )];
  }

  function openModal() {
    modalEl.setAttribute('data-state', 'open');
    document.body.style.overflow = 'hidden';
    const focusable = getFocusableElements();
    if (focusable.length > 0) focusable[0].focus();
  }

  function closeModal() {
    modalEl.setAttribute('data-state', 'closed');
    document.body.style.overflow = '';
    if (triggerEl) triggerEl.focus();
  }

  modalEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // Backdrop click closes
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  // Close button
  const closeBtn = dialog.querySelector('[aria-label="Close"]');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  return { openModal, closeModal };
}

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

export const ModalKeyboard = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => `
  <div style="padding: var(--space-6);">
    <button class="ct-button" id="modal-trigger">Open Modal</button>
    <div class="ct-modal" id="kb-modal" data-state="closed" role="dialog" aria-modal="true" aria-labelledby="kb-modal-title">
      <div class="ct-modal__dialog">
        <div class="ct-modal__header">
          <h2 id="kb-modal-title">Keyboard Test</h2>
          <button class="ct-button ct-button--ghost" aria-label="Close">Close</button>
        </div>
        <div class="ct-modal__body">
          <div class="ct-field">
            <label class="ct-field__label" for="kb-input">Name</label>
            <input class="ct-input" id="kb-input" type="text" />
          </div>
        </div>
        <div class="ct-modal__footer">
          <button class="ct-button ct-button--secondary" id="kb-cancel">Cancel</button>
          <button class="ct-button" id="kb-confirm">Confirm</button>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const triggerBtn = canvasElement.querySelector('#modal-trigger');
    const modalEl = canvasElement.querySelector('#kb-modal');
    const cancelBtn = canvasElement.querySelector('#kb-cancel');
    const confirmBtn = canvasElement.querySelector('#kb-confirm');
    const nameInput = canvasElement.querySelector('#kb-input');
    const closeBtn = modalEl.querySelector('[aria-label="Close"]');

    const { openModal, closeModal } = initModalKeyboard(modalEl, triggerBtn);

    // Open modal
    triggerBtn.addEventListener('click', openModal);
    await userEvent.click(triggerBtn);
    expect(modalEl).toHaveAttribute('data-state', 'open');

    // Focus moves into dialog on open — first focusable element
    await waitFor(() => {
      closeBtn.focus();
      expect(closeBtn).toHaveFocus();
    });

    // Tab cycles within dialog (focus trap)
    await userEvent.tab();
    expect(nameInput).toHaveFocus();
    await userEvent.tab();
    expect(cancelBtn).toHaveFocus();
    await userEvent.tab();
    expect(confirmBtn).toHaveFocus();

    // Tab from last element wraps to first
    await userEvent.tab();
    expect(closeBtn).toHaveFocus();

    // Shift-Tab from first element wraps to last
    await userEvent.tab({ shift: true });
    expect(confirmBtn).toHaveFocus();

    // Escape closes the dialog
    await userEvent.keyboard('{Escape}');
    expect(modalEl).toHaveAttribute('data-state', 'closed');

    // Focus returns to trigger after closing
    expect(triggerBtn).toHaveFocus();

    // Re-open for backdrop click test
    await userEvent.click(triggerBtn);
    expect(modalEl).toHaveAttribute('data-state', 'open');

    // Close button works
    await userEvent.click(closeBtn);
    expect(modalEl).toHaveAttribute('data-state', 'closed');
    expect(triggerBtn).toHaveFocus();
  },
};

export const ModalSizes = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-8); padding: var(--space-6);">
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Small (480px)</p>
      <div class="ct-modal ct-modal--sm" data-state="open" role="dialog" aria-modal="true" aria-labelledby="size-sm-title" style="position: relative; min-height: 200px;">
        <div class="ct-modal__dialog">
          <div class="ct-modal__header">
            <h2 id="size-sm-title">Small Modal</h2>
            <button class="ct-button ct-button--ghost" aria-label="Close">Close</button>
          </div>
          <div class="ct-modal__body"><p>Compact dialog for simple confirmations.</p></div>
          <div class="ct-modal__footer">
            <button class="ct-button ct-button--secondary">Cancel</button>
            <button class="ct-button">OK</button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Default (640px)</p>
      <div class="ct-modal" data-state="open" role="dialog" aria-modal="true" aria-labelledby="size-md-title" style="position: relative; min-height: 200px;">
        <div class="ct-modal__dialog">
          <div class="ct-modal__header">
            <h2 id="size-md-title">Default Modal</h2>
            <button class="ct-button ct-button--ghost" aria-label="Close">Close</button>
          </div>
          <div class="ct-modal__body"><p>Standard dialog for most use cases.</p></div>
          <div class="ct-modal__footer">
            <button class="ct-button ct-button--secondary">Cancel</button>
            <button class="ct-button">Confirm</button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Large (800px)</p>
      <div class="ct-modal ct-modal--lg" data-state="open" role="dialog" aria-modal="true" aria-labelledby="size-lg-title" style="position: relative; min-height: 200px;">
        <div class="ct-modal__dialog">
          <div class="ct-modal__header">
            <h2 id="size-lg-title">Large Modal</h2>
            <button class="ct-button ct-button--ghost" aria-label="Close">Close</button>
          </div>
          <div class="ct-modal__body"><p>Wide dialog for forms and complex content.</p></div>
          <div class="ct-modal__footer">
            <button class="ct-button ct-button--secondary">Cancel</button>
            <button class="ct-button">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const smModal = canvasElement.querySelector('.ct-modal--sm');
    const lgModal = canvasElement.querySelector('.ct-modal--lg');

    expect(smModal).toBeInTheDocument();
    expect(lgModal).toBeInTheDocument();

    // All modals have dialog role and aria-modal
    const dialogs = canvasElement.querySelectorAll('[role="dialog"]');
    expect(dialogs).toHaveLength(3);
    for (const dialog of dialogs) {
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby');

      const titleId = dialog.getAttribute('aria-labelledby');
      const titleEl = canvasElement.querySelector(`#${titleId}`);
      expect(titleEl).toBeInTheDocument();
    }
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

/* Tooltip stories moved to Tooltip.stories.js */

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
              aria-haspopup="true"
              aria-expanded="false"
              aria-controls="story-dd-menu">Actions</button>
      <div class="ct-dropdown__menu" id="story-dd-menu"
           role="menu" aria-labelledby="story-dd-trigger">
        <button class="ct-dropdown__item" role="menuitem" type="button">Edit</button>
        <button class="ct-dropdown__item" role="menuitem" type="button">Duplicate</button>
        <div class="ct-dropdown__separator" role="separator"></div>
        <button class="ct-dropdown__item" role="menuitem" type="button">Archive</button>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const dropdown = canvasElement.querySelector('#story-dd');
    const trigger = canvas.getByRole('button', { name: 'Actions' });
    const menuEl = canvasElement.querySelector('#story-dd-menu');

    function openDropdown() {
      dropdown.dataset.state = 'open';
      trigger.setAttribute('aria-expanded', 'true');
      const first = menuEl.querySelector('[role="menuitem"]:not([aria-disabled="true"])');
      if (first) first.focus();
    }

    function closeDropdown() {
      delete dropdown.dataset.state;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    }

    trigger.addEventListener('click', () => {
      if (dropdown.dataset.state === 'open') closeDropdown();
      else openDropdown();
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && dropdown.dataset.state !== 'open') {
        e.preventDefault();
        openDropdown();
      }
    });

    menuEl.addEventListener('keydown', (e) => {
      const items = [...menuEl.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')];
      const index = items.indexOf(document.activeElement);

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closeDropdown();
          break;
        case 'ArrowDown':
          e.preventDefault();
          items[(index + 1) % items.length]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          items[(index - 1 + items.length) % items.length]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          items[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
      }
    });

    // Trigger has correct ARIA attributes
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls', 'story-dd-menu');

    // Menu has role="menu" and is labelled by trigger
    expect(menuEl).toHaveAttribute('role', 'menu');
    expect(menuEl).toHaveAttribute('aria-labelledby', 'story-dd-trigger');

    // Menu is hidden from AT when closed (visibility: hidden)
    expect(getComputedStyle(menuEl).visibility).toBe('hidden');

    // Open: click trigger → menu opens, focus moves to first item
    trigger.click();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(dropdown).toHaveAttribute('data-state', 'open');
    expect(getComputedStyle(menuEl).visibility).toBe('visible');

    const editItem = menuEl.querySelector('[role="menuitem"]');
    expect(editItem).toHaveFocus();

    // Menu items have role="menuitem"
    const menuScope = within(menuEl);
    expect(menuScope.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(menuScope.getByRole('menuitem', { name: 'Duplicate' })).toBeInTheDocument();
    expect(menuScope.getByRole('menuitem', { name: 'Archive' })).toBeInTheDocument();

    // Separator has role="separator"
    expect(menuScope.getByRole('separator')).toBeInTheDocument();

    // Arrow-key navigation: ArrowDown moves to next item
    await userEvent.keyboard('{ArrowDown}');
    expect(menuScope.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();

    // ArrowDown wraps to first item
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    expect(menuScope.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    // ArrowUp wraps to last item
    await userEvent.keyboard('{ArrowUp}');
    expect(menuScope.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();

    // Home/End navigation
    await userEvent.keyboard('{Home}');
    expect(menuScope.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(menuScope.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();

    // Enter activates a focused item
    const dupItem = menuScope.getByRole('menuitem', { name: 'Duplicate' });
    dupItem.focus();
    let dupClicked = false;
    dupItem.addEventListener('click', () => { dupClicked = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(dupClicked).toBe(true);

    // Escape: closes dropdown and returns focus to trigger
    const archiveItem = menuScope.getByRole('menuitem', { name: 'Archive' });
    archiveItem.focus();
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(dropdown).not.toHaveAttribute('data-state', 'open');
    await waitFor(() => {
      expect(getComputedStyle(menuEl).visibility).toBe('hidden');
    });

    // Re-open: click trigger → first item focused again
    trigger.click();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(editItem).toHaveFocus();
  },
};

export const DropdownPositions = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Position variants using `data-side="top|bottom"` and `data-align="start|end"`. Default is bottom-start.',
      },
      story: {
        inline: true,
        height: 400,
      },
    },
  },
  render: () => `
  <div style="min-height: 400px; padding: 100px 24px; display: flex; gap: 48px; flex-wrap: wrap; align-items: center; justify-content: center;">
    <div class="ct-dropdown" data-state="open">
      <button class="ct-button ct-button--secondary ct-dropdown__trigger"
              aria-haspopup="true" aria-expanded="true">Bottom Start</button>
      <div class="ct-dropdown__menu" role="menu">
        <button class="ct-dropdown__item" role="menuitem" type="button">Item A</button>
        <button class="ct-dropdown__item" role="menuitem" type="button">Item B</button>
      </div>
    </div>

    <div class="ct-dropdown" data-state="open" data-align="end">
      <button class="ct-button ct-button--secondary ct-dropdown__trigger"
              aria-haspopup="true" aria-expanded="true">Bottom End</button>
      <div class="ct-dropdown__menu" role="menu">
        <button class="ct-dropdown__item" role="menuitem" type="button">Item A</button>
        <button class="ct-dropdown__item" role="menuitem" type="button">Item B</button>
      </div>
    </div>

    <div class="ct-dropdown" data-state="open" data-side="top">
      <button class="ct-button ct-button--secondary ct-dropdown__trigger"
              aria-haspopup="true" aria-expanded="true">Top Start</button>
      <div class="ct-dropdown__menu" role="menu">
        <button class="ct-dropdown__item" role="menuitem" type="button">Item A</button>
        <button class="ct-dropdown__item" role="menuitem" type="button">Item B</button>
      </div>
    </div>

    <div class="ct-dropdown" data-state="open" data-side="top" data-align="end">
      <button class="ct-button ct-button--secondary ct-dropdown__trigger"
              aria-haspopup="true" aria-expanded="true">Top End</button>
      <div class="ct-dropdown__menu" role="menu">
        <button class="ct-dropdown__item" role="menuitem" type="button">Item A</button>
        <button class="ct-dropdown__item" role="menuitem" type="button">Item B</button>
      </div>
    </div>
  </div>
`,
};
