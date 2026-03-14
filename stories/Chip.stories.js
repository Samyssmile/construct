import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Data Display/Chip',
  parameters: {
    docs: {
      description: {
        component: 'Accessible chip component for tags, filters, and selections. Supports subtle, outline, and solid styles, semantic colors with built-in icons, dot indicators, avatars, truncation, and interactive toggle with animated checkmarks.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Chip text content' },
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'danger'],
      description: 'Semantic color variant',
    },
    style: {
      control: 'select',
      options: ['subtle', 'outline', 'solid'],
      description: 'Visual style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Chip size',
    },
    interactive: { control: 'boolean', description: 'Interactive (toggle) mode' },
    removable: { control: 'boolean', description: 'Show remove button' },
    dot: { control: 'boolean', description: 'Show dot indicator' },
    check: { control: 'boolean', description: 'Show checkmark when selected' },
    disabled: { control: 'boolean', description: 'Disabled state' },
  },
};

export const Playground = {
  args: {
    label: 'Design System',
    variant: 'default',
    style: 'subtle',
    size: 'md',
    interactive: false,
    removable: false,
    dot: false,
    check: false,
    disabled: false,
  },
  render: ({ label, variant, style, size, interactive, removable, dot, check, disabled }) => {
    const classes = ['ct-chip'];
    if (variant !== 'default') classes.push(`ct-chip--${variant}`);
    if (size !== 'md') classes.push(`ct-chip--${size}`);
    if (style === 'outline') classes.push('ct-chip--outline');
    if (style === 'solid') classes.push('ct-chip--solid');
    if (interactive) classes.push('ct-chip--interactive');

    const tag = interactive ? 'button' : 'span';
    const attrs = [];
    if (interactive) attrs.push('type="button"', 'aria-pressed="false"');
    if (disabled) attrs.push('aria-disabled="true"');

    const dotEl = dot ? '<span class="ct-chip__dot" aria-hidden="true"></span>' : '';
    const checkEl = check ? '<span class="ct-chip__check" aria-hidden="true"></span>' : '';
    const iconEl = variant !== 'default'
      ? `<span class="ct-chip__icon ct-chip__icon--${variant}" aria-hidden="true"></span>`
      : '';
    const removeBtn = removable
      ? ' <button class="ct-chip__remove" type="button" aria-label="Remove"><span aria-hidden="true">\u00d7</span></button>'
      : '';

    return `<${tag} class="${classes.join(' ')}" ${attrs.join(' ')}>${checkEl}${dotEl}${iconEl}${label}${removeBtn}</${tag}>`;
  },
  play: async ({ canvasElement }) => {
    const chip = canvasElement.querySelector('.ct-chip');
    expect(chip).toBeInTheDocument();
  },
};

export const Sizes = {
  render: () => `
  <div class="ct-cluster" style="align-items: center;">
    <span class="ct-chip ct-chip--sm">Small</span>
    <span class="ct-chip">Medium (default)</span>
    <span class="ct-chip ct-chip--lg">Large</span>
  </div>
`,
  play: async ({ canvasElement }) => {
    const chips = canvasElement.querySelectorAll('.ct-chip');
    expect(chips).toHaveLength(3);

    expect(chips[0]).toHaveClass('ct-chip--sm');
    expect(chips[2]).toHaveClass('ct-chip--lg');
  },
};

