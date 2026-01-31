export default {
  title: 'Components/Card & Table'
};

export const Card = () => `
  <section class="af-card" style="max-width: 420px;">
    <div class="af-card__header">
      <h3>Team</h3>
      <button class="af-button af-button--ghost">Edit</button>
    </div>
    <div class="af-card__body">
      <p>Shared ownership and clear permissions.</p>
      <p class="af-muted">Updated 2 days ago</p>
    </div>
    <div class="af-card__footer">
      <span class="af-muted">12 members</span>
      <button class="af-button af-button--secondary">Open</button>
    </div>
  </section>
`;

export const Table = () => `
  <div class="af-table-wrap" style="max-width: 720px;">
    <table class="af-table af-table--striped">
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
`;
