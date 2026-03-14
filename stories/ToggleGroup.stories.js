import { expect, within, userEvent } from 'storybook/test';

// ── SVG Icons (Lucide, stroke-based) ──

const listSvg = `<svg class="ct-toggle-group__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`;
const gridSvg = `<svg class="ct-toggle-group__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`;
const kanbanSvg = `<svg class="ct-toggle-group__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="10" rx="1"/></svg>`;

const boldSvg = `<svg class="ct-toggle-group__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>`;
const italicSvg = `<svg class="ct-toggle-group__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`;
const underlineSvg = `<svg class="ct-toggle-group__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>`;
const strikethroughSvg = `<svg class="ct-toggle-group__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>`;

const alignLeftSvg = `<svg class="ct-toggle-group__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>`;
const alignCenterSvg = `<svg class="ct-toggle-group__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>`;
const alignRightSvg = `<svg class="ct-toggle-group__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>`;

// ── Keyboard helper: roving tabindex with arrow navigation ──

/**
 * Initializes roving tabindex keyboard navigation for a toggle group.
 * Supports horizontal (ArrowLeft/Right) and vertical (ArrowUp/Down) orientation.
 * Home/End jump to first/last item. Disabled items are skipped.
 * Focus wraps around at boundaries.
 *
 * @param {HTMLElement} container - The toggle group container element
 */
function initToggleGroupKeyboard(container) {
  const isVertical = container.classList.contains('ct-toggle-group--vertical')
    || container.getAttribute('aria-orientation') === 'vertical';

  function getItems() {
    return [...container.querySelectorAll(
      '.ct-toggle-group__item:not(:disabled):not([aria-disabled="true"])'
    )];
  }

  // Set initial tabindex: first item (or first active) gets 0, rest get -1
  const items = getItems();
  const activeItem = items.find(
    (el) => el.getAttribute('aria-pressed') === 'true' || el.getAttribute('aria-checked') === 'true'
  );
  items.forEach((item) => { item.tabIndex = -1; });
  if (activeItem) {
    activeItem.tabIndex = 0;
  } else if (items.length > 0) {
    items[0].tabIndex = 0;
  }

  container.addEventListener('keydown', (e) => {
    const currentItems = getItems();
    const current = document.activeElement;
    const idx = currentItems.indexOf(current);
    if (idx === -1) return;

    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
    let newIndex;

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        newIndex = (idx + 1) % currentItems.length;
        break;
      case prevKey:
        e.preventDefault();
        newIndex = (idx - 1 + currentItems.length) % currentItems.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = currentItems.length - 1;
        break;
      default:
        return;
    }

    currentItems.forEach((item) => { item.tabIndex = -1; });
    currentItems[newIndex].tabIndex = 0;
    currentItems[newIndex].focus();
  });
}

/**
 * Initializes toggle behavior for single-select (radio) and multi-select groups.
 *
 * @param {HTMLElement} container - The toggle group container element
 */
function initToggleGroupSelect(container) {
  const isSingleSelect = container.getAttribute('role') === 'radiogroup';

  container.addEventListener('click', (e) => {
    const item = e.target.closest('.ct-toggle-group__item');
    if (!item || item.disabled || item.getAttribute('aria-disabled') === 'true') return;

    if (isSingleSelect) {
      const items = [...container.querySelectorAll('.ct-toggle-group__item')];
      items.forEach((el) => {
        el.setAttribute('aria-checked', 'false');
        el.tabIndex = -1;
      });
      item.setAttribute('aria-checked', 'true');
      item.tabIndex = 0;
    } else {
      const pressed = item.getAttribute('aria-pressed') === 'true';
      item.setAttribute('aria-pressed', String(!pressed));
    }
  });
}

// ── Story config ──

export default {
  title: 'Forms/Toggle Group',
  parameters: {
    docs: {
      description: {
        component:
          'Accessible toggle group with roving tabindex keyboard navigation. ' +
          'Supports single-select (`role="radiogroup"` + `aria-checked`) and multi-select (`role="group"` + `aria-pressed`). ' +
          'Variants: outlined, separated, vertical, full-width. Supports icon-only and icon+text items.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Toggle group size',
    },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'separated'],
      description: 'Visual variant',
    },
    label: { control: 'text', description: 'Accessible group label' },
  },
};

// ── Playground ──

