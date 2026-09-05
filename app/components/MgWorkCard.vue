<script setup lang="ts">
import { workMeta, type Work } from '#shared/margin'

/** content/WorkCard — 4:5 裁切、gap 16、宋體 24 標題與 Archivo 編號同一條基線、14px 灰 meta。 */
const props = defineProps<{ work: Work }>()
const meta = computed(() => workMeta(props.work))
</script>

<template>
  <article class="mg-work group flex flex-col gap-4">
    <NuxtLink :to="`/works/${work.code}`" class="flex flex-col gap-4">
      <MgImage
        ratio="4/5"
        :src="`${work.img}_front`"
        :alt="`${work.title}｜${meta}`"
        sizes="(max-width: 900px) 50vw, 33vw"
        class="mg-work__media transition-opacity duration-[320ms]"
      />

      <div class="flex items-baseline justify-between gap-4">
        <span class="font-display text-24 leading-[1.3] font-medium tracking-display-sm text-fg-1">
          {{ work.title }}
        </span>
        <span class="font-label text-12 font-semibold tracking-label whitespace-nowrap text-fg-3">
          {{ work.code }}
        </span>
      </div>

      <p class="font-body text-14 leading-body-tight text-fg-3">{{ meta }}</p>
    </NuxtLink>
  </article>
</template>

<style scoped>
/* hover 只讓影像變淡，文字不動 —— 設計系統 WorkCard.jsx 的行為 */
.mg-work:hover .mg-work__media {
  opacity: 0.85;
}
</style>
