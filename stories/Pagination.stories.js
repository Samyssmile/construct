import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Navigation/Pagination',
  parameters: {
    docs: {
      description: {
        component:
          'Accessible pagination component with `nav` landmark, `aria-current="page"` for the active page, ellipsis for truncated ranges, size variants (sm/md/lg), responsive collapse on small viewports, and full keyboard support.',
      },
    },
  },
};

/**
 * Generates pagination HTML with prev/next buttons, page numbers, and optional ellipsis.
 *
 * @param {object} options - Configuration for the pagination component.
 * @param {number} options.current - The currently active page (1-based).
 * @param {number} options.total - Total number of pages.
 * @param {string} [options.size] - Size variant: 'sm', 'lg', or undefined for default.
 * @param {boolean} [options.showPrevNext=true] - Whether to show prev/next buttons.
 * @param {boolean} [options.showFirstLast=false] - Whether to show first/last buttons.
 * @param {string} [options.label='Pagination'] - Accessible label for the nav element.
 * @returns {string} HTML string.
 */
function renderPagination({
  current,
  total,
  size,
  showPrevNext = true,
  showFirstLast = false,
  label = 'Pagination',
}) {
  const sizeClass = size ? ` ct-pagination--${size}` : '';
  const pages = buildPageRange(current, total);

  const prevDisabled = current <= 1;
  const nextDisabled = current >= total;

  let items = '';

  if (showFirstLast) {
    items += `<li><button class="ct-pagination__link" type="button" aria-label="First page"${prevDisabled ? ' aria-disabled="true"' : ''}>\u00AB</button></li>\n      `;
  }
  if (showPrevNext) {
    items += `<li><button class="ct-pagination__link" type="button" aria-label="Previous page"${prevDisabled ? ' aria-disabled="true"' : ''}>\u2039</button></li>\n      `;
  }

  for (const page of pages) {
    if (page === '...') {
      items += `<li class="ct-pagination__page-item"><span class="ct-pagination__ellipsis" aria-hidden="true">\u2026</span></li>\n      `;
    } else {
      const isCurrent = page === current;
      const activeItemClass = isCurrent ? ' ct-pagination__page-item--active' : '';
      items += `<li class="ct-pagination__page-item${activeItemClass}"><button class="ct-pagination__link" type="button"${isCurrent ? ' aria-current="page"' : ''} aria-label="Page ${page}${isCurrent ? ', current page' : ''}">${page}</button></li>\n      `;
    }
  }

  if (showPrevNext) {
    items += `<li><button class="ct-pagination__link" type="button" aria-label="Next page"${nextDisabled ? ' aria-disabled="true"' : ''}>\u203A</button></li>\n      `;
  }
  if (showFirstLast) {
    items += `<li><button class="ct-pagination__link" type="button" aria-label="Last page"${nextDisabled ? ' aria-disabled="true"' : ''}>\u00BB</button></li>`;
  }

  return `
  <nav class="ct-pagination${sizeClass}" aria-label="${label}">
    <ul class="ct-pagination__list">
      ${items}
    </ul>
  </nav>`;
}

/**
 * Builds a page range array with ellipsis for truncated ranges.
 * Always shows first page, last page, and a window around the current page.
 */
function buildPageRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total]);
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('...');
    }
    result.push(sorted[i]);
  }

  return result;
}

/* ── Stories ───────────────────────────────────────────────── */

export const Default = {
  render: () => renderPagination({ current: 3, total: 7 }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Pagination' });
    const buttons = within(nav).getAllByRole('button');

    // Has prev/next + 7 page buttons = 9 total
    expect(buttons).toHaveLength(9);

    // Current page is marked
    const currentBtn = buttons.find(
      (b) => b.getAttribute('aria-current') === 'page'
    );
    expect(currentBtn).toHaveTextContent('3');

    // Prev is not disabled (page 3)
    const prevBtn = canvas.getByRole('button', { name: 'Previous page' });
    expect(prevBtn).not.toHaveAttribute('aria-disabled');

    // Every page button has descriptive aria-label
    const pageButtons = buttons.filter((b) =>
      b.getAttribute('aria-label')?.startsWith('Page ')
    );
    for (const btn of pageButtons) {
      expect(btn.getAttribute('aria-label')).toMatch(/Page \d/);
    }
  },
};

export const WithEllipsis = {
  render: () => renderPagination({ current: 5, total: 20 }),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation');
    const ellipses = nav.querySelectorAll('.ct-pagination__ellipsis');

    // Ellipsis elements exist for truncated ranges
    expect(ellipses.length).toBeGreaterThanOrEqual(1);

    // Ellipsis is hidden from assistive technology
    for (const el of ellipses) {
      expect(el).toHaveAttribute('aria-hidden', 'true');
    }

    // First and last pages are always visible
    const buttons = within(nav).getAllByRole('button');
    const labels = buttons.map((b) => b.getAttribute('aria-label'));
    expect(labels).toContain('Page 1');
    expect(labels).toContain('Page 20');
  },
};

