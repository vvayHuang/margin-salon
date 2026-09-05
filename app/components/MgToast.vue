<script setup lang="ts">
/**
 * feedback/Toast — 實心 #111、白字、無圓角、無陰影。
 * banner 是高擬真稿實際用的形狀（送出失敗）：滿版接在 nav 下方、padding 24/48、
 * accent 紅的 Archivo 標籤、動作靠右。
 */
withDefaults(
  defineProps<{ label?: string; message: string; variant?: 'banner' | 'float' }>(),
  { variant: 'banner' },
)
defineEmits<{ close: [] }>()
</script>

<template>
  <div
    role="status"
    class="flex justify-between gap-8 bg-fg-1 font-body text-surface-0"
    :class="
      variant === 'float'
        ? 'fixed top-6 right-6 z-100 max-w-[420px] items-start p-6'
        : 'w-full items-center px-12 py-6'
    "
  >
    <div class="flex flex-col gap-2">
      <span
        v-if="label"
        class="font-label text-12 font-semibold tracking-label-wide text-accent"
      >{{ label }}</span>
      <span class="text-16 leading-body-snug text-pretty">{{ message }}</span>
    </div>
    <slot name="action" />
    <button
      type="button"
      aria-label="關閉"
      class="font-mono text-12 leading-[1.6] opacity-70"
      @click="$emit('close')"
    >✕</button>
  </div>
</template>
