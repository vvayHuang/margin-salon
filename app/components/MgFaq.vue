<script setup lang="ts">
/**
 * content/FAQ — F-09 折疊問答。
 * 用原生 <details>／<summary>：鍵盤可操作、沒有 JS 也能展開，
 * 而且不需要自己管 aria-expanded。
 *
 * 設計系統規則：radius 0、無陰影、hover 只降不透明度。
 * 開合指示用稿子既有的 unicode（＋／－），不引入圖示系統。
 */
defineProps<{ items: { q: string; a: string }[] }>()
</script>

<template>
  <div class="flex flex-col">
    <details v-for="item in items" :key="item.q" class="mg-faq border-t border-line-2 last:border-b">
      <summary
        class="flex cursor-pointer list-none items-baseline gap-6 py-5 transition-opacity duration-200 hover:opacity-60"
      >
        <span class="mg-faq__mark flex-none font-mono text-13 text-fg-3" aria-hidden="true">＋</span>
        <span class="text-16 leading-body-tight">{{ item.q }}</span>
      </summary>
      <p class="max-w-[640px] pb-6 pl-11 text-15 leading-body text-fg-2 text-pretty">{{ item.a }}</p>
    </details>
  </div>
</template>

<style scoped>
/* Safari 仍會畫出預設的三角形，這兩條把它關掉 */
.mg-faq summary::-webkit-details-marker {
  display: none;
}
.mg-faq summary::marker {
  content: '';
}
.mg-faq[open] .mg-faq__mark {
  /* 展開時換成減號，不換色 */
  visibility: hidden;
  position: relative;
}
.mg-faq[open] .mg-faq__mark::after {
  content: '－';
  visibility: visible;
  position: absolute;
  inset: 0;
}
</style>
