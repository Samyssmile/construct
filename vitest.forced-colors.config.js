import { browserContractConfig } from './vitest.browser-contract.js';

export default browserContractConfig({
  include: 'tests/forced-colors.test.js',
  contextOptions: {
    forcedColors: 'active',
    viewport: { width: 1280, height: 720 },
  },
});
