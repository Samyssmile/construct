import { expect, within } from 'storybook/test';

export default {
  title: 'Data Display/Card & Table',
  parameters: {
    docs: {
      description: {
        component: 'Card container with header, body, and footer sections for surfacing summary content. Interactive cards must use `<a>`, `<button>`, or an element with `role="button"` / `role="link"` to receive interactive styles. Static cards rendered as `<section>` should include `aria-labelledby` referencing the card heading. Also includes a styled HTML table with striped rows and compact variants.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Card title' },
    body: { control: 'text', description: 'Card body text' },
    footer: { control: 'text', description: 'Card footer label' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Card size variant',
    },
    interactive: {
      control: 'boolean',
      description: 'Enable hover effect and keyboard focus for clickable cards',
    },
  },
};

export const Playground = {
  args: {
    title: 'Team',
    body: 'Shared ownership and clear permissions.',
    footer: '12 members',
    size: 'md',
    interactive: false,
  },
  render: ({ title, body, footer, size, interactive }) => {
    const sizeClass = size !== 'md' ? ` ct-card--${size}` : '';
    const interactiveClass = interactive ? ' ct-card--interactive' : '';
    const headingId = 'card-playground-heading';

    if (interactive) {
      return `
  <a href="#" class="ct-card${sizeClass}${interactiveClass}" aria-labelledby="${headingId}" style="max-width: 420px; text-decoration: none; color: inherit;">
    <div class="ct-card__header">
      <h3 id="${headingId}">${title}</h3>
    </div>
    <div class="ct-card__body">
      <p>${body}</p>
    </div>
    <div class="ct-card__footer">
      <span class="ct-muted">${footer}</span>
    </div>
  </a>`;
    }

    return `
  <section class="ct-card${sizeClass}" aria-labelledby="${headingId}" style="max-width: 420px;">
    <div class="ct-card__header">
      <h3 id="${headingId}">${title}</h3>
      <button class="ct-button ct-button--ghost">Edit</button>
    </div>
    <div class="ct-card__body">
      <p>${body}</p>
    </div>
    <div class="ct-card__footer">
      <span class="ct-muted">${footer}</span>
      <button class="ct-button ct-button--secondary">Open</button>
    </div>
  </section>`;
  },
};

export const Card = {
  render: () => `
  <section class="ct-card" aria-labelledby="card-heading" style="max-width: 420px;">
    <div class="ct-card__header">
      <h3 id="card-heading">Team</h3>
      <button class="ct-button ct-button--ghost">Edit</button>
    </div>
    <div class="ct-card__body">
      <p>Shared ownership and clear permissions.</p>
      <p class="ct-muted">Updated 2 days ago</p>
    </div>
    <div class="ct-card__footer">
      <span class="ct-muted">12 members</span>
      <button class="ct-button ct-button--secondary">Open</button>
    </div>
  </section>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Card uses a semantic <section> element with an accessible name
    const card = canvasElement.querySelector('.ct-card');
    expect(card.tagName.toLowerCase()).toBe('section');
    expect(card).toHaveAttribute('aria-labelledby', 'card-heading');

    // Heading serves as the accessible name
    const heading = canvas.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Team');
    expect(heading).toHaveAttribute('id', 'card-heading');

    const buttons = canvas.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Edit');
    expect(buttons[1]).toHaveTextContent('Open');

    // All three card sections are present
    expect(canvasElement.querySelector('.ct-card__header')).toBeInTheDocument();
    expect(canvasElement.querySelector('.ct-card__body')).toBeInTheDocument();
    expect(canvasElement.querySelector('.ct-card__footer')).toBeInTheDocument();
  },
};

export const Interactive = {
  render: () => `
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <a href="#alpha" class="ct-card ct-card--interactive" aria-labelledby="interactive-alpha" style="max-width: 280px; text-decoration: none; color: inherit;">
      <div class="ct-card__header">
        <h3 id="interactive-alpha">Alpha</h3>
      </div>
      <div class="ct-card__body">
        <p>Active project with 3 open tasks.</p>
      </div>
      <div class="ct-card__footer">
        <span class="ct-muted">J. Chen</span>
      </div>
    </a>
    <a href="#beta" class="ct-card ct-card--interactive" aria-labelledby="interactive-beta" style="max-width: 280px; text-decoration: none; color: inherit;">
      <div class="ct-card__header">
        <h3 id="interactive-beta">Beta</h3>
      </div>
      <div class="ct-card__body">
        <p>Paused — awaiting review.</p>
      </div>
      <div class="ct-card__footer">
        <span class="ct-muted">L. Hart</span>
      </div>
    </a>
  </div>
`,
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll('.ct-card--interactive');
    expect(cards).toHaveLength(2);

    // Interactive cards use semantic <a> elements
    for (const card of cards) {
      expect(card.tagName.toLowerCase()).toBe('a');
      expect(card).toHaveAttribute('href');
    }

    // Accessible name via aria-labelledby referencing the heading
    expect(cards[0]).toHaveAttribute('aria-labelledby', 'interactive-alpha');
    expect(cards[1]).toHaveAttribute('aria-labelledby', 'interactive-beta');
  },
};

export const Selected = {
  render: () => `
  <div role="listbox" aria-label="Select a project" style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <div class="ct-card ct-card--interactive" role="option" aria-selected="true" tabindex="0" aria-labelledby="selected-alpha" style="max-width: 280px;">
      <div class="ct-card__header">
        <h3 id="selected-alpha">Alpha</h3>
      </div>
      <div class="ct-card__body">
        <p>Active project with 3 open tasks.</p>
      </div>
    </div>
    <div class="ct-card ct-card--interactive" role="option" aria-selected="false" tabindex="-1" aria-labelledby="selected-beta" style="max-width: 280px;">
      <div class="ct-card__header">
        <h3 id="selected-beta">Beta</h3>
      </div>
      <div class="ct-card__body">
        <p>Paused — awaiting review.</p>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const listbox = canvasElement.querySelector('[role="listbox"]');
    expect(listbox).toHaveAttribute('aria-label', 'Select a project');

    const options = canvasElement.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(2);

    // First card is selected
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('tabindex', '0');

    // Second card is not selected
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
    expect(options[1]).toHaveAttribute('tabindex', '-1');

    // Selected card receives visual border indicator
    const selectedStyle = getComputedStyle(options[0]);
    expect(selectedStyle.borderColor).not.toBe(getComputedStyle(options[1]).borderColor);
  },
};

