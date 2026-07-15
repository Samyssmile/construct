import { afterEach, describe, expect, it } from 'vitest';

import { createComboboxController } from '../combobox.js';
import { createDropdownController } from '../dropdown.js';
import { createModalController } from '../modal.js';
import { createPopoverController } from '../popover.js';
import { createSelectMenuController } from '../select-menu.js';
import { createTabsController } from '../tabs.js';
import { createToggleGroupController } from '../toggle-group.js';
import { createTooltipController } from '../tooltip.js';

const controllers = [];

afterEach(() => {
  controllers.splice(0).reverse().forEach((controller) => controller.destroy());
  document.body.replaceChildren();
  document.body.removeAttribute('style');
});

describe('controller lifecycle transactions', () => {
  it('does not leak dialog state or scroll lock when destroyed from beforeopen', () => {
    document.body.style.overflow = 'scroll';
    document.body.innerHTML = '<button id="trigger">Open</button><div id="modal"><button>Inside</button></div>';
    const container = document.querySelector('#modal');
    let controller;
    controller = createModalController({
      container,
      trigger: document.querySelector('#trigger'),
    });
    container.addEventListener('ct:beforeopen', () => controller.destroy(), { once: true });

    expect(() => controller.open()).toThrowError(/destroyed/);
    expect(controller.isOpen).toBe(false);
    expect(document.body.style.overflow).toBe('scroll');
    expect(container.hasAttribute('hidden')).toBe(false);
    expect(container.hasAttribute('data-state')).toBe(false);
  });

  it('cleans a popup destroyed from onOpen without leaving pending focus or stack state', () => {
    document.body.innerHTML = `
      <button id="trigger">Open</button><section id="popover"><button id="inside">Inside</button></section>
      <button id="other-trigger">Other</button><section id="other"><button>Other content</button></section>
    `;
    let controller;
    controller = createPopoverController({
      focusOnOpen: true,
      onOpen() {
        controller.destroy();
      },
      popover: document.querySelector('#popover'),
      trigger: document.querySelector('#trigger'),
    });

    expect(() => controller.open()).toThrowError(/destroyed/);
    expect(controller.isOpen).toBe(false);
    expect(document.querySelector('#popover').hasAttribute('hidden')).toBe(false);

    const other = createPopoverController({
      popover: document.querySelector('#other'),
      trigger: document.querySelector('#other-trigger'),
    });
    controllers.push(other);
    expect(other.open()).toBe(true);
    expect(other.close()).toBe(true);
  });

  it('leaves popup focus and state consistent when onClose throws', () => {
    document.body.innerHTML = '<button id="trigger">Open</button><section id="popover"><input id="inside"></section>';
    const trigger = document.querySelector('#trigger');
    const controller = createPopoverController({
      focusOnOpen: true,
      initialFocus: '#inside',
      onClose() {
        throw new Error('Close callback failed');
      },
      popover: document.querySelector('#popover'),
      trigger,
    });
    controllers.push(controller);

    controller.open();
    expect(() => controller.close()).toThrowError('Close callback failed');
    expect(controller.isOpen).toBe(false);
    expect(controller.popover.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('resets popover pending focus after an opening focus resolver throws', () => {
    document.body.innerHTML = '<button id="trigger">Open</button><section id="popover"><button id="inside">Inside</button></section>';
    const inside = document.querySelector('#inside');
    let fail = true;
    const controller = createPopoverController({
      focusOnOpen: true,
      initialFocus() {
        if (fail) throw new Error('Focus resolver failed');
        return inside;
      },
      popover: document.querySelector('#popover'),
      trigger: document.querySelector('#trigger'),
    });
    controllers.push(controller);

    expect(() => controller.open()).toThrowError('Focus resolver failed');
    expect(controller.isOpen).toBe(false);
    expect(controller.popover.hidden).toBe(true);

    fail = false;
    expect(controller.open()).toBe(true);
    expect(document.activeElement).toBe(inside);
  });

  it('fully closes and releases a tooltip when its close callback throws', () => {
    document.body.innerHTML = '<button id="trigger">Info</button><div id="tooltip">Help</div>';
    const controller = createTooltipController({
      onClose() {
        throw new Error('Tooltip close failed');
      },
      tooltip: document.querySelector('#tooltip'),
      trigger: document.querySelector('#trigger'),
    });
    controllers.push(controller);

    controller.open();
    expect(() => controller.close()).toThrowError('Tooltip close failed');
    expect(controller.isOpen).toBe(false);
    expect(controller.tooltip.hidden).toBe(true);
  });

  it('leaves modal focus, state, and scroll lock consistent when onClose throws', () => {
    document.body.style.overflow = 'scroll';
    document.body.innerHTML = '<button id="trigger">Open</button><div id="modal"><button>Inside</button></div>';
    const trigger = document.querySelector('#trigger');
    const controller = createModalController({
      container: document.querySelector('#modal'),
      onClose() {
        throw new Error('Close callback failed');
      },
      trigger,
    });
    controllers.push(controller);

    controller.open();
    expect(() => controller.close()).toThrowError('Close callback failed');
    expect(controller.isOpen).toBe(false);
    expect(controller.container.hidden).toBe(true);
    expect(document.body.style.overflow).toBe('scroll');
    expect(document.activeElement).toBe(trigger);
  });

  it('rejects mutations after destroy across selection controllers', () => {
    document.body.innerHTML = `
      <button id="dropdown-trigger">Menu</button><div id="menu"><button role="menuitem">Item</button></div>
      <button id="select-trigger">Select</button><div id="listbox"><div data-ct-option data-value="one">One</div></div>
      <input id="input"><div id="combo-listbox"><div data-ct-option data-value="one">One</div></div>
      <div id="tabs"><button data-ct-tab>Tab</button></div><section id="panel" data-ct-tab-panel>Panel</section>
      <div id="toggles"><button data-ct-toggle data-value="one">One</button></div>
    `;
    const dropdown = createDropdownController({
      menu: document.querySelector('#menu'),
      trigger: document.querySelector('#dropdown-trigger'),
    });
    const select = createSelectMenuController({
      listbox: document.querySelector('#listbox'),
      trigger: document.querySelector('#select-trigger'),
    });
    const combobox = createComboboxController({
      input: document.querySelector('#input'),
      listbox: document.querySelector('#combo-listbox'),
      openOnFocus: false,
    });
    const tabs = createTabsController({
      panels: [document.querySelector('#panel')],
      tablist: document.querySelector('#tabs'),
    });
    const toggles = createToggleGroupController({ root: document.querySelector('#toggles') });

    [dropdown, select, combobox, tabs, toggles].forEach((controller) => controller.destroy());

    expect(() => dropdown.select(0)).toThrowError(/destroyed/);
    expect(() => select.setValue('one')).toThrowError(/destroyed/);
    expect(() => combobox.refresh()).toThrowError(/destroyed/);
    expect(() => tabs.select(0)).toThrowError(/destroyed/);
    expect(() => toggles.setValue('one')).toThrowError(/destroyed/);
  });

  it('stops a selection transaction when destroyed from its cancellable event', () => {
    document.body.innerHTML = `
      <div id="tabs"><button data-ct-tab aria-selected="true">One</button><button data-ct-tab>Two</button></div>
      <section data-ct-tab-panel>One panel</section><section data-ct-tab-panel>Two panel</section>
    `;
    const tablist = document.querySelector('#tabs');
    let controller;
    controller = createTabsController({ tablist });
    tablist.addEventListener('ct:beforeselect', () => controller.destroy(), { once: true });

    expect(() => controller.select(1)).toThrowError(/destroyed/);
    expect(controller.selectedIndex).toBe(0);
    expect(controller.tabs.every((tab) => !tab.hasAttribute('tabindex'))).toBe(true);
  });

  it('prevents reentrant transitions without corrupting the outer operation', () => {
    document.body.innerHTML = '<button id="trigger">Open</button><div id="tooltip">Help</div>';
    let nestedResult;
    let controller;
    controller = createTooltipController({
      onOpen() {
        nestedResult = controller.close('reentrant');
      },
      tooltip: document.querySelector('#tooltip'),
      trigger: document.querySelector('#trigger'),
    });
    controllers.push(controller);

    expect(controller.open()).toBe(true);
    expect(nestedResult).toBe(false);
    expect(controller.isOpen).toBe(true);
    expect(controller.close()).toBe(true);
  });
});
