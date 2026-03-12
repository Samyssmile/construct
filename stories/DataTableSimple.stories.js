import { expect } from 'storybook/test';

export default {
  title: 'Data Display/Data Table Simple',
  parameters: {
    docs: {
      description: {
        component: 'Lightweight data table with sortable columns and row selection checkboxes, without toolbar or pagination chrome. Use when a full data table would be too heavy.',
      },
    },
  },
  argTypes: {
    striped: { control: 'boolean', description: 'Alternate row striping' },
    compact: { control: 'boolean', description: 'Reduce row padding' },
  },
};

export const Playground = {
  args: {
    striped: true,
    compact: true,
  },
  render: ({ striped, compact }) => {
    const stripeClass = striped ? ' ct-table--striped' : '';
    const compactClass = compact ? ' ct-table--compact' : '';
    return `
    <div class="ct-data-table ct-data-table--simple" style="max-width: 600px;">
      <div class="ct-data-table__table">
        <table class="ct-table${stripeClass}${compactClass}">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
              <th scope="col">Owner</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Alpha</td><td>Active</td><td>J. Chen</td></tr>
            <tr><td>Beta</td><td>Paused</td><td>L. Hart</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
  },
};

export const DataTableSimple = {
  render: () => `
  <div class="ct-data-table ct-data-table--simple" style="max-width: 960px;">
    <div class="ct-data-table__table">
      <table class="ct-table ct-table--striped ct-table--compact">
        <thead>
          <tr>
            <th scope="col" class="ct-table__cell--checkbox">
              <input class="ct-check__input" type="checkbox" aria-label="Select all rows" />
            </th>
            <th scope="col" aria-sort="ascending">
              <button class="ct-table__sort" type="button">
                Project
                <span class="ct-table__sort-indicator" aria-hidden="true"></span>
              </button>
            </th>
            <th scope="col" aria-sort="none">
              <button class="ct-table__sort" type="button">
                Status
                <span class="ct-table__sort-indicator" aria-hidden="true"></span>
              </button>
            </th>
            <th scope="col" aria-sort="none">
              <button class="ct-table__sort" type="button">
                Owner
                <span class="ct-table__sort-indicator" aria-hidden="true"></span>
              </button>
            </th>
            <th scope="col" aria-sort="descending">
              <button class="ct-table__sort" type="button">
                Updated
                <span class="ct-table__sort-indicator" aria-hidden="true"></span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="ct-table__cell--checkbox">
              <input class="ct-check__input" type="checkbox" aria-label="Select Alpha" checked />
            </td>
            <td>Alpha</td>
            <td>Active</td>
            <td>J. Chen</td>
            <td>Jan 24, 2026</td>
          </tr>
          <tr>
            <td class="ct-table__cell--checkbox">
              <input class="ct-check__input" type="checkbox" aria-label="Select Beta" />
            </td>
            <td>Beta</td>
            <td>Paused</td>
            <td>L. Hart</td>
            <td>Jan 18, 2026</td>
          </tr>
          <tr>
            <td class="ct-table__cell--checkbox">
              <input class="ct-check__input" type="checkbox" aria-label="Select Gamma" />
            </td>
            <td>Gamma</td>
            <td>Active</td>
            <td>S. Rivera</td>
            <td>Jan 10, 2026</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="ct-data-table__footer">
      <span>Showing 1-3 of 24</span>
      <nav class="ct-pagination" aria-label="Data table pagination">
        <ul class="ct-pagination__list">
          <li><button class="ct-pagination__link" aria-disabled="true" disabled type="button">Prev</button></li>
          <li><button class="ct-pagination__link" aria-current="page" type="button">1</button></li>
          <li><button class="ct-pagination__link" type="button">2</button></li>
          <li><button class="ct-pagination__link" type="button">3</button></li>
          <li><button class="ct-pagination__link" type="button">Next</button></li>
        </ul>
      </nav>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Semantic <table> element is present
    const table = canvasElement.querySelector('table');
    expect(table).toBeInTheDocument();

    // All five column headers have scope="col"
    const headers = canvasElement.querySelectorAll('th[scope="col"]');
    expect(headers).toHaveLength(5);

    // Sort state is expressed via aria-sort on <th>
    expect(canvasElement.querySelector('th[aria-sort="ascending"]')).toBeInTheDocument();
    expect(canvasElement.querySelector('th[aria-sort="descending"]')).toBeInTheDocument();
    const unsortedHeaders = canvasElement.querySelectorAll('th[aria-sort="none"]');
    expect(unsortedHeaders).toHaveLength(2);

    // Sort indicator icons are hidden from assistive technology
    const sortIndicators = canvasElement.querySelectorAll('.ct-table__sort-indicator');
    expect(sortIndicators.length).toBeGreaterThan(0);
    for (const indicator of sortIndicators) {
      expect(indicator).toHaveAttribute('aria-hidden', 'true');
    }

    // Select-all checkbox has an accessible label
    const selectAll = canvasElement.querySelector('thead input[type="checkbox"]');
    expect(selectAll).toHaveAttribute('aria-label', 'Select all rows');

    // Each row checkbox has a unique accessible label
    const rowCheckboxes = canvasElement.querySelectorAll('tbody input[type="checkbox"]');
    expect(rowCheckboxes).toHaveLength(3);
    const rowLabels = [...rowCheckboxes].map(cb => cb.getAttribute('aria-label'));
    expect(new Set(rowLabels).size).toBe(3);

    // Three data rows, each with 5 cells (checkbox + 4 data columns)
    const rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(3);
    for (const row of rows) {
      expect(row.querySelectorAll('td')).toHaveLength(5);
    }

    // Pagination nav has an accessible label
    const pagination = canvasElement.querySelector('nav.ct-pagination');
    expect(pagination).toHaveAttribute('aria-label');

    // Current page button is marked with aria-current="page"
    const currentPage = canvasElement.querySelector('[aria-current="page"]');
    expect(currentPage).toBeInTheDocument();
    expect(currentPage).toHaveTextContent('1');

    // Previous button is disabled when on the first page
    const prevButton = canvasElement.querySelector('[aria-disabled="true"]');
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).toHaveTextContent('Prev');
  },
};
