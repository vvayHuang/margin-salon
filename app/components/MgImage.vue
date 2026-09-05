<script setup lang="ts">
/**
 * 影像框。給了 `src`（public/img 的檔名，不含副檔名與 @寬度）就出圖，
 * 沒給就維持灰底佔位。外層比例與註記字的位置在兩種狀態下都不動。
 *
 * 註記的位置跟著裁切大小走，高擬真稿裡沒有例外：全幅大圖（21:9、3:4）的註記在
 * 24／32 並拉開字距，卡片級的小圖（4:5、1:1）則是 16／16、不拉字距。
 * 出圖之後註記整個收掉——「示意圖」的聲明統一放在 Footer，壓在照片上讀不清楚。
 */
const props = withDefaults(
  defineProps<{
    ratio?: '21/9' | '4/5' | '3/4' | '1/1'
    /** 右上角註記，例如「IMAGE 3:4 — 店內全景」。留空則用比例自動生成。 */
    note?: string
    /** public/img 的檔名，例如 `works_001_front`；srcset 由 IMG_ASSETS 自動組。 */
    src?: string
    alt?: string
    /** <img sizes>。預設當滿版處理。 */
    sizes?: string
    /** 首屏影像設 true：改成 eager ＋ high priority。 */
    priority?: boolean
  }>(),
  { ratio: '4/5', sizes: '100vw', priority: false },
)

const asset = computed(() => (props.src ? imgSize(props.src) : undefined))
const cornerClass = computed(() =>
  props.ratio === '21/9' || props.ratio === '3/4' ? 'top-6 right-8 tracking-label' : 'top-4 right-4',
)
</script>

<template>
  <div
    class="relative overflow-hidden"
    :class="src ? 'bg-surface-2' : 'bg-placeholder'"
    :style="{ aspectRatio: ratio }"
  >
    <img
      v-if="src"
      :src="imgSrc(src)"
      :srcset="imgSrcset(src)"
      :sizes="sizes"
      :width="asset?.w"
      :height="asset?.h"
      :alt="alt ?? ''"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      decoding="async"
      class="size-full object-cover"
    >
    <span
      v-if="!src"
      class="pointer-events-none absolute font-mono text-11 text-placeholder-label"
      :class="cornerClass"
    >
      {{ note ?? ratio.replace('/', ':') }}
    </span>
  </div>
</template>
