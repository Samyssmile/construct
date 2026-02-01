import '../foundations.css';
import '../components/components.css';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

export const parameters = {
  layout: 'centered',

  backgrounds: {
    options: {
      canvas: { name: 'canvas', value: 'var(--color-bg-canvas)' },
      surface: { name: 'surface', value: 'var(--color-bg-surface)' },
      muted: { name: 'muted', value: 'var(--color-bg-muted)' }
    }
  },

  a11y: {
    // 'todo' - show a11y violations in the test UI only
    // 'error' - fail CI on a11y violations
    // 'off' - skip a11y checks entirely
    test: 'error'
  }
};

export const initialGlobals = {
  backgrounds: {
    value: 'canvas'
  }
};
export const tags = ['autodocs'];

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      Light: 'light',
      Dark: 'dark',
      'High Contrast': 'high-contrast'
    },
    defaultTheme: 'Light',
    attributeName: 'data-theme'
  })
];
