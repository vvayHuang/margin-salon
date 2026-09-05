<script setup lang="ts" generic="T extends string">
import type { Option } from '#shared/margin'

/**
 * forms/Dropdown — 三種樣子：
 *   未選   1px #D0D0D0、灰標籤
 *   已選   1px #111、白底
 *   展開   實心 #111、白字、標籤 #9A9A9A、▲
 * 選單固定 236px、1px #111、上下 6px、列高 38px；選中列 #F4F3F1 ＋靠右的 accent ●。
 */
const props = withDefaults(
  defineProps<{
    label: string
    options: Option<T>[]
    /** 空字串代表這一軸沒有條件 */
    modelValue: T | ''
    placeholder?: string
    disabled?: boolean
  }>(),
  { placeholder: '全部', disabled: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: T | ''] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const listId = useId()

const isSet = computed(() => props.modelValue !== '' && props.modelValue != null)
const currentLabel = computed(
  () => props.options.find(o => o.value === props.modelValue)?.label ?? props.placeholder,
)

function choose(value: T | '') {
  emit('update:modelValue', value)
  open.value = false
}

function onPointerDown(event: PointerEvent) {
  if (root.value && !root.value.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('pointerdown', onPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))
</script>

<template>
  <div
    ref="root"
    class="relative inline-block h-10"
    @keydown.esc="open = false"
  >
    <button
      type="button"
      :disabled="disabled"
      class="flex h-10 items-center gap-3 border px-4 font-body text-15 transition-[background-color,border-color] duration-200 disabled:cursor-not-allowed"
      :class="
        open
          ? 'bg-fg-1 border-line-1 text-surface-0'
          : disabled
            ? 'bg-surface-0 border-line-3 text-fg-4'
            : isSet
              ? 'bg-surface-0 border-line-1 text-fg-1'
              : 'bg-surface-0 border-line-3 text-fg-1'
      "
      :aria-expanded="open"
      :aria-controls="listId"
      aria-haspopup="listbox"
      @click="open = !open"
    >
      <span
        class="font-label text-11 font-semibold tracking-label-wide"
        :class="open ? 'text-fg-on-dark' : 'text-fg-3'"
      >{{ label }}</span>
      <span>{{ currentLabel }}</span>
      <span
        aria-hidden="true"
        class="font-mono text-[9px] leading-none"
        :class="open ? 'text-surface-0' : 'text-fg-3'"
      >{{ open ? '▲' : '▼' }}</span>
    </button>

    <ul
      v-show="open && !disabled"
      :id="listId"
      role="listbox"
      :aria-label="label"
      class="absolute top-11 left-0 z-20 w-[236px] border border-line-1 bg-surface-0 py-[6px]"
    >
      <li
        role="option"
        :aria-selected="!isSet"
        class="flex h-[38px] cursor-pointer items-center px-4 font-body text-15 text-fg-3"
        @click="choose('')"
      >
        {{ placeholder }}
      </li>
      <li
        v-for="option in options"
        :key="option.value"
        role="option"
        :aria-selected="option.value === modelValue"
        class="flex h-[38px] cursor-pointer items-center justify-between px-4 font-body text-15 text-fg-1"
        :class="option.value === modelValue ? 'bg-surface-1' : 'hover:bg-surface-1'"
        @click="choose(option.value)"
      >
        {{ option.label }}
        <span v-if="option.value === modelValue" aria-hidden="true" class="text-13 text-accent">●</span>
      </li>
    </ul>
  </div>
</template>
