import { defineMain } from '@storybook/vue3-vite/node';

const config = defineMain({
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs', import.meta.resolve('./local-preset.ts')],
  framework: '@storybook/vue3-vite',
});

export default config;
