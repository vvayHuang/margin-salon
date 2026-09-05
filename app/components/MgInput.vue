<script setup lang="ts">
/**
 * forms/Input — 標籤 13px #6E6E6E，錯誤時轉 #C8351C。
 * 欄位 56px、1px #111（不是灰細線）、0 16px、16px 正文字。
 * 錯誤時邊框加粗成 2px #C8351C，訊息前面加一個 Archivo 的「!」。
 * textarea 112px、16px padding、1px #E4E4E4 —— 刻意比必填欄位淡，因為它是選填。
 */
withDefaults(
  defineProps<{
    label?: string
    modelValue: string
    placeholder?: string
    error?: string
    hint?: string
    type?: string
    multiline?: boolean
    disabled?: boolean
  }>(),
  { type: 'text', multiline: false, disabled: false },
)

defineEmits<{ 'update:modelValue': [value: string]; blur: [] }>()

const fieldId = useId()
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="label"
      :for="fieldId"
      class="font-body text-13"
      :class="error ? 'text-accent' : 'text-fg-3'"
    >{{ label }}</label>

    <textarea
      v-if="multiline"
      :id="fieldId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="h-28 w-full resize-none border p-4 font-body text-16 leading-body-snug outline-none transition-colors duration-200"
      :class="error ? 'border-2 border-accent' : disabled ? 'border-line-3 bg-surface-2 text-fg-4' : 'border-line-2 bg-surface-0 text-fg-1'"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @blur="$emit('blur')"
    />
    <input
      v-else
      :id="fieldId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="error ? true : undefined"
      class="h-14 w-full border px-4 font-body text-16 outline-none transition-colors duration-200"
      :class="error ? 'border-2 border-accent' : disabled ? 'border-line-3 bg-surface-2 text-fg-4' : 'border-line-1 bg-surface-0 text-fg-1'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
    >

    <div v-if="error" class="flex items-start gap-2">
      <span aria-hidden="true" class="font-label text-12 leading-[1.6] font-bold text-accent">!</span>
      <span class="font-body text-13 leading-body-tight text-accent text-pretty">{{ error }}</span>
    </div>
    <span
      v-else-if="hint"
      class="font-body text-13 leading-body-tight text-fg-3 text-pretty"
    >{{ hint }}</span>
  </div>
</template>
