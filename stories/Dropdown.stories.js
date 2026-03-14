import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Navigation/Dropdown',
  parameters: {
    docs: {
      description: {
        component:
          'Dropdown menu component for action menus, context menus, and option selections. ' +
          'Uses `role="menu"` with `role="menuitem"`, `role="menuitemcheckbox"`, and `role="menuitemradio"`. ' +
          'Supports size variants (sm, md, lg), icon + label + shortcut layout, danger items, ' +
          'checkbox/radio items, groups, sub-menus, and virtual focus via `data-highlighted`. ' +
          'Full keyboard navigation: Arrow Up/Down, Home/End, Typeahead, Escape, ArrowRight for sub-menus.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Menu size variant',
    },
    open: {
      control: 'boolean',
      description: 'Whether the menu is open',
    },
    align: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Horizontal alignment',
    },
    side: {
      control: 'select',
      options: ['bottom', 'top'],
      description: 'Vertical side',
    },
  },
};

/* ── Shared SVGs ──────────────────────────────────────────────────── */

const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

const CHEVRON_RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

const DOTS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`;

const EDIT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>`;

const COPY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

const SHARE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>`;

const ARCHIVE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>`;

const TRASH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;

const DOWNLOAD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`;

const STAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

const LINK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

const MAIL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;

/* ── Helpers ──────────────────────────────────────────────────────── */

const sizeClass = (size) => {
  if (size === 'sm') return ' ct-dropdown--sm';
  if (size === 'lg') return ' ct-dropdown--lg';
  return '';
};

const triggerButton = (id, expanded = true) => `
  <button class="ct-button ct-button--secondary ct-button--icon"
          aria-haspopup="menu"
          aria-expanded="${expanded}"
          aria-controls="${id}">
    <span aria-hidden="true">${DOTS_SVG}</span>
    <span class="ct-sr-only">Actions</span>
  </button>`;

/**
 * Initializes WAI-ARIA-compliant keyboard navigation on a dropdown menu.
 * Supports ArrowUp/Down, Home/End, Escape, Enter/Space, and typeahead.
 */
function initDropdownKeyboard(dropdownEl) {
  const menu = dropdownEl.querySelector('[role="menu"]');
  if (!menu) return;

  menu.addEventListener('keydown', (e) => {
    const items = [...menu.querySelectorAll(
      '[role="menuitem"]:not([aria-disabled="true"]), ' +
      '[role="menuitemcheckbox"]:not([aria-disabled="true"]), ' +
      '[role="menuitemradio"]:not([aria-disabled="true"])'
    )];
    const index = items.indexOf(e.target);
    if (index === -1) return;

    let newIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = (index + 1) % items.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = (index - 1 + items.length) % items.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Escape':
        e.preventDefault();
        dropdownEl.setAttribute('data-state', 'closed');
        dropdownEl.querySelector('[aria-haspopup]')?.focus();
        return;
      default:
        // Typeahead: jump to item starting with typed character
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          const char = e.key.toLowerCase();
          const match = items.find((item, i) => {
            if (i <= index) return false;
            const label = item.querySelector('.ct-dropdown__item-label')?.textContent || item.textContent;
            return label.trim().toLowerCase().startsWith(char);
          }) || items.find((item) => {
            const label = item.querySelector('.ct-dropdown__item-label')?.textContent || item.textContent;
            return label.trim().toLowerCase().startsWith(char);
          });
          if (match) match.focus();
        }
        return;
    }

    items[newIndex].focus();
  });
}

/* ── Stories ──────────────────────────────────────────────────────── */

/**
 * Interactive playground with all controls.
 */
export const Playground = {
  args: {
    size: 'md',
    open: true,
    align: 'start',
    side: 'bottom',
  },
  parameters: {
    docs: { story: { inline: true, height: 380 } },
  },
  render: ({ size, open, align, side }) => `
    <div style="min-height: 340px; padding: 24px;">
      <div class="ct-dropdown${sizeClass(size)}"
           data-state="${open ? 'open' : 'closed'}"
           ${align === 'end' ? 'data-align="end"' : ''}
           ${side === 'top' ? 'data-side="top"' : ''}>
        ${triggerButton('pg-menu', open)}
        <div class="ct-dropdown__menu" role="menu" id="pg-menu" aria-label="Actions">
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${EDIT_SVG}</span>
            <span class="ct-dropdown__item-label">Edit</span>
            <kbd class="ct-dropdown__item-shortcut">Ctrl+E</kbd>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${COPY_SVG}</span>
            <span class="ct-dropdown__item-label">Duplicate</span>
            <kbd class="ct-dropdown__item-shortcut">Ctrl+D</kbd>
          </button>
          <div class="ct-dropdown__separator" role="none"></div>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${SHARE_SVG}</span>
            <span class="ct-dropdown__item-label">Share</span>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${ARCHIVE_SVG}</span>
            <span class="ct-dropdown__item-label">Archive</span>
          </button>
          <div class="ct-dropdown__separator" role="none"></div>
          <button class="ct-dropdown__item ct-dropdown__item--danger" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${TRASH_SVG}</span>
            <span class="ct-dropdown__item-label">Delete</span>
            <kbd class="ct-dropdown__item-shortcut">Del</kbd>
          </button>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Trigger has correct ARIA
    const trigger = canvasElement.querySelector('[aria-haspopup="menu"]');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', 'pg-menu');

    // Menu has role and label
    const menu = canvasElement.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
    expect(menu).toHaveAttribute('aria-label', 'Actions');

    // All items have role="menuitem"
    const items = canvasElement.querySelectorAll('[role="menuitem"]');
    expect(items.length).toBe(5);

    // Danger item exists
    const dangerItem = canvasElement.querySelector('.ct-dropdown__item--danger');
    expect(dangerItem).not.toBeNull();
    expect(dangerItem).toHaveTextContent('Delete');

    // Separator exists
    const seps = canvasElement.querySelectorAll('.ct-dropdown__separator');
    expect(seps.length).toBe(2);
    for (const sep of seps) {
      expect(sep).toHaveAttribute('role', 'none');
    }
  },
};

