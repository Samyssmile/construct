import { create } from 'storybook/theming';

/**
 * Construct manager theme.
 *
 * The Storybook chrome lives outside the preview iframe, so it cannot read the
 * `--ct-*` token variables. These values are the resolved LIGHT-theme tokens
 * (warm-concrete "stone" + ink + safety-orange) hard-coded so the chrome stays
 * faithful to the design system's visual identity.
 *
 * Accessibility note: safety-orange (#F4581C) on warm concrete is ~3.2:1 — fine
 * for the non-text "datum" edge added in CSS, but it fails AA as text. Anywhere
 * Storybook paints an accent as *text* (selected toolbar item, links) we use the
 * darker orange.700 (#B23C0C, ~5.7:1) instead.
 */
export default create({
  base: 'light',

  // Brand — the wordmark itself is styled in managerHead CSS (Lato + datum).
  brandTitle: 'Construct',
  brandUrl: 'https://samyssmile.github.io/construct',
  brandTarget: '_self',

  // Accents
  colorPrimary: '#16130F', // ink — brand.primary
  colorSecondary: '#16130F', // ink drives selected/links; the orange datum is a CSS edge

  // App chrome — warm concrete
  appBg: '#F1F0EB', // stone.100 — sidebar / chrome surface
  appContentBg: '#FAFAF8', // stone.50 — canvas
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E4E2DB', // stone.200
  appBorderRadius: 8,

  // Text
  textColor: '#16130F', // ink
  textInverseColor: '#FAFAF8',
  textMutedColor: '#66604E', // stone.600

  // Toolbar
  barTextColor: '#66604E', // stone.600
  barSelectedColor: '#B23C0C', // orange.700 — AA-safe as text
  barHoverColor: '#B23C0C',
  barBg: '#FFFFFF',

  // Form controls
  inputBg: '#FFFFFF',
  inputBorder: '#D3D0C7', // stone.300
  inputTextColor: '#16130F',
  inputBorderRadius: 8,

  // Type — same superfamily as the system
  fontBase: '"Lato", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  fontCode: '"JetBrains Mono", "SFMono-Regular", Menlo, monospace'
});
