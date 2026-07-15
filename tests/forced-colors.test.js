import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import '../foundations.css';
import '../components/index.css';

const expectVisibleBorder = (element, side = 'Top') => {
  const style = getComputedStyle(element);
  expect(style[`border${side}Style`]).not.toBe('none');
  expect(Number.parseFloat(style[`border${side}Width`])).toBeGreaterThanOrEqual(1);
};

describe('forced-colors contract', () => {
  beforeEach(async () => {
    document.body.innerHTML = `
      <main>
        <button class="ct-button" type="button">Continue</button>

        <span class="ct-status" data-status="connecting" aria-busy="true">
          <span class="ct-status__indicator" aria-hidden="true"></span>
          <span class="ct-status__label">Connecting</span>
        </span>

        <dl class="ct-metrics">
          <div class="ct-metric" data-status="warning">
            <dt class="ct-metric__label">Latency</dt>
            <dd class="ct-metric__value">128<small>ms</small></dd>
          </div>
        </dl>

        <div class="ct-meter">
          <div class="ct-meter__track" role="img" aria-label="Two meter segments">
            <span class="ct-meter__segment" style="--ct-meter-segment-size: 50%"></span>
            <span class="ct-meter__segment" data-variant="warning" style="--ct-meter-segment-size: 50%"></span>
          </div>
        </div>

        <nav class="ct-navbar" aria-label="Primary">
          <a class="ct-navbar__link" href="#overview" aria-current="page">Overview</a>
        </nav>
      </main>
    `;

    await new Promise((resolve) => requestAnimationFrame(resolve));
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it('activates the forced-colors media query in the browser context', () => {
    expect(matchMedia('(forced-colors: active)').matches).toBe(true);
  });

  it('preserves visible boundaries and state indicators', () => {
    expectVisibleBorder(document.querySelector('.ct-button'));
    expectVisibleBorder(document.querySelector('.ct-status__indicator'));
    expectVisibleBorder(document.querySelector('.ct-metric'));
    expectVisibleBorder(document.querySelector('.ct-meter__track'));
    expectVisibleBorder(document.querySelectorAll('.ct-meter__segment')[1], 'Left');
    expectVisibleBorder(document.querySelector('.ct-navbar'), 'Bottom');
  });

  it('keeps a visible keyboard focus indicator', () => {
    const button = document.querySelector('.ct-button');
    button.focus();

    const style = getComputedStyle(button);
    expect(style.outlineStyle).not.toBe('none');
    expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2);
  });
});
