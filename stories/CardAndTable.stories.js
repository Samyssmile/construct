import { expect, within } from 'storybook/test';

export default {
  title: 'Data Display/Card & Table',
  argTypes: {
    title: { control: 'text', description: 'Card title' },
    body: { control: 'text', description: 'Card body text' },
    footer: { control: 'text', description: 'Card footer label' },
  },
};

export const Playground = {
  args: {
    title: 'Team',
    body: 'Shared ownership and clear permissions.',
    footer: '12 members',
  },
  render: ({ title, body, footer }) => `
  <section class="ct-card" style="max-width: 420px;">
    <div class="ct-card__header">
      <h3>${title}</h3>
      <button class="ct-button ct-button--ghost">Edit</button>
    </div>
    <div class="ct-card__body">
      <p>${body}</p>
    </div>
    <div class="ct-card__footer">
      <span class="ct-muted">${footer}</span>
      <button class="ct-button ct-button--secondary">Open</button>
    </div>
  </section>`,
};

export const Card = {
  render: () => `
  <section class="ct-card" style="max-width: 420px;">
    <div class="ct-card__header">
      <h3>Team</h3>
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

    // Card uses a semantic <section> element
    const card = canvasElement.querySelector('.ct-card');
    expect(card.tagName.toLowerCase()).toBe('section');

    // Header contains a heading and an action button
    const heading = canvas.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Team');

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
