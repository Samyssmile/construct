import { expect } from 'storybook/test';

export default {
  title: 'Patterns/Datum Grammar',
  parameters: {
    docs: {
      description: {
        component:
          'The "datum" reference-line grammar — the orange signature promoted from focus rings and the intro page into reusable structural vocabulary: eyebrow kickers, the measured datum scale, the card registration mark and active leading edge, and the spec datasheet. Orange-as-text uses brand-accent-active (≥4.5:1); orange-as-edge uses brand-accent.',
      },
    },
  },
};

export const Eyebrow = {
  render: () => `
  <p class="ct-eyebrow">Foundations · framework-agnostic</p>`,
  play: async ({ canvasElement }) => {
    const eyebrow = canvasElement.querySelector('.ct-eyebrow');
    expect(eyebrow).toBeInTheDocument();
  },
};

export const SectionHeader = {
  render: () => `
  <div style="max-width: 640px;">
    <p class="ct-eyebrow">40+ building blocks · framework-agnostic</p>
    <h2 style="margin: 0;">Components</h2>
    <div class="ct-datum-scale" role="presentation" style="margin-top: var(--space-5);"></div>
  </div>`,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.ct-eyebrow')).toBeInTheDocument();
    expect(canvasElement.querySelector('.ct-datum-scale')).toBeInTheDocument();
  },
};

export const CardRegistrationMark = {
  render: () => `
  <div class="ct-card ct-card--datum" style="max-width: 360px;">
    <p class="ct-eyebrow" style="margin-bottom: var(--space-4);">Foundations</p>
    <h3 style="margin: 0;">Design Tokens</h3>
    <p class="ct-muted" style="margin: var(--space-3) 0 0;">One source of truth for every visual decision.</p>
  </div>`,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('.ct-card--datum');
    expect(card).toBeInTheDocument();
  },
};

export const ActiveCard = {
  render: () => `
  <div style="display: grid; gap: var(--space-6); max-width: 360px;">
    <div class="ct-card ct-card--datum" data-state="active">
      <p class="ct-eyebrow" style="margin-bottom: var(--space-4);">Theming · active</p>
      <h3 style="margin: 0;">Theming</h3>
      <p class="ct-muted" style="margin: var(--space-3) 0 0;">Light, dark & high-contrast with automatic fallback.</p>
    </div>
    <div class="ct-card">
      <h3 style="margin: 0;">Iconography</h3>
      <p class="ct-muted" style="margin: var(--space-3) 0 0;">A consistent, accessible icon set.</p>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const active = canvasElement.querySelector('.ct-card[data-state="active"]');
    expect(active).toBeInTheDocument();
  },
};

export const SpecDatasheet = {
  render: () => `
  <div class="ct-specs" style="max-width: 560px;">
    <div class="ct-spec ct-spec--origin">
      <div class="ct-spec__value">40<small>+</small></div>
      <span class="ct-spec__label">Components</span>
    </div>
    <div class="ct-spec">
      <div class="ct-spec__value">3</div>
      <span class="ct-spec__label">Themes</span>
    </div>
    <div class="ct-spec">
      <div class="ct-spec__value">AA</div>
      <span class="ct-spec__label">WCAG 2.1</span>
    </div>
    <div class="ct-spec">
      <div class="ct-spec__value">0<small>kb</small></div>
      <span class="ct-spec__label">Runtime JS</span>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const specs = canvasElement.querySelectorAll('.ct-spec');
    expect(specs.length).toBe(4);
  },
};