export const Playground = {
  args: {
    size: 'md',
    variant: 'default',
    label: 'View mode',
  },
  render: ({ size, variant, label }) => {
    const classes = ['ct-toggle-group'];
    if (size !== 'md') classes.push(`ct-toggle-group--${size}`);
    if (variant !== 'default') classes.push(`ct-toggle-group--${variant}`);

    return `
    <div class="${classes.join(' ')}" role="group" aria-label="${label}">
      <button class="ct-toggle-group__item" type="button" aria-pressed="true" tabindex="0">${listSvg} List</button>
      <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1">${gridSvg} Grid</button>
      <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1">${kanbanSvg} Board</button>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="group"]');
    initToggleGroupKeyboard(group);
    initToggleGroupSelect(group);

    expect(group).toBeInTheDocument();
    const buttons = [...group.querySelectorAll('.ct-toggle-group__item')];
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
  },
};

// ── Single Select (radiogroup) ──

export const SingleSelect = {
  render: () => `
  <div>
    <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">View mode (single select)</p>
    <div class="ct-toggle-group" role="radiogroup" aria-label="View mode">
      <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">List</button>
      <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Grid</button>
      <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Board</button>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="radiogroup"]');
    initToggleGroupKeyboard(group);
    initToggleGroupSelect(group);

    const items = [...group.querySelectorAll('[role="radio"]')];
    expect(items).toHaveLength(3);

    // Initial state: first item checked
    expect(items[0]).toHaveAttribute('aria-checked', 'true');
    expect(items[1]).toHaveAttribute('aria-checked', 'false');
    expect(items[2]).toHaveAttribute('aria-checked', 'false');

    // Roving tabindex: only active item is tabbable
    expect(items[0].tabIndex).toBe(0);
    expect(items[1].tabIndex).toBe(-1);
    expect(items[2].tabIndex).toBe(-1);

    // Click selects and deselects others
    await userEvent.click(items[2]);
    expect(items[2]).toHaveAttribute('aria-checked', 'true');
    expect(items[0]).toHaveAttribute('aria-checked', 'false');
    expect(items[1]).toHaveAttribute('aria-checked', 'false');

    // Tabindex follows selection
    expect(items[2].tabIndex).toBe(0);
    expect(items[0].tabIndex).toBe(-1);
  },
};

// ── Multi Select ──

