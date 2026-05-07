import { expect, within, userEvent } from 'storybook/test';
import { attachTree } from './utils/tree-controller.js';

/* ── Markup helpers ─────────────────────────────────── */

const chevron = `<svg class="ct-tree__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>`;

const folderIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
const fileIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
const orgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/><path d="M9 9v.01M9 13v.01M9 17v.01"/></svg>`;
const warnIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

/**
 * Render a tree node from a plain object.
 * Node shape: { label, level, children?, icon?, badge?, actions?, expanded?, selected?, busy?, orphan?, disabled? }
 */
function renderNode(node, posinset, setsize) {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const expanded = node.expanded !== false;
  const expandedAttr = hasChildren ? ` aria-expanded="${expanded}"` : '';
  const selectedAttr = node.selected ? ' aria-selected="true"' : '';
  const disabledAttr = node.disabled ? ' aria-disabled="true"' : '';
  const orphanClass = node.orphan ? ' ct-tree__node--orphan' : '';
  const busyAttr = node.busy ? ' aria-busy="true"' : '';
  const toggle = hasChildren
    ? `<span class="ct-tree__toggle" aria-hidden="true">${chevron}</span>`
    : '<span class="ct-tree__spacer" aria-hidden="true"></span>';
  const icon = node.icon || '';
  const badge = node.badge
    ? `<span class="ct-badge ct-badge--neutral ct-badge--sm" aria-hidden="true">${node.badge}</span>`
    : '';
  const actions = node.actions
    ? `<span class="ct-tree__actions">${node.actions}</span>`
    : '';

  const childMarkup = hasChildren
    ? `<ul class="ct-tree__group" role="group">${node.children
        .map((c, i) => renderNode(c, i + 1, node.children.length))
        .join('')}</ul>`
    : '';

  return `
    <li class="ct-tree__node${orphanClass}" role="treeitem" aria-level="${node.level}" aria-posinset="${posinset}" aria-setsize="${setsize}"${expandedAttr}${selectedAttr}${disabledAttr}${busyAttr}>
      <div class="ct-tree__row" style="--ct-level: ${node.level};">
        ${toggle}
        <span class="ct-tree__content">
          ${icon}
          <span class="ct-tree__label">${node.label}</span>
          ${badge}
        </span>
        ${actions}
      </div>
      ${childMarkup}
    </li>
  `;
}

function buildTree({ label = 'Tree', nodes, modifiers = '', selection = 'none' } = {}) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <ul class="ct-tree ${modifiers}" role="tree" aria-label="${label}" data-ct-tree>
      ${nodes.map((n, i) => renderNode(n, i + 1, nodes.length)).join('')}
    </ul>
  `.trim();
  const tree = wrapper.firstElementChild;
  attachTree(tree, { selection });
  return tree;
}

/* ── Sample data: organisation hierarchy ───────────── */

const orgTree = [
  {
    label: 'Accessful Platform',
    level: 1,
    icon: orgIcon,
    expanded: true,
    children: [
      {
        label: 'Acme · Whitelabel',
        level: 2,
        icon: orgIcon,
        badge: '2 sub',
        expanded: true,
        children: [
          { label: 'Acme · DACH', level: 3, icon: orgIcon },
          { label: 'Acme · NORDICS', level: 3, icon: orgIcon },
        ],
      },
      {
        label: 'Globex · Whitelabel',
        level: 2,
        icon: orgIcon,
        badge: '1 sub',
        expanded: false,
        children: [{ label: 'Globex · EMEA', level: 3, icon: orgIcon }],
      },
      { label: 'Hooli GmbH · Direct', level: 2, icon: orgIcon },
      { label: 'Initech AG · Direct', level: 2, icon: orgIcon },
    ],
  },
];

const fileTree = [
  {
    label: 'src',
    level: 1,
    icon: folderIcon,
    expanded: true,
    children: [
      {
        label: 'components',
        level: 2,
        icon: folderIcon,
        expanded: true,
        children: [
          { label: 'tree.css', level: 3, icon: fileIcon },
          { label: 'list.css', level: 3, icon: fileIcon },
          { label: 'card.css', level: 3, icon: fileIcon },
        ],
      },
      {
        label: 'tokens',
        level: 2,
        icon: folderIcon,
        expanded: false,
        children: [
          { label: 'primitives.json', level: 3, icon: fileIcon },
          { label: 'semantic.light.json', level: 3, icon: fileIcon },
        ],
      },
      { label: 'README.md', level: 2, icon: fileIcon },
    ],
  },
];

