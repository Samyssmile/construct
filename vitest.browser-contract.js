import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export const browserContractConfig = ({ include, contextOptions }) =>
  defineConfig({
    test: {
      include: [include],
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({ contextOptions }),
        instances: [{ browser: 'chromium' }],
      },
      retry: 2,
    },
  });
