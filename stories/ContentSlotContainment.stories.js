import { expect } from 'storybook/test';

// A scrollable region needs a keyboard tab stop and its own accessible name.
const wideTable = (label) => `
        <div class="ct-table-wrap" tabindex="0" role="region" aria-label="${label}">
          <table class="ct-table ct-table--compact">
            <thead>
              <tr>
                <th scope="col">Document</th>
                <th scope="col">Owner</th>
                <th scope="col">Pages</th>
                <th scope="col">Processed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>quarterly-statement-2026-09.pdf</td>
                <td>j.chen@example.com</td>
                <td>12</td>
                <td>Sep 17, 2026, 11:37:12</td>
              </tr>
            </tbody>
          </table>
        </div>`;

const LONG_TOKEN = 'reference-0dc51b34-2026-4d75-84f5-94624663f125';

const host = (label, markup) => `
  <div>
    <p style="margin: 0 0 var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-muted);">${label}</p>
    <div style="width: 320px;">${markup}</div>
  </div>`;

export default {
  title: 'Components/Layout/Content Slot Containment',
  parameters: {
    docs: {
      description: {
        component:
          'Grid content slots — `.ct-card__body`, `.ct-modal__body`, `.ct-drawer__body`, `.ct-field`, `.ct-alert` and `.ct-confirmation` — clamp their content track. Wide projected content stays inside the surface and scrolls or wraps there instead of stretching the surface past the space it was given.',
      },
    },
  },
};

/** Narrow surfaces holding content that is wider than they are. */
export const WideContentStaysInside = {
  parameters: {
    docs: {
      description: {
        story:
          'Each surface is given 320px. A framework wrapper usually sits between the slot and the scroll container it projects (component hosts render a block element), so the wrapper — not the scroll container — is the grid item. The slot therefore has to clamp the track itself.',
      },
    },
  },
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-7);">
    ${host(
      'Card body',
      `
      <section class="ct-card" aria-labelledby="containment-card-heading">
        <div class="ct-card__header">
          <h3 id="containment-card-heading">Card ledger</h3>
        </div>
        <div class="ct-card__body" data-slot="card">
          <div>${wideTable('Card ledger rows')}</div>
        </div>
      </section>`
    )}

    ${host(
      'Modal body',
      `
      <div class="ct-modal__dialog" style="width: 100%;">
        <div class="ct-modal__header"><h3>Export</h3></div>
        <div class="ct-modal__body" data-slot="modal">
          <div>${wideTable('Modal ledger rows')}</div>
        </div>
      </div>`
    )}

    ${host(
      'Drawer body',
      `
      <div class="ct-drawer__body" data-slot="drawer">
        <div>${wideTable('Drawer ledger rows')}</div>
      </div>`
    )}

    ${host(
      'Alert',
      `
      <div class="ct-alert" data-variant="danger" data-slot="alert" role="alert">
        <span class="ct-alert__icon" aria-hidden="true">!</span>
        <div class="ct-alert__content" data-slot="alert-content">
          <p class="ct-alert__title">Upload rejected</p>
          <p class="ct-alert__description">${LONG_TOKEN}</p>
        </div>
      </div>`
    )}

    ${host(
      'Field',
      `
      <div class="ct-field" data-slot="field">
        <label class="ct-field__label" for="containment-field">Reference</label>
        <input class="ct-input" id="containment-field" value="${LONG_TOKEN}" readonly />
        <p class="ct-field__hint">${LONG_TOKEN}</p>
      </div>`
    )}

    ${host(
      'Confirmation',
      `
      <div class="ct-confirmation" data-slot="confirmation">
        <span class="ct-confirmation__icon" aria-hidden="true">?</span>
        <div class="ct-confirmation__content" data-slot="confirmation-content">
          <p class="ct-confirmation__title">Delete reference</p>
          <p>${LONG_TOKEN}</p>
        </div>
      </div>`
    )}
  </div>
`,
  play: async ({ canvasElement }) => {
    // Total width the declared columns occupy, gaps included.
    const trackWidth = (element) => {
      const styles = getComputedStyle(element);
      const tracks = styles.gridTemplateColumns
        .split(' ')
        .map(Number.parseFloat)
        .filter(Number.isFinite);
      const gap = Number.parseFloat(styles.columnGap) || 0;
      return tracks.reduce((total, track) => total + track, 0) + gap * Math.max(tracks.length - 1, 0);
    };

    const slots = canvasElement.querySelectorAll('[data-slot]');
    expect(slots).toHaveLength(8);

    for (const slot of slots) {
      // The columns fit the slot instead of growing to the content's max-content size.
      expect(trackWidth(slot)).toBeLessThanOrEqual(slot.clientWidth + 0.5);
      // And the slot itself fits the 320px it was given.
      expect(slot.getBoundingClientRect().width).toBeLessThanOrEqual(320.5);
    }

    // Wide content scrolls inside its own scroll container instead of widening the surface.
    const wraps = canvasElement.querySelectorAll('.ct-table-wrap');
    expect(wraps).toHaveLength(3);
    for (const wrap of wraps) {
      expect(wrap.scrollWidth).toBeGreaterThan(wrap.clientWidth);
      expect(wrap.getBoundingClientRect().width).toBeLessThanOrEqual(320.5);
    }
  },
};
