import React, { useMemo } from 'react';
import { generateMermaidUrl } from '../utils/mermaid';

export interface MermaidViewerProps {
  mmd: string;
}

export const MermaidViewer = ({ mmd }: MermaidViewerProps) => {
  const previewUrl = useMemo(() => generateMermaidUrl(mmd), [mmd]);

  if (!previewUrl) return null;

  const inNewTab = typeof window !== 'undefined' && window.location.search.includes('viewMode=story');

  return (
    <iframe
      src={previewUrl}
      style={{ width: '100%', minHeight: '40rem', border: 'none', height: inNewTab ? '100svh' : '' }}
    />
  );
};