/**
 * Standard dropdown with icon + label + shortcut layout. The three-zone
 * item layout is the core building block for SOTA dropdown menus.
 */
export const IconLabelShortcut = {
  parameters: {
    docs: { story: { inline: true, height: 360 } },
  },
  render: () => `
    <div style="min-height: 320px; padding: 24px;">
      <div class="ct-dropdown" data-state="open">
        ${triggerButton('ils-menu')}
        <div class="ct-dropdown__menu" role="menu" id="ils-menu" aria-label="File actions">
          <button class="ct-dropdown__item" role="menuitem" tabindex="0">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${EDIT_SVG}</span>
            <span class="ct-dropdown__item-label">Edit</span>
            <kbd class="ct-dropdown__item-shortcut">Ctrl+E</kbd>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${COPY_SVG}</span>
            <span class="ct-dropdown__item-label">Duplicate</span>
            <kbd class="ct-dropdown__item-shortcut">Ctrl+D</kbd>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${DOWNLOAD_SVG}</span>
            <span class="ct-dropdown__item-label">Download</span>
            <kbd class="ct-dropdown__item-shortcut">Ctrl+S</kbd>
          </button>
          <div class="ct-dropdown__separator" role="none"></div>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${STAR_SVG}</span>
            <span class="ct-dropdown__item-label">Add to favorites</span>
          </button>
          <div class="ct-dropdown__separator" role="none"></div>
          <button class="ct-dropdown__item ct-dropdown__item--danger" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${TRASH_SVG}</span>
            <span class="ct-dropdown__item-label">Delete</span>
            <kbd class="ct-dropdown__item-shortcut">Del</kbd>
          </button>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    // Three-zone layout: icon, label, shortcut
    const firstItem = canvasElement.querySelector('[role="menuitem"]');
    const icon = firstItem.querySelector('.ct-dropdown__item-icon');
    const label = firstItem.querySelector('.ct-dropdown__item-label');
    const shortcut = firstItem.querySelector('.ct-dropdown__item-shortcut');

    expect(icon).not.toBeNull();
    expect(label).not.toBeNull();
    expect(shortcut).not.toBeNull();

    // Icon is hidden from AT
    expect(icon).toHaveAttribute('aria-hidden', 'true');

    // Item uses flexbox with proper alignment
    const itemStyle = window.getComputedStyle(firstItem);
    expect(itemStyle.display).toBe('flex');
    expect(itemStyle.alignItems).toBe('center');

    // Shortcut is positioned after the label (flex layout)
    const labelRect = label.getBoundingClientRect();
    const shortcutRect = shortcut.getBoundingClientRect();
    expect(shortcutRect.left).toBeGreaterThan(labelRect.right);
  },
};

/**
 * Danger/destructive items for dangerous actions (delete, remove, etc.).
 */
export const DangerItems = {
  parameters: {
    docs: { story: { inline: true, height: 320 } },
  },
  render: () => `
    <div style="min-height: 280px; padding: 24px;">
      <div class="ct-dropdown" data-state="open">
        ${triggerButton('danger-menu')}
        <div class="ct-dropdown__menu" role="menu" id="danger-menu" aria-label="Item actions">
          <button class="ct-dropdown__item" role="menuitem" tabindex="0">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${EDIT_SVG}</span>
            <span class="ct-dropdown__item-label">Rename</span>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${ARCHIVE_SVG}</span>
            <span class="ct-dropdown__item-label">Archive</span>
          </button>
          <div class="ct-dropdown__separator" role="none"></div>
          <button class="ct-dropdown__item ct-dropdown__item--danger" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${TRASH_SVG}</span>
            <span class="ct-dropdown__item-label">Delete permanently</span>
          </button>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const dangerItem = canvasElement.querySelector('.ct-dropdown__item--danger');
    expect(dangerItem).not.toBeNull();

    // Danger item has red color (from token)
    const style = window.getComputedStyle(dangerItem);
    const normalItem = canvasElement.querySelector('.ct-dropdown__item:not(.ct-dropdown__item--danger)');
    const normalStyle = window.getComputedStyle(normalItem);
    expect(style.color).not.toBe(normalStyle.color);

    // Danger item icon inherits danger color
    const dangerIcon = dangerItem.querySelector('.ct-dropdown__item-icon');
    const dangerIconStyle = window.getComputedStyle(dangerIcon);
    expect(dangerIconStyle.color).toBe(style.color);
  },
};

/**
 * Checkbox items with `role="menuitemcheckbox"` for toggle settings.
 */
