import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Forms/Toggle Group',
  parameters: {
    docs: {
      description: {
        component: 'Button group for single or multi-select mode. Uses `role="group"` and `aria-pressed` on each item for accessible state management. Suitable for view mode switchers and filter toggles.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Toggle group size',
    },
    label: { control: 'text', description: 'Accessible group label' },
  },
};

export const Playground = {
  args: {
    size: 'md',
    label: 'View mode',
  },
  render: ({ size, label }) => {
    const sizeClass = size !== 'md' ? ` ct-toggle-group--${size}` : '';
    return `
    <div class="ct-toggle-group${sizeClass}" role="group" aria-label="${label}">
      <button class="ct-toggle-group__item" type="button" aria-pressed="true">List</button>
      <button class="ct-toggle-group__item" type="button" aria-pressed="false">Grid</button>
      <button class="ct-toggle-group__item" type="button" aria-pressed="false">Board</button>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvasElement.querySelector('[role="group"]');
    expect(group).toBeInTheDocument();
    const buttons = within(group).getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  },
};

export const SingleSelect = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">View mode</p>
      <div class="ct-toggle-group" role="group" aria-label="View mode">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true">List</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Grid</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Board</button>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', { name: 'View mode' });
    const buttons = within(group).getAllByRole('button');

    expect(buttons).toHaveLength(3);

    // Initial state: exactly one item is pressed
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'false');

    // All buttons use type="button" (prevent accidental form submission)
    for (const btn of buttons) {
      expect(btn).toHaveAttribute('type', 'button');
    }

    // Every button has an aria-pressed attribute (not missing)
    for (const btn of buttons) {
      expect(btn).toHaveAttribute('aria-pressed');
      const val = btn.getAttribute('aria-pressed');
      expect(val === 'true' || val === 'false').toBe(true);
    }

    // Click on unpressed button moves focus
    await userEvent.click(buttons[1]);
    expect(buttons[1]).toHaveFocus();

    // Keyboard: Enter activates a focused toggle button
    buttons[2].focus();
    let enterClicked = false;
    buttons[2].addEventListener('click', () => { enterClicked = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(enterClicked).toBe(true);

    // Keyboard: Space also activates a focused toggle button
    buttons[0].focus();
    let spaceClicked = false;
    buttons[0].addEventListener('click', () => { spaceClicked = true; }, { once: true });
    await userEvent.keyboard(' ');
    expect(spaceClicked).toBe(true);
  },
};

export const MultipleSelect = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Filter by status</p>
      <div class="ct-toggle-group" role="group" aria-label="Status filter">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true">Open</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="true">Pending</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Resolved</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Rejected</button>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', { name: 'Status filter' });
    const buttons = within(group).getAllByRole('button');

    expect(buttons).toHaveLength(4);

    // Multiple items can be pressed simultaneously
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'false');
    expect(buttons[3]).toHaveAttribute('aria-pressed', 'false');

    // Count pressed items
    const pressedCount = buttons.filter(b => b.getAttribute('aria-pressed') === 'true').length;
    expect(pressedCount).toBe(2);

    // All buttons have type="button"
    for (const btn of buttons) {
      expect(btn).toHaveAttribute('type', 'button');
    }

    // Click interaction: each button is independently clickable and focusable
    await userEvent.click(buttons[2]);
    expect(buttons[2]).toHaveFocus();

    await userEvent.click(buttons[3]);
    expect(buttons[3]).toHaveFocus();

    // All buttons are enabled
    for (const btn of buttons) {
      expect(btn).toBeEnabled();
    }
  },
};

export const Sizes = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Small</p>
      <div class="ct-toggle-group ct-toggle-group--sm" role="group" aria-label="Size small">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true">Day</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Week</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Month</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Default</p>
      <div class="ct-toggle-group" role="group" aria-label="Size default">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true">Day</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Week</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Month</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Large</p>
      <div class="ct-toggle-group ct-toggle-group--lg" role="group" aria-label="Size large">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true">Day</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Week</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false">Month</button>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Three size variants, each a labeled group
    const groups = canvas.getAllByRole('group');
    expect(groups).toHaveLength(3);

    const expectedLabels = ['Size small', 'Size default', 'Size large'];
    for (let i = 0; i < groups.length; i++) {
      expect(groups[i]).toHaveAttribute('aria-label', expectedLabels[i]);

      const buttons = within(groups[i]).getAllByRole('button');
      expect(buttons).toHaveLength(3);

      // Each group has exactly one pressed item
      const pressed = buttons.filter(b => b.getAttribute('aria-pressed') === 'true');
      expect(pressed).toHaveLength(1);
      expect(pressed[0]).toHaveTextContent('Day');

      // All buttons have aria-pressed and type="button"
      for (const btn of buttons) {
        expect(btn).toHaveAttribute('aria-pressed');
        expect(btn).toHaveAttribute('type', 'button');
      }
    }
  },
};

export const Disabled = {
  render: () => `
  <div class="ct-toggle-group" role="group" aria-label="Disabled example">
    <button class="ct-toggle-group__item" type="button" aria-pressed="true">Active</button>
    <button class="ct-toggle-group__item" type="button" aria-pressed="false" disabled>Disabled</button>
    <button class="ct-toggle-group__item" type="button" aria-pressed="false">Available</button>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', { name: 'Disabled example' });
    const buttons = within(group).getAllByRole('button');

    expect(buttons).toHaveLength(3);

    // Active button is pressed and enabled
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[0]).toBeEnabled();

    // Middle button is disabled and not pressed
    expect(buttons[1]).toBeDisabled();
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');

    // Available button is enabled but not pressed
    expect(buttons[2]).toBeEnabled();
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'false');

    // Click on active (enabled) button gives focus
    await userEvent.click(buttons[0]);
    expect(buttons[0]).toHaveFocus();

    // Click on available button gives focus
    await userEvent.click(buttons[2]);
    expect(buttons[2]).toHaveFocus();

    // Disabled button cannot receive focus via click
    buttons[1].click();
    expect(buttons[1]).not.toHaveFocus();
  },
};
