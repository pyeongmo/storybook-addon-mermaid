import { defineComponent } from 'vue';
import { generateMermaidUrl, getIframeStyleString } from '../utils/mermaid';

export const MermaidViewerVue = defineComponent({
  name: 'MermaidViewerVue',
  props: {
    mmd: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      default: 'default',
    },
    baseUrl: {
      type: String,
      default: 'https://mermaid.live',
    },
    minHeight: {
      type: String,
      default: '40rem',
    },
  },
  setup(props) {
    return {
      url: generateMermaidUrl(props.mmd, props.theme, props.baseUrl),
      style: getIframeStyleString(props.minHeight),
    };
  },
  template: `<iframe :src="url" :style="style"></iframe>`,
});