export const CheckboxItems = {
  parameters: {
    docs: { story: { inline: true, height: 320 } },
  },
  render: () => `
    <div style="min-height: 280px; padding: 24px;">
      <div class="ct-dropdown" data-state="open">
        ${triggerButton('check-menu')}
        <div class="ct-dropdown__menu" role="menu" id="check-menu" aria-label="View settings">
          <div class="ct-dropdown__label" id="check-view-label">View</div>
          <button class="ct-dropdown__item" role="menuitemcheckbox" aria-checked="true" tabindex="0">
            <span class="ct-dropdown__item-check" aria-hidden="true">${CHECK_SVG}</span>
            <span class="ct-dropdown__item-label">Show sidebar</span>
          </button>
          <button class="ct-dropdown__item" role="menuitemcheckbox" aria-checked="false" tabindex="-1">
            <span class="ct-dropdown__item-check" aria-hidden="true">${CHECK_SVG}</span>
            <span class="ct-dropdown__item-label">Show line numbers</span>
          </button>
          <button class="ct-dropdown__item" role="menuitemcheckbox" aria-checked="true" tabindex="-1">
            <span class="ct-dropdown__item-check" aria-hidden="true">${CHECK_SVG}</span>
            <span class="ct-dropdown__item-label">Word wrap</span>
          </button>
          <button class="ct-dropdown__item" role="menuitemcheckbox" aria-checked="false" tabindex="-1">
            <span class="ct-dropdown__item-check" aria-hidden="true">${CHECK_SVG}</span>
            <span class="ct-dropdown__item-label">Minimap</span>
          </button>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const checkItems = canvasElement.querySelectorAll('[role="menuitemcheckbox"]');
    expect(checkItems).toHaveLength(4);

    // Checked items have aria-checked="true"
    expect(checkItems[0]).toHaveAttribute('aria-checked', 'true');
    expect(checkItems[1]).toHaveAttribute('aria-checked', 'false');
    expect(checkItems[2]).toHaveAttribute('aria-checked', 'true');
    expect(checkItems[3]).toHaveAttribute('aria-checked', 'false');

    // Checked item's checkmark is visible
    const checkedMark = checkItems[0].querySelector('.ct-dropdown__item-check');
    expect(window.getComputedStyle(checkedMark).opacity).toBe('1');

    // Unchecked item's checkmark is hidden
    const uncheckedMark = checkItems[1].querySelector('.ct-dropdown__item-check');
    expect(window.getComputedStyle(uncheckedMark).opacity).toBe('0');

    // Label exists as non-interactive header
    const label = canvasElement.querySelector('.ct-dropdown__label');
    expect(label).toHaveTextContent('View');
  },
};

/**
 * Radio items with `role="menuitemradio"` for exclusive selection.
 */
export const RadioItems = {
  parameters: {
    docs: { story: { inline: true, height: 320 } },
  },
  render: () => `
    <div style="min-height: 280px; padding: 24px;">
      <div class="ct-dropdown" data-state="open">
        ${triggerButton('radio-menu')}
        <div class="ct-dropdown__menu" role="menu" id="radio-menu" aria-label="Sort order">
          <div class="ct-dropdown__label">Sort by</div>
          <div role="group" aria-label="Sort direction">
            <button class="ct-dropdown__item" role="menuitemradio" aria-checked="true" tabindex="0">
              <span class="ct-dropdown__item-radio" aria-hidden="true"></span>
              <span class="ct-dropdown__item-label">Name</span>
            </button>
            <button class="ct-dropdown__item" role="menuitemradio" aria-checked="false" tabindex="-1">
              <span class="ct-dropdown__item-radio" aria-hidden="true"></span>
              <span class="ct-dropdown__item-label">Date modified</span>
            </button>
            <button class="ct-dropdown__item" role="menuitemradio" aria-checked="false" tabindex="-1">
              <span class="ct-dropdown__item-radio" aria-hidden="true"></span>
              <span class="ct-dropdown__item-label">Size</span>
            </button>
            <button class="ct-dropdown__item" role="menuitemradio" aria-checked="false" tabindex="-1">
              <span class="ct-dropdown__item-radio" aria-hidden="true"></span>
              <span class="ct-dropdown__item-label">Type</span>
            </button>
          </div>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const radioItems = canvasElement.querySelectorAll('[role="menuitemradio"]');
    expect(radioItems).toHaveLength(4);

    // Only one is checked
    const checked = canvasElement.querySelectorAll('[role="menuitemradio"][aria-checked="true"]');
    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveTextContent('Name');

    // Radio indicator dot is visible for checked item
    const radioDot = checked[0].querySelector('.ct-dropdown__item-radio');
    const dotStyle = window.getComputedStyle(radioDot, '::before');
    expect(dotStyle.borderRadius).not.toBe('0px');

    // Group wraps radio items
    const group = canvasElement.querySelector('[role="group"]');
    expect(group).toHaveAttribute('aria-label', 'Sort direction');
  },
};

/**
 * Groups with labeled sections for organized menu content.
 */
