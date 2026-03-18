import type { Renderer, StoryContext, PartialStoryFn as StoryFunction } from 'storybook/internal/types';
import { KEY } from '../constants';
import { generateMermaidUrl, getIframeStyle, getIframeStyleString } from '../utils/mermaid';
import React from 'react';

export const appendViewer = (StoryFn: StoryFunction<Renderer>, context: StoryContext<Renderer>) => {
  const canvas = context.canvasElement as ParentNode;
  const mmd = context.parameters.mermaid as string;

  if (mmd) {
    const url = generateMermaidUrl(mmd);
    const renderer: string = context.renderer || context.parameters.renderer || 'unknown';
    const isReact = renderer.includes('react');

    if (isReact && typeof React !== 'undefined' && React.createElement) {
      try {
        return React.createElement('iframe', {
          src: url,
          style: getIframeStyle(),
        });
      } catch {
        // ignore
      }
    }

    const $iframe = canvas.querySelector(`[data-id="${KEY}"]`) || canvas.appendChild(document.createElement('iframe'));
    $iframe.setAttribute('data-id', KEY);
    $iframe.setAttribute('src', generateMermaidUrl(mmd));
    $iframe.setAttribute('style', getIframeStyleString());
  }

  return StoryFn();
};
