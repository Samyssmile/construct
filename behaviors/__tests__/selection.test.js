import { afterEach, describe, expect, it } from 'vitest';

import { createTabsController } from '../tabs.js';
import { createToggleGroupController } from '../toggle-group.js';

const controllers = [];

afterEach(() => {
  controllers.splice(0).reverse().forEach((controller) => controller.destroy());
  document.body.replaceChildren();
});

function keydown(target, key) {
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key }));
}

describe('tabs controller', () => {
  it('synchronizes ARIA and supports automatic roving activation', () => {
    document.body.innerHTML = `
      <div id="tabs"><div id="tablist"><button data-ct-tab>One</button><button data-ct-tab>Two</button><button data-ct-tab disabled>Three</button></div>
      <section data-ct-tab-panel>Panel one</section><section data-ct-tab-panel>Panel two</section><section data-ct-tab-panel>Panel three</section></div>
    `;
    const controller = createTabsController({ tablist: document.querySelector('#tablist') });
    controllers.push(controller);

    expect(controller.selectedIndex).toBe(0);
    expect(controller.tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(controller.panels[1].hidden).toBe(true);

    controller.tabs[0].focus();
    keydown(controller.tabs[0], 'ArrowRight');
    expect(controller.selectedIndex).toBe(1);
    expect(document.activeElement).toBe(controller.tabs[1]);

    keydown(controller.tabs[1], 'ArrowRight');
    expect(controller.selectedIndex).toBe(0);
  });

  it('separates focus from selection in manual mode', () => {
    document.body.innerHTML = `
      <div><div id="tablist"><button data-ct-tab>One</button><button data-ct-tab>Two</button></div>
      <section data-ct-tab-panel>One</section><section data-ct-tab-panel>Two</section></div>
    `;
    const controller = createTabsController({
      activation: 'manual',
      tablist: document.querySelector('#tablist'),
    });
    controllers.push(controller);

    controller.tabs[0].focus();
    keydown(controller.tabs[0], 'ArrowRight');
    expect(controller.selectedIndex).toBe(0);
    keydown(controller.tabs[1], 'Enter');
    expect(controller.selectedIndex).toBe(1);
  });

  it('dispatches one cancellable selection transaction per automatic keyboard move', () => {
    document.body.innerHTML = `
      <div><div id="tablist"><button data-ct-tab>One</button><button data-ct-tab>Two</button></div>
      <section data-ct-tab-panel>One</section><section data-ct-tab-panel>Two</section></div>
    `;
    const tablist = document.querySelector('#tablist');
    const controller = createTabsController({ tablist });
    controllers.push(controller);
    let attempts = 0;
    tablist.addEventListener('ct:beforeselect', (event) => {
      attempts += 1;
      event.preventDefault();
    });

    controller.tabs[0].focus();
    keydown(controller.tabs[0], 'ArrowRight');

    expect(attempts).toBe(1);
    expect(controller.selectedIndex).toBe(0);
    expect(document.activeElement).toBe(controller.tabs[1]);
  });
});

describe('toggle group controller', () => {
  it('supports single and multiple values with roving focus', () => {
    document.body.innerHTML = `
      <div id="group"><button data-ct-toggle data-value="left">Left</button><button data-ct-toggle data-value="center">Center</button><button data-ct-toggle data-value="right">Right</button></div>
    `;
    const root = document.querySelector('#group');
    const controller = createToggleGroupController({ root, value: 'left', allowEmpty: false });
    controllers.push(controller);

    expect(root.getAttribute('role')).toBe('group');
    expect(root.getAttribute('data-orientation')).toBe('horizontal');
    expect(root.hasAttribute('aria-orientation')).toBe(false);

    controller.items[1].click();
    expect(controller.value).toBe('center');
    expect(controller.items[1].getAttribute('aria-pressed')).toBe('true');

    controller.items[1].focus();
    keydown(controller.items[1], 'ArrowRight');
    expect(document.activeElement).toBe(controller.items[2]);

    controller.destroy();
    controllers.pop();
    const multiple = createToggleGroupController({ root, type: 'multiple', value: ['left'] });
    controllers.push(multiple);
    multiple.items[2].click();
    expect(multiple.value).toEqual(['left', 'right']);
  });
});
