<script setup lang="ts">
import { NAV_ITEMS } from '#shared/margin'

/**
 * navigation/Nav — 兩種列：
 *  site    72px，沒有下邊框。Archivo 大寫連結靠左（gap 32），字標靠右。
 *          連結不換色，當前頁只用自己文字下方 3px 的 2px accent 線標記。
 *  booking 72px，有 1px #E4E4E4 下邊框。字標靠左、「✕ CLOSE」靠右，沒有連結：
 *          預約流程是一個關起來的房間，只能關掉離開。
 *  compact 375 用的 56px 列：16px 邊距、1px 下邊框、字標靠左，右邊是用三條 1px div
 *          畫出來的漢堡（不是字符）。
 */
withDefaults(
  defineProps<{ variant?: 'site' | 'booking'; current?: string; closeTo?: string }>(),
  { variant: 'site', closeTo: '/works' },
)

const route = useRoute()
const menuOpen = ref(false)
watch(() => route.fullPath, () => (menuOpen.value = false))
</script>

<template>
  <!-- booking：關起來的房間 -->
  <header
    v-if="variant === 'booking'"
    class="flex h-[72px] items-center justify-between border-b border-line-2 bg-surface-0 px-4 md:px-12"
  >
    <span class="font-display text-16 font-semibold tracking-wordmark whitespace-nowrap text-fg-1">
      留白髮所 MARGIN
    </span>
    <NuxtLink :to="closeTo" class="font-label text-12 font-semibold tracking-label-wide text-fg-3">
      ✕ CLOSE
    </NuxtLink>
  </header>

  <header v-else>
    <!-- compact 375 -->
    <div
      class="flex h-14 items-center justify-between border-b border-line-2 bg-surface-0 px-4 md:hidden"
    >
      <NuxtLink to="/" class="font-display text-16 font-semibold tracking-wordmark whitespace-nowrap text-fg-1">
        留白髮所 MARGIN
      </NuxtLink>
      <button
        type="button"
        class="flex w-6 flex-col gap-1"
        aria-label="選單"
        :aria-expanded="menuOpen"
        aria-controls="mg-mobile-nav"
        @click="menuOpen = !menuOpen"
      >
        <span class="h-px bg-fg-1" />
        <span class="h-px bg-fg-1" />
        <span class="h-px bg-fg-1" />
      </button>
    </div>

    <nav
      v-show="menuOpen"
      id="mg-mobile-nav"
      aria-label="主導覽"
      class="border-b border-line-1 bg-surface-0 md:hidden"
    >
      <ul>
        <li v-for="item in NAV_ITEMS" :key="item.id" class="border-t border-line-2 first:border-t-0">
          <NuxtLink
            :to="item.to"
            class="flex h-14 items-center justify-between px-4"
            :class="item.id === current ? 'bg-surface-1' : ''"
            :aria-current="item.id === current ? 'page' : undefined"
          >
            <span class="font-label text-12 font-semibold tracking-label-wide">{{ item.label }}</span>
            <span v-if="item.id === current" aria-hidden="true" class="text-13 text-accent">●</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- site 1440 -->
    <div class="hidden h-[72px] items-center justify-between bg-surface-0 px-12 md:flex">
      <nav aria-label="主導覽" class="flex items-center gap-8 font-label text-12 font-semibold tracking-label-wide">
        <NuxtLink
          v-for="item in NAV_ITEMS"
          :key="item.id"
          :to="item.to"
          class="border-b-2 pb-[3px] text-fg-1 transition-opacity duration-200"
          :class="item.id === current ? 'border-accent' : 'border-transparent hover:opacity-60'"
          :aria-current="item.id === current ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <NuxtLink to="/" class="font-display text-16 font-semibold tracking-wordmark whitespace-nowrap text-fg-1">
        留白髮所 MARGIN
      </NuxtLink>
    </div>
  </header>
</template>
