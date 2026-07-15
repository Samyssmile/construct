import { expect } from 'storybook/test';

export default {
  title: 'Foundations/Theme Scope Contract',
  parameters: {
    docs: {
      description: {
        component:
          'Explicit theme scopes redeclare the complete semantic/component token contract and the native `color-scheme` property. Nested native controls therefore follow their nearest light, dark, or high-contrast scope instead of inheriting a parent theme.',
      },
    },
  },
};

export const NestedNativeControls = {
  render: () => `
    <section data-theme="light" data-testid="light-scope"
      style="padding: var(--space-5); background: var(--color-bg-canvas); color: var(--color-text-primary);">
      <label class="ct-field">
        <span class="ct-field__label">Light control</span>
        <input class="ct-input" type="text" value="Light" />
      </label>
      <section data-theme="dark" data-testid="dark-scope"
        style="margin-top: var(--space-4); padding: var(--space-5); background: var(--color-bg-canvas); color: var(--color-text-primary);">
        <label class="ct-field">
          <span class="ct-field__label">Dark control</span>
          <input class="ct-input" type="text" value="Dark" />
        </label>
        <section data-theme="high-contrast" data-testid="contrast-scope"
          style="margin-top: var(--space-4); padding: var(--space-5); background: var(--color-bg-canvas); color: var(--color-text-primary);">
          <label class="ct-field">
            <span class="ct-field__label">High-contrast control</span>
            <input class="ct-input" type="text" value="High contrast" />
          </label>
        </section>
      </section>
    </section>`,
  play: async ({ canvasElement }) => {
    const light = canvasElement.querySelector('[data-testid="light-scope"]');
    const dark = canvasElement.querySelector('[data-testid="dark-scope"]');
    const contrast = canvasElement.querySelector('[data-testid="contrast-scope"]');
    const [lightInput, darkInput, contrastInput] = canvasElement.querySelectorAll('input');

    expect(getComputedStyle(light).colorScheme).toBe('light');
    expect(getComputedStyle(lightInput).colorScheme).toBe('light');
    expect(getComputedStyle(dark).colorScheme).toBe('dark');
    expect(getComputedStyle(darkInput).colorScheme).toBe('dark');
    expect(getComputedStyle(contrast).colorScheme).toBe('light');
    expect(getComputedStyle(contrastInput).colorScheme).toBe('light');

    expect(getComputedStyle(dark).backgroundColor).not.toBe(
      getComputedStyle(light).backgroundColor,
    );
  },
};
