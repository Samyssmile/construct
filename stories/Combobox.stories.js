import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Forms/Combobox',
  parameters: {
    docs: {
      description: {
        component:
          'Combobox / Autocomplete component for search-with-suggestions, filterable selects, ' +
          'and command-palette patterns. Uses the ARIA combobox pattern with `role="combobox"`, ' +
          '`aria-expanded`, `aria-controls`, `aria-autocomplete`, and `aria-activedescendant`. ' +
          'Supports single-select, multi-select (with chips), and inline (command-palette) variants. ' +
          'Integrates with `ct-field` for labels, hints, and error messages.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Control size',
    },
    open: {
      control: 'boolean',
      description: 'Whether the listbox is open',
    },
    invalid: {
      control: 'boolean',
      description: 'Error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
};

const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

const CHEVRON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

const SPINNER_HTML = `<span class="ct-spinner ct-spinner--sm" role="status" aria-label="Loading"></span>`;

const sizeClass = (size) => {
  if (size === 'sm') return ' ct-combobox--sm';
  if (size === 'lg') return ' ct-combobox--lg';
  return '';
};

const fruits = ['Apple', 'Banana', 'Cherry', 'Dragon Fruit', 'Elderberry', 'Fig', 'Grape'];

/**
 * Interactive playground with all controls.
 */
export const Playground = {
  args: {
    size: 'md',
    open: true,
    invalid: false,
    disabled: false,
  },
  parameters: {
    docs: { story: { inline: true, height: 400 } },
  },
  render: ({ size, open, invalid, disabled }) => `
    <div style="min-height: 360px; padding: 24px; max-width: 360px;">
      <div class="ct-field${invalid ? ' ct-field--error' : ''}">
        <label class="ct-field__label" for="pg-combo-input">Favorite fruit</label>
        <div class="ct-combobox${sizeClass(size)}"
             data-state="${open && !disabled ? 'open' : 'closed'}">
          <div class="ct-combobox__input-wrap">
            <input class="ct-combobox__input"
                   id="pg-combo-input"
                   type="text"
                   role="combobox"
                   aria-expanded="${open && !disabled}"
                   aria-controls="pg-combo-listbox"
                   aria-autocomplete="list"
                   aria-activedescendant="${open && !disabled ? 'pg-combo-opt-3' : ''}"
                   ${invalid ? 'aria-invalid="true"' : ''}
                   ${disabled ? 'disabled' : ''}
                   placeholder="Search fruits..." />
            <button class="ct-combobox__trigger"
                    type="button"
                    aria-label="Toggle suggestions"
                    aria-expanded="${open && !disabled}"
                    ${disabled ? 'disabled' : ''}
                    tabindex="-1">
              <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <ul class="ct-combobox__listbox"
              id="pg-combo-listbox"
              role="listbox"
              aria-label="Fruits">
            ${fruits.map((fruit, i) => `
              <li class="ct-combobox__option"
                  id="pg-combo-opt-${i}"
                  role="option"
                  aria-selected="${i === 2 ? 'true' : 'false'}"
                  ${i === 2 ? 'data-highlighted' : ''}>
                <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
                <span class="ct-combobox__option-label">${fruit}</span>
              </li>`).join('')}
          </ul>
          <div class="ct-combobox__status" role="status" aria-live="polite" aria-atomic="true">
            ${fruits.length} results available
          </div>
        </div>
        ${invalid ? '<div class="ct-field__error">Please select a fruit.</div>' : '<div class="ct-field__hint">Start typing to filter</div>'}
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    expect(input).toHaveAttribute('role', 'combobox');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-controls', 'pg-combo-listbox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-activedescendant', 'pg-combo-opt-3');

    const listbox = canvasElement.querySelector('[role="listbox"]');
    expect(listbox).toBeInTheDocument();
    expect(listbox).toHaveAttribute('aria-label', 'Fruits');

    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(7);

    const selectedOption = options[2];
    expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    expect(selectedOption).toHaveAttribute('data-highlighted', '');
  },
};

/**
 * Default single-select combobox — open state with highlighted and selected options.
 */
export const SingleSelect = {
  parameters: {
    docs: { story: { inline: true, height: 400 } },
  },
  render: () => `
    <div style="min-height: 360px; padding: 24px; max-width: 360px;">
      <div class="ct-field">
        <label class="ct-field__label" for="single-input">Country</label>
        <div class="ct-combobox" data-state="open">
          <div class="ct-combobox__input-wrap">
            <input class="ct-combobox__input"
                   id="single-input"
                   type="text"
                   role="combobox"
                   aria-expanded="true"
                   aria-controls="single-listbox"
                   aria-autocomplete="list"
                   aria-activedescendant="single-opt-1"
                   value="Ger"
                   placeholder="Search countries..." />
            <button class="ct-combobox__trigger"
                    type="button"
                    aria-label="Toggle suggestions"
                    aria-expanded="true"
                    tabindex="-1">
              <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <ul class="ct-combobox__listbox"
              id="single-listbox"
              role="listbox"
              aria-label="Countries">
            <li class="ct-combobox__option" id="single-opt-0" role="option" aria-selected="false">
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">Georgia</span>
            </li>
            <li class="ct-combobox__option" id="single-opt-1" role="option" aria-selected="true" data-highlighted>
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">Germany</span>
            </li>
            <li class="ct-combobox__option" id="single-opt-2" role="option" aria-selected="false">
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">Algeria</span>
            </li>
            <li class="ct-combobox__option" id="single-opt-3" role="option" aria-selected="false" aria-disabled="true">
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">Niger (unavailable)</span>
            </li>
          </ul>
          <div class="ct-combobox__status" role="status" aria-live="polite" aria-atomic="true">
            4 results available
          </div>
        </div>
        <div class="ct-field__hint">Type to filter countries</div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', 'single-opt-1');
    expect(input).toHaveValue('Ger');

    const options = canvasElement.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(4);

    const selected = canvasElement.querySelector('[aria-selected="true"]');
    expect(selected).toHaveAttribute('data-highlighted', '');
    expect(selected.textContent).toContain('Germany');

    const disabled = canvasElement.querySelector('[aria-disabled="true"]');
    expect(disabled.textContent).toContain('Niger');

    const status = canvasElement.querySelector('[role="status"]');
    expect(status).toHaveTextContent('4 results available');

    await userEvent.click(input);
    expect(input).toHaveFocus();
  },
};

/**
 * Closed state — listbox is hidden.
 */
export const Closed = {
  render: () => `
    <div style="padding: 24px; max-width: 360px;">
      <div class="ct-field">
        <label class="ct-field__label" for="closed-input">Framework</label>
        <div class="ct-combobox" data-state="closed">
          <div class="ct-combobox__input-wrap">
            <input class="ct-combobox__input"
                   id="closed-input"
                   type="text"
                   role="combobox"
                   aria-expanded="false"
                   aria-controls="closed-listbox"
                   aria-autocomplete="list"
                   placeholder="Select a framework..." />
            <button class="ct-combobox__trigger"
                    type="button"
                    aria-label="Toggle suggestions"
                    aria-expanded="false"
                    tabindex="-1">
              <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <ul class="ct-combobox__listbox"
              id="closed-listbox"
              role="listbox"
              aria-label="Frameworks">
            <li class="ct-combobox__option" role="option" aria-selected="false">
              <span class="ct-combobox__option-label">Angular</span>
            </li>
            <li class="ct-combobox__option" role="option" aria-selected="false">
              <span class="ct-combobox__option-label">React</span>
            </li>
          </ul>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    expect(input).toHaveAttribute('aria-expanded', 'false');

    const listbox = canvasElement.querySelector('.ct-combobox__listbox');
    expect(listbox).not.toBeVisible();

    const trigger = canvasElement.querySelector('.ct-combobox__trigger');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-label', 'Toggle suggestions');
  },
};

/**
 * All three sizes — sm, md, lg — shown side by side.
 */
export const Sizes = {
  parameters: {
    docs: { story: { inline: true, height: 500 } },
  },
  render: () => {
    const sizes = [
      { cls: 'ct-combobox--sm', label: 'Small', id: 'sz-sm' },
      { cls: '', label: 'Medium (default)', id: 'sz-md' },
      { cls: 'ct-combobox--lg', label: 'Large', id: 'sz-lg' },
    ];
    return `
      <div style="min-height: 460px; padding: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6);">
        ${sizes.map(({ cls, label, id }) => `
          <div class="ct-field">
            <label class="ct-field__label" for="${id}-input">${label}</label>
            <div class="ct-combobox ${cls}" data-state="open">
              <div class="ct-combobox__input-wrap">
                <input class="ct-combobox__input"
                       id="${id}-input"
                       type="text"
                       role="combobox"
                       aria-expanded="true"
                       aria-controls="${id}-listbox"
                       aria-autocomplete="list"
                       placeholder="Search..." />
                <button class="ct-combobox__trigger"
                        type="button"
                        aria-label="Toggle suggestions"
                        aria-expanded="true"
                        tabindex="-1">
                  <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
                </button>
              </div>
              <ul class="ct-combobox__listbox" id="${id}-listbox" role="listbox" aria-label="${label}">
                <li class="ct-combobox__option" role="option" aria-selected="false">
                  <span class="ct-combobox__option-label">Option A</span>
                </li>
                <li class="ct-combobox__option" role="option" aria-selected="true">
                  <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
                  <span class="ct-combobox__option-label">Option B</span>
                </li>
                <li class="ct-combobox__option" role="option" aria-selected="false">
                  <span class="ct-combobox__option-label">Option C</span>
                </li>
              </ul>
            </div>
          </div>
        `).join('')}
      </div>`;
  },
  play: async ({ canvasElement }) => {
    const comboboxes = canvasElement.querySelectorAll('.ct-combobox');
    expect(comboboxes).toHaveLength(3);

    expect(comboboxes[0]).toHaveClass('ct-combobox--sm');
    expect(comboboxes[2]).toHaveClass('ct-combobox--lg');
  },
};

/**
 * Grouped options with labeled sections.
 */
export const GroupedOptions = {
  parameters: {
    docs: { story: { inline: true, height: 440 } },
  },
  render: () => `
    <div style="min-height: 400px; padding: 24px; max-width: 360px;">
      <div class="ct-field">
        <label class="ct-field__label" for="group-input">Assign to</label>
        <div class="ct-combobox" data-state="open">
          <div class="ct-combobox__input-wrap">
            <input class="ct-combobox__input"
                   id="group-input"
                   type="text"
                   role="combobox"
                   aria-expanded="true"
                   aria-controls="group-listbox"
                   aria-autocomplete="list"
                   placeholder="Search people..." />
            <button class="ct-combobox__trigger"
                    type="button"
                    aria-label="Toggle suggestions"
                    aria-expanded="true"
                    tabindex="-1">
              <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <div class="ct-combobox__listbox" id="group-listbox" role="listbox" aria-label="People">
            <div role="group" class="ct-combobox__group" aria-labelledby="group-eng">
              <div class="ct-combobox__group-label" id="group-eng" role="presentation">Engineering</div>
              <div class="ct-combobox__option" role="option" aria-selected="false">
                <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
                <span class="ct-combobox__option-label">Alice Chen</span>
              </div>
              <div class="ct-combobox__option" role="option" aria-selected="true" data-highlighted>
                <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
                <span class="ct-combobox__option-label">Bob Park</span>
              </div>
            </div>
            <div role="group" class="ct-combobox__group" aria-labelledby="group-des">
              <div class="ct-combobox__group-label" id="group-des" role="presentation">Design</div>
              <div class="ct-combobox__option" role="option" aria-selected="false">
                <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
                <span class="ct-combobox__option-label">Carol Wang</span>
              </div>
              <div class="ct-combobox__option" role="option" aria-selected="false">
                <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
                <span class="ct-combobox__option-label">Dan Lee</span>
              </div>
            </div>
          </div>
          <div class="ct-combobox__status" role="status" aria-live="polite" aria-atomic="true">
            4 results in 2 groups
          </div>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll('[role="group"]');
    expect(groups).toHaveLength(2);

    const labels = canvasElement.querySelectorAll('.ct-combobox__group-label');
    expect(labels[0]).toHaveTextContent('Engineering');
    expect(labels[1]).toHaveTextContent('Design');

    expect(groups[0]).toHaveAttribute('aria-labelledby', 'group-eng');
    expect(groups[1]).toHaveAttribute('aria-labelledby', 'group-des');

    const groupLabels = canvasElement.querySelectorAll('.ct-combobox__group-label');
    for (const label of groupLabels) {
      expect(label).toHaveAttribute('role', 'presentation');
    }

    const selected = canvasElement.querySelector('[aria-selected="true"]');
    expect(selected.textContent).toContain('Bob Park');
  },
};