export const MultiSelect = {
  render: () => `
  <div>
    <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Filter by status (multi select)</p>
    <div class="ct-toggle-group" role="group" aria-label="Status filter">
      <button class="ct-toggle-group__item" type="button" aria-pressed="true" tabindex="0">Open</button>
      <button class="ct-toggle-group__item" type="button" aria-pressed="true" tabindex="-1">Pending</button>
      <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1">Resolved</button>
      <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1">Rejected</button>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="group"]');
    initToggleGroupKeyboard(group);
    initToggleGroupSelect(group);

    const buttons = [...group.querySelectorAll('.ct-toggle-group__item')];
    expect(buttons).toHaveLength(4);

    // Multiple items can be pressed simultaneously
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'false');

    // Click toggles individual items without affecting others
    await userEvent.click(buttons[2]);
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');

    // Click again untoggles
    await userEvent.click(buttons[2]);
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'false');
  },
};

// ── Keyboard Navigation ──

export const KeyboardNavigation = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates roving tabindex: only one item per group is a tab stop. Arrow keys move focus, Home/End jump to boundaries, disabled items are skipped, focus wraps.',
      },
    },
  },
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Horizontal – Arrow Left/Right, Home, End</p>
      <div class="ct-toggle-group" role="group" aria-label="Keyboard horizontal" data-testid="horizontal-group">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true" tabindex="0">Alpha</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1">Beta</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1" disabled>Gamma (disabled)</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1">Delta</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Vertical – Arrow Up/Down</p>
      <div class="ct-toggle-group ct-toggle-group--vertical" role="group" aria-label="Keyboard vertical" data-testid="vertical-group">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true" tabindex="0">Top</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1">Middle</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1">Bottom</button>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    // ── Horizontal group tests ──
    const hGroup = canvasElement.querySelector('[data-testid="horizontal-group"]');
    initToggleGroupKeyboard(hGroup);

    const hItems = [...hGroup.querySelectorAll('.ct-toggle-group__item:not(:disabled)')];
    expect(hItems).toHaveLength(3); // Gamma is disabled, excluded

    // Focus first item
    hItems[0].focus();
    expect(hItems[0]).toHaveFocus();

    // ArrowRight → Beta (skips disabled Gamma)
    await userEvent.keyboard('{ArrowRight}');
    expect(hItems[1]).toHaveFocus();

    // ArrowRight → Delta (Gamma skipped because disabled items are not in getItems())
    await userEvent.keyboard('{ArrowRight}');
    expect(hItems[2]).toHaveFocus();

    // ArrowRight wraps → Alpha
    await userEvent.keyboard('{ArrowRight}');
    expect(hItems[0]).toHaveFocus();

    // ArrowLeft wraps → Delta
    await userEvent.keyboard('{ArrowLeft}');
    expect(hItems[2]).toHaveFocus();

    // Home → first
    await userEvent.keyboard('{Home}');
    expect(hItems[0]).toHaveFocus();

    // End → last
    await userEvent.keyboard('{End}');
    expect(hItems[2]).toHaveFocus();

    // Tabindex management: only focused item has tabindex=0
    expect(hItems[2].tabIndex).toBe(0);
    expect(hItems[0].tabIndex).toBe(-1);
    expect(hItems[1].tabIndex).toBe(-1);

    // ── Vertical group tests ──
    const vGroup = canvasElement.querySelector('[data-testid="vertical-group"]');
    initToggleGroupKeyboard(vGroup);

    const vItems = [...vGroup.querySelectorAll('.ct-toggle-group__item')];

    vItems[0].focus();
    expect(vItems[0]).toHaveFocus();

    // ArrowDown → Middle
    await userEvent.keyboard('{ArrowDown}');
    expect(vItems[1]).toHaveFocus();

    // ArrowDown → Bottom
    await userEvent.keyboard('{ArrowDown}');
    expect(vItems[2]).toHaveFocus();

    // ArrowDown wraps → Top
    await userEvent.keyboard('{ArrowDown}');
    expect(vItems[0]).toHaveFocus();

    // ArrowUp wraps → Bottom
    await userEvent.keyboard('{ArrowUp}');
    expect(vItems[2]).toHaveFocus();
  },
};

// ── Icon Only ──

export const IconOnly = {
  parameters: {
    docs: {
      description: {
        story: 'Icon-only items use `ct-toggle-group__item--icon` for square sizing and require `aria-label` for accessibility.',
      },
    },
  },
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Text formatting (multi-select, icon-only)</p>
      <div class="ct-toggle-group" role="group" aria-label="Text formatting">
        <button class="ct-toggle-group__item ct-toggle-group__item--icon" type="button" aria-pressed="true" aria-label="Bold" tabindex="0">${boldSvg}</button>
        <button class="ct-toggle-group__item ct-toggle-group__item--icon" type="button" aria-pressed="false" aria-label="Italic" tabindex="-1">${italicSvg}</button>
        <button class="ct-toggle-group__item ct-toggle-group__item--icon" type="button" aria-pressed="false" aria-label="Underline" tabindex="-1">${underlineSvg}</button>
        <button class="ct-toggle-group__item ct-toggle-group__item--icon" type="button" aria-pressed="false" aria-label="Strikethrough" tabindex="-1">${strikethroughSvg}</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Text alignment (single-select, icon-only)</p>
      <div class="ct-toggle-group" role="radiogroup" aria-label="Text alignment">
        <button class="ct-toggle-group__item ct-toggle-group__item--icon" type="button" role="radio" aria-checked="true" aria-label="Align left" tabindex="0">${alignLeftSvg}</button>
        <button class="ct-toggle-group__item ct-toggle-group__item--icon" type="button" role="radio" aria-checked="false" aria-label="Align center" tabindex="-1">${alignCenterSvg}</button>
        <button class="ct-toggle-group__item ct-toggle-group__item--icon" type="button" role="radio" aria-checked="false" aria-label="Align right" tabindex="-1">${alignRightSvg}</button>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll('.ct-toggle-group');
    groups.forEach((g) => {
      initToggleGroupKeyboard(g);
      initToggleGroupSelect(g);
    });

    // Multi-select formatting group
    const formatGroup = canvasElement.querySelector('[aria-label="Text formatting"]');
    const formatItems = [...formatGroup.querySelectorAll('.ct-toggle-group__item')];

    // All icon-only items have aria-label
    for (const item of formatItems) {
      expect(item).toHaveAttribute('aria-label');
      expect(item.getAttribute('aria-label').length).toBeGreaterThan(0);
    }

    // Icon-only class applied
    for (const item of formatItems) {
      expect(item.classList.contains('ct-toggle-group__item--icon')).toBe(true);
    }

    // SVGs are aria-hidden
    const svgs = formatGroup.querySelectorAll('svg');
    for (const svg of svgs) {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    }

    // Single-select alignment group
    const alignGroup = canvasElement.querySelector('[aria-label="Text alignment"]');
    const alignItems = [...alignGroup.querySelectorAll('[role="radio"]')];
    expect(alignItems).toHaveLength(3);
    expect(alignItems[0]).toHaveAttribute('aria-checked', 'true');

    // Click selects new alignment
    await userEvent.click(alignItems[2]);
    expect(alignItems[2]).toHaveAttribute('aria-checked', 'true');
    expect(alignItems[0]).toHaveAttribute('aria-checked', 'false');
  },
};

// ── Icon + Text ──

export const IconAndText = {
  render: () => `
  <div>
    <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">View mode with icons</p>
    <div class="ct-toggle-group" role="radiogroup" aria-label="View mode">
      <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">${listSvg} List</button>
      <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${gridSvg} Grid</button>
      <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${kanbanSvg} Board</button>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="radiogroup"]');
    initToggleGroupKeyboard(group);
    initToggleGroupSelect(group);

    const items = [...group.querySelectorAll('[role="radio"]')];
    expect(items).toHaveLength(3);

    // Each item has an icon and text
    for (const item of items) {
      expect(item.querySelector('.ct-toggle-group__icon')).not.toBeNull();
      expect(item.textContent.trim().length).toBeGreaterThan(0);
    }

    // Keyboard: ArrowRight moves focus
    items[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(items[1]).toHaveFocus();
  },
};