export const WithGroups = {
  parameters: {
    docs: { story: { inline: true, height: 440 } },
  },
  render: () => `
    <div style="min-height: 400px; padding: 24px;">
      <div class="ct-dropdown" data-state="open">
        ${triggerButton('group-menu')}
        <div class="ct-dropdown__menu" role="menu" id="group-menu" aria-label="Project actions">
          <div class="ct-dropdown__group" role="group" aria-labelledby="group-edit-label">
            <div class="ct-dropdown__group-label" id="group-edit-label">Edit</div>
            <button class="ct-dropdown__item" role="menuitem" tabindex="0">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${EDIT_SVG}</span>
              <span class="ct-dropdown__item-label">Rename</span>
            </button>
            <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${COPY_SVG}</span>
              <span class="ct-dropdown__item-label">Duplicate</span>
            </button>
          </div>
          <div class="ct-dropdown__group" role="group" aria-labelledby="group-share-label">
            <div class="ct-dropdown__group-label" id="group-share-label">Share</div>
            <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${LINK_SVG}</span>
              <span class="ct-dropdown__item-label">Copy link</span>
            </button>
            <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${MAIL_SVG}</span>
              <span class="ct-dropdown__item-label">Email</span>
            </button>
            <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${SHARE_SVG}</span>
              <span class="ct-dropdown__item-label">Export</span>
            </button>
          </div>
          <div class="ct-dropdown__group" role="group" aria-labelledby="group-danger-label">
            <div class="ct-dropdown__group-label" id="group-danger-label">Danger zone</div>
            <button class="ct-dropdown__item ct-dropdown__item--danger" role="menuitem" tabindex="-1">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${TRASH_SVG}</span>
              <span class="ct-dropdown__item-label">Delete project</span>
            </button>
          </div>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll('.ct-dropdown__group');
    expect(groups).toHaveLength(3);

    // Groups have role and label
    for (const group of groups) {
      expect(group).toHaveAttribute('role', 'group');
      expect(group).toHaveAttribute('aria-labelledby');
    }

    // Group labels are visible
    const labels = canvasElement.querySelectorAll('.ct-dropdown__group-label');
    expect(labels).toHaveLength(3);
    expect(labels[0]).toHaveTextContent('Edit');
    expect(labels[1]).toHaveTextContent('Share');
    expect(labels[2]).toHaveTextContent('Danger zone');

    // Groups have visual separator between them
    const secondGroup = groups[1];
    const groupStyle = window.getComputedStyle(secondGroup);
    expect(groupStyle.borderTopStyle).not.toBe('none');
  },
};

/**
 * Sub-menus for hierarchical menu structures. Arrow Right opens a
 * sub-menu, Arrow Left or Escape closes it.
 */
export const SubMenu = {
  parameters: {
    docs: { story: { inline: true, height: 360 } },
  },
  render: () => `
    <div style="min-height: 320px; padding: 24px;">
      <div class="ct-dropdown" data-state="open">
        ${triggerButton('sub-menu')}
        <div class="ct-dropdown__menu" role="menu" id="sub-menu" aria-label="Actions">
          <button class="ct-dropdown__item" role="menuitem" tabindex="0">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${EDIT_SVG}</span>
            <span class="ct-dropdown__item-label">Edit</span>
          </button>
          <div class="ct-dropdown__sub" data-state="open">
            <button class="ct-dropdown__sub-trigger" role="menuitem"
                    aria-haspopup="menu" aria-expanded="true" tabindex="-1">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${SHARE_SVG}</span>
              <span class="ct-dropdown__item-label">Share via</span>
              <span class="ct-dropdown__sub-chevron" aria-hidden="true">${CHEVRON_RIGHT_SVG}</span>
            </button>
            <div class="ct-dropdown__sub-content" role="menu" aria-label="Share options">
              <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
                <span class="ct-dropdown__item-icon" aria-hidden="true">${LINK_SVG}</span>
                <span class="ct-dropdown__item-label">Copy link</span>
              </button>
              <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
                <span class="ct-dropdown__item-icon" aria-hidden="true">${MAIL_SVG}</span>
                <span class="ct-dropdown__item-label">Email</span>
              </button>
            </div>
          </div>
          <div class="ct-dropdown__separator" role="none"></div>
          <button class="ct-dropdown__item ct-dropdown__item--danger" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${TRASH_SVG}</span>
            <span class="ct-dropdown__item-label">Delete</span>
          </button>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    // Sub-trigger has aria-haspopup and aria-expanded
    const subTrigger = canvasElement.querySelector('.ct-dropdown__sub-trigger');
    expect(subTrigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(subTrigger).toHaveAttribute('aria-expanded', 'true');

    // Sub-content has role="menu"
    const subContent = canvasElement.querySelector('.ct-dropdown__sub-content');
    expect(subContent).toHaveAttribute('role', 'menu');
    expect(subContent).toHaveAttribute('aria-label', 'Share options');

    // Sub-content has menu items
    const subItems = subContent.querySelectorAll('[role="menuitem"]');
    expect(subItems.length).toBe(2);

    // Chevron indicator exists
    const chevron = canvasElement.querySelector('.ct-dropdown__sub-chevron');
    expect(chevron).not.toBeNull();
    expect(chevron).toHaveAttribute('aria-hidden', 'true');

    // Sub-menu is visible (data-state="open")
    const sub = canvasElement.querySelector('.ct-dropdown__sub');
    expect(sub).toHaveAttribute('data-state', 'open');
    const subStyle = window.getComputedStyle(subContent);
    expect(subStyle.opacity).toBe('1');
    expect(subStyle.visibility).toBe('visible');
  },
};

/**
 * Items with a secondary description line for additional context.
 */
