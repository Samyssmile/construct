export default {
  title: 'Components/Data Table'
};

export const DataTable = () => `
  <div class="af-data-table" style="max-width: 1100px;">
    <div class="af-data-table__header">
      <div class="af-data-table__title">
        <h3>Projects</h3>
        <span class="af-data-table__meta">24 total · Updated 2 days ago</span>
      </div>
      <div class="af-data-table__actions">
        <button class="af-button af-button--secondary af-button--sm">Export</button>
        <button class="af-button af-button--sm">New project</button>
      </div>
    </div>
    <div class="af-data-table__toolbar">
      <div class="af-data-table__filters">
        <input class="af-input af-control--sm af-data-table__search" placeholder="Search projects" />
        <select class="af-select af-control--sm">
          <option>Status</option>
          <option>Active</option>
          <option>Paused</option>
          <option>Archived</option>
        </select>
        <select class="af-select af-control--sm">
          <option>Owner</option>
          <option>J. Chen</option>
          <option>L. Hart</option>
          <option>S. Rivera</option>
        </select>
      </div>
      <div class="af-data-table__actions">
        <button class="af-button af-button--ghost af-button--sm">Reset</button>
        <button class="af-button af-button--secondary af-button--sm">Filters</button>
      </div>
    </div>
    <div class="af-data-table__table">
      <table class="af-table af-table--striped af-table--compact">
        <thead>
          <tr>
            <th scope="col" class="af-table__cell--checkbox">
              <input class="af-check__input" type="checkbox" aria-label="Select all rows" />
            </th>
            <th scope="col">Project</th>
            <th scope="col">Status</th>
            <th scope="col">Owner</th>
            <th scope="col" class="af-table__cell--numeric">Tasks</th>
            <th scope="col">Updated</th>
            <th scope="col" class="af-table__cell--actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="af-table__cell--checkbox">
              <input class="af-check__input" type="checkbox" aria-label="Select Alpha" checked />
            </td>
            <td>
              <span class="af-table__title">Alpha</span>
              <span class="af-table__meta">Enterprise rollout</span>
            </td>
            <td>Active</td>
            <td>J. Chen</td>
            <td class="af-table__cell--numeric">128</td>
            <td>Jan 24, 2026</td>
            <td class="af-table__cell--actions">
              <button class="af-button af-button--ghost af-button--sm">Open</button>
            </td>
          </tr>
          <tr>
            <td class="af-table__cell--checkbox">
              <input class="af-check__input" type="checkbox" aria-label="Select Beta" />
            </td>
            <td>
              <span class="af-table__title">Beta</span>
              <span class="af-table__meta">Onboarding</span>
            </td>
            <td>Paused</td>
            <td>L. Hart</td>
            <td class="af-table__cell--numeric">64</td>
            <td>Jan 18, 2026</td>
            <td class="af-table__cell--actions">
              <button class="af-button af-button--ghost af-button--sm">Open</button>
            </td>
          </tr>
          <tr>
            <td class="af-table__cell--checkbox">
              <input class="af-check__input" type="checkbox" aria-label="Select Gamma" />
            </td>
            <td>
              <span class="af-table__title">Gamma</span>
              <span class="af-table__meta">Mobile rework</span>
            </td>
            <td>Active</td>
            <td>S. Rivera</td>
            <td class="af-table__cell--numeric">92</td>
            <td>Jan 10, 2026</td>
            <td class="af-table__cell--actions">
              <button class="af-button af-button--ghost af-button--sm">Open</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="af-data-table__footer">
      <span>Showing 1-3 of 24</span>
      <div class="af-data-table__footer-actions">
        <div class="af-data-table__page-size">
          <span>Rows</span>
          <select class="af-select af-control--sm" aria-label="Rows per page">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <nav class="af-pagination" aria-label="Data table pagination">
          <ul class="af-pagination__list">
            <li><a class="af-pagination__link" aria-disabled="true" href="#">Prev</a></li>
            <li><a class="af-pagination__link" aria-current="page" href="#">1</a></li>
            <li><a class="af-pagination__link" href="#">2</a></li>
            <li><a class="af-pagination__link" href="#">3</a></li>
            <li><a class="af-pagination__link" href="#">Next</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
`;

export const DataTableSimple = () => `
  <div class="af-data-table af-data-table--simple" style="max-width: 900px;">
    <div class="af-data-table__table">
      <table class="af-table af-table--striped af-table--compact">
        <thead>
          <tr>
            <th scope="col" class="af-table__cell--checkbox">
              <input class="af-check__input" type="checkbox" aria-label="Select all rows" />
            </th>
            <th scope="col" aria-sort="ascending">
              <button class="af-table__sort" type="button">
                Project
                <span class="af-table__sort-indicator" aria-hidden="true"></span>
              </button>
            </th>
            <th scope="col" aria-sort="none">
              <button class="af-table__sort" type="button">
                Status
                <span class="af-table__sort-indicator" aria-hidden="true"></span>
              </button>
            </th>
            <th scope="col" aria-sort="descending">
              <button class="af-table__sort" type="button">
                Updated
                <span class="af-table__sort-indicator" aria-hidden="true"></span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="af-table__cell--checkbox">
              <input class="af-check__input" type="checkbox" aria-label="Select Alpha" checked />
            </td>
            <td>Alpha</td>
            <td>Active</td>
            <td>Jan 24, 2026</td>
          </tr>
          <tr>
            <td class="af-table__cell--checkbox">
              <input class="af-check__input" type="checkbox" aria-label="Select Beta" />
            </td>
            <td>Beta</td>
            <td>Paused</td>
            <td>Jan 18, 2026</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="af-data-table__footer">
      <span>Showing 1-2 of 24</span>
      <nav class="af-pagination" aria-label="Data table pagination">
        <ul class="af-pagination__list">
          <li><a class="af-pagination__link" aria-disabled="true" href="#">Prev</a></li>
          <li><a class="af-pagination__link" aria-current="page" href="#">1</a></li>
          <li><a class="af-pagination__link" href="#">2</a></li>
          <li><a class="af-pagination__link" href="#">3</a></li>
          <li><a class="af-pagination__link" href="#">Next</a></li>
        </ul>
      </nav>
    </div>
  </div>
`;
