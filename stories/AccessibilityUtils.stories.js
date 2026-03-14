import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Accessibility/Skip-Link & Visually-Hidden',
  parameters: {
    docs: {
      description: {
        component:
          'Essential accessibility utilities: skip-link for keyboard navigation bypass and visually-hidden for screen-reader-only content. Both are WCAG 2.1 AA requirements.',
      },
    },
  },
};

/* ============================================================
   Skip-Link Stories
   ============================================================ */

export const SkipLink = {
  render: () => `
    <div style="position: relative; min-height: 300px;">
      <a class="ct-skip-link" href="#sl-main">Skip to main content</a>

      <nav style="padding: var(--space-5) var(--space-6); background: var(--color-bg-surface); border-bottom: var(--border-thin) solid var(--color-border-default);">
        <div class="ct-cluster">
          <a href="#" class="ct-button ct-button--ghost">Home</a>
          <a href="#" class="ct-button ct-button--ghost">About</a>
          <a href="#" class="ct-button ct-button--ghost">Services</a>
          <a href="#" class="ct-button ct-button--ghost">Contact</a>
        </div>
      </nav>

      <main id="sl-main" tabindex="-1" style="padding: var(--space-6);">
        <h2>Main Content</h2>
        <p class="ct-muted">Press <kbd>Tab</kbd> to reveal the skip link at the top-left corner. Press <kbd>Enter</kbd> to jump to this content area.</p>
      </main>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const skipLink = canvasElement.querySelector('.ct-skip-link');

    // Is a link element
    expect(skipLink.tagName).toBe('A');

    // Points to main content target
    expect(skipLink).toHaveAttribute('href', '#sl-main');

    // Target element exists and is focusable
    const target = canvasElement.querySelector('#sl-main');
    expect(target).toBeInTheDocument();
    expect(target).toHaveAttribute('tabindex', '-1');

    // Hidden by default via translateY(-100%)
    const defaultStyle = window.getComputedStyle(skipLink);
    expect(defaultStyle.position).toBe('fixed');

    // Becomes visible on focus
    skipLink.focus();
    expect(skipLink).toHaveFocus();
  },
};

export const MultipleSkipLinks = {
  render: () => `
    <div style="position: relative; min-height: 300px;">
      <a class="ct-skip-link" href="#msl-main">Skip to main content</a>
      <a class="ct-skip-link" href="#msl-search">Skip to search</a>

      <header style="padding: var(--space-5) var(--space-6); background: var(--color-bg-surface); border-bottom: var(--border-thin) solid var(--color-border-default);">
        <div class="ct-cluster" style="justify-content: space-between;">
          <div class="ct-cluster">
            <a href="#" class="ct-button ct-button--ghost">Home</a>
            <a href="#" class="ct-button ct-button--ghost">Products</a>
            <a href="#" class="ct-button ct-button--ghost">Docs</a>
          </div>
          <div id="msl-search" tabindex="-1">
            <input class="ct-input" type="search" placeholder="Search..." aria-label="Search">
          </div>
        </div>
      </header>

      <main id="msl-main" tabindex="-1" style="padding: var(--space-6);">
        <h2>Main Content</h2>
        <p class="ct-muted">Tab through: first skip link goes to main content, second to search. Only the focused one is visible.</p>
      </main>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const skipLinks = canvasElement.querySelectorAll('.ct-skip-link');

    // Both skip links exist
    expect(skipLinks).toHaveLength(2);
    expect(skipLinks[0]).toHaveAttribute('href', '#msl-main');
    expect(skipLinks[1]).toHaveAttribute('href', '#msl-search');

    // Each target is focusable
    const mainTarget = canvasElement.querySelector('#msl-main');
    const searchTarget = canvasElement.querySelector('#msl-search');
    expect(mainTarget).toHaveAttribute('tabindex', '-1');
    expect(searchTarget).toHaveAttribute('tabindex', '-1');

    // Tab moves focus between skip links
    skipLinks[0].focus();
    expect(skipLinks[0]).toHaveFocus();

    await userEvent.tab();
    expect(skipLinks[1]).toHaveFocus();
  },
};

