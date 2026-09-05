<script setup lang="ts">
const route = useRoute()
const current = computed(() => {
  if (route.path.startsWith('/stylists')) return 'stylists'
  if (route.path.startsWith('/booking')) return 'booking'
  if (route.path.startsWith('/services')) return 'service'
  if (route.path.startsWith('/about')) return 'about'
  if (route.path.startsWith('/store')) return 'store'
  if (route.path.startsWith('/journal')) return 'journal'
  if (route.path === '/') return 'home'
  return 'works'
})
</script>

<template>
  <!-- 手機底部給 sticky 預約列留位，否則它會蓋住頁尾。
       88px＝12（上內距）＋56（按鈕）＋12（下內距）＋1（上框線）＋7 的餘裕 -->
  <div class="flex min-h-screen flex-col bg-surface-0 pb-[88px] font-body text-fg-1 md:pb-0">
    <MgNav :current="current" />
    <main class="flex-1">
      <slot />
    </main>
    <MgFooter />
    <MgStickyBook />
  </div>
</template>
