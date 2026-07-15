import { browserContractConfig } from './vitest.browser-contract.js';

export default browserContractConfig({
  include: 'tests/touch-targets.test.js',
  contextOptions: {
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  },
});