/**
 * Multi-select variant with chips inside the input area.
 */
export const MultiSelect = {
  parameters: {
    docs: { story: { inline: true, height: 420 } },
  },
  render: () => `
    <div style="min-height: 380px; padding: 24px; max-width: 420px;">
      <div class="ct-field">
        <label class="ct-field__label" for="multi-input">Tags</label>
        <div class="ct-combobox ct-combobox--multi" data-state="open">
          <div class="ct-combobox__input-wrap">
            <span class="ct-chip">
              React
              <button class="ct-chip__remove" type="button" aria-label="Remove React">&#x2715;</button>
            </span>
            <span class="ct-chip">
              TypeScript
              <button class="ct-chip__remove" type="button" aria-label="Remove TypeScript">&#x2715;</button>
            </span>
            <input class="ct-combobox__input"
                   id="multi-input"
                   type="text"
                   role="combobox"
                   aria-expanded="true"
                   aria-controls="multi-listbox"
                   aria-autocomplete="list"
                   placeholder="Add tags..." />
            <button class="ct-combobox__trigger"
                    type="button"
                    aria-label="Toggle suggestions"
                    aria-expanded="true"
                    tabindex="-1">
              <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <ul class="ct-combobox__listbox" id="multi-listbox" role="listbox" aria-label="Tags" aria-multiselectable="true">
            <li class="ct-combobox__option" role="option" aria-selected="true">
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">React</span>
            </li>
            <li class="ct-combobox__option" role="option" aria-selected="true">
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">TypeScript</span>
            </li>
            <li class="ct-combobox__option" role="option" aria-selected="false" data-highlighted>
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">Vue</span>
            </li>
            <li class="ct-combobox__option" role="option" aria-selected="false">
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">Svelte</span>
            </li>
            <li class="ct-combobox__option" role="option" aria-selected="false">
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">Angular</span>
            </li>
          </ul>
          <div class="ct-combobox__status" role="status" aria-live="polite" aria-atomic="true">
            2 of 5 selected, 5 results available
          </div>
        </div>
        <div class="ct-field__hint">Select one or more tags</div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    expect(input).toHaveAttribute('aria-expanded', 'true');

    const listbox = canvasElement.querySelector('[role="listbox"]');
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');

    const chips = canvasElement.querySelectorAll('.ct-chip');
    expect(chips).toHaveLength(2);

    const removeButtons = canvasElement.querySelectorAll('.ct-chip__remove');
    expect(removeButtons).toHaveLength(2);
    expect(removeButtons[0]).toHaveAttribute('aria-label', 'Remove React');
    expect(removeButtons[1]).toHaveAttribute('aria-label', 'Remove TypeScript');

    const selectedOptions = canvasElement.querySelectorAll('[aria-selected="true"]');
    expect(selectedOptions).toHaveLength(2);

    await userEvent.click(input);
    expect(input).toHaveFocus();
  },
};

/**
 * Inline variant for command-palette style UIs.
 */
export const Inline = {
  parameters: {
    docs: { story: { inline: true, height: 400 } },
  },
  render: () => `
    <div style="min-height: 360px; padding: 24px; max-width: 420px;">
      <div class="ct-combobox ct-combobox--inline" data-state="open">
        <div class="ct-combobox__input-wrap">
          <input class="ct-combobox__input"
                 type="text"
                 role="combobox"
                 aria-expanded="true"
                 aria-controls="inline-listbox"
                 aria-autocomplete="list"
                 aria-activedescendant="inline-opt-0"
                 placeholder="Type a command..." />
        </div>
        <ul class="ct-combobox__listbox" id="inline-listbox" role="listbox" aria-label="Commands">
          <li class="ct-combobox__option" id="inline-opt-0" role="option" aria-selected="false" data-highlighted>
            <span class="ct-combobox__option-label">
              <span>New file</span>
              <span class="ct-combobox__option-description">Create a new document</span>
            </span>
          </li>
          <li class="ct-combobox__option" id="inline-opt-1" role="option" aria-selected="false">
            <span class="ct-combobox__option-label">
              <span>Open file</span>
              <span class="ct-combobox__option-description">Open an existing document</span>
            </span>
          </li>
          <li class="ct-combobox__option" id="inline-opt-2" role="option" aria-selected="false">
            <span class="ct-combobox__option-label">
              <span>Save as</span>
              <span class="ct-combobox__option-description">Save with a new name</span>
            </span>
          </li>
          <li class="ct-combobox__option" id="inline-opt-3" role="option" aria-selected="false" aria-disabled="true">
            <span class="ct-combobox__option-label">
              <span>Export PDF</span>
              <span class="ct-combobox__option-description">Requires Pro plan</span>
            </span>
          </li>
        </ul>
        <div class="ct-combobox__status" role="status" aria-live="polite" aria-atomic="true">
          4 commands available
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    const combobox = canvasElement.querySelector('.ct-combobox');

    expect(combobox).toHaveClass('ct-combobox--inline');
    expect(input).toHaveAttribute('aria-activedescendant', 'inline-opt-0');

    const listbox = canvasElement.querySelector('.ct-combobox__listbox');
    expect(listbox).toBeVisible();

    const descriptions = canvasElement.querySelectorAll('.ct-combobox__option-description');
    expect(descriptions).toHaveLength(4);
    expect(descriptions[0]).toHaveTextContent('Create a new document');

    const disabledOption = canvasElement.querySelector('[aria-disabled="true"]');
    expect(disabledOption.textContent).toContain('Export PDF');
  },
};

