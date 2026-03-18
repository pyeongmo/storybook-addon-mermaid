import { defineComponent, computed, h } from 'vue';
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
    const previewUrl = computed(() => generateMermaidUrl(props.mmd, props.theme, props.baseUrl));
    const iframeStyle = computed(() => getIframeStyleString(props.minHeight));

    return () => {
      if (!previewUrl.value) return null;
      return h('iframe', {
        src: previewUrl.value,
        style: iframeStyle.value,
      });
    };
  },
});
