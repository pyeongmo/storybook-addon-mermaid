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
export const FromFile = buildMermaidStoryReact("graph TD; A-->B;");
```

#### Vue

```vue
<!-- MyStory.stories.vue -->
<script setup lang="ts">
import { MermaidViewerVue } from 'storybook-addon-mermaid';
</script>

<template>
  <MermaidViewerVue mmd="graph TD; A-->B;" />
</template>
```

#### Custom Story with `buildMermaidStory`

```ts
import { buildMermaidStory } from 'storybook-addon-mermaid';

export default { title: 'Vue/Mermaid' };
export const FromFile = buildMermaidStory("graph TD; A-->B;");
```

### Creating a release

To create a release locally you can run the following command, otherwise the GitHub action will make the release for you.

```sh
npm run release
```

That will:

- Build and package the addon code
- Bump the version
- Push a release to GitHub and npm
- Push a changelog to GitHub