/**
 * Empty state — no matching results.
 */
export const EmptyState = {
  parameters: {
    docs: { story: { inline: true, height: 280 } },
  },
  render: () => `
    <div style="min-height: 240px; padding: 24px; max-width: 360px;">
      <div class="ct-field">
        <label class="ct-field__label" for="empty-input">City</label>
        <div class="ct-combobox" data-state="open">
          <div class="ct-combobox__input-wrap">
            <input class="ct-combobox__input"
                   id="empty-input"
                   type="text"
                   role="combobox"
                   aria-expanded="true"
                   aria-controls="empty-listbox"
                   aria-autocomplete="list"
                   value="xyzabc"
                   placeholder="Search cities..." />
            <button class="ct-combobox__trigger"
                    type="button"
                    aria-label="Toggle suggestions"
                    aria-expanded="true"
                    tabindex="-1">
              <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <ul class="ct-combobox__listbox"
              id="empty-listbox"
              role="listbox"
              aria-label="Cities">
            <li class="ct-combobox__empty" role="option" aria-disabled="true" aria-selected="false">No cities found matching &ldquo;xyzabc&rdquo;</li>
          </ul>
          <div class="ct-combobox__status" role="status" aria-live="polite" aria-atomic="true">
            No results found
          </div>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    expect(input).toHaveValue('xyzabc');

    const empty = canvasElement.querySelector('.ct-combobox__empty');
    expect(empty).toBeVisible();
    expect(empty).toHaveAttribute('role', 'option');
    expect(empty).toHaveAttribute('aria-disabled', 'true');
    expect(empty.textContent).toContain('No cities found');

    const status = canvasElement.querySelector('[role="status"]');
    expect(status).toHaveTextContent('No results found');
  },
};

/**
 * Loading state with spinner.
 */
export const LoadingState = {
  parameters: {
    docs: { story: { inline: true, height: 280 } },
  },
  render: () => `
    <div style="min-height: 240px; padding: 24px; max-width: 360px;">
      <div class="ct-field">
        <label class="ct-field__label" for="loading-input">User</label>
        <div class="ct-combobox" data-state="open">
          <div class="ct-combobox__input-wrap">
            <input class="ct-combobox__input"
                   id="loading-input"
                   type="text"
                   role="combobox"
                   aria-expanded="true"
                   aria-controls="loading-listbox"
                   aria-autocomplete="list"
                   aria-busy="true"
                   value="john"
                   placeholder="Search users..." />
            <button class="ct-combobox__trigger"
                    type="button"
                    aria-label="Toggle suggestions"
                    aria-expanded="true"
                    tabindex="-1">
              <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <ul class="ct-combobox__listbox"
              id="loading-listbox"
              role="listbox"
              aria-label="Users"
              aria-busy="true">
            <li class="ct-combobox__loading" role="option" aria-disabled="true" aria-selected="false">
              <span class="ct-spinner ct-spinner--sm" aria-hidden="true"></span>
              <span>Searching users...</span>
            </li>
          </ul>
          <div class="ct-combobox__status" role="status" aria-live="polite" aria-atomic="true">
            Loading results...
          </div>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    expect(input).toHaveAttribute('aria-busy', 'true');

    const listbox = canvasElement.querySelector('[role="listbox"]');
    expect(listbox).toHaveAttribute('aria-busy', 'true');

    const spinner = canvasElement.querySelector('.ct-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-hidden', 'true');

    const loadingOption = canvasElement.querySelector('.ct-combobox__loading');
    expect(loadingOption).toHaveAttribute('role', 'option');
    expect(loadingOption).toHaveAttribute('aria-disabled', 'true');
    expect(loadingOption.textContent).toContain('Searching users');
  },
};

