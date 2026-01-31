export default {
  title: 'Components/Data Table'
};

export const DataTable = () => `
  <div class="af-data-table" style="max-width: 960px;">
    <div class="af-data-table__toolbar">
      <div class="af-data-table__filters">
        <input class="af-input af-control--sm" placeholder="Search" />
        <select class="af-select af-control--sm">
          <option>Status</option>
          <option>Active</option>
          <option>Paused</option>
        </select>
      </div>
      <div class="af-data-table__actions">
        <button class="af-button af-button--secondary af-button--sm">Export</button>
        <button class="af-button af-button--sm">New</button>
      </div>
    </div>
    <div class="af-table-wrap">
      <table class="af-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Owner</th>
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
    <div class="af-data-table__footer">
      <span>Showing 1-10</span>
      <nav class="af-pagination" aria-label="Data table pagination">
        <ul class="af-pagination__list">
          <li><a class="af-pagination__link" aria-current="page" href="#">1</a></li>
          <li><a class="af-pagination__link" href="#">2</a></li>
        </ul>
      </nav>
    </div>
  </div>
`;
