import { afterEach, describe, expect, it, vi } from 'vitest';

import { createPopoverController } from '../popover.js';
import { createTooltipController } from '../tooltip.js';

const controllers = [];

afterEach(() => {
  controllers.splice(0).reverse().forEach((controller) => controller.destroy());
  vi.useRealTimers();
  document.body.replaceChildren();
});

function keydown(target, key) {
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key }));
}

describe('tooltip controller', () => {
  it('links ARIA, handles delayed hover/focus, ignores touch hover, and closes with Escape', async () => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <span class="ct-tooltip"><button id="trigger" aria-describedby="help">Info</button><span id="tooltip">Details</span></span>
    `;
    const trigger = document.querySelector('#trigger');
    const controller = createTooltipController({
      trigger,
      tooltip: document.querySelector('#tooltip'),
      openDelay: 50,
    });
    controllers.push(controller);

    expect(trigger.getAttribute('aria-describedby')).toBe('help tooltip');
    trigger.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }));
    await vi.advanceTimersByTimeAsync(60);
    expect(controller.isOpen).toBe(false);

    trigger.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    await vi.advanceTimersByTimeAsync(50);
    expect(controller.isOpen).toBe(true);
    trigger.focus();
    trigger.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
    await vi.advanceTimersByTimeAsync(100);
    expect(controller.isOpen).toBe(true);
    keydown(trigger, 'Escape');
    expect(controller.isOpen).toBe(false);

    trigger.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch' }));
    expect(controller.isOpen).toBe(true);
    trigger.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch' }));
    expect(controller.isOpen).toBe(false);

    trigger.blur();
    trigger.focus();
    await vi.advanceTimersByTimeAsync(0);
    expect(controller.isOpen).toBe(true);
  });

  it('remains hoverable while the pointer transfers from trigger to tooltip', async () => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <span class="ct-tooltip"><button id="trigger">Info</button><span id="tooltip">Details</span></span>
    `;
    const trigger = document.querySelector('#trigger');
    const tooltip = document.querySelector('#tooltip');
    const controller = createTooltipController({
      closeDelay: 50,
      openDelay: 0,
      tooltip,
      trigger,
    });
    controllers.push(controller);

    trigger.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    await vi.advanceTimersByTimeAsync(0);
    expect(controller.isOpen).toBe(true);

    trigger.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
    tooltip.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    await vi.advanceTimersByTimeAsync(50);
    expect(controller.isOpen).toBe(true);

    tooltip.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
    await vi.advanceTimersByTimeAsync(50);
    expect(controller.isOpen).toBe(false);
  });
});

describe('popover controller', () => {
  it('supports click/touch, focus management, close buttons, and Escape', () => {
    document.body.innerHTML = `
      <div class="ct-popover"><button id="trigger">Open</button><section id="popover"><button id="close" data-ct-dismiss>Close</button><input id="field"></section></div>
    `;
    const trigger = document.querySelector('#trigger');
    const close = document.querySelector('#close');
    const controller = createPopoverController({
      trigger,
      popover: document.querySelector('#popover'),
      focusOnOpen: true,
      initialFocus: '#field',
    });
    controllers.push(controller);

    trigger.click();
    expect(controller.isOpen).toBe(true);
    expect(document.activeElement).toBe(document.querySelector('#field'));
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    keydown(document.activeElement, 'Escape');
    expect(controller.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);

    trigger.click();
    close.click();
    expect(controller.isOpen).toBe(false);
  });

  it('keeps a hover-open popover available while focus is inside', async () => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <div class="ct-popover" id="root"><button id="trigger">Open</button><section id="popover"><button id="inside">Inside</button></section></div>
    `;
    const root = document.querySelector('#root');
    const controller = createPopoverController({
      trigger: document.querySelector('#trigger'),
      popover: document.querySelector('#popover'),
      openOnHover: true,
      openDelay: 10,
      closeDelay: 10,
    });
    controllers.push(controller);

    root.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    await vi.advanceTimersByTimeAsync(10);
    expect(controller.isOpen).toBe(true);
    document.querySelector('#inside').focus();
    root.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
    await vi.advanceTimersByTimeAsync(10);
    expect(controller.isOpen).toBe(true);
  });
});
