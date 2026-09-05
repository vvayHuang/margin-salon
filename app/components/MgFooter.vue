<script setup lang="ts">
import { FOOTER_LINKS, FOOTER_NAV } from '#shared/margin'

/** navigation/Footer — 96px、0 48px、上方 1px #E4E4E4，全部 12px #6E6E6E。 */
</script>

<template>
  <footer
    class="flex min-h-24 flex-wrap items-center justify-between gap-6 border-t border-line-2 bg-surface-0 px-4 py-6 text-12 text-fg-3 md:flex-nowrap md:px-12 md:py-0"
  >
    <span class="font-body">© 2026 留白髮所 MARGIN Hair Studio</span>
    <!-- 素材還是 Unsplash 佔位，換成實拍前站上要標示 -->
    <span class="font-body">站內影像為示意圖，非實際施作紀錄</span>
    <!-- /careers 與 /privacy 只有這一個入口，見 D-09 補註 -->
    <nav aria-label="次要導覽" class="flex items-center gap-6 font-body">
      <NuxtLink
        v-for="item in FOOTER_NAV"
        :key="item.to"
        :to="item.to"
        class="text-inherit hover:opacity-60"
      >{{ item.label }}</NuxtLink>
    </nav>
    <div class="flex items-center gap-6 font-label font-semibold tracking-label-wide">
      <template v-for="link in FOOTER_LINKS" :key="link.label">
        <a
          v-if="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="text-inherit hover:opacity-60"
        >{{ link.label }}</a>
        <span v-else>{{ link.label }}</span>
      </template>
    </div>
  </footer>
</template>
