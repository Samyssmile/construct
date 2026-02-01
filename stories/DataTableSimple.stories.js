export default {
  title: 'Components/Data Table Simple'
};

export const DataTableSimple = () => `
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
`;