export const SemanticColors = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
    <h4 style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-muted);">Subtle (default)</h4>
    <div class="ct-cluster">
      <span class="ct-chip">Default</span>
      <span class="ct-chip ct-chip--info">
        <span class="ct-chip__icon ct-chip__icon--info" aria-hidden="true"></span>Info
      </span>
      <span class="ct-chip ct-chip--success">
        <span class="ct-chip__icon ct-chip__icon--success" aria-hidden="true"></span>Success
      </span>
      <span class="ct-chip ct-chip--warning">
        <span class="ct-chip__icon ct-chip__icon--warning" aria-hidden="true"></span>Warning
      </span>
      <span class="ct-chip ct-chip--danger">
        <span class="ct-chip__icon ct-chip__icon--danger" aria-hidden="true"></span>Danger
      </span>
    </div>
    <h4 style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-muted);">Outline</h4>
    <div class="ct-cluster">
      <span class="ct-chip ct-chip--outline">Default</span>
      <span class="ct-chip ct-chip--outline ct-chip--info">
        <span class="ct-chip__icon ct-chip__icon--info" aria-hidden="true"></span>Info
      </span>
      <span class="ct-chip ct-chip--outline ct-chip--success">
        <span class="ct-chip__icon ct-chip__icon--success" aria-hidden="true"></span>Success
      </span>
      <span class="ct-chip ct-chip--outline ct-chip--warning">
        <span class="ct-chip__icon ct-chip__icon--warning" aria-hidden="true"></span>Warning
      </span>
      <span class="ct-chip ct-chip--outline ct-chip--danger">
        <span class="ct-chip__icon ct-chip__icon--danger" aria-hidden="true"></span>Danger
      </span>
    </div>
    <h4 style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-muted);">Solid</h4>
    <div class="ct-cluster">
      <span class="ct-chip ct-chip--solid">Default</span>
      <span class="ct-chip ct-chip--solid ct-chip--info">
        <span class="ct-chip__icon ct-chip__icon--info" aria-hidden="true"></span>Info
      </span>
      <span class="ct-chip ct-chip--solid ct-chip--success">
        <span class="ct-chip__icon ct-chip__icon--success" aria-hidden="true"></span>Success
      </span>
      <span class="ct-chip ct-chip--solid ct-chip--warning">
        <span class="ct-chip__icon ct-chip__icon--warning" aria-hidden="true"></span>Warning
      </span>
      <span class="ct-chip ct-chip--solid ct-chip--danger">
        <span class="ct-chip__icon ct-chip__icon--danger" aria-hidden="true"></span>Danger
      </span>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const chips = canvasElement.querySelectorAll('.ct-chip');
    expect(chips).toHaveLength(15);

    // Subtle variants
    expect(chips[1]).toHaveClass('ct-chip--info');
    expect(chips[2]).toHaveClass('ct-chip--success');
    expect(chips[3]).toHaveClass('ct-chip--warning');
    expect(chips[4]).toHaveClass('ct-chip--danger');

    // Outline variants
    expect(chips[5]).toHaveClass('ct-chip--outline');
    expect(chips[6]).toHaveClass('ct-chip--outline', 'ct-chip--info');

    // Solid variants
    expect(chips[10]).toHaveClass('ct-chip--solid');
    expect(chips[11]).toHaveClass('ct-chip--solid', 'ct-chip--info');

    // Icons use mask-image
    const maskIcons = canvasElement.querySelectorAll('[class*="ct-chip__icon--"]');
    expect(maskIcons.length).toBeGreaterThanOrEqual(12);
  },
};

export const SolidVariant = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
    <div class="ct-cluster">
      <span class="ct-chip ct-chip--solid">Neutral</span>
      <span class="ct-chip ct-chip--solid ct-chip--info">
        <span class="ct-chip__icon ct-chip__icon--info" aria-hidden="true"></span>Info
      </span>
      <span class="ct-chip ct-chip--solid ct-chip--success">
        <span class="ct-chip__icon ct-chip__icon--success" aria-hidden="true"></span>Success
      </span>
      <span class="ct-chip ct-chip--solid ct-chip--warning">
        <span class="ct-chip__icon ct-chip__icon--warning" aria-hidden="true"></span>Warning
      </span>
      <span class="ct-chip ct-chip--solid ct-chip--danger">
        <span class="ct-chip__icon ct-chip__icon--danger" aria-hidden="true"></span>Danger
      </span>
    </div>
    <h4 style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-muted);">Solid with remove</h4>
    <div class="ct-cluster">
      <span class="ct-chip ct-chip--solid ct-chip--info">
        <span class="ct-chip__icon ct-chip__icon--info" aria-hidden="true"></span>
        Flagged
        <button class="ct-chip__remove" type="button" aria-label="Remove Flagged"><span aria-hidden="true">\u00d7</span></button>
      </span>
      <span class="ct-chip ct-chip--solid ct-chip--danger">
        <span class="ct-chip__icon ct-chip__icon--danger" aria-hidden="true"></span>
        Critical
        <button class="ct-chip__remove" type="button" aria-label="Remove Critical"><span aria-hidden="true">\u00d7</span></button>
      </span>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const solidChips = canvasElement.querySelectorAll('.ct-chip--solid');
    expect(solidChips.length).toBeGreaterThanOrEqual(5);

    const removeButtons = canvasElement.querySelectorAll('.ct-chip__remove');
    expect(removeButtons).toHaveLength(2);
    expect(removeButtons[0]).toHaveAttribute('aria-label', 'Remove Flagged');
  },
};

