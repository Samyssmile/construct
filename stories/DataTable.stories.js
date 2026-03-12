export default {
  title: 'Data Display/Data Table'
};

export const DataTable = () => `
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
        <select class="ct-select ct-control--sm" aria-label="Filter by status">
          <option>Status</option>
          <option>Active</option>
          <option>Paused</option>
          <option>Archived</option>
        </select>
        <select class="ct-select ct-control--sm" aria-label="Filter by owner">
          <option>Owner</option>
          <option>J. Chen</option>
          <option>L. Hart</option>
          <option>S. Rivera</option>
        </select>
      </div>
      <div class="ct-data-table__actions">
        <button class="ct-button ct-button--ghost ct-button--sm">Reset</button>
        <button class="ct-button ct-button--secondary ct-button--sm">Filters</button>
      </div>
    </div>
    <div class="ct-data-table__table">
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
          <select class="ct-select ct-control--sm" aria-label="Rows per page">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
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
`;

export const DataTableSimple = () => `
  <div class="ct-data-table ct-data-table--simple" style="max-width: 900px;">
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
`;