export const WithDescriptions = {
  parameters: {
    docs: { story: { inline: true, height: 360 } },
  },
  render: () => `
    <div style="min-height: 320px; padding: 24px;">
      <div class="ct-dropdown" data-state="open">
        ${triggerButton('desc-menu')}
        <div class="ct-dropdown__menu" role="menu" id="desc-menu" aria-label="Status actions"
             style="min-width: 280px;">
          <button class="ct-dropdown__item" role="menuitem" tabindex="0">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${EDIT_SVG}</span>
            <span class="ct-dropdown__item-label">
              Draft
              <span class="ct-dropdown__item-description">Only visible to you</span>
            </span>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${SHARE_SVG}</span>
            <span class="ct-dropdown__item-label">
              Published
              <span class="ct-dropdown__item-description">Visible to all team members</span>
            </span>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${ARCHIVE_SVG}</span>
            <span class="ct-dropdown__item-label">
              Archived
              <span class="ct-dropdown__item-description">Hidden from views, still searchable</span>
            </span>
          </button>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const descriptions = canvasElement.querySelectorAll('.ct-dropdown__item-description');
    expect(descriptions).toHaveLength(3);

    // Descriptions have smaller font size
    const descStyle = window.getComputedStyle(descriptions[0]);
    const labelStyle = window.getComputedStyle(
      canvasElement.querySelector('.ct-dropdown__item-label')
    );
    expect(descStyle.fontSize).not.toBe(labelStyle.fontSize);

    // Items with descriptions render properly
    expect(descriptions[0]).toHaveTextContent('Only visible to you');
    expect(descriptions[1]).toHaveTextContent('Visible to all team members');
  },
};

/**
 * Virtual focus via `data-highlighted` for JS-driven navigation
 * without moving real DOM focus. Consistent with Combobox and Select Menu.
 */
export const VirtualFocus = {
  parameters: {
    docs: { story: { inline: true, height: 320 } },
  },
  render: () => `
    <div style="min-height: 280px; padding: 24px;">
      <div class="ct-dropdown" data-state="open">
        ${triggerButton('vf-menu')}
        <div class="ct-dropdown__menu" role="menu" id="vf-menu" aria-label="Highlighted demo">
          <button class="ct-dropdown__item" role="menuitem" tabindex="0">
            <span class="ct-dropdown__item-label">First item</span>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1" data-highlighted>
            <span class="ct-dropdown__item-label">Highlighted item</span>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-label">Third item</span>
          </button>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const highlighted = canvasElement.querySelector('[data-highlighted]');
    expect(highlighted).not.toBeNull();
    expect(highlighted).toHaveTextContent('Highlighted item');

    // Highlighted item has visual outline
    const hlStyle = window.getComputedStyle(highlighted);
    expect(hlStyle.outlineStyle).not.toBe('none');

    // Non-highlighted items don't have outline
    const normal = canvasElement.querySelector('[role="menuitem"]:not([data-highlighted])');
    const normalStyle = window.getComputedStyle(normal);
    expect(normalStyle.outlineStyle).toBe('none');
  },
};

/**
 * Size variants: small, medium (default), and large.
 */
export const Sizes = {
  parameters: {
    docs: { story: { inline: true, height: 360 } },
  },
  render: () => {
    const menuItems = (prefix) => `
      <button class="ct-dropdown__item" role="menuitem" tabindex="0">
        <span class="ct-dropdown__item-icon" aria-hidden="true">${EDIT_SVG}</span>
        <span class="ct-dropdown__item-label">Edit</span>
        <kbd class="ct-dropdown__item-shortcut">Ctrl+E</kbd>
      </button>
      <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
        <span class="ct-dropdown__item-icon" aria-hidden="true">${COPY_SVG}</span>
        <span class="ct-dropdown__item-label">Duplicate</span>
      </button>
      <button class="ct-dropdown__item ct-dropdown__item--danger" role="menuitem" tabindex="-1">
        <span class="ct-dropdown__item-icon" aria-hidden="true">${TRASH_SVG}</span>
        <span class="ct-dropdown__item-label">Delete</span>
      </button>`;

    return `
    <div style="padding: 24px; display: flex; align-items: flex-start; gap: 48px; flex-wrap: wrap;">
      <div>
        <p class="ct-muted" style="margin-bottom: var(--space-2);">Small</p>
        <div class="ct-dropdown ct-dropdown--sm" data-state="open">
          ${triggerButton('sm-menu')}
          <div class="ct-dropdown__menu" role="menu" id="sm-menu" aria-label="Small actions">
            ${menuItems('sm')}
          </div>
        </div>
      </div>
      <div>
        <p class="ct-muted" style="margin-bottom: var(--space-2);">Medium (default)</p>
        <div class="ct-dropdown" data-state="open">
          ${triggerButton('md-menu')}
          <div class="ct-dropdown__menu" role="menu" id="md-menu" aria-label="Medium actions">
            ${menuItems('md')}
          </div>
        </div>
      </div>
      <div>
        <p class="ct-muted" style="margin-bottom: var(--space-2);">Large</p>
        <div class="ct-dropdown ct-dropdown--lg" data-state="open">
          ${triggerButton('lg-menu')}
          <div class="ct-dropdown__menu" role="menu" id="lg-menu" aria-label="Large actions">
            ${menuItems('lg')}
          </div>
        </div>
      </div>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const smItem = canvasElement.querySelector('.ct-dropdown--sm [role="menuitem"]');
    const mdItem = canvasElement.querySelector('.ct-dropdown:not(.ct-dropdown--sm):not(.ct-dropdown--lg) [role="menuitem"]');
    const lgItem = canvasElement.querySelector('.ct-dropdown--lg [role="menuitem"]');

    expect(smItem).not.toBeNull();
    expect(mdItem).not.toBeNull();
    expect(lgItem).not.toBeNull();

    // Font sizes differ between sizes
    const smFont = window.getComputedStyle(smItem).fontSize;
    const mdFont = window.getComputedStyle(mdItem).fontSize;
    const lgFont = window.getComputedStyle(lgItem).fontSize;

    expect(parseFloat(smFont)).toBeLessThan(parseFloat(mdFont));
    expect(parseFloat(mdFont)).toBeLessThan(parseFloat(lgFont));
  },
};

/**
 * Disabled items that cannot be interacted with.
 */
export const DisabledItems = {
  parameters: {
    docs: { story: { inline: true, height: 300 } },
  },
  render: () => `
    <div style="min-height: 260px; padding: 24px;">
      <div class="ct-dropdown" data-state="open">
        ${triggerButton('dis-menu')}
        <div class="ct-dropdown__menu" role="menu" id="dis-menu" aria-label="Actions">
          <button class="ct-dropdown__item" role="menuitem" tabindex="0">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${EDIT_SVG}</span>
            <span class="ct-dropdown__item-label">Edit</span>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1" aria-disabled="true">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${COPY_SVG}</span>
            <span class="ct-dropdown__item-label">Duplicate (limit reached)</span>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${SHARE_SVG}</span>
            <span class="ct-dropdown__item-label">Share</span>
          </button>
          <button class="ct-dropdown__item ct-dropdown__item--danger" role="menuitem" tabindex="-1" aria-disabled="true">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${TRASH_SVG}</span>
            <span class="ct-dropdown__item-label">Delete (no permission)</span>
          </button>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const disabled = canvasElement.querySelectorAll('[aria-disabled="true"]');
    expect(disabled).toHaveLength(2);

    // Disabled items have reduced opacity
    for (const item of disabled) {
      const style = window.getComputedStyle(item);
      expect(parseFloat(style.opacity)).toBeLessThan(1);
    }

    // Disabled items have pointer-events: none
    const disabledStyle = window.getComputedStyle(disabled[0]);
    expect(disabledStyle.pointerEvents).toBe('none');
  },
};

