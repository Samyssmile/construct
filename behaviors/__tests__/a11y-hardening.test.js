import { afterEach, describe, expect, it } from 'vitest';

import { createComboboxController } from '../combobox.js';
import { createDropdownController } from '../dropdown.js';
import { createModalController } from '../modal.js';
import { createPopoverController } from '../popover.js';
import { createSelectMenuController } from '../select-menu.js';
import { createToggleGroupController } from '../toggle-group.js';

const controllers = [];

afterEach(() => {
  controllers.splice(0).reverse().forEach((controller) => controller.destroy());
  document.body.replaceChildren();
  document.body.removeAttribute('style');
});

function keydown(target, key, init = {}) {
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, ...init }));
}

function pointer(target, type) {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true }));
}

describe('IME composition guards', () => {
  it('does not hijack Enter or close on Escape while composing', () => {
    document.body.innerHTML = `
      <button id="trigger">Open</button>
      <div id="modal"><section id="dialog" aria-label="Compose">
        <div class="ct-combobox"><input id="input"><div id="listbox"><div data-ct-option data-value="apple">Apple</div></div><div id="status"></div></div>
      </section></div>
    `;
    const modal = createModalController({
      trigger: document.querySelector('#trigger'),
      container: document.querySelector('#modal'),
      dialog: document.querySelector('#dialog'),
    });
    const input = document.querySelector('#input');
    const combobox = createComboboxController({
      input,
      listbox: document.querySelector('#listbox'),
      status: document.querySelector('#status'),
      openOnFocus: false,
    });
    controllers.push(modal, combobox);

    modal.open();
    combobox.open();
    input.value = 'あ';

    keydown(input, 'Enter', { isComposing: true });
    expect(combobox.isOpen).toBe(true);
    expect(input.value).toBe('あ');
    expect(combobox.value).toBe(null);

    keydown(input, 'Escape', { isComposing: true });
    expect(combobox.isOpen).toBe(true);
    expect(modal.isOpen).toBe(true);

    keydown(input, 'Escape');
    expect(combobox.isOpen).toBe(false);
    expect(modal.isOpen).toBe(true);
  });
});

describe('dialog backdrop dismissal', () => {
  function setup() {
    document.body.innerHTML = `
      <button id="trigger">Open</button>
      <div id="modal"><section id="dialog" aria-label="Demo"><input id="field"></section></div>
    `;
    const container = document.querySelector('#modal');
    const controller = createModalController({
      trigger: document.querySelector('#trigger'),
      container,
      dialog: document.querySelector('#dialog'),
    });
    controllers.push(controller);
    controller.open();
    return { container, controller };
  }

  it('closes when the pointer goes down and up on the backdrop', () => {
    const { container, controller } = setup();
    pointer(container, 'pointerdown');
    pointer(container, 'pointerup');
    expect(controller.isOpen).toBe(false);
  });

  it('does not close when a drag starts inside the dialog and ends on the backdrop', () => {
    const { container, controller } = setup();
    const field = document.querySelector('#field');
    pointer(field, 'pointerdown');
    pointer(container, 'pointerup');
    container.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(controller.isOpen).toBe(true);
  });

  it('does not close together with a popup dismissed by the same gesture', () => {
    document.body.innerHTML = `
      <div id="modal"><section id="dialog" aria-label="Demo">
        <button id="menu-trigger">Menu</button>
        <div id="menu"><div role="menuitem">Item</div></div>
      </section></div>
    `;
    const container = document.querySelector('#modal');
    const modal = createModalController({
      container,
      dialog: document.querySelector('#dialog'),
    });
    const dropdown = createDropdownController({
      trigger: document.querySelector('#menu-trigger'),
      menu: document.querySelector('#menu'),
    });
    controllers.push(modal, dropdown);

    modal.open();
    dropdown.open();
    expect(dropdown.isOpen).toBe(true);

    pointer(container, 'pointerdown');
    pointer(container, 'pointerup');
    expect(dropdown.isOpen).toBe(false);
    expect(modal.isOpen).toBe(true);

    pointer(container, 'pointerdown');
    pointer(container, 'pointerup');
    expect(modal.isOpen).toBe(false);
  });
});

describe('dialog lifecycle focus and inert', () => {
  it('restores focus to the trigger when destroyed while open', () => {
    document.body.innerHTML = `
      <button id="trigger">Open</button>
      <div id="modal"><section id="dialog" aria-label="Demo"><button id="inside">Inside</button></section></div>
    `;
    const trigger = document.querySelector('#trigger');
    const controller = createModalController({
      trigger,
      container: document.querySelector('#modal'),
      dialog: document.querySelector('#dialog'),
    });

    trigger.click();
    expect(document.activeElement).toBe(document.querySelector('#inside'));

    controller.destroy();
    expect(document.activeElement).toBe(trigger);
  });

  it('inerts background siblings while open when inertBackground is set', () => {
    document.body.innerHTML = `
      <main id="app"><button>Background</button></main>
      <div id="modal"><section id="dialog" aria-label="Demo"><button>Inside</button></section></div>
    `;
    const app = document.querySelector('#app');
    const controller = createModalController({
      container: document.querySelector('#modal'),
      dialog: document.querySelector('#dialog'),
      inertBackground: true,
    });
    controllers.push(controller);

    controller.open();
    expect(app.inert).toBe(true);

    controller.close();
    expect(app.inert).toBe(false);
  });
});