/* ── Storybook config ────────────────────────────── */

export default {
  title: 'Data Display/Tree',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Hierarchical disclosure following the [WAI-ARIA Tree View pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/). Supports n-level nesting, roving tabindex keyboard navigation, single/multi selection, async loading, and an orphan state for nodes whose parent is missing. Construct ships CSS only; the JS controller used by these stories is provided as a Storybook helper.',
      },
    },
  },
};

const FRAME_STYLE = `
  width: min(560px, 100%);
  padding: var(--space-4);
  background: var(--color-bg-elevated);
  border: var(--border-thin) solid var(--color-border-subtle);
  border-radius: var(--radius-md);
`;

function frame(child) {
  const wrap = document.createElement('div');
  wrap.setAttribute('style', FRAME_STYLE);
  wrap.appendChild(child);
  return wrap;
}

/* ── 1. Playground ─────────────────────────────── */

export const Playground = {
  args: {
    guides: false,
    dense: false,
    selection: 'single',
  },
  argTypes: {
    guides: { control: 'boolean', description: 'Show indent guides' },
    dense: { control: 'boolean', description: 'Compact rows' },
    selection: {
      control: 'select',
      options: ['none', 'single', 'multi'],
      description: 'Selection mode',
    },
  },
  render: ({ guides, dense, selection }) => {
    const modifiers = [
      guides ? 'ct-tree--guides' : '',
      dense ? 'ct-tree--dense' : '',
    ].join(' ');
    return frame(
      buildTree({
        label: 'Organisations',
        nodes: orgTree,
        modifiers,
        selection,
      }),
    );
  },
};

/* ── 2. WithIndentGuides ─────────────────────── */

export const WithIndentGuides = {
  render: () =>
    frame(
      buildTree({
        label: 'Organisations',
        nodes: orgTree,
        modifiers: 'ct-tree--guides',
      }),
    ),
  play: async ({ canvasElement }) => {
    const tree = canvasElement.querySelector('.ct-tree');
    expect(tree).toHaveClass('ct-tree--guides');
    expect(tree).toHaveAttribute('role', 'tree');
  },
};

/* ── 3. Dense ─────────────────────────────────── */

export const Dense = {
  render: () =>
    frame(
      buildTree({
        label: 'Files',
        nodes: fileTree,
        modifiers: 'ct-tree--dense',
      }),
    ),
  play: async ({ canvasElement }) => {
    const tree = canvasElement.querySelector('.ct-tree');
    expect(tree).toHaveClass('ct-tree--dense');
  },
};

/* ── 4. WithBadgesAndIcons ───────────────────── */

export const WithBadgesAndIcons = {
  render: () =>
    frame(
      buildTree({
        label: 'Organisations',
        nodes: orgTree,
        modifiers: 'ct-tree--guides',
      }),
    ),
  play: async ({ canvasElement }) => {
    const badges = canvasElement.querySelectorAll('.ct-badge');
    expect(badges.length).toBeGreaterThan(0);
    const icons = canvasElement.querySelectorAll('.ct-tree__content > svg');
    expect(icons.length).toBeGreaterThan(0);
  },
};

/* ── 5. WithRowActions ───────────────────────── */

const moreIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`;
const plusIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

/* Action buttons live inside the focusable treeitem; they must be removed
   from the global Tab order so the tree exposes a single Tab stop, per
   the WAI-ARIA Tree View pattern. Reach them via mouse or via a row-level
   action hotkey provided by the consuming framework. */
const actionButtons = `
  <button class="ct-button ct-button--ghost ct-button--sm ct-button--icon" type="button" tabindex="-1" aria-label="Add sub-organisation">
    <span class="ct-icon ct-icon--sm">${plusIcon}</span>
  </button>
  <button class="ct-button ct-button--ghost ct-button--sm ct-button--icon" type="button" tabindex="-1" aria-label="More actions">
    <span class="ct-icon ct-icon--sm">${moreIcon}</span>
  </button>
