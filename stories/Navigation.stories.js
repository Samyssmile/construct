export default {
  title: 'Navigation/Navigation'
};

export const Tabs = () => `
  <div class="ct-tabs" style="max-width: 560px;">
    <div class="ct-tabs__list" role="tablist">
      <button class="ct-tabs__trigger" role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1" tabindex="0">Overview</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">Settings</button>
      <button class="ct-tabs__trigger" role="tab" aria-selected="false" aria-controls="panel-3" id="tab-3" tabindex="-1">Members</button>
    </div>
    <div class="ct-tabs__panel" role="tabpanel" id="panel-1" aria-labelledby="tab-1">
      <p class="ct-muted">Panel content</p>
    </div>
  </div>
`;

export const Pagination = () => `
  <nav class="ct-pagination" aria-label="Pagination">
    <ul class="ct-pagination__list">
      <li><button class="ct-pagination__link" type="button">1</button></li>
      <li><button class="ct-pagination__link" aria-current="page" type="button">2</button></li>
      <li><button class="ct-pagination__link" type="button">3</button></li>
      <li><button class="ct-pagination__link" type="button">4</button></li>
    </ul>
  </nav>
`;

export const Breadcrumbs = () => `
  <nav class="ct-breadcrumbs" aria-label="Breadcrumb">
    <ol class="ct-breadcrumbs__list">
      <li class="ct-breadcrumbs__item">
        <a class="ct-breadcrumbs__link" href="/">Home</a>
        <span class="ct-breadcrumbs__separator">/</span>
      </li>
      <li class="ct-breadcrumbs__item">
        <a class="ct-breadcrumbs__link" href="/projects">Projects</a>
        <span class="ct-breadcrumbs__separator">/</span>
      </li>
      <li class="ct-breadcrumbs__item">
        <span class="ct-breadcrumbs__current">Alpha</span>
      </li>
    </ol>
  </nav>
`;
