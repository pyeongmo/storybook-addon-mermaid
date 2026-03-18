<script setup lang="ts">
import { computed } from 'vue';
import pako from 'pako';

const props = defineProps<{ mmd: string }>();

function generateMermaidUrl(mmd: string, theme: string = 'default'): string {
  if (!mmd) return '';

  const state = {
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

const previewUrl = computed(() => generateMermaidUrl(props.mmd));
const inNewTab = typeof window !== 'undefined' && window.location.search.includes('viewMode=story');
</script>

<template>
  <iframe
    v-if="previewUrl"
    :src="previewUrl"
    style="width: 100%; min-height: 40rem; border: none"
    :style="{ height: inNewTab ? '100svh' : '' }"
  />
</template>
