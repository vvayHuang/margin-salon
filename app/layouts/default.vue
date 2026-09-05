<script setup lang="ts">
const route = useRoute()
const current = computed(() => {
  if (route.path.startsWith('/stylists')) return 'stylists'
  if (route.path.startsWith('/booking')) return 'booking'
  if (route.path.startsWith('/services')) return 'service'
  if (route.path.startsWith('/about')) return 'about'
  if (route.path.startsWith('/store')) return 'store'
  if (route.path === '/') return 'home'
  return 'works'
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface-0 font-body text-fg-1">
    <MgNav :current="current" />
    <main class="flex-1">
      <slot />
    </main>
    <MgFooter />
  </div>
</template>
