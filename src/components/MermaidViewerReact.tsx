import React, { useMemo } from 'react';
import { generateMermaidUrl, getIframeStyle } from '../utils/mermaid';

export interface MermaidViewerProps {
  mmd: string;
  theme?: string;
  baseUrl?: string;
  minHeight?: string;
}

export const MermaidViewer = ({ mmd, theme, baseUrl, minHeight }: MermaidViewerProps) => {
  const previewUrl = useMemo(() => generateMermaidUrl(mmd, theme, baseUrl), [mmd, theme, baseUrl]);

  if (!previewUrl) return null;

  return <iframe src={previewUrl} style={getIframeStyle(minHeight)} />;
};
