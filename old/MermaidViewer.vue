<script setup lang="ts">
import { computed } from 'vue'
import pako from 'pako'

const props = defineProps<{ mmd: string }>()
const previewUrl = computed(() => {
  if (!props.mmd) return ''
  const state = {
    code: props.mmd,
    mermaid: { theme: 'default' },
    updateEditor: false,
  }

  const jsonStr = JSON.stringify(state)
  const data = new TextEncoder().encode(jsonStr)
  const compressed = pako.deflate(data, { level: 9 })

  const base64 = btoa(String.fromCharCode(...new Uint8Array(compressed)))
  return `http://mermaid.neilson.co.kr/view#pako:${base64}`
})
const inNewTab = location.search.includes('viewMode=story')
</script>

<template>
  <iframe v-if="previewUrl" :src="previewUrl" class="w-full min-h-160" :class="{ 'h-screen': inNewTab }" />
</template>
