/**
 * A decorator is a way to wrap a story in extra “rendering” functionality. Many addons define decorators
 * in order to augment stories:
 * - with extra rendering
 * - gather details about how a story is rendered
 *
 * When writing stories, decorators are typically used to wrap stories with extra markup or context mocking.
 *
 * https://storybook.js.org/docs/react/writing-stories/decorators
 */
import type { ProjectAnnotations, Renderer } from 'storybook/internal/types';
import { generateMermaidUrl, getIframeStyle, getIframeStyleString } from './utils/mermaid';
import React from 'react';

const preview: ProjectAnnotations<Renderer> = {
  decorators: [
    (Story, context) => {
      const { parameters, renderer } = context;
      const mmd = parameters.mermaid;

      if (mmd && typeof mmd === 'string') {
        const { mermaidBaseUrl: baseUrl, mermaidMinHeight: minHeight, mermaidTheme: theme } = parameters;
        const url = generateMermaidUrl(mmd, theme, baseUrl);

        const rendererStr = renderer || parameters.renderer || 'unknown';
        const isReact = rendererStr.includes('react');

        if (isReact && typeof React !== 'undefined' && React.createElement) {
          try {
            return React.createElement('iframe', {
              src: url,
              style: getIframeStyle(minHeight),
            });
          } catch {
            // ignore
          }
        }

        // fallback for HTML/others
        return {
          template: `<iframe src="${url}" style="${getIframeStyleString(minHeight)}" />`,
        };
      }

      return Story();
    },
  ],
};

export default preview;
