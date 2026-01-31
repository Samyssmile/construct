export default {
  title: 'Components/Navigation'
};

export const Tabs = () => `
  <div class="af-tabs" style="max-width: 560px;">
    <div class="af-tabs__list" role="tablist">
      <button class="af-tabs__trigger" role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1" tabindex="0">Overview</button>
      <button class="af-tabs__trigger" role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">Settings</button>
      <button class="af-tabs__trigger" role="tab" aria-selected="false" aria-controls="panel-3" id="tab-3" tabindex="-1">Members</button>
    </div>
    <div class="af-tabs__panel" role="tabpanel" id="panel-1" aria-labelledby="tab-1">
      <p class="af-muted">Panel content</p>
    </div>
  </div>
`;

export const Pagination = () => `
  <nav class="af-pagination" aria-label="Pagination">
    <ul class="af-pagination__list">
      <li><button class="af-pagination__link" type="button">1</button></li>
      <li><button class="af-pagination__link" aria-current="page" type="button">2</button></li>
      <li><button class="af-pagination__link" type="button">3</button></li>
      <li><button class="af-pagination__link" type="button">4</button></li>
    </ul>
  </nav>
`;

export const Breadcrumbs = () => `
  <nav class="af-breadcrumbs" aria-label="Breadcrumb">
    <ol class="af-breadcrumbs__list">
      <li class="af-breadcrumbs__item">
        <a class="af-breadcrumbs__link" href="/">Home</a>
        <span class="af-breadcrumbs__separator">/</span>
      </li>
      <li class="af-breadcrumbs__item">
        <a class="af-breadcrumbs__link" href="/projects">Projects</a>
        <span class="af-breadcrumbs__separator">/</span>
      </li>
      <li class="af-breadcrumbs__item">
        <span class="af-breadcrumbs__current">Alpha</span>
      </li>
    </ol>
  </nav>
`;
