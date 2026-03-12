import { expect, within, userEvent } from 'storybook/test';

const chevron = `<svg class="ct-accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;

export default {
  title: 'Components/Accordion',
  parameters: {
    docs: {
      description: {
        component: 'Collapsible content panels built on native `<details>`/`<summary>` elements. Supports default and bordered variants with animated chevron indicators and full keyboard accessibility.',
      },
    },
  },
  argTypes: {
    heading: { control: 'text', description: 'Trigger heading text' },
    content: { control: 'text', description: 'Panel content text' },
    variant: {
      control: 'select',
      options: ['default', 'bordered'],
      description: 'Visual style variant',
    },
    open: { control: 'boolean', description: 'Initially expanded' },
  },
};

export const Playground = {
  args: {
    heading: 'Accordion item',
    content: 'This is the panel content that appears when the accordion item is expanded.',
    variant: 'default',
    open: true,
  },
  render: ({ heading, content, variant, open }) => {
    const variantClass = variant === 'bordered' ? ' ct-accordion--bordered' : '';
    return `
    <div class="ct-accordion${variantClass}">
      <details class="ct-accordion__item"${open ? ' open' : ''}>
        <summary class="ct-accordion__trigger">
          <h3 class="ct-accordion__heading">${heading}</h3>
          ${chevron}
        </summary>
        <div class="ct-accordion__content">
          <p>${content}</p>
        </div>
      </details>
    </div>
    `;
  },
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('details.ct-accordion__item');
    const trigger = canvasElement.querySelector('summary.ct-accordion__trigger');
    expect(item).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();

    // Heading is present inside trigger
    const heading = trigger.querySelector('h3.ct-accordion__heading');
    expect(heading).toBeInTheDocument();
  },
};

export const Default = {
  render: () => `
  <div class="ct-accordion">
    <details class="ct-accordion__item" open>
      <summary class="ct-accordion__trigger">
        <h3 class="ct-accordion__heading">What is Construct?</h3>
        ${chevron}
      </summary>
      <div class="ct-accordion__content">
        <p>Construct is a token-based, framework-agnostic design system providing CSS component styles, design tokens, and accessibility-first UI patterns.</p>
      </div>
    </details>
    <details class="ct-accordion__item">
      <summary class="ct-accordion__trigger">
        <h3 class="ct-accordion__heading">Which frameworks are supported?</h3>
        ${chevron}
      </summary>
      <div class="ct-accordion__content">
        <p>Construct works with any framework — Angular, React, Svelte, Vue — or vanilla HTML/CSS.</p>
      </div>
    </details>
    <details class="ct-accordion__item">
      <summary class="ct-accordion__trigger">
        <h3 class="ct-accordion__heading">Is it accessible?</h3>
        ${chevron}
      </summary>
      <div class="ct-accordion__content">
        <p>Yes. All components use semantic HTML, full keyboard navigation, proper ARIA attributes, and WCAG 2.1 AA contrast.</p>
      </div>
    </details>
  </div>
