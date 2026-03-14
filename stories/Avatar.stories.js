import { expect, within } from 'storybook/test';

const USER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

export default {
  title: 'Data Display/Avatar',
  parameters: {
    docs: {
      description: {
        component: 'Avatar component for displaying user representations — images, initials, or fallback icons. Supports four sizes (sm, md, lg, xl), status indicators, and avatar groups with overflow.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['image', 'initials', 'icon'],
      description: 'Avatar content type',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Avatar size',
    },
    status: {
      control: 'select',
      options: ['none', 'online', 'offline', 'busy', 'away'],
      description: 'Status indicator',
    },
  },
};

export const Playground = {
  args: {
    variant: 'initials',
    size: 'md',
    status: 'none',
  },
  render: ({ variant, size, status }) => {
    const sizeClass = size !== 'md' ? ` ct-avatar--${size}` : '';
    const statusDot = status !== 'none'
      ? `<span class="ct-avatar__status" data-status="${status}" role="img" aria-label="${status[0].toUpperCase() + status.slice(1)}"></span>`
      : '';

    if (variant === 'image') {
      return `<span class="ct-avatar${sizeClass}">
        <img class="ct-avatar__image" src="https://i.pravatar.cc/128?u=playground" alt="Jane Smith" />
        ${statusDot}
      </span>`;
    }

    if (variant === 'icon') {
      return `<span class="ct-avatar${sizeClass}" role="img" aria-label="User avatar">
        <span class="ct-avatar__icon" aria-hidden="true">${USER_SVG}</span>
        ${statusDot}
      </span>`;
    }

    return `<span class="ct-avatar${sizeClass}" role="img" aria-label="Jane Smith">
      <span class="ct-avatar__initials" aria-hidden="true">JS</span>
      ${statusDot}
    </span>`;
  },
  play: async ({ canvasElement }) => {
    const avatar = canvasElement.querySelector('.ct-avatar');
    expect(avatar).toBeInTheDocument();
  },
};

export const Variants = {
  render: () => `
  <div class="ct-cluster" style="--ct-cluster-gap: var(--space-6); align-items: center;">
    <div style="text-align: center;">
      <span class="ct-avatar">
        <img class="ct-avatar__image" src="https://i.pravatar.cc/128?u=image" alt="Alice Johnson" />
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">Image</div>
    </div>

    <div style="text-align: center;">
      <span class="ct-avatar" role="img" aria-label="Bob Miller">
        <span class="ct-avatar__initials" aria-hidden="true">BM</span>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">Initials</div>
    </div>

    <div style="text-align: center;">
      <span class="ct-avatar" role="img" aria-label="User avatar">
        <span class="ct-avatar__icon" aria-hidden="true">${USER_SVG}</span>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">Icon</div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Image avatar has alt text
    const img = canvasElement.querySelector('.ct-avatar__image');
    expect(img).toHaveAttribute('alt', 'Alice Johnson');

    // Initials avatar has role="img" and aria-label
    const initialsAvatar = canvasElement.querySelector('.ct-avatar__initials')
      .closest('.ct-avatar');
    expect(initialsAvatar).toHaveAttribute('role', 'img');
    expect(initialsAvatar).toHaveAttribute('aria-label', 'Bob Miller');

    // Initials content is aria-hidden (label provides the name)
    const initials = canvasElement.querySelector('.ct-avatar__initials');
    expect(initials).toHaveAttribute('aria-hidden', 'true');

    // Icon avatar has role="img" and aria-label
    const iconAvatar = canvasElement.querySelector('.ct-avatar__icon')
      .closest('.ct-avatar');
    expect(iconAvatar).toHaveAttribute('role', 'img');
    expect(iconAvatar).toHaveAttribute('aria-label', 'User avatar');

    // Icon content is hidden from AT
    const icon = canvasElement.querySelector('.ct-avatar__icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  },
};

export const Sizes = {
  render: () => `
  <div class="ct-cluster" style="--ct-cluster-gap: var(--space-6); align-items: flex-end;">
    <div style="text-align: center;">
      <span class="ct-avatar ct-avatar--sm" role="img" aria-label="Small avatar">
        <span class="ct-avatar__initials" aria-hidden="true">SM</span>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">sm (24px)</div>
    </div>

    <div style="text-align: center;">
      <span class="ct-avatar" role="img" aria-label="Medium avatar">
        <span class="ct-avatar__initials" aria-hidden="true">MD</span>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">md (32px)</div>
    </div>

    <div style="text-align: center;">
      <span class="ct-avatar ct-avatar--lg" role="img" aria-label="Large avatar">
        <span class="ct-avatar__initials" aria-hidden="true">LG</span>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">lg (48px)</div>
    </div>

    <div style="text-align: center;">
      <span class="ct-avatar ct-avatar--xl" role="img" aria-label="Extra large avatar">
        <span class="ct-avatar__initials" aria-hidden="true">XL</span>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">xl (64px)</div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const avatars = canvasElement.querySelectorAll('.ct-avatar');
    expect(avatars).toHaveLength(4);

    expect(avatars[0].classList.contains('ct-avatar--sm')).toBe(true);
    expect(avatars[1].classList.contains('ct-avatar--sm')).toBe(false);
    expect(avatars[2].classList.contains('ct-avatar--lg')).toBe(true);
    expect(avatars[3].classList.contains('ct-avatar--xl')).toBe(true);
  },
};

