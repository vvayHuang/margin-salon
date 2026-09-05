<script setup lang="ts">
/**
 * 全幅 21:9 收尾帶。高擬真稿在首頁、關於、服務、店家、作品集結尾各放了一次，
 * 除了影像註記與兩行大標之外完全相同，所以收成一支元件。
 * 大標第二行一律用義式斜體，按鈕一律是白底反白的「線上預約」。
 */
defineProps<{
  note: string
  line1: string
  line2: string
  /** public/img 檔名；沒給就維持灰底佔位 */
  src?: string
  alt?: string
}>()
</script>

<template>
  <!-- data-mg-cta：MgStickyBook 靠這個標記判斷收尾帶是否在畫面內，在的話就收起來 -->
  <section
    data-mg-cta
    class="relative flex w-full items-end bg-placeholder"
    style="aspect-ratio: 21 / 9"
  >
    <img
      v-if="src"
      :src="imgSrc(src)"
      :srcset="imgSrcset(src)"
      sizes="100vw"
      :alt="alt ?? ''"
      loading="lazy"
      decoding="async"
      class="absolute inset-0 size-full object-cover"
    >
    <!-- 大標壓在影像上，靠這層由下往上的暗化保住對比 -->
    <div v-if="src" class="mg-scrim" />
    <span
      v-if="!src"
      class="absolute top-6 right-8 font-mono text-11 tracking-label text-placeholder-label"
    >
      {{ note }}
    </span>
    <div class="mg-gut relative flex flex-col gap-8 pb-14">
      <p class="font-display text-40 leading-[1.15] font-medium tracking-display-md text-surface-0 md:text-64">
        {{ line1 }}<br>
        <span class="italic">{{ line2 }}</span>
      </p>
      <div class="flex flex-wrap items-center gap-8">
        <MgButton to="/booking" inverse>線上預約</MgButton>
      </div>
    </div>
  </section>
</template>