`,
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('details.ct-accordion__item');
    expect(items).toHaveLength(3);

    // First item open by default, others closed
    expect(items[0]).toHaveAttribute('open');
    expect(items[1]).not.toHaveAttribute('open');
    expect(items[2]).not.toHaveAttribute('open');

    // Triggers use native <summary> elements with headings
    const triggers = canvasElement.querySelectorAll('summary.ct-accordion__trigger');
    expect(triggers).toHaveLength(3);

    const headings = canvasElement.querySelectorAll('h3.ct-accordion__heading');
    expect(headings).toHaveLength(3);

    // Icons are decorative
    canvasElement.querySelectorAll('.ct-accordion__icon').forEach(icon => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    // Click: toggle second item open and closed
    await userEvent.click(triggers[1]);
    expect(items[1]).toHaveAttribute('open');
    await userEvent.click(triggers[1]);
    expect(items[1]).not.toHaveAttribute('open');

    // Click: toggle third item
    await userEvent.click(triggers[2]);
    expect(items[2]).toHaveAttribute('open');
    await userEvent.click(triggers[2]);
    expect(items[2]).not.toHaveAttribute('open');

    // Multiple items can be open simultaneously
    await userEvent.click(triggers[1]);
    await userEvent.click(triggers[2]);
    expect(items[0]).toHaveAttribute('open');
    expect(items[1]).toHaveAttribute('open');
    expect(items[2]).toHaveAttribute('open');

    // Open content is visible
    expect(items[0].querySelector('.ct-accordion__content')).toBeVisible();

    // Keyboard: all triggers are focusable (native <summary> guarantees Enter/Space toggle)
    triggers.forEach(trigger => {
      trigger.focus();
      expect(trigger).toHaveFocus();
    });
  },
};

export const Exclusive = {
  render: () => `
  <div class="ct-accordion">
    <details class="ct-accordion__item" name="faq" open>
      <summary class="ct-accordion__trigger">
        <h3 class="ct-accordion__heading">What is Construct?</h3>
        ${chevron}
      </summary>
      <div class="ct-accordion__content">
        <p>Construct is a token-based, framework-agnostic design system providing CSS component styles, design tokens, and accessibility-first UI patterns.</p>
      </div>
    </details>
    <details class="ct-accordion__item" name="faq">
      <summary class="ct-accordion__trigger">
        <h3 class="ct-accordion__heading">Which frameworks are supported?</h3>
        ${chevron}
      </summary>
      <div class="ct-accordion__content">
        <p>Construct works with any framework — Angular, React, Svelte, Vue — or vanilla HTML/CSS.</p>
      </div>
    </details>
    <details class="ct-accordion__item" name="faq">
      <summary class="ct-accordion__trigger">
        <h3 class="ct-accordion__heading">Is it accessible?</h3>
        ${chevron}
      </summary>
      <div class="ct-accordion__content">
        <p>Yes. All components use semantic HTML, full keyboard navigation, proper ARIA attributes, and WCAG 2.1 AA contrast.</p>
      </div>
    </details>
  </div>
`,
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('details.ct-accordion__item');
    const triggers = canvasElement.querySelectorAll('summary.ct-accordion__trigger');
    expect(items).toHaveLength(3);

    // All items share the same name attribute
    items.forEach(item => {
      expect(item).toHaveAttribute('name', 'faq');
    });

    // First item is open by default
    expect(items[0]).toHaveAttribute('open');
    expect(items[1]).not.toHaveAttribute('open');
    expect(items[2]).not.toHaveAttribute('open');

    // Opening second item closes the first (exclusive behavior)
    await userEvent.click(triggers[1]);
    expect(items[0]).not.toHaveAttribute('open');
    expect(items[1]).toHaveAttribute('open');
    expect(items[2]).not.toHaveAttribute('open');

    // Opening third item closes the second
    await userEvent.click(triggers[2]);
    expect(items[0]).not.toHaveAttribute('open');
    expect(items[1]).not.toHaveAttribute('open');
    expect(items[2]).toHaveAttribute('open');
  },
};

export const Bordered = {
  render: () => `
  <div class="ct-accordion ct-accordion--bordered">
    <details class="ct-accordion__item" open>
      <summary class="ct-accordion__trigger">
        <h3 class="ct-accordion__heading">Getting started</h3>
        ${chevron}
      </summary>
      <div class="ct-accordion__content">
        <p>Install the package with <code>npm install @construct/design</code> and import <code>components.css</code> into your project.</p>
      </div>
    </details>
    <details class="ct-accordion__item">
      <summary class="ct-accordion__trigger">
        <h3 class="ct-accordion__heading">Theming</h3>
        ${chevron}
      </summary>
      <div class="ct-accordion__content">
        <p>Set <code>data-theme="dark"</code> on the root element or let Construct detect the system preference automatically.</p>
      </div>
    </details>
    <details class="ct-accordion__item">
      <summary class="ct-accordion__trigger">
        <h3 class="ct-accordion__heading">Custom tokens</h3>
        ${chevron}
      </summary>
      <div class="ct-accordion__content">
        <p>Override any design token by redefining the CSS custom property in your own stylesheet.</p>
      </div>
    </details>
  </div>
