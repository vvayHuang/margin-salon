<script setup lang="ts">
/**
 * booking/StepBar — Archivo 12px/600/.12em，群組間 16px、群組內 12px。
 * 20px 方塊就是全部的狀態語言：實心 #111＝已完成、實心 #C8351C＝正在這一步、
 * 1px #B5B5B5 外框＝還沒到。群組之間用 40px × 1px 的 #E4E4E4 連線。
 */
defineProps<{ steps: string[]; current: number }>()
defineEmits<{ stepClick: [step: number] }>()
</script>

<template>
  <nav
    class="flex flex-wrap items-center gap-4 font-label text-12 font-semibold tracking-label-mid md:flex-nowrap"
  >
    <template v-for="(label, i) in steps" :key="label">
      <span v-if="i > 0" aria-hidden="true" class="hidden h-px w-10 shrink-0 bg-line-2 md:block" />
      <component
        :is="i + 1 < current ? 'button' : 'span'"
        :type="i + 1 < current ? 'button' : undefined"
        class="flex items-center gap-3"
        :class="i + 1 < current ? 'cursor-pointer' : 'cursor-default'"
        :aria-current="i + 1 === current ? 'step' : undefined"
        @click="i + 1 < current && $emit('stepClick', i + 1)"
      >
        <span
          aria-hidden="true"
          class="size-5 shrink-0"
          :class="
            i + 1 === current
              ? 'bg-accent'
              : i + 1 < current
                ? 'bg-fg-1'
                : 'border border-fg-4'
          "
        />
        <span
          class="whitespace-nowrap"
          :class="i + 1 === current ? 'text-fg-1' : i + 1 < current ? 'text-fg-3' : 'text-fg-4'"
        >{{ String(i + 1).padStart(2, '0') }} {{ label }}</span>
      </component>
    </template>
  </nav>
</template>