/**
 * Mixed item types: standard, checkbox, radio, separator, and label
 * combined in a single menu for complex settings panels.
 */
export const MixedItemTypes = {
  parameters: {
    docs: { story: { inline: true, height: 520 } },
  },
  render: () => `
    <div style="min-height: 480px; padding: 24px;">
      <div class="ct-dropdown" data-state="open">
        ${triggerButton('mixed-menu')}
        <div class="ct-dropdown__menu" role="menu" id="mixed-menu" aria-label="Editor settings"
             style="min-width: 240px;">
          <div class="ct-dropdown__group" role="group" aria-labelledby="mixed-actions-label">
            <div class="ct-dropdown__group-label" id="mixed-actions-label">Actions</div>
            <button class="ct-dropdown__item" role="menuitem" tabindex="0">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${EDIT_SVG}</span>
              <span class="ct-dropdown__item-label">Edit file</span>
              <kbd class="ct-dropdown__item-shortcut">Ctrl+E</kbd>
            </button>
            <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${DOWNLOAD_SVG}</span>
              <span class="ct-dropdown__item-label">Download</span>
              <kbd class="ct-dropdown__item-shortcut">Ctrl+S</kbd>
            </button>
          </div>
          <div class="ct-dropdown__group" role="group" aria-labelledby="mixed-view-label">
            <div class="ct-dropdown__group-label" id="mixed-view-label">View</div>
            <button class="ct-dropdown__item" role="menuitemcheckbox" aria-checked="true" tabindex="-1">
              <span class="ct-dropdown__item-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-dropdown__item-label">Show toolbar</span>
            </button>
            <button class="ct-dropdown__item" role="menuitemcheckbox" aria-checked="false" tabindex="-1">
              <span class="ct-dropdown__item-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-dropdown__item-label">Show statusbar</span>
            </button>
          </div>
          <div class="ct-dropdown__group" role="group" aria-labelledby="mixed-sort-label">
            <div class="ct-dropdown__group-label" id="mixed-sort-label">Sort</div>
            <button class="ct-dropdown__item" role="menuitemradio" aria-checked="false" tabindex="-1">
              <span class="ct-dropdown__item-radio" aria-hidden="true"></span>
              <span class="ct-dropdown__item-label">Name</span>
            </button>
            <button class="ct-dropdown__item" role="menuitemradio" aria-checked="true" tabindex="-1">
              <span class="ct-dropdown__item-radio" aria-hidden="true"></span>
              <span class="ct-dropdown__item-label">Date</span>
            </button>
            <button class="ct-dropdown__item" role="menuitemradio" aria-checked="false" tabindex="-1">
              <span class="ct-dropdown__item-radio" aria-hidden="true"></span>
              <span class="ct-dropdown__item-label">Size</span>
            </button>
          </div>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    // All three item types coexist
    const menuitems = canvasElement.querySelectorAll('[role="menuitem"]');
    const checkboxes = canvasElement.querySelectorAll('[role="menuitemcheckbox"]');
    const radios = canvasElement.querySelectorAll('[role="menuitemradio"]');

    expect(menuitems.length).toBe(2);
    expect(checkboxes.length).toBe(2);
    expect(radios.length).toBe(3);

    // Groups separate the item types
    const groups = canvasElement.querySelectorAll('.ct-dropdown__group');
    expect(groups).toHaveLength(3);
  },
};

/**
 * Keyboard navigation test: Arrow Up/Down, Home/End, Escape, and Typeahead.
 */
export const KeyboardNavigation = {
  parameters: {
    docs: { story: { inline: true, height: 340 } },
  },
  render: () => `
    <div style="min-height: 300px; padding: 24px;">
      <div class="ct-dropdown" data-state="open">
        ${triggerButton('kb-menu')}
        <div class="ct-dropdown__menu" role="menu" id="kb-menu" aria-label="Keyboard test">
          <button class="ct-dropdown__item" role="menuitem" tabindex="0">
            <span class="ct-dropdown__item-label">Apple</span>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-label">Banana</span>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-label">Cherry</span>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1" aria-disabled="true">
            <span class="ct-dropdown__item-label">Date (disabled)</span>
          </button>
          <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-label">Elderberry</span>
          </button>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const dropdown = canvasElement.querySelector('.ct-dropdown');
    initDropdownKeyboard(dropdown);

    const items = [...canvasElement.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')];
    expect(items).toHaveLength(4);

    // Focus first item
    items[0].focus();
    expect(items[0]).toHaveFocus();

    // ArrowDown → second item
    await userEvent.keyboard('{ArrowDown}');
    expect(items[1]).toHaveFocus();

    // ArrowDown → third item (skips nothing here, disabled items excluded from query)
    await userEvent.keyboard('{ArrowDown}');
    expect(items[2]).toHaveFocus();

    // ArrowDown → fourth item (Elderberry, skips disabled Date)
    await userEvent.keyboard('{ArrowDown}');
    expect(items[3]).toHaveFocus();

    // ArrowDown wraps → first item
    await userEvent.keyboard('{ArrowDown}');
    expect(items[0]).toHaveFocus();

    // ArrowUp wraps → last item
    await userEvent.keyboard('{ArrowUp}');
    expect(items[3]).toHaveFocus();

    // Home → first item
    await userEvent.keyboard('{Home}');
    expect(items[0]).toHaveFocus();

    // End → last item
    await userEvent.keyboard('{End}');
    expect(items[3]).toHaveFocus();

    // Typeahead: 'c' → Cherry
    await userEvent.keyboard('{Home}');
    await userEvent.keyboard('c');
    expect(items[2]).toHaveFocus();
    expect(items[2]).toHaveTextContent('Cherry');

    // Typeahead: 'b' → Banana
    await userEvent.keyboard('b');
    expect(items[1]).toHaveFocus();

    // Escape closes menu
    await userEvent.keyboard('{Escape}');
    expect(dropdown).toHaveAttribute('data-state', 'closed');
  },
};

