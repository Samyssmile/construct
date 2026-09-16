import { expect, userEvent, within } from 'storybook/test';
import { apertureArrow, apertureMark, apertureRule, createApertureShowcase } from '../examples/aperture/showcase.js';
import '../examples/aperture/showcase.css';

export default {
  title: 'Patterns/Aperture Grammar',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A second, opt-in Construct signature: a split oval with an offset seam, oversized grotesk typography, cobalt and paper. Import components/aperture.css and opt in with ct-aperture. Public primitives include the mark, wordmark, poster, action, panel, choices and native disclosure. Colors follow the primitive → semantic → component token contract across all built-in themes. Decorative marks are hidden from assistive technology; native controls retain keyboard behavior. Datum Grammar remains available independently.',
      },
    },
  },
};

export const Showcase = {
  name: 'Aperture / The Full Look',
  render: () => createApertureShowcase(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Raum für Eigenart.');
    // Every specimen navigation action has a real destination in this instance.
    for (const link of canvasElement.querySelectorAll('a[href^="#"]')) {
      expect(canvasElement.querySelector(link.getAttribute('href'))).not.toBeNull();
    }
    const summary = canvas.getByText('Wie viel Farbe braucht es?');
    await userEvent.click(summary);
    expect(summary.parentElement).toHaveAttribute('open');
    await userEvent.click(summary);
    expect(summary.parentElement).not.toHaveAttribute('open');
    summary.blur();
    canvasElement.ownerDocument.defaultView.scrollTo(0, 0);
  },
};

export const Dark = {
  globals: { theme: 'Dark' },
  render: () => createApertureShowcase(),
};

export const HighContrast = {
  globals: { theme: 'High Contrast' },
  render: () => createApertureShowcase(),
};

