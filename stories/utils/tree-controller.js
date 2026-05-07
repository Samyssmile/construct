/**
 * Tree controller — keyboard + selection behaviour for `.ct-tree`.
 *
 * Construct ships CSS only; this helper is used by Storybook stories and tests
 * to demonstrate the WAI-ARIA Tree View pattern. Consuming framework wrappers
 * (e.g. ng-construct) provide their own behaviour.
 *
 * Focus target is the `<li role="treeitem">` itself — never the inner
 * `.ct-tree__row` `<div>` — so screen readers announce the treeitem role,
 * level, posinset, expanded and selected state when navigation lands on it.
 *
 * Usage:
 *   attachTree(rootElement, { selection: 'single' });
 *   attachTree(rootElement, { selection: 'multi' });
 */

const TYPEAHEAD_RESET_MS = 500;

/**
 * Wire keyboard, focus, and selection behaviour onto a `.ct-tree` element.
 * @param {HTMLElement} root  The `.ct-tree` container.
 * @param {{selection?: 'none'|'single'|'multi'}} [options]
 * @returns {{destroy: () => void}}
 */
export function attachTree(root, options = {}) {
  const selection = options.selection || 'none';

  if (selection === 'multi') {
    root.setAttribute('aria-multiselectable', 'true');
  }

  /** @returns {HTMLElement[]} all visible treeitem `<li>` nodes in DOM order */
  function visibleNodes() {
    const nodes = Array.from(root.querySelectorAll('.ct-tree__node'));
    return nodes.filter((node) => {
      let parent = node.parentElement;
      while (parent && parent !== root) {
        if (
          parent.classList.contains('ct-tree__node') &&
          parent.getAttribute('aria-expanded') === 'false'
        ) {
          return false;
        }
        parent = parent.parentElement;
      }
      return true;
    });
  }

  function rowOf(node) {
    return node.querySelector(':scope > .ct-tree__row');
  }

  function isExpandable(node) {
    return node.hasAttribute('aria-expanded');
  }

  function isDisabled(node) {
    return node.getAttribute('aria-disabled') === 'true';
  }

  function setExpanded(node, expanded) {
    if (!isExpandable(node) || isDisabled(node)) return;
    node.setAttribute('aria-expanded', String(expanded));
    node.dispatchEvent(
      new CustomEvent(expanded ? 'ct-tree:expand' : 'ct-tree:collapse', {
        bubbles: true,
        detail: { node },
      }),
    );
  }

  function parentOf(node) {
    const group = node.parentElement;
    if (!group || !group.classList.contains('ct-tree__group')) return null;
    return group.closest('.ct-tree__node');
  }

  function focusNode(target) {
    if (!target) return;
    root
      .querySelectorAll('.ct-tree__node[tabindex]')
      .forEach((n) => n.setAttribute('tabindex', '-1'));
    target.setAttribute('tabindex', '0');
    target.focus();
  }

  function activate(target) {
    target.dispatchEvent(
      new CustomEvent('ct-tree:activate', {
        bubbles: true,
        detail: { node: target },
      }),
    );
  }

  function toggleSelection(target, mode) {
    if (selection === 'none' || isDisabled(target)) return;
    if (selection === 'single') {
      root
        .querySelectorAll('.ct-tree__node[aria-selected="true"]')
        .forEach((n) => {
          if (n !== target) n.setAttribute('aria-selected', 'false');
        });
      target.setAttribute('aria-selected', 'true');
    } else if (selection === 'multi') {
      const current = target.getAttribute('aria-selected') === 'true';
      target.setAttribute('aria-selected', String(!current));
    }
    target.dispatchEvent(
      new CustomEvent('ct-tree:select', {
        bubbles: true,
        detail: { node: target, mode },
      }),
    );
  }

  /** Per WAI-ARIA APG: `*` expands all *closed* sibling nodes on the current level. */
  function expandClosedSiblings(target) {
    const parent = target.parentElement;
    if (!parent) return;
    Array.from(parent.children)
      .filter(
        (c) =>
          c.classList.contains('ct-tree__node') &&
          isExpandable(c) &&
          c.getAttribute('aria-expanded') === 'false' &&
          !isDisabled(c),
      )
      .forEach((sibling) => setExpanded(sibling, true));
  }

  /* ── Type-ahead ── */
  let typeBuffer = '';
  let typeTimer = 0;

  function typeahead(char) {
    typeBuffer += char.toLowerCase();
    clearTimeout(typeTimer);
    typeTimer = window.setTimeout(() => {
      typeBuffer = '';
    }, TYPEAHEAD_RESET_MS);

    const nodes = visibleNodes();
    const active = root.querySelector('.ct-tree__node[tabindex="0"]') || nodes[0];
    const startIdx = Math.max(0, nodes.indexOf(active));
    const ordered = nodes.slice(startIdx + 1).concat(nodes.slice(0, startIdx + 1));
    const match = ordered.find((n) =>
      labelText(n).toLowerCase().startsWith(typeBuffer),
    );
    if (match) focusNode(match);
  }

  function labelText(node) {
    const content = node.querySelector(':scope > .ct-tree__row .ct-tree__content');
    return (content?.textContent || '').trim();
  }

  /* ── Init: roving tabindex on the `<li>`, populate --ct-level fallback ── */
  function init() {
    const nodes = Array.from(root.querySelectorAll('.ct-tree__node'));
    nodes.forEach((node) => {
      const level = node.getAttribute('aria-level');
      const row = rowOf(node);
      if (row && level && !row.style.getPropertyValue('--ct-level')) {
        row.style.setProperty('--ct-level', level);
      }
      node.setAttribute('tabindex', '-1');
    });
    if (nodes[0]) nodes[0].setAttribute('tabindex', '0');

    /* Indent-guide alignment: each group uses --ct-parent-level (zero-based). */
    root.querySelectorAll('.ct-tree__group').forEach((group) => {
      const parent = group.closest('.ct-tree__node');
      const level = Number(parent?.getAttribute('aria-level') || 1);
      group.style.setProperty('--ct-parent-level', String(level - 1));
    });
  }

  /* ── Event handlers ── */
  function handleClick(e) {
    const toggle = e.target.closest('.ct-tree__toggle');
    if (toggle && root.contains(toggle)) {
      const node = toggle.closest('.ct-tree__node');
      if (isExpandable(node) && !isDisabled(node)) {
        const expanded = node.getAttribute('aria-expanded') === 'true';
        setExpanded(node, !expanded);
      }
      e.stopPropagation();
      return;
    }
    if (e.target.closest('.ct-tree__actions')) return;
    const node = e.target.closest('.ct-tree__node');
    if (!node || !root.contains(node)) return;
    if (isDisabled(node)) return;
    focusNode(node);
    if (selection !== 'none') toggleSelection(node, 'click');
    activate(node);
  }

  function handleKeydown(e) {
    const node = e.target.closest('.ct-tree__node');
    if (!node || !root.contains(node)) return;

    const nodes = visibleNodes();
    const idx = nodes.indexOf(node);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusNode(nodes[Math.min(nodes.length - 1, idx + 1)]);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusNode(nodes[Math.max(0, idx - 1)]);
        break;
      case 'ArrowRight': {
        e.preventDefault();
        if (!isExpandable(node)) break;
        const expanded = node.getAttribute('aria-expanded') === 'true';
        if (!expanded) setExpanded(node, true);
        else {
          const firstChild = node.querySelector(
            ':scope > .ct-tree__group > .ct-tree__node',
          );
          if (firstChild) focusNode(firstChild);
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        const expanded = node.getAttribute('aria-expanded') === 'true';
        if (isExpandable(node) && expanded) {
          setExpanded(node, false);
        } else {
          const parent = parentOf(node);
          if (parent) focusNode(parent);
        }
        break;
      }
      case 'Home':
        e.preventDefault();
        focusNode(nodes[0]);
        break;
      case 'End':
        e.preventDefault();
        focusNode(nodes[nodes.length - 1]);
        break;
      case 'Enter':
        e.preventDefault();
        if (isDisabled(node)) break;
        if (selection !== 'none') toggleSelection(node, 'enter');
        activate(node);
        break;
      case ' ':
        e.preventDefault();
        if (isDisabled(node)) break;
        if (selection !== 'none') toggleSelection(node, 'space');
        else activate(node);
        break;
      case '*':
        e.preventDefault();
        expandClosedSiblings(node);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
          typeahead(e.key);
        }
    }
  }

  init();
  root.addEventListener('click', handleClick);
  root.addEventListener('keydown', handleKeydown);

  return {
    destroy() {
      root.removeEventListener('click', handleClick);
      root.removeEventListener('keydown', handleKeydown);
      root
        .querySelectorAll('.ct-tree__node[tabindex]')
        .forEach((n) => n.removeAttribute('tabindex'));
      if (selection === 'multi') root.removeAttribute('aria-multiselectable');
      clearTimeout(typeTimer);
    },
  };
}

/** Auto-attach to all `[data-ct-tree]` elements within `scope`. */
export function autoAttachTrees(scope = document) {
  const trees = scope.querySelectorAll('.ct-tree[data-ct-tree]');
  trees.forEach((el) => {
    if (el.__ctTree) return;
    const selection = el.getAttribute('data-selection') || 'none';
    el.__ctTree = attachTree(el, { selection });
  });
}
