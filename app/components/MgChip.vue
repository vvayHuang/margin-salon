<script setup lang="ts">
/** core/Chip — h32 / 0 12px / 1px #111 / 13px。是標籤不是控制項：無填色、無大寫、無字距。 */
withDefaults(defineProps<{ label: string; selected?: boolean; removable?: boolean }>(), {
  selected: false,
  removable: false,
})
defineEmits<{ remove: [] }>()
</script>

<template>
  <span
    class="inline-flex h-8 shrink-0 items-center gap-2 border border-line-1 px-3 text-13"
    :class="selected ? 'bg-fg-1 text-surface-0' : 'bg-surface-0 text-fg-1'"
  >
    {{ label }}
    <button
      v-if="removable"
      type="button"
      class="-mr-0.5 font-mono text-12 leading-none text-fg-3"
      :aria-label="`移除 ${label}`"
      @click.stop="$emit('remove')"
    >✕</button>
  </span>
</template>
