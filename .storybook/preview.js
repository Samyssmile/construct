import '../foundations.css';
import '../components/components.css';

export const parameters = {
  layout: 'centered',

  backgrounds: {
    options: {
      canvas: { name: 'canvas', value: '#FFFFFF' },
      surface: { name: 'surface', value: '#F5F7FA' },
      muted: { name: 'muted', value: '#E9EEF4' }
    }
  },

  a11y: {
    // 'todo' - show a11y violations in the test UI only
    // 'error' - fail CI on a11y violations
    // 'off' - skip a11y checks entirely
    test: 'todo'
  }
};

export const initialGlobals = {
  backgrounds: {
    value: 'canvas'
  }
};
export const tags = ['autodocs'];
