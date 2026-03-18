<script setup lang="ts">
import { computed } from 'vue';
import { generateMermaidUrl, getIframeStyleString } from '../utils/mermaid';

const props = defineProps<{
  mmd: string;
  theme?: string;
  baseUrl?: string;
  minHeight?: string;
}>();

const previewUrl = computed(() => generateMermaidUrl(props.mmd, props.theme, props.baseUrl));
const iframeStyle = computed(() => getIframeStyleString(props.minHeight));
</script>

<template>
  <iframe v-if="previewUrl" :src="previewUrl" :style="iframeStyle" />
</template>