export const FirstPage = {
  render: () => renderPagination({ current: 1, total: 10 }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Previous is disabled on first page
    const prevBtn = canvas.getByRole('button', { name: 'Previous page' });
    expect(prevBtn).toHaveAttribute('aria-disabled', 'true');

    // Next is enabled
    const nextBtn = canvas.getByRole('button', { name: 'Next page' });
    expect(nextBtn).not.toHaveAttribute('aria-disabled');

    // Page 1 is current
    const page1 = canvas.getByRole('button', { name: /Page 1, current/ });
    expect(page1).toHaveAttribute('aria-current', 'page');
  },
};

export const LastPage = {
  render: () => renderPagination({ current: 10, total: 10 }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Next is disabled on last page
    const nextBtn = canvas.getByRole('button', { name: 'Next page' });
    expect(nextBtn).toHaveAttribute('aria-disabled', 'true');

    // Previous is enabled
    const prevBtn = canvas.getByRole('button', { name: 'Previous page' });
    expect(prevBtn).not.toHaveAttribute('aria-disabled');

    // Page 10 is current
    const page10 = canvas.getByRole('button', { name: /Page 10, current/ });
    expect(page10).toHaveAttribute('aria-current', 'page');
  },
};

export const SinglePage = {
  render: () => renderPagination({ current: 1, total: 1 }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation');

    // Both prev and next are disabled
    const prevBtn = canvas.getByRole('button', { name: 'Previous page' });
    const nextBtn = canvas.getByRole('button', { name: 'Next page' });
    expect(prevBtn).toHaveAttribute('aria-disabled', 'true');
    expect(nextBtn).toHaveAttribute('aria-disabled', 'true');

    // Only one page button
    const pageButtons = within(nav)
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-label')?.startsWith('Page '));
    expect(pageButtons).toHaveLength(1);
    expect(pageButtons[0]).toHaveAttribute('aria-current', 'page');
  },
};

export const ManyPages = {
  render: () => renderPagination({ current: 50, total: 100 }),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation');
    const ellipses = nav.querySelectorAll('.ct-pagination__ellipsis');

    // Two ellipsis elements (left and right truncation)
    expect(ellipses).toHaveLength(2);

    // Current page is in the middle
    const buttons = within(nav).getAllByRole('button');
    const current = buttons.find(
      (b) => b.getAttribute('aria-current') === 'page'
    );
    expect(current).toHaveTextContent('50');

    // First and last page visible
    const labels = buttons.map((b) => b.getAttribute('aria-label'));
    expect(labels).toContain('Page 1');
    expect(labels).toContain('Page 100');
  },
};

export const WithFirstLastButtons = {
  render: () =>
    renderPagination({
      current: 5,
      total: 20,
      showFirstLast: true,
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // First and last buttons exist
    const firstBtn = canvas.getByRole('button', { name: 'First page' });
    const lastBtn = canvas.getByRole('button', { name: 'Last page' });
    expect(firstBtn).toBeInTheDocument();
    expect(lastBtn).toBeInTheDocument();

    // They are not disabled when not on first/last page
    expect(firstBtn).not.toHaveAttribute('aria-disabled');
    expect(lastBtn).not.toHaveAttribute('aria-disabled');
  },
};

export const FirstLastDisabled = {
  render: () =>
    renderPagination({
      current: 1,
      total: 20,
      showFirstLast: true,
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // First and prev are disabled on page 1
    const firstBtn = canvas.getByRole('button', { name: 'First page' });
    const prevBtn = canvas.getByRole('button', { name: 'Previous page' });
    expect(firstBtn).toHaveAttribute('aria-disabled', 'true');
    expect(prevBtn).toHaveAttribute('aria-disabled', 'true');
  },
};

export const Sizes = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-8);">
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Small</p>
      ${renderPagination({ current: 3, total: 7, size: 'sm', label: 'Small pagination' })}
    </div>
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Medium (default)</p>
      ${renderPagination({ current: 3, total: 7, label: 'Medium pagination' })}
    </div>
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Large</p>
      ${renderPagination({ current: 3, total: 7, size: 'lg', label: 'Large pagination' })}
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const smNav = canvasElement.querySelector('.ct-pagination--sm');
    const lgNav = canvasElement.querySelector('.ct-pagination--lg');

    expect(smNav).toBeInTheDocument();
    expect(lgNav).toBeInTheDocument();

    // All variants have accessible labels
    const navs = canvasElement.querySelectorAll('[aria-label]');
    expect(navs.length).toBeGreaterThanOrEqual(3);

    // Default variant has no size class
    const defaultNav = canvasElement.querySelector(
      '.ct-pagination:not(.ct-pagination--sm):not(.ct-pagination--lg)'
    );
    expect(defaultNav).toBeInTheDocument();
  },
};

