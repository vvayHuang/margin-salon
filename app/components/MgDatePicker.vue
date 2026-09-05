<script setup lang="ts">
/**
 * booking/DatePicker — 星期列是 Archivo 大寫，日期數字是 14px 正文字。
 * 選中＝黑；accent 填色只保留給「你選了、但那天沒有空間」的狀態。
 */
export interface DayCell {
  day: number
  state: 'available' | 'selected' | 'selected-unavailable' | 'past' | 'full'
}

defineProps<{ month: string; days: (DayCell | null)[] }>()
defineEmits<{ pick: [day: number] }>()

const WEEK = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']

function clickable(state: DayCell['state']) {
  return state === 'available' || state === 'selected' || state === 'selected-unavailable'
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-baseline justify-between">
      <button type="button" aria-label="上個月" class="font-mono text-13 text-fg-3">‹</button>
      <span class="font-display text-22 font-medium tracking-display-sm text-fg-1">{{ month }}</span>
      <button type="button" aria-label="下個月" class="font-mono text-13 text-fg-3">›</button>
    </div>

    <div class="mb-1 grid grid-cols-7 gap-1">
      <div
        v-for="w in WEEK"
        :key="w"
        class="text-center font-label text-11 font-semibold tracking-label text-fg-3"
      >{{ w }}</div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <template v-for="(cell, i) in days">
        <div v-if="!cell" :key="`pad-${i}`" />
        <button
          v-else
          :key="cell.day"
          type="button"
          :disabled="!clickable(cell.state)"
          :title="cell.state === 'full' ? '當日已滿檔' : undefined"
          class="flex aspect-square items-center justify-center font-body text-14 transition-[opacity,background-color,color] duration-200"
          :class="{
            'bg-fg-1 text-surface-0': cell.state === 'selected',
            'bg-accent text-surface-0': cell.state === 'selected-unavailable',
            'bg-surface-2 text-fg-5': cell.state === 'past' || cell.state === 'full',
            'cursor-not-allowed': cell.state === 'full',
            'cursor-default': cell.state === 'past',
            'border border-line-2 bg-surface-0 text-fg-1 hover:opacity-60': cell.state === 'available',
          }"
          @click="clickable(cell.state) && $emit('pick', cell.day)"
        >{{ cell.day }}</button>
      </template>
    </div>
  </div>
</template>
