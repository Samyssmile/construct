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
    <p class="ct-muted" style="margin: var(--space-3) 0 0;">One source of truth for reusable visual decisions.</p>
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
      <span class="ct-spec__label">WCAG 2.2 target</span>
    </div>
    <div class="ct-spec">
      <div class="ct-spec__value">0<small>kb</small></div>
      <span class="ct-spec__label">CSS-only runtime JS</span>
    </div>
  </div>`,
  play: async ({ canvasElement }) => {
    const specs = canvasElement.querySelectorAll('.ct-spec');
    expect(specs.length).toBe(4);
  },
};

export const Metrics = {
  parameters: {
    docs: {
      description: {
        story:
          '`ct-metric` is the semantic successor to `ct-spec`. It supports `<dl>` markup, tabular values, active state, and visible semantic status text. Existing `ct-spec` markup remains supported.',
      },
    },
  },
  render: () => `
  <dl class="ct-metrics" aria-label="Service metrics" style="max-width: 760px;">
    <div class="ct-metric ct-metric--active" data-state="active">
      <dt class="ct-metric__label">Requests</dt>
      <dd class="ct-metric__value">12,480
        <span class="ct-metric__meta"><span>Last hour</span><span class="ct-metric__status">Active</span></span>
      </dd>
    </div>
    <div class="ct-metric" data-status="success">
      <dt class="ct-metric__label">Availability</dt>
      <dd class="ct-metric__value">99.98<small>%</small>
        <span class="ct-metric__meta"><span>30 days</span><span class="ct-metric__status">Healthy</span></span>
      </dd>
    </div>
    <div class="ct-metric" data-status="warning">
      <dt class="ct-metric__label">Latency</dt>
      <dd class="ct-metric__value">248<small>ms</small>
        <span class="ct-metric__meta"><span>P95</span><span class="ct-metric__status">Elevated</span></span>
      </dd>
    </div>
    <div class="ct-metric" data-status="error" data-state="error">
      <dt class="ct-metric__label">Failed jobs</dt>
      <dd class="ct-metric__value">17
        <span class="ct-metric__meta"><span>Today</span><span class="ct-metric__status">Needs attention</span></span>
      </dd>
    </div>
  </dl>`,
  play: async ({ canvasElement }) => {
    const metrics = canvasElement.querySelectorAll('.ct-metric');
    expect(metrics).toHaveLength(4);
    expect(metrics[0]).toHaveAttribute('data-state', 'active');
    expect(metrics[1]).toHaveAttribute('data-status', 'success');
    expect(metrics[2]).toHaveAttribute('data-status', 'warning');
    expect(metrics[3]).toHaveAttribute('data-state', 'error');

    for (const metric of metrics) {
      expect(metric.querySelector('.ct-metric__label').textContent.trim().length).toBeGreaterThan(0);
      expect(metric.querySelector('.ct-metric__value').textContent.trim().length).toBeGreaterThan(0);
      expect(metric.querySelector('.ct-metric__status').textContent.trim().length).toBeGreaterThan(0);
      expect(getComputedStyle(metric.querySelector('.ct-metric__value')).fontVariantNumeric).toContain('tabular-nums');
    }
  },
};

export const MetricThemeMatrix = {
  name: 'Metrics Across Themes',
  render: () => `
  <div style="display: grid; gap: var(--space-4);">
    ${['light', 'dark', 'high-contrast'].map(theme => `
      <section data-theme="${theme}" style="padding: var(--space-5); background: var(--color-bg-canvas); color: var(--color-text-primary); border-radius: var(--radius-md);">
        <h3 style="margin: 0 0 var(--space-4); font-size: var(--font-size-sm);">${theme}</h3>
        <dl class="ct-metrics">
          <div class="ct-metric" data-status="success">
            <dt class="ct-metric__label">Availability</dt>
            <dd class="ct-metric__value">99.9<small>%</small>
              <span class="ct-metric__meta"><span>30 days</span><span class="ct-metric__status">Healthy</span></span>
            </dd>
          </div>
          <div class="ct-metric" data-status="error">
            <dt class="ct-metric__label">Errors</dt>
            <dd class="ct-metric__value">12
              <span class="ct-metric__meta"><span>Today</span><span class="ct-metric__status">Investigating</span></span>
            </dd>
          </div>
        </dl>
      </section>`).join('')}
  </div>`,
  play: async ({ canvasElement }) => {
    const sections = canvasElement.querySelectorAll('[data-theme]');
    expect(sections).toHaveLength(3);
    for (const section of sections) {
      expect(section.querySelectorAll('.ct-metric')).toHaveLength(2);
    }
  },
};
