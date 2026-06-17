import { expect, within, userEvent } from 'storybook/test';

/* ──────────────────────────────────────────────────────────────────────────
 * Geometry helpers
 *
 * `ct-chart` is a styling skin only — the consuming layer produces the SVG
 * geometry. These helpers mimic that layer so the stories render real charts
 * and exercise the markup contract (series colour via currentColor, the
 * accessible data-table fallback, the toggle wiring).
 * ────────────────────────────────────────────────────────────────────────── */

const f = (n) => Number(n.toFixed(2));

function makeScales({ width, height, pad, count, max }) {
  const x = (i) => pad.l + (i / (count - 1)) * (width - pad.l - pad.r);
  const y = (v) => height - pad.b - (v / max) * (height - pad.t - pad.b);
  return { x, y, baseY: height - pad.b };
}

const linePath = (values, x, y) =>
  values.map((v, i) => `${i === 0 ? 'M' : 'L'}${f(x(i))} ${f(y(v))}`).join(' ');

const areaPath = (values, x, y, baseY) =>
  `${linePath(values, x, y)} L${f(x(values.length - 1))} ${f(baseY)} L${f(x(0))} ${f(baseY)} Z`;

const polar = (cx, cy, r, a) => [f(cx + r * Math.cos(a)), f(cy + r * Math.sin(a))];

function donutSlice(cx, cy, rO, rI, a0, a1) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = polar(cx, cy, rO, a0);
  const [x1, y1] = polar(cx, cy, rO, a1);
  const [x2, y2] = polar(cx, cy, rI, a1);
  const [x3, y3] = polar(cx, cy, rI, a0);
  return `M${x0} ${y0} A${rO} ${rO} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${rI} ${rI} 0 ${large} 0 ${x3} ${y3} Z`;
}

/* ── Markup helpers (the accessible contract) ── */