export const Disabled = {
  render: () => `
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <a href="#alpha" class="ct-card ct-card--interactive" aria-labelledby="disabled-alpha" style="max-width: 280px; text-decoration: none; color: inherit;">
      <div class="ct-card__header">
        <h3 id="disabled-alpha">Alpha</h3>
      </div>
      <div class="ct-card__body">
        <p>Active project with 3 open tasks.</p>
      </div>
    </a>
    <a href="#beta" class="ct-card ct-card--interactive" aria-disabled="true" aria-labelledby="disabled-beta" style="max-width: 280px; text-decoration: none; color: inherit;">
      <div class="ct-card__header">
        <h3 id="disabled-beta">Beta</h3>
      </div>
      <div class="ct-card__body">
        <p>Archived — no longer editable.</p>
      </div>
    </a>
  </div>
`,
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll('.ct-card--interactive');
    expect(cards).toHaveLength(2);

    // First card is enabled
    expect(cards[0]).not.toHaveAttribute('aria-disabled');

    // Second card is disabled
    expect(cards[1]).toHaveAttribute('aria-disabled', 'true');

    // Disabled card receives reduced opacity
    const disabledStyle = getComputedStyle(cards[1]);
    expect(parseFloat(disabledStyle.opacity)).toBeLessThan(1);
  },
};

export const Table = {
  render: () => `
  <div class="ct-table-wrap" style="max-width: 720px;">
    <table class="ct-table ct-table--striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Status</th>
          <th scope="col">Owner</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alpha</td>
          <td>Active</td>
          <td>J. Chen</td>
        </tr>
        <tr>
          <td>Beta</td>
          <td>Paused</td>
          <td>L. Hart</td>
        </tr>
      </tbody>
    </table>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Semantic <table> element is present
    const table = canvasElement.querySelector('table');
    expect(table).toBeInTheDocument();

    // All column headers have scope="col" for screen reader association
    const headers = canvasElement.querySelectorAll('th[scope="col"]');
    expect(headers).toHaveLength(3);
    expect(headers[0]).toHaveTextContent('Name');
    expect(headers[1]).toHaveTextContent('Status');
    expect(headers[2]).toHaveTextContent('Owner');

    // Two data rows, each with a cell for every header column
    const rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);
    for (const row of rows) {
      expect(row.querySelectorAll('td')).toHaveLength(3);
    }
  },
};