// ── Outlined Variant ──

export const Outlined = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Outlined (less visual weight)</p>
      <div class="ct-toggle-group ct-toggle-group--outlined" role="radiogroup" aria-label="Outlined example">
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">Day</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Week</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Month</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Default (for comparison)</p>
      <div class="ct-toggle-group" role="radiogroup" aria-label="Default example">
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">Day</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Week</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Month</button>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll('.ct-toggle-group');
    groups.forEach((g) => {
      initToggleGroupKeyboard(g);
      initToggleGroupSelect(g);
    });

    const outlinedGroup = canvasElement.querySelector('.ct-toggle-group--outlined');
    expect(outlinedGroup).toBeInTheDocument();

    const active = outlinedGroup.querySelector('[aria-checked="true"]');
    expect(active).toBeInTheDocument();

    // Outlined active item should NOT use the brand-primary background
    const styles = window.getComputedStyle(active);
    expect(styles.color).not.toBe(styles.backgroundColor);
  },
};

// ── Vertical Orientation ──

export const Vertical = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5); flex-direction: row; display: flex; gap: var(--space-8);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Vertical</p>
      <div class="ct-toggle-group ct-toggle-group--vertical" role="radiogroup" aria-label="Priority" aria-orientation="vertical">
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Low</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">Medium</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">High</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Critical</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Vertical + Outlined</p>
      <div class="ct-toggle-group ct-toggle-group--vertical ct-toggle-group--outlined" role="radiogroup" aria-label="Sort order" aria-orientation="vertical">
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">Name</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Date</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Size</button>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll('.ct-toggle-group--vertical');
    groups.forEach((g) => {
      initToggleGroupKeyboard(g);
      initToggleGroupSelect(g);
    });

    const group = canvasElement.querySelector('[aria-label="Priority"]');
    expect(group).toHaveAttribute('aria-orientation', 'vertical');

    const items = [...group.querySelectorAll('[role="radio"]')];

    // Focus active item
    items[1].focus(); // Medium is active
    expect(items[1]).toHaveFocus();

    // ArrowDown → High
    await userEvent.keyboard('{ArrowDown}');
    expect(items[2]).toHaveFocus();

    // ArrowUp → Medium
    await userEvent.keyboard('{ArrowUp}');
    expect(items[1]).toHaveFocus();

    // ArrowUp → Low
    await userEvent.keyboard('{ArrowUp}');
    expect(items[0]).toHaveFocus();

    // ArrowUp wraps → Critical
    await userEvent.keyboard('{ArrowUp}');
    expect(items[3]).toHaveFocus();
  },
};

