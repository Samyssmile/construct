import { expect, within } from 'storybook/test';

export default {
  title: 'Data Display/Empty State',
  parameters: {
    docs: {
      description: {
        component: 'Placeholder content for empty data views — lists, tables, search results. Centered layout with optional icon, title, description, and action buttons. Supports size and semantic variants.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'search', 'error', 'bordered'],
      description: 'Semantic variant',
    },
    title: { control: 'text', description: 'Headline text' },
    description: { control: 'text', description: 'Supporting text' },
    showIcon: { control: 'boolean', description: 'Show icon' },
    showActions: { control: 'boolean', description: 'Show action buttons' },
  },
};

export const Playground = {
  args: {
    size: 'default',
    variant: 'default',
    title: 'No projects yet',
    description: 'Create your first project to get started.',
    showIcon: true,
    showActions: true,
  },
  render: ({ size, variant, title, description, showIcon, showActions }) => {
    const classes = ['ct-empty-state'];
    if (size !== 'default') classes.push(`ct-empty-state--${size}`);
    if (variant !== 'default') classes.push(`ct-empty-state--${variant}`);

    const iconMap = { default: '\u2610', search: '\u26B2', error: '\u26A0' };
    const icon = showIcon
      ? `<div class="ct-empty-state__icon" aria-hidden="true">${iconMap[variant] || iconMap.default}</div>`
      : '';
    const titleHtml = title
      ? `<h3 class="ct-empty-state__title">${title}</h3>`
      : '';
    const desc = description
      ? `<p class="ct-empty-state__description">${description}</p>`
      : '';
    const actions = showActions
      ? `<div class="ct-empty-state__actions">
          <button class="ct-button ct-button--sm" type="button">Create project</button>
        </div>`
      : '';

    return `<div class="${classes.join(' ')}" role="status">${icon}${titleHtml}${desc}${actions}</div>`;
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('.ct-empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'status');
  },
};

export const Default = {
  render: () => `
  <div class="ct-empty-state" role="status">
    <div class="ct-empty-state__icon" aria-hidden="true">&#x2610;</div>
    <h3 class="ct-empty-state__title">No projects yet</h3>
    <p class="ct-empty-state__description">Create your first project to get started.</p>
    <div class="ct-empty-state__actions">
      <button class="ct-button ct-button--sm" type="button">Create project</button>
      <button class="ct-button ct-button--ghost ct-button--sm" type="button">Learn more</button>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector('.ct-empty-state');

    // Container has role="status" for live-region announcements
    expect(el).toHaveAttribute('role', 'status');

    // Icon is decorative
    const icon = canvasElement.querySelector('.ct-empty-state__icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');

    // Title and description provide context for screen readers
    expect(canvas.getByText('No projects yet')).toBeInTheDocument();
    expect(canvas.getByText('Create your first project to get started.')).toBeInTheDocument();

    // Action buttons are accessible
    const createBtn = canvas.getByRole('button', { name: 'Create project' });
    expect(createBtn).toBeEnabled();
    const learnBtn = canvas.getByRole('button', { name: 'Learn more' });
    expect(learnBtn).toBeEnabled();
  },
};

export const Sizes = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-8);">
    <div>
      <p class="ct-muted" style="text-align: center; margin-block-end: var(--space-2);">Small</p>
      <div class="ct-empty-state ct-empty-state--sm" role="status">
        <div class="ct-empty-state__icon" aria-hidden="true">&#x2610;</div>
        <h3 class="ct-empty-state__title">No items</h3>
        <p class="ct-empty-state__description">Nothing to show here.</p>
      </div>
    </div>
    <div>
      <p class="ct-muted" style="text-align: center; margin-block-end: var(--space-2);">Default (md)</p>
      <div class="ct-empty-state" role="status">
        <div class="ct-empty-state__icon" aria-hidden="true">&#x2610;</div>
        <h3 class="ct-empty-state__title">No projects yet</h3>
        <p class="ct-empty-state__description">Create your first project to get started.</p>
      </div>
    </div>
    <div>
      <p class="ct-muted" style="text-align: center; margin-block-end: var(--space-2);">Large</p>
      <div class="ct-empty-state ct-empty-state--lg" role="status">
        <div class="ct-empty-state__icon" aria-hidden="true">&#x2610;</div>
        <h3 class="ct-empty-state__title">Welcome to your dashboard</h3>
        <p class="ct-empty-state__description">You don't have any data yet. Start by adding your first entry.</p>
        <div class="ct-empty-state__actions">
          <button class="ct-button" type="button">Get started</button>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const sm = canvasElement.querySelector('.ct-empty-state--sm');
    const md = canvasElement.querySelector('.ct-empty-state:not([class*="--sm"]):not([class*="--lg"])');
    const lg = canvasElement.querySelector('.ct-empty-state--lg');

    expect(sm).toBeInTheDocument();
    expect(md).toBeInTheDocument();
    expect(lg).toBeInTheDocument();

    // All sizes have role="status"
    for (const el of [sm, md, lg]) {
      expect(el).toHaveAttribute('role', 'status');
    }
  },
};

export const SearchVariant = {
  render: () => `
  <div class="ct-empty-state ct-empty-state--search" role="status">
    <div class="ct-empty-state__icon" aria-hidden="true">&#x26B2;</div>
    <h3 class="ct-empty-state__title">No results found</h3>
    <p class="ct-empty-state__description">Try adjusting your search or clearing filters to find what you're looking for.</p>
    <div class="ct-empty-state__actions">
      <button class="ct-button ct-button--secondary ct-button--sm" type="button">Clear filters</button>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector('.ct-empty-state--search');

    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'status');
    expect(canvas.getByText('No results found')).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Clear filters' })).toBeEnabled();
  },
};

