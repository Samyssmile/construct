import { afterEach, describe, expect, it } from 'vitest';

import { createDrawerController } from '../drawer.js';
import { createDropdownController } from '../dropdown.js';
import { createModalController } from '../modal.js';
import { createPopoverController } from '../popover.js';
import { createTooltipController } from '../tooltip.js';

const controllers = [];

afterEach(() => {
  controllers.splice(0).reverse().forEach((controller) => controller.destroy());
  document.body.replaceChildren();
  document.body.removeAttribute('style');
});

function keydown(target, key, init = {}) {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
    ...init,
  });
  target.dispatchEvent(event);
  return event;
}

describe('overlay coordination', () => {
  it('consumes Escape exactly once regardless of creation and opening order', () => {
    document.body.innerHTML = `
      <button id="one-trigger">One</button><div id="one"><button>One content</button></div>
      <button id="two-trigger">Two</button><div id="two"><button>Two content</button></div>
    `;
    const one = createModalController({
      container: document.querySelector('#one'),
      trigger: document.querySelector('#one-trigger'),
    });
    const two = createDrawerController({
      container: document.querySelector('#two'),
      trigger: document.querySelector('#two-trigger'),
    });
    controllers.push(one, two);

    two.open();
    one.open();
    keydown(document.activeElement, 'Escape');

    expect(one.isOpen).toBe(false);
    expect(two.isOpen).toBe(true);

    keydown(document.activeElement, 'Escape');
    expect(two.isOpen).toBe(false);
  });

  it('keeps a cancelled top-layer close from reaching the layer below', () => {
    document.body.innerHTML = `
      <button id="one-trigger">One</button><div id="one"><button>One content</button></div>
      <button id="two-trigger">Two</button><div id="two"><button>Two content</button></div>
    `;
    const one = createModalController({
      container: document.querySelector('#one'),
      trigger: document.querySelector('#one-trigger'),
    });
    const two = createDrawerController({
      container: document.querySelector('#two'),
      trigger: document.querySelector('#two-trigger'),
    });
    controllers.push(one, two);
    one.open();
    two.open();
    two.container.addEventListener('ct:beforeclose', (event) => event.preventDefault(), { once: true });

    keydown(document.activeElement, 'Escape');

    expect(two.isOpen).toBe(true);
    expect(one.isOpen).toBe(true);
  });

  it('consumes an outside pointer event only for the top popup', () => {
    document.body.innerHTML = `
      <button id="outside">Outside</button>
      <button id="one-trigger">One</button><div id="one"><button>One content</button></div>
      <button id="two-trigger">Two</button><div id="two"><button>Two content</button></div>
    `;
    const one = createPopoverController({
      popover: document.querySelector('#one'),
      trigger: document.querySelector('#one-trigger'),
    });
    const two = createPopoverController({
      popover: document.querySelector('#two'),
      trigger: document.querySelector('#two-trigger'),
    });
    controllers.push(one, two);

    two.open();
    one.open();
    document.querySelector('#outside').dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      pointerType: 'mouse',
    }));

    expect(one.isOpen).toBe(false);
    expect(two.isOpen).toBe(true);
  });

  it('keeps the active modal focus scope while a dropdown is open', () => {
    document.body.innerHTML = `
      <button id="modal-trigger">Open modal</button>
      <div id="modal"><section id="dialog">
        <button id="first">First</button>
        <button id="dropdown-trigger">Menu</button>
        <div id="menu"><button id="item" role="menuitem">Item</button></div>
      </section></div>
      <button id="outside">Outside</button>
    `;
    const modal = createModalController({
      container: document.querySelector('#modal'),
      dialog: document.querySelector('#dialog'),
      trigger: document.querySelector('#modal-trigger'),
    });
    const dropdown = createDropdownController({
      menu: document.querySelector('#menu'),
      trigger: document.querySelector('#dropdown-trigger'),
    });
    controllers.push(modal, dropdown);

    modal.open();
    dropdown.open();
    document.querySelector('#outside').focus();

    expect(document.activeElement).toBe(document.querySelector('#first'));
    expect(modal.isOpen).toBe(true);
    expect(dropdown.isOpen).toBe(false);

    dropdown.open();
    const tabEvent = keydown(document.querySelector('#item'), 'Tab');
    expect(tabEvent.defaultPrevented).toBe(false);
    expect(dropdown.isOpen).toBe(false);
    expect(document.activeElement).toBe(document.querySelector('#dropdown-trigger'));
  });

  it('keeps trapping modal Tab while a tooltip is the top dismissible layer', () => {
    document.body.innerHTML = `
      <button id="modal-trigger">Open modal</button>
      <div id="modal"><section id="dialog">
        <button id="first">First</button>
        <span><button id="last">Last</button><span id="tip">Help</span></span>
      </section></div>
    `;
    const modal = createModalController({
      container: document.querySelector('#modal'),
      dialog: document.querySelector('#dialog'),
      trigger: document.querySelector('#modal-trigger'),
    });
    const tooltip = createTooltipController({
      tooltip: document.querySelector('#tip'),
      trigger: document.querySelector('#last'),
    });
    controllers.push(modal, tooltip);

    modal.open();
    tooltip.open();
    document.querySelector('#last').focus();
    const event = keydown(document.querySelector('#last'), 'Tab');

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(document.querySelector('#first'));
    expect(tooltip.isOpen).toBe(true);
  });

  it('treats a portalled popover as part of its owning modal focus scope', () => {
    document.body.innerHTML = `
      <button id="modal-trigger">Open modal</button>
      <div id="modal"><section id="dialog">
        <button id="first">First</button><button id="popover-trigger">Open popover</button>
      </section></div>
      <section id="popover"><button id="portalled-focus">Portalled content</button></section>
    `;
    const modal = createModalController({
      container: document.querySelector('#modal'),
      dialog: document.querySelector('#dialog'),
      trigger: document.querySelector('#modal-trigger'),
    });
    const popover = createPopoverController({
      focusOnOpen: true,
      initialFocus: '#portalled-focus',
      popover: document.querySelector('#popover'),
      trigger: document.querySelector('#popover-trigger'),
    });
    controllers.push(modal, popover);

    modal.open();
    popover.open();

    expect(document.activeElement).toBe(document.querySelector('#portalled-focus'));
    const event = keydown(document.activeElement, 'Tab');
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(document.querySelector('#first'));
  });

  it('closes owned non-modal layers before a programmatic modal close', () => {
    document.body.innerHTML = `
      <button id="modal-trigger">Open modal</button>
      <div id="modal"><section id="dialog">
        <button id="popover-trigger">Open popover</button>
        <section id="popover"><button>Inside</button></section>
      </section></div>
    `;
    const modal = createModalController({
      container: document.querySelector('#modal'),
      dialog: document.querySelector('#dialog'),
      trigger: document.querySelector('#modal-trigger'),
    });
    const popover = createPopoverController({
      popover: document.querySelector('#popover'),
      trigger: document.querySelector('#popover-trigger'),
    });
    controllers.push(modal, popover);
    modal.open();
    popover.open();

    expect(modal.close()).toBe(true);
    expect(popover.isOpen).toBe(false);
    expect(modal.isOpen).toBe(false);
  });

  it('keeps a modal open if an owned layer cancels its close transaction', () => {
    document.body.innerHTML = `
      <button id="modal-trigger">Open modal</button>
      <div id="modal"><section id="dialog">
        <button id="popover-trigger">Open popover</button>
        <section id="popover"><button>Inside</button></section>
      </section></div>
    `;
    const modal = createModalController({
      container: document.querySelector('#modal'),
      dialog: document.querySelector('#dialog'),
      trigger: document.querySelector('#modal-trigger'),
    });
    const popover = createPopoverController({
      popover: document.querySelector('#popover'),
      trigger: document.querySelector('#popover-trigger'),
    });
    controllers.push(modal, popover);
    modal.open();
    popover.open();
    popover.popover.addEventListener('ct:beforeclose', (event) => event.preventDefault());

    expect(modal.close()).toBe(false);
    expect(popover.isOpen).toBe(true);
    expect(modal.isOpen).toBe(true);
  });

  it('destroys owned layers and releases every scroll lock with their modal owner', () => {
    document.body.style.overflow = 'scroll';
    document.body.innerHTML = `
      <button id="outer-trigger">Outer</button>
      <div id="outer"><section id="outer-dialog">
        <button id="inner-trigger">Inner</button>
        <div id="inner"><section id="inner-dialog"><button>Inside</button></section></div>
      </section></div>
    `;
    const outer = createModalController({
      container: document.querySelector('#outer'),
      dialog: document.querySelector('#outer-dialog'),
      trigger: document.querySelector('#outer-trigger'),
    });
    const inner = createDrawerController({
      container: document.querySelector('#inner'),
      dialog: document.querySelector('#inner-dialog'),
      trigger: document.querySelector('#inner-trigger'),
    });
    outer.open();
    inner.open();

    outer.destroy();

    expect(outer.isOpen).toBe(false);
    expect(inner.isOpen).toBe(false);
    expect(() => inner.open()).toThrowError(/destroyed/);
    expect(document.body.style.overflow).toBe('scroll');
  });
});
