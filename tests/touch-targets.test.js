import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import '../foundations.css';
import '../components/index.css';

const px = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const expandedPseudoSize = (element, pseudoElement) => {
  const elementRect = element.getBoundingClientRect();
  const pseudoStyle = getComputedStyle(element, pseudoElement);

  return {
    width: elementRect.width - px(pseudoStyle.left) - px(pseudoStyle.right),
    height: elementRect.height - px(pseudoStyle.top) - px(pseudoStyle.bottom),
  };
};

const expectMinimumSize = ({ width, height }, minimum = 44) => {
  expect(width).toBeGreaterThanOrEqual(minimum);
  expect(height).toBeGreaterThanOrEqual(minimum);
};

describe('coarse-pointer target contract', () => {
  beforeEach(async () => {
    document.body.innerHTML = `
      <main id="fixture">
        <section class="ct-aperture">
          <button class="ct-aperture-action" type="button">Explore <span class="ct-aperture-action__icon" aria-hidden="true">↗</span></button>
          <fieldset class="ct-aperture-choices">
            <legend>Appearance</legend>
            <label class="ct-aperture-choice"><input type="radio" name="aperture-theme" checked>Light</label>
          </fieldset>
          <details class="ct-aperture-disclosure"><summary>Details</summary><p>Content</p></details>
        </section>
        <button class="ct-button" type="button">Continue</button>
        <button class="ct-button ct-button--sm" type="button">Save</button>

        <nav class="ct-pagination" aria-label="Pages">
          <a class="ct-pagination__link" href="#page-1" aria-current="page">1</a>
        </nav>

        <button class="ct-chip ct-chip--interactive" type="button">Filter</button>

        <label class="ct-check">
          <input class="ct-check__input" type="checkbox" />
          Checkbox
        </label>

        <label class="ct-radio">
          <input class="ct-radio__input" type="radio" name="touch-radio" />
          Radio
        </label>

        <label class="ct-switch ct-switch--sm">
          <input class="ct-switch__input" type="checkbox" role="switch" />
          Switch
        </label>

        <label class="ct-slider">
          <span class="ct-slider__label">Volume</span>
          <input class="ct-slider__input" type="range" min="0" max="100" value="50" />
        </label>

        <div class="ct-dropdown" data-state="open">
          <button class="ct-button" type="button">Menu</button>
          <div class="ct-dropdown__menu" role="menu">
            <button class="ct-dropdown__item" role="menuitem" type="button">Duplicate</button>
          </div>
        </div>

        <div class="ct-tabs">
          <div class="ct-tabs__list" role="tablist">
            <button class="ct-tabs__trigger" role="tab" aria-selected="true" type="button">Overview</button>
          </div>
        </div>

        <nav class="ct-pagination ct-pagination--sm" aria-label="Compact pages">
          <a class="ct-pagination__link" href="#page-2">2</a>
        </nav>

        <span class="ct-chip">
          Filter
          <button class="ct-chip__remove" type="button" aria-label="Remove filter">&times;</button>
        </span>
      </main>
    `;

    await new Promise((resolve) => requestAnimationFrame(resolve));
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it('activates the coarse-pointer media query in the browser context', () => {
    expect(matchMedia('(pointer: coarse)').matches).toBe(true);
  });

  it('keeps direct interactive targets at least 44 by 44 CSS pixels', () => {
    for (const selector of [
      '.ct-button:not(.ct-button--sm)',
      '.ct-button--sm',
      '.ct-pagination__link',
      '.ct-chip--interactive',
      '.ct-aperture-action',
      '.ct-aperture-choice',
      '.ct-aperture-disclosure summary',
    ]) {
      const element = document.querySelector(selector);
      expect(element).not.toBeNull();
      expectMinimumSize(element.getBoundingClientRect());
    }
  });

  it('keeps menu items, tab triggers, and small pagination links at least 44 by 44 CSS pixels', () => {
    for (const selector of [
      '.ct-dropdown__item',
      '.ct-tabs__trigger',
      '.ct-pagination--sm .ct-pagination__link',
    ]) {
      const element = document.querySelector(selector);
      expect(element).not.toBeNull();
      expectMinimumSize(element.getBoundingClientRect());
    }
  });

  it('expands the chip remove button hit area to at least 44 by 44 CSS pixels', () => {
    const remove = document.querySelector('.ct-chip__remove');
    expect(remove).not.toBeNull();
    expectMinimumSize(expandedPseudoSize(remove, '::before'));
  });

  it('expands compact control hit areas to at least 44 by 44 CSS pixels', () => {
    for (const selector of ['.ct-check__input', '.ct-radio__input']) {
      const element = document.querySelector(selector);
      expectMinimumSize(expandedPseudoSize(element, '::after'));
    }

    const switchInput = document.querySelector('.ct-switch__input');
    expectMinimumSize(expandedPseudoSize(switchInput, '::before'));
  });

  it('uses a 44px slider thumb for coarse pointers', () => {
    const slider = document.querySelector('.ct-slider');
    expect(getComputedStyle(slider).getPropertyValue('--ct-slider-thumb-size').trim()).toBe('44px');
  });
});
