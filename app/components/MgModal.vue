<script setup lang="ts">
/**
 * feedback/Modal — 置中對話框，覆在只有不透明度的遮罩上：不模糊、不玻璃、無圓角、無陰影。
 * 600px 面板、48px padding、24px gap。
 */
defineProps<{ open: boolean; label?: string; title?: string }>()
const emit = defineEmits<{ scrimClick: [] }>()

const titleId = useId()

watchEffect((onCleanup) => {
  if (!import.meta.client) return
  document.body.style.overflow = 'hidden'
  onCleanup(() => {
    document.body.style.overflow = ''
  })
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('scrimClick')
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4"
    @click="emit('scrimClick')"
  >
    <div
      role="dialog"
      aria-modal="true"
      :aria-labelledby="title ? titleId : undefined"
      class="flex max-h-full w-[600px] max-w-full flex-col gap-6 overflow-y-auto bg-surface-0 p-12"
      @click.stop
    >
      <span
        v-if="label"
        class="font-label text-12 font-semibold tracking-label-wide text-accent"
      >{{ label }}</span>
      <h2
        v-if="title"
        :id="titleId"
        class="font-display text-40 leading-heading-loose font-medium tracking-display-md text-fg-1"
      >{{ title }}</h2>
      <slot />
      <div v-if="$slots.actions" class="flex flex-wrap items-center gap-8 pt-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