function dataTable(id, caption, headers, rows) {
  const head = headers.map((h) => `<th scope="col">${h}</th>`).join('');
  const body = rows
    .map(
      (r) =>
        `<tr><th scope="row">${r[0]}</th>${r
          .slice(1)
          .map((c) => `<td>${c}</td>`)
          .join('')}</tr>`
    )
    .join('');
  return `<div class="ct-chart__table-wrap" id="${id}">
      <table class="ct-chart__table">
        <caption>${caption}</caption>
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

const tableToggle = (tableId, label = 'Datentabelle anzeigen') =>
  `<div class="ct-chart__toolbar">
      <button type="button" class="ct-chart__toggle" aria-expanded="false" aria-controls="${tableId}">${label}</button>
    </div>`;

const legend = (items) =>
  `<ul class="ct-chart__legend" role="list">${items
    .map(
      (it) =>
        `<li class="ct-chart__legend-item"><span class="ct-chart__legend-marker ${
          it.line ? 'ct-chart__legend-marker--line ' : ''
        }ct-chart__series--${it.series}" aria-hidden="true"></span>${it.label}</li>`
    )
    .join('')}</ul>`;

/* Attach the consumer-side toggle behaviour so the demo is interactive. In a
 * real app this lives in the framework component; the skin only styles it. */
function fromHTML(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  return tpl.content.firstElementChild;
}

function wireToggle(node) {
  const btn = node.querySelector('.ct-chart__toggle');
  if (!btn) return node;
  btn.addEventListener('click', () => {
    const open = node.classList.toggle('ct-chart--show-table');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Datentabelle ausblenden' : 'Datentabelle anzeigen';
  });
  return node;
}

/* ── Shared data ── */
const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'];

export default {
  title: 'Data Display/Chart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Framework-agnostic styling skin for SVG data-visualisation primitives (line/area, bar, donut, gauge, sparkline). ' +
          'The geometry is produced by the consuming layer; `ct-chart` themes the resulting SVG plus the accessible data-table fallback every chart ships with. ' +
          'Series colour is carried via `color` on a `.ct-chart__series--N` element and read back through `currentColor`, so line, fill, dots and legend swatch share one source of truth. ' +
          'Accessibility contract: the `<svg>` is `role="img"` with a `<title>`/`<desc>`, the full data lives in an always-present (visually-hidden) `<table>` revealed via `.ct-chart--show-table`, and the toggle button wires `aria-expanded` + `aria-controls`.',
      },
    },
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * Line / area — multi-series
 * ────────────────────────────────────────────────────────────────────────── */
export const LineArea = {
  render: () => {
    const W = 360;
    const H = 200;
    const PAD = { l: 38, r: 14, t: 14, b: 30 };
    const visitors = [120, 150, 140, 180, 210, 240];
    const conversions = [40, 55, 50, 70, 85, 110];
    const ticks = [0, 50, 100, 150, 200, 250];
    const { x, y, baseY } = makeScales({ width: W, height: H, pad: PAD, count: MONTHS.length, max: 250 });

    const grid = ticks
      .map((t) => `<line class="ct-chart__grid-line" x1="${f(PAD.l)}" y1="${f(y(t))}" x2="${f(W - PAD.r)}" y2="${f(y(t))}" />`)
      .join('');
    const yLabels = ticks
      .map((t) => `<text class="ct-chart__tick-label" x="${f(PAD.l - 6)}" y="${f(y(t) + 3)}" text-anchor="end">${t}</text>`)
      .join('');
    const xLabels = MONTHS.map(
      (m, i) => `<text class="ct-chart__tick-label" x="${f(x(i))}" y="${f(H - PAD.b + 16)}" text-anchor="middle">${m}</text>`
    ).join('');
    const axes = `<line class="ct-chart__axis-line" x1="${f(PAD.l)}" y1="${f(PAD.t)}" x2="${f(PAD.l)}" y2="${f(baseY)}" />
      <line class="ct-chart__axis-line" x1="${f(PAD.l)}" y1="${f(baseY)}" x2="${f(W - PAD.r)}" y2="${f(baseY)}" />`;

    const seriesG = (values, series, hollow) =>
      `<g class="ct-chart__series--${series}">
        <path class="ct-chart__area" d="${areaPath(values, x, y, baseY)}" />
        <path class="ct-chart__line" d="${linePath(values, x, y)}" />
        ${values
          .map((v, i) => `<circle class="ct-chart__dot${hollow ? ' ct-chart__dot--hollow' : ''}" cx="${f(x(i))}" cy="${f(y(v))}" r="3" />`)
          .join('')}
      </g>`;

    return `<div class="ct-chart" style="max-width: 440px;">
      <figure class="ct-chart__figure">
        ${tableToggle('la-table')}
        <svg class="ct-chart__svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="la-title" aria-describedby="la-desc">
          <title id="la-title">Besucher und Conversions, Januar bis Juni 2026</title>
          <desc id="la-desc">Liniendiagramm mit zwei steigenden Serien über sechs Monate.</desc>
          ${grid}${axes}${yLabels}${xLabels}
          ${seriesG(visitors, 1, false)}
          ${seriesG(conversions, 2, true)}
        </svg>
        ${legend([
          { series: 1, label: 'Besucher', line: true },
          { series: 2, label: 'Conversions', line: true },
        ])}
        ${dataTable(
          'la-table',
          'Besucher und Conversions je Monat',
          ['Monat', 'Besucher', 'Conversions'],
          MONTHS.map((m, i) => [m, visitors[i], conversions[i]])
        )}
      </figure>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('.ct-chart__svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-labelledby', 'la-title');
    expect(canvasElement.querySelector('#la-title')).toBeInTheDocument();

    // Two series, each coloured via a series modifier (single source of truth)
    expect(canvasElement.querySelectorAll('.ct-chart__line')).toHaveLength(2);
    expect(canvasElement.querySelector('.ct-chart__series--1')).toBeInTheDocument();
    expect(canvasElement.querySelector('.ct-chart__series--2')).toBeInTheDocument();

    // Legend uses role="list" (survives list-style:none in Safari/VoiceOver)
    expect(canvasElement.querySelector('.ct-chart__legend')).toHaveAttribute('role', 'list');

    // Always-present data-table fallback wired to the toggle
    const btn = within(canvasElement).getByRole('button');
    expect(btn).toHaveAttribute('aria-controls', 'la-table');
    expect(canvasElement.querySelector('#la-table .ct-chart__table tbody tr')).toBeInTheDocument();
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * Bars — single series
 * ────────────────────────────────────────────────────────────────────────── */
export const Bars = {
  render: () => {
    const W = 360;
    const H = 200;
    const PAD = { l: 32, r: 14, t: 14, b: 30 };
    const data = [24, 32, 28, 40, 52, 48];
    const ticks = [0, 20, 40, 60];
    const { x, y, baseY } = makeScales({ width: W, height: H, pad: PAD, count: MONTHS.length, max: 60 });
    const band = (W - PAD.l - PAD.r) / data.length;
    const bw = band * 0.6;

    const grid = ticks
      .map((t) => `<line class="ct-chart__grid-line" x1="${f(PAD.l)}" y1="${f(y(t))}" x2="${f(W - PAD.r)}" y2="${f(y(t))}" />`)
      .join('');
    const yLabels = ticks
      .map((t) => `<text class="ct-chart__tick-label" x="${f(PAD.l - 6)}" y="${f(y(t) + 3)}" text-anchor="end">${t}</text>`)
      .join('');
    const xLabels = MONTHS.map(
      (m, i) => `<text class="ct-chart__tick-label" x="${f(PAD.l + band * i + band / 2)}" y="${f(H - PAD.b + 16)}" text-anchor="middle">${m}</text>`
    ).join('');
    const bars = data
      .map((v, i) => {
        const bx = PAD.l + band * i + (band - bw) / 2;
        return `<rect class="ct-chart__bar ct-chart__series--1" x="${f(bx)}" y="${f(y(v))}" width="${f(bw)}" height="${f(baseY - y(v))}" />`;
      })
      .join('');

    return `<div class="ct-chart" style="max-width: 440px;">
      <figure class="ct-chart__figure">
        ${tableToggle('bar-table')}
        <svg class="ct-chart__svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="bar-title">
          <title id="bar-title">Bestellungen je Monat, Januar bis Juni 2026</title>
          ${grid}
          <line class="ct-chart__axis-line" x1="${f(PAD.l)}" y1="${f(baseY)}" x2="${f(W - PAD.r)}" y2="${f(baseY)}" />
          ${yLabels}${xLabels}${bars}
        </svg>
        ${dataTable('bar-table', 'Bestellungen je Monat', ['Monat', 'Bestellungen'], MONTHS.map((m, i) => [m, data[i]]))}
      </figure>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelectorAll('.ct-chart__bar')).toHaveLength(6);
    expect(canvasElement.querySelector('.ct-chart__svg')).toHaveAttribute('role', 'img');
    expect(canvasElement.querySelectorAll('#bar-table tbody tr')).toHaveLength(6);
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * Donut
 * ────────────────────────────────────────────────────────────────────────── */
export const Donut = {
  render: () => {
    const cx = 90;
    const cy = 90;
    const slices = [
      { label: 'Direkt', value: 40, series: 1 },
      { label: 'Suche', value: 25, series: 2 },
      { label: 'Social', value: 20, series: 3 },
      { label: 'E-Mail', value: 15, series: 4 },
    ];
    let a = -Math.PI / 2;
    const paths = slices
      .map((s) => {
        const a1 = a + (s.value / 100) * 2 * Math.PI;
        const d = donutSlice(cx, cy, 80, 52, a, a1);
        a = a1;
        return `<path class="ct-chart__slice ct-chart__series--${s.series}" d="${d}" />`;
      })
      .join('');

    return `<div class="ct-chart" style="max-width: 320px;">
      <figure class="ct-chart__figure">
        ${tableToggle('donut-table')}
        <svg class="ct-chart__svg" viewBox="0 0 180 180" role="img" aria-labelledby="donut-title">
          <title id="donut-title">Traffic-Quellen, Anteil in Prozent</title>
          ${paths}
          <text class="ct-chart__donut-value" x="${cx}" y="${cy + 2}" text-anchor="middle">100%</text>
          <text class="ct-chart__donut-label" x="${cx}" y="${cy + 20}" text-anchor="middle">Sitzungen</text>
        </svg>
        ${legend(slices.map((s) => ({ series: s.series, label: `${s.label} (${s.value}%)` })))}
        ${dataTable('donut-table', 'Traffic-Quellen', ['Quelle', 'Anteil'], slices.map((s) => [s.label, `${s.value}%`]))}
      </figure>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelectorAll('.ct-chart__slice')).toHaveLength(4);
    // Each slice carries a distinct series modifier
    [1, 2, 3, 4].forEach((n) =>
      expect(canvasElement.querySelector(`.ct-chart__slice.ct-chart__series--${n}`)).toBeInTheDocument()
    );
    expect(canvasElement.querySelector('.ct-chart__donut-value').textContent).toContain('100%');
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * Gauge
 * ────────────────────────────────────────────────────────────────────────── */
export const Gauge = {
  render: () => {
    const cx = 110;
    const cy = 110;
    const r = 88;
    const pct = 72;
    const arc = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
    return `<div class="ct-chart" style="max-width: 280px;">
      <figure class="ct-chart__figure">
        <svg class="ct-chart__svg" viewBox="0 0 220 130" role="img" aria-labelledby="gauge-title">
          <title id="gauge-title">Speicher genutzt: 72 Prozent</title>
          <path class="ct-chart__gauge-track" d="${arc}" pathLength="100" />
          <path class="ct-chart__gauge-value ct-chart__gauge-value--success" d="${arc}" pathLength="100"
                style="stroke-dasharray: 100; stroke-dashoffset: ${100 - pct};" />
          <text class="ct-chart__gauge-text" x="${cx}" y="${cy - 14}" text-anchor="middle">${pct}%</text>
          <text class="ct-chart__gauge-caption" x="${cx}" y="${cy + 8}" text-anchor="middle">Speicher genutzt</text>
        </svg>
      </figure>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const value = canvasElement.querySelector('.ct-chart__gauge-value');
    expect(value).toHaveClass('ct-chart__gauge-value--success');
    expect(value.style.strokeDashoffset).toBe('28');
    expect(canvasElement.querySelector('.ct-chart__svg')).toHaveAttribute('aria-labelledby', 'gauge-title');
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * Sparkline — glanceable inline trend (concise label is the a11y path)
 * ────────────────────────────────────────────────────────────────────────── */
export const Sparkline = {
  render: () => {
    const data = [4, 6, 5, 8, 7, 9, 11, 10, 13];
    const W = 120;
    const H = 32;
    const PAD = { l: 2, r: 2, t: 4, b: 4 };
    const { x, y, baseY } = makeScales({ width: W, height: H, pad: PAD, count: data.length, max: 14 });
    return `<div style="display: flex; align-items: center; gap: var(--space-4);">
      <span style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold);">€13k</span>
      <span class="ct-chart ct-chart--sparkline">
        <svg class="ct-chart__svg ct-chart__series--3" viewBox="0 0 ${W} ${H}" role="img" aria-label="Umsatztrend der letzten 9 Wochen, steigend von 4k auf 13k">
          <path class="ct-chart__area" d="${areaPath(data, x, y, baseY)}" />
          <path class="ct-chart__line" d="${linePath(data, x, y)}" />
        </svg>
      </span>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('.ct-chart--sparkline .ct-chart__svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label');
    expect(svg).toHaveClass('ct-chart__series--3');
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * Empty state
 * ────────────────────────────────────────────────────────────────────────── */
export const EmptyState = {
  render: () => `<div style="display: flex; flex-direction: column; gap: var(--space-6); max-width: 440px;">
      <div class="ct-chart">
        <figure class="ct-chart__figure">
          <div class="ct-chart__empty">Keine Daten für den ausgewählten Zeitraum.</div>
        </figure>
      </div>
      <div style="display: flex; align-items: center; gap: var(--space-4);">
        <span style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Inline-Sparkline ohne Daten:</span>
        <span class="ct-chart ct-chart--sparkline"><span class="ct-chart__empty" aria-label="Keine Daten">—</span></span>
      </div>
    </div>`,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('.ct-chart__empty').textContent).toContain('Keine Daten');
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * Data-table fallback — interactive toggle (the accessible contract in action)
 * ────────────────────────────────────────────────────────────────────────── */
export const DataTableToggle = {
  parameters: {
    docs: {
      description: {
        story:
          'The data-table is always in the DOM (visually hidden) so assistive tech can reach it. ' +
          'Toggling `.ct-chart--show-table` reveals it for everyone; the button reflects state via `aria-expanded` and points at the table via `aria-controls`.',
      },
    },
  },
  render: () => {
    const data = [24, 32, 28, 40, 52, 48];
    const W = 360;
    const H = 180;
    const PAD = { l: 32, r: 14, t: 14, b: 30 };
    const { y, baseY } = makeScales({ width: W, height: H, pad: PAD, count: data.length, max: 60 });
    const band = (W - PAD.l - PAD.r) / data.length;
    const bw = band * 0.6;
    const bars = data
      .map((v, i) => {
        const bx = PAD.l + band * i + (band - bw) / 2;
        return `<rect class="ct-chart__bar ct-chart__series--1" x="${f(bx)}" y="${f(y(v))}" width="${f(bw)}" height="${f(baseY - y(v))}" />`;
      })
      .join('');

    return wireToggle(
      fromHTML(`<div class="ct-chart" style="max-width: 440px;">
        <figure class="ct-chart__figure">
          ${tableToggle('dt-table')}
          <svg class="ct-chart__svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="dt-title">
            <title id="dt-title">Bestellungen je Monat</title>
            <line class="ct-chart__axis-line" x1="${f(PAD.l)}" y1="${f(baseY)}" x2="${f(W - PAD.r)}" y2="${f(baseY)}" />
            ${bars}
          </svg>
          ${dataTable('dt-table', 'Bestellungen je Monat', ['Monat', 'Bestellungen'], MONTHS.map((m, i) => [m, data[i]]))}
        </figure>
      </div>`)
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chart = canvasElement.querySelector('.ct-chart');
    const btn = canvas.getByRole('button', { name: /anzeigen/i });

    // Collapsed initial state
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(btn).toHaveAttribute('aria-controls', 'dt-table');
    expect(chart.classList.contains('ct-chart--show-table')).toBe(false);

    // Reveal
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(chart.classList.contains('ct-chart--show-table')).toBe(true);

    // The controlled table is present and complete
    const rows = canvasElement.querySelectorAll('#dt-table tbody tr');
    expect(rows).toHaveLength(6);

    // Collapse again
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(chart.classList.contains('ct-chart--show-table')).toBe(false);
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * Visible data-table (static) — exercises the revealed table's a11y/contrast
 * ────────────────────────────────────────────────────────────────────────── */
export const VisibleDataTable = {
  render: () =>
    `<div class="ct-chart ct-chart--show-table" style="max-width: 440px;">
      <figure class="ct-chart__figure">
        ${dataTable('vt-table', 'Bestellungen je Monat', ['Monat', 'Bestellungen'], MONTHS.map((m, i) => [m, [24, 32, 28, 40, 52, 48][i]]))}
      </figure>
    </div>`,
  play: async ({ canvasElement }) => {
    const wrap = canvasElement.querySelector('.ct-chart__table-wrap');
    // Revealed: not clipped to 1px
    expect(wrap.getBoundingClientRect().height).toBeGreaterThan(10);
    expect(canvasElement.querySelectorAll('thead th[scope="col"]')).toHaveLength(2);
    expect(canvasElement.querySelectorAll('tbody th[scope="row"]')).toHaveLength(6);
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * Keyboard-focusable marks — optional enhancement; validates focus parity.
 * The data-table remains the primary structured AT path; here each bar is
 * additionally exposed as a focusable point with its own <title> name.
 * ────────────────────────────────────────────────────────────────────────── */
export const KeyboardFocusableBars = {
  parameters: {
    docs: {
      description: {
        story:
          'When the consuming layer makes individual marks keyboard-focusable (`tabindex="0"`), they receive the same visible affordance as `:hover` via `:focus-visible`. Each focusable bar carries an SVG `<title>` as its accessible name.',
      },
    },
  },
  render: () => {
    const W = 360;
    const H = 180;
    const PAD = { l: 32, r: 14, t: 14, b: 30 };
    const data = [24, 32, 28, 40, 52, 48];
    const { y, baseY } = makeScales({ width: W, height: H, pad: PAD, count: data.length, max: 60 });
    const band = (W - PAD.l - PAD.r) / data.length;
    const bw = band * 0.6;
    const bars = data
      .map((v, i) => {
        const bx = PAD.l + band * i + (band - bw) / 2;
        return `<rect class="ct-chart__bar ct-chart__series--1" tabindex="0" x="${f(bx)}" y="${f(y(v))}" width="${f(bw)}" height="${f(baseY - y(v))}"><title>${MONTHS[i]}: ${v} Bestellungen</title></rect>`;
      })
      .join('');

    return `<div class="ct-chart" style="max-width: 440px;">
      <figure class="ct-chart__figure">
        <svg class="ct-chart__svg" viewBox="0 0 ${W} ${H}" aria-label="Bestellungen je Monat, interaktiv — mit Pfeil-/Tab-Tasten navigierbar">
          <line class="ct-chart__axis-line" x1="${f(PAD.l)}" y1="${f(baseY)}" x2="${f(W - PAD.r)}" y2="${f(baseY)}" />
          ${bars}
        </svg>
        ${dataTable('kb-table', 'Bestellungen je Monat', ['Monat', 'Bestellungen'], MONTHS.map((m, i) => [m, data[i]]))}
      </figure>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll('.ct-chart__bar');
    expect(bars).toHaveLength(6);
    bars.forEach((b) => expect(b).toHaveAttribute('tabindex', '0'));
    // Each focusable mark has an accessible name via <title>
    expect(bars[0].querySelector('title').textContent).toContain('Jan');
    // Focus parity: the mark is reachable and becomes the active element
    bars[0].focus();
    expect(document.activeElement).toBe(bars[0]);
  },
};
