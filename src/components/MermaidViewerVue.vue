<script setup lang="ts">
import { computed } from 'vue';
import { generateMermaidUrl } from '../utils/mermaid';

const props = defineProps<{ mmd: string }>();
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
