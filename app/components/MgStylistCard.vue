<script setup lang="ts">
/**
 * content/StylistCard — 1px #E4E4E4、24px padding、24px gap，
 * 左邊 96px 正方裁切，接著宋體 28px 姓名、Archivo 12px/.12em 職稱、14px 灰色專長。
 * variant="plain" 是「不指定」用的無頭像版本。
 */
withDefaults(
  defineProps<{
    name: string
    role?: string
    /** public/img 的頭像檔名；沒給就維持灰底 */
    photo?: string
    note?: string
    variant?: 'bordered' | 'plain'
    selected?: boolean
  }>(),
  { variant: 'bordered', selected: false },
)
</script>

<template>
  <article
    class="flex cursor-pointer items-center gap-6 bg-surface-0 p-6 transition-colors duration-200"
    :class="selected ? 'border-2 border-line-1' : 'border border-line-2 hover:border-line-1'"
  >
    <MgImage
      v-if="variant === 'bordered'"
      ratio="1/1"
      :src="photo"
      :alt="photo ? name : undefined"
      sizes="96px"
      class="w-24 shrink-0"
    />
    <div class="flex min-w-0 flex-col gap-2">
      <div class="font-display text-28 font-medium tracking-display-sm text-fg-1">{{ name }}</div>
      <div v-if="role" class="font-label text-12 font-semibold tracking-label-mid text-fg-3">{{ role }}</div>
      <div v-if="note" class="font-body text-14 leading-body-snug text-fg-3 text-pretty">{{ note }}</div>
    </div>
  </article>
</template>