/**
 * Alignment and positioning: top/bottom side, start/end alignment.
 */
export const Positioning = {
  parameters: {
    docs: { story: { inline: true, height: 440 } },
  },
  render: () => {
    const menuContent = `
      <button class="ct-dropdown__item" role="menuitem" tabindex="0">
        <span class="ct-dropdown__item-label">Edit</span>
      </button>
      <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
        <span class="ct-dropdown__item-label">Duplicate</span>
      </button>
      <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
        <span class="ct-dropdown__item-label">Delete</span>
      </button>`;

    return `
    <div style="padding: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 200px 48px; min-height: 400px; align-items: center;">
      <div>
        <p class="ct-muted" style="margin-bottom: var(--space-2);">Bottom + Start (default)</p>
        <div class="ct-dropdown" data-state="open">
          ${triggerButton('pos-bs-menu')}
          <div class="ct-dropdown__menu" role="menu" id="pos-bs-menu" aria-label="Bottom start">${menuContent}</div>
        </div>
      </div>
      <div style="text-align: right;">
        <p class="ct-muted" style="margin-bottom: var(--space-2);">Bottom + End</p>
        <div class="ct-dropdown" data-state="open" data-align="end">
          ${triggerButton('pos-be-menu')}
          <div class="ct-dropdown__menu" role="menu" id="pos-be-menu" aria-label="Bottom end">${menuContent}</div>
        </div>
      </div>
      <div>
        <p class="ct-muted" style="margin-bottom: var(--space-2);">Top + Start</p>
        <div class="ct-dropdown" data-state="open" data-side="top">
          ${triggerButton('pos-ts-menu')}
          <div class="ct-dropdown__menu" role="menu" id="pos-ts-menu" aria-label="Top start">${menuContent}</div>
        </div>
      </div>
      <div style="text-align: right;">
        <p class="ct-muted" style="margin-bottom: var(--space-2);">Top + End</p>
        <div class="ct-dropdown" data-state="open" data-side="top" data-align="end">
          ${triggerButton('pos-te-menu')}
          <div class="ct-dropdown__menu" role="menu" id="pos-te-menu" aria-label="Top end">${menuContent}</div>
        </div>
      </div>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    // All four menus are visible
    const menus = canvasElement.querySelectorAll('[role="menu"]');
    expect(menus).toHaveLength(4);

    // Top-side menu is above its trigger
    const topDropdown = canvasElement.querySelector('[data-side="top"]');
    const topTrigger = topDropdown.querySelector('[aria-haspopup]');
    const topMenu = topDropdown.querySelector('.ct-dropdown__menu');
    const triggerRect = topTrigger.getBoundingClientRect();
    const menuRect = topMenu.getBoundingClientRect();
    expect(menuRect.bottom).toBeLessThanOrEqual(triggerRect.top + 1);

    // End-aligned menu is right-aligned to its trigger
    const endDropdown = canvasElement.querySelector('[data-align="end"]:not([data-side])');
    const endMenu = endDropdown.querySelector('.ct-dropdown__menu');
    const endTrigger = endDropdown.querySelector('[aria-haspopup]');
    const endMenuRect = endMenu.getBoundingClientRect();
    const endTriggerRect = endTrigger.getBoundingClientRect();
    expect(endMenuRect.right).toBeCloseTo(endTriggerRect.right, -1);
  },
};

/**
 * Context menu pattern: right-click triggered dropdown positioned at cursor.
 */
export const ContextMenuPattern = {
  parameters: {
    docs: { story: { inline: true, height: 360 } },
  },
  render: () => `
    <div style="min-height: 320px; padding: 24px;">
      <div class="ct-dropdown" data-state="open" style="position: static;">
        <div style="padding: var(--space-8); border: var(--border-thin) dashed var(--color-border-default);
                     border-radius: var(--radius-md); color: var(--color-text-muted); text-align: center;
                     position: relative;">
          Right-click area (simulated)
          <div class="ct-dropdown__menu" role="menu" aria-label="Context actions"
               style="top: 60px; left: 120px; inset-block-start: 60px; inset-inline-start: 120px;">
            <button class="ct-dropdown__item" role="menuitem" tabindex="0">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${EDIT_SVG}</span>
              <span class="ct-dropdown__item-label">Edit</span>
            </button>
            <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${COPY_SVG}</span>
              <span class="ct-dropdown__item-label">Copy</span>
              <kbd class="ct-dropdown__item-shortcut">Ctrl+C</kbd>
            </button>
            <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${DOWNLOAD_SVG}</span>
              <span class="ct-dropdown__item-label">Paste</span>
              <kbd class="ct-dropdown__item-shortcut">Ctrl+V</kbd>
            </button>
            <div class="ct-dropdown__separator" role="none"></div>
            <button class="ct-dropdown__item ct-dropdown__item--danger" role="menuitem" tabindex="-1">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${TRASH_SVG}</span>
              <span class="ct-dropdown__item-label">Delete</span>
              <kbd class="ct-dropdown__item-shortcut">Del</kbd>
            </button>
          </div>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const menu = canvasElement.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
    expect(menu).toHaveAttribute('aria-label', 'Context actions');

    const items = canvasElement.querySelectorAll('[role="menuitem"]');
    expect(items.length).toBe(4);
  },
};