export const SkipLinkKeyboardActivation = {
  render: () => `
    <div style="position: relative; min-height: 200px;">
      <a class="ct-skip-link" href="#ska-main"
         onclick="event.preventDefault(); document.getElementById('ska-main').focus();">
        Skip to main content
      </a>
      <nav style="padding: var(--space-4) var(--space-6); background: var(--color-bg-surface);">
        <a href="#" class="ct-button ct-button--ghost">Nav link</a>
      </nav>
      <main id="ska-main" tabindex="-1" style="padding: var(--space-6);">
        <h2>Main Content</h2>
        <p class="ct-muted">The skip link moves focus here when activated via Enter.</p>
      </main>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const skipLink = canvasElement.querySelector('.ct-skip-link');
    const main = canvasElement.querySelector('#ska-main');

    // Focus the skip link
    skipLink.focus();
    expect(skipLink).toHaveFocus();

    // Activate via Enter
    await userEvent.keyboard('{Enter}');

    // Focus moved to main content
    expect(main).toHaveFocus();
  },
};

/* ============================================================
   Visually-Hidden Stories
   ============================================================ */

export const VisuallyHidden = {
  render: () => `
    <div style="padding: var(--space-6);">
      <h3>Visually Hidden Text</h3>
      <p class="ct-muted" style="margin-bottom: var(--space-6);">
        The following element contains text that is invisible on screen but announced by screen readers.
      </p>

      <div class="ct-cluster" style="--ct-cluster-gap: var(--space-6);">
        <button class="ct-button ct-button--danger">
          Delete
          <span class="ct-visually-hidden"> this item permanently</span>
        </button>

        <span>
          Status: <span aria-hidden="true" style="color: var(--color-state-success);">&#x2713;</span>
          <span class="ct-visually-hidden">Completed successfully</span>
        </span>

        <span>
          Rating: <span aria-hidden="true">&#9733;&#9733;&#9733;&#9734;&#9734;</span>
          <span class="ct-visually-hidden">3 out of 5 stars</span>
        </span>
      </div>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const hiddenElements = canvasElement.querySelectorAll('.ct-visually-hidden');
    expect(hiddenElements).toHaveLength(3);

    for (const el of hiddenElements) {
      const style = window.getComputedStyle(el);

      // Visually hidden: 1px x 1px, clipped, absolute
      expect(style.position).toBe('absolute');
      expect(style.width).toBe('1px');
      expect(style.height).toBe('1px');
      expect(style.overflow).toBe('hidden');

      // Still in the DOM (not display:none or visibility:hidden)
      expect(style.display).not.toBe('none');
      expect(style.visibility).not.toBe('hidden');
    }

    // Content is accessible via text content
    const deleteContext = canvasElement.querySelector('.ct-button--danger .ct-visually-hidden');
    expect(deleteContext).toHaveTextContent('this item permanently');
  },
};

export const VisuallyHiddenFocusable = {
  render: () => `
    <div style="padding: var(--space-6);">
      <h3>Focusable Visually-Hidden Element</h3>
      <p class="ct-muted" style="margin-bottom: var(--space-6);">
        Tab to reveal the hidden link. It uses <code>ct-visually-hidden ct-visually-hidden--focusable</code> and becomes visible on focus.
      </p>

      <a class="ct-visually-hidden ct-visually-hidden--focusable" href="#vh-target">
        Skip to section
      </a>

      <div style="padding: var(--space-4); background: var(--color-bg-surface); border-radius: var(--radius-md);">
        <p id="vh-target">Target section content.</p>
      </div>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const focusableEl = canvasElement.querySelector('.ct-visually-hidden--focusable');
    expect(focusableEl).toBeInTheDocument();

    // Hidden by default
    const hiddenStyle = window.getComputedStyle(focusableEl);
    expect(hiddenStyle.position).toBe('absolute');
    expect(hiddenStyle.width).toBe('1px');

    // Becomes visible on focus
    focusableEl.focus();
    expect(focusableEl).toHaveFocus();
    const focusedStyle = window.getComputedStyle(focusableEl);
    expect(focusedStyle.position).toBe('static');
    expect(focusedStyle.width).not.toBe('1px');

    // Hidden again on blur
    focusableEl.blur();
    const blurredStyle = window.getComputedStyle(focusableEl);
    expect(blurredStyle.position).toBe('absolute');
    expect(blurredStyle.width).toBe('1px');
  },
};

export const VisuallyHiddenOnAnyElement = {
  render: () => `
    <div style="padding: var(--space-6);">
      <h3>Works on Any Element</h3>
      <p class="ct-muted" style="margin-bottom: var(--space-6);">
        The visually-hidden class can be applied to any HTML element.
      </p>

      <div>
        <span class="ct-visually-hidden" data-testid="vh-span">Hidden span</span>
        <div class="ct-visually-hidden" data-testid="vh-div">Hidden div</div>
        <label class="ct-visually-hidden" data-testid="vh-label" for="vh-input">Hidden label</label>
        <input id="vh-input" class="ct-input" type="text" placeholder="Input with visually-hidden label">
        <p class="ct-visually-hidden" data-testid="vh-p">Hidden paragraph</p>
      </div>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const elements = {
      span: canvasElement.querySelector('[data-testid="vh-span"]'),
      div: canvasElement.querySelector('[data-testid="vh-div"]'),
      label: canvasElement.querySelector('[data-testid="vh-label"]'),
      p: canvasElement.querySelector('[data-testid="vh-p"]'),
    };

    // All elements are visually hidden
    for (const [tag, el] of Object.entries(elements)) {
      const style = window.getComputedStyle(el);
      expect(style.position).toBe('absolute');
      expect(style.width).toBe('1px');
      expect(style.height).toBe('1px');
    }

    // Label still associates with input
    const input = canvasElement.querySelector('#vh-input');
    const label = elements.label;
    expect(label).toHaveAttribute('for', 'vh-input');
    expect(input).toHaveAttribute('id', 'vh-input');

    // Content is still accessible
    expect(elements.span).toHaveTextContent('Hidden span');
    expect(elements.div).toHaveTextContent('Hidden div');
    expect(elements.p).toHaveTextContent('Hidden paragraph');
  },
};
