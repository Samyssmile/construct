export default {
  title: 'Components/Data Table Simple'
};

export const DataTableSimple = () => `
  <div class="af-data-table af-data-table--simple" style="max-width: 960px;">
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
            <th scope="col" aria-sort="none">
              <button class="af-table__sort" type="button">
                Owner
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
            <td>J. Chen</td>
            <td>Jan 24, 2026</td>
          </tr>
          <tr>
            <td class="af-table__cell--checkbox">
              <input class="af-check__input" type="checkbox" aria-label="Select Beta" />
            </td>
            <td>Beta</td>
            <td>Paused</td>
            <td>L. Hart</td>
            <td>Jan 18, 2026</td>
          </tr>
          <tr>
            <td class="af-table__cell--checkbox">
              <input class="af-check__input" type="checkbox" aria-label="Select Gamma" />
            </td>
            <td>Gamma</td>
            <td>Active</td>
            <td>S. Rivera</td>
            <td>Jan 10, 2026</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="af-data-table__footer">
      <span>Showing 1-3 of 24</span>
      <nav class="af-pagination" aria-label="Data table pagination">
        <ul class="af-pagination__list">
          <li><button class="af-pagination__link" aria-disabled="true" disabled type="button">Prev</button></li>
          <li><button class="af-pagination__link" aria-current="page" type="button">1</button></li>
          <li><button class="af-pagination__link" type="button">2</button></li>
          <li><button class="af-pagination__link" type="button">3</button></li>
          <li><button class="af-pagination__link" type="button">Next</button></li>
        </ul>
      </nav>
    </div>
  </div>
`;