// ── Separated Variant ──

export const Separated = {
  render: () => `
  <div>
    <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Separated (chip-group style)</p>
    <div class="ct-toggle-group ct-toggle-group--separated" role="group" aria-label="Categories">
      <button class="ct-toggle-group__item" type="button" aria-pressed="true" tabindex="0">All</button>
      <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1">Design</button>
      <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1">Development</button>
      <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1">Marketing</button>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('.ct-toggle-group--separated');
    initToggleGroupKeyboard(group);
    initToggleGroupSelect(group);

    expect(group).toBeInTheDocument();
    const items = [...group.querySelectorAll('.ct-toggle-group__item')];
    expect(items).toHaveLength(4);

    // Each item has its own border-radius (separated)
    for (const item of items) {
      const style = window.getComputedStyle(item);
      expect(style.borderRadius).not.toBe('0px');
    }
  },
};

// ── Full Width ──

export const FullWidth = {
  render: () => `
  <div style="max-width: 600px;">
    <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Full width – items share equal space</p>
    <div class="ct-toggle-group ct-toggle-group--full" role="radiogroup" aria-label="Billing period">
      <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">Monthly</button>
      <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Quarterly</button>
      <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Yearly</button>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('.ct-toggle-group--full');
    initToggleGroupKeyboard(group);
    initToggleGroupSelect(group);

    // Group takes full width
    const groupStyle = window.getComputedStyle(group);
    expect(groupStyle.width).not.toBe('0px');

    // Items have roughly equal widths (flex: 1)
    const items = [...group.querySelectorAll('.ct-toggle-group__item')];
    const widths = items.map((el) => el.getBoundingClientRect().width);
    const avgWidth = widths.reduce((a, b) => a + b, 0) / widths.length;
    for (const w of widths) {
      expect(Math.abs(w - avgWidth)).toBeLessThan(2);
    }
  },
};

// ── Sizes ──

export const Sizes = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Small</p>
      <div class="ct-toggle-group ct-toggle-group--sm" role="radiogroup" aria-label="Size small">
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">Day</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Week</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Month</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Default</p>
      <div class="ct-toggle-group" role="radiogroup" aria-label="Size default">
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">Day</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Week</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Month</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Large</p>
      <div class="ct-toggle-group ct-toggle-group--lg" role="radiogroup" aria-label="Size large">
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">Day</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Week</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">Month</button>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const groups = canvas.getAllByRole('radiogroup');
    expect(groups).toHaveLength(3);

    groups.forEach((g) => {
      initToggleGroupKeyboard(g);
      initToggleGroupSelect(g);
    });

    const expectedLabels = ['Size small', 'Size default', 'Size large'];
    for (let i = 0; i < groups.length; i++) {
      expect(groups[i]).toHaveAttribute('aria-label', expectedLabels[i]);

      const items = within(groups[i]).getAllByRole('radio');
      expect(items).toHaveLength(3);

      // Exactly one checked item
      const checked = items.filter((b) => b.getAttribute('aria-checked') === 'true');
      expect(checked).toHaveLength(1);

      // All have type="button"
      for (const btn of items) {
        expect(btn).toHaveAttribute('type', 'button');
      }
    }

    // Font size grows across size variants
    const fontSizes = groups.map((g) => {
      const item = g.querySelector('.ct-toggle-group__item');
      return parseFloat(window.getComputedStyle(item).fontSize);
    });
    expect(fontSizes[0]).toBeLessThan(fontSizes[1]);
    expect(fontSizes[1]).toBeLessThan(fontSizes[2]);
  },
};

// ── Disabled ──

