import { expect, within, userEvent, waitFor } from 'storybook/test';

export default {
  title: 'Overlays/Tooltip',
  parameters: {
    docs: {
      description: {
        component:
          'Accessible tooltip that appears on hover (pointer devices only) and focus. ' +
          'Uses `@media (hover: hover)` to prevent sticky hover on touch devices. ' +
          'On touch devices, tooltips are accessible via focus/tap on the trigger element. ' +
          'Trigger must use `aria-describedby` pointing to the tooltip `id`, content uses `role="tooltip"`.',
      },
    },
  },
};

export const Playground = {
  parameters: {
    layout: 'centered',
    docs: { story: { inline: true, height: 200 } },
  },
  render: () => `
  <div style="padding: 80px;">
    <span class="ct-tooltip" data-side="top">
      <button class="ct-button ct-button--secondary" aria-describedby="pg-tip">Hover or focus me</button>
      <span class="ct-tooltip__content" role="tooltip" id="pg-tip">Tooltip appears on hover and focus</span>
    </span>
  </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Hover or focus me' });
    const tooltipEl = canvasElement.querySelector('.ct-tooltip__content');

    expect(trigger).toHaveAttribute('aria-describedby', 'pg-tip');
    expect(tooltipEl).toHaveAttribute('role', 'tooltip');

    // Hidden by default
    expect(getComputedStyle(tooltipEl).visibility).toBe('hidden');

    // Shows on focus (universal — works on both touch and pointer devices)
    trigger.focus();
    expect(getComputedStyle(tooltipEl).visibility).toBe('visible');
    await waitFor(() => {
      expect(getComputedStyle(tooltipEl).opacity).toBe('1');
    });
  },
};

export const FocusActivation = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Tooltip opens via `:focus-within` — the universal activation mechanism. ' +
          'Works on all devices including touch (via tap-to-focus). ' +
          'On hover-capable devices, `:hover` is an additional trigger via `@media (hover: hover)`.',
      },
      story: { inline: true, height: 200 },
    },
  },
  render: () => `
  <div style="padding: 80px; display: flex; gap: 48px; align-items: center; justify-content: center;">
    <span class="ct-tooltip" data-side="top">
      <button class="ct-button ct-button--secondary" aria-describedby="focus-tip-1">Tab to me</button>
      <span class="ct-tooltip__content" role="tooltip" id="focus-tip-1">Focus-activated tooltip</span>
    </span>
    <span class="ct-tooltip" data-side="top">
      <a href="#" class="ct-button ct-button--secondary" aria-describedby="focus-tip-2">Or tap me</a>
      <span class="ct-tooltip__content" role="tooltip" id="focus-tip-2">Also works with links</span>
    </span>
  </div>`,
  play: async ({ canvasElement }) => {
    const tip1 = canvasElement.querySelector('#focus-tip-1');
    const tip2 = canvasElement.querySelector('#focus-tip-2');

    // Both hidden initially
    expect(getComputedStyle(tip1).visibility).toBe('hidden');
    expect(getComputedStyle(tip2).visibility).toBe('hidden');

    // Tab to first — shows via :focus-within
    await userEvent.tab();
    expect(getComputedStyle(tip1).visibility).toBe('visible');
    expect(getComputedStyle(tip2).visibility).toBe('hidden');

    // Tab to second — first hides, second shows
    await userEvent.tab();
    expect(getComputedStyle(tip2).visibility).toBe('visible');
    await waitFor(() => {
      expect(getComputedStyle(tip1).visibility).toBe('hidden');
    });

    // Tab away — both hidden
    await userEvent.tab();
    await waitFor(() => {
      expect(getComputedStyle(tip1).visibility).toBe('hidden');
      expect(getComputedStyle(tip2).visibility).toBe('hidden');
    });
  },
};

export const Positions = {
  parameters: {
    layout: 'centered',
    docs: { story: { inline: true, height: 320 } },
  },
  render: () => `
  <div style="padding: 80px; display: flex; gap: 48px; align-items: center; justify-content: center; flex-wrap: wrap;">
    <span class="ct-tooltip" data-side="top" data-state="open">
      <button class="ct-button ct-button--secondary" aria-describedby="pos-top">Top</button>
      <span class="ct-tooltip__content" role="tooltip" id="pos-top">Top tooltip</span>
    </span>
    <span class="ct-tooltip" data-side="bottom" data-state="open">
      <button class="ct-button ct-button--secondary" aria-describedby="pos-bottom">Bottom</button>
      <span class="ct-tooltip__content" role="tooltip" id="pos-bottom">Bottom tooltip</span>
    </span>
    <span class="ct-tooltip" data-side="left" data-state="open">
      <button class="ct-button ct-button--secondary" aria-describedby="pos-left">Left</button>
      <span class="ct-tooltip__content" role="tooltip" id="pos-left">Left tooltip</span>
    </span>
    <span class="ct-tooltip" data-side="right" data-state="open">
      <button class="ct-button ct-button--secondary" aria-describedby="pos-right">Right</button>
      <span class="ct-tooltip__content" role="tooltip" id="pos-right">Right tooltip</span>
    </span>
  </div>`,
  play: async ({ canvasElement }) => {
    const tooltips = canvasElement.querySelectorAll('.ct-tooltip__content');
    const sides = ['top', 'bottom', 'left', 'right'];

    for (const [i, tooltip] of tooltips.entries()) {
      expect(tooltip).toHaveAttribute('role', 'tooltip');
      const wrapper = tooltip.closest('.ct-tooltip');
      expect(wrapper).toHaveAttribute('data-side', sides[i]);
      expect(getComputedStyle(tooltip).visibility).toBe('visible');
    }
  },
};

export const Alignment = {
  parameters: {
    layout: 'centered',
    docs: { story: { inline: true, height: 280 } },
  },
  render: () => `
  <div style="padding: 80px 24px; display: flex; gap: 64px; align-items: center; justify-content: center; flex-wrap: wrap;">
    <span class="ct-tooltip" data-side="bottom" data-align="start" data-state="open">
      <button class="ct-button ct-button--secondary" aria-describedby="align-s">Start</button>
      <span class="ct-tooltip__content" role="tooltip" id="align-s">Aligned to start</span>
    </span>
    <span class="ct-tooltip" data-side="bottom" data-state="open">
      <button class="ct-button ct-button--secondary" aria-describedby="align-c">Center</button>
      <span class="ct-tooltip__content" role="tooltip" id="align-c">Center (default)</span>
    </span>
    <span class="ct-tooltip" data-side="bottom" data-align="end" data-state="open">
      <button class="ct-button ct-button--secondary" aria-describedby="align-e">End</button>
      <span class="ct-tooltip__content" role="tooltip" id="align-e">Aligned to end</span>
    </span>
  </div>`,
  play: async ({ canvasElement }) => {
    const tooltips = canvasElement.querySelectorAll('.ct-tooltip');
    expect(tooltips[0]).toHaveAttribute('data-align', 'start');
    expect(tooltips[1]).not.toHaveAttribute('data-align');
    expect(tooltips[2]).toHaveAttribute('data-align', 'end');

    for (const wrapper of tooltips) {
      const content = wrapper.querySelector('.ct-tooltip__content');
      expect(getComputedStyle(content).visibility).toBe('visible');
    }
  },
};

export const TouchAccessibility = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Demonstrates touch-device accessibility. Hover activation is guarded by ' +
          '`@media (hover: hover)` — on touch devices, only focus/tap activates the tooltip. ' +
          'No sticky hover states remain after touch interaction. ' +
          'Resize viewport to mobile size to simulate touch behavior.',
      },
      story: { inline: true, height: 280 },
    },
  },
  render: () => `
  <div style="padding: 80px; display: flex; flex-direction: column; gap: 32px; align-items: center;">
    <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap; justify-content: center;">
      <span class="ct-tooltip" data-side="top">
        <button class="ct-button" aria-describedby="touch-tip-1">Save</button>
        <span class="ct-tooltip__content" role="tooltip" id="touch-tip-1">Save your changes</span>
      </span>
      <span class="ct-tooltip" data-side="top">
        <button class="ct-button ct-button--secondary ct-button--icon" aria-describedby="touch-tip-2" aria-label="Settings">
          <span class="ct-button__icon" aria-hidden="true">&#9881;</span>
        </button>
        <span class="ct-tooltip__content" role="tooltip" id="touch-tip-2">Settings</span>
      </span>
      <span class="ct-tooltip" data-side="top">
        <button class="ct-button ct-button--ghost ct-button--icon" aria-describedby="touch-tip-3" aria-label="Delete">
          <span class="ct-button__icon" aria-hidden="true">&#128465;</span>
        </button>
        <span class="ct-tooltip__content" role="tooltip" id="touch-tip-3">Delete item</span>
      </span>
    </div>
    <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-align: center; max-width: 400px;">
      Icon-only buttons use tooltips to expose their label. On touch devices, focus reveals the tooltip — no hover required.
    </p>
  </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tips = canvasElement.querySelectorAll('.ct-tooltip__content');

    // All hidden initially
    for (const tip of tips) {
      expect(getComputedStyle(tip).visibility).toBe('hidden');
    }

    // Focus on first button reveals its tooltip
    const saveBtn = canvas.getByRole('button', { name: 'Save' });
    saveBtn.focus();
    expect(getComputedStyle(tips[0]).visibility).toBe('visible');

    // All tooltips have proper ARIA linkage
    const triggers = canvasElement.querySelectorAll('[aria-describedby]');
    for (const trigger of triggers) {
      const tipId = trigger.getAttribute('aria-describedby');
      const tipEl = canvasElement.querySelector(`#${tipId}`);
      expect(tipEl).toHaveAttribute('role', 'tooltip');
      expect(canvasElement.querySelectorAll(`#${tipId}`)).toHaveLength(1);
    }

    // Tab through all buttons — each tooltip shows in turn
    await userEvent.tab();
    expect(getComputedStyle(tips[1]).visibility).toBe('visible');

    await userEvent.tab();
    expect(getComputedStyle(tips[2]).visibility).toBe('visible');
  },
};
