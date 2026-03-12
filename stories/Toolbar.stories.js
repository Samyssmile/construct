import { expect, within } from 'storybook/test';

export default {
  title: 'Navigation/Toolbar',
  parameters: {
    docs: {
      description: {
        component: 'Horizontal navigation bar with brand logo, nav links with icons, and utility action buttons. Uses a `<nav>` landmark with `aria-label` for top-level app navigation.',
      },
    },
  },
  argTypes: {
    brand: { control: 'text', description: 'Brand / product name' },
    ariaLabel: { control: 'text', description: 'Accessible label for the navigation landmark' },
    activeItem: {
      control: 'select',
      options: ['Dashboard', 'Documents', 'Settings'],
      description: 'Currently active navigation item',
    },
  },
};

export const Playground = {
  args: {
    brand: 'Accessful',
    ariaLabel: 'Main navigation',
    activeItem: 'Dashboard',
  },
  render: ({ brand, ariaLabel, activeItem }) => {
    const items = ['Dashboard', 'Documents', 'Settings'];
    const navLinks = items.map(item => {
      const isActive = item === activeItem;
      const activeClass = isActive ? ' ct-toolbar__nav-link--active' : '';
      const ariaCurrent = isActive ? ' aria-current="page"' : '';
      return `<li><a class="ct-toolbar__nav-link${activeClass}" href="#"${ariaCurrent}>${item}</a></li>`;
    }).join('\n      ');
    return `
  <nav class="ct-toolbar" aria-label="${ariaLabel}">
    <a class="ct-toolbar__brand" href="#">${brand}</a>
    <ul class="ct-toolbar__nav">
      ${navLinks}
    </ul>
    <div class="ct-toolbar__spacer"></div>
  </nav>`;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label');
    const activeLink = canvasElement.querySelector('[aria-current="page"]');
    expect(activeLink).toBeInTheDocument();
  },
};

export const Default = {
  render: () => `
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
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Toolbar is a navigation landmark
    const nav = canvas.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();

    // Active page marked with aria-current
    const activeLink = canvas.getByRole('link', { name: /Dashboard/ });
    expect(activeLink).toHaveAttribute('aria-current', 'page');

    // Other nav links do not carry aria-current
    const docsLink = canvas.getByRole('link', { name: /Documents/ });
    expect(docsLink).not.toHaveAttribute('aria-current');

    // All nav links are present
    expect(canvas.getByRole('link', { name: /Support/ })).toBeInTheDocument();
    expect(canvas.getByRole('link', { name: /API Keys/ })).toBeInTheDocument();

    // Brand link
    expect(canvas.getByRole('link', { name: /Accessful/ })).toBeInTheDocument();

    // Icon button has accessible label
    const profileBtn = canvas.getByRole('button', { name: 'Profile menu' });
    expect(profileBtn).toHaveAttribute('aria-label', 'Profile menu');
  },
};

export const Minimal = {
  render: () => `
  <nav class="ct-toolbar" aria-label="Main navigation">
    <a class="ct-toolbar__brand" href="#">My App</a>
    <div class="ct-toolbar__spacer"></div>
    <div class="ct-toolbar__actions">
      <button class="ct-button ct-button--sm">Sign In</button>
    </div>
  </nav>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Navigation landmark present
    const nav = canvas.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();

    // Brand link
    expect(canvas.getByRole('link', { name: 'My App' })).toBeInTheDocument();

    // Sign in button is enabled
    const signInBtn = canvas.getByRole('button', { name: 'Sign In' });
    expect(signInBtn).toBeEnabled();
  },
};
