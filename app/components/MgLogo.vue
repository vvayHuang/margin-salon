<script setup lang="ts">
// 動態 <component :is> 用字串找不到 NuxtLink——它是編譯期解析的，不在執行期的全域註冊
// 表裡，寫 'NuxtLink' 只會渲染出一個叫 <nuxtlink> 的原生元素、連結整個失效。
import { NuxtLink } from '#components'

/**
 * brand/Logo — 四種組合（標誌使用規範 v1.0）。四種加上單體符號，沒有第五種，
 * 也不准手工把標記跟名字重排一次；這個元件存在的意義就是沒有人再去調那個間距。
 *
 *   framed   標記直接框住名稱 — hero、招牌、印刷封面。 最小 200px
 *   h        符號在左、名稱在右 — 名片、信件簽名。      最小 140px
 *   compact  橫式簡化，不含中文 — 網站頁首，96–140px。  最小 96px
 *   stacked  方形、置中 — 頭像、方形廣告。
 *   mark     單體 — favicon、浮水印。
 *
 * 96px 是實測出來的：明朝體的細筆畫在「留白髮所」四個字上會整個消失，
 * compact 因此存在，而不是把完整組合再縮小。
 *
 * 字體由規範釘死，不走字級表：MARGIN 是 Archivo 400、字距 = 字級 × 0.30；
 * 留白髮所 是 Noto Serif TC 300、字級 = 拉丁字級 × 0.55、字距 = 字級 × 0.50，
 * 永遠在拉丁字下面，不加粗、不描邊。
 */

const INK = {
  heading: 'var(--text-heading)',
  inverse: 'var(--text-inverse)',
  muted: 'var(--text-muted)',
}
const SUB = {
  heading: 'var(--text-muted)',
  inverse: 'var(--text-on-solid-muted)',
  muted: 'var(--text-muted)',
}
const MIN_WIDTH = { framed: 200, h: 140, compact: 96, stacked: 0, mark: 0 }

const props = withDefaults(
  defineProps<{
    variant?: keyof typeof MIN_WIDTH
    size?: number
    tone?: keyof typeof INK
    onDark?: boolean
    clearSpace?: boolean
    name?: string
    subtitle?: string
    /** 給了就是連結（頁首的標誌回首頁），沒給就是一段沒有互動的識別 */
    to?: string
  }>(),
  { variant: 'h', tone: 'heading', onDark: false, clearSpace: false, name: 'MARGIN', subtitle: '留白髮所' },
)

const px = (n: number) => `${n}px`

const dark = computed(() => props.onDark || props.tone === 'inverse')
const ink = computed(() => INK[props.tone] ?? INK.heading)
const sub = computed(() => SUB[props.tone] ?? SUB.heading)

/** framed 以 18 起算（它的 w 是字級不是符號邊長），其餘以符號邊長起算 */
const s = computed(() => {
  if (props.size != null) return props.size
  if (props.variant === 'framed') return 18
  return props.variant === 'mark' || props.variant === 'stacked' ? 44 : 40
})

/** 拉丁名字級：stacked 0.34 S、h／compact 0.45 S、framed 就是 S 本身 */
const w = computed(() =>
  props.variant === 'framed'
    ? s.value
    : Math.round(s.value * (props.variant === 'stacked' ? 0.34 : 0.45)),
)

/** compact 依規範拿掉中文；其餘變體只要有 subtitle 就排 */
const withSub = computed(() => props.variant !== 'compact' && !!props.subtitle)

function nameStyle(size: number, align: 'left' | 'center'): Record<string, string> {
  const track = size * 0.3
  return {
    fontFamily: 'var(--font-label)',
    fontWeight: '400',
    fontSize: px(size),
    lineHeight: '1',
    letterSpacing: px(track),
    textIndent: px(track),
    color: ink.value,
    whiteSpace: 'nowrap',
    textAlign: align,
  }
}

function subStyle(size: number, align: 'left' | 'center'): Record<string, string> {
  const track = size * 0.5
  return {
    fontFamily: 'var(--font-display)',
    fontWeight: '300',
    fontSize: px(size),
    lineHeight: '1',
    letterSpacing: px(track),
    textIndent: px(track),
    color: sub.value,
    whiteSpace: 'nowrap',
    textAlign: align,
  }
}

const shellStyle = computed<Record<string, string>>(() => ({
  color: ink.value,
  minWidth: px(MIN_WIDTH[props.variant]),
  display: props.variant === 'framed' ? 'inline-block' : 'inline-flex',
  ...(props.variant === 'h' || props.variant === 'compact' ? { alignItems: 'center' } : {}),
  // 淨空 = 手臂長度 × 2，量的是組合裡那個符號的手臂
  ...(props.clearSpace
    ? { padding: px((props.variant === 'framed' ? s.value * 1.2 : s.value * 0.2) * 2) }
    : {}),
}))

/** framed：標記是外框本身，內距與描粗都是規範給的定值 */
const framed = computed(() => ({
  inner: {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: px(s.value * 0.67),
    padding: `${s.value * 1.9}px ${s.value * 2.55}px`,
  } as Record<string, string>,
  arm: s.value * 1.2,
  stroke: Math.max(1, s.value * (dark.value ? 0.072 : 0.067)),
}))
</script>

<template>
  <component
    :is="to ? NuxtLink : 'span'"
    :to="to"
    :aria-label="`${name} ${subtitle}`.trim()"
    class="whitespace-nowrap"
    :class="to ? 'transition-opacity duration-200 hover:opacity-60' : ''"
    :style="shellStyle"
  >
    <!-- framed：標記直接框住名稱 -->
    <span v-if="variant === 'framed'" :style="framed.inner">
      <MgLogoMark fill tone="inherit" :arm="framed.arm" :stroke="framed.stroke" />
      <span :style="nameStyle(w, 'center')">{{ name }}</span>
      <span v-if="subtitle" :style="subStyle(w * 0.55, 'center')">{{ subtitle }}</span>
    </span>

    <!-- mark：單體 -->
    <MgLogoMark v-else-if="variant === 'mark'" :size="s" tone="inherit" :on-dark="dark" />

    <!-- stacked：方形、置中 -->
    <span
      v-else-if="variant === 'stacked'"
      class="flex flex-col items-center"
      :style="{ gap: px(s * 0.32) }"
    >
      <MgLogoMark :size="s" tone="inherit" :on-dark="dark" />
      <span class="flex flex-col items-center" :style="{ gap: px(w * 0.45) }">
        <span :style="nameStyle(w, 'center')">{{ name }}</span>
        <span v-if="subtitle" :style="subStyle(Math.round(w * 0.6), 'center')">{{ subtitle }}</span>
      </span>
    </span>

    <!-- h／compact：符號在左、名稱在右。間距 = 符號寬度 × 0.4 -->
    <span v-else class="flex items-center" :style="{ gap: px(s * 0.4) }">
      <MgLogoMark :size="s" tone="inherit" :on-dark="dark" />
      <span v-if="withSub" class="flex flex-col" :style="{ gap: px(w * 0.39) }">
        <span :style="nameStyle(w, 'left')">{{ name }}</span>
        <span :style="subStyle(Math.round(w * 0.55), 'left')">{{ subtitle }}</span>
      </span>
      <span v-else :style="nameStyle(w, 'left')">{{ name }}</span>
    </span>
  </component>
</template>
