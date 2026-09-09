<script setup lang="ts">
/**
 * brand/LogoMark — 裁切標記，這就是標誌本身（標誌使用規範 v1.0）。
 * 它是幾何、不是圖檔：八根線全部從方形邊長 S 推出來，沒有一個值可以單獨調。
 *
 *   裁切線位置 inset  0.30 S
 *   手臂長度   arm    0.20 S
 *   線寬       stroke 0.04 S（不低於 1px）
 *   角點間隙          由上面三個推出來，不另外給
 *
 * 角落是空的，這是刻意的：邊界靠缺席定義。每個角兩根線、錯開、永不相接——
 * 只有最小級距例外，那裡「錯開」已經看不出來，可讀性大於一致性。
 *
 * 三個級距：32↑ 四角照比例；20–32 四角、手臂 0.19 S；20↓ 只留左上角、兩臂接起來。
 *
 * 像素對齊。規範給的是比例，瀏覽器畫的是像素：0.04 × 40 = 1.6px 的線在 dpr 2 上是
 * 3.1875 個實體像素，而瀏覽器畫背景方塊時會把邊緣搶到整數實體像素，於是同一顆標記裡
 * 有的線被搶成 3px、有的 4px——實測到的就是這個，八根線不等粗。所以線寬與位移一律先
 * 進位成整數 CSS px：整數寬度不管落在哪個小數位置，四捨五入後都是同一個實體像素數，
 * 這是「等粗」唯一靠得住的作法。代價是線寬下限釘在 2px（與 micro 級距同粗），
 * 32–50 之間會比 0.04 S 略粗一點。
 */

const MARK_RATIO = { inset: 0.3, arm: 0.2, stroke: 0.04 }

const TONE = {
  heading: 'var(--text-heading)',
  muted: 'var(--text-muted)',
  inverse: 'var(--text-inverse)',
  accent: 'var(--text-accent)',
  hairline: 'var(--border-hairline)',
  inherit: 'currentColor',
}

const props = withDefaults(
  defineProps<{
    size?: number
    tone?: keyof typeof TONE
    onDark?: boolean
    clearSpace?: boolean
    /** 框式：標記就是容器的邊，裁切線落在 inset 0，兩個尺寸用給的、不推導 */
    fill?: boolean
    arm?: number
    stroke?: number
  }>(),
  { size: 40, tone: 'heading', onDark: false, clearSpace: false, fill: false },
)

const px = (n: number) => `${n}px`

const geom = computed(() => {
  const { size, fill, onDark } = props
  const tier = fill ? 'full' : size < 20 ? 'micro' : size < 32 ? 'small' : 'full'

  // 反白在深底上，線看起來會比較細，+0.005 S 補回來
  const rawStroke = props.stroke ?? (
    fill
      ? 1.2
      : tier === 'full'
        ? Math.max(2, size * (MARK_RATIO.stroke + (onDark ? 0.005 : 0)))
        : 2
  )
  const rawArm = props.arm ?? (
    fill
      ? 22
      : size * (tier === 'micro' ? 0.44 : tier === 'small' ? 0.19 : MARK_RATIO.arm)
  )

  // 進位成整數 CSS px（見上方「像素對齊」）
  const stroke = Math.max(1, Math.round(rawStroke))
  const arm = Math.max(1, Math.round(rawArm))
  // micro 的裁切線位置就是線寬的一半，讓兩根手臂在角上接起來
  const inset = fill ? 0 : tier === 'micro' ? stroke / 2 : size * MARK_RATIO.inset

  return { tier, arm, stroke, off: Math.round(inset - stroke / 2) }
})

const bars = computed<Record<string, string>[]>(() => {
  const { tier, arm, stroke, off } = geom.value
  const base = { position: 'absolute', background: TONE[props.tone] ?? TONE.heading }
  const h = { width: px(arm), height: px(stroke) }
  const v = { width: px(stroke), height: px(arm) }

  const list: Record<string, string>[] = [
    { ...base, ...h, left: '0', top: px(off) },
    { ...base, ...v, top: '0', left: px(off) },
  ]
  if (tier !== 'micro') {
    list.push(
      { ...base, ...h, right: '0', top: px(off) },
      { ...base, ...v, top: '0', right: px(off) },
      { ...base, ...h, left: '0', bottom: px(off) },
      { ...base, ...v, bottom: '0', left: px(off) },
      { ...base, ...h, right: '0', bottom: px(off) },
      { ...base, ...v, bottom: '0', right: px(off) },
    )
  }
  return list
})

const boxStyle = computed<Record<string, string>>(() => {
  const fill: Record<string, string> = { position: 'absolute', inset: '0' }
  const box: Record<string, string> = {
    position: 'relative',
    display: 'inline-block',
    flex: '0 0 auto',
    width: px(props.size),
    height: px(props.size),
    verticalAlign: 'middle',
  }
  return props.fill ? fill : box
})
</script>

<template>
  <!-- 淨空 = 手臂長度 × 2，四邊都留，什麼都不准進來 -->
  <span v-if="clearSpace && !fill" class="inline-block" :style="{ padding: `${geom.arm * 2}px` }">
    <span aria-hidden="true" :style="boxStyle">
      <span v-for="(bar, i) in bars" :key="i" :style="bar" />
    </span>
  </span>
  <span v-else aria-hidden="true" :style="boxStyle">
    <span v-for="(bar, i) in bars" :key="i" :style="bar" />
  </span>
</template>
