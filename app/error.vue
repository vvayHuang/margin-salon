<script setup lang="ts">
import { BRAND, NAV_ITEMS } from '#shared/margin'

/**
 * 404 與 500（文案 §15）。
 *
 * Nuxt 的 error page 在版型之外渲染，所以 Nav 與 Footer 要自己接。
 * 這裡刻意不放 Sticky 預約列——錯誤頁的任務是把人送回動線上，不是推預約。
 */
const props = defineProps<{ error: { statusCode: number; message?: string } }>()

const isNotFound = computed(() => props.error?.statusCode === 404)

useHead({ title: () => (isNotFound.value ? '找不到這一頁 — 留白髮所 MARGIN' : '網站出了點狀況 — 留白髮所 MARGIN') })

function goHome() {
  clearError({ redirect: '/' })
}
function reload() {
  if (import.meta.client) window.location.reload()
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface-0 font-body text-fg-1">
    <MgNav :current="''" />

    <main class="mg-gut flex flex-1 flex-col justify-center py-30">
      <div class="font-label text-12 font-semibold tracking-label-wide text-fg-3">
        ERROR {{ error?.statusCode ?? 500 }}
      </div>

      <template v-if="isNotFound">
        <h1 class="mg-h1 mt-8 font-display leading-[1.08] font-medium tracking-display-md">
          這一頁<br>
          <span class="pl-22 italic">被剪掉了</span>
        </h1>
        <p class="mt-8 max-w-[440px] text-16 leading-body text-fg-2 text-pretty">
          網址可能打錯了，或這件作品已經下架。從作品集找起通常最快。
        </p>
        <div class="mt-10 flex flex-wrap items-center gap-8">
          <MgButton @click="goHome">回首頁</MgButton>
          <MgButton variant="link" muted to="/works">看作品</MgButton>
        </div>
      </template>

      <template v-else>
        <h1 class="mg-h1 mt-8 font-display leading-[1.08] font-medium tracking-display-md">
          網站出了<br>
          <span class="pl-22 italic">點狀況</span>
        </h1>
        <p class="mt-8 max-w-[440px] text-16 leading-body text-fg-2 text-pretty">
          我們正在處理。急的話請直接來電
          <a :href="BRAND.phoneHref" class="border-b border-current hover:opacity-60">{{ BRAND.phone }}</a>，
          營業時間內都有人接。
        </p>
        <div class="mt-10 flex flex-wrap items-center gap-8">
          <MgButton @click="reload">重新整理</MgButton>
          <MgButton variant="link" muted @click="goHome">回首頁</MgButton>
        </div>
      </template>

      <!-- 錯誤頁一定要有導引連結（04-SEO §5 技術檢查表） -->
      <nav aria-label="網站導覽" class="mt-16 flex flex-wrap gap-x-8 gap-y-3">
        <NuxtLink
          v-for="item in NAV_ITEMS"
          :key="item.id"
          :to="item.to"
          class="font-label text-12 font-semibold tracking-label-wide text-fg-3 hover:opacity-60"
        >{{ item.label }}</NuxtLink>
      </nav>
    </main>

    <MgFooter />
  </div>
</template>
