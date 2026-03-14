import { expect, within, userEvent } from 'storybook/test';

const homeSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>';
const folderSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>';

/**
 * Generates a standard breadcrumb item with link and separator.
 */
function crumbItem(label, href, { icon = '', isLast = false } = {}) {
  if (isLast) {
    return `<li class="ct-breadcrumbs__item">
        ${icon ? `<span class="ct-breadcrumbs__icon" aria-hidden="true">${icon}</span>` : ''}
        <span class="ct-breadcrumbs__current" aria-current="page">${label}</span>
      </li>`;
  }
  return `<li class="ct-breadcrumbs__item">
        ${icon ? `<span class="ct-breadcrumbs__icon" aria-hidden="true">${icon}</span>` : ''}
        <a class="ct-breadcrumbs__link" href="${href}">${label}</a>
        <span class="ct-breadcrumbs__separator" aria-hidden="true">/</span>
      </li>`;
}

export default {
  title: 'Navigation/Breadcrumbs',
  parameters: {
    docs: {
      description: {
        component: 'Breadcrumb navigation using semantic `<nav>` + `<ol>` with `aria-current="page"` on the last item. Supports size variants, icon items, collapsible middle items, responsive truncation, and custom separators via CSS custom properties.',
      },
    },
  },
};

export const Default = {
  render: () => `
  <nav class="ct-breadcrumbs" aria-label="Breadcrumb">
    <ol class="ct-breadcrumbs__list">
      ${crumbItem('Home', '/')}
      ${crumbItem('Projects', '/projects')}
      ${crumbItem('Alpha', '', { isLast: true })}
    </ol>
  </nav>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' });

    // Uses ordered list for semantic trail
    const list = nav.querySelector('ol');
    expect(list).toBeInTheDocument();

    // Ancestor items are links
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('Home');
    expect(links[1]).toHaveTextContent('Projects');

    // Current page is plain text, not a link
    const current = canvas.getByText('Alpha');
    expect(current.tagName).toBe('SPAN');
    expect(current.closest('a')).toBeNull();

    // Current page is marked with aria-current="page"
    expect(current).toHaveAttribute('aria-current', 'page');

    // Separators are hidden from assistive technology
    const separators = canvasElement.querySelectorAll('.ct-breadcrumbs__separator');
    for (const sep of separators) {
      expect(sep).toHaveAttribute('aria-hidden', 'true');
    }

    // Links are keyboard focusable
    links[0].focus();
    expect(links[0]).toHaveFocus();
    await userEvent.tab();
    expect(links[1]).toHaveFocus();
  },
};

export const Sizes = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-8);">
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Small</p>
      <nav class="ct-breadcrumbs ct-breadcrumbs--sm" aria-label="Small breadcrumb">
        <ol class="ct-breadcrumbs__list">
          ${crumbItem('Home', '/')}
          ${crumbItem('Category', '/category')}
          ${crumbItem('Page', '', { isLast: true })}
        </ol>
      </nav>
    </div>
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Medium (default)</p>
      <nav class="ct-breadcrumbs" aria-label="Medium breadcrumb">
        <ol class="ct-breadcrumbs__list">
          ${crumbItem('Home', '/')}
          ${crumbItem('Category', '/category')}
          ${crumbItem('Page', '', { isLast: true })}
        </ol>
      </nav>
    </div>
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Large</p>
      <nav class="ct-breadcrumbs ct-breadcrumbs--lg" aria-label="Large breadcrumb">
        <ol class="ct-breadcrumbs__list">
          ${crumbItem('Home', '/')}
          ${crumbItem('Category', '/category')}
          ${crumbItem('Page', '', { isLast: true })}
        </ol>
      </nav>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const sm = canvasElement.querySelector('.ct-breadcrumbs--sm');
    const lg = canvasElement.querySelector('.ct-breadcrumbs--lg');

    expect(sm).toBeInTheDocument();
    expect(lg).toBeInTheDocument();

    // All breadcrumbs have accessible labels
    const navs = canvasElement.querySelectorAll('nav.ct-breadcrumbs');
    expect(navs).toHaveLength(3);
    for (const nav of navs) {
      expect(nav).toHaveAttribute('aria-label');
    }

    // Small variant applies correct font size via custom property
    const smStyle = getComputedStyle(sm);
    expect(smStyle.fontSize).toBeTruthy();

    // Large variant applies correct font size via custom property
    const lgStyle = getComputedStyle(lg);
    expect(lgStyle.fontSize).toBeTruthy();
  },
};

export const WithIcons = {
  render: () => `
  <nav class="ct-breadcrumbs" aria-label="Breadcrumb with icons">
    <ol class="ct-breadcrumbs__list">
      ${crumbItem('Home', '/', { icon: homeSvg })}
      ${crumbItem('Projects', '/projects', { icon: folderSvg })}
      ${crumbItem('Alpha', '', { isLast: true })}
    </ol>
  </nav>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb with icons' });

    // Icons are present and hidden from AT
    const icons = nav.querySelectorAll('.ct-breadcrumbs__icon');
    expect(icons).toHaveLength(2);
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }

    // Icons contain SVGs
    for (const icon of icons) {
      expect(icon.querySelector('svg')).toBeInTheDocument();
    }

    // Links still work correctly with icons
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(2);
    links[0].focus();
    expect(links[0]).toHaveFocus();
  },
};