describe('select menu Tab commit', () => {
  it('commits the visually focused option before Tab moves focus on', () => {
    document.body.innerHTML = `
      <button id="sm-trigger">Choose</button>
      <div id="sm-listbox"><div data-ct-option data-value="a">Alpha</div><div data-ct-option data-value="b">Beta</div></div>
    `;
    const trigger = document.querySelector('#sm-trigger');
    const controller = createSelectMenuController({
      trigger,
      listbox: document.querySelector('#sm-listbox'),
      value: 'a',
    });
    controllers.push(controller);

    keydown(trigger, 'ArrowDown');
    expect(controller.isOpen).toBe(true);
    keydown(trigger, 'ArrowDown');
    keydown(trigger, 'Tab');

    expect(controller.isOpen).toBe(false);
    expect(controller.value).toBe('b');
  });
});

describe('toggle group radio semantics', () => {
  it('keeps radio roles, syncs aria-checked, and selects on arrow move', () => {
    document.body.innerHTML = `
      <div id="group" role="radiogroup" aria-label="View">
        <button data-ct-toggle role="radio" data-value="list" aria-checked="true">List</button>
        <button data-ct-toggle role="radio" data-value="grid">Grid</button>
      </div>
    `;
    const [list, grid] = document.querySelectorAll('[data-ct-toggle]');
    const controller = createToggleGroupController({ root: document.querySelector('#group') });
    controllers.push(controller);

    expect(list.getAttribute('role')).toBe('radio');
    expect(list.getAttribute('aria-checked')).toBe('true');
    expect(list.hasAttribute('aria-pressed')).toBe(false);
    expect(controller.value).toBe('list');

    list.focus();
    keydown(list, 'ArrowRight');
    expect(grid.getAttribute('aria-checked')).toBe('true');
    expect(list.getAttribute('aria-checked')).toBe('false');
    expect(controller.value).toBe('grid');
  });

  it('moves the roving tabindex off an item disabled after init', () => {
    document.body.innerHTML = `
      <div id="group" aria-label="Formatting">
        <button data-ct-toggle data-value="bold" aria-pressed="true">Bold</button>
        <button data-ct-toggle data-value="italic">Italic</button>
      </div>
    `;
    const [bold, italic] = document.querySelectorAll('[data-ct-toggle]');
    const controller = createToggleGroupController({ root: document.querySelector('#group') });
    controllers.push(controller);
    expect(bold.getAttribute('tabindex')).toBe('0');

    bold.disabled = true;
    controller.setValue('italic');
    expect(italic.getAttribute('tabindex')).toBe('0');
  });
});

describe('dropdown printable-character open', () => {
  it('opens from the trigger and highlights the matching item', () => {
    document.body.innerHTML = `
      <button id="dd-trigger">Actions</button>
      <div id="dd-menu"><div role="menuitem">Edit</div><div role="menuitem" id="dup">Duplicate</div></div>
    `;
    const trigger = document.querySelector('#dd-trigger');
    const controller = createDropdownController({
      trigger,
      menu: document.querySelector('#dd-menu'),
    });
    controllers.push(controller);

    keydown(trigger, 'd');
    expect(controller.isOpen).toBe(true);
    expect(document.activeElement).toBe(document.querySelector('#dup'));
  });
});

describe('combobox open variants', () => {
  function setup() {
    document.body.innerHTML = `
      <div class="ct-combobox"><input id="cb-input"><div id="cb-listbox"><div data-ct-option data-value="a">Alpha</div><div data-ct-option data-value="b">Beta</div></div><div id="cb-status"></div></div>
    `;
    const input = document.querySelector('#cb-input');
    const controller = createComboboxController({
      input,
      listbox: document.querySelector('#cb-listbox'),
      status: document.querySelector('#cb-status'),
      openOnFocus: false,
    });
    controllers.push(controller);
    return { input, controller };
  }

  it('opens with the last option active on ArrowUp', () => {
    const { input, controller } = setup();
    keydown(input, 'ArrowUp');
    expect(controller.isOpen).toBe(true);
    expect(input.getAttribute('aria-activedescendant')).toBe(controller.options[1].id);
  });

  it('opens without moving visual focus on Alt+ArrowDown and closes on Alt+ArrowUp', () => {
    const { input, controller } = setup();
    keydown(input, 'ArrowDown', { altKey: true });
    expect(controller.isOpen).toBe(true);
    expect(input.getAttribute('aria-activedescendant')).toBe(null);

    keydown(input, 'ArrowUp', { altKey: true });
    expect(controller.isOpen).toBe(false);
  });
});

describe('popover trigger focus entry', () => {
  it('honors initialFocus when the trigger opens the popover', () => {
    document.body.innerHTML = `
      <div class="ct-popover">
        <button id="pop-trigger">Filters</button>
        <div id="pop-content"><input id="pop-input"></div>
      </div>
    `;
    const trigger = document.querySelector('#pop-trigger');
    const controller = createPopoverController({
      trigger,
      popover: document.querySelector('#pop-content'),
      initialFocus: '#pop-input',
    });
    controllers.push(controller);

    trigger.click();
    expect(controller.isOpen).toBe(true);
    expect(document.activeElement).toBe(document.querySelector('#pop-input'));
  });
});