export const StatusIndicators = {
  render: () => `
  <div class="ct-cluster" style="--ct-cluster-gap: var(--space-6); align-items: center;">
    <div style="text-align: center;">
      <span class="ct-avatar ct-avatar--lg" role="img" aria-label="Alice, Online">
        <span class="ct-avatar__initials" aria-hidden="true">AJ</span>
        <span class="ct-avatar__status" data-status="online" role="img" aria-label="Online"></span>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">Online</div>
    </div>

    <div style="text-align: center;">
      <span class="ct-avatar ct-avatar--lg" role="img" aria-label="Bob, Offline">
        <span class="ct-avatar__initials" aria-hidden="true">BM</span>
        <span class="ct-avatar__status" data-status="offline" role="img" aria-label="Offline"></span>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">Offline</div>
    </div>

    <div style="text-align: center;">
      <span class="ct-avatar ct-avatar--lg" role="img" aria-label="Carol, Busy">
        <span class="ct-avatar__initials" aria-hidden="true">CK</span>
        <span class="ct-avatar__status" data-status="busy" role="img" aria-label="Busy"></span>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">Busy</div>
    </div>

    <div style="text-align: center;">
      <span class="ct-avatar ct-avatar--lg" role="img" aria-label="Dan, Away">
        <span class="ct-avatar__initials" aria-hidden="true">DW</span>
        <span class="ct-avatar__status" data-status="away" role="img" aria-label="Away"></span>
      </span>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2);">Away</div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const statuses = canvasElement.querySelectorAll('.ct-avatar__status');
    expect(statuses).toHaveLength(4);

    // Each status dot has a data-status attribute
    expect(statuses[0]).toHaveAttribute('data-status', 'online');
    expect(statuses[1]).toHaveAttribute('data-status', 'offline');
    expect(statuses[2]).toHaveAttribute('data-status', 'busy');
    expect(statuses[3]).toHaveAttribute('data-status', 'away');

    // Each status dot has an accessible aria-label
    expect(statuses[0]).toHaveAttribute('aria-label', 'Online');
    expect(statuses[1]).toHaveAttribute('aria-label', 'Offline');
    expect(statuses[2]).toHaveAttribute('aria-label', 'Busy');
    expect(statuses[3]).toHaveAttribute('aria-label', 'Away');
  },
};

export const Group = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-8);">
    <div>
      <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-3);">Avatar Group</div>
      <div class="ct-avatar-group" role="group" aria-label="Team members, 4 total">
        <span class="ct-avatar">
          <img class="ct-avatar__image" src="https://i.pravatar.cc/128?u=g1" alt="Alice" />
        </span>
        <span class="ct-avatar" role="img" aria-label="Bob">
          <span class="ct-avatar__initials" aria-hidden="true">BM</span>
        </span>
        <span class="ct-avatar" role="img" aria-label="Carol">
          <span class="ct-avatar__initials" aria-hidden="true">CK</span>
        </span>
        <span class="ct-avatar">
          <img class="ct-avatar__image" src="https://i.pravatar.cc/128?u=g4" alt="Dan" />
        </span>
      </div>
    </div>

    <div>
      <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-3);">With Overflow</div>
      <div class="ct-avatar-group" role="group" aria-label="Team members, 7 total">
        <span class="ct-avatar-group__overflow" role="img" aria-label="3 more members">+3</span>
        <span class="ct-avatar">
          <img class="ct-avatar__image" src="https://i.pravatar.cc/128?u=o1" alt="Eve" />
        </span>
        <span class="ct-avatar" role="img" aria-label="Frank">
          <span class="ct-avatar__initials" aria-hidden="true">FG</span>
        </span>
        <span class="ct-avatar" role="img" aria-label="Grace">
          <span class="ct-avatar__initials" aria-hidden="true">GH</span>
        </span>
        <span class="ct-avatar">
          <img class="ct-avatar__image" src="https://i.pravatar.cc/128?u=o4" alt="Hank" />
        </span>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll('.ct-avatar-group');
    expect(groups).toHaveLength(2);

    // Groups use role="group" with aria-label announcing total count
    expect(groups[0]).toHaveAttribute('role', 'group');
    expect(groups[0]).toHaveAttribute('aria-label', 'Team members, 4 total');
    expect(groups[1]).toHaveAttribute('aria-label', 'Team members, 7 total');

    // First group has 4 avatars
    expect(groups[0].querySelectorAll('.ct-avatar')).toHaveLength(4);

    // Second group has 4 avatars + overflow indicator
    expect(groups[1].querySelectorAll('.ct-avatar')).toHaveLength(4);
    const overflow = groups[1].querySelector('.ct-avatar-group__overflow');
    expect(overflow).toBeInTheDocument();
    expect(overflow.textContent.trim()).toBe('+3');
    expect(overflow).toHaveAttribute('aria-label', '3 more members');
  },
};