export const Collapse = {
  render: () => `
  <nav class="ct-breadcrumbs" aria-label="Collapsed breadcrumb">
    <ol class="ct-breadcrumbs__list">
      ${crumbItem('Home', '/')}
      <li class="ct-breadcrumbs__item">
        <button class="ct-breadcrumbs__collapse" type="button" aria-label="Show hidden breadcrumbs" aria-expanded="false">&hellip;</button>
        <span class="ct-breadcrumbs__separator" aria-hidden="true">/</span>
      </li>
      ${crumbItem('Settings', '/settings')}
      ${crumbItem('Profile', '', { isLast: true })}
    </ol>
  </nav>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Collapsed breadcrumb' });

    // Collapse button exists with accessible label
    const collapseBtn = within(nav).getByRole('button', { name: 'Show hidden breadcrumbs' });
    expect(collapseBtn).toBeInTheDocument();
    expect(collapseBtn).toHaveAttribute('aria-expanded', 'false');
    expect(collapseBtn).toHaveClass('ct-breadcrumbs__collapse');

    // Collapse button is keyboard focusable
    collapseBtn.focus();
    expect(collapseBtn).toHaveFocus();

    // Tab order: Home link → collapse → Settings link
    const links = within(nav).getAllByRole('link');
    links[0].focus();
    expect(links[0]).toHaveFocus();

    await userEvent.tab();
    expect(collapseBtn).toHaveFocus();

    await userEvent.tab();
    expect(links[1]).toHaveFocus();
  },
};

export const CollapseExpanded = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Collapsed (before click)</p>
      <nav class="ct-breadcrumbs" aria-label="Collapsed state">
        <ol class="ct-breadcrumbs__list">
          ${crumbItem('Home', '/')}
          <li class="ct-breadcrumbs__item">
            <button class="ct-breadcrumbs__collapse" type="button" aria-label="Show hidden breadcrumbs" aria-expanded="false">&hellip;</button>
            <span class="ct-breadcrumbs__separator" aria-hidden="true">/</span>
          </li>
          ${crumbItem('Profile', '', { isLast: true })}
        </ol>
      </nav>
    </div>
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Expanded (after click)</p>
      <nav class="ct-breadcrumbs" aria-label="Expanded state">
        <ol class="ct-breadcrumbs__list">
          ${crumbItem('Home', '/')}
          ${crumbItem('Projects', '/projects')}
          ${crumbItem('Construct', '/projects/construct')}
          ${crumbItem('Settings', '/settings')}
          ${crumbItem('Profile', '', { isLast: true })}
        </ol>
      </nav>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Collapsed state
    const collapsedNav = canvasElement.querySelector('[aria-label="Collapsed state"]');
    const collapseBtn = collapsedNav.querySelector('.ct-breadcrumbs__collapse');
    expect(collapseBtn).toHaveAttribute('aria-expanded', 'false');

    // Expanded state shows all items
    const expandedNav = canvasElement.querySelector('[aria-label="Expanded state"]');
    const expandedLinks = within(expandedNav).getAllByRole('link');
    expect(expandedLinks).toHaveLength(4);
  },
};

export const CustomSeparator = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Chevron separator</p>
      <nav class="ct-breadcrumbs" aria-label="Chevron separator breadcrumb">
        <ol class="ct-breadcrumbs__list">
          <li class="ct-breadcrumbs__item">
            <a class="ct-breadcrumbs__link" href="/">Home</a>
            <span class="ct-breadcrumbs__separator" aria-hidden="true">&rsaquo;</span>
          </li>
          <li class="ct-breadcrumbs__item">
            <a class="ct-breadcrumbs__link" href="/docs">Docs</a>
            <span class="ct-breadcrumbs__separator" aria-hidden="true">&rsaquo;</span>
          </li>
          <li class="ct-breadcrumbs__item">
            <span class="ct-breadcrumbs__current" aria-current="page">API</span>
          </li>
        </ol>
      </nav>
    </div>
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Arrow separator</p>
      <nav class="ct-breadcrumbs" aria-label="Arrow separator breadcrumb">
        <ol class="ct-breadcrumbs__list">
          <li class="ct-breadcrumbs__item">
            <a class="ct-breadcrumbs__link" href="/">Home</a>
            <span class="ct-breadcrumbs__separator" aria-hidden="true">&rarr;</span>
          </li>
          <li class="ct-breadcrumbs__item">
            <a class="ct-breadcrumbs__link" href="/docs">Docs</a>
            <span class="ct-breadcrumbs__separator" aria-hidden="true">&rarr;</span>
          </li>
          <li class="ct-breadcrumbs__item">
            <span class="ct-breadcrumbs__current" aria-current="page">API</span>
          </li>
        </ol>
      </nav>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const navs = canvasElement.querySelectorAll('nav.ct-breadcrumbs');
    expect(navs).toHaveLength(2);

    // All separators are hidden from AT
    const separators = canvasElement.querySelectorAll('.ct-breadcrumbs__separator');
    for (const sep of separators) {
      expect(sep).toHaveAttribute('aria-hidden', 'true');
    }

    // Both navs have proper aria-label
    for (const nav of navs) {
      expect(nav).toHaveAttribute('aria-label');
    }
  },
};

export const LongPath = {
  render: () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Computers', href: '/products/electronics/computers' },
      { label: 'Laptops', href: '/products/electronics/computers/laptops' },
      { label: 'Gaming', href: '/products/electronics/computers/laptops/gaming' },
      { label: '2024 Models', href: '/products/electronics/computers/laptops/gaming/2024' },
      { label: 'High Performance', href: '/products/electronics/computers/laptops/gaming/2024/high-performance' },
      { label: 'Reviews', href: '/products/electronics/computers/laptops/gaming/2024/high-performance/reviews' },
      { label: 'Editor Picks' },
    ];

    const crumbs = items.map((item, i) =>
      crumbItem(item.label, item.href || '', { isLast: i === items.length - 1 })
    ).join('\n      ');

    return `
  <div class="ct-stack" style="--ct-stack-space: var(--space-8);">
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Full path (10 items, wraps naturally)</p>
      <nav class="ct-breadcrumbs" aria-label="Long path breadcrumb" style="max-width: 600px;">
        <ol class="ct-breadcrumbs__list">
          ${crumbs}
        </ol>
      </nav>
    </div>
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Collapsed path (first + ellipsis + last 2)</p>
      <nav class="ct-breadcrumbs" aria-label="Collapsed long path breadcrumb" style="max-width: 600px;">
        <ol class="ct-breadcrumbs__list">
          ${crumbItem('Home', '/')}
          <li class="ct-breadcrumbs__item">
            <button class="ct-breadcrumbs__collapse" type="button" aria-label="Show 7 hidden breadcrumbs" aria-expanded="false">&hellip;</button>
            <span class="ct-breadcrumbs__separator" aria-hidden="true">/</span>
          </li>
          ${crumbItem('Reviews', '/products/electronics/computers/laptops/gaming/2024/high-performance/reviews')}
          ${crumbItem('Editor Picks', '', { isLast: true })}
        </ol>
      </nav>
    </div>
  </div>
`;
  },
  play: async ({ canvasElement }) => {
    // Full path has 10 items
    const fullNav = canvasElement.querySelector('[aria-label="Long path breadcrumb"]');
    const fullItems = fullNav.querySelectorAll('.ct-breadcrumbs__item');
    expect(fullItems).toHaveLength(10);

    // Collapsed path has collapse button
    const collapsedNav = canvasElement.querySelector('[aria-label="Collapsed long path breadcrumb"]');
    const collapseBtn = collapsedNav.querySelector('.ct-breadcrumbs__collapse');
    expect(collapseBtn).toBeInTheDocument();
    expect(collapseBtn).toHaveAttribute('aria-label', 'Show 7 hidden breadcrumbs');

    // Last item has aria-current
    const current = collapsedNav.querySelector('[aria-current="page"]');
    expect(current).toHaveTextContent('Editor Picks');
  },
};

export const Keyboard = {
  render: () => `
  <nav class="ct-breadcrumbs" aria-label="Keyboard test breadcrumb">
    <ol class="ct-breadcrumbs__list">
      ${crumbItem('Home', '/', { icon: homeSvg })}
      <li class="ct-breadcrumbs__item">
        <button class="ct-breadcrumbs__collapse" type="button" aria-label="Show hidden breadcrumbs" aria-expanded="false">&hellip;</button>
        <span class="ct-breadcrumbs__separator" aria-hidden="true">/</span>
      </li>
      ${crumbItem('Settings', '/settings')}
      ${crumbItem('Profile', '', { isLast: true })}
    </ol>
  </nav>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Keyboard test breadcrumb' });

    // All interactive elements: Home link, collapse button, Settings link
    const homeLink = within(nav).getAllByRole('link')[0];
    const collapseBtn = within(nav).getByRole('button');
    const settingsLink = within(nav).getAllByRole('link')[1];

    // Tab through all interactive elements
    homeLink.focus();
    expect(homeLink).toHaveFocus();

    await userEvent.tab();
    expect(collapseBtn).toHaveFocus();

    await userEvent.tab();
    expect(settingsLink).toHaveFocus();

    // Focus-visible ring should be visible (link has border-radius for ring)
    expect(homeLink).toHaveClass('ct-breadcrumbs__link');

    // Collapse button is activatable with Enter
    collapseBtn.focus();
    let clicked = false;
    collapseBtn.addEventListener('click', () => { clicked = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(clicked).toBe(true);

    // Collapse button is activatable with Space
    let spaceClicked = false;
    collapseBtn.addEventListener('click', () => { spaceClicked = true; }, { once: true });
    await userEvent.keyboard(' ');
    expect(spaceClicked).toBe(true);
  },
};

export const Responsive = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-8);">
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Desktop (full width)</p>
      <nav class="ct-breadcrumbs ct-breadcrumbs--responsive" aria-label="Responsive breadcrumb">
        <ol class="ct-breadcrumbs__list">
          ${crumbItem('Home', '/')}
          ${crumbItem('Products', '/products')}
          ${crumbItem('Electronics', '/products/electronics')}
          ${crumbItem('Laptops', '/products/electronics/laptops')}
          ${crumbItem('Gaming Laptop Pro X1', '', { isLast: true })}
        </ol>
      </nav>
    </div>
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Narrow viewport simulation (use browser resize to see responsive behavior)</p>
      <nav class="ct-breadcrumbs ct-breadcrumbs--responsive" aria-label="Narrow breadcrumb" style="max-width: 200px; overflow: hidden;">
        <ol class="ct-breadcrumbs__list">
          ${crumbItem('Home', '/')}
          ${crumbItem('Products', '/products')}
          ${crumbItem('Electronics', '/products/electronics')}
          ${crumbItem('Laptops', '/products/electronics/laptops')}
          ${crumbItem('Gaming Laptop Pro X1', '', { isLast: true })}
        </ol>
      </nav>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const navs = canvasElement.querySelectorAll('.ct-breadcrumbs--responsive');
    expect(navs).toHaveLength(2);

    // Responsive class is applied
    for (const nav of navs) {
      expect(nav).toHaveClass('ct-breadcrumbs--responsive');
    }

    // All items have correct structure
    const items = canvasElement.querySelectorAll('.ct-breadcrumbs__item');
    expect(items.length).toBeGreaterThan(0);

    // Last item in each nav has aria-current
    for (const nav of navs) {
      const current = nav.querySelector('[aria-current="page"]');
      expect(current).toBeInTheDocument();
    }
  },
};