export const Compact = {
  name: 'Compact / 360 px',
  render: () => {
    const frame = document.createElement('div');
    frame.style.cssText = 'width: 360px; max-width: 100%; margin-inline: auto;';
    frame.append(createApertureShowcase());
    return frame;
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.ct-aperture');
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    for (const action of root.querySelectorAll('.ct-aperture-action')) {
      expect(action.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
  },
};

export const ThemeSwitcher = {
  render: () => createApertureShowcase({ themeControls: true }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector('.ct-aperture');
    const lightColor = getComputedStyle(root).backgroundColor;
    const light = canvas.getByRole('radio', { name: 'Hell' });
    light.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(canvas.getByRole('radio', { name: 'Dunkel' })).toBeChecked();
    expect(root).toHaveAttribute('data-theme', 'dark');
    expect(getComputedStyle(root).backgroundColor).not.toBe(lightColor);
    await userEvent.keyboard('{ArrowRight}');
    expect(root).toHaveAttribute('data-theme', 'high-contrast');
    await userEvent.click(canvas.getByText('Hell', { selector: 'label' }));
    expect(root).toHaveAttribute('data-theme', 'light');
    expect(getComputedStyle(root).backgroundColor).toBe(lightColor);
  },
};

export const Primitives = {
  render: () => `
    <section class="ct-aperture" lang="de" style="padding: 32px;">
      <div style="max-width: 800px; margin-inline: auto; display: grid; gap: 32px;">
        <h1 class="ct-aperture-heading"><span class="ct-aperture-line">Die Form.</span> <span class="ct-aperture-line">Ihre Bausteine.</span></h1>
        <div class="ct-aperture-wordmark">${apertureMark}aperture</div>
        ${apertureRule}
        <figure class="ct-aperture-poster">
          <div class="ct-aperture-poster__art" style="max-width: 240px; width: 100%; margin: auto;">${apertureMark}</div>
          <figcaption class="ct-aperture-poster__title">Die Öffnung.</figcaption>
        </figure>
        <article class="ct-aperture-panel">
          <p class="ct-aperture-label">Eine ruhige Fläche</p>
          <h2 class="ct-aperture-heading">Inhalt zuerst.</h2>
          <p>Form und Typografie geben Orientierung.</p>
        </article>
        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
          <a class="ct-aperture-action" href="#aperture-primitive-detail">Mehr erfahren ${apertureArrow}</a>
          <button class="ct-aperture-action" type="button" disabled>Noch nicht verfügbar ${apertureArrow}</button>
        </div>
        <details class="ct-aperture-disclosure" id="aperture-primitive-detail">
          <summary>Ein Detail öffnen</summary>
          <p>Dieses Element nutzt die native Tastaturbedienung des Browsers.</p>
        </details>
      </div>
    </section>`,
};

export const Monochrome = {
  name: 'Signature / Without cobalt',
  render: () => {
    const root = createApertureShowcase();
    root.style.setProperty('--component-aperture-accent', 'var(--component-aperture-ink)');
    root.style.setProperty('--component-aperture-on-accent', 'var(--component-aperture-paper)');
    return root;
  },
};

export const ActionReflow = {
  name: 'Actions / Long labels',
  render: () => `
    <section class="ct-aperture" lang="de" style="width: 280px; max-width: 100%; padding: 16px;">
      <div style="display: grid; justify-items: start; gap: 24px;">
        <h1 style="font-size: 24px;">Eine gemeinsame Aktion.</h1>
        <a class="ct-aperture-action" href="#aperture-action-detail">Alle ausgewählten Möglichkeiten ansehen ${apertureArrow}</a>
        <a class="ct-aperture-action ct-aperture-action--quiet" href="#aperture-action-detail">Auswahl noch einmal in Ruhe überprüfen ${apertureArrow}</a>
        <button class="ct-aperture-action" type="button" disabled>Momentan noch nicht verfügbar ${apertureArrow}</button>
        <p id="aperture-action-detail">Wort, Fuge und Pfeil bilden eine einzige anklickbare Fläche.</p>
      </div>
    </section>`,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.ct-aperture');
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    for (const action of root.querySelectorAll('.ct-aperture-action')) {
      const bounds = action.getBoundingClientRect();
      const icon = action.querySelector('.ct-aperture-action__icon').getBoundingClientRect();
      expect(bounds.height).toBeGreaterThanOrEqual(48);
      expect(icon.bottom).toBeLessThanOrEqual(bounds.bottom + 1);
      expect(icon.right).toBeLessThanOrEqual(bounds.right + 1);
    }
    const link = within(canvasElement).getByRole('link', { name: 'Alle ausgewählten Möglichkeiten ansehen' });
    const ink = getComputedStyle(link).color;
    await userEvent.hover(link);
    // Foundation link hover colors must not erase the primary label.
    expect(getComputedStyle(link).color).toBe(ink);
    // Keep the test runner on its current route while checking native focus.
    link.addEventListener('click', event => event.preventDefault(), { once: true });
    await userEvent.click(link.querySelector('.ct-aperture-action__icon'));
    expect(link).toHaveFocus();
    await userEvent.unhover(link);
    link.blur();
  },
};

export const ThemeMatrix = {
  render: () => `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));">
      ${['light', 'dark', 'high-contrast', 'high-contrast-dark'].map(theme => `
        <section class="ct-aperture" data-theme="${theme}" style="padding: 24px;">
          <h2 style="font-size: 20px; margin-bottom: 24px;">${theme}</h2>
          <figure class="ct-aperture-poster">
            <div class="ct-aperture-poster__art">${apertureMark}</div>
            <figcaption class="ct-aperture-poster__title">Open.</figcaption>
          </figure>
          <div class="ct-aperture-panel" style="margin-top: 16px;">
            <p>Raum für Eigenart.</p>
            <p style="color: var(--component-aperture-muted);">Aperture / Construct</p>
          </div>
        </section>`).join('')}
    </div>`,
};

export const RightToLeft = {
  render: () => {
    const root = createApertureShowcase();
    root.dir = 'rtl';
    return root;
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.ct-aperture');
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    const mark = root.querySelector('.ct-aperture-mark');
    expect(getComputedStyle(mark, '::before').right).toBe('0px');
    expect(getComputedStyle(mark, '::after').left).toBe('0px');
    const action = root.querySelector('.ct-aperture-action');
    const surfaceWidth = Number.parseFloat(getComputedStyle(action, '::before').width);
    const surfaceLeft = action.getBoundingClientRect().right - surfaceWidth;
    const icon = action.querySelector('.ct-aperture-action__icon').getBoundingClientRect();
    // The mirrored disc must retain the open seam instead of overlapping the label.
    expect(icon.right + 5).toBeLessThanOrEqual(surfaceLeft);
  },
};
