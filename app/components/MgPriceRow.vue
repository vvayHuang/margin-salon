<script setup lang="ts">
/**
 * content/PriceRow — 上下 24px、上方 1px 分隔線（第一列用 #111），四欄：
 * 20px 勾選方塊、名稱區塊、80px 靠右時長、120px 靠右 Archivo 金額。
 *
 * 設計系統的 PriceRow 只在接到 onToggle 時畫勾選方塊，否則游標維持 default —— 同一支
 * 元件既是預約流程第二步的可選服務列，也是價目頁的純列表。Vue 這邊看不到父層有沒有
 * 綁 @toggle（宣告過的 emit 不會留在 attrs 裡），所以把它拉成一個明講的 prop。
 */
withDefaults(
  defineProps<{
    name: string
    note?: string
    duration?: string
    price: string
    /** false 就是價目表：沒有勾選方塊、不可點。 */
    selectable?: boolean
    checked?: boolean
    first?: boolean
    last?: boolean
  }>(),
  { selectable: true, checked: false, first: false, last: false },
)
defineEmits<{ toggle: [] }>()
</script>

<template>
  <div
    class="flex items-center gap-6 border-t py-6"
    :class="[
      first ? 'border-t-line-1' : 'border-t-line-2',
      last ? 'border-b border-b-line-2' : '',
      selectable ? 'cursor-pointer' : '',
    ]"
    :role="selectable ? 'checkbox' : undefined"
    :aria-checked="selectable ? checked : undefined"
    :tabindex="selectable ? 0 : undefined"
    @click="selectable && $emit('toggle')"
    @keydown.enter.prevent="selectable && $emit('toggle')"
    @keydown.space.prevent="selectable && $emit('toggle')"
  >
    <div
      v-if="selectable"
      aria-hidden="true"
      class="flex size-5 shrink-0 items-center justify-center text-12 text-surface-0"
      :class="checked ? 'bg-fg-1' : 'border border-fg-4'"
    >{{ checked ? '✓' : '' }}</div>

    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <span class="font-display text-24 font-medium tracking-display-sm text-fg-1">{{ name }}</span>
      <span v-if="note" class="font-body text-14 text-fg-3">{{ note }}</span>
    </div>

    <span v-if="duration" class="w-20 shrink-0 text-right font-body text-14 text-fg-3">{{ duration }}</span>
    <span class="w-30 shrink-0 text-right font-label text-16 font-semibold text-fg-1">{{ price }}</span>
  </div>
</template>