`;

export const WithRowActions = {
  render: () => {
    const data = JSON.parse(JSON.stringify(orgTree));
    const apply = (n) => {
      n.actions = actionButtons;
      (n.children || []).forEach(apply);
    };
    data.forEach(apply);
    return frame(
      buildTree({
        label: 'Organisations',
        nodes: data,
        modifiers: 'ct-tree--guides',
      }),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Row-action buttons live in the `.ct-tree__actions` slot. They become visible on row hover or focus to reduce visual noise in long trees.',
      },
    },
  },
};

/* ── 6. SingleSelection ──────────────────────── */

export const SingleSelection = {
  render: () => {
    const data = JSON.parse(JSON.stringify(orgTree));
    data[0].children[0].selected = true;
    return frame(
      buildTree({
        label: 'Organisations',
        nodes: data,
        modifiers: 'ct-tree--guides',
        selection: 'single',
      }),
    );
  },
  play: async ({ canvasElement }) => {
    const initiallySelected = canvasElement.querySelector(
      '.ct-tree__node[aria-selected="true"]',
    );
    expect(initiallySelected).toBeInTheDocument();

    const rows = canvasElement.querySelectorAll('.ct-tree__row');
    const targetRow = rows[3];
    await userEvent.click(targetRow);

    const allSelected = canvasElement.querySelectorAll(
      '.ct-tree__node[aria-selected="true"]',
    );
    expect(allSelected).toHaveLength(1);
  },
};

/* ── 7. MultiSelection ───────────────────────── */

export const MultiSelection = {
  render: () =>
    frame(
      buildTree({
        label: 'Organisations',
        nodes: orgTree,
        modifiers: 'ct-tree--guides',
        selection: 'multi',
      }),
    ),
  play: async ({ canvasElement }) => {
    const tree = canvasElement.querySelector('.ct-tree');
    expect(tree).toHaveAttribute('aria-multiselectable', 'true');

    const rows = canvasElement.querySelectorAll('.ct-tree__row');
    await userEvent.click(rows[1]);
    await userEvent.click(rows[2]);
    const selected = canvasElement.querySelectorAll(
      '.ct-tree__node[aria-selected="true"]',
    );
    expect(selected.length).toBeGreaterThanOrEqual(2);
  },
};

/* ── 8. AsyncLoading ─────────────────────────── */

export const AsyncLoading = {
  render: () => {
    const data = [
      {
        label: 'Accessful Platform',
        level: 1,
        icon: orgIcon,
        expanded: true,
        children: [
          {
            label: 'Acme · Whitelabel',
            level: 2,
            icon: orgIcon,
            expanded: true,
            busy: true,
            children: [
              { label: 'Loading…', level: 3, icon: fileIcon, disabled: true },
            ],
          },
          { label: 'Globex · Direct', level: 2, icon: orgIcon },
        ],
      },
    ];
    return frame(
      buildTree({
        label: 'Organisations (loading)',
        nodes: data,
        modifiers: 'ct-tree--guides',
      }),
    );
  },
  play: async ({ canvasElement }) => {
    const busy = canvasElement.querySelector('.ct-tree__node[aria-busy="true"]');
    expect(busy).toBeInTheDocument();
  },
};

/* ── 9. OrphanState ──────────────────────────── */

export const OrphanState = {
  render: () => {
    const data = [
      {
        label: 'Accessful Platform',
        level: 1,
        icon: orgIcon,
        children: [
          { label: 'Globex · Direct', level: 2, icon: orgIcon },
        ],
      },
      {
        label: 'orphan-sub-001 · Whitelabel-Sub (parent missing)',
        level: 1,
        icon: warnIcon,
        orphan: true,
      },
    ];
    return frame(
      buildTree({
        label: 'Organisations',
        nodes: data,
        modifiers: 'ct-tree--guides',
      }),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'An orphan node is a sub-organisation whose `parent-organization` reference does not exist in the current data set. Render it on the root level with the `ct-tree__node--orphan` modifier so the inconsistency is visible without breaking the tree layout.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const orphan = canvasElement.querySelector('.ct-tree__node--orphan');
    expect(orphan).toBeInTheDocument();
  },
};

/* ── 10. Filtered (highlight matches, auto-expand) ───── */

function highlight(label, query) {
  if (!query) return label;
  const idx = label.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return label;
  return (
    label.slice(0, idx) +
    '<mark>' +
    label.slice(idx, idx + query.length) +
    '</mark>' +
    label.slice(idx + query.length)
  );
}

function filterTree(nodes, query) {
  return nodes
    .map((n) => {
      const childResults = n.children ? filterTree(n.children, query) : [];
      const selfMatch = n.label.toLowerCase().includes(query.toLowerCase());
      if (!selfMatch && childResults.length === 0) return null;
      return {
        ...n,
        label: highlight(n.label, query),
        expanded: true,
        children: childResults,
      };
    })
    .filter(Boolean);
}

export const Filtered = {
  render: () => {
    const filtered = filterTree(orgTree, 'acme');
    return frame(
      buildTree({
        label: 'Organisations (filtered: "acme")',
        nodes: filtered,
        modifiers: 'ct-tree--guides',
      }),
    );
  },
  play: async ({ canvasElement }) => {
    const marks = canvasElement.querySelectorAll('mark');
    expect(marks.length).toBeGreaterThan(0);
  },
};

/* ── 11. Keyboard ────────────────────────────── */

export const Keyboard = {
  render: () =>
    frame(
      buildTree({
        label: 'Keyboard demo',
        nodes: orgTree,
        modifiers: 'ct-tree--guides',
        selection: 'single',
      }),
    ),
  parameters: {
    docs: {
      description: {
        story:
          'Verifies the WAI-ARIA Tree View keyboard pattern: roving tabindex, ↑/↓ navigation, →/← expand/collapse, Home/End, type-ahead, Enter activate.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const tree = canvasElement.querySelector('.ct-tree');
    const allNodes = () =>
      Array.from(canvasElement.querySelectorAll('.ct-tree__node'));
    const visibleNodes = () =>
      allNodes().filter((node) => {
        let parent = node.parentElement;
        while (parent && !parent.classList.contains('ct-tree')) {
          if (
            parent.classList.contains('ct-tree__node') &&
            parent.getAttribute('aria-expanded') === 'false'
          )
            return false;
          parent = parent.parentElement;
        }
        return true;
      });
    const labelOf = (node) =>
      node
        .querySelector(':scope > .ct-tree__row .ct-tree__content')
        .textContent.trim();

    expect(tree).toHaveAttribute('role', 'tree');

    /* Exactly one treeitem has tabindex=0 on init — focus must live on the
       element with role=treeitem, never on the inner row div. */
    const initiallyTabbable = canvasElement.querySelectorAll(
      '.ct-tree__node[tabindex="0"]',
    );
    expect(initiallyTabbable).toHaveLength(1);
    expect(initiallyTabbable[0]).toBe(allNodes()[0]);

    /* No `.ct-tree__row` should ever carry tabindex=0 */
    expect(
      canvasElement.querySelectorAll('.ct-tree__row[tabindex="0"]'),
    ).toHaveLength(0);

    /* Focus the first node, then ArrowDown moves to next visible */
    allNodes()[0].focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(visibleNodes()[1]).toHaveFocus();

    /* ArrowUp goes back */
    await userEvent.keyboard('{ArrowUp}');
    expect(visibleNodes()[0]).toHaveFocus();

    /* End jumps to last visible node */
    await userEvent.keyboard('{End}');
    const visAfterEnd = visibleNodes();
    expect(visAfterEnd[visAfterEnd.length - 1]).toHaveFocus();

    /* Home jumps back to the first node */
    await userEvent.keyboard('{Home}');
    expect(visibleNodes()[0]).toHaveFocus();

    /* ArrowRight on already-expanded root: focus first child */
    await userEvent.keyboard('{ArrowRight}');
    const firstChildNode = canvasElement.querySelector(
      '.ct-tree > .ct-tree__node > .ct-tree__group > .ct-tree__node',
    );
    expect(firstChildNode).toHaveFocus();

    /* ArrowLeft branches by node state:
       - expanded node    → collapse (focus stays)
       - leaf or collapsed → focus parent                                            */
    const firstChildWasExpanded =
      firstChildNode.getAttribute('aria-expanded') === 'true';
    await userEvent.keyboard('{ArrowLeft}');
    if (firstChildWasExpanded) {
      expect(firstChildNode).toHaveAttribute('aria-expanded', 'false');
      expect(firstChildNode).toHaveFocus();
      await userEvent.keyboard('{ArrowLeft}');
    }
    const rootNode = canvasElement.querySelector(
      '.ct-tree > .ct-tree__node',
    );
    expect(rootNode).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(rootNode).toHaveAttribute('aria-expanded', 'false');

    /* ArrowRight expands again */
    await userEvent.keyboard('{ArrowRight}');
    expect(rootNode).toHaveAttribute('aria-expanded', 'true');

    /* Type-ahead: typing "g" jumps to the first node whose label starts with "g" */
    await userEvent.keyboard('g');
    expect(labelOf(document.activeElement).toLowerCase().startsWith('g')).toBe(
      true,
    );
  },
};
