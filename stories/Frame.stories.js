import { expect, within } from 'storybook/test';

export default {
  title: 'Components/Layout/Frame',
  parameters: {
    docs: {
      description: {
        component:
          'Owned frame surface for figures, code samples, media, and callouts. The outer `ct-frame` owns the border, radius, background, shadow, and optional datum registration mark; `ct-frame__content` owns clipping so the mark can align with the outer border without being cut off.',
      },
    },
  },
};

export const Default = {
  render: () => `
  <aside class="ct-frame" aria-labelledby="frame-title" style="width: min(440px, 80vw);">
    <div class="ct-frame__content" style="padding: var(--space-6);">
      <h3 id="frame-title" style="margin: 0 0 var(--space-3);">Conversion report</h3>
      <p style="margin: 0; color: var(--color-text-secondary);">The frame owns its complete surface geometry without imposing document semantics.</p>
    </div>
  </aside>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByRole('complementary', { name: 'Conversion report' });
    const frameStyle = getComputedStyle(frame);

    expect(frame).toHaveClass('ct-frame');
    expect(frameStyle.borderBlockStartWidth).toBe('1px');
    expect(frameStyle.borderStartStartRadius).not.toBe('0px');
  },
};

export const Datum = {
  render: () => `
  <div class="ct-frame ct-frame--datum" style="width: min(440px, 80vw);">
    <figure class="ct-frame__content" aria-labelledby="frame-caption" style="margin: 0;">
      <figcaption id="frame-caption" data-frame-chrome style="position: relative; z-index: 1; margin: 0; padding: var(--space-3) var(--space-6); background: var(--color-bg-muted); border-block-end: var(--border-thin) solid var(--color-border-default); font-size: var(--font-size-sm);">Code sample</figcaption>
      <pre style="margin: 0; padding: var(--space-6); overflow-x: auto; border-radius: 0; background: transparent;"><code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">--component-datum-edge-width: 3px;
--component-datum-origin-length: 48px;</code></pre>
    </figure>
  </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvasElement.querySelector('.ct-frame');
    const content = canvasElement.querySelector('.ct-frame__content');
    const chrome = canvasElement.querySelector('[data-frame-chrome]');
    const frameStyle = getComputedStyle(frame);
    const contentStyle = getComputedStyle(content);
    const markStyle = getComputedStyle(frame, '::before');
    const chromeStyle = getComputedStyle(chrome);
    const frameBorderWidth = Number.parseFloat(frameStyle.borderBlockStartWidth);

    expect(canvas.getByRole('figure', { name: 'Code sample' })).toBe(content);
    expect(frameStyle.position).toBe('relative');
    expect(frameStyle.isolation).toBe('isolate');
    expect(frameStyle.overflow).toBe('visible');
    expect(contentStyle.overflow).toBe('clip');
    expect(Number.parseFloat(contentStyle.borderStartStartRadius)).toBe(
      Number.parseFloat(frameStyle.borderStartStartRadius) - frameBorderWidth
    );
    // The mark absorbs the frame's hairline: it starts one bleed outside the
    // frame's outer edge and carries the matching radius, so no antialiased
    // border edge survives outside the orange corner.
    const bleed = Number.parseFloat(markStyle.getPropertyValue('--ct-datum-mark-bleed'));

    expect(bleed).toBeGreaterThan(0);
    expect(Number.parseFloat(markStyle.insetBlockStart)).toBe(-frameBorderWidth - bleed);
    expect(Number.parseFloat(markStyle.insetInlineStart)).toBe(-frameBorderWidth - bleed);
    expect(Number.parseFloat(markStyle.borderStartStartRadius)).toBe(
      Number.parseFloat(frameStyle.borderStartStartRadius) + bleed
    );
    // Growing the stroke by the same bleed keeps the mark's inner edge — and so
    // the datum's weight over the surface — exactly where it was.
    const markStroke = Number.parseFloat(markStyle.borderBlockStartWidth);
    const innerEdgeFromFrameEdge =
      Number.parseFloat(markStyle.insetBlockStart) + markStroke + frameBorderWidth;

    expect(innerEdgeFromFrameEdge).toBe(markStroke - bleed);
    expect(Number(markStyle.zIndex)).toBeGreaterThan(Number(chromeStyle.zIndex));
  },
};