export const OutlineVariant = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
    <h4 style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-muted);">Outline chips</h4>
    <div class="ct-cluster">
      <span class="ct-chip ct-chip--outline">Draft</span>
      <span class="ct-chip ct-chip--outline ct-chip--info">Review</span>
      <span class="ct-chip ct-chip--outline ct-chip--success">Approved</span>
      <span class="ct-chip ct-chip--outline ct-chip--danger">Rejected</span>
    </div>
    <h4 style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-muted);">Outline interactive (selected)</h4>
    <div class="ct-cluster">
      <button type="button" class="ct-chip ct-chip--outline ct-chip--interactive" aria-pressed="false">Unselected</button>
      <button type="button" class="ct-chip ct-chip--outline ct-chip--interactive" aria-pressed="true">Selected</button>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    const unselected = canvas.getByRole('button', { name: 'Unselected' });
    expect(unselected).toHaveAttribute('aria-pressed', 'false');

    const selected = canvas.getByRole('button', { name: 'Selected' });
    expect(selected).toHaveAttribute('aria-pressed', 'true');
  },
};

export const DotIndicator = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
    <div class="ct-cluster">
      <span class="ct-chip">
        <span class="ct-chip__dot" aria-hidden="true"></span>Draft
      </span>
      <span class="ct-chip ct-chip--success">
        <span class="ct-chip__dot" aria-hidden="true"></span>Online
      </span>
      <span class="ct-chip ct-chip--danger">
        <span class="ct-chip__dot" aria-hidden="true"></span>Offline
      </span>
      <span class="ct-chip ct-chip--warning">
        <span class="ct-chip__dot" aria-hidden="true"></span>Away
      </span>
    </div>
    <h4 style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-muted);">Sizes</h4>
    <div class="ct-cluster" style="align-items: center;">
      <span class="ct-chip ct-chip--sm ct-chip--success">
        <span class="ct-chip__dot" aria-hidden="true"></span>Small
      </span>
      <span class="ct-chip ct-chip--success">
        <span class="ct-chip__dot" aria-hidden="true"></span>Medium
      </span>
      <span class="ct-chip ct-chip--lg ct-chip--success">
        <span class="ct-chip__dot" aria-hidden="true"></span>Large
      </span>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const dots = canvasElement.querySelectorAll('.ct-chip__dot');
    expect(dots).toHaveLength(7);

    // Dots have correct size
    const dot = dots[0];
    const dotStyles = window.getComputedStyle(dot);
    expect(dotStyles.borderRadius).not.toBe('0px');
  },
};

export const AvatarChip = {
  render: () => `
  <div class="ct-cluster" style="align-items: center;">
    <span class="ct-chip ct-chip--sm">
      <img class="ct-chip__avatar" src="https://i.pravatar.cc/32?u=1" alt="" />
      Alice
    </span>
    <span class="ct-chip">
      <img class="ct-chip__avatar" src="https://i.pravatar.cc/40?u=2" alt="" />
      Bob
    </span>
    <span class="ct-chip ct-chip--lg">
      <img class="ct-chip__avatar" src="https://i.pravatar.cc/48?u=3" alt="" />
      Charlie
    </span>
    <span class="ct-chip">
      <img class="ct-chip__avatar" src="https://i.pravatar.cc/40?u=4" alt="" />
      Dana
      <button class="ct-chip__remove" type="button" aria-label="Remove Dana"><span aria-hidden="true">\u00d7</span></button>
    </span>
  </div>
`,
  play: async ({ canvasElement }) => {
    const avatars = canvasElement.querySelectorAll('.ct-chip__avatar');
    expect(avatars).toHaveLength(4);

    // Avatars are circular
    for (const avatar of avatars) {
      const styles = window.getComputedStyle(avatar);
      expect(styles.borderRadius).not.toBe('0px');
      expect(styles.objectFit).toBe('cover');
    }
  },
};

export const Truncation = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4); max-width: 400px;">
    <span class="ct-chip">
      <span class="ct-chip__icon ct-chip__icon--info" aria-hidden="true"></span>
      <span class="ct-chip__label" style="--ct-chip-max-width: 120px;">This is a very long label that should truncate</span>
      <button class="ct-chip__remove" type="button" aria-label="Remove"><span aria-hidden="true">\u00d7</span></button>
    </span>
    <span class="ct-chip">
      <span class="ct-chip__label" style="--ct-chip-max-width: 80px;">Overflow text here</span>
    </span>
    <span class="ct-chip">
      <span class="ct-chip__label">No max-width — full text visible</span>
    </span>
  </div>
