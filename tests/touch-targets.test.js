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
    ]) {
      const element = document.querySelector(selector);
      expect(element).not.toBeNull();
      expectMinimumSize(element.getBoundingClientRect());
    }
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
