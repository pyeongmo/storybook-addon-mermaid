import pako from 'pako';

export interface MermaidState {
  code: string;
  mermaid: { theme: string };
  updateEditor: boolean;
}

export function generateMermaidUrl(mmd: string, theme: string = 'default'): string {
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
  return `https://mermaid.live/view#pako:${base64}`;
}
