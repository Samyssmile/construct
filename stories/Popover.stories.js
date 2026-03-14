import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Components/Popover',
  parameters: {
    docs: {
      description: {
        component:
          'A floating content panel anchored to a trigger element. ' +
          'Supports rich interactive content such as forms, filter panels, and hover cards. ' +
          'Uses `data-state`, `data-side`, and `data-align` for visibility and positioning. ' +
          'Trigger requires `aria-expanded` and `aria-haspopup="dialog"`, content uses `role="dialog"`.',
      },
    },
  },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Side relative to the trigger',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Alignment along the side axis',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Popover width variant',
    },
    open: {
      control: 'boolean',
      description: 'Whether the popover is open',
    },
  },
};

const sizeClass = (size) => {
  if (size === 'sm') return ' ct-popover--sm';
  if (size === 'lg') return ' ct-popover--lg';
  return '';
};

/**
 * Interactive playground with all controls.
 */
export const Playground = {
  args: {
    side: 'bottom',
    align: 'center',
    size: 'default',
    open: true,
  },
  parameters: {
    docs: { story: { inline: true, height: 400 } },
  },
  render: ({ side, align, size, open }) => `
    <div style="min-height: 360px; padding: 120px; display: flex; align-items: center; justify-content: center;">
      <div class="ct-popover${sizeClass(size)}"
           data-side="${side}"
           data-align="${align}"
           data-state="${open ? 'open' : 'closed'}">
        <button class="ct-button ct-popover__trigger"
                aria-expanded="${open}"
                aria-haspopup="dialog"
                aria-controls="pg-popover">
          Open popover
        </button>
        <div class="ct-popover__content"
             id="pg-popover"
             role="dialog"
             aria-labelledby="pg-popover-title">
          <div class="ct-popover__header">
            <h3 id="pg-popover-title">Settings</h3>
            <button class="ct-button ct-button--ghost ct-button--sm" aria-label="Close">&#x2715;</button>
          </div>
          <div class="ct-popover__body">
            <div class="ct-field">
              <label class="ct-field__label" for="pg-name">Display name</label>
              <input class="ct-input" id="pg-name" type="text" value="Jane Doe" />
            </div>
          </div>
          <div class="ct-popover__footer">
            <button class="ct-button ct-button--secondary ct-button--sm">Cancel</button>
            <button class="ct-button ct-button--sm">Save</button>
          </div>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open popover' });
    const dialog = canvas.getByRole('dialog');

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(dialog).toHaveAttribute('role', 'dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'pg-popover-title');

    const title = canvasElement.querySelector('#pg-popover-title');
    expect(title).toHaveTextContent('Settings');
  },
};

/**
 * All four side positions with center alignment.
 */
export const Positions = {
  parameters: {
    docs: { story: { inline: true, height: 500 } },
  },
  render: () => {
    const sides = ['top', 'bottom', 'left', 'right'];
    return `
      <div style="min-height: 460px; padding: 140px 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 120px; justify-items: center; align-items: center;">
        ${sides.map((side, i) => `
          <div class="ct-popover"
               data-side="${side}"
               data-align="center"
               data-state="open">
            <button class="ct-button ct-button--secondary ct-popover__trigger"
                    aria-expanded="true"
                    aria-haspopup="dialog"
                    aria-controls="pos-popover-${i}">
              ${side}
            </button>
            <div class="ct-popover__content"
                 id="pos-popover-${i}"
                 role="dialog"
                 aria-label="Example ${side} popover">
              <div class="ct-popover__body">
                <p style="margin: 0; font-size: var(--font-size-sm);">Positioned on <strong>${side}</strong></p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>`;
  },
  play: async ({ canvasElement }) => {
    const dialogs = canvasElement.querySelectorAll('[role="dialog"]');
    expect(dialogs).toHaveLength(4);

    dialogs.forEach((dialog) => {
      expect(dialog).toBeVisible();
    });
  },
};

/**
 * Small, default (md), and large width variants.
 */
export const Sizes = {
  parameters: {
    docs: { story: { inline: true, height: 320 } },
  },
  render: () => {
    const sizes = [
      { cls: 'ct-popover--sm', label: 'Small (240px)' },
      { cls: '', label: 'Default (320px)' },
      { cls: 'ct-popover--lg', label: 'Large (480px)' },
    ];
    return `
      <div style="min-height: 280px; padding: 24px; display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap;">
        ${sizes.map(({ cls, label }, i) => `
          <div class="ct-popover ${cls}"
               data-side="bottom"
               data-align="start"
               data-state="open">
            <button class="ct-button ct-button--secondary ct-popover__trigger"
                    aria-expanded="true"
                    aria-haspopup="dialog"
                    aria-controls="sz-popover-${i}">
              ${label}
            </button>
            <div class="ct-popover__content"
                 id="sz-popover-${i}"
                 role="dialog"
                 aria-label="${label} popover">
              <div class="ct-popover__body">
                <p style="margin: 0; font-size: var(--font-size-sm);">Width: ${label}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>`;
  },
  play: async ({ canvasElement }) => {
    const dialogs = canvasElement.querySelectorAll('[role="dialog"]');
    expect(dialogs).toHaveLength(3);
  },
};

/**
 * Popover with an arrow pointing to the trigger.
 */
export const WithArrow = {
  parameters: {
    docs: { story: { inline: true, height: 320 } },
  },
  render: () => `
    <div style="min-height: 280px; padding: 80px; display: flex; align-items: center; justify-content: center;">
      <div class="ct-popover"
           data-side="bottom"
           data-align="center"
           data-state="open">
        <button class="ct-button ct-popover__trigger"
                aria-expanded="true"
                aria-haspopup="dialog"
                aria-controls="arrow-popover">
          With arrow
        </button>
        <div class="ct-popover__content"
             id="arrow-popover"
             role="dialog"
             aria-label="Arrow popover">
          <span class="ct-popover__arrow"></span>
          <div class="ct-popover__body">
            <p style="margin: 0; font-size: var(--font-size-sm);">
              This popover has a directional arrow.
            </p>
          </div>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const arrow = canvasElement.querySelector('.ct-popover__arrow');
    expect(arrow).toBeInTheDocument();
  },
};

/**
 * Popover with a form inside — demonstrates rich interactive content.
 */
export const FormContent = {
  parameters: {
    docs: { story: { inline: true, height: 420 } },
  },
  render: () => `
    <div style="min-height: 380px; padding: 24px; display: flex; align-items: flex-start;">
      <div class="ct-popover"
           data-side="bottom"
           data-align="start"
           data-state="open">
        <button class="ct-button ct-popover__trigger"
                aria-expanded="true"
                aria-haspopup="dialog"
                aria-controls="form-popover">
          Edit profile
        </button>
        <div class="ct-popover__content"
             id="form-popover"
             role="dialog"
             aria-labelledby="form-popover-title">
          <div class="ct-popover__header">
            <h3 id="form-popover-title">Edit profile</h3>
            <button class="ct-button ct-button--ghost ct-button--sm" aria-label="Close">&#x2715;</button>
          </div>
          <div class="ct-popover__body">
            <div class="ct-field">
              <label class="ct-field__label" for="form-name">Name</label>
              <input class="ct-input" id="form-name" type="text" placeholder="Your name" />
            </div>
            <div class="ct-field">
              <label class="ct-field__label" for="form-email">Email</label>
              <input class="ct-input" id="form-email" type="email" placeholder="you@example.com" />
            </div>
          </div>
          <div class="ct-popover__footer">
            <button class="ct-button ct-button--secondary ct-button--sm">Cancel</button>
            <button class="ct-button ct-button--sm">Save changes</button>
          </div>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog');

    expect(dialog).toHaveAttribute('aria-labelledby', 'form-popover-title');

    const nameInput = canvas.getByLabelText('Name');
    const emailInput = canvas.getByLabelText('Email');
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    await userEvent.click(nameInput);
    expect(nameInput).toHaveFocus();

    await userEvent.type(nameInput, 'Jane');
    expect(nameInput).toHaveValue('Jane');

    await userEvent.tab();
    expect(emailInput).toHaveFocus();
  },
};

/**
 * Closed state — popover is hidden.
 */
export const Closed = {
  parameters: {
    docs: { story: { inline: true, height: 120 } },
  },
  render: () => `
    <div style="padding: 24px;">
      <div class="ct-popover"
           data-side="bottom"
           data-align="start"
           data-state="closed">
        <button class="ct-button ct-popover__trigger"
                aria-expanded="false"
                aria-haspopup="dialog"
                aria-controls="closed-popover">
          Closed popover
        </button>
        <div class="ct-popover__content"
             id="closed-popover"
             role="dialog"
             aria-label="Hidden popover">
          <div class="ct-popover__body">
            <p style="margin: 0;">You should not see this.</p>
          </div>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Closed popover' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    const content = canvasElement.querySelector('.ct-popover__content');
    expect(content).not.toBeVisible();
  },
};
