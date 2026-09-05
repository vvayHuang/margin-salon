<script setup lang="ts">
/**
 * booking/BookingSummary — 360px、sticky、1px #111、32px padding、24px gap。
 * 中文標籤固定在 56px 欄位、13px #6E6E6E；值 15px，這一步剛決定的那個值升到 20px
 * 宋體、金額用 Archivo。沒填的值顯示「尚未選擇」#B5B5B5。
 * 一條細線把列與動作分開，停用原因寫在按鈕下方。
 */
export interface SummaryRow {
  label: string
  value: string
  emphasis?: 'serif' | 'money' | null
  invalid?: boolean
}

withDefaults(defineProps<{ title?: string; rows: SummaryRow[]; caption?: string }>(), {
  title: 'YOUR BOOKING',
})
</script>

<template>
  <aside
    class="flex w-full shrink-0 flex-col gap-6 border border-line-1 bg-surface-0 p-8 md:sticky md:top-0 md:w-90"
  >
    <div class="font-label text-12 font-semibold tracking-label-wide text-fg-3">{{ title }}</div>

    <div class="flex flex-col gap-4">
      <div v-for="row in rows" :key="row.label" class="flex gap-4">
        <span
          class="w-14 shrink-0 font-body text-13"
          :class="row.invalid ? 'text-accent' : 'text-fg-3'"
        >{{ row.label }}</span>
        <span
          :class="[
            row.emphasis === 'money'
              ? 'font-label text-20 font-semibold leading-[1.4]'
              : row.emphasis === 'serif'
                ? 'font-display text-20 leading-[1.4]'
                : 'font-body text-15 leading-body-tight',
            row.invalid ? 'text-accent' : !row.value ? 'text-fg-4' : 'text-fg-1',
          ]"
        >{{ row.value || '尚未選擇' }}</span>
      </div>
    </div>

    <div class="h-px bg-line-2" />
    <slot name="action" />
    <span
      v-if="caption"
      class="self-center text-center font-body text-13 leading-body-tight text-fg-3 text-pretty"
    >{{ caption }}</span>
  </aside>
</template>