/**
 * Sub-menus collapse inline on narrow viewports (< 600px).
 * On mobile, sub-content becomes a nested indented section instead of
 * flying out to the side where it would overflow the viewport.
 */
export const SubMenuResponsive = {
  parameters: {
    docs: {
      description: {
        story:
          'On viewports below 600px, sub-menus render inline (indented) instead of ' +
          'positioned to the side, preventing viewport overflow. ' +
          'Resize the viewport or use Storybook mobile viewport to see the effect.',
      },
      story: { inline: true, height: 360 },
    },
  },
  render: () => `
    <div style="min-height: 320px; padding: 24px; max-width: 320px;">
      <div class="ct-dropdown" data-state="open">
        <button class="ct-button ct-button--secondary"
                aria-haspopup="menu" aria-expanded="true" aria-controls="resp-sub-menu">
          Actions
        </button>
        <div class="ct-dropdown__menu" role="menu" id="resp-sub-menu" aria-label="Actions">
          <button class="ct-dropdown__item" role="menuitem" tabindex="0">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${EDIT_SVG}</span>
            <span class="ct-dropdown__item-label">Edit</span>
          </button>
          <div class="ct-dropdown__sub" data-state="open">
            <button class="ct-dropdown__sub-trigger" role="menuitem"
                    aria-haspopup="menu" aria-expanded="true" tabindex="-1">
              <span class="ct-dropdown__item-icon" aria-hidden="true">${SHARE_SVG}</span>
              <span class="ct-dropdown__item-label">Share via</span>
              <span class="ct-dropdown__sub-chevron" aria-hidden="true">${CHEVRON_RIGHT_SVG}</span>
            </button>
            <div class="ct-dropdown__sub-content" role="menu" aria-label="Share options">
              <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
                <span class="ct-dropdown__item-icon" aria-hidden="true">${LINK_SVG}</span>
                <span class="ct-dropdown__item-label">Copy link</span>
              </button>
              <button class="ct-dropdown__item" role="menuitem" tabindex="-1">
                <span class="ct-dropdown__item-icon" aria-hidden="true">${MAIL_SVG}</span>
                <span class="ct-dropdown__item-label">Email</span>
              </button>
            </div>
          </div>
          <div class="ct-dropdown__separator" role="none"></div>
          <button class="ct-dropdown__item ct-dropdown__item--danger" role="menuitem" tabindex="-1">
            <span class="ct-dropdown__item-icon" aria-hidden="true">${TRASH_SVG}</span>
            <span class="ct-dropdown__item-label">Delete</span>
          </button>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    // Sub-menu content is visible and accessible
    const subContent = canvasElement.querySelector('.ct-dropdown__sub-content');
    expect(subContent).toHaveAttribute('role', 'menu');
    const subStyle = window.getComputedStyle(subContent);
    expect(subStyle.visibility).toBe('visible');

    // Sub-menu items are in the DOM and accessible
    const subItems = subContent.querySelectorAll('[role="menuitem"]');
    expect(subItems.length).toBe(2);

    // Menu does not overflow its container width
    const menu = canvasElement.querySelector('.ct-dropdown__menu');
    const menuRect = menu.getBoundingClientRect();
    const containerRect = canvasElement.getBoundingClientRect();
    expect(menuRect.right).toBeLessThanOrEqual(containerRect.right + 1);
  },
};
