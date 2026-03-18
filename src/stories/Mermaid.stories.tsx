import type { Meta } from '@storybook/react-vite';
import { buildMermaidStoryReact } from '../utils/buildMermaidStory';
import mmd from './example.mmd';

const meta: Meta = {
  title: 'Mermaid/Example',
};

export default meta;

export const Default = buildMermaidStoryReact(mmd);

export const UsingParameter = {
  parameters: {
    mermaid: `
graph TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    B -- No --> D[Not OK]
`,
  },
};
