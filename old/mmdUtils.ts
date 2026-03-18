import MermaidViewer from './MermaidViewer.vue'

export function buildMermaidStory(mmd: string) {
  return {
    parameters: {
      layout: 'fullscreen',
      docs: { source: { code: mmd } },
    },
    render: () => ({
      components: { MermaidViewer },
      setup() {
        return { mmd }
      },
      template: '<MermaidViewer :mmd="mmd" />',
    }),
  }
}
