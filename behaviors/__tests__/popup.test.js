import { afterEach, describe, expect, it } from 'vitest';

import { createComboboxController } from '../combobox.js';
import { createDropdownController } from '../dropdown.js';
import { createSelectMenuController } from '../select-menu.js';

const controllers = [];

afterEach(() => {
  controllers.splice(0).reverse().forEach((controller) => controller.destroy());
  document.body.replaceChildren();
});

function keydown(target, key) {
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key }));
}

describe('dropdown controller', () => {
  it('opens from the keyboard, supports typeahead, and selects an item', () => {
    document.body.innerHTML = `
      <div class="ct-dropdown"><button id="trigger">Actions</button><div id="menu"><button role="menuitem" data-value="edit">Edit</button><button role="menuitem" data-value="share">Share</button></div></div>
    `;
    let selected;
    const controller = createDropdownController({
      trigger: document.querySelector('#trigger'),
      menu: document.querySelector('#menu'),
      onSelect: (detail) => { selected = detail.value; },
    });
    controllers.push(controller);

    keydown(controller.trigger, 'ArrowDown');
    expect(controller.isOpen).toBe(true);
    expect(document.activeElement).toBe(controller.items[0]);

    keydown(controller.items[0], 's');
    expect(document.activeElement).toBe(controller.items[1]);
    keydown(controller.items[1], 'Enter');
    expect(selected).toBe('share');
    expect(controller.isOpen).toBe(false);
    expect(document.activeElement).toBe(controller.trigger);
  });

  it('manages checkbox items without closing by default', () => {
    document.body.innerHTML = `
      <div class="ct-dropdown"><button id="trigger">Filters</button><div id="menu"><button role="menuitemcheckbox" aria-checked="false">Archived</button></div></div>
    `;
    const controller = createDropdownController({
      trigger: document.querySelector('#trigger'),
      menu: document.querySelector('#menu'),
    });
    controllers.push(controller);
    controller.open();
    controller.items[0].click();
    expect(controller.items[0].getAttribute('aria-checked')).toBe('true');
    expect(controller.isOpen).toBe(true);
  });

  it('closes on Tab and focus outside without cancelling native focus navigation', () => {
    document.body.innerHTML = `
      <button id="trigger">Actions</button><div id="menu"><button role="menuitem">Edit</button></div>
      <button id="outside">Outside</button>
    `;
    const controller = createDropdownController({
      menu: document.querySelector('#menu'),
      trigger: document.querySelector('#trigger'),
    });
    controllers.push(controller);

    controller.open();
    const tab = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' });
    controller.items[0].dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(false);
    expect(controller.isOpen).toBe(false);

    controller.open();
    document.querySelector('#outside').focus();
    expect(controller.isOpen).toBe(false);
    expect(document.activeElement).toBe(document.querySelector('#outside'));
  });
});

describe('select menu controller', () => {
  it('uses virtual focus and commits a single selected value', () => {
    document.body.innerHTML = `
      <div class="ct-select-menu"><button id="trigger"><span id="value">Apple</span></button><div id="listbox"><div data-ct-option data-value="apple" aria-selected="true">Apple</div><div data-ct-option data-value="banana">Banana</div></div></div>
    `;
    const controller = createSelectMenuController({
      trigger: document.querySelector('#trigger'),
      listbox: document.querySelector('#listbox'),
      valueElement: document.querySelector('#value'),
    });
    controllers.push(controller);

    controller.trigger.click();
    expect(controller.isOpen).toBe(true);
    expect(controller.trigger.getAttribute('aria-activedescendant')).toBe(controller.options[0].id);
    keydown(controller.trigger, 'ArrowDown');
    keydown(controller.trigger, 'Enter');

    expect(controller.value).toBe('banana');
    expect(document.querySelector('#value').textContent).toBe('Banana');
    expect(controller.options[1].getAttribute('aria-selected')).toBe('true');
    expect(controller.isOpen).toBe(false);

    controller.setValue('apple');
    expect(controller.value).toBe('apple');
  });

  it('closes on Tab without preventing the browser focus move', () => {
    document.body.innerHTML = `
      <button id="trigger">Select</button><div id="listbox"><div data-ct-option>One</div></div>
    `;
    const controller = createSelectMenuController({
      listbox: document.querySelector('#listbox'),
      trigger: document.querySelector('#trigger'),
    });
    controllers.push(controller);
    controller.open();
    const tab = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' });

    controller.trigger.dispatchEvent(tab);

    expect(tab.defaultPrevented).toBe(false);
    expect(controller.isOpen).toBe(false);
  });
});

describe('combobox controller', () => {
  it('filters, announces results, navigates, and selects with active descendant', () => {
    document.body.innerHTML = `
      <div class="ct-combobox"><input id="input"><button id="toggle">Toggle</button><div id="listbox"><div data-ct-option data-value="apple">Apple</div><div data-ct-option data-value="apricot">Apricot</div><div data-ct-option data-value="banana">Banana</div></div><div id="status"></div></div>
    `;
    const input = document.querySelector('#input');
    const controller = createComboboxController({
      input,
      listbox: document.querySelector('#listbox'),
      toggleButton: document.querySelector('#toggle'),
      status: document.querySelector('#status'),
      filter: true,
      openOnFocus: false,
    });
    controllers.push(controller);

    input.value = 'ap';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(controller.isOpen).toBe(true);
    expect(controller.options[2].hidden).toBe(true);
    expect(document.querySelector('#status').textContent).toBe('2 results available');
    expect(input.getAttribute('aria-activedescendant')).toBe(controller.options[0].id);

    keydown(input, 'ArrowDown');
    expect(input.getAttribute('aria-activedescendant')).toBe(controller.options[1].id);
    keydown(input, 'Enter');
    expect(controller.value).toBe('apricot');
    expect(input.value).toBe('Apricot');
    expect(controller.isOpen).toBe(false);
  });
});
