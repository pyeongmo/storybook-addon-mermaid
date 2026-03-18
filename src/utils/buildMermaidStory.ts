import { generateMermaidUrl, getIframeStyle, getIframeStyleString } from './mermaid';
import React from 'react';

export interface MermaidStoryOptions {
  theme?: string;
  baseUrl?: string;
  minHeight?: string;
  layout?: 'fullscreen' | 'centered' | 'padded';
}

/**
 * Build a Storybook story for a Mermaid diagram.
 * Defaults to Vue-compatible story format.
 */
export function buildMermaidStory(mmd: string, options: MermaidStoryOptions = {}) {
  const { theme, baseUrl, minHeight, layout = 'fullscreen' } = options;
  const url = generateMermaidUrl(mmd, theme, baseUrl);
  return {
    parameters: {
      layout,
      docs: { source: { code: mmd } },
    },
    render: () => {
      return {
        template: `<iframe src="${url}" style="${getIframeStyleString(minHeight)}" />`,
      };
    },
  };
}

/**
 * Specifically, build a React-compatible story for a Mermaid diagram.
 */
export function buildMermaidStoryReact(mmd: string, options: MermaidStoryOptions = {}) {
  const { theme, baseUrl, minHeight, layout = 'fullscreen' } = options;
  const url = generateMermaidUrl(mmd, theme, baseUrl);

  return {
    parameters: {
      layout,
      docs: { source: { code: mmd } },
    },
    render: () => {
      const style = getIframeStyle(minHeight);
      const inNewTab = typeof window !== 'undefined' && window.location.search.includes('viewMode=story');
      const className = `w-full ${inNewTab ? 'h-screen' : ''}`;

      try {
        // We try to use React if available
        return React.createElement('iframe', {
          src: url,
          style: style,
          className: className,
        });
      } catch {
        return `<iframe src="${url}" style="${getIframeStyleString(minHeight)}" class="${className}"></iframe>`;
      }
    },
  };
}
