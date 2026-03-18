# Storybook Mermaid Addon

Import and view `.mmd` (Mermaid) files in your Storybook.

## Installation

```sh
pnpm add -D storybook-addon-mermaid
```

Then, register it in `.storybook/main.ts`:

```ts
// .storybook/main.ts
const config: StorybookConfig = {
  addons: [
    'storybook-addon-mermaid',
  ],
};
```

## Usage

### Example usage

```ts
import mmd from './diagram.mmd';
import { buildMermaidStory } from 'storybook-addon-mermaid';

export default { title: 'Diagrams' };
export const MyDiagram = buildMermaidStory(mmd);
```

### Components

The addon also provides `MermaidViewer` components for React and Vue.

#### React

```tsx
import { MermaidViewer } from 'storybook-addon-mermaid';

export default { title: 'React/Mermaid' };
export const Simple = () => <MermaidViewer mmd="graph TD; A-->B;" />;
```

#### Custom Story with `buildMermaidStoryReact`

```tsx
import { buildMermaidStoryReact } from 'storybook-addon-mermaid';

export default { title: 'React/Mermaid' };
export const FromText = buildMermaidStoryReact("graph TD; A-->B;");
```

#### Vue

```vue
<!-- MyStory.stories.vue -->
<script setup lang="ts">
import { MermaidViewerVue } from 'storybook-addon-mermaid';
import diagram from './diagram.mmd';
</script>

<template>
  <MermaidViewerVue :mmd="diagram" />
</template>
```

#### Custom Story with `buildMermaidStory`

```ts
import { buildMermaidStory } from 'storybook-addon-mermaid';
import diagram from './diagram.mmd';

export default { title: 'Vue/Mermaid' };
export const FromFile = buildMermaidStory(diagram);
```

### Parameters

You can also use the `mermaid` parameter to render a diagram in any story.

```ts
export default {
  title: 'Parameters/Mermaid',
};

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
```

### Options for `buildMermaidStory` and `buildMermaidStoryReact`

You can pass an options object as a second argument.

```ts
export const CustomOptions = buildMermaidStory(mmd, {
  theme: 'forest',
  baseUrl: 'https://mermaid.live',
  minHeight: '30rem',
});
```