/**
 * Error state with validation message.
 */
export const ErrorState = {
  parameters: {
    docs: { story: { inline: true, height: 120 } },
  },
  render: () => `
    <div style="padding: 24px; max-width: 360px;">
      <div class="ct-field ct-field--error">
        <label class="ct-field__label" for="error-input">Category</label>
        <div class="ct-combobox" data-state="closed">
          <div class="ct-combobox__input-wrap">
            <input class="ct-combobox__input"
                   id="error-input"
                   type="text"
                   role="combobox"
                   aria-expanded="false"
                   aria-controls="error-listbox"
                   aria-autocomplete="list"
                   aria-invalid="true"
                   aria-describedby="error-msg"
                   placeholder="Select a category..." />
            <button class="ct-combobox__trigger"
                    type="button"
                    aria-label="Toggle suggestions"
                    aria-expanded="false"
                    tabindex="-1">
              <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <ul class="ct-combobox__listbox" id="error-listbox" role="listbox" aria-label="Categories"></ul>
        </div>
        <div class="ct-field__error" id="error-msg">Please select a category.</div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'error-msg');

    const error = canvasElement.querySelector('.ct-field__error');
    expect(error).toHaveTextContent('Please select a category.');
    expect(error).toHaveAttribute('id', 'error-msg');
  },
};

/**
 * Disabled state.
 */
export const Disabled = {
  render: () => `
    <div style="padding: 24px; max-width: 360px;">
      <div class="ct-field">
        <label class="ct-field__label" for="disabled-input">Region</label>
        <div class="ct-combobox" data-state="closed">
          <div class="ct-combobox__input-wrap">
            <input class="ct-combobox__input"
                   id="disabled-input"
                   type="text"
                   role="combobox"
                   aria-expanded="false"
                   aria-controls="disabled-listbox"
                   aria-autocomplete="list"
                   disabled
                   value="Europe"
                   placeholder="Select a region..." />
            <button class="ct-combobox__trigger"
                    type="button"
                    aria-label="Toggle suggestions"
                    aria-expanded="false"
                    disabled
                    tabindex="-1">
              <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <ul class="ct-combobox__listbox" id="disabled-listbox" role="listbox" aria-label="Regions"></ul>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    expect(input).toBeDisabled();
    expect(input).toHaveValue('Europe');

    const trigger = canvasElement.querySelector('.ct-combobox__trigger');
    expect(trigger).toBeDisabled();
  },
};