export const Disabled = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-5);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Mixed disabled items (disabled items skipped in keyboard nav)</p>
      <div class="ct-toggle-group" role="group" aria-label="Disabled example">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true" tabindex="0">Active</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false" disabled tabindex="-1">Disabled</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false" tabindex="-1">Available</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Fully disabled group</p>
      <div class="ct-toggle-group" role="group" aria-label="All disabled" aria-disabled="true">
        <button class="ct-toggle-group__item" type="button" aria-pressed="true" disabled>Selected</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false" disabled>Option B</button>
        <button class="ct-toggle-group__item" type="button" aria-pressed="false" disabled>Option C</button>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[aria-label="Disabled example"]');
    initToggleGroupKeyboard(group);

    const allButtons = [...group.querySelectorAll('.ct-toggle-group__item')];
    const enabledButtons = allButtons.filter((b) => !b.disabled);

    expect(allButtons).toHaveLength(3);
    expect(enabledButtons).toHaveLength(2);

    // Disabled button
    expect(allButtons[1]).toBeDisabled();
    expect(allButtons[1]).toHaveAttribute('aria-pressed', 'false');

    // Keyboard navigation skips disabled: ArrowRight from Active → Available (skips Disabled)
    enabledButtons[0].focus();
    expect(enabledButtons[0]).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(enabledButtons[1]).toHaveFocus(); // Available, not Disabled

    // Fully disabled group
    const disabledGroup = canvasElement.querySelector('[aria-label="All disabled"]');
    expect(disabledGroup).toHaveAttribute('aria-disabled', 'true');
    const disabledButtons = [...disabledGroup.querySelectorAll('.ct-toggle-group__item')];
    for (const btn of disabledButtons) {
      expect(btn).toBeDisabled();
    }
  },
};

// ── All Variants Overview ──

export const AllVariants = {
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of all visual variants.',
      },
    },
  },
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-6);">
    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Default</p>
      <div class="ct-toggle-group" role="radiogroup" aria-label="Default variant">
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">${listSvg} List</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${gridSvg} Grid</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${kanbanSvg} Board</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Outlined</p>
      <div class="ct-toggle-group ct-toggle-group--outlined" role="radiogroup" aria-label="Outlined variant">
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">${listSvg} List</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${gridSvg} Grid</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${kanbanSvg} Board</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Separated</p>
      <div class="ct-toggle-group ct-toggle-group--separated" role="radiogroup" aria-label="Separated variant">
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">${listSvg} List</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${gridSvg} Grid</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${kanbanSvg} Board</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Full Width</p>
      <div class="ct-toggle-group ct-toggle-group--full" role="radiogroup" aria-label="Full width variant">
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">${listSvg} List</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${gridSvg} Grid</button>
        <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${kanbanSvg} Board</button>
      </div>
    </div>

    <div>
      <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Icon Only</p>
      <div class="ct-toggle-group" role="radiogroup" aria-label="Icon only variant">
        <button class="ct-toggle-group__item ct-toggle-group__item--icon" type="button" role="radio" aria-checked="true" aria-label="List view" tabindex="0">${listSvg}</button>
        <button class="ct-toggle-group__item ct-toggle-group__item--icon" type="button" role="radio" aria-checked="false" aria-label="Grid view" tabindex="-1">${gridSvg}</button>
        <button class="ct-toggle-group__item ct-toggle-group__item--icon" type="button" role="radio" aria-checked="false" aria-label="Board view" tabindex="-1">${kanbanSvg}</button>
      </div>
    </div>

    <div style="display: flex; gap: var(--space-8);">
      <div>
        <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Vertical</p>
        <div class="ct-toggle-group ct-toggle-group--vertical" role="radiogroup" aria-label="Vertical variant" aria-orientation="vertical">
          <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">${listSvg} List</button>
          <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${gridSvg} Grid</button>
          <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${kanbanSvg} Board</button>
        </div>
      </div>

      <div>
        <p style="margin: 0 0 var(--space-3); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">Vertical + Outlined</p>
        <div class="ct-toggle-group ct-toggle-group--vertical ct-toggle-group--outlined" role="radiogroup" aria-label="Vertical outlined variant" aria-orientation="vertical">
          <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="true" tabindex="0">${listSvg} List</button>
          <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${gridSvg} Grid</button>
          <button class="ct-toggle-group__item" type="button" role="radio" aria-checked="false" tabindex="-1">${kanbanSvg} Board</button>
        </div>
      </div>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll('.ct-toggle-group');
    groups.forEach((g) => {
      initToggleGroupKeyboard(g);
      initToggleGroupSelect(g);
    });

    // Every group has exactly one checked/pressed item
    for (const group of groups) {
      const items = [...group.querySelectorAll('.ct-toggle-group__item')];
      const active = items.filter(
        (el) => el.getAttribute('aria-checked') === 'true' || el.getAttribute('aria-pressed') === 'true'
      );
      expect(active).toHaveLength(1);
    }

    // All groups have an accessible label
    for (const group of groups) {
      expect(group.getAttribute('aria-label')?.length).toBeGreaterThan(0);
    }
  },
};
