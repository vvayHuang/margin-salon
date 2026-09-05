<script setup lang="ts">
import { BRAND } from '#shared/margin'

/**
 * navigation/StickyBook — F-02（P0）手機常駐預約列。
 *
 * D-09 取消了 Header 的預約按鈕，這是手機上唯一的常駐預約入口，
 * 也是 D-09 風險對策裡寫好要補的那一項。
 *
 * 兩處與文案 §5 不同，都是為了不跟設計系統打架：
 *
 * 1. 文案寫「主鍵強調色」，但設計系統的 primary 按鈕是實心黑（--surface-solid）。
 *    強調色 #C8351C 在站上是**狀態色**：當前頁底線、錯誤、已選但接不下的日期、
 *    需要漂髮。拿來當行動按鈕會讓那個訊號失效，所以主鍵沿用既有的 primary。
 * 2. 捲到頁底收尾帶時整條滑走 —— 那裡已經有一顆一模一樣的預約按鈕，
 *    兩個同時出現只是重複，也違反 §1.4 原則 1「一屏一件事」。
 */
const route = useRoute()
const visible = ref(true)

/** 目前在畫面內的收尾帶。IntersectionObserver 的 callback 只給「有變動」的項目，
 *  所以要自己記狀態，不能直接看 entries。 */
const onScreen = new Set<Element>()
let observer: IntersectionObserver | null = null

function attach() {
  observer?.disconnect()
  onScreen.clear()
  visible.value = true

  const bands = document.querySelectorAll('[data-mg-cta]')
  if (!bands.length) {
    // 沒有收尾帶的頁（設計師頁、作品單頁）就一直顯示
    observer = null
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target)
        else onScreen.delete(e.target)
      }
      visible.value = onScreen.size === 0
    },
    { threshold: 0 },
  )
  bands.forEach(b => observer!.observe(b))
}

onMounted(attach)
// 換頁之後收尾帶是新的節點，要重新觀察
watch(() => route.path, () => nextTick(attach))
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    class="fixed inset-x-0 bottom-0 z-40 border-t border-line-2 bg-surface-0 transition-transform duration-300 md:hidden"
    :class="visible ? 'translate-y-0' : 'translate-y-full'"
    :inert="!visible || undefined"
  >
    <!-- 下緣留 iPhone home indicator 的安全距離；點擊區 56px，高於 44px 下限 -->
    <div
      class="flex items-center gap-4 px-4 pt-3"
      style="padding-bottom: max(12px, env(safe-area-inset-bottom))"
    >
      <MgButton to="/booking" class="flex-1">線上預約</MgButton>
      <MgButton variant="link" :href="BRAND.phoneHref">{{ BRAND.phone }}</MgButton>
    </div>
  </div>
</template>
