<script setup lang="ts">
/** core/Breadcrumb — 13px、gap 8px、全形「／」分隔，祖先 #6E6E6E、當前頁 #111。 */
defineProps<{ items: { label: string; to?: string }[] }>()
</script>

<template>
  <nav aria-label="麵包屑" class="flex items-center gap-2 font-body text-13 text-fg-3">
    <template v-for="(item, i) in items" :key="item.label + i">
      <span v-if="i > 0" aria-hidden="true">／</span>
      <NuxtLink v-if="item.to && i < items.length - 1" :to="item.to" class="text-inherit hover:opacity-60">
        {{ item.label }}
      </NuxtLink>
      <span v-else :class="i === items.length - 1 ? 'text-fg-1' : ''" :aria-current="i === items.length - 1 ? 'page' : undefined">
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
