import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Data Display/Data Table',
  parameters: {
    docs: {
      description: {
        component: 'Full-featured data table with header actions, toolbar filters, sortable columns, row selection, and pagination. Use for complex datasets requiring filtering and bulk operations.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Table title' },
    striped: { control: 'boolean', description: 'Alternate row striping' },
    compact: { control: 'boolean', description: 'Reduce row padding' },
  },
};

export const Playground = {
  args: {
    title: 'Projects',
    striped: true,
    compact: true,
  },
  render: ({ title, striped, compact }) => {
    const stripeClass = striped ? ' ct-table--striped' : '';
    const compactClass = compact ? ' ct-table--compact' : '';
    return `
    <div class="ct-data-table" style="max-width: 720px;">
      <div class="ct-data-table__header">
        <div class="ct-data-table__title">
          <h3>${title}</h3>
        </div>
      </div>
      <div class="ct-data-table__table" tabindex="0" role="region" aria-label="Data table">
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
            <tr><td>Gamma</td><td>Active</td><td>S. Rivera</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector('.ct-table');
    expect(table).toBeInTheDocument();
    const headers = canvasElement.querySelectorAll('th[scope="col"]');
    expect(headers.length).toBeGreaterThan(0);
  },
};

export const DataTable = {
  render: () => `
  <div class="ct-data-table" style="max-width: 1100px;">
    <div class="ct-data-table__header">
      <div class="ct-data-table__title">
        <h3>Projects</h3>
        <span class="ct-data-table__meta">24 total · Updated 2 days ago</span>
      </div>
      <div class="ct-data-table__actions">
        <button class="ct-button ct-button--secondary ct-button--sm">Export</button>
        <button class="ct-button ct-button--sm">New project</button>
      </div>
    </div>
    <div class="ct-data-table__toolbar">
      <div class="ct-data-table__filters">
        <input class="ct-input ct-control--sm ct-data-table__search" placeholder="Search projects" aria-label="Search projects" />
        <div class="ct-select-wrap">
          <select class="ct-select ct-control--sm" aria-label="Filter by status">
            <option>Status</option>
            <option>Active</option>
            <option>Paused</option>
            <option>Archived</option>
          </select>
        </div>
        <div class="ct-select-wrap">
          <select class="ct-select ct-control--sm" aria-label="Filter by owner">
            <option>Owner</option>
            <option>J. Chen</option>
            <option>L. Hart</option>
            <option>S. Rivera</option>
          </select>
        </div>
      </div>
      <div class="ct-data-table__actions">
        <button class="ct-button ct-button--ghost ct-button--sm">Reset</button>
        <button class="ct-button ct-button--secondary ct-button--sm">Filters</button>
      </div>
    </div>
    <div class="ct-data-table__table" tabindex="0" role="region" aria-label="Data table">
      <table class="ct-table ct-table--striped ct-table--compact">
        <thead>
          <tr>
            <th scope="col" class="ct-table__cell--checkbox">
              <input class="ct-check__input" type="checkbox" aria-label="Select all rows" />
            </th>
            <th scope="col">Project</th>
            <th scope="col">Status</th>
            <th scope="col">Owner</th>
            <th scope="col" class="ct-table__cell--numeric">Tasks</th>
            <th scope="col">Updated</th>
            <th scope="col" class="ct-table__cell--actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="ct-table__cell--checkbox">
              <input class="ct-check__input" type="checkbox" aria-label="Select Alpha" checked />
            </td>
            <td>
              <span class="ct-table__title">Alpha</span>
              <span class="ct-table__meta">Enterprise rollout</span>
            </td>
            <td>Active</td>
            <td>J. Chen</td>
            <td class="ct-table__cell--numeric">128</td>
            <td>Jan 24, 2026</td>
            <td class="ct-table__cell--actions">
              <button class="ct-button ct-button--ghost ct-button--sm">Open</button>
            </td>
          </tr>
          <tr>
            <td class="ct-table__cell--checkbox">
              <input class="ct-check__input" type="checkbox" aria-label="Select Beta" />
            </td>
            <td>
              <span class="ct-table__title">Beta</span>
              <span class="ct-table__meta">Onboarding</span>
            </td>
            <td>Paused</td>
            <td>L. Hart</td>
            <td class="ct-table__cell--numeric">64</td>
            <td>Jan 18, 2026</td>
            <td class="ct-table__cell--actions">
              <button class="ct-button ct-button--ghost ct-button--sm">Open</button>
            </td>
          </tr>
          <tr>
            <td class="ct-table__cell--checkbox">
              <input class="ct-check__input" type="checkbox" aria-label="Select Gamma" />
            </td>
            <td>
              <span class="ct-table__title">Gamma</span>
              <span class="ct-table__meta">Mobile rework</span>
            </td>
            <td>Active</td>
            <td>S. Rivera</td>
            <td class="ct-table__cell--numeric">92</td>
            <td>Jan 10, 2026</td>
            <td class="ct-table__cell--actions">
              <button class="ct-button ct-button--ghost ct-button--sm">Open</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="ct-data-table__footer">
      <span>Showing 1-3 of 24</span>
      <div class="ct-data-table__footer-actions">
        <div class="ct-data-table__page-size">
          <span>Rows</span>
          <div class="ct-select-wrap">
            <select class="ct-select ct-control--sm" aria-label="Rows per page">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
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
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Table structure: all column headers use scope="col"
    const headers = canvasElement.querySelectorAll('th[scope="col"]');
    expect(headers.length).toBeGreaterThanOrEqual(7);

    // "Select all" checkbox has accessible label
    const selectAll = canvas.getByRole('checkbox', { name: 'Select all rows' });
    expect(selectAll).toBeInTheDocument();

    // Individual row checkboxes have specific labels
    const selectAlpha = canvas.getByRole('checkbox', { name: 'Select Alpha' });
    const selectBeta = canvas.getByRole('checkbox', { name: 'Select Beta' });
    const selectGamma = canvas.getByRole('checkbox', { name: 'Select Gamma' });
    expect(selectAlpha).toBeChecked();
    expect(selectBeta).not.toBeChecked();
    expect(selectGamma).not.toBeChecked();

    // Toggle a row checkbox
    await userEvent.click(selectBeta);
    expect(selectBeta).toBeChecked();

    // Uncheck a row
    await userEvent.click(selectAlpha);
    expect(selectAlpha).not.toBeChecked();

    // Filter controls have accessible labels
    const searchInput = canvas.getByRole('textbox', { name: 'Search projects' });
    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'Alpha');
    expect(searchInput).toHaveValue('Alpha');

    const statusFilter = canvas.getByRole('combobox', { name: 'Filter by status' });
    expect(statusFilter).toBeInTheDocument();
    await userEvent.selectOptions(statusFilter, 'Active');
    expect(statusFilter).toHaveValue('Active');

    const ownerFilter = canvas.getByRole('combobox', { name: 'Filter by owner' });
    expect(ownerFilter).toBeInTheDocument();

    // Pagination: navigation landmark with label
    const paginationNav = canvas.getByRole('navigation', { name: 'Data table pagination' });
    expect(paginationNav).toBeInTheDocument();

    // Prev button is disabled on first page
    const prevBtn = canvas.getByRole('button', { name: 'Prev' });
    expect(prevBtn).toBeDisabled();

    // Current page marked with aria-current
    const currentPage = canvas.getByRole('button', { name: '1' });
    expect(currentPage).toHaveAttribute('aria-current', 'page');

    // Other page buttons are enabled and don't have aria-current
    const page2 = canvas.getByRole('button', { name: '2' });
    expect(page2).toBeEnabled();
    expect(page2).not.toHaveAttribute('aria-current');

    const nextBtn = canvas.getByRole('button', { name: 'Next' });
    expect(nextBtn).toBeEnabled();

    // Rows per page selector has accessible label
    const rowsPerPage = canvas.getByRole('combobox', { name: 'Rows per page' });
    expect(rowsPerPage).toBeInTheDocument();
    await userEvent.selectOptions(rowsPerPage, '25');
    expect(rowsPerPage).toHaveValue('25');

    // Action buttons per row
    const openButtons = canvas.getAllByRole('button', { name: 'Open' });
    expect(openButtons).toHaveLength(3);
    for (const btn of openButtons) {
      expect(btn).toBeEnabled();
    }
  },
};

