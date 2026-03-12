export default {
  title: 'Navigation/Toolbar'
};

export const Default = () => `
  <nav class="ct-toolbar" aria-label="Main navigation">
    <a class="ct-toolbar__brand" href="#">
      <span class="ct-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
      Accessful
    </a>
    <ul class="ct-toolbar__nav">
      <li><a class="ct-toolbar__nav-link ct-toolbar__nav-link--active" href="#" aria-current="page">
        <span class="ct-icon ct-icon--sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></span>
        Dashboard
      </a></li>
      <li><a class="ct-toolbar__nav-link" href="#">
        <span class="ct-icon ct-icon--sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
        Documents
      </a></li>
      <li><a class="ct-toolbar__nav-link" href="#">
        <span class="ct-icon ct-icon--sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
        Support
      </a></li>
      <li><a class="ct-toolbar__nav-link" href="#">
        <span class="ct-icon ct-icon--sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
        API Keys
      </a></li>
    </ul>
    <div class="ct-toolbar__spacer"></div>
    <div class="ct-toolbar__actions">
      <div class="ct-dropdown">
        <button class="ct-button ct-button--ghost ct-button--icon" type="button" aria-label="Profile menu">
          <span class="ct-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
        </button>
      </div>
    </div>
  </nav>
`;

export const Minimal = () => `
  <nav class="ct-toolbar" aria-label="Main navigation">
    <a class="ct-toolbar__brand" href="#">My App</a>
    <div class="ct-toolbar__spacer"></div>
    <div class="ct-toolbar__actions">
      <button class="ct-button ct-button--sm">Sign In</button>
    </div>
  </nav>
`;