`,
  play: async ({ canvasElement }) => {
    const labels = canvasElement.querySelectorAll('.ct-chip__label');
    expect(labels).toHaveLength(3);

    // Truncated labels have overflow hidden
    const truncated = labels[0];
    const styles = window.getComputedStyle(truncated);
    expect(styles.overflow).toBe('hidden');
    expect(styles.textOverflow).toBe('ellipsis');
  },
};

export const SelectedWithCheck = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
    <h4 style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-muted);">Click to toggle — checkmark animates in/out</h4>
    <div class="ct-cluster" role="group" aria-label="Filter topics">
      <button type="button" class="ct-chip ct-chip--interactive" aria-pressed="true">
        <span class="ct-chip__check" aria-hidden="true"></span>Design
      </button>
      <button type="button" class="ct-chip ct-chip--interactive" aria-pressed="false">
        <span class="ct-chip__check" aria-hidden="true"></span>Engineering
      </button>
      <button type="button" class="ct-chip ct-chip--interactive" aria-pressed="false">
        <span class="ct-chip__check" aria-hidden="true"></span>Marketing
      </button>
    </div>
    <h4 style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-muted);">Semantic + checkmark</h4>
    <div class="ct-cluster" role="group" aria-label="Status filters">
      <button type="button" class="ct-chip ct-chip--interactive ct-chip--info" aria-pressed="true">
        <span class="ct-chip__check" aria-hidden="true"></span>
        <span class="ct-chip__icon ct-chip__icon--info" aria-hidden="true"></span>Info
      </button>
      <button type="button" class="ct-chip ct-chip--interactive ct-chip--success" aria-pressed="false">
        <span class="ct-chip__check" aria-hidden="true"></span>
        <span class="ct-chip__icon ct-chip__icon--success" aria-hidden="true"></span>Success
      </button>
      <button type="button" class="ct-chip ct-chip--interactive ct-chip--danger" aria-pressed="true">
        <span class="ct-chip__check" aria-hidden="true"></span>
        <span class="ct-chip__icon ct-chip__icon--danger" aria-hidden="true"></span>Danger
      </button>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    expect(buttons).toHaveLength(6);

    // Selected chip check is expanded (width > 0)
    const selectedCheck = buttons[0].querySelector('.ct-chip__check');
    const selectedStyles = window.getComputedStyle(selectedCheck);
    expect(selectedStyles.width).not.toBe('0px');

    // Unselected chip check is collapsed (width = 0)
    const unselectedCheck = buttons[1].querySelector('.ct-chip__check');
    const unselectedStyles = window.getComputedStyle(unselectedCheck);
    expect(unselectedStyles.width).toBe('0px');

    // Toggle via click
    await userEvent.click(buttons[1]);
    expect(buttons[1]).toHaveFocus();
  },
};

export const DisabledState = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
    <div class="ct-cluster">
      <span class="ct-chip" aria-disabled="true">Disabled</span>
      <span class="ct-chip ct-chip--info" aria-disabled="true">
        <span class="ct-chip__icon ct-chip__icon--info" aria-hidden="true"></span>Disabled Info
      </span>
      <span class="ct-chip ct-chip--success" aria-disabled="true">
        <span class="ct-chip__icon ct-chip__icon--success" aria-hidden="true"></span>Disabled Success
      </span>
    </div>
    <div class="ct-cluster">
      <button type="button" class="ct-chip ct-chip--interactive" aria-pressed="false" aria-disabled="true">Disabled Interactive</button>
      <span class="ct-chip" aria-disabled="true">Disabled Removable<button class="ct-chip__remove" type="button" aria-label="Remove" disabled><span aria-hidden="true">\u00d7</span></button></span>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const disabledChips = canvasElement.querySelectorAll('[aria-disabled="true"]');
    expect(disabledChips.length).toBeGreaterThanOrEqual(4);

    // Disabled chips should have reduced opacity
    for (const chip of disabledChips) {
      const styles = window.getComputedStyle(chip);
      expect(parseFloat(styles.opacity)).toBeLessThan(1);
    }
  },
};

export const InteractiveToggle = {
  render: () => `
  <div class="ct-cluster" role="group" aria-label="Filter by category">
    <button type="button" class="ct-chip ct-chip--interactive" aria-pressed="true">All</button>
    <button type="button" class="ct-chip ct-chip--interactive" aria-pressed="false">Design</button>
    <button type="button" class="ct-chip ct-chip--interactive" aria-pressed="false">Engineering</button>
    <button type="button" class="ct-chip ct-chip--interactive" aria-pressed="false">Marketing</button>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    expect(buttons).toHaveLength(4);

    // First chip is selected
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');

    // Toggle via click
    await userEvent.click(buttons[1]);
    expect(buttons[1]).toHaveFocus();

    // Toggle via keyboard (Space)
    buttons[2].focus();
    let clicked = false;
    buttons[2].addEventListener('click', () => { clicked = true; }, { once: true });
    await userEvent.keyboard(' ');
    expect(clicked).toBe(true);

    // Toggle via keyboard (Enter)
    buttons[3].focus();
    let enterClicked = false;
    buttons[3].addEventListener('click', () => { enterClicked = true; }, { once: true });
    await userEvent.keyboard('{Enter}');
    expect(enterClicked).toBe(true);
  },
};