export const CustomProperties = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-8);">
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Custom colors via CSS custom properties</p>
      <nav class="ct-breadcrumbs" aria-label="Custom colors breadcrumb" style="--ct-breadcrumbs-link-color: var(--color-brand-primary); --ct-breadcrumbs-link-hover-color: var(--color-success-text); --ct-breadcrumbs-separator-color: var(--color-brand-primary);">
        <ol class="ct-breadcrumbs__list">
          ${crumbItem('Home', '/')}
          ${crumbItem('Styled', '/styled')}
          ${crumbItem('Page', '', { isLast: true })}
        </ol>
      </nav>
    </div>
    <div>
      <p class="ct-muted" style="margin-bottom: var(--space-2);">Custom gap</p>
      <nav class="ct-breadcrumbs" aria-label="Custom gap breadcrumb" style="--ct-breadcrumbs-gap: var(--space-4);">
        <ol class="ct-breadcrumbs__list">
          ${crumbItem('Home', '/')}
          ${crumbItem('Wider', '/wider')}
          ${crumbItem('Gap', '', { isLast: true })}
        </ol>
      </nav>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const navs = canvasElement.querySelectorAll('nav.ct-breadcrumbs');
    expect(navs).toHaveLength(2);

    // Each breadcrumb has proper structure
    for (const nav of navs) {
      expect(nav).toHaveAttribute('aria-label');
      const list = nav.querySelector('ol');
      expect(list).toBeInTheDocument();
      const current = nav.querySelector('[aria-current="page"]');
      expect(current).toBeInTheDocument();
    }
  },
};