export const KeyboardNavigation = {
  render: () => renderPagination({ current: 3, total: 7, label: 'Keyboard test' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');

    // Focus first button (Previous)
    buttons[0].focus();
    expect(buttons[0]).toHaveFocus();

    // Tab moves to next button
    await userEvent.tab();
    expect(buttons[1]).toHaveFocus();

    // Enter activates a button
    buttons[3].focus();
    let activated = false;
    buttons[3].addEventListener('click', () => { activated = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(activated).toBe(true);

    // Space activates a button
    buttons[4].focus();
    let spaceActivated = false;
    buttons[4].addEventListener('click', () => { spaceActivated = true; }, { once: true });
    await userEvent.keyboard(' ');
    expect(spaceActivated).toBe(true);
  },
};

export const FocusVisible = {
  render: () => renderPagination({ current: 3, total: 7, label: 'Focus test' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Focus test' });
    const buttons = within(nav).getAllByRole('button');

    // All non-disabled buttons are focusable
    for (const btn of buttons) {
      if (btn.getAttribute('aria-disabled') !== 'true') {
        btn.focus();
        expect(btn).toHaveFocus();
      }
    }

    // Focus ring uses the system pattern
    const firstPageBtn = buttons.find(
      (b) => b.getAttribute('aria-label') === 'Page 1'
    );
    firstPageBtn.focus();
    const styles = window.getComputedStyle(firstPageBtn);
    expect(styles.outlineStyle).not.toBe('none');
  },
};

export const Responsive = {
  render: () => `
  <div style="max-width: 320px; border: 1px dashed var(--color-border-subtle); padding: var(--space-4); border-radius: var(--radius-md);">
    <p class="ct-muted" style="margin-bottom: var(--space-3); font-size: var(--font-size-xs);">
      Simulated narrow viewport (320px). On viewports &le; 480px, only prev/next and the current page are shown.
    </p>
    ${renderPagination({ current: 5, total: 20, label: 'Responsive pagination' })}
  </div>
`,
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation');

    // Page items use the responsive class
    const pageItems = nav.querySelectorAll('.ct-pagination__page-item');
    expect(pageItems.length).toBeGreaterThanOrEqual(1);

    // Active page item has the active class
    const activeItem = nav.querySelector('.ct-pagination__page-item--active');
    expect(activeItem).toBeInTheDocument();

    // Prev/Next buttons are always present (not inside page-item)
    const prevBtn = within(nav).getByRole('button', { name: 'Previous page' });
    const nextBtn = within(nav).getByRole('button', { name: 'Next page' });
    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();
  },
};

export const CustomProperties = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Custom themed pagination</p>
      <nav class="ct-pagination" aria-label="Custom themed" style="
        --ct-pagination-bg-active: var(--color-state-success);
        --ct-pagination-border-active: var(--color-state-success);
        --ct-pagination-radius: var(--radius-pill);
      ">
        <ul class="ct-pagination__list">
          <li><button class="ct-pagination__link" type="button" aria-label="Previous page">\u2039</button></li>
          <li class="ct-pagination__page-item"><button class="ct-pagination__link" type="button" aria-label="Page 1">1</button></li>
          <li class="ct-pagination__page-item ct-pagination__page-item--active"><button class="ct-pagination__link" type="button" aria-current="page" aria-label="Page 2, current page">2</button></li>
          <li class="ct-pagination__page-item"><button class="ct-pagination__link" type="button" aria-label="Page 3">3</button></li>
          <li><button class="ct-pagination__link" type="button" aria-label="Next page">\u203A</button></li>
        </ul>
      </nav>
    </div>
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Rounded pill variant</p>
      <nav class="ct-pagination" aria-label="Pill variant" style="--ct-pagination-radius: var(--radius-pill);">
        <ul class="ct-pagination__list">
          <li><button class="ct-pagination__link" type="button" aria-label="Previous page">\u2039</button></li>
          <li class="ct-pagination__page-item"><button class="ct-pagination__link" type="button" aria-label="Page 1">1</button></li>
          <li class="ct-pagination__page-item ct-pagination__page-item--active"><button class="ct-pagination__link" type="button" aria-current="page" aria-label="Page 2, current page">2</button></li>
          <li class="ct-pagination__page-item"><button class="ct-pagination__link" type="button" aria-label="Page 3">3</button></li>
          <li><button class="ct-pagination__link" type="button" aria-label="Next page">\u203A</button></li>
        </ul>
      </nav>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const navs = canvasElement.querySelectorAll('.ct-pagination');
    expect(navs).toHaveLength(2);

    // Both have proper ARIA
    for (const nav of navs) {
      expect(nav).toHaveAttribute('aria-label');
    }
  },
};
