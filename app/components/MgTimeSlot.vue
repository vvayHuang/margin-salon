<script setup lang="ts">
/**
 * booking/TimeSlot — 56px 高、16px 正文字（不是 Archivo）。
 * 可選＝1px #111；選中＝實心黑、無框；已滿＝平面 #F2F2F2、刪除線、無框。
 * 也用在步驟 4 的「是／否」與「短／中長／長」選項。
 */
withDefaults(
  defineProps<{ time: string; state?: 'available' | 'selected' | 'full' | 'loading' }>(),
  { state: 'available' },
)
defineEmits<{ pick: [] }>()
</script>

<template>
  <div v-if="state === 'loading'" class="ds-skeleton h-14" aria-hidden="true" />
  <button
    v-else
    type="button"
    :disabled="state === 'full'"
    class="flex h-14 w-full items-center justify-center font-body text-16 transition-[opacity,background-color,color] duration-200"
    :class="
      state === 'selected'
        ? 'bg-fg-1 text-surface-0'
        : state === 'full'
          ? 'cursor-not-allowed bg-surface-2 text-fg-5 line-through'
          : 'border border-line-1 bg-surface-0 text-fg-1 hover:opacity-60'
    "
    @click="$emit('pick')"
  >
    {{ time }}
  </button>
</template>
