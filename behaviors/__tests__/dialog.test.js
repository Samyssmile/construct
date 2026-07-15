import { afterEach, describe, expect, it } from 'vitest';

import { createDrawerController } from '../drawer.js';
import { createModalController } from '../modal.js';

const controllers = [];

afterEach(() => {
  controllers.splice(0).reverse().forEach((controller) => controller.destroy());
  document.body.replaceChildren();
  document.body.removeAttribute('style');
});

function keydown(target, key, init = {}) {
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, ...init }));
}

describe('modal and drawer controllers', () => {
  it('opens, traps focus, dismisses with Escape, and restores focus', () => {
    document.body.innerHTML = `
      <button id="trigger">Open</button>
      <div id="modal"><section id="dialog"><button id="first">First</button><button id="last">Last</button></section></div>
    `;
    const trigger = document.querySelector('#trigger');
    const container = document.querySelector('#modal');
    const dialog = document.querySelector('#dialog');
    const first = document.querySelector('#first');
    const last = document.querySelector('#last');
    const controller = createModalController({ trigger, container, dialog });
    controllers.push(controller);

    expect(container.hidden).toBe(true);
    trigger.click();

    expect(controller.isOpen).toBe(true);
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(first);

    last.focus();
    keydown(last, 'Tab');
    expect(document.activeElement).toBe(first);

    keydown(first, 'Tab', { shiftKey: true });
    expect(document.activeElement).toBe(last);

    keydown(last, 'Escape');
    expect(controller.isOpen).toBe(false);
    expect(container.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('keeps body scrolling locked until the last nested overlay closes', () => {
    document.body.style.overflow = 'scroll';
    document.body.innerHTML += `
      <button id="modal-trigger">Modal</button>
      <div id="modal"><section id="modal-dialog"><button>Inside</button></section></div>
      <button id="drawer-trigger">Drawer</button>
      <div id="drawer"><aside id="drawer-dialog"><button>Inside</button></aside></div>
    `;
    const modal = createModalController({
      trigger: document.querySelector('#modal-trigger'),
      container: document.querySelector('#modal'),
      dialog: document.querySelector('#modal-dialog'),
    });
    const drawer = createDrawerController({
      trigger: document.querySelector('#drawer-trigger'),
      container: document.querySelector('#drawer'),
      dialog: document.querySelector('#drawer-dialog'),
    });
    controllers.push(modal, drawer);

    modal.open();
    drawer.open();
    expect(document.body.style.overflow).toBe('hidden');

    drawer.close();
    expect(document.body.style.overflow).toBe('hidden');

    modal.close();
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('only lets the top overlay consume Escape', () => {
    document.body.innerHTML = `
      <button id="one-trigger">One</button>
      <div id="one"><section id="one-dialog"><button id="two-trigger">Two</button></section></div>
      <div id="two"><section id="two-dialog"><button>Done</button></section></div>
    `;
    const one = createModalController({
      trigger: document.querySelector('#one-trigger'),
      container: document.querySelector('#one'),
      dialog: document.querySelector('#one-dialog'),
    });
    const two = createDrawerController({
      trigger: document.querySelector('#two-trigger'),
      container: document.querySelector('#two'),
      dialog: document.querySelector('#two-dialog'),
    });
    controllers.push(one, two);

    one.open();
    two.open();
    keydown(document.activeElement, 'Escape');
    expect(two.isOpen).toBe(false);
    expect(one.isOpen).toBe(true);

    keydown(document.activeElement, 'Escape');
    expect(one.isOpen).toBe(false);
  });

  it('is idempotent and restores managed attributes on destroy', () => {
    document.body.innerHTML = '<button id="trigger">Open</button><div id="modal"><button>Inside</button></div>';
    const options = {
      trigger: document.querySelector('#trigger'),
      container: document.querySelector('#modal'),
    };
    const first = createModalController(options);
    const second = createModalController(options);
    expect(second).toBe(first);

    first.destroy();
    expect(options.trigger.hasAttribute('aria-expanded')).toBe(false);
    expect(options.container.hasAttribute('hidden')).toBe(false);

    const replacement = createModalController(options);
    controllers.push(replacement);
    expect(replacement).not.toBe(first);
  });

  it('rolls back focus and scroll state when opening fails', () => {
    document.body.style.overflow = 'scroll';
    document.body.innerHTML = '<button id="trigger">Open</button><div id="modal"><button>Inside</button></div>';
    const trigger = document.querySelector('#trigger');
    trigger.focus();
    const controller = createModalController({
      trigger,
      container: document.querySelector('#modal'),
      onOpen() {
        throw new Error('Consumer failed');
      },
    });
    controllers.push(controller);

    expect(() => controller.open()).toThrowError('Consumer failed');
    expect(controller.isOpen).toBe(false);
    expect(controller.container.hidden).toBe(true);
    expect(document.body.style.overflow).toBe('scroll');
    expect(document.activeElement).toBe(trigger);
  });
});
