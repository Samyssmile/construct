import { afterEach, describe, expect, it } from 'vitest';

import declarations from '../index.d.ts?raw';
import * as behaviorExports from '../index.js';
import { createComboboxController } from '../combobox.js';
import { createDropdownController } from '../dropdown.js';
import { createSelectMenuController } from '../select-menu.js';
import { createTabsController } from '../tabs.js';

const controllers = [];

afterEach(() => {
  controllers.splice(0).reverse().forEach((controller) => controller.destroy());
  document.body.replaceChildren();
  document.querySelector('#visibility-test')?.remove();
});

describe('runtime and declaration contracts', () => {
  it('generates collision-free relationship IDs', () => {
    const isolatedDocument = document.implementation.createHTMLDocument('isolated');
    isolatedDocument.body.innerHTML = `
      <div id="ct-select-listbox-1"></div>
      <button id="trigger">Select</button>
      <div data-listbox><div data-ct-option data-value="one">One</div></div>
    `;
    const controller = createSelectMenuController({
      listbox: isolatedDocument.querySelector('[data-listbox]'),
      trigger: isolatedDocument.querySelector('#trigger'),
    });

    expect(controller.listbox.id).toBe('ct-select-listbox-2');
    controller.destroy();
  });

  it('rejects composite children outside their owning DOM container', () => {
    document.body.innerHTML = `
      <button id="trigger">Menu</button><div id="menu"><button role="menuitem">Inside</button></div>
      <button id="outside" role="menuitem">Outside</button>
    `;

    expect(() => createDropdownController({
      items: [document.querySelector('#outside')],
      menu: document.querySelector('#menu'),
      trigger: document.querySelector('#trigger'),
    })).toThrowError(/descendant/);
  });

  it('prevents native activation for disabled link-based composite items', () => {
    document.body.innerHTML = `
      <div id="tabs"><a href="#changed" data-ct-tab>One</a><a href="#changed" data-ct-tab aria-disabled="true">Two</a></div>
      <section data-ct-tab-panel>One panel</section><section data-ct-tab-panel>Two panel</section>
    `;
    const controller = createTabsController({ tablist: document.querySelector('#tabs') });
    controllers.push(controller);
    const disabledTab = controller.tabs[1];
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });

    disabledTab.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(controller.selectedIndex).toBe(0);
    expect(location.hash).not.toBe('#changed');
  });

  it('applies one readonly interaction guard to every combobox UI opening path', () => {
    document.body.innerHTML = `
      <input id="input" readonly><button id="toggle">Toggle</button>
      <div id="listbox"><div data-ct-option data-value="one">One</div></div>
    `;
    const input = document.querySelector('#input');
    const toggle = document.querySelector('#toggle');
    const controller = createComboboxController({
      input,
      listbox: document.querySelector('#listbox'),
      open: true,
      toggleButton: toggle,
    });
    controllers.push(controller);

    expect(controller.isOpen).toBe(false);
    expect(controller.open()).toBe(false);
    toggle.click();
    expect(controller.isOpen).toBe(false);
    input.dispatchEvent(new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'ArrowDown',
    }));
    expect(controller.isOpen).toBe(false);
  });

  it('supports only autocomplete modes implemented by the runtime and declarations', () => {
    document.body.innerHTML = '<input id="input"><div id="listbox"><div data-ct-option>One</div></div>';

    expect(() => createComboboxController({
      autocomplete: 'both',
      input: document.querySelector('#input'),
      listbox: document.querySelector('#listbox'),
    })).toThrowError(/list, none/);

    expect(declarations).toContain("autocomplete?: 'list' | 'none'");
    expect(declarations).toContain('SingleToggleGroupControllerOptions');
    expect(declarations).toContain('MultipleToggleGroupControllerOptions');
    expect(declarations).not.toContain("autocomplete?: 'list' | 'both'");
    expect(
      Object.keys(behaviorExports).every((name) => declarations.includes(`function ${name}(`)),
    ).toBe(true);

    const singleOptions = declarations.match(
      /interface SingleToggleGroupControllerOptions[\s\S]*?\n}/,
    )?.[0];
    const multipleOptions = declarations.match(
      /interface MultipleToggleGroupControllerOptions[\s\S]*?\n}/,
    )?.[0];
    expect(singleOptions).not.toContain('Iterable');
    expect(multipleOptions).toContain('Iterable<string | number>');
  });

  it('skips options hidden through computed CSS visibility', () => {
    document.head.insertAdjacentHTML('beforeend', '<style id="visibility-test">.contract-hidden { visibility: hidden; }</style>');
    document.body.innerHTML = `
      <input id="input"><div id="listbox">
        <div class="contract-hidden" data-ct-option data-value="hidden">Hidden</div>
        <div data-ct-option data-value="visible">Visible</div>
      </div>
    `;
    const input = document.querySelector('#input');
    const controller = createComboboxController({
      input,
      listbox: document.querySelector('#listbox'),
      openOnFocus: false,
    });
    controllers.push(controller);

    controller.open();
    expect(input.getAttribute('aria-activedescendant')).toBe(controller.options[1].id);
  });
});
