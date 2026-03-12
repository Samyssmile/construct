/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.stories.js', '../stories/docs/*.mdx'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
    '@storybook/addon-vitest'
  ],

  framework: {
    name: '@storybook/html-vite',
    options: {}
  }
};

export default config;