`,
  play: async ({ canvasElement }) => {
    const accordion = canvasElement.querySelector('.ct-accordion');
    expect(accordion).toHaveClass('ct-accordion--bordered');

    const items = canvasElement.querySelectorAll('details.ct-accordion__item');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveAttribute('open');

    // Toggle works the same in bordered variant
    const trigger = items[1].querySelector('.ct-accordion__trigger');
    await userEvent.click(trigger);
    expect(items[1]).toHaveAttribute('open');
  },
};

export const WithRichContent = {
  render: () => `
  <div class="ct-accordion">
    <details class="ct-accordion__item" open>
      <summary class="ct-accordion__trigger">
        <h3 class="ct-accordion__heading">Keyboard shortcuts</h3>
        ${chevron}
      </summary>
      <div class="ct-accordion__content">
        <ul style="margin: 0; padding-left: var(--space-5);">
          <li><kbd>Tab</kbd> — Move focus to next interactive element</li>
          <li><kbd>Shift + Tab</kbd> — Move focus to previous element</li>
          <li><kbd>Enter</kbd> / <kbd>Space</kbd> — Activate focused element</li>
          <li><kbd>Escape</kbd> — Close overlay or cancel action</li>
        </ul>
      </div>
    </details>
    <details class="ct-accordion__item">
      <summary class="ct-accordion__trigger">
        <h3 class="ct-accordion__heading">Release notes</h3>
        ${chevron}
      </summary>
      <div class="ct-accordion__content">
        <p><strong>v2.1.0</strong> — Added Accordion component</p>
        <p><strong>v2.0.0</strong> — Token pipeline redesign</p>
        <p><strong>v1.5.0</strong> — Dark mode and high-contrast themes</p>
      </div>
    </details>
    <details class="ct-accordion__item">
      <summary class="ct-accordion__trigger">
        <h3 class="ct-accordion__heading">Nested accordion</h3>
        ${chevron}
      </summary>
      <div class="ct-accordion__content">
        <div class="ct-accordion ct-accordion--bordered">
          <details class="ct-accordion__item">
            <summary class="ct-accordion__trigger">
              <h4 class="ct-accordion__heading">Sub-item A</h4>
              ${chevron}
            </summary>
            <div class="ct-accordion__content">
              <p>Nested content works naturally with the same markup pattern.</p>
            </div>
          </details>
          <details class="ct-accordion__item">
            <summary class="ct-accordion__trigger">
              <h4 class="ct-accordion__heading">Sub-item B</h4>
              ${chevron}
            </summary>
            <div class="ct-accordion__content">
              <p>Each level is independently collapsible.</p>
            </div>
          </details>
        </div>
      </div>
    </details>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Rich content renders correctly
    const listItems = canvasElement.querySelectorAll('li');
    expect(listItems.length).toBeGreaterThanOrEqual(4);

    // Nested accordion uses h4 for correct heading hierarchy
    const nestedHeadings = canvasElement.querySelectorAll('h4.ct-accordion__heading');
    expect(nestedHeadings).toHaveLength(2);

    // Nested accordion exists and is toggleable
    const parentItems = canvasElement.querySelectorAll(':scope > .ct-accordion > details');
    const parentTrigger = parentItems[2].querySelector(':scope > .ct-accordion__trigger');
    await userEvent.click(parentTrigger);
    expect(parentItems[2]).toHaveAttribute('open');

    const nestedAccordion = parentItems[2].querySelector('.ct-accordion');
    expect(nestedAccordion).toBeInTheDocument();

    const nestedItems = nestedAccordion.querySelectorAll('details');
    const nestedTrigger = nestedItems[0].querySelector('.ct-accordion__trigger');
    await userEvent.click(nestedTrigger);
    expect(nestedItems[0]).toHaveAttribute('open');

    // Parent stays open when nested item toggles
    expect(parentItems[2]).toHaveAttribute('open');
  },
};
