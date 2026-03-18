import type { Preview } from '@storybook/vue3-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  initialGlobals: {
    background: { value: 'light' },
  },
};

export default preview;
