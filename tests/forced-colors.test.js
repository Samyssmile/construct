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
        <section class="ct-aperture">
          <figure class="ct-aperture-poster"><span class="ct-aperture-mark" aria-hidden="true"></span><figcaption>Aperture</figcaption></figure>
          <div class="ct-aperture-rule" aria-hidden="true"></div>
          <button class="ct-aperture-action" type="button">Explore <span class="ct-aperture-action__icon" aria-hidden="true">↗</span></button>
          <fieldset class="ct-aperture-choices">
            <legend>Appearance</legend>
            <label class="ct-aperture-choice"><input type="radio" name="aperture-theme" checked>Light</label>
            <label class="ct-aperture-choice"><input type="radio" name="aperture-theme">Dark</label>
          </fieldset>
        </section>
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

        <label class="ct-switch">
          <input class="ct-switch__input" type="checkbox" role="switch" />
          Notifications
        </label>

        <label class="ct-radio">
          <input class="ct-radio__input" type="radio" name="fc-radio" checked />
          Radio
        </label>

        <div class="ct-tabs">
          <div class="ct-tabs__list" role="tablist">
            <button class="ct-tabs__trigger" role="tab" aria-selected="true" type="button">Overview</button>
          </div>
        </div>
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

  it('preserves Aperture silhouette, actions and selected radio without brand colors', () => {
    expectVisibleBorder(document.querySelector('.ct-aperture-poster'));
    const actionSurface = getComputedStyle(document.querySelector('.ct-aperture-action'), '::before');
    expect(actionSurface.borderTopStyle).toBe('solid');
    expect(Number.parseFloat(actionSurface.borderTopWidth)).toBeGreaterThanOrEqual(1);
    expectVisibleBorder(document.querySelector('.ct-aperture-action__icon'));
    const rule = getComputedStyle(document.querySelector('.ct-aperture-rule'), '::before');
    expect(rule.borderTopStyle).toBe('solid');
    expect(rule.borderTopColor).not.toBe(getComputedStyle(document.querySelector('.ct-aperture')).backgroundColor);
    const mark = getComputedStyle(document.querySelector('.ct-aperture-mark'), '::before');
    expect(mark.forcedColorAdjust).toBe('none');
    expect(mark.backgroundColor).not.toBe(getComputedStyle(document.querySelector('.ct-aperture')).backgroundColor);
    const selected = getComputedStyle(document.querySelector('.ct-aperture-choice:has(input:checked)'));
    expect(Number.parseFloat(selected.borderTopWidth)).toBeGreaterThanOrEqual(2);
    expect(selected.textDecorationLine).toContain('underline');
    const action = document.querySelector('.ct-aperture-action');
    action.focus();
    expect(Number.parseFloat(getComputedStyle(action).outlineWidth)).toBeGreaterThanOrEqual(3);
    expect(getComputedStyle(action).outlineColor).not.toBe(getComputedStyle(document.querySelector('.ct-aperture')).backgroundColor);
  });

  it('keeps the switch track visible without shadows', () => {
    const input = document.querySelector('.ct-switch__input');
    expectVisibleBorder(input);

    const thumb = getComputedStyle(input, '::after');
    expect(thumb.borderTopStyle).not.toBe('none');
    expect(Number.parseFloat(thumb.borderTopWidth)).toBeGreaterThanOrEqual(1);
  });

  it('keeps the checked radio dot visible', () => {
    const dot = getComputedStyle(document.querySelector('.ct-radio__input'), '::before');
    expect(dot.forcedColorAdjust).toBe('none');
    expect(dot.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  it('keeps the active tab indicator visible', () => {
    const trigger = document.querySelector('.ct-tabs__trigger[aria-selected="true"]');
    const indicator = getComputedStyle(trigger, '::after');
    expect(indicator.forcedColorAdjust).toBe('none');
    expect(indicator.backgroundColor).not.toBe(getComputedStyle(document.body).backgroundColor);
  });
});