export const Removable = {
  render: () => `
  <div class="ct-cluster" role="group" aria-label="Applied filters">
    <span class="ct-chip">
      <span class="ct-chip__icon ct-chip__icon--info" aria-hidden="true"></span>
      JavaScript
      <button class="ct-chip__remove" type="button" aria-label="Remove JavaScript">
        <span aria-hidden="true">\u00d7</span>
      </button>
    </span>
    <span class="ct-chip ct-chip--info">
      <span class="ct-chip__icon ct-chip__icon--info" aria-hidden="true"></span>
      TypeScript
      <button class="ct-chip__remove" type="button" aria-label="Remove TypeScript">
        <span aria-hidden="true">\u00d7</span>
      </button>
    </span>
    <span class="ct-chip ct-chip--success">
      <span class="ct-chip__icon ct-chip__icon--success" aria-hidden="true"></span>
      Rust
      <button class="ct-chip__remove" type="button" aria-label="Remove Rust">
        <span aria-hidden="true">\u00d7</span>
      </button>
    </span>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const removeButtons = canvas.getAllByRole('button');
    expect(removeButtons).toHaveLength(3);

    // Each remove button has an accessible label
    expect(removeButtons[0]).toHaveAttribute('aria-label', 'Remove JavaScript');
    expect(removeButtons[1]).toHaveAttribute('aria-label', 'Remove TypeScript');
    expect(removeButtons[2]).toHaveAttribute('aria-label', 'Remove Rust');

    // Remove buttons are focusable
    removeButtons[0].focus();
    expect(removeButtons[0]).toHaveFocus();

    // Tab navigates to next remove button
    await userEvent.tab();
    expect(removeButtons[1]).toHaveFocus();
  },
};

export const SizesWithRemove = {
  render: () => `
  <div class="ct-cluster" style="align-items: center;">
    <span class="ct-chip ct-chip--sm">
      Small
      <button class="ct-chip__remove" type="button" aria-label="Remove Small">
        <span aria-hidden="true">\u00d7</span>
      </button>
    </span>
    <span class="ct-chip">
      Medium
      <button class="ct-chip__remove" type="button" aria-label="Remove Medium">
        <span aria-hidden="true">\u00d7</span>
      </button>
    </span>
    <span class="ct-chip ct-chip--lg">
      Large
      <button class="ct-chip__remove" type="button" aria-label="Remove Large">
        <span aria-hidden="true">\u00d7</span>
      </button>
    </span>
  </div>
`,
  play: async ({ canvasElement }) => {
    const chips = canvasElement.querySelectorAll('.ct-chip');
    expect(chips).toHaveLength(3);

    // Remove buttons scale with chip size
    const removeButtons = canvasElement.querySelectorAll('.ct-chip__remove');
    expect(removeButtons).toHaveLength(3);

    const smRemove = window.getComputedStyle(removeButtons[0]);
    const lgRemove = window.getComputedStyle(removeButtons[2]);
    expect(parseFloat(smRemove.width)).toBeLessThan(parseFloat(lgRemove.width));
  },
};

export const KeyboardNavigation = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div>
      <h4 style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-muted);">Interactive chips — Tab, Space/Enter to toggle</h4>
      <div class="ct-cluster" role="group" aria-label="Topics">
        <button type="button" class="ct-chip ct-chip--interactive" aria-pressed="false">Accessibility</button>
        <button type="button" class="ct-chip ct-chip--interactive" aria-pressed="true">Design Systems</button>
        <button type="button" class="ct-chip ct-chip--interactive" aria-pressed="false">CSS</button>
      </div>
    </div>
    <div>
      <h4 style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-muted);">Removable chips — Tab to focus remove button</h4>
      <div class="ct-cluster" role="group" aria-label="Tags">
        <span class="ct-chip">
          Tag A
          <button class="ct-chip__remove" type="button" aria-label="Remove Tag A">
            <span aria-hidden="true">\u00d7</span>
          </button>
        </span>
        <span class="ct-chip">
          Tag B
          <button class="ct-chip__remove" type="button" aria-label="Remove Tag B">
            <span aria-hidden="true">\u00d7</span>
          </button>
        </span>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Focus first interactive chip
    const toggleChips = canvas.getAllByRole('button', { name: /Accessibility|Design Systems|CSS/ });
    toggleChips[0].focus();
    expect(toggleChips[0]).toHaveFocus();

    // Tab through interactive chips
    await userEvent.tab();
    expect(toggleChips[1]).toHaveFocus();

    await userEvent.tab();
    expect(toggleChips[2]).toHaveFocus();

    // Tab to first remove button
    await userEvent.tab();
    const removeButtons = canvas.getAllByRole('button', { name: /Remove Tag/ });
    expect(removeButtons[0]).toHaveFocus();

    // Tab to second remove button
    await userEvent.tab();
    expect(removeButtons[1]).toHaveFocus();
  },
};

export const EdgeCases = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div>
      <h4 style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-muted);">Long text with __label truncation</h4>
      <div style="max-width: 300px;">
        <span class="ct-chip">
          <span class="ct-chip__label" style="--ct-chip-max-width: 200px;">This is a very long chip label that should truncate gracefully</span>
        </span>
      </div>
    </div>
    <div>
      <h4 style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-muted);">Icon only</h4>
      <div class="ct-cluster">
        <span class="ct-chip ct-chip--info" role="img" aria-label="Info">
          <span class="ct-chip__icon ct-chip__icon--info" aria-hidden="true"></span>
        </span>
        <span class="ct-chip ct-chip--success" role="img" aria-label="Success">
          <span class="ct-chip__icon ct-chip__icon--success" aria-hidden="true"></span>
        </span>
        <span class="ct-chip ct-chip--warning" role="img" aria-label="Warning">
          <span class="ct-chip__icon ct-chip__icon--warning" aria-hidden="true"></span>
        </span>
        <span class="ct-chip ct-chip--danger" role="img" aria-label="Danger">
          <span class="ct-chip__icon ct-chip__icon--danger" aria-hidden="true"></span>
        </span>
      </div>
    </div>
    <div>
      <h4 style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-muted);">Mixed sizes with icons and remove</h4>
      <div class="ct-cluster" style="align-items: center;">
        <span class="ct-chip ct-chip--sm ct-chip--success">
          <span class="ct-chip__icon ct-chip__icon--success" aria-hidden="true"></span>
          Approved
          <button class="ct-chip__remove" type="button" aria-label="Remove Approved"><span aria-hidden="true">\u00d7</span></button>
        </span>
        <span class="ct-chip ct-chip--danger">
          <span class="ct-chip__icon ct-chip__icon--danger" aria-hidden="true"></span>
          Blocked
          <button class="ct-chip__remove" type="button" aria-label="Remove Blocked"><span aria-hidden="true">\u00d7</span></button>
        </span>
        <span class="ct-chip ct-chip--lg ct-chip--warning">
          <span class="ct-chip__icon ct-chip__icon--warning" aria-hidden="true"></span>
          Needs Review
          <button class="ct-chip__remove" type="button" aria-label="Remove Needs Review"><span aria-hidden="true">\u00d7</span></button>
        </span>
      </div>
    </div>
    <div>
      <h4 style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-muted);">All sizes × outline</h4>
      <div class="ct-cluster" style="align-items: center;">
        <span class="ct-chip ct-chip--sm ct-chip--outline">Small Outline</span>
        <span class="ct-chip ct-chip--outline">Medium Outline</span>
        <span class="ct-chip ct-chip--lg ct-chip--outline">Large Outline</span>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const chips = canvasElement.querySelectorAll('.ct-chip');
    expect(chips.length).toBeGreaterThanOrEqual(10);

    // Icon-only chips have aria-label
    const iconOnlyChips = canvasElement.querySelectorAll('.ct-chip[role="img"]');
    expect(iconOnlyChips).toHaveLength(4);
    for (const chip of iconOnlyChips) {
      expect(chip).toHaveAttribute('aria-label');
    }

    // All remove buttons have aria-label
    const removeButtons = canvasElement.querySelectorAll('.ct-chip__remove');
    for (const btn of removeButtons) {
      expect(btn).toHaveAttribute('aria-label');
    }
  },
};
