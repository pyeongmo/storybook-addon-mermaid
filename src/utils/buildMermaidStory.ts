import { generateMermaidUrl } from './mermaid';
import React from 'react';

export interface MermaidStoryOptions {
  theme?: string;
  layout?: 'fullscreen' | 'centered' | 'padded';
}

/**
 * Build a Storybook story for a Mermaid diagram.
 * Defaults to Vue-compatible story format.
 */
export function buildMermaidStory(mmd: string, options: MermaidStoryOptions = {}) {
  const url = generateMermaidUrl(mmd, options.theme);

  return {
    parameters: {
      layout: options.layout || 'fullscreen',
      docs: { source: { code: mmd } },
    },
    render: (args: unknown, context?: { renderer?: string }) => {
      // We use a generic approach to handle different frameworks.
      // Most frameworks (Vue, HTML, Svelte) can handle a string or an object with template.

      const inNewTab = typeof window !== 'undefined' && window.location.search.includes('viewMode=story');
      let style = 'width: 100%; min-height: 40rem; border: none;';
      if (inNewTab) {
        style += 'height: 100svh;';
      }

      // Detection for Vue
      const isVue = context?.renderer === 'vue3' || context?.renderer === 'vue';

      if (isVue) {
        return {
          setup() {
            return { url, style, inNewTab };
          },
          template: `<iframe v-if="url" :src="url" :style="style" />`,
        };
      }

      // Default to iframe string (works for HTML renderer)
      return `<iframe src="${url}" style="${style}"></iframe>`;
    },
  };
}

/**
 * Specifically build a React-compatible story for a Mermaid diagram.
 */
export function buildMermaidStoryReact(mmd: string, options: MermaidStoryOptions = {}) {
  const url = generateMermaidUrl(mmd, options.theme);

  return {
    parameters: {
      layout: options.layout || 'fullscreen',
      docs: { source: { code: mmd } },
    },
    render: () => {
      const inNewTab = typeof window !== 'undefined' && window.location.search.includes('viewMode=story');
      const style = { width: '100%', minHeight: '40rem', border: 'none' };
      const className = `w-full min-h-160 ${inNewTab ? 'h-screen' : ''}`;

      try {
        // We try to use React if available
        return React.createElement('iframe', {
          src: url,
          style: style,
          className: className,
        });
      } catch {
        return `<iframe src="${url}" style="width: 100%; min-height: 40rem; border: none;" class="${className}"></iframe>`;
      }
    },
  };
}
