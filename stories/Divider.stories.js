import { expect, within } from 'storybook/test';

export default {
  title: 'Layout/Divider',
  parameters: {
    docs: {
      description: {
        component:
          'A visual separator for content sections. Supports horizontal (default) and vertical orientations, color variants, spacing sizes, and optional centered labels.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'strong', 'muted'],
      description: 'Color variant',
    },
    spacing: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'none'],
      description: 'Vertical margin size',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Divider orientation',
    },
    label: {
      control: 'text',
      description: 'Optional centered label text',
    },
  },
};

function buildClasses({ variant, spacing, orientation, label }) {
  const classes = ['ct-divider'];
  if (orientation === 'vertical') classes.push('ct-divider--vertical');
  if (variant === 'strong') classes.push('ct-divider--strong');
  if (variant === 'muted') classes.push('ct-divider--muted');
  if (spacing === 'sm') classes.push('ct-divider--sm');
  if (spacing === 'lg') classes.push('ct-divider--lg');
  if (spacing === 'none') classes.push('ct-divider--none');
  if (label) classes.push('ct-divider--labeled');
  return classes.join(' ');
}

export const Playground = {
  args: {
    variant: 'default',
    spacing: 'default',
    orientation: 'horizontal',
    label: '',
  },
  render: (args) => {
    const cls = buildClasses(args);
    if (args.label) {
      return `
      <p>Content above</p>
      <div class="${cls}" role="separator" aria-label="${args.label}">
        <span class="ct-divider__label">${args.label}</span>
      </div>
      <p>Content below</p>`;
    }
    if (args.orientation === 'vertical') {
      return `
      <div style="display: flex; align-items: center; height: 48px;">
        <span>Left</span>
        <hr class="${cls}" aria-orientation="vertical" />
        <span>Right</span>
      </div>`;
    }
    return `
    <p>Content above</p>
    <hr class="${cls}" />
    <p>Content below</p>`;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const divider = canvasElement.querySelector('.ct-divider');
    expect(divider).toBeInTheDocument();
  },
};

export const Horizontal = {
  render: () => `
  <p>First section of content.</p>
  <hr class="ct-divider" />
  <p>Second section of content.</p>`,
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('hr.ct-divider');
    expect(divider).toBeInTheDocument();
    expect(divider.tagName).toBe('HR');
  },
};

export const Vertical = {
  render: () => `
  <div style="display: flex; align-items: center; height: 48px;">
    <span>Home</span>
    <hr class="ct-divider ct-divider--vertical" aria-orientation="vertical" />
    <span>Settings</span>
    <hr class="ct-divider ct-divider--vertical" aria-orientation="vertical" />
    <span>Profile</span>
  </div>`,
  play: async ({ canvasElement }) => {
    const dividers = canvasElement.querySelectorAll('.ct-divider--vertical');
    expect(dividers.length).toBe(2);
    dividers.forEach((d) => {
      expect(d).toHaveAttribute('aria-orientation', 'vertical');
    });
  },
};

export const ColorVariants = {
  render: () => `
  <p>Default border</p>
  <hr class="ct-divider" />
  <p>Strong border</p>
  <hr class="ct-divider ct-divider--strong" />
  <p>Muted border</p>
  <hr class="ct-divider ct-divider--muted" />
  <p>End</p>`,
  play: async ({ canvasElement }) => {
    const dividers = canvasElement.querySelectorAll('.ct-divider');
    expect(dividers.length).toBe(3);
  },
};

export const SpacingVariants = {
  render: () => `
  <p>Small spacing</p>
  <hr class="ct-divider ct-divider--sm" />
  <p>Default spacing</p>
  <hr class="ct-divider" />
  <p>Large spacing</p>
  <hr class="ct-divider ct-divider--lg" />
  <p>No spacing</p>
  <hr class="ct-divider ct-divider--none" />
  <p>End</p>`,
  play: async ({ canvasElement }) => {
    const dividers = canvasElement.querySelectorAll('.ct-divider');
    expect(dividers.length).toBe(4);
  },
};

export const Labeled = {
  render: () => `
  <p>Sign in with email</p>
  <div class="ct-divider ct-divider--labeled" role="separator" aria-label="OR">
    <span class="ct-divider__label">OR</span>
  </div>
  <p>Sign in with Google</p>`,
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.ct-divider--labeled');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveAttribute('role', 'separator');
    expect(divider).toHaveAttribute('aria-label', 'OR');
    const label = canvasElement.querySelector('.ct-divider__label');
    expect(label).toHaveTextContent('OR');
  },
};

export const LabeledSectionTitle = {
  render: () => `
  <div class="ct-divider ct-divider--labeled" role="separator" aria-label="Account Settings">
    <span class="ct-divider__label">Account Settings</span>
  </div>
  <p>Manage your account preferences below.</p>`,
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.ct-divider--labeled');
    expect(divider).toHaveAttribute('aria-label', 'Account Settings');
  },
};

export const Decorative = {
  render: () => `
  <p>Content above</p>
  <hr class="ct-divider" role="none" />
  <p>Content below</p>`,
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.ct-divider');
    expect(divider).toHaveAttribute('role', 'none');
  },
};

export const InCard = {
  render: () => `
  <div class="ct-card" style="max-width: 320px;">
    <div class="ct-card__header">
      <h3 class="ct-card__title">Plan Details</h3>
    </div>
    <hr class="ct-divider ct-divider--none" />
    <div class="ct-card__body">
      <p>You are on the <strong>Pro</strong> plan.</p>
    </div>
    <hr class="ct-divider ct-divider--none" />
    <div class="ct-card__footer">
      <button class="ct-button ct-button--secondary ct-button--sm">Manage</button>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const dividers = canvasElement.querySelectorAll('.ct-divider--none');
    expect(dividers.length).toBe(2);
  },
};

export const InToolbar = {
  render: () => `
  <div class="ct-toolbar" role="toolbar" aria-label="Formatting" style="display: flex; align-items: center; gap: var(--space-2); height: 40px;">
    <button class="ct-button ct-button--ghost ct-button--sm">Bold</button>
    <button class="ct-button ct-button--ghost ct-button--sm">Italic</button>
    <hr class="ct-divider ct-divider--vertical ct-divider--sm" aria-orientation="vertical" />
    <button class="ct-button ct-button--ghost ct-button--sm">Align Left</button>
    <button class="ct-button ct-button--ghost ct-button--sm">Align Center</button>
    <hr class="ct-divider ct-divider--vertical ct-divider--sm" aria-orientation="vertical" />
    <button class="ct-button ct-button--ghost ct-button--sm">Link</button>
  </div>`,
  play: async ({ canvasElement }) => {
    const dividers = canvasElement.querySelectorAll('.ct-divider--vertical');
    expect(dividers.length).toBe(2);
    dividers.forEach((d) => {
      expect(d).toHaveAttribute('aria-orientation', 'vertical');
    });
  },
};
