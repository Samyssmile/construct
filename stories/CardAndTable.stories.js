export default {
  title: 'Data Display/Card & Table'
};

export const Card = () => `
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
`;

export const Table = () => `
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
`;
