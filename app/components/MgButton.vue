<script setup lang="ts">
import { NuxtLink } from '#components'

/**
 * core/Button — 依 design system 的 Button.jsx。
 * 按鈕一律用 BODY 字（Noto Sans TC）16px/500/.04em，因為每個按鈕文字都是中文；
 * Archivo 只出現在 `label` 這個連結變體（LOAD MORE、ALL 6 WORKS）。
 * hover 一律降不透明度到 .6，不換色。
 *
 * 給了 `to` 就渲染成 NuxtLink。NuxtLink 要用 import 拿，不能在 template 的 :is
 * 運算式裡 resolveComponent('NuxtLink') —— 那會解析失敗、退回字串，於是 DOM 裡
 * 長出一顆沒有 href 的 <nuxtlink>，看起來像按鈕但點不動。
 */
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'link' | 'label'
    size?: 'md' | 'sm'
    disabled?: boolean
    fullWidth?: boolean
    muted?: boolean
    inverse?: boolean
    to?: string
  }>(),
  { variant: 'primary', size: 'md', disabled: false, fullWidth: false, muted: false, inverse: false },
)
</script>

<template>
  <component
    :is="to && !disabled ? NuxtLink : 'button'"
    :to="to && !disabled ? to : undefined"
    :type="to && !disabled ? undefined : 'button'"
    :disabled="to ? undefined : disabled"
    :aria-disabled="disabled || undefined"
    class="mg-btn"
    :class="[`mg-btn--${variant}`, `mg-btn--${size}`, { 'mg-btn--muted': muted, 'mg-btn--inverse': inverse, 'mg-btn--full': fullWidth, 'mg-btn--disabled': disabled }]"
  >
    <slot />
  </component>
</template>

<style scoped>
.mg-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  box-sizing: border-box;
  border-radius: 0;
  border: none;
  font-family: var(--font-body);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity var(--dur) var(--ease);
}
.mg-btn:hover {
  opacity: 0.6;
}
.mg-btn--full {
  width: 100%;
}
.mg-btn--disabled {
  cursor: not-allowed;
  opacity: 1;
}
.mg-btn--disabled:hover {
  opacity: 1;
}

/* sizes only apply to the two boxed variants */
.mg-btn--primary.mg-btn--md,
.mg-btn--secondary.mg-btn--md {
  height: var(--h-button);
  padding: var(--pad-button);
  font-size: var(--size-16);
  font-weight: var(--weight-body-medium);
  letter-spacing: var(--tracking-button);
}
.mg-btn--primary.mg-btn--sm,
.mg-btn--secondary.mg-btn--sm {
  height: var(--h-button-sm);
  padding: var(--pad-button-sm);
  font-size: var(--size-14);
  font-weight: var(--weight-body);
  letter-spacing: normal;
}

.mg-btn--primary {
  background: var(--surface-solid);
  color: var(--text-inverse);
}
.mg-btn--primary.mg-btn--inverse {
  background: var(--surface-page);
  color: var(--text-heading);
}
.mg-btn--primary.mg-btn--disabled {
  background: var(--surface-disabled);
  color: var(--text-disabled);
}

.mg-btn--secondary {
  background: var(--surface-page);
  color: var(--text-heading);
  border: var(--border-1) solid var(--border-strong);
}
.mg-btn--secondary.mg-btn--disabled {
  border-color: var(--border-disabled);
  color: var(--text-disabled);
}

/* 文字連結：1px 底線，壓在文字下方 3px */
.mg-btn--link,
.mg-btn--label {
  display: inline-block;
  background: transparent;
  height: auto;
  padding: 0 0 var(--underline-offset);
  color: var(--text-heading);
  border-bottom: var(--border-1) solid currentColor;
}
.mg-btn--link {
  font-size: var(--size-16);
  font-weight: var(--weight-body);
  letter-spacing: normal;
}
.mg-btn--label {
  font-family: var(--font-label);
  font-size: var(--size-12);
  font-weight: var(--weight-label);
  letter-spacing: var(--tracking-label-wide);
}
.mg-btn--link.mg-btn--muted,
.mg-btn--label.mg-btn--muted {
  color: var(--text-muted);
}
.mg-btn--link.mg-btn--inverse,
.mg-btn--label.mg-btn--inverse {
  color: var(--text-inverse);
}
.mg-btn--link.mg-btn--disabled,
.mg-btn--label.mg-btn--disabled {
  color: var(--text-disabled);
}
</style>
