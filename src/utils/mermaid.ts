import pako from 'pako';

export interface MermaidState {
  code: string;
  mermaid: { theme: string };
  updateEditor: boolean;
}

export function generateMermaidUrl(
  mmd: string,
  theme: string = 'default',
  baseUrl: string = 'https://mermaid.live',
): string {
  if (!mmd) return '';

  const state: MermaidState = {
    code: mmd,
    mermaid: { theme },
    updateEditor: false,
  };

  const jsonStr = JSON.stringify(state);
  const data = new TextEncoder().encode(jsonStr);
  const compressed = pako.deflate(data, { level: 9 });

  const base64 = btoa(String.fromCharCode(...new Uint8Array(compressed)));
  return `${baseUrl}/view#pako:${base64}`;
}

export const getInNewTab = () => typeof window !== 'undefined' && window.location.search.includes('viewMode=story');

export const getIframeStyle = (minHeight: string = '40rem'): React.CSSProperties => {
  const inNewTab = getInNewTab();
  return {
    width: '100%',
    minHeight,
    border: 'none',
    height: inNewTab ? '100svh' : 'auto',
  };
};

export const getIframeStyleString = (minHeight?: string) => {
  const styleObj = getIframeStyle(minHeight);
  return Object.entries(styleObj)
    .map(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabKey}: ${value};`;
    })
    .join(' ');
};