export const DataTableSimple = {
  render: () => `
  <div class="ct-data-table ct-data-table--simple" style="max-width: 900px;">
    <div class="ct-data-table__table" tabindex="0" role="region" aria-label="Data table">
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
            <td>Jan 24, 2026</td>
          </tr>
          <tr>
            <td class="ct-table__cell--checkbox">
              <input class="ct-check__input" type="checkbox" aria-label="Select Beta" />
            </td>
            <td>Beta</td>
            <td>Paused</td>
            <td>Jan 18, 2026</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="ct-data-table__footer">
      <span>Showing 1-2 of 24</span>
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
    const canvas = within(canvasElement);

    // Sortable columns: aria-sort on <th> elements
    const sortableHeaders = canvasElement.querySelectorAll('th[aria-sort]');
    expect(sortableHeaders.length).toBeGreaterThanOrEqual(3);

    // "Project" column sorted ascending
    const projectHeader = [...sortableHeaders].find(
      th => th.textContent.trim().includes('Project')
    );
    expect(projectHeader).toHaveAttribute('aria-sort', 'ascending');

    // "Status" column not sorted
    const statusHeader = [...sortableHeaders].find(
      th => th.textContent.trim().includes('Status')
    );
    expect(statusHeader).toHaveAttribute('aria-sort', 'none');

    // "Updated" column sorted descending
    const updatedHeader = [...sortableHeaders].find(
      th => th.textContent.trim().includes('Updated')
    );
    expect(updatedHeader).toHaveAttribute('aria-sort', 'descending');

    // Sort indicators are hidden from AT
    const sortIndicators = canvasElement.querySelectorAll('.ct-table__sort-indicator');
    for (const indicator of sortIndicators) {
      expect(indicator).toHaveAttribute('aria-hidden', 'true');
    }

    // Sort buttons are focusable
    const sortButtons = canvasElement.querySelectorAll('.ct-table__sort');
    for (const btn of sortButtons) {
      expect(btn).toHaveAttribute('type', 'button');
      await userEvent.click(btn);
      expect(btn).toHaveFocus();
    }

    // "Select all" checkbox
    const selectAll = canvas.getByRole('checkbox', { name: 'Select all rows' });
    expect(selectAll).not.toBeChecked();

    // Row checkbox: Alpha is pre-selected
    const selectAlpha = canvas.getByRole('checkbox', { name: 'Select Alpha' });
    expect(selectAlpha).toBeChecked();

    // Row checkbox: Beta is not selected
    const selectBeta = canvas.getByRole('checkbox', { name: 'Select Beta' });
    expect(selectBeta).not.toBeChecked();

    // Toggle selection
    await userEvent.click(selectBeta);
    expect(selectBeta).toBeChecked();

    // Pagination
    const paginationNav = canvas.getByRole('navigation', { name: 'Data table pagination' });
    expect(paginationNav).toBeInTheDocument();
    const prevBtn = within(paginationNav).getByRole('button', { name: 'Prev' });
    expect(prevBtn).toBeDisabled();
  },
};