/**
 * Listbox positioned above the input (data-side="top").
 */
export const PositionTop = {
  parameters: {
    docs: { story: { inline: true, height: 360 } },
  },
  render: () => `
    <div style="min-height: 320px; padding: 24px; padding-top: 240px; max-width: 360px;">
      <div class="ct-field">
        <label class="ct-field__label" for="top-input">Priority</label>
        <div class="ct-combobox" data-state="open" data-side="top">
          <div class="ct-combobox__input-wrap">
            <input class="ct-combobox__input"
                   id="top-input"
                   type="text"
                   role="combobox"
                   aria-expanded="true"
                   aria-controls="top-listbox"
                   aria-autocomplete="list"
                   placeholder="Select priority..." />
            <button class="ct-combobox__trigger"
                    type="button"
                    aria-label="Toggle suggestions"
                    aria-expanded="true"
                    tabindex="-1">
              <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <ul class="ct-combobox__listbox" id="top-listbox" role="listbox" aria-label="Priorities">
            <li class="ct-combobox__option" role="option" aria-selected="false">
              <span class="ct-combobox__option-label">Critical</span>
            </li>
            <li class="ct-combobox__option" role="option" aria-selected="false" data-highlighted>
              <span class="ct-combobox__option-label">High</span>
            </li>
            <li class="ct-combobox__option" role="option" aria-selected="false">
              <span class="ct-combobox__option-label">Medium</span>
            </li>
            <li class="ct-combobox__option" role="option" aria-selected="false">
              <span class="ct-combobox__option-label">Low</span>
            </li>
          </ul>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const combobox = canvasElement.querySelector('.ct-combobox');
    expect(combobox).toHaveAttribute('data-side', 'top');

    const listbox = canvasElement.querySelector('.ct-combobox__listbox');
    expect(listbox).toBeVisible();
  },
};

/**
 * Integration with ct-field wrapper — labels, hints, and errors.
 */
export const WithFieldWrapper = {
  parameters: {
    docs: { story: { inline: true, height: 440 } },
  },
  render: () => `
    <div style="min-height: 400px; padding: 24px; display: grid; gap: var(--space-8); max-width: 360px;">
      <div class="ct-field">
        <label class="ct-field__label" for="field-ok-input">Status</label>
        <div class="ct-combobox" data-state="open">
          <div class="ct-combobox__input-wrap">
            <input class="ct-combobox__input"
                   id="field-ok-input"
                   type="text"
                   role="combobox"
                   aria-expanded="true"
                   aria-controls="field-ok-listbox"
                   aria-autocomplete="list"
                   aria-describedby="field-ok-hint"
                   placeholder="Filter statuses..." />
            <button class="ct-combobox__trigger"
                    type="button"
                    aria-label="Toggle suggestions"
                    aria-expanded="true"
                    tabindex="-1">
              <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <ul class="ct-combobox__listbox" id="field-ok-listbox" role="listbox" aria-label="Statuses">
            <li class="ct-combobox__option" role="option" aria-selected="false">
              <span class="ct-combobox__option-label">Active</span>
            </li>
            <li class="ct-combobox__option" role="option" aria-selected="true">
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">Pending</span>
            </li>
            <li class="ct-combobox__option" role="option" aria-selected="false">
              <span class="ct-combobox__option-label">Closed</span>
            </li>
          </ul>
        </div>
        <div class="ct-field__hint" id="field-ok-hint">Choose the current status</div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    expect(input).toHaveAttribute('aria-describedby', 'field-ok-hint');

    const label = canvas.getByText('Status');
    expect(label).toHaveAttribute('for', 'field-ok-input');

    const hint = canvasElement.querySelector('.ct-field__hint');
    expect(hint).toHaveTextContent('Choose the current status');
  },
};