export const ErrorVariant = {
  render: () => `
  <div class="ct-empty-state ct-empty-state--error" role="status">
    <div class="ct-empty-state__icon" aria-hidden="true">&#x26A0;</div>
    <h3 class="ct-empty-state__title">Failed to load data</h3>
    <p class="ct-empty-state__description">Something went wrong while fetching your data. Please try again.</p>
    <div class="ct-empty-state__actions">
      <button class="ct-button ct-button--sm" type="button">Retry</button>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const el = canvasElement.querySelector('.ct-empty-state--error');

    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'status');

    // Error variant icon uses danger color
    const icon = el.querySelector('.ct-empty-state__icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');

    expect(canvas.getByText('Failed to load data')).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Retry' })).toBeEnabled();
  },
};

export const BorderedVariant = {
  render: () => `
  <div class="ct-empty-state ct-empty-state--bordered" role="status">
    <div class="ct-empty-state__icon" aria-hidden="true">&#x2610;</div>
    <h3 class="ct-empty-state__title">No attachments</h3>
    <p class="ct-empty-state__description">Drag files here or click to upload.</p>
    <div class="ct-empty-state__actions">
      <button class="ct-button ct-button--secondary ct-button--sm" type="button">Browse files</button>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('.ct-empty-state--bordered');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'status');
  },
};

export const InsideCard = {
  render: () => `
  <section class="ct-card" style="max-width: 480px;">
    <div class="ct-card__header">
      <h3>Recent Activity</h3>
    </div>
    <div class="ct-card__body">
      <div class="ct-empty-state ct-empty-state--sm" role="status">
        <div class="ct-empty-state__icon" aria-hidden="true">&#x2610;</div>
        <h4 class="ct-empty-state__title">No activity yet</h4>
        <p class="ct-empty-state__description">Actions from your team will appear here.</p>
      </div>
    </div>
  </section>
`,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('.ct-card');
    expect(card).toBeInTheDocument();

    const emptyState = card.querySelector('.ct-empty-state--sm');
    expect(emptyState).toBeInTheDocument();
    expect(emptyState).toHaveAttribute('role', 'status');

    const icon = emptyState.querySelector('.ct-empty-state__icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  },
};

export const InsideDataTable = {
  render: () => `
  <div style="max-width: 640px;">
    <table class="ct-data-table__table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="3">
            <div class="ct-empty-state ct-empty-state--sm" role="status">
              <div class="ct-empty-state__icon" aria-hidden="true">&#x26B2;</div>
              <h4 class="ct-empty-state__title">No records found</h4>
              <p class="ct-empty-state__description">Adjust your filters or add a new entry.</p>
              <div class="ct-empty-state__actions">
                <button class="ct-button ct-button--sm" type="button">Add entry</button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvasElement.querySelector('.ct-data-table__table');
    expect(table).toBeInTheDocument();

    const emptyState = table.querySelector('.ct-empty-state');
    expect(emptyState).toBeInTheDocument();
    expect(emptyState).toHaveAttribute('role', 'status');

    expect(canvas.getByRole('button', { name: 'Add entry' })).toBeEnabled();
  },
};

export const TitleOnly = {
  render: () => `
  <div class="ct-empty-state" role="status">
    <h3 class="ct-empty-state__title">Nothing here</h3>
  </div>
`,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('.ct-empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'status');

    // No icon or description — flexible composition
    expect(el.querySelector('.ct-empty-state__icon')).toBeNull();
    expect(el.querySelector('.ct-empty-state__description')).toBeNull();
    expect(el.querySelector('.ct-empty-state__actions')).toBeNull();
  },
};