/**
 * Keyboard navigation test — verifies focus, ARIA attributes, and interaction patterns.
 */
export const KeyboardNavigation = {
  parameters: {
    docs: { story: { inline: true, height: 400 } },
  },
  render: () => `
    <div style="min-height: 360px; padding: 24px; max-width: 360px;">
      <div class="ct-field">
        <label class="ct-field__label" for="kb-input">Color</label>
        <div class="ct-combobox" data-state="open">
          <div class="ct-combobox__input-wrap">
            <input class="ct-combobox__input"
                   id="kb-input"
                   type="text"
                   role="combobox"
                   aria-expanded="true"
                   aria-controls="kb-listbox"
                   aria-autocomplete="list"
                   aria-activedescendant="kb-opt-1"
                   placeholder="Pick a color..." />
            <button class="ct-combobox__trigger"
                    type="button"
                    aria-label="Toggle suggestions"
                    aria-expanded="true"
                    tabindex="-1">
              <span class="ct-combobox__trigger-icon" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <ul class="ct-combobox__listbox" id="kb-listbox" role="listbox" aria-label="Colors">
            <li class="ct-combobox__option" id="kb-opt-0" role="option" aria-selected="false">
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">Red</span>
            </li>
            <li class="ct-combobox__option" id="kb-opt-1" role="option" aria-selected="false" data-highlighted>
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">Green</span>
            </li>
            <li class="ct-combobox__option" id="kb-opt-2" role="option" aria-selected="false">
              <span class="ct-combobox__option-check" aria-hidden="true">${CHECK_SVG}</span>
              <span class="ct-combobox__option-label">Blue</span>
            </li>
          </ul>
          <div class="ct-combobox__status" role="status" aria-live="polite" aria-atomic="true">
            3 results available
          </div>
        </div>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await userEvent.click(input);
    expect(input).toHaveFocus();

    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-controls', 'kb-listbox');
    expect(input).toHaveAttribute('aria-activedescendant', 'kb-opt-1');

    const highlighted = canvasElement.querySelector('[data-highlighted]');
    expect(highlighted).toHaveAttribute('id', 'kb-opt-1');
    expect(highlighted.textContent).toContain('Green');

    const options = canvasElement.querySelectorAll('[role="option"]');
    for (const opt of options) {
      expect(opt).toHaveAttribute('id');
      expect(opt).toHaveAttribute('aria-selected');
    }

    const listbox = canvasElement.querySelector('[role="listbox"]');
    expect(listbox).toHaveAttribute('id', 'kb-listbox');
    expect(listbox).toHaveAttribute('aria-label', 'Colors');

    await userEvent.type(input, 'bl');
    expect(input).toHaveValue('bl');

    const trigger = canvasElement.querySelector('.ct-combobox__trigger');
    expect(trigger).toHaveAttribute('tabindex', '-1');
  },
};
